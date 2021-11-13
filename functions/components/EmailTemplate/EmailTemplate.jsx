import "./EmailTemplate.css";
import "../../Components/ActionItemsDisplay/ActionItemsDisplay";
import alarmClock from "./assets/alarmClock.png";
import linkedin from "./assets/linkedin.png";
import twitter from "./assets/twitter.png";

const EmailTemplate = (props) => {
  const { name } = props;
  return (
    <div className="containerTemplate">
      <div className="titleText">Hi {name}</div>
      <div className="titleText">You have a reminder due soon</div>
      <div style={{ "margin-bottom": "30px" }}></div>
      <div className="subText">Following Items are due</div>
      {/* <ActionItemsDisplay
          noteId={activeNote.id}
          user={user}
          rerenderActionItems={rerenderActionItems}
        /> */}
      <hr className="divider" />
      <a className="actionItemButtonNotePage" href="https://my.foyer.work">
        <img src={alarmClock} />

        <div style={{ "margin-left": "10px" }}>Add a Reminder or Task</div>
      </a>
      <div className="subSubText">
        Get the most of Foyer by installing the{" "}
        <a href="https://chrome.google.com/webstore/detail/foyer/ongjimeejfllhnobabphafeknbikfhfp">
          chrome extension
        </a>
        .
      </div>
      <div className="subSubText">
        Or access Foyer via <a href="https://my.foyer.work/">my.foyer.work</a>
      </div>
      <div className="socials">
        <a
          href="https://www.linkedin.com/company/foyer-work/"
          style={{ "margin-right": "20px" }}
        >
          <img src={linkedin} />
        </a>
        <a href="https://twitter.com/FoyerWork" style={{ "margin-top": "3px" }}>
          <img src={twitter} />
        </a>
      </div>
    </div>
  );
};

// export default EmailTemplate;
exports.EmailTemplate;
