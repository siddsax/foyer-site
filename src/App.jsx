import { useEffect, useState, useRoute } from "react";
import "./App.css";
import SignIn from "./Components/signin/SignIn";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "./firebase";
import NotesPage from "./Pages/NotesPage/NotesPage";
import NotesListPage from "./Pages/NotesListPage/NotesListPage";
// import firebase from "firebase";
// import "./serverside.jsx";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import NotePage from "./Pages/NotePage/NotePage";
import { getAppBarUtilityClass } from "@mui/material";
import { Box, Button } from "@mui/material";
import ApiCalendar from "react-google-calendar-api";

function App() {
  // var loading_db = false;
  // const [user, loading_auth, error] = useAuthState(firebase.auth());

  // useEffect(async () => {
  //   if (user) {
  //     loading_db = true;
  //     const db = firebase.firestore();
  //     var docRef = db.collection("Users").doc(`${user.uid}`);
  //     docRef
  //       .get()
  //       .then((doc) => {
  //         if (doc.exists) {
  //         } else {
  //           db.collection("Users")
  //             .doc(`${user.uid}`)
  //             .set({
  //               email: user.email,
  //               photoURL: user.photoURL,
  //               Name: user.displayName,
  //             })
  //             .then(() => {
  //               console.log("Document successfully written!");
  //             });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Error getting document:", error);
  //       });

  //     loading_db = false;
  //   }
  //   if (loading_auth) {
  //     loading_db = true;
  //   }
  // }, [user]);
  var gapi = window.gapi;
  var CLIENT_ID =
    "780614249083-ep3ui53ihi9gnj9jbohml4bai7qfdka6.apps.googleusercontent.com";
  var API_KEY = "AIzaSyBarNMFYvA5ChtKvyQCWmmjLweGqRfEauE";

  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  const listEvents = () => {
    console.log(ApiCalendar.getBasicUserProfile());
    console.log(ApiCalendar);
    if (ApiCalendar.sign)
      ApiCalendar.listUpcomingEvents(10).then(({ result }: any) => {
        console.log(result.items);
      });
  };

  if (loading_auth || loading_db) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
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
      <SignIn />
    );
  }
}

export default App;

// var gapi = window.gapi;
// var CLIENT_ID =
//   "780614249083-ep3ui53ihi9gnj9jbohml4bai7qfdka6.apps.googleusercontent.com";
// var API_KEY = "AIzaSyBarNMFYvA5ChtKvyQCWmmjLweGqRfEauE";
