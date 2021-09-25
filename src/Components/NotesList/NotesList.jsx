import { useEffect, useState, useCallback, useRef } from "react";
import NoteListItem from "./NoteListItem";
import "./NotesList.css";
const NotesList = (props) => {
  const { notes } = props;
  return (
    <>
      {notes.map((note, i) => (
        <div className="NoteItem">
          <NoteListItem note={note} />
        </div>
      ))}
    </>
  );
};
export default NotesList;
