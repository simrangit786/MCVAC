// import React from 'react';
// import { Prompt } from "react-router-dom";
// class UnsavedDataPrompt extends React.Component {
//     render() {
//         return <>
//             {/* {this.props.unsavedExit ? */}
//                 <Prompt
//                     when={this.props.unsavedExit}
//                     // when={this.props.exit || true}
//                     okText={"Leave"}
//                     cancelText={"Cancel"}
//                     message={() => { return this.props.message || "You have unfilled 'REQUIRED' sections, Are you sure you want to leave ?" }}
//                 >
//                 </Prompt>
//                 {/* : ""} */}
//         </>;
//     }
// }

// export default UnsavedDataPrompt;

import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";

import { Modal } from "antd";
import { Image as Images } from "../Images";

function UnsavedDataPrompt(props) {
  const { when, onOK, onCancel, title, okText, cancelText } = props;

  const history = useHistory();

  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (when) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname);
        setShowPrompt(true);
        // return "true man";
        return false;
      });
    } else {
      history.block(() => {});
    }

    // return () => {
    //   history.block(() => { });
    // };
  }, [history, when]);

  const handleOK = useCallback(async () => {
    if (onOK) {
      const canRoute = await Promise.resolve(onOK());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
  }, [currentPath, history, onOK]);

  const handleCancel = useCallback(async (value) => {
    if(props.setCancel) props.setCancel();
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
    setShowPrompt(false);
  }, [currentPath, history, onCancel]);

  return showPrompt ? (
    <Modal
      className="unsavedexitprompt-modal confirmation-popup-modal warning- text-center"
      // title={title}
      visible={showPrompt}
      onOk={handleOK}
      okText={okText}
      onCancel={handleCancel}
      cancelText={cancelText}
      closable={true}
    >
      <div className="row mx-0 confirm-modal-row warning-modal-row">
        <div className="col-12 text-center">
          <img src={Images.warning_icon} alt="" className="img-fluid" />
          <h5>{title}</h5>
          <p className="mb-0 mx-auto">
            { props.unsavedText ||
              "Not adding the required information may cause issues down the line. If you'd like to continue adding information, select Continue. If you would like to exit anyway, select Exit."
            }
          </p>
        </div>
      </div>
    </Modal>
  ) : null;
}

export default UnsavedDataPrompt;
