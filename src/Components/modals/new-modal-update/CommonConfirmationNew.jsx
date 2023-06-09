import React, { Component } from "react";
import { Button, Modal } from "antd";
import { Image as Images } from "../../Images";

class CommonConfirmationNew extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          onOk={this.props.okAction}
          onCancel={this.props.onClose}
          centered
          className={"confirmation-popup-modal success-new"}
          okText={false}
          cancelText={false}
          footer={
            <div className="row mx-0">
              <Button>Continue</Button>
              <Button type={"primary"}>View Account</Button>
            </div>
          }
        >
          <div className={"row mx-0 confirm-modal-row"}>
            <div className="col-12 text-center">
              <img src={Images.check_icon} alt="" className="img-fluid" />
              <h5>
                You`ve successfully <br /> added all of the required information
              </h5>
              <p className="mb-0">
                Thank You for adding all the required information!
                <br />
                To Continue adding optional information, select Continue. To
                view
                <br />
                the account, select View Account
              </p>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CommonConfirmationNew;
