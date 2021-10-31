import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.css";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebrtcProvider } from "y-webrtc";
import Quill from "quill";
import QuillCursors from "quill-cursors";
// import DoUsername from "do_username";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { usercolors, modules, formats, setUsername } from "./Editorhelpers";
import { LeveldbPersistence } from "y-leveldb";

Quill.register("modules/cursors", QuillCursors);

const EditorFoyer = (props) => {
  const { user, note, updateDB, value, setValue } = props;
  var quillRef, reactQuillRef, binding;
  const myColor = usercolors[Math.floor(Math.random() * usercolors.length)];
  const ydoc = new Y.Doc();
  // const ytext = ydoc.getText("quill");

  const ytext = ydoc.getText("quill");
  const firstTime = useRef(true);

  var provider, awareness, persistence;
  const onEditNote = (value) => {
    setValue(value);
    updateDB(
      note.title,
      document.getElementsByClassName("ql-container ql-snow")[0].childNodes[0]
        .innerHTML
    );
  };

  useEffect(() => {
    if (note) {
      if (firstTime.current) {
        firstTime.current = false;
        provider = new WebsocketProvider(
          "wss://limitless-thicket-34436.herokuapp.com/",
          note.id,
          ydoc
        );
        awareness = provider.awareness;
        persistence = new IndexeddbPersistence(note.id, ydoc);
        quillRef = reactQuillRef.getEditor();
        binding = new QuillBinding(ytext, quillRef, provider.awareness);
        setUsername({ user: user, awareness: awareness, myColor: myColor });

        const strings = [];
        awareness.getStates().forEach((state) => {
          if (state.user) {
            strings.push(
              `<div style="color:${state.user.color};">• ${state.user.name}</div>`
            );
          }
        });

        provider.on("sync", (status) => {
          if (status) {
            console.log(status);
            console.log(
              awareness.meta.size,
              awareness.meta,
              "+++++++++++++++++++++++++++++++++",
              note.body
            );
            if (awareness.meta.size === 1) {
              document.getElementsByClassName(
                "ql-container ql-snow"
              )[0].childNodes[0].innerHTML = note.body;
            }
          }
        });
      }
    }
  }, [note]);

  return (
    <div className="editor">
      <ReactQuill
        ref={(el) => {
          reactQuillRef = el;
        }}
        theme="snow"
        modules={modules}
        formats={formats}
        onChange={(value) => onEditNote(value)}
        // value={"Testing"}
        placeholder="Type in your notes here."
      ></ReactQuill>
    </div>
  );
};

export default EditorFoyer;
