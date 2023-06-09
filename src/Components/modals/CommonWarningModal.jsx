import React, { Component } from "react";
import { Modal } from "antd";
import { Image as Images } from "../Images";
import { withRouter } from "react-router-dom";

class CommonWarningModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Modal
          title={false}
          visible={this.props.visible}
          onOk={() => {
            if (this.props.handlePostDrawer) {
              this.props.onClose();
              this.props.closePostDrawer();
            } else if (this.props.uomWarning || this.props.retrieveWarning) {
              this.props.okAction();
            } else if (this.props.common || this.props.laborGroupModal) {
              this.props.commonFunc();
            } else if (this.props.deleteWageType) {
              this.props.updateAfterDltdWageType();
            } else if (this.props.commonInternalLocationPopup) {
              this.props.showWarningModal2();
            } else if (this.props.changeAccountTypeConfirmation) {
              this.props.changeAccountType();
            } else if (this.props.addPricingWarning) {
              this.props.confirmClose();
            } else if (this.props.wageInfoDelete) {
              this.props.removeItem();
            } else if (this.props.newCommonModal || this.props.removeContactWarning) {
              this.props.removeConFunc();
            }
            else if(this.props.costSettingWarning) {
              this.props.confirmCloseCost();
            } else if(this.props.totalPricingWarning) {
              this.props.changeTotalPriceTax()

            } else if(this.props.googleSigninModal) {
              this.props.handleGoogleBtnClick();
            }
            else if(this.props.changeAccountType) {
              this.props.handleAccountChange()
            }
            else if(this.props.priceUnitType) {
              this.props.onOk()
            }
            else {
              this.props.history.goBack();
            }
          }}
          onCancel={this.props.onClose}
          centered
          className="confirmation-popup-modal warning-modal"
          okText={
            this.props.resourceWarning ||
            this.props.common ||
            (this.props.wageInfoDelete || this.props.empDelete || this.props.removeContactWarning)
              ? "Yes, I want to remove"
              : this.props.commonDO || this.props.newCommonModal
              ? "Yes, I Do"
              : this.props.changeAccountTypeConfirmation
              ? "Yes, I would like to"
              : this.props.deleteWageType || this.props.wageInfoDelete
              ? "Yes, I want to delete" 
              : this.props.changeAccountType ? "Yes, I want to change" 
              : this.props.costSettingWarning || this.props.editedCheckWarning|| this.props.googleSigninModal ? "Yes, I want to"
              : this.props.totalPricingWarning ? "Yes, I want to"
              : `Yes, I want to ${!this.props.uomWarning ? "exit" : "continue"}`
          }
          cancelText={
            this.props.resourceWarning ||
            this.props.deleteWageType ||
            this.props.wageInfoDelete ||
            this.props.commonInternalLocationPopup ||
            this.props.newCommonModal || this.props.removeContactWarning || this.props.totalPricingWarning
              ? "No, cancel this action"
              : this.props.costSettingWarning || this.props.googleSigninModal ? "No, cancel this action"
              : this.props.changeAccountTypeConfirmation || this.props.retrieveWarning
              ? "No, go back"
              : this.props.uomWarning
              ? "Go back"
              : this.props.match.params.id
              ? "No, continue editing"
              : "No, continue creating"
          }
        >
          <div className="row mx-0 confirm-modal-row warning-modal-row">
            <div className="col-12 text-center">
              <img src={Images.warning_icon} alt="" className="img-fluid" />
              <h5>{this.props.heading}</h5>
              {this.props.subHeadingUOM ? (
                this.props.subHeadingUOM
              ) : (
                <p className="mb-0 mx-auto">
                  {this.props.match.params.id ? (
                    <span>
                      If you choose to exit, only validated data has been saved.
                      If you want to continue editing, click ”No, continue
                      editing”.
                    </span>
                  ) : (
                    <span>
                      Any progress you've made will not be saved. <br />
                      and you cannot undo this action.
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(CommonWarningModal);
