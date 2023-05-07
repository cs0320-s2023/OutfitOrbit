
/**
 * This is the firebase class, that handles our manipulaions of the firebase database. We use this class to add new users
 * to the databse, add new clothes to an existing user's wardrobe, delete clothes from their wardrobe, and update the points
 * of any clothing item liked by the user
 */

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';
import { doc, setDoc, addDoc, query, where, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore"; 
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from "./private/firebase.tsx"
import { Clothing } from "./Clothing";

// Our web app's Firebase configuration
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

/*
This method lets users sign into the web app using Google. For every new user signed in we update their doc with the user's
name, email and wardrobe
*/
export const signInWithGoogle = () => {signInWithPopup(auth, provider)
   .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    const userName = user.displayName;
    const userEmail = user.email;

    if (!localStorage.getItem('wardrobe')) {

      //creates a mockk starter wardrobe
      createWardrobeDB(userName, userEmail, 
        [new Clothing("sample cloth", "shirt", "color", "cotton", "casual", "zara"),
      new Clothing("sample cloth 2", "shirt", "color", "cotton", "casual", "zara")]);
      
      //sets the user information in the firebase database
      localStorage.setItem("name", userName);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("wardrobe", JSON.stringify([new Clothing("sample cloth", "shirt", "color", "cotton", "casual", "zara"),
      new Clothing("sample cloth 2", "shirt", "color", "cotton", "casual", "zara")]))
    };

  }).catch((error) => {
    console.log(error)
    // Catches and handles any errors
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
};

/*
This method handles any user signing out of their account 
*/
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
    //intitalises each variable with the values passed in or an empty version of that variable to avoid undefined issues
    this.name = name || '';
    this.email = email || '';
    this.wardrobe = wardrobe || [];
  }
  toString() {
    return this.name + ", " + this.email;
  }
}

const wardrobeConverter = {
  //converts a wardrobeDB object to a firestore friendly object
  toFirestore: (wardrobeDB) => {
    const data = {
      name: wardrobeDB.name,
      email: wardrobeDB.email,
      wardrobe: Array.isArray(wardrobeDB.wardrobe)
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
  //converts an object from the firestore database to a wardrobeDB object
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

/* This method creates a wardrobe database storage in firebase. It is used to either update an existing user by updating the
firestore database docs or create a new user*/
export async function createWardrobeDB(name, email, wardrobe = []) {

  const wardrobeCollectionRef = collection(db, "wardrobeDB").withConverter(
    wardrobeConverter
  );

  //checks to ensure the correct user profile is being updated
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

/*
This fucntion is used to add clothing items to an existing wardrobe. It is called when the Add to Closet form is filled.
*/
export async function addToWardrobe(item) {
  console.log("ITEM TO ADD")
  console.log(item)
  const itemToAdd = item.toJSON();

  console.log("ITEM TO ADD TO JSON");
  console.log(itemToAdd);
  
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
    // If the wardrobe already exists in Firebase, update it with the new item
    const wardrobeDocRef = querySnapshot.docs[0].ref;
    await updateDoc(wardrobeDocRef, {wardrobe: arrayUnion(itemToAdd)});

    // Now update the localStorage
    let localWardrobeCopy = localStorage.getItem('wardrobe');
    let updatedLocalWardrobe = JSON.parse(localWardrobeCopy);
    // Push the item to the array
    updatedLocalWardrobe.push(itemToAdd);
    // Stringify the updated array
    let updatedLocalWardrobeStr = JSON.stringify(updatedLocalWardrobe);
    // update the local wardrobe
    localStorage.setItem('wardrobe', updatedLocalWardrobeStr);
  }
}

/*
This function updates the points associated with certain clothing items in a user's wardrobe, based on whether that 
clothing item has been part of a generated outfit the user has liked. 
*/
export async function updatePoints(item) {
  console.log("updated pts"); 
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  //ensures the correct user profile is being updated
  const wardrobeCollectionRef = collection(db, "wardrobeDB");
  const wardrobeSnapshot = await getDocs(
    query(wardrobeCollectionRef, where("email", "==", email))
  );

  if (wardrobeSnapshot.empty) {
    console.error(`Wardrobe not found for user with email ${email}`);
    return;
  }

  const wardrobeDoc = wardrobeSnapshot.docs[0];
  const wardrobeData = wardrobeDoc.data();
  const wardrobeId = wardrobeDoc.id;
  const items = wardrobeData.items;

  //looks for item in the user's wardrobe
  const matchingIndex = items.findIndex((i) => i.itemName === item.itemName);

  console.log(matchingIndex); 

  //if the item isn't found print error and exit gracefully
  if (matchingIndex === -1) {
    console.error(
      `Item with name ${item.itemName} not found in wardrobe for user with email ${email}`
    );
    return;
  }

  const matchingItem = items[matchingIndex];
  const updatedPoints = matchingItem.points + 1;
  const updatedItem = { ...matchingItem, points: updatedPoints };

  //creates a new wardrobe with each item now reflecting the updated points
  const updatedItems = [
    ...items.slice(0, matchingIndex),
    updatedItem,
    ...items.slice(matchingIndex + 1),
  ];

  //update the docs associated with our user to reflect the new wardrobe with updated points
  await updateDoc(wardrobeCollectionRef.doc(wardrobeId), {
    items: updatedItems,
  });
  console.log(
    `Updated points for item ${item.itemName} in wardrobe for user with email ${email}`
  );
}

/*
This function is used to delete items from a user's wardrobe, both visually on the frontend, and from the database on the
backend if the cross button is interacted with on the frontend
*/
export async function deleteFromWardrobe(itemToRemove) {
  console.log("ITEM TO REMOVE")
  console.log(itemToRemove)

  // first remove the item from the localStorage
  let localWardrobeCopy = localStorage.getItem('wardrobe');
  let updatedLocalWardrobe = JSON.parse(localWardrobeCopy);

  // Find the index of the item to remove
  let itemIndex = updatedLocalWardrobe.findIndex(item => {
    // Compare properties to determine if the items are the same
    return (
      item.name === itemToRemove.name &&
      item.type === itemToRemove.type &&
      item.color === itemToRemove.color &&
      item.material === itemToRemove.material &&
      item.brand === itemToRemove.brand &&
      item.occasion === itemToRemove.occasion
    );
  });

  // If the item is found, remove it from the array
  if (itemIndex !== -1) {
    updatedLocalWardrobe.splice(itemIndex, 1);
  }

  // Stringify the updated array and save it back to localStorage
  let updatedLocalWardrobeStr = JSON.stringify(updatedLocalWardrobe);
  localStorage.setItem('wardrobe', updatedLocalWardrobeStr);

  const email = localStorage.getItem("email");

  const wardrobeCollectionRef = collection(db, "wardrobeDB").withConverter(
    wardrobeConverter
  );

  const querySnapshot = await getDocs(
    query(wardrobeCollectionRef, where("email", "==", email))
  );

  if (!querySnapshot.empty) {
    // If the wardrobe exists in Firebase, delete the item
    const wardrobeDocRef = querySnapshot.docs[0].ref;
    await updateDoc(wardrobeDocRef, { wardrobe:  JSON.parse(updatedLocalWardrobeStr)});
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

/*
This function converts an array of Clothing items (a wardrobe) to a JSON form
*/
  export function wardrobeToString(clothingArray) {
    const clothingObjects = clothingArray.map((item) => item.toJSON());
    return JSON.stringify(clothingObjects);
  }
