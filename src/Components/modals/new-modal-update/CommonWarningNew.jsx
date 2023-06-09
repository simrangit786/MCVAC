import React, { Component } from "react";
import { Button, Modal } from "antd";
import { Image as Images } from "../../Images";

class CommonWarningNew extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          title={this.props.title}
          visible={this.props.visible}
          onOk={this.props.onCancel}
          onCancel={this.props.onCancel}
          centered
          className={"confirmation-popup-modal success-new"}
          okText={false}
          cancelText={false}
          footer={
            <div className="row mx-0">
              <Button>Continue</Button>
              <Button type={"danger"}>Exit</Button>
            </div>
          }
        >
          <div className={"row mx-0 confirm-modal-row"}>
            <div className="col-12 text-center">
              <img src={Images.warning_icon} alt="" className="img-fluid" />
              <h5>You haven`t added all of the required information</h5>
              <p className="mb-0">
                Not add the required information may cause issues down the line.
                if <br />
                you`d like to continue adding information, select Continue. if
                you <br />
                would like to exit anyway, select Exit.
              </p>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CommonWarningNew;
