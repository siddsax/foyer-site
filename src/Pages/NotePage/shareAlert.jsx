import Button from "@mui/material/Button";
import Popup from "reactjs-popup";
import { useState, useEffect, useCallback, useRef } from "react";
import "reactjs-popup/dist/index.css";
import "./popup.css";
import { useHistory, useLocation } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyIcon from "../../assets/icons/copyIcon.png";
const shareNote = () => {
  console.log("aas");
};

const contentStyle = {
  maxWidth: "600px",
  width: "90%",
  //   "background-color": "blue",
};

const ShareMethod = (props) => {
  const { onClick, text } = props;
  return (
    <div className="shareMethodTextArea">
      <div className="shareMethodText"> {text}</div>
    </div>
  );
};

const PopupShare = () => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

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
        <Button
          variant="contained"
          style={{
            backgroundColor: "#EEBC1D",
            color: "Black",
            width: "100%",
          }}
        >
          Share Note
        </Button>
      }
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> Share Notes </div>
          <div className="shareMethodTextArea">
            <div className="shareMethodText">
              {" "}
              Share Notes to anyone with access to Link
            </div>
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

            <div className="shareMethodGoogleBox">
              <div className="shareMethodGoogleText">
                {" "}
                Share Notes with participants via email
              </div>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "red",
                  color: "Black",
                  height: "10%",
                  width: "20%",
                }}
              >
                Share with Google
              </Button>
            </div>
          </div>
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                console.log("modal closed ");
                close();
              }}
            >
              close
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default PopupShare;
