import { useEffect, useState, useRef } from "react";
import uuid from "react-uuid";
import Header from "../../Components/header/header";
import NotesList from "../../Components/NotesList/NotesList";
import { listUpcomingEvents } from "../../Components/GCalendarAPI/APIHelpers";
import firebase from "../../firebase";
import "./HomePage.css";
import { useHistory } from "react-router-dom";
import NotesListPage from "../NotesListPage/NotesListPage";
import ActionItemListPage from "../ActionItemListPage/ActionItemListPage";

const HomePage = (props) => {
  const { user } = props;
  const [showNotes, setShowNotes] = useState(true);
  const [loadingTop, setLoadingTop] = useState(false);
  const container = document.querySelector(".NotesListArea");
  var scrollHeightOld = useRef(0);

  return (
    <div className="HomePage">
      <Header />
      <div className="modeSelectorArea">
        <div className="buttonArea">
          <label class="switch">
            <input
              type="checkbox"
              id="togBtn"
              onChange={() => {
                setShowNotes((prevValue) => !prevValue);
              }}
            />
            <div class="slider round">
              <span class="on">Notes</span>
              <span class="off">Action Items</span>
            </div>
          </label>
        </div>
      </div>

      {showNotes ? (
        <div>
          <NotesListPage user={user} />
        </div>
      ) : (
        <div>
          <ActionItemListPage user={user} />
        </div> // For action items
      )}
    </div>
  );
};

export default HomePage;
