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

import "./EmailTemplate.css";
import "../../Components/ActionItemsDisplay/ActionItemsDisplay";
import alarmClock from "./assets/alarmClock.png";
import linkedin from "./assets/linkedin.png";
import twitter from "./assets/twitter.png";
import { width } from "@mui/system";

// const HomePage = (props) => {
//   const { user } = props;
//   const [showNotes, setShowNotes] = useState(true);
//   const [loadingTop, setLoadingTop] = useState(false);
//   const container = document.querySelector(".NotesListArea");
//   var scrollHeightOld = useRef(0);

//   return (
//     <div className="HomePage">
//       <Header />
//       <div className="modeSelectorArea">
//         <div className="buttonArea">
//           <label class="switch">
//             <input
//               type="checkbox"
//               id="togBtn"
//               onChange={() => {
//                 setShowNotes((prevValue) => !prevValue);
//               }}
//             />
//             <div class="slider round">
//               <span class="on">Notes</span>
//               <span class="off">Action Items</span>
//             </div>
//           </label>
//         </div>
//       </div>

//       {showNotes ? (
//         <div>
//           <NotesListPage user={user} />
//         </div>
//       ) : (
//         <div>
//           <ActionItemListPage user={user} />
//         </div> // For action items
//       )}
//     </div>
//   );
// };

// export default HomePage;

const EmailTemplate = (props) => {
  const { name } = props;
  return (
    <div className="containerTemplate">
      <div className="titleText">Hi {name}</div>
      <div className="titleText">You have a reminder due soon</div>
      <div style={{ "margin-bottom": "30px" }}></div>
      <div className="subText">Following Items are due</div>
      {/* <ActionItemsDisplay
        noteId={activeNote.id}
        user={user}
        rerenderActionItems={rerenderActionItems}
      /> */}
      <hr className="divider" />
      <a className="actionItemButtonNotePage" href="https://my.foyer.work">
        <img src={alarmClock} />

        <div style={{ "margin-left": "10px" }}>Add a Reminder or Task</div>
      </a>
      <div className="subSubText">
        Get the most of Foyer by installing the{" "}
        <a href="https://chrome.google.com/webstore/detail/foyer/ongjimeejfllhnobabphafeknbikfhfp">
          chrome extension
        </a>
        .
      </div>
      <div className="subSubText">
        Or access Foyer via <a href="https://my.foyer.work/">my.foyer.work</a>
      </div>
      <div className="socials">
        <a
          href="https://www.linkedin.com/company/foyer-work/"
          style={{ "margin-right": "20px" }}
        >
          <img src={linkedin} />
        </a>
        <a href="https://twitter.com/FoyerWork" style={{ "margin-top": "3px" }}>
          <img src={twitter} />
        </a>
      </div>
    </div>
  );
};

export default EmailTemplate;
