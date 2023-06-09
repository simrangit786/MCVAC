import React, { Component } from "react";
import { Button, Modal } from "antd";
import { Image as Images } from "../Images";
import { history } from "../../Controller/history";
import { routes } from "../../Controller/Routes";
import CustomerAccountDrawer from '../drawers/customer-account/CustomerAccountDrawer';
import SiteManagerAccountDrawer from "../drawers/site-manager/SiteManagerAccountDrawer";
import { CUSTOMER, CUSTOMER_OWNER, SITE_OWNER } from "../../Controller/userTypes";

class AccountCreateTypeModal extends Component {
  
  state={
    acc_type:false,
    // customerModalVisible:false,
    // ownerModalVisible:false,
  }

  setAccountCallBack = (TYPE, VISIBLE) => {
      this.props.setAccountType(TYPE, VISIBLE);
  }

  render() {
   const {createAccount, ALL_TYPES, PARTIAL_BILLING, PARTIAL_MANAGER} =this.props
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          onOk={this.props.visible}
          onCancel={this.props.onClose}
          centered
          className="confirmation-popup-modal account-type-all"
          okText={false}
          cancelText={false}
        >
          <div className="row mx-0 confirm-modal-row">
            <div className="col-12 text-center">
              <img
                src={Images.questionMarkBgGreenIcons}
                alt=""
                className="img-fluid"
              />
              <h5>What type of account are you creating?</h5>
            </div>
            <div className="col-12">
            {(PARTIAL_BILLING || ALL_TYPES) && 
              <Button
                onClick={()=>{
                  this.props.onClose();
                  if(PARTIAL_BILLING) {
                  this.setAccountCallBack(CUSTOMER, true)
                  }
                  else {
                  // !createAccount ?
                  history.push(routes.dashboard.customer_account.create)
                  // :
                  // this.setState({customerModalVisible: true })
                  }
                }}

                className="account-type-btn-main d-flex align-items-center"
              >
                <img
                  src={Images.persons_sidebar_new}
                  alt=""
                  className="img-fluid"
                />
                <span>Billing</span>
              </Button>
              }
              {(PARTIAL_MANAGER || ALL_TYPES) && 
              <Button
                onClick={()=>{
                  this.props.onClose()
                  if(PARTIAL_MANAGER) {
                  this.setAccountCallBack(SITE_OWNER, true)
                  }
                  else {
                  // !createAccount ?
                  history.push(routes.dashboard.owner_account.create)
                  // :
                  // this.setState({ownerModalVisible: true })}
                }}
              }

                className="account-type-btn-main d-flex align-items-center"
              >
                <img
                  src={Images.persons_sidebar_new}
                  alt=""
                  className="img-fluid"
                />
                <span>Site Manager</span>
              </Button>
              }
              <Button
                onClick={()=>{
                  this.props.onClose();
                  if(PARTIAL_BILLING || PARTIAL_MANAGER) {
                    this.setAccountCallBack(CUSTOMER_OWNER, true)
                  }
                  else {
                  // !createAccount ?
                  history.push(routes.dashboard.customer_owner_account)
                  // :
                  // this.setState({customerModalVisible: true , acc_type:true })}
                }}
              }

                className="account-type-btn-main d-flex align-items-center"
              >
                <img
                  src={Images.persons_sidebar_new}
                  alt=""
                  className="img-fluid"
                />
                <span>Billing & Site Manager</span>
              </Button>
              {ALL_TYPES &&
              <Button
                onClick={()=>{
                  this.props.onClose()
                  // !ALL_TYPES ?
                  history.push(routes.dashboard.vendor_account.create)
                  // :
                  // this.setState({customerModalVisible: true })
              }}

                className="account-type-btn-main d-flex align-items-center"
              >
                <img
                  src={Images.persons_sidebar_new}
                  alt=""
                  className="img-fluid"
                />
                <span>Vendor</span>
              </Button>
              }
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AccountCreateTypeModal;
