import { EmailItem } from "../ActionItemsDisplay/EMailItem";
import alarmClock from "../../assets/icons/alarmClock.png";
import linkedin from "../../assets/icons/linkedin.png";
import twitter from "../../assets/icons/twitter.png";

const EmailTemplate = (props) => {
  const { name, actionItem, firstMessageText } = props;
  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100%",
          "background-color": "#f1f2f5",
          // display: "flex",
          "text-align": "center",
          "align-items": "center",
          "justify-content": "center",
          "align-content": "center",
          "flex-direction": "column",
        }}
      >
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
        <div style={{ "margin-right": "20%", "margin-left": "20%" }}>
          <EmailItem actionItem={actionItem} />
        </div>
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
          <p
            style={{
              "font-weight": "350",
              "text-align": "center",
              width: "100%",
              color: "black",
            }}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/foyer-ba835.appspot.com/o/alarmClock.png?alt=media&token=cf416023-d2d4-456c-9f33-1bc1c264fc33"
              style={{ height: "20px" }}
            />
            Add a Reminder or Task
            {/* <div style={{ "margin-left": "10px" }}>Add a Reminder or Task</div> */}
          </p>
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
            style={{ "margin-right": "52px" }}
          >
            <img src="https://firebasestorage.googleapis.com/v0/b/foyer-ba835.appspot.com/o/linkedin.png?alt=media&token=b490655e-4416-459b-a03b-0b11f9a78b15" />
          </a>
          <a
            href="https://twitter.com/FoyerWork"
            style={{ "margin-top": "3px" }}
          >
            <img src="https://firebasestorage.googleapis.com/v0/b/foyer-ba835.appspot.com/o/twitter.png?alt=media&token=53916cf7-1a69-4ff6-8aac-148bfd0faa91" />
          </a>
        </div>
      </div>
    </>
  );
};

export default EmailTemplate;
