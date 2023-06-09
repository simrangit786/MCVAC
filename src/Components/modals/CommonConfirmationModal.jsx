import React, { Component } from "react";
import { Modal } from "antd";
import { Image as Images } from "../Images";

class CommonConfirmationModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          onOk={this.props.okAction}
          onCancel={this.props.onClose}
          centered
          className={`confirmation-popup-modal ${
            this.props.deleteLineItem ? "warning-modal" : "success-modal"
          }`}
          okText={
            this.props.okTitle ? this.props.okTitle : "Yes, I want to Continue"
          }
          cancelText={this.props.cancelText}
        >
          <div
            className={`row mx-0 confirm-modal-row ${
              this.props.deleteLineItem ? "warning-modal-row" : ""
            }`}
          >
            <div className="col-12 text-center">
              <img
                src={
                  this.props.deleteLineItem
                    ? Images.warning_icon
                    : Images.check_icon
                }
                alt=""
                className="img-fluid"
              />
              {this.props.InvoiceText ? <h5>You’ve successfully <br/> added all of the required information.</h5>
              : 
              <h5>{this.props.heading}</h5>
  }
              {this.props.subHeading}
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CommonConfirmationModal;
