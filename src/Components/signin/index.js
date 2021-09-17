import React from "react";
import { Button } from "@mui/material";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";

const SignIn = (props) => {
  const { stmp } = props;
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    signInWithRedirect(auth, provider)
      .then(async (result) => {
        console.log("*******");
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
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
