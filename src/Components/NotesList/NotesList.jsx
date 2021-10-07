import { useEffect, useState, useCallback, useRef } from "react";
import NoteListItem from "./NoteListItem";
import MeetListItem from "./MeetListItem";
import "./NotesList.css";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const NotesList = (props) => {
  var { notes, loading } = props;
  // let [color, setColor] = useState("#ffffff");
  let [color, setColor] = useState("#049be4");

  return (
    <div className="allNotesPage">
      {loading ? (
        <HashLoader color={color} loading={loading} css={override} size={50} />
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
