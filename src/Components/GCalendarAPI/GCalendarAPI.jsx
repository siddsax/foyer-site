import { useEffect, useState } from "react";
import firebase from "../../firebase";

var Config;
var dev = 0;

if (dev) {
  Config = require("../../apiGoogleconfigDev.json");
} else {
  Config = require("../../apiGoogleconfig.json");
}

export default function GCalendarAPI(props) {
  // var { setLoading, setUser } = props;
  var gapi = window.gapi;

  const handleClientLoad = () => {
    const script = document.createElement("script");
    console.log(script);
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);
    script.onload = () => {
      window["gapi"].load("client:auth2", initClient);
    };
  };

  const initUser = async () => {
    const auth2 = gapi.auth2.getAuthInstance();
    const currentUser = auth2.currentUser.get();
    const authResponse = currentUser.getAuthResponse(true);
    const credentials = firebase.auth.GoogleAuthProvider.credential(
      authResponse.id_token,
      authResponse.access_token
    );
    firebase.auth().signInWithCredential(credentials);

    // await setUser(currentUser.getBasicProfile());
    // setLoading(false);
  };

  const initClient = () => {
    gapi.client
      .init(Config)
      .then(initUser)
      .catch((e) => {
        console.log(e);
      });
  };

  const signIn = async () => {
    // setLoading(true);
    gapi.auth2.getAuthInstance().signIn().then(initUser);
  };

  const signOut = async () => {
    // await setLoading(true);
    // await setUser(null);
    gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(() => {
        // setLoading(false);
        firebase.auth().signOut();
      });
  };

  useEffect(() => {
    handleClientLoad();
  }, []);

  return { gapi, signOut, signIn };
}
