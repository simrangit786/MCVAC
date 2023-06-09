import React, { Component } from "react";
import { Modal } from "antd";
// import {Image as Images} from '../Images'
import { withRouter } from "react-router-dom";
import { Image } from "../../../../Images";

class TypeConversionModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          onOk={this.props.okAction}
          onCancel={this.props.onClose}
          centered
          // style={{width:"611px !important"}}
          className="confirmation-popup-modal warning-modal sites-drawer"
          okText={"Yes, I want to continue"}
          cancelText={"Go back"}
        >
          <div className="row mx-0 confirm-modal-row warning-modal-row">
            <div className="col-12 text-center">
              <img src={Image.warning_icon} alt="" className="img-fluid" />
              <h5>{this.props.heading}</h5>
              {/* <p className="mb-0 mx-auto">
                                {this.props.subHeading}
                            </p>    */}
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(TypeConversionModal);
