import { useEffect, useRef } from "react";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "./firebase";
import NotesListPage from "./Pages/NotesListPage/NotesListPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotePage from "./Pages/NotePage/NotePage";
import GCalendarAPI from "./Components/GCalendarAPI/GCalendarAPI";
import WelcomePage from "./Pages/WelcomePage/WelcomePage";
import HomePage from "./Pages/HomePage/HomePage";

function App() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const loading_db = useRef(false);

  const { gapi, signOut, signIn } = GCalendarAPI();

  window.$gapi = gapi;

  useEffect(() => {
    const checkUserDB = async () => {
      if (user) {
        loading_db.current = true;
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

        loading_db.current = false;
      }
    };
    checkUserDB();
  }, [user]);

  if (loading || loading_db.current) {
    return <div> </div>;
  } else {
    return user ? (
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage user={user} />
          </Route>
          <Route path="/note-*">
            <NotePage user={user} fromMeeting={false} />
          </Route>
          <Route path="/meetid-*">
            <NotePage user={user} fromMeeting={true} />
          </Route>
        </Switch>
      </Router>
    ) : (
      <WelcomePage signIn={signIn} />
    );
  }
}

export default App;
