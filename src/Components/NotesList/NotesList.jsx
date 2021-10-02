import { useEffect, useState, useCallback, useRef } from "react";
import NoteListItem from "./NoteListItem";
import MeetListItem from "./MeetListItem";
import "./NotesList.css";

const NotesList = (props) => {
  var { notes, loading } = props;

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <>
          {notes.map((note, i) => (
            <>
              {note.noNoteYet ? (
                <div className="NoteItem">
                  <MeetListItem meet={note} />
                </div>
              ) : (
                // <></>
                <div className="NoteItem">
                  <NoteListItem note={note} />
                </div>
              )}
            </>
          ))}
        </>
      )}
    </>
  );
};

export default NotesList;
