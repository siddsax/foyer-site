import Button from "@mui/material/Button";
import Popup from "reactjs-popup";
import { useState, useEffect, useCallback, useRef } from "react";
import "reactjs-popup/dist/index.css";
import "./PopupShare.css";
import { useHistory, useLocation } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyIcon from "../../assets/icons/copyIcon.png";
import emailIcon from "../../assets/icons/email.png";
import { apiKey } from "../../sendgrid";
import firebase from "../../firebase";
import rocket from "../../assets/icons/rocket.png";
const ShareMethod = (props) => {
  const { icon, onClickFunction, text, closeAlert } = props;
  return (
    <div className="shareMethodItemArea">
      <button onClick={() => onClickFunction({ closeAlert: closeAlert })}>
        <img className="shareMethodItemIcon" src={icon} />
      </button>

      <div className="shareMethodItemText"> {text} </div>
    </div>
  );
};

const PopupShare = (props) => {
  const { noteContent, attendees, title, trigger } = props;
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  var genericMail = firebase.functions().httpsCallable("genericMail");
  const onClickFunctionMail = async (props) => {
    const { closeAlert } = props;

    genericMail({
      noteContent: noteContent,
      attendees: attendees,
      title: title,
    })
      .then(() => {
        console.log("Notes Shared");
      })
      .catch((error) => console.log("Error ; ", error));

    console.log("Clicked");
    console.log(closeAlert);
    closeAlert();
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);
  return (
    <Popup
      trigger={
        trigger
        // <button>
        //   <div className="buttonShare">
        //     <img src={rocket} style={{ "margin-right": "10px" }} />
        //     Share Notes
        //   </div>
        // </button>
      }
      modal
      nested
    >
      {(close) => (
        <div className="modalCustom">
          <div className="headerArea">
            {" "}
            <div className="headerText">Share Notes</div>{" "}
            <div className="closeButtonArea">
              <button className="closeButton" onClick={close}>
                &times;
              </button>
            </div>
          </div>
          <div className="otherMethodsArea">
            <ShareMethod
              icon={emailIcon}
              text={"E-mail all invitees"}
              onClickFunction={onClickFunctionMail}
              closeAlert={close}
            />
          </div>
          <div className="shareMethodLinkArea">
            <div className="shareMethodLinkText"> Or share with link</div>
            <div className="shareUriBox">
              <div className="shareUriBoxText">{window.location.href}</div>
              <div class="vl"></div>
              <div className="copyTextButtonBox">
                <CopyToClipboard
                  text={window.location.href}
                  onCopy={() => setCopied(true)}
                >
                  <button>
                    <img className="copyTextButtonImg" src={copyIcon}></img>
                  </button>
                </CopyToClipboard>

                {copied ? <span className="copySpan">Copied.</span> : null}
              </div>
            </div>
          </div>
          <div className="actions"></div>
        </div>
      )}
    </Popup>
  );
};

export default PopupShare;
