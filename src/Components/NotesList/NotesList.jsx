import { useEffect, useState, useCallback, useRef } from "react";
import NoteListItem from "./NoteListItem";
import MeetListItem from "./MeetListItem";
import "./NotesList.css";

const NotesList = (props) => {
  var { notes, meetings } = props;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (meetings) {
      console.log("!! = !!");
      for (let i = 0; i < meetings.length; i++) {
        var done = 0;
        for (let j = 0; j < notes.length; j++) {
          if (notes[j].meetId == meetings[i].id) {
            done = 1;
          }
        }
        if (!done) {
          var meet = {
            noNoteYet: true,
            createdAt: Date.parse(meetings[i].start.dateTime),
            hangoutLink: meetings[i].hangoutLink,
            id: meetings[i].id,
            title: meetings[i].summary,
            attendees: meetings[i].attendees,
            end: Date.parse(meetings[i].end.dateTime),
          };
          console.log(meet);
          notes.push(meet);
        }
      }

      notes = notes.slice().sort((a, b) => a.createdAt - b.createdAt);
      console.log(notes);

      setLoading(false);
    }
  }, [meetings]);

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
