import { useEffect, useState } from "react";
import { dev } from "../../firebaseConfig";
import firebase from "../../firebase";

var Config;

if (dev) {
  Config = require("../../apiGoogleconfigDev.json");
} else {
  Config = require("../../apiGoogleconfig.json");
}

const GCalendarAPI = (props) => {
  // var { setLoading, setUser } = props;
  var gapi = window.gapi;

  const handleClientLoad = () => {
    const script = document.createElement("script");
    console.log(script);
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);
    script.onload = () => setupGapi();
  };

  const setupGapi = () => {
    window["gapi"].load("client:auth2", {
      callback: () => {
        console.log("Gapi Loaded");
        initClient();
      },
      onerror: () => {
        console.error("gapi error");
        setTimeout(setupGapi, 1000);
      },
      timeout: 1000,
      ontimeout: () => {
        console.error("gapi timeout");
        setupGapi();
      },
    });
  };

  const initUser = async () => {
    const auth2 = gapi.auth2.getAuthInstance();
    const currentUser = auth2.currentUser.get();
    const authResponse = currentUser.getAuthResponse(true);
    if (authResponse) {
      console.log(authResponse.scope, "++++++++++++");
      if (
        authResponse.scope
          .split(" ")
          .indexOf("https://www.googleapis.com/auth/calendar") < 0
      ) {
        console.log("Logging out coz right permissions not there!!!");
        return signOut();
      }
    }
    const credentials = firebase.auth.GoogleAuthProvider.credential(
      authResponse.id_token,
      authResponse.access_token
    );
    firebase.auth().signInWithCredential(credentials);
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
};

const signOut = async () => {
  // await setLoading(true);
  // await setUser(null);
  window.$gapi.auth2
    .getAuthInstance()
    .signOut()
    .then(() => {
      // setLoading(false);
      firebase.auth().signOut();
    });
};

export { signOut, GCalendarAPI };
