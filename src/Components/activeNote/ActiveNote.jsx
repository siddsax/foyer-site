import ReactMarkdown from "react-markdown";

const ActiveNote = (props) => {
  const { activeNote, onUpdateNote, onUpdateNoteDB } = props;

  const onEditField = async (field, value) => {
    const updateNote = {
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    };
    onUpdateNote(updateNote);
    onUpdateNoteDB(updateNote);
  };

  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <input
          type="text"
          id="title"
          placeholder="Note Title"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Write your note here..."
          value={activeNote.body}
          onChange={(e) => onEditField("body", e.target.value)}
        />
      </div>
      <div className="app-main-note-preview">
        <h1 className="preview-title">{activeNote.title}</h1>
        <ReactMarkdown className="markdown-preview">
          {activeNote.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ActiveNote;
