import { useEffect, useState, useCallback, useRef } from "react";
import NoteListItem from "./NoteListItem";
import MeetListItem from "./MeetListItem";
import "./NotesList.css";

const NotesList = (props) => {
  var { notes, loading } = props;

  return (
    <div className="allNotesPage">
      {loading ? (
        <></>
      ) : (
        <div className="allNotes">
          {notes.map((note, i) => (
            <div className="NoteItem">
              {note.noNoteYet ? (
                <MeetListItem meet={note} />
              ) : (
                <NoteListItem note={note} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
