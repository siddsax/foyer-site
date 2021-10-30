import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.css";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebrtcProvider } from "y-webrtc";

const ydoc = new Y.Doc();
const ytext = ydoc.getText("quill");

const provider = new WebrtcProvider("quill-demo-room", ydoc);

const modules = {
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
    // const { content, delta, source, editor } = props;
    console.log(content, delta, source, editor, value);
    // console.log(props);
    // setValue()
  };

  useEffect(() => {
    quillRef = reactQuillRef.getEditor();
    binding = new QuillBinding(ytext, quillRef, provider.awareness);
    console.log("====");
  }, []);

  return (
    // <ReactQuill theme="snow" value={value} onChange={setValue}/>
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
