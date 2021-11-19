import Checkbox from "@mui/material/Checkbox";
import firebase from "../../firebase";
import Button from "@mui/material/Button";
import { useEffect, useState, useRef } from "react";
import {
  override,
  handleScroll,
  setFirstMonthNote,
} from "../../Components/Helpers/GeneralHelpers";
import "./ActionItemListPage.css";
import PopupActionItem from "../../Components/PopupActionItem/PopupActionItem";
import PuffLoader from "react-spinners/PuffLoader";
import ActionItemList from "../../Components/ActionItemList/ActionItemList";
import { getActionItems } from "../../Components/Helpers/BackendHelpers";
import Switch from "@mui/material/Switch";
const ActionItemListPage = (props) => {
  const { user } = props;
  const [mine, setMine] = useState(false);
  // const [assigned, setAssigned] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBottom, setLoadingBottom] = useState(false);
  const [actionItems, setActionItems] = useState([]);
  let [rerender, setRerender] = useState(0);
  const db = firebase.firestore();
  const paginateNumber = 10;

  var lastVisible = useRef(0);

  const fetchActionItems = async () => {
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 300);

    getActionItems({
      db: db,
      setLoading: setLoading,
      setActionItems: setActionItems,
      noteId: null,
      userId: !mine ? user.uid : null,
      assigneeID: mine ? user.uid : null,
      completed: completed,
    });

    // const ref = db
    //   .collection("Notes")
    //   .where("access", "array-contains", user.email)
    //   .orderBy("createdAt", "desc");

    // if (lastVisible.current === 0) {
    //   ref.limit(paginateNumber).get().then(fillNotes);
    // } else if (lastVisible.current != null) {
    //   ref
    //     .startAfter(lastVisible.current)
    //     .limit(paginateNumber)
    //     .get()
    //     .then(fillNotes);
    // } else {
    //   console.log("At the end of things");
    //   setLoadingBottom(false);
    // }
  };

  useEffect(() => {
    fetchActionItems();
  }, [completed, mine]);

  useEffect(() => {
    console.log(actionItems, "================++++++______________********");
    setFirstMonthNote({
      notes: actionItems,
      setNotes: setActionItems,
      loadingTop: false,
      todayLine: true,
      actionItem: true,
    });
  }, [actionItems]);

  useEffect(() => {
    if (rerender) {
      console.log(rerender, "__________&&&&&&&&&&&&&&&");
      setFirstMonthNote({
        notes: actionItems,
        setNotes: setActionItems,
        loadingTop: false,
        todayLine: true,
        actionItem: true,
      });
      setLoading(false);
      setRerender((preVal) => !preVal);
    }
  }, [rerender]);

  return (
    <div className="ActionItemListPage">
      <div className="newNote">
        <div className="checkBoxArea">
          Assigned
          <Switch
            // defaultChecked
            onChange={() => setMine((prevVal) => !prevVal)}
          />
          Mine
          <Checkbox
            checked={completed}
            onChange={() => setCompleted((prevVal) => !prevVal)}
            inputProps={{ "aria-label": "controlled" }}
            sx={{
              color: getComputedStyle(
                document.documentElement
              ).getPropertyValue("--fourth-object-color"),
              "&.Mui-checked": {
                color: getComputedStyle(
                  document.documentElement
                ).getPropertyValue("--fourth-object-color"),
              },
            }}
          />
          Completed
        </div>
        <div className="newActionItemButton">
          {/* <PopupActionItem
            trigger={
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
            }
            user={user}
            noteId={null}
            attendees={[]}
            setRerenderActionItems={setRerender}
            setLoading={setLoading}
            setActionItems={setActionItems}
          /> */}
        </div>
      </div>

      <div className="NotesListArea">
        <ActionItemList
          actionItems={actionItems}
          loading={loading}
          completed={completed}
          setRerender={setRerender}
          setActionItems={setActionItems}
          setLoading={setLoading}
        />
        {loadingBottom ? (
          <>
            <PuffLoader
              color={"#049be4"}
              loading={loadingBottom}
              css={override}
              size={50}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ActionItemListPage;
