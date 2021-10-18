import Popup from "reactjs-popup";
import { useEffect, useState, useRef, useCallback } from "react";
import firebase from "../../firebase";
import "./Search.css";
import search from "../../assets/icons/search.png";
import { debounce } from "debounce";
import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/react";
import SearchListItem from "./SearchListItem";
import { override } from "../Helpers/GeneralHelpers";

const contentStyle = {
  "background-color": "rgb(80,80,80)",
  padding: "0px",
  border: "none",
  height: "60%",
  width: "65%",
  "border-radius": "10px",
  "min-width": "400px",
};

const containsRegex = async (props) => {
  var foundNothing = 1;
  const { notes, regex, setResultNotes, setLoading, activeNote } = props;
  await setResultNotes([]);
  for (var i = 0; i < notes.length; i++) {
    if (notes[i].title.toLowerCase().search(regex) > -1) {
      if (activeNote) {
        if (notes[i].id != activeNote.id)
          await setResultNotes((preVal) => [...preVal, notes[i]]);
      } else await setResultNotes((preVal) => [...preVal, notes[i]]);
      foundNothing = 0;
    }
  }
  setLoading(false);
};

const PopupSearch = (props) => {
  const {
    user,
    trigger,
    ListItem,
    setLinkNotes,
    activeNote,
    setUpdatingToggle,
  } = props;
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const [resultNotes, setResultNotes] = useState([]);
  const db = firebase.firestore();
  var fetchedData = useRef(0);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useCallback(debounce(containsRegex, 500), []);

  const fillNotes = async (querySnapshot) => {
    await querySnapshot.forEach(async (doc) => {
      await setNotes((oldArray) => [
        doc.data(), //.title.toLowerCase(),
        ...oldArray,
      ]);
    });
    setLoaded(true);
  };

  const fetchNotes = async () => {
    const ref = db
      .collection("Notes")
      .where("access", "array-contains", user.email)
      .orderBy("createdAt", "desc");

    ref.get().then(fillNotes);
  };

  const searchText = (event) => {
    setInputValue(event.target.value.toLowerCase());
  };

  useEffect(() => {
    if (!fetchedData.current && inputValue) {
      fetchedData.current = 1;
      fetchNotes();
    } else if (notes.length > 0) {
      // loading.current = 1;
      setLoading(true);
      debouncedSearch({
        notes: notes,
        regex: inputValue,
        setResultNotes: setResultNotes,
        setLoading: setLoading,
        activeNote: activeNote,
      });
    }
  }, [inputValue]);

  useEffect(() => {
    console.log(resultNotes);
  }, [resultNotes]);

  return (
    <Popup trigger={trigger} modal nested contentStyle={contentStyle}>
      {(close) => (
        <div className="modalCustom">
          <div className="headerPopup">
            <img src={search} className="searchIcon" />
            <input
              type="text"
              placeholder="Search"
              className="searchBoxPopUp"
              onChange={searchText}
            />
          </div>
          {inputValue ? (
            <>
              {!loading ? (
                <div className="searchResultsArea">
                  {resultNotes.map((note, i) => (
                    <>
                      <ListItem
                        note={note}
                        setLinkNotes={setLinkNotes}
                        close={close}
                        activeNote={activeNote}
                        setUpdatingToggle={setUpdatingToggle}
                      />
                    </>
                  ))}
                </div>
              ) : (
                <div className="loadingArea">
                  <PulseLoader
                    color="#049be4"
                    loading={loading}
                    css={override}
                    size={20}
                  />
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </Popup>
  );
};

export default PopupSearch;
