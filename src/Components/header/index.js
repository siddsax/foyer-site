import React from "react";
import { Box, Button } from "@mui/material";
import firebase from "firebase";
import "./header.css";
import logo from "../../assets/images/logo.png";

const Header = (props) => {
  const signOutCall = async () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed Out");
      })
      .catch(async (error) => {
        console.log("Error");
      });
  };
  return (
    <Box className="header">
      <img src={logo} className="logo" />
      <Box className="signOut">
        <Button variant="contained" onClick={signOutCall}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
