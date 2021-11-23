import { Button } from "@mui/material";
import "./WelcomePage.css";
import logo from "../../assets/images/logo.png";
import googleSignIn from "../../assets/icons/googleSignIn.png";
const WelcomePage = (props) => {
  const { signIn } = props;
  return (
    <div className="welcomePage">
      <div className="welcomePageBackground"></div>
      {/* <div className="leftHalf"></div>
      <div className="rightHalf"></div> */}
      <div className="signInBoxArea">
        <div className="signInBox">
          <div className="signInTitleArea">
            <div className="signInTitleBox">
              <div className="signInTitle">Sign in to Foyer </div>
            </div>
          </div>
          <div className="subHeadingArea">
            <div className="subHeadingTitleBox">
              <div className="subHeading">Get more out of your meetings.</div>
            </div>
          </div>
          <div className="signInButton">
            <button onClick={signIn}>
              <img src={googleSignIn} />
            </button>
            {/* <Button onClick={signIn} variant="contained">
              Sign in with Google
            </Button> */}
          </div>
        </div>
      </div>
      <div className="footer">
        Powered by <a href="https://icons8.com/">Icon8</a>
      </div>
    </div>
  );
};

export default WelcomePage;
{
}
