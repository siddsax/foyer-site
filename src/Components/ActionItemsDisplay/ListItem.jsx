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
          "background-color": "#fff7e8",

          "margin-bottom": "5px",
          "border-radius": "10px",
          "border-color": "black",
          "border-style": "solid",
          height: "45px",
          width: "100%",
          "align-items": "center",
          "font-family":
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          "align-content": "center",
          "align-items": "center",
          "justify-content": `${justifyContent}`,
          "border-width": "1px",
          display: "flex",
        }}
      >
        {tooltip ? (
          <>
            <Checkbox
              checked={actionItem.data.status}
              onChange={() => handleChange({ actionItem: actionItem })}
              inputProps={{ "aria-label": "controlled" }}
            />
            <div className="actionListAssignees">
              {actionItem.data.assignees.map((assignee, i) => (
                <>
                  <Tooltip
                    placement="top"
                    title={assignee}
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <div className="memberCircle">
                      {assignee.substring(0, 2)}
                    </div>
                  </Tooltip>
                </>
              ))}
            </div>
          </>
        ) : (
          <></>
          // <div style={{ "margin-right": "20px" }}></div>
        )}

        <div
          style={{
            "font-weight": "350",
            "margin-right": "4px",
            "font-size": "15px",
          }}
        >
          {actionItem.data.title}
        </div>
        <div
          style={{
            "font-weight": "350",
            "font-size": "15px",
          }}
        >
          {actionItem.data.date.seconds
            ? `by ${moment(actionItem.data.date.seconds * 1000).calendar()}`
            : `by ${moment(actionItem.data.date).calendar()}`}
        </div>
      </div>
    </div>
  );
};
