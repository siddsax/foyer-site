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

const firebaseConfigDev = {
  apiKey: "AIzaSyByg4K4k0MAa3OKF0w6KXx_i4robouunFw",
  authDomain: "foyer-dev.firebaseapp.com",
  projectId: "foyer-dev",
  storageBucket: "foyer-dev.appspot.com",
  messagingSenderId: "125825527013",
  appId: "1:125825527013:web:514889ae719294dff0780c",
  measurementId: "G-8WPXHG7VTR",
};

firebase.initializeApp(firebaseConfigDev);

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
