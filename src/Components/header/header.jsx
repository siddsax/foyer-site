import React from "react";
import { Box, Button } from "@mui/material";
import firebase from "firebase";
import "./header.css";
import logo from "../../assets/images/logo.png";
import Icon from "@mui/material/Icon";
import { Link } from "react-router-dom";

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
      <Link to="/">
        <img src={logo} className="logo" />
      </Link>
      <div className="searchBar">
        <Icon name="search" color="darkgrey" />
        <input type="text" placeholder="Search" className="searchBox" />
      </div>
      <Box className="signOut">
        <Button
          variant="contained"
          onClick={signOutCall}
          style={{ backgroundColor: "#282828", color: "grey" }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
