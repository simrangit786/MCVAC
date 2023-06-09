import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";

import { Modal } from "antd";
import { Image as Images } from "../Images";

function DrawersUnsavedExitModal(props) {
  const { when, onOK, onCancel, title, okText, cancelText } = props;

  const history = useHistory();

  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setShowPrompt(props.visible);
  }, [props.visible]);

  //   const handleOK = useCallback(async () => {
  //     if (onOK) {
  //       const canRoute = await Promise.resolve(onOK());
  //       if (canRoute) {
  //         history.block(() => { });
  //         history.push(currentPath);
  //       }
  //     }
  //   }, [currentPath, history, onOK]);

  //   const handleCancel = useCallback(async () => {
  //     if (onCancel) {
  //       const canRoute = await Promise.resolve(onCancel());
  //       if (canRoute) {
  //         history.block(() => { });
  //         history.push(currentPath);
  //       }
  //     }
  //     setShowPrompt(false);
  //   }, [currentPath, history, onCancel]);

  return showPrompt ? (
    <Modal
      className="unsavedexitprompt-modal confirmation-popup-modal warning- text-center drawer-unsaved-modal"
      // title={title}
      visible={showPrompt}
      onOk={props.onOK}
      okText={props.okText}
      onCancel={props.onCancel}
      cancelText={props.cancelText}
      closable={true}
    >
      <div className="row mx-0 confirm-modal-row warning-modal-row">
        <div className="col-12 text-center">
          <img src={Images.warning_icon} alt="" className="img-fluid" />
          <h5>{title}</h5>
          <p className="mb-0 mx-auto">
            {
              "Not add the required information may cause issues down the line. If you'd like to continue adding information, select Continue. If you would like to exit anyway, select Exit."
            }
          </p>
        </div>
      </div>
    </Modal>
  ) : null;
}

export default DrawersUnsavedExitModal;
