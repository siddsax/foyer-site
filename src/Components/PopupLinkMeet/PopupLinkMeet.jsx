import Button from "@mui/material/Button";
import { width } from "@mui/system";
import PopupSearch from "../Search/PopupSearch";
import LinkMeetListItem from "./LinkMeetListItem";
import "./PopupLinkMeet.css";
import plus from "../../assets/icons/plus.png";
const PopupLinkMeet = (props) => {
  const { user, setLinkNotes, activeNote, setUpdatingToggle } = props;
  const trigger = (
    // <Button
    //   variant="contained"
    //   style={{
    //     backgroundColor: "#EEBC1D",
    //     color: "Black",
    //     width: "100%",
    //     "margin-left": "20px",
    //   }}
    // >
    //   Link Meeting
    // </Button>
    <button className="linkedMeetingButton">
      {/* <div className="plusSign">{"+"}</div> */}
      <img src={plus} />
    </button>
  );
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
