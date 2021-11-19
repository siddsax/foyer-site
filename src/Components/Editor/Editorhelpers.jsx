const usercolors = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];

const modules = {
  cursors: true,
  toolbar: [
    // [{ header: [1, 2, false] }],
    // ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      // { indent: "-1" },
      // { indent: "+1" },
    ],
    // ["link", "image"],
  ],
};

const formats = [
  // "header",
  // "bold",
  // "italic",
  // "underline",
  // "strike",
  // "blockquote",
  "list",
  "bullet",
  // "indent",
  // "link",
  // "image",
];
const setUsername = (props) => {
  const { awareness, user, myColor } = props;
  awareness.setLocalStateField("user", { name: user.email, color: myColor });
};

export { usercolors, modules, formats, setUsername };
