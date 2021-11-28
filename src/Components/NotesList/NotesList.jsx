import { useEffect, useState, useCallback, useRef } from "react";
import NoteListItem from "./NoteListItem";
import MeetListItem from "./MeetListItem";
import "./NotesList.css";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import calendar from "../../assets/images/calendar.png";
import { override } from "../Helpers/GeneralHelpers";
import { monthArray } from "../Helpers/GeneralHelpers";

const NotesList = (props) => {
  var { notes, loading, setRerender, setNotes, setLoading } = props;
  // let [color, setColor] = useState("#ffffff");
  let [color, setColor] = useState("#049be4");

  return (
    <div className="allNotesPage">
      {loading ? (
        <div className="loadingNotes">
          <HashLoader
            color={color}
            loading={loading}
            css={override}
            size={50}
          />
        </div>
      ) : (
        <div className="allNotes">
          {notes.map((note, i) => (
            <>
              {note.firstOfMonth ? (
                <div className="monthAreaBar">
                  <div className="monthArea">
                    <img src={calendar}></img>
                    <div className="monthName">
                      {monthArray[new Date(note.createdAt).getMonth()]}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {note.todayStart == 1 || note.todayStart == 2 ? (
                <hr className="todayLine"></hr>
              ) : (
                <></>
              )}
              <div className="NoteItem">
                {note.noNoteYet ? (
                  <MeetListItem meet={note} />
                ) : (
                  <NoteListItem
                    note={note}
                    setRerender={setRerender}
                    setNotes={setNotes}
                    setLoading={setLoading}
                    indx={i}
                  />
                )}
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
