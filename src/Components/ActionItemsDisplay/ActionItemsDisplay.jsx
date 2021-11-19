import { useState, useEffect, useCallback, useRef } from "react";
import "./ActionItemsDisplay.css";
import firebase from "../../firebase";
import BarLoader from "react-spinners/BarLoader";
import { override } from "../Helpers/GeneralHelpers";

import moment from "moment";
import { getActionItems } from "../../Components/Helpers/BackendHelpers";
import { ListItem } from "./ListItem";

export default function ActionItemsDisplay(props) {
  const { user, noteId, rerenderActionItems } = props;
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = firebase.firestore();

  useEffect(() => {
    getActionItems({
      db: db,
      setLoading: setLoading,
      setActionItems: setActionItems,
      noteId: noteId,
      realtime: true,
    });
  }, [rerenderActionItems]);

  return (
    <div>
      {!loading ? (
        <>
          {actionItems.map((actionItem, i) => (
            <ListItem
              actionItem={actionItem}
              setLoading={setLoading}
              tooltip={true}
            />
          ))}
        </>
      ) : (
        <>
          <BarLoader
            color={getComputedStyle(document.documentElement).getPropertyValue(
              "--third-object-color"
            )}
            loading={loading}
            css={override}
            size={50}
          />
        </>
      )}
    </div>
  );
}
