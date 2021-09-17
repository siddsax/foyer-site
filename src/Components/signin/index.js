import React from "react";
import { Button } from "@mui/material";
import firebase from "firebase";

const SignIn = (props) => {
  const { stmp } = props;
  const signInWithGoogle = async () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithRedirect(provider)
      .then(async (result) => {
        console.log("*******");
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = result.credential;
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        console.log(token, user, "+++++++++");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    </div>
  );
};
export default SignIn;
