import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import "./ActionItemsDisplay.css";
import moment from "moment";
import firebase from "../../firebase";
import { width } from "@material-ui/system";

export const ListItem = (props) => {
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
          "background-color": "white",

          "margin-bottom": "5px",
          "border-radius": "10px",
          height: "45px",
          width: "100%",
          "align-items": "center",
          "align-content": "center",
          "align-items": "center",
          "justify-content": `${justifyContent}`,
          display: "flex",
          "box-shadow": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          "font-weight": "300",
        }}
      >
        <Checkbox
          checked={actionItem.data.status}
          onChange={() => handleChange({ actionItem: actionItem })}
          inputProps={{ "aria-label": "controlled" }}
          sx={{
            color: getComputedStyle(document.documentElement).getPropertyValue(
              "--fourth-object-color"
            ),
            "&.Mui-checked": {
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue("--fourth-object-color"),
            },
          }}
        />

        <div
          style={{
            "margin-right": "4px",
            "font-size": "15px",
          }}
        >
          {actionItem.data.title}
        </div>
        <div
          style={{
            "font-size": "15px",
            "min-width": "110px",
          }}
        >
          {actionItem.data.date.seconds
            ? `by ${moment(actionItem.data.date.seconds * 1000).calendar()}`
            : `by ${moment(actionItem.data.date).calendar()}`}
        </div>
        <div className="actionListAssignees">
          {actionItem.data.assignees.map((assignee, i) => (
            <>
              <Tooltip
                placement="top"
                title={assignee}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <div className="memberCircle">{assignee.substring(0, 2)}</div>
              </Tooltip>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
