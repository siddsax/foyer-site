import { useEffect, useState, useRoute } from "react";
import "./App.css";
import SignIn from "./Components/signin/SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "./firebase";
import NotesPage from "./Pages/NotesPage/NotesPage";
// import firebase from "firebase";
// import "./serverside.jsx";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {
  var loading_db = false;
  const [user, loading_auth, error] = useAuthState(firebase.auth());

  useEffect(async () => {
    if (user) {
      loading_db = true;
      const db = firebase.firestore();
      var docRef = db.collection("Users").doc(`${user.uid}`);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
          } else {
            db.collection("Users")
              .doc(`${user.uid}`)
              .set({
                email: user.email,
                photoURL: user.photoURL,
                Name: user.displayName,
              })
              .then(() => {
                console.log("Document successfully written!");
              });
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });

      loading_db = false;
    }
    if (loading_auth) {
      loading_db = true;
    }
  }, [user]);

  if (loading_auth || loading_db) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  } else {
    return user ? (
      <div>
        <NotesPage user={user} />
      </div>
    ) : (
      <SignIn />
    );
  }
}

export default App;
