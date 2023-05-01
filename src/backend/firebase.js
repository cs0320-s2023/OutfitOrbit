// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';
import { doc, setDoc, addDoc, query, where} from "firebase/firestore"; 
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from "./private/firebase.tsx"

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
    };

    localStorage.setItem("name", userData.name);
    localStorage.setItem("email", userData.email);
    createWardrobeDB(userData.name, userData.email);

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
  constructor (name, email) { //! to add wardrobe component
      this.name = name;
      this.email = email;
  }
  toString() {
      return this.name + ', ' + this.email;
  }
}

const wardrobeConverter = {
  toFirestore: (wardrobeDB) => {
      return {
          name: wardrobeDB.name,
          email: wardrobeDB.email,
          };
  },
  fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new WardrobeDB(data.name, data.email);
  }
};

export async function createWardrobeDB(name, email) {
  const wardrobeCollectionRef = collection(db, "wardrobeDB").withConverter(
    wardrobeConverter
  );

  const querySnapshot = await getDocs(
    query(wardrobeCollectionRef, where("email", "==", email))
  );

  if (querySnapshot.empty) {
    await addDoc(wardrobeCollectionRef, new WardrobeDB(name, email));
    console.log("Data saved to Firestore:", name, email);
  } else {
    console.log("User already exists in Firestore:", email);
  }
}


// export async function createWardrobeDB(name, email) {
//   const wardrobeCollectionRef = collection(db, "wardrobeDB").withConverter(
//     wardrobeConverter
//   );
//   await addDoc(wardrobeCollectionRef, new WardrobeDB(name, email));
//   console.log("Data saved to Firestore:", name, email);
// }

