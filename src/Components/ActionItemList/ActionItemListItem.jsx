import { useEffect, useState, useRef } from "react";
import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { weekdays, ListItemBarComponent } from "../Helpers/GeneralHelpers";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import firebase from "../../firebase";
import "./ActionItemList.css";

const ActionItemListItem = (props) => {
  const { actionItem } = props;
  const [status, setStatus] = useState(actionItem.status);
  const db = firebase.firestore();

  const changeStatus = async () => {
    var docRef = db.collection("ActionItems").doc(actionItem.id);
    docRef.update({
      status: !status,
    });
    setStatus((preVal) => !preVal);
  };

  var calendarDateAreaClass;
  if (actionItem) {
    if (actionItem.todayStart == 1) {
      calendarDateAreaClass = "calendarDateAreaB";
    } else {
      calendarDateAreaClass = "calendarDateArea";
    }
  }
  console.log("actionItem", actionItem);
  return (
    <div className="NoteItemArea">
      <div class={calendarDateAreaClass}>
        {actionItem.firstOfDay ? (
          <>
            <text className="calendarDay">
              {
                weekdays[
                  new Date(actionItem["data"].date.seconds * 1000).getDay()
                ]
              }
            </text>
            <text className="calendarDate">
              {new Date(actionItem["data"].date.seconds * 1000).getDate()}
            </text>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="NoteArea">
        <div className="Note">
          <Checkbox
            checked={status}
            onChange={changeStatus}
            inputProps={{ "aria-label": "controlled" }}
          />
          <ListItemBarComponent item={actionItem["data"]} />
          <div className="actionListAssignees">
            {actionItem["data"].assignees.map((assignee, i) => (
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
    </div>
  );
};

export default ActionItemListItem;
