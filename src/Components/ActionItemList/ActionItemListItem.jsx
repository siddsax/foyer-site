import { useEffect, useState, useRef } from "react";
import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { weekdays, ListItemBarComponent } from "../Helpers/GeneralHelpers";
import Union from "../../assets/icons/Union.svg";
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
  const changeStatus = async (action) => {
    var docRef = db.collection("ActionItems").doc(actionItem.id);
    if (action === "delete") docRef.delete();
    else
      docRef.update({
        status: !status,
      });
    setStatus((preVal) => !preVal);
    setActionItems((preVal) => {
      setLoading(true);
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
              <div className="calendarDay">
                {
                  weekdays[
                    actionItem["data"].date.seconds
                      ? new Date(
                          actionItem["data"].date.seconds * 1000
                        ).getDay()
                      : new Date(actionItem["data"].date).getDay()
                  ]
                }
              </div>
              <div className="calendarDate">
                {actionItem["data"].date.seconds
                  ? new Date(actionItem["data"].date.seconds * 1000).getDate()
                  : new Date(actionItem["data"].date).getDate()}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="NoteArea">
          <ListItemBarComponent
            item={actionItem["data"]}
            assignees={actionItem["data"].assignees}
            className={actionItemArea}
            CustomTag="div"
            status={status}
            changeStatus={() => changeStatus("check")}
            deleteIcon={Union}
            onClickDelete={() => changeStatus("delete")}
            // onClickDelete={onClickDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ActionItemListItem;
