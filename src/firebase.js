import firebase from "firebase";
import { firebaseConfig } from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);

firebase
  .firestore()
  .enablePersistence()
  .catch((err) => {
    if (err.code === "failed-precondition") {
    } else if (err.code === "unimplemented") {
    }
  });

export default firebase;
