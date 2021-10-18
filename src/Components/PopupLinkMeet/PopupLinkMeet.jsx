import Button from "@mui/material/Button";
import PopupSearch from "../Search/PopupSearch";
import LinkMeetListItem from "./LinkMeetListItem";

const PopupLinkMeet = (props) => {
  const { user, setLinkNotes } = props;
  const trigger = (
    <Button
      variant="contained"
      style={{
        backgroundColor: "#EEBC1D",
        color: "Black",
        width: "100%",
        "margin-left": "20px",
      }}
    >
      Link Meeting
    </Button>
  );
  return (
    <PopupSearch
      trigger={trigger}
      user={user}
      ListItem={LinkMeetListItem}
      setLinkNotes={setLinkNotes}
    />
  );
};

export default PopupLinkMeet;
