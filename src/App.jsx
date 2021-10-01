import { useEffect, useState } from "react";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "./firebase";
import NotesListPage from "./Pages/NotesListPage/NotesListPage";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import NotePage from "./Pages/NotePage/NotePage";
import { Box, Button } from "@mui/material";
import GCalendarAPI from "./Components/GCalendarAPI/GCalendarAPI";

function App() {
  const [user, loading, error] = useAuthState(firebase.auth());
  const [loading2, setLoading] = useState(true);
  const [user2, setUser] = useState(null);
  var loading_db = false;

  const { gapi, signOut, signIn } = GCalendarAPI({
    setLoading: setLoading,
    setUser: setUser,
  });

  window.$gapi = gapi;

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
      // listUpcomingEvents(10, setEvents);
    }
  }, [user]);

  // useEffect(() => {
  //   console.log(events);
  // }, [events]);

  if (loading || loading_db) {
    return <div>Loading </div>;
  } else {
    return user ? (
      <Router>
        <Switch>
          <Route exact path="/">
            <NotesListPage user={user} />
          </Route>
          <Route path="/note-*">
            <NotePage user={user} />
          </Route>
        </Switch>
      </Router>
    ) : (
      <div>
        <Button onClick={signIn}>Sign in with Google</Button>
      </div>
    );
    // } else {
    //   return (
    //     <div>
    //       {user ? (
    //         <div>
    //           Signed In, {user.Se}
    //           <Button onClick={signOut}> Sign Out</Button>
    //         </div>
    //       ) : (
    //         <div>
    //           Not Signed In
    //           <Button onClick={signIn}> Sign In</Button>
    //         </div>
    //       )}
    //     </div>
    //   );
  }
}

export default App;
