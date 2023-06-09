import React, { Component } from "react";
import { Button, Modal } from "antd";
import { Image as Images } from "../Images";
import { withRouter } from "react-router-dom";

class CommonViewModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          centered
          className="confirmation-popup-modal warning-modal"
          footer={
            <div>
              <Button
                className="ant-btn ant-btn-primary w-100"
                onClick={this.props.onClose}
              >
                {this.props.footerText || "Close"}
              </Button>
            </div>
          }
        >
          <div className="row mx-0 confirm-modal-row warning-modal-row service-modal">
            <div className="col-12 text-center">
              <img src={Images.service_warning} alt="" className="img-fluid" />
              <h5>{this.props.heading}</h5>
              <p>{this.props.subHeading}</p>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(CommonViewModal);
