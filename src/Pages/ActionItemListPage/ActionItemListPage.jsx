import Checkbox from "@mui/material/Checkbox";
import firebase from "../../firebase";
import Button from "@mui/material/Button";
import { useEffect, useState, useRef } from "react";
import {
  override,
  handleScroll,
} from "../../Components/Helpers/GeneralHelpers";
import "./ActionItemListPage.css";

const ActionItemListPage = (props) => {
  const { user } = props;
  const [mine, setMine] = useState(true);
  const [assigned, setAssigned] = useState(false);
  const [completed, setCompleted] = useState(false);
  const db = firebase.firestore();

  // const fetchActionItems = async () => {
  //   setIsButtonDisabled(true);
  //   setTimeout(() => setIsButtonDisabled(false), 300);

  //   const ref = db
  //     .collection("Notes")
  //     .where("access", "array-contains", user.email)
  //     .orderBy("createdAt", "desc");

  //   if (lastVisible.current === 0) {
  //     ref.limit(paginateNumber).get().then(fillNotes);
  //   } else if (lastVisible.current != null) {
  //     ref
  //       .startAfter(lastVisible.current)
  //       .limit(paginateNumber)
  //       .get()
  //       .then(fillNotes);
  //   } else {
  //     console.log("At the end of things");
  //     setLoadingTop(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchActionItems();
  // }, []);

  return (
    <div className="NotesListPage">
      <div className="newNote">
        <div className="checkBoxArea">
          <Checkbox
            checked={mine}
            onChange={() => setMine((prevVal) => !prevVal)}
            inputProps={{ "aria-label": "controlled" }}
          />
          Mine
          <Checkbox
            checked={assigned}
            onChange={() => setAssigned((prevVal) => !prevVal)}
            inputProps={{ "aria-label": "controlled" }}
          />
          Assigned
          <Checkbox
            checked={completed}
            onChange={() => setCompleted((prevVal) => !prevVal)}
            inputProps={{ "aria-label": "controlled" }}
          />
          Completed
        </div>
        <div className="newActionItemButton">
          <Button
            variant="contained"
            // onClick={addNote}
            style={{
              width: "200px",
              backgroundColor: getComputedStyle(
                document.documentElement
              ).getPropertyValue("--button-color"),
              color: "Black",
            }}
          >
            Add Action Item
          </Button>
        </div>
      </div>
      {/* 
      <div className="NotesListArea">
        {loadingTop ? (
          <>
            <PuffLoader
              color={"#049be4"}
              loading={loadingTop}
              css={override}
              size={50}
            />
          </>
        ) : (
          <></>
        )}
        <ActionItemList actionItems={actionItems} loading={loading} />
      </div> */}
    </div>
  );
};

export default ActionItemListPage;
