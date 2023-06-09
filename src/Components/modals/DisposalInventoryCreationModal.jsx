import React, { Component } from "react";
import { Button, Modal } from "antd";
import { Image as Images } from "../Images";

class DisposalInventoryCreationModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          // onOk={this.props.okAction}
          // onCancel={this.props.onClose}
          centered
          className={"confirmation-popup-modal customer-owner-confirm"}
          // okText={this.props.okTitle ? this.props.okTitle : "Yes, I want to Continue"}
          // cancelText={this.props.cancelText}
          footer={
            <div>
              <Button onClick={this.props.viewDisposalInventory}>
                Go to Disposal Inventory
              </Button>
              <Button onClick={this.props.viewDisposal} type="primary">
                View Disposal
              </Button>
            </div>
          }
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
              <h5>{this.props.heading}</h5>
              {this.props.subHeading}
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default DisposalInventoryCreationModal;
