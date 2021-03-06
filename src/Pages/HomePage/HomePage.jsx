import { useEffect, useState, useRef } from "react";
import Header from "../../Components/header/header";
import "./HomePage.css";
import NotesListPage from "../NotesListPage/NotesListPage";
import ActionItemListPage from "../ActionItemListPage/ActionItemListPage";

const HomePage = (props) => {
  const { user } = props;
  const [showNotes, setShowNotes] = useState(true);

  return (
    <div className="HomePage">
      <Header />
      <div className="modeSelectorArea">
        <div className="buttonArea">
          <label className="switch">
            <input
              type="checkbox"
              id="togBtn"
              onChange={() => {
                setShowNotes((prevValue) => !prevValue);
              }}
            />
            <div className="slider round">
              <span className="on">Notes</span>
              <span className="off">Action Items</span>
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
