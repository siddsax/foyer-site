import { useState, useEffect, useCallback, useRef } from "react";
import "./ActionItemsDisplay.css";
import firebase from "../../firebase";

export default function ActionItemsDisplay(props) {
  const { user, noteId } = props;
  const [actionItems, setActionItems] = useState([]);
  const db = firebase.firestore();
  const docRef = db
    .collection("ActionItems")
    .where("noteId", "==", noteId)
    .orderBy("date", "asc");

  docRef.onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setActionItems((preVal) => [...preVal, doc.data()]);
    });
  });

  return (
    <div>
      <hr class="separateActionItems"></hr>
    </div>
  );
}
