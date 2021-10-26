import Button from "@mui/material/Button";
import Popup from "reactjs-popup";
import { useState, useEffect, useCallback, useRef } from "react";
import "reactjs-popup/dist/index.css";
import { useHistory, useLocation } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyIcon from "../../assets/icons/copyIcon.png";
import emailIcon from "../../assets/icons/email.png";
import { apiKey } from "../../sendgrid";
import firebase from "../../firebase";
import "./PopupActionItem.css";
import InputForm from "./InputForm";

const PopupActionItem = (props) => {
  const {
    noteId,
    attendees,
    openActionItemPopup,
    setOpenActionItemPopup,
    user,
  } = props;

  const [date, setDate] = useState(null);
  const [assignees, setAssignees] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    console.log(openActionItemPopup);
  }, [openActionItemPopup]);

  return (
    <Popup
      open={openActionItemPopup}
      modal
      nested
      onClose={() => setOpenActionItemPopup(false)}
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
            />
          </div>
          <div className="actions"></div>
        </div>
      )}
    </Popup>
  );
};

export default PopupActionItem;
