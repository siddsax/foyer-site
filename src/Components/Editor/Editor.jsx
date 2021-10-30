import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.css";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebrtcProvider } from "y-webrtc";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import DoUsername from "do_username";

Quill.register("modules/cursors", QuillCursors);

const ydoc = new Y.Doc();
const ytext = ydoc.getText("quill");

const provider = new WebrtcProvider("quill-demo-room", ydoc);
const awareness = provider.awareness;

export const usercolors = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];
const myColor = usercolors[Math.floor(Math.random() * usercolors.length)];

const modules = {
  cursors: true,
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const EditorFoyer = (props) => {
  const { user, note, updateDB, value, setValue } = props;
  var quillRef, reactQuillRef, binding;
  const setUsername = () => {
    awareness.setLocalStateField("user", { name: user.email, color: myColor });
  };
  const onEditNote = (value) => {
    setValue(value);
    updateDB(note.title, JSON.stringify(value));
  };

  useEffect(() => {
    console.log(note);
    if (note) {
      setValue(JSON.parse(note.body));
    }
  }, [note]);

  const updateText = (content, delta, source, editor) => {
    console.log(content, delta, source, editor, value);
  };

  useEffect(() => {
    quillRef = reactQuillRef.getEditor();
    binding = new QuillBinding(ytext, quillRef, provider.awareness);
    setUsername();

    const strings = [];
    awareness.getStates().forEach((state) => {
      console.log(state);
      if (state.user) {
        strings.push(
          `<div style="color:${state.user.color};">• ${state.user.name}</div>`
        );
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      console.log("unmount");
    };
  }, []);
  return (
    <div className="editor">
      <ReactQuill
        ref={(el) => {
          reactQuillRef = el;
        }}
        theme="snow"
        onChange={updateText}
        modules={modules}
        formats={formats}
        defaultValue={"OK"}
        // value={value}
      ></ReactQuill>
    </div>
  );
};

export default EditorFoyer;
