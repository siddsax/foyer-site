import React from "react";
import { Box, Button } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import "./header.css";
import logo from "../../assets/images/logo.png";

const Header = (props) => {
  const auth = getAuth();
  const signOutCall = async () => {
    signOut(auth)
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
