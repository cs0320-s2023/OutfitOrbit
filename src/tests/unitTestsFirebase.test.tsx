import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, Firestore } from 'firebase/firestore';
import { doc, setDoc, addDoc, query, where} from "firebase/firestore"; 
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from "../backend/private/firebase.js"
import { Clothing } from "../backend/Clothing.js";

describe("Firebase Utils", () => {
  let firebaseApp, auth, db;
  
  beforeAll(() => {
    // initialize Firebase app and services
    const firebaseConfig = {
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
      messagingSenderId: MESSAGING_SENDER_ID,
      appId: APP_ID,
      measurementId: MEASUREMENT_ID,
    };
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
  });

  afterAll(() => {
    // clean up Firebase app and services
    signOut(auth);
  });

  describe("createWardrobeDB", () => {
    test("should add new user to Firestore database if user does not already exist", async () => {
      // create new user data
      const name = "test user";
      const email = "test@test.com";
      const wardrobe = [new Clothing("shirt", "color", "cotton", "casual", "zara")];
      
      // add user to Firestore database
      await createWardrobeDB(name, email, wardrobe); //tentative, how do we create our wardrobes -anastasio
      
      // check that user was added to Firestore database
      const wardrobeCollectionRef = collection(db, "wardrobeDB");git
      const querySnapshot = await getDocs(query(wardrobeCollectionRef, where("email", "==", email)));
      expect(querySnapshot.docs.length).toEqual(1);
      expect(querySnapshot.docs[0].data()).toEqual(new WardrobeDB(name, email, wardrobe));
    });

    test("should not add new user to Firestore database if user already exists", async () => {
      // create existing user data
      const name = "existing user";
      const email = "existing@test.com";
      const wardrobe = [new Clothing("shirt", "color", "cotton", "casual", "zara")];
      const wardrobeDB = new WardrobeDB(name, email, wardrobe);
      const wardrobeCollectionRef = collection(db, "wardrobeDB");
      await setDoc(doc(wardrobeCollectionRef, email), wardrobeDB);

      // try to add existing user to Firestore database
      await createWardrobeDB(name, email, wardrobe);

      // check that existing user was not added to Firestore database again
      const querySnapshot = await getDocs(query(wardrobeCollectionRef, where("email", "==", email)));
      expect(querySnapshot.docs.length).toEqual(1);
      expect(querySnapshot.docs[0].data()).toEqual(wardrobeDB);
    });
  });
});
