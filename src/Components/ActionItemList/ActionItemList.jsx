import { useEffect, useState, useCallback, useRef } from "react";
import "./ActionItemList.css";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import calendar from "../../assets/images/calendar.png";
import { override } from "../Helpers/GeneralHelpers";
import { monthArray } from "../Helpers/GeneralHelpers";
import ActionItemListItem from "./ActionItemListItem";

const ActionItemList = (props) => {
  const { actionItems, loading } = props;

  useEffect(() => {
    console.log(actionItems);
  }, []);

  return (
    <div className="allNotesPage">
      <div className="allNotes">
        {actionItems.map((actionItem, i) => (
          <>
            {actionItem.firstOfMonth ? (
              <div className="monthAreaBar">
                <div className="monthArea">
                  <img src={calendar}></img>
                  <text className="monthName">
                    {
                      monthArray[
                        new Date(
                          actionItem["data"].date.seconds * 1000
                        ).getMonth()
                      ]
                    }
                  </text>
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
              <ActionItemListItem actionItem={actionItem} />
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default ActionItemList;
