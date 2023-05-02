// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';
import { doc, setDoc, addDoc, query, where} from "firebase/firestore"; 
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from "./private/firebase.tsx"
import { Clothing} from "./Clothing";

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
const analytics = getAnalytics(firebaseApp);
const provider = new GoogleAuthProvider();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export const signInWithGoogle = () => {signInWithPopup(auth, provider)
   //signInWithPopup(auth, new GoogleAuthProvider())
   .then((result) => {
     // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    const name = user.displayName;
    const email = user.email;


    // Save user data to Firestore
    const userCollectionRef = collection(db, "users");
    const userData = {
      name: name,
      email: email,
      wardrobe: [new Clothing("blue", "cotton", "shirt", "casual")],
    };

    localStorage.setItem("name", userData.name);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("wardrobe", userData.wardrobe); 
    console.log(userData.wardrobe); 
    createWardrobeDB(userData.name, userData.email, userData.wardrobe);

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
    console.log("signed out")
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
    console.log(error)
  });
}


/* Class to represent our database */
export class WardrobeDB {
  constructor(name, email, wardrobe = []) {
    //! to add wardrobe component
    this.name = name;
    this.email = email;
    this.wardrobe = wardrobe;
  }
  toString() {
    return this.name + ", " + this.email;
  }
}

const wardrobeConverter = {
  toFirestore: (wardrobeDB) => {
        console.log(wardrobeDB.wardrobe);
    const data = {
      name: wardrobeDB.name,
      email: wardrobeDB.email,
      wardrobe: wardrobeDB.wardrobe
        ? wardrobeDB.wardrobe.map((clothing) => clothing.toJSON())
        : null,
    };
    // Remove any undefined values from the data object
    return data;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    const wardrobe = data.wardrobe.map((clothing) => {
      return new Clothing(
        clothing.type,
        clothing.tag,
        clothing.size,
        clothing.color
      );
    });
    console.log(wardrobe)
    return new WardrobeDB(data.name, data.email, wardrobe);
  },
};

/* Create a wardrobe database storage in firebase */
export async function createWardrobeDB(name, email, wardrobe = []) {
  console.log(wardrobe); 
  const wardrobeCollectionRef = collection(db, "wardrobeDB").withConverter(
    wardrobeConverter
  );

  const querySnapshot = await getDocs(
    query(wardrobeCollectionRef, where("email", "==", email))
  );

  /* If user does not exist then add it to the database, otherwise do not */
  if (querySnapshot.empty) {
    await addDoc(
      wardrobeCollectionRef,
      new WardrobeDB(name, email, wardrobe)
    );
    console.log("Data saved to Firestore:", name, email);
  } else {
    console.log(querySnapshot)
    console.log("User already exists in Firestore:", email);
  }
  readFromDB("wardrobeDB", "email", email); 
}

/* Generalized function reads from database and calls a function on the results */
//? Can add a callback function as an argument to be exectued passing in the results into the callback
export async function readFromDB(collectionName, field, value) {
  const collectionRef = collection(db, collectionName);

  const querySnapshot = await getDocs(
    query(collectionRef, where(field, "==", value))
  );

  if (!querySnapshot.empty) {
    const results = querySnapshot.docs.map(doc => doc.data());
    console.log(`Data retrieved from Firestore (${collectionName}):`, results);
  } else {
    console.log(`No data found in Firestore (${collectionName}) for ${field} = ${value}`);
  }
}
