import "./NotesList.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";
import { addMeetNote } from "../Helpers/BackendHelpers";
import { weekdays, ListItemBarComponent } from "../Helpers/GeneralHelpers";

const MeetListItem = (props) => {
  const { meet } = props;
  const [user, loading, error] = useAuthState(firebase.auth());
  const history = useHistory();
  const db = firebase.firestore();
  var calendarDateAreaClass;
  if (meet) {
    if (meet.todayStart == 1) {
      calendarDateAreaClass = "calendarDateAreaB";
    } else {
      calendarDateAreaClass = "calendarDateArea";
    }
  }

  return (
    <div className="fadeIn">
      <div className="NoteItemArea">
        <div className={calendarDateAreaClass}>
          {meet.firstOfDay ? (
            <>
              <div className="calendarDay">
                {weekdays[new Date(meet.createdAt).getDay()]}
              </div>
              <div className="calendarDate">
                {new Date(meet.createdAt).getDate()}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="NoteArea">
          <ListItemBarComponent
            item={meet}
            className="buttonMeetingNote"
            onClick={() => {
              addMeetNote({ meet: meet, db: db, history: history, user: user });
            }}
            CustomTag="button"
          />
        </div>
      </div>
    </div>
  );
};

export default MeetListItem;
