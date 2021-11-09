import Popup from "reactjs-popup";
import { useState, useEffect, useCallback, useRef } from "react";
import "reactjs-popup/dist/index.css";
import "./PopupActionItem.css";
import InputForm from "./InputForm";

const PopupActionItem = (props) => {
  const {
    noteId,
    attendees,
    // openActionItemPopup,
    // setOpenActionItemPopup,
    user,
    setRerenderActionItems,
    trigger,
  } = props;

  const [date, setDate] = useState(null);
  const [assignees, setAssignees] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(new Date("01-01-1970 17:00:00"));

  return (
    <Popup
      // open={openActionItemPopup}
      modal
      nested
      trigger={trigger}
      // onClose={() => setOpenActionItemPopup(false)}
    >
      {(close) => (
        <div className="modalCustom">
          <div className="headerArea">
            {" "}
            <div className="headerTextFollowUp">
              Add Reminder/Follow-ups
            </div>{" "}
          </div>
          <div>
            <InputForm
              attendees={attendees}
              onClose={close}
              setDate={setDate}
              setAssignees={setAssignees}
              setTitle={setTitle}
              date={date}
              title={title}
              assignees={assignees}
              user={user}
              noteId={noteId}
              time={time}
              setTime={setTime}
              setRerenderActionItems={setRerenderActionItems}
            />
          </div>
          <div className="actions"></div>
        </div>
      )}
    </Popup>
  );
};

export default PopupActionItem;
