import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import "./ActionItemsDisplay.css";
import moment from "moment";
import firebase from "../../firebase";
import { width } from "@material-ui/system";

export const EmailItem = (props) => {
  const { actionItem, setLoading, tooltip } = props;
  var widthReminder, justifyContent;
  if (tooltip) {
    widthReminder = "0px";
    justifyContent = "flex-start";
  } else {
    widthReminder = "500px";
    justifyContent = "center";
  }
  const db = firebase.firestore();

  const handleChange = async (props) => {
    if (setLoading) await setLoading(true);
    const { actionItem } = props;

    const docRef = db.collection("ActionItems").doc(actionItem.id);
    await docRef.update({
      status: !actionItem.data.status,
    });
    actionItem.data.status = !actionItem.data.status;
    console.log(actionItem.data.status, "========");
    if (setLoading) await setLoading(false);
  };

  return (
    // <div style={{ "margin-right": "20%", "margin-left": "20%" }}>
    <div>
      <div
        style={{
          "font-weight": "300",
          "background-color": "#fff7e8",

          "margin-bottom": "5px",
          "border-radius": "10px",
          "border-color": "black",
          "border-style": "solid",
          height: "45px",
          width: "100%",
          "align-items": "center",
          "align-content": "center",
          "align-items": "center",
          "justify-content": `${justifyContent}`,
          "border-width": "1px",
          display: "flex",
        }}
      >
        {/* <div style={{ "margin-right": "20px" }}></div> */}

        <p
          style={{
            "font-weight": "350",
            "text-align": "center",
            width: "100%",
            color: "black",
          }}
        >
          {`${actionItem.data.title} `}
          {actionItem.data.date.seconds
            ? `by ${moment(actionItem.data.date.seconds * 1000).calendar()}`
            : `by ${moment(actionItem.data.date).calendar()}`}
        </p>
        <div
          style={{
            "font-weight": "350",
            "font-size": "15px",
          }}
        >
          {/* {actionItem.data.date.seconds
            ? `by ${moment(actionItem.data.date.seconds * 1000).calendar()}`
            : `by ${moment(actionItem.data.date).calendar()}`} */}
        </div>
      </div>
    </div>
  );
};
