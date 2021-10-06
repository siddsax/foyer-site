import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBarNMFYvA5ChtKvyQCWmmjLweGqRfEauE",
  authDomain: "foyer-ba835.firebaseapp.com",
  projectId: "foyer-ba835",
  storageBucket: "foyer-ba835.appspot.com",
  messagingSenderId: "780614249083",
  appId: "1:780614249083:web:566cab2113efe820e610de",
  measurementId: "G-GQV12WQ37B",
};

firebase.initializeApp(firebaseConfig);

firebase
  .firestore()
  .enablePersistence()
  .catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });

export default firebase;
