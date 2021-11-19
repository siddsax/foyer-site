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
  const {
    actionItem,
    setRerender,
    completed,
    setActionItems,
    indx,
    setLoading,
  } = props;

  const [status, setStatus] = useState(actionItem.data.status);
  const db = firebase.firestore();

  var actionItemArea;
  const changeStatus = async () => {
    var docRef = db.collection("ActionItems").doc(actionItem.id);
    docRef.update({
      status: !status,
    });
    setStatus((preVal) => !preVal);
    setActionItems((preVal) => {
      setLoading(true);
      // animation = "fadeOut";
      preVal.splice(indx, 1);
      return preVal;
    });
    setRerender((preVal) => preVal + 1);
  };

  var calendarDateAreaClass;
  if (actionItem) {
    if (actionItem.todayStart === -1 && !completed)
      actionItemArea = "ActionItemPassed";
    else actionItemArea = "Note";

    if (actionItem.todayStart === 1) {
      calendarDateAreaClass = "calendarDateAreaB";
    } else {
      calendarDateAreaClass = "calendarDateArea";
    }
  }

  return (
    <div className="fadeIn">
      <div className="NoteItemArea">
        <div class={calendarDateAreaClass}>
          {actionItem.firstOfDay ? (
            <>
              <text className="calendarDay">
                {
                  weekdays[
                    actionItem["data"].date.seconds
                      ? new Date(
                          actionItem["data"].date.seconds * 1000
                        ).getDay()
                      : new Date(actionItem["data"].date).getDay()
                  ]
                }
              </text>
              <text className="calendarDate">
                {actionItem["data"].date.seconds
                  ? new Date(actionItem["data"].date.seconds * 1000).getDate()
                  : new Date(actionItem["data"].date).getDate()}
              </text>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="NoteArea">
          <div className={actionItemArea}>
            <Checkbox
              checked={status}
              onChange={changeStatus}
              inputProps={{ "aria-label": "controlled" }}
              sx={{
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--fourth-object-color"),
                "&.Mui-checked": {
                  color: getComputedStyle(
                    document.documentElement
                  ).getPropertyValue("--fourth-object-color"),
                },
              }}
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
                    <div className="memberCircle">
                      {assignee.substring(0, 2)}
                    </div>
                  </Tooltip>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionItemListItem;
