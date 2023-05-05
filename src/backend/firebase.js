// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';
import { doc, setDoc, addDoc, query, where, updateDoc} from "firebase/firestore"; 
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from "./private/firebase.tsx"
import { Clothing } from "./Clothing";

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
              console.log('Invalid wardrobe item', clothing.name);
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

              // console.error('Invalid wardrobe item:', clothing.name);
              // throw new Error('Invalid wardrobe item');

              console.log(clothing instanceof Clothing)
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
    //console.log(name, email, wardrobe)
    await addDoc(
      wardrobeCollectionRef,
      new WardrobeDB(name, email, wardrobe)
    );
    console.log("Data saved to Firestore:", name, email, wardrobe);
  } else {
    console.log("User already exists in Firestore, updating wardrobe:", email);
    const docRef = querySnapshot.docs[0].ref;
    console.log("Wardrobe to update:", wardrobe);
    if (wardrobe && wardrobe.length > 0) {
      const wardrobeData = wardrobeConverter.toFirestore({
        name: name,
        email: email,
        wardrobe: wardrobe,
      });
      console.log(wardrobeData === undefined);
      await updateDoc(docRef, wardrobeData); //basically this is saying that wardrobeData is undefined but its not?
      console.log("Wardrobe updated in Firestore:", email, wardrobe);
    } else {
      console.log("Wardrobe is empty or undefined, skipping update to Firestore");
    }
  }
}

export function addToWardrobe(item) { 
  // Get the current wardrobe from localStorage 
  const currentWardrobe = JSON.parse(localStorage.getItem("wardrobe")) || []; 
  
  // Convert each item to a Clothing instance
  const wardrobe = currentWardrobe.map((clothing) => {
    return new Clothing(
      clothing.name,
      clothing.type,
      clothing.color,
      clothing.material,
      clothing.occasion,
      clothing.brand
    );
  });

  // Add the new item to the wardrobe 
  wardrobe.push(item); 
  
  // Update the localStorage with the new wardrobe 
  localStorage.setItem("wardrobe", JSON.stringify(wardrobe)); 
  
  // Update the wardrobe in the database 
  const name = localStorage.getItem("name"); 
  const email = localStorage.getItem("email"); 
  createWardrobeDB(name, email, wardrobe); 
}


// export function addToWardrobe(item) { 
//   // Get the current wardrobe from localStorage 
//   const currentWardrobe = JSON.parse(localStorage.getItem("wardrobe")) || []; 
  
//   console.log('hi hello', currentWardrobe);
//   // Add the new item to the wardrobe 
//   currentWardrobe.push(item); 
  
//   // Update the localStorage with the new wardrobe 
//   localStorage.setItem("wardrobe", JSON.stringify(currentWardrobe)); 
  
//   // Update the wardrobe in the database 
//   const name = localStorage.getItem("name"); 
//   const email = localStorage.getItem("email"); 
//   createWardrobeDB(name, email, currentWardrobe); 
// }

// export async function addToWardrobe(item) {
//   const currentWardrobe = JSON.parse(localStorage.getItem("wardrobe")) || [];

//   // Update the wardrobe in Firebase
//   const name = localStorage.getItem("name");
//   const email = localStorage.getItem("email");

//   const wardrobeRef = db.collection("users").doc(email).collection("wardrobes").doc(name);
//   const wardrobeDoc = await wardrobeRef.get();

//   if (wardrobeDoc.exists) {
//     // If the wardrobe already exists in Firebase, update it with the new item
//     const updatedWardrobe = [...currentWardrobe, item];
//     await wardrobeRef.update({ items: updatedWardrobe });
//   } else {
//     // If the wardrobe does not exist in Firebase, create a new wardrobe document with the current item
//     await wardrobeRef.set({ name: name, items: [item] });
//   }

//   // Update the local storage with the new wardrobe
//   localStorage.setItem("wardrobe", JSON.stringify(currentWardrobe.concat(item)));
// }


/* Generalized function reads from database and calls a function on the results */
export async function readFromDB(collectionName, field, value) {
  const collectionRef = collection(db, collectionName);

  const querySnapshot = await getDocs(
    query(collectionRef, where(field, "==", value))
  );

  console.log(querySnapshot);

  if (!querySnapshot.empty) {
    console.log("NOT EMPTY")
    const results = querySnapshot.docs.map(doc => doc.data());
    console.log(typeof(results[0].wardrobe))
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
