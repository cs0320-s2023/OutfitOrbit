// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';
import { doc, setDoc, addDoc, query, where, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore"; 
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from "./private/firebase.tsx"
import { Clothing } from "./Clothing";;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

let userName;
let userEmail;

export const signInWithGoogle = () => {signInWithPopup(auth, provider)
   //signInWithPopup(auth, new GoogleAuthProvider())
   .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    const userName = user.displayName;
    const userEmail = user.email;

    createWardrobeDB(userName, userEmail, 
      [new Clothing("sample cloth", "shirt", "color", "cotton", "casual", "zara"),
    new Clothing("sample cloth 2", "shirt", "color", "cotton", "casual", "zara")]);

    localStorage.setItem("name", userName);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("wardrobe", JSON.stringify([new Clothing("sample cloth", "shirt", "color", "cotton", "casual", "zara"),
    new Clothing("sample cloth 2", "shirt", "color", "cotton", "casual", "zara")]));

  }).catch((error) => {
    console.log(error)
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
};

export const signOutGoogle = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
    console.log(error)
  });
}

/* Class to represent our database */
export class WardrobeDB {
  constructor(name, email, wardrobe = []) {
    this.name = name || '';
    this.email = email || '';
    this.wardrobe = wardrobe || [];
  }
  toString() {
    return this.name + ", " + this.email;
  }
}

const wardrobeConverter = {
  toFirestore: (wardrobeDB) => {
    const data = {
      name: wardrobeDB.name,
      email: wardrobeDB.email,
      wardrobe: wardrobeDB.wardrobe
        ? wardrobeDB.wardrobe.map((clothing) => {
    
            if (!(clothing instanceof Clothing)) {
              // Manually create a new Clothing object with the correct properties
              const convertedClothing = new Clothing(
                  clothing.name,
                  clothing.type,
                  clothing.color,
                  clothing.material,
                  clothing.occasion,
                  clothing.brand
              );
              clothing = convertedClothing; // overwrite the original object with the new object
            }
            return clothing.toJSON();
          })
        : null,
    };
    // Remove any undefined values from the data object
    return data;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    const wardrobe = data.wardrobe.map((clothing) => {
      return new Clothing(
        clothing.name,
        clothing.type,
        clothing.color,
        clothing.material,
        clothing.occasion,
        clothing.brand,
      );
    });
    return new WardrobeDB(data.name, data.email, wardrobe);
  },
};

/* Create a wardrobe database storage in firebase */
export async function createWardrobeDB(name, email, wardrobe = []) {
  const wardrobeCollectionRef = collection(db, "wardrobeDB").withConverter(
    wardrobeConverter
  );

  const querySnapshot = await getDocs(
    query(wardrobeCollectionRef, where("email", "==", email))
  );
  
  /* If user does not exist then add it to the database, otherwise do not */
  if (querySnapshot.empty && localStorage.getItem("wardrobe").length != 0) {
    console.log("empty wardrobe here wallahi")
    await addDoc(
      wardrobeCollectionRef,
      new WardrobeDB(name, email, wardrobe)
    );
    console.log("Data saved to Firestore:", name, email, wardrobe);
  } else {
    console.log("User already exists:", email);
  }
}

export async function addToWardrobe(item) {
  console.log("WARDROBE ITEM: ");
  console.log(item);
  const currentWardrobe = item.toJSON();

  console.log("TRASNFORMED")
  console.log(currentWardrobe)
  
  // Update the wardrobe in the localStorage
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const wardrobeCollectionRef = collection(db, "wardrobeDB").withConverter(
    wardrobeConverter
  );

  const querySnapshot = await getDocs(
    query(wardrobeCollectionRef, where("email", "==", email))
  );

  if (!querySnapshot.empty) {
    console.log(querySnapshot)
    // If the wardrobe already exists in Firebase, update it with the new item
    const wardrobeDocRef = querySnapshot.docs[0].ref;
    await updateDoc(wardrobeDocRef, {wardrobe: arrayUnion(currentWardrobe)});

  } else {
    createWardrobeDB(name, email, currentWardrobe);
  }
}


/* Generalized function reads from database and calls a function on the results */
export async function readFromDB(collectionName, field, value) {
  const collectionRef = collection(db, collectionName);

  const querySnapshot = await getDocs(
    query(collectionRef, where(field, "==", value))
  );

  if (!querySnapshot.empty) {
    const results = querySnapshot.docs.map(doc => doc.data());
    return results[0].wardrobe; // only one user with email so always 0 value
  } else {
    console.log(`No data found in Firestore (${collectionName}) for ${field} = ${value}`);
    await createWardrobeDB(localStorage.getItem("name"), localStorage.getItem("email"), localStorage.getItem("wardrobe"));
    return readFromDB(collectionName, field, value);
  }
}

  export function wardrobeToString(clothingArray) {
    const clothingObjects = clothingArray.map((item) => item.toJSON());
    return JSON.stringify(clothingObjects);
  }
