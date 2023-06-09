import React, { Component } from "react";
import { Modal } from "antd";
import { Image as Images } from "../../Images";
import { withRouter } from "react-router-dom";

class RequiredWarningModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          onOk={this.props.onOK}
          onCancel={this.props.onClose}
          centered
          className="confirmation-popup-modal warning-modal required-fields-warning-modal"
          // okText={`Yes, I want to ${!this.props.uomWarning ? "exit" : "continue"}`}
          okText={"Exit"}
          // cancelText={this.props.uomWarning ? "Go back" : this.props.match.params.id ? "No, continue editing" : "No, continue creating"}
          cancelText={"Continue Filling"}
        >
          <div className="row mx-0 confirm-modal-row warning-modal-row">
            <div className="col-12 text-center">
              <img src={Images.warning_icon} alt="" className="img-fluid" />
              <h5>{this.props.heading}</h5>
              {this.props.subHeading ? (
                <p className="mb-0 mx-auto">{this.props.subHeading}</p>
              ) : (
                <p className="mb-0 mx-auto">{}</p>
              )}
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(RequiredWarningModal);
