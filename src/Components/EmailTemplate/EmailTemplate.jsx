import { ListItem } from "../ActionItemsDisplay/ListItem";
import alarmClock from "../../assets/icons/alarmClock.png";
import linkedin from "../../assets/icons/linkedin.png";
import twitter from "../../assets/icons/twitter.png";

const EmailTemplate = (props) => {
  const { name, actionItem, firstMessageText } = props;
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        "background-color": "#f1f2f5",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "align-content": "center",
        "flex-direction": "column",
      }}
    >
      <link rel="stylesheet" src={"./EmailTemplate.css"} />
      <div
        style={{
          "font-size": "32px",
          "font-weight": "280",
        }}
      >
        Hi! {name}
      </div>
      <div
        style={{
          "font-size": "32px",
          "font-weight": "280",
        }}
      >
        {firstMessageText}
      </div>
      <div style={{ "margin-bottom": "30px" }}></div>
      {/* <div
        style={{
          "font-size": "24px",
          "font-weight": "280",
          "margin-bottom": "30px",
        }}
      >
        Following Items are due
      </div> */}
      <ListItem actionItem={actionItem} />
      <hr
        style={{
          border: "1px solid rgba(0, 0, 0, 0.24)",
          "border-radius": "2px",
          width: "100px",
          "margin-top": "20px",
        }}
      />
      <a
        href="https://my.foyer.work"
        style={{
          "margin-top": "7px",
          "margin-bottom": "20px",
          display: "flex",
          "flex-direction": "row",
          "align-items": "center",
          "justify-content": "center",
          "background-color": "#E5E5E5",
          width: "300px",
          height: "45px",
          "border-radius": "10px",
          color: "black",
          "font-weight": "300",
          "box-shadow": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          transition: "transform 250ms",
          "background-color": "white",
        }}
      >
        <img src={alarmClock} />

        <div style={{ "margin-left": "10px" }}>Add a Reminder or Task</div>
      </a>
      <div
        className="subSubText"
        style={{
          color: "#666666",
        }}
      >
        Get the most of Foyer by installing the{" "}
        <a
          href="https://chrome.google.com/webstore/detail/foyer/ongjimeejfllhnobabphafeknbikfhfp"
          style={{
            "font-weight": "500",
            color: "inherit",
          }}
        >
          chrome extension
        </a>
        .
      </div>
      <div
        className="subSubText"
        style={{
          color: "#666666",
        }}
      >
        Or access Foyer via{" "}
        <a
          href="https://my.foyer.work/"
          style={{
            "font-weight": "500",
            color: "inherit",
          }}
        >
          my.foyer.work
        </a>
      </div>
      <div
        style={{
          "margin-top": "15px",
          "flex-direction": "row",
          "justify-content": "center",
          width: "100px",
          display: "flex",
        }}
      >
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

export default EmailTemplate;
