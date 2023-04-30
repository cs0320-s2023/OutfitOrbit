// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { doc, setDoc } from "firebase/firestore"; 
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
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    const name = user.displayName;
    const email = user.email;
    
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);

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
  const ref = doc(db, "wardrobeDB", "wardrobe-db-test").withConverter(wardrobeConverter);
  await setDoc(ref, new WardrobeDB(name, email));
}

class Item {
  constructor(name, color, season) {
    this.name = name;
    this.color = color;
    this.season = season;
  }
}

class Wardrobe {
  constructor(clothes) {
    this.clothes = clothes;
  }

  addItem(item) {
    this.clothes.push(item);
  }

  removeItem(item) {
    const index = this.clothes.indexOf(item);
    if (index > -1) {
      this.clothes.splice(index, 1);
    }
  }

  findItemsByColor(color) {
    return this.clothes.filter(item => item.color === color);
  }

  findItemsByName(name) {
    return this.clothes.filter(item => item.color === color);
  }
}
