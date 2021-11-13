import { useState, useEffect, useCallback, useRef } from "react";
import "./ActionItemsDisplay.css";
import firebase from "../../firebase";
import BarLoader from "react-spinners/BarLoader";
import { override } from "../Helpers/GeneralHelpers";

import moment from "moment";
import { getActionItems } from "../../Components/Helpers/BackendHelpers";
import { ListItem } from "./ListItem";

const FormattedDate = (props) => {
  const { dateNanSec, timeNanSec } = props;
  var date = new Date(dateNanSec);
  var time = new Date(timeNanSec);

  console.log(dateNanSec, timeNanSec, date, time);

  var dateCombined = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds()
  );
  console.log(dateCombined);
  var output = `By ${moment(dateCombined).calendar()}`;

  return <div className="actionListItemDate">{output}</div>;
};

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
    });
  }, [rerenderActionItems]);

  return (
    <div>
      <hr class="separateActionItems"></hr>
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
