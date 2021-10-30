import { useState, useEffect, useCallback, useRef } from "react";
import "./ActionItemsDisplay.css";
import firebase from "../../firebase";
import BarLoader from "react-spinners/BarLoader";
import { override } from "../Helpers/GeneralHelpers";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import moment from "moment";
import { getActionItems } from "../../Components/Helpers/BackendHelpers";

const FormattedDate = (props) => {
  const { dateNanSec, timeNanSec } = props;
  var date = new Date(dateNanSec);
  var time = new Date(timeNanSec);

  console.log(dateNanSec, timeNanSec, date, time);
  // var output = `By ${date.getDate()} ${monthArray[date.getMonth()]} at ${moment(
  //   time
  // ).format("h:mm a")}`;

  var dateCombined = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds()
  );
  console.log(dateCombined);
  var output = `By ${moment(dateCombined).calendar()}`;

  return <div className="actionListItemDate">{output}</div>;
};

export default function ActionItemsDisplay(props) {
  const { user, noteId } = props;
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = firebase.firestore();

  const handleChange = (props) => {
    const { actionItem } = props;
    console.log(actionItem.id);
    const docRef = db.collection("ActionItems").doc(actionItem.id);
    docRef.update({
      status: !actionItem.data.status,
    });
  };

  useEffect(() => {
    getActionItems({
      db: db,
      setLoading: setLoading,
      setActionItems: setActionItems,
      noteId: noteId,
    });
  }, []);

  return (
    <div>
      <hr class="separateActionItems"></hr>
      {!loading ? (
        <>
          {actionItems.map((actionItem, i) => (
            <div className="actionListItemArea">
              {/* <Checkbox {...actionItem.status} defaultChecked /> */}
              <Checkbox
                checked={actionItem.data.status}
                onChange={() => handleChange({ actionItem: actionItem })}
                inputProps={{ "aria-label": "controlled" }}
              />
              <div className="actionListItemTitle">{actionItem.data.title}</div>

              <FormattedDate
                dateNanSec={actionItem.data.date.seconds * 1000}
                timeNanSec={actionItem.data.time.seconds * 1000}
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
            </div>
          ))}
        </>
      ) : (
        <>
          <BarLoader
            color={getComputedStyle(document.documentElement).getPropertyValue(
              "--third-object-color"
            )}
            loading={loading}
            css={override}
            size={50}
          />
        </>
      )}
    </div>
  );
}
