import "../Search/Search.css";
import "./PopupLinkMeet.css";
import firebase from "../../firebase";
import { SearchListItemDisplayComponent } from "../../Components/Helpers/GeneralHelpers";

const LinkMeetListItem = (props) => {
  const { note, setLinkNotes, close, activeNote, setUpdatingToggle } = props;
  const db = firebase.firestore();

  const selectNote = (title, content) => {
    console.log("Updating", note);
    setLinkNotes((preVal) => {
      if (!preVal) preVal = [];
      else
        var result = preVal.find((obj) => {
          return obj.id === note.id;
        });

      const toAdd = {
        id: note.id,
        createdAt: note.createdAt,
        end: note.end ? note.end : null,
        lastModified: note.lastModified,
        title: note.title,
        access: note.access,
        creator: note.creator,
      };

      if (!result) {
        var noteCopy = Object.assign({}, activeNote);
        delete noteCopy.body;
        delete noteCopy.linkNotes;

        db.collection("Notes")
          .doc(`${note.id}`)
          .update({
            linkNotes: firebase.firestore.FieldValue.arrayUnion(noteCopy),
          });
        setUpdatingToggle((preVal) => !preVal);

        return [...preVal, toAdd];
      } else return preVal;
    });
    close();
  };

  return (
    <div onClick={selectNote}>
      <SearchListItemDisplayComponent item={note} />
    </div>
  );
};

export default LinkMeetListItem;
