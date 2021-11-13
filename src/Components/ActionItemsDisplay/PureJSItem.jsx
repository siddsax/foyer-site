import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import "./ActionItemsDisplay.css";
import moment from "moment";
import firebase from "../../firebase";

export const Item = (props) => {
  const { actionItem, setLoading } = props;
  const db = firebase.firestore();

  const handleChange = async (props) => {
    if (setLoading) await setLoading(true);
    const { actionItem } = props;

    const docRef = db.collection("ActionItems").doc(actionItem.id);
    await docRef.update({
      status: !actionItem.data.status,
    });
    actionItem.data.status = !actionItem.data.status;
    if (setLoading) await setLoading(false);
  };

  return (
    <div>
      <div className="actionListItemArea">
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
                <div className="memberCircle">{assignee.substring(0, 2)}</div>
              </Tooltip>
            </>
          ))}
        </div>
        <div className="actionListItemTitle">{actionItem.data.title}</div>
        <div className="actionListItemDate">
          {`by ${moment(actionItem.data.date.seconds * 1000).calendar()}`}
        </div>
      </div>
    </div>
  );
};
