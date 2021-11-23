import { useEffect, useState, useCallback, useRef } from "react";
import "./ActionItemList.css";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import calendar from "../../assets/images/calendar.png";
import { override, setFirstMonthNote } from "../Helpers/GeneralHelpers";
import { monthArray } from "../Helpers/GeneralHelpers";
import ActionItemListItem from "./ActionItemListItem";

const ActionItemList = (props) => {
  const {
    actionItems,
    loading,
    completed,
    setRerender,
    setActionItems,
    setLoading,
  } = props;

  return (
    <div className="allNotesPage">
      {loading ? (
        <div className="loadingNotes">
          <HashLoader
            color={"#049be4"}
            loading={loading}
            css={override}
            size={50}
          />
        </div>
      ) : (
        <div className="allNotes">
          {actionItems.map((actionItem, i) => (
            <>
              {actionItem.firstOfMonth ? (
                <div className="monthAreaBar">
                  <div className="monthArea">
                    <img src={calendar}></img>
                    <div className="monthName">
                      {
                        monthArray[
                          new Date(
                            actionItem["data"].date.seconds * 1000
                          ).getMonth()
                        ]
                      }
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {actionItem.todayStart == 1 || actionItem.todayStart == 2 ? (
                <hr className="todayLine"></hr>
              ) : (
                <></>
              )}
              <div className="NoteItem">
                <ActionItemListItem
                  indx={i}
                  actionItem={actionItem}
                  setRerender={setRerender}
                  completed={completed}
                  setActionItems={setActionItems}
                  setLoading={setLoading}
                />
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionItemList;
