import { Button } from "@mui/material";
import "./WelcomePage.css";
import logo from "../../assets/images/logo.png";
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
              <text className="signInTitle">Sign in to Foyer </text>
            </div>
          </div>
          <div className="subHeadingArea">
            <div className="subHeadingTitleBox">
              <text className="subHeading">Get more out of your meetings.</text>
            </div>
          </div>
          <div className="signInButton">
            <Button onClick={signIn} variant="contained">
              Sign in with Google
            </Button>
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
