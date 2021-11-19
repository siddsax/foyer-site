import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import firebase from "firebase";
import "./header.css";
import logo from "../../assets/images/logo.png";
import home from "../../assets/icons/home.png";
import back from "../../assets/icons/back.png";
import Icon from "@mui/material/Icon";
import { Link, useHistory } from "react-router-dom";
import { DropdownMenu, MenuItem } from "react-bootstrap-dropdown-menu";
import Dropdown from "react-bootstrap/Dropdown";
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import { useAuthState } from "react-firebase-hooks/auth";
import PopupSearch from "../Search/PopupSearch";
import SearchListItem from "../Search/SearchListItem";

const Header = (props) => {
  // const {notePage} = props
  const [user, loading, error] = useAuthState(firebase.auth());
  const history = useHistory();
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

  const goBack = () => {
    console.log(document.referrer, "========");
    if (document.referrer) {
      const site = document.referrer.split("/")[2];
      console.log(site, document.referrer.split("/"));
      if (site === "my.foyer.work" || site === "localhost") {
        history.goBack();
        setTimeout(() => {
          if (window.location.href.split("/").at(-1).split("-")[0] === "note") {
            console.log("Refreshed!!!");
            setTimeout(() => window.location.reload(), 10);
          }
        });
      }
    }
    history.push("/");
  };

  const trigger = (
    <input type="text" placeholder="Search" className="searchBox" />
  );
  return (
    <>
      {user.photoURL ? (
        <div className="header">
          <div className="headerInner">
            <Link to="/">
              <img src={logo} className="logo" />
            </Link>

            <button onClick={goBack} className="back">
              <img src={back} />
            </button>
            <button
              onClick={() => window.open("https://my.foyer.work", "_blank")}
              className="home"
            >
              <img src={home} />
            </button>

            <div className="searchBar">
              <div className="searchBarInner">
                <PopupSearch
                  user={user}
                  trigger={trigger}
                  ListItem={SearchListItem}
                />
              </div>
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
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
