import Button from "@mui/material/Button";
import { width } from "@mui/system";
import PopupSearch from "../Search/PopupSearch";
import LinkMeetListItem from "./LinkMeetListItem";
import "./PopupLinkMeet.css";
import plus from "../../assets/icons/plus.png";
const PopupLinkMeet = (props) => {
  const { user, setLinkNotes, activeNote, setUpdatingToggle, trigger } = props;

  return (
    <PopupSearch
      trigger={trigger}
      user={user}
      ListItem={LinkMeetListItem}
      setLinkNotes={setLinkNotes}
      activeNote={activeNote}
      setUpdatingToggle={setUpdatingToggle}
    />
  );
};

export default PopupLinkMeet;
