import React, { Component } from "react";
import { Modal } from "antd";
import { Image as Images } from "../Images";
import { withRouter } from "react-router-dom";
import { routes } from "../../Controller/Routes";
import { reverse } from "named-urls/dist/index.es";
import { history } from "../../Controller/history";

class CustomerOwnerConfirmModal extends Component {
  viewOwner = () => {
    history.push(
      reverse(routes.dashboard.owner_account.view, { id: this.props.id })
    );
    this.props.onClose();
  };
  viewCustomer = () => {
    history.push(
      reverse(routes.dashboard.customer_account.view, { id: this.props.id })
    );
    this.props.onClose();
  };
  render() {
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          onOk={() => this.viewOwner()}
          onCancel={() => this.viewCustomer()}
          centered
          className="confirmation-popup-modal customer-owner-confirm"
          okText={"View as Site Manager"}
          cancelText={"View as Billing"}
          maskClosable={false}
        >
          <div className="row mx-0 confirm-modal-row">
            <div className="col-12 text-center">
              <img src={Images.check_icon} alt="icon" className="img-fluid" />
              <h5>{this.props.heading}</h5>
            </div>
            <div className="mb-0 text-center"> {this.props.subHeading} </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(CustomerOwnerConfirmModal);
