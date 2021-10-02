import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import firebase from "firebase";
import "./header.css";
import logo from "../../assets/images/logo.png";
import Icon from "@mui/material/Icon";
import { Link } from "react-router-dom";
import { DropdownMenu, MenuItem } from "react-bootstrap-dropdown-menu";
import Dropdown from "react-bootstrap/Dropdown";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import { useAuthState } from "react-firebase-hooks/auth";

const Header = (props) => {
  const [user, loading, error] = useAuthState(firebase.auth());
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);

  const signOutCall = async () => {
    window.$gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(() => {
        firebase.auth().signOut();
      });
  };

  return (
    <div className="header">
      <Link to="/">
        <img src={logo} className="logo" />
      </Link>
      <div className="searchBar">
        <Icon name="search" color="darkgrey" />
        <input type="text" placeholder="Search" className="searchBox" />
      </div>
      <div className="signOut">
        <div className="container">
          <div className="menu-container">
            <button onClick={onClick} className="menu-trigger">
              <img
                src={user.photoURL}
                alt="User avatar"
                className="profilePic"
              />
            </button>
            <nav
              ref={dropdownRef}
              className={`menu ${isActive ? "active" : "inactive"}`}
            >
              <ul>
                <li>
                  <a href="#" onClick={signOutCall}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* <Button
          variant="contained"
          onClick={signOutCall}
          style={{ backgroundColor: "#282828", color: "grey" }}
        >
          <text className="signOutText"> Sign Out</text>
        </Button> */}
    </div>
  );
};

export default Header;
