import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformation from "./GeneralInformation";
import PaymentInformation from "./PaymentInformation";
import AddressInformation from "./AddressInformation";
import ContactsInfo from "./ContactsInfo";
import DocsInfo from "./DocsInfo";
import SitesInfo from "./SitesInfo";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/src";
import { routes } from "../../../../Controller/Routes";
import CustomerOwnerConfirmModal from "../../../modals/CustomerOwnerConfirmModal";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { checkAccountRequired, getActiveKey } from "../../../../Controller/utils";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";

const { Panel } = Collapse;

class CreateCustomerOwnerAccount extends Component {
  state = {
    account: null,
    payment: null,
    address: null,
    warningModalVisible: false,
    visibleConfirm: false,
    unsavedExit: false,
    requiredSuccessModalVisible: false,
    activeKey: ["1"],
    required: false
  };

  setAccount = (account, num) => {
    if (this.state?.account?.name && this.state?.account?.account_type) {
      this.setState({ account });
    } else {
      this.setState({ account, unsavedExit: true });
    }

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          account,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
        };
      });
    }
  };
  setPayment = (payment, num) => {
    // this.setState({ payment })
    if (this.state?.sites?.length && this.state?.address) {
      this.setState({ payment, unsavedExit: false });
    } else this.setState({ payment });

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          payment,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
        };
      });
    }
  };
  setAddress = (address, num) => {
    // this.setState({ address })
    if (this.state?.sites?.length && this.state?.payment) {
      this.setState({ address, unsavedExit: false });
    } else this.setState({ address });

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          address,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
        };
      });
    }
  };

  getSiteDetail = (data) => {
    // if (this.state?.address && this.state?.payment) {
    //     this.setState({ sites: data, unsavedExit: false });
    // }
    // else {
    //     if (data?.length) {
    //         this.setState({ sites: data });
    //     }
    //     else {
    //         this.setState({ sites: data, unsavedExit: true });
    //     }
    //     // this.setState({ sites: data });
    // }
    this.setState({account: {...this.state.account,sites:data}})
    if (data?.length) {
      if (this.state?.address && this.state?.payment) {
        this.setState({ sites: data, unsavedExit: false });
        if (!this.props.match.params.id) {
          this.setState({ requiredSuccessModalVisible: true });
        }
      } else {
        this.setState({ sites: data, unsavedExit: true });
      }
    } else {
      this.setState({ sites: data, unsavedExit: true });
    }
  };
  showConfirmModal = (visible) => {
    this.setState({
      visibleConfirm: visible,
    });
  };

  showWarningModal = (visible) => {
    this.setState({
      warningModalVisible: visible,
    });
  };
  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };

  viewOwner = (id) => {
    history.push(reverse(routes.dashboard.owner_account.view, { id }));
    this.setState({ visibleConfirm: false });
  };
  viewCustomer = (id) => {
    history.push(reverse(routes.dashboard.customer_account.view, { id }));
    this.setState({ visibleConfirm: false });
  };

  componentDidMount() {
    this.props.setBreadcrumb([
      {
        title: "Create Billing & Site Manager Account",
        url: routes.dashboard.owner_account.create,
      },
    ]);
  }

  handleCollapseChange = (activeKey) => {
    this.setState({ activeKey });
  };
  render() {
    let { account, payment, address, activeKey } = this.state;
    return (
      <React.Fragment>
        <UnsavedDataPrompt
          // unsavedExit={this.state.unsavedExit} exit={true} message={""}
          when={this.state.unsavedExit}
          title="You haven't added all of the required information."
          cancelText="Continue"
          okText="Exit"
          onOK={() => true}
          onCancel={() => false}
          setCancel={() => { this.setState({ required: true }) }}
        />
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <Collapse
                //   accordion
                activeKey={activeKey}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                defaultActiveKey={this.props.location.editTab ? [this.props.location.editTab] : ["1"]}
                onChange={this.handleCollapseChange}

              >
                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          General Information <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <GeneralInformation
                    account={account}
                    setAccount={this.setAccount}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Payment Information <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                        {(this.state.required || this.props.match.params.id) && checkAccountRequired(payment, "CUSTOMEROWNER_PAYMENT") && (
                          <p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <PaymentInformation
                    account={account}
                    payment={payment}
                    setPayment={this.setPayment}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Address Information <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                        {(this.state.required || this.props.match.params.id) && checkAccountRequired(address, "ADDRESS") && (
                          <p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)}
                      </div>
                    </div>
                  }
                  key="3"
                >
                  <AddressInformation
                    account={account}
                    address={address}
                    setAddress={this.setAddress}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Sites <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                        {(this.state.required || this.props.match.params.id) && checkAccountRequired(account, "SITES") && (
                          <p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)}
                      </div>
                    </div>
                  }
                  key="4"
                >
                  <SitesInfo
                    account={account}
                    setAccount={this.setAccount}
                    getSiteDetail={this.getSiteDetail}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Contacts</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                      </div>
                    </div>
                  }
                  key="5"
                >
                  <ContactsInfo
                    account={account}
                    setAccount={this.setAccount}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Documents</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="6"
                >
                  <DocsInfo account={account} setAccount={this.setAccount} />
                </Panel>
              </Collapse>
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 justify-content-end common-form-btn-row">
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => this.showWarningModal(true)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!account}
                      onClick={() => this.showConfirmModal(true)}
                      type={"primary"}
                    >
                      View Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CustomerOwnerConfirmModal
          heading={
            "You’ve successfully created this Billing & Site Manager Account!"
          }
          subHeading={
            <div style={{ paddingLeft: "5%" }}>
              <p className="m-0">
                To view this account as a Billing, select{" "}
                <Button
                  onClick={() => this.viewCustomer(account ? account.id : null)}
                  className="border-0 shadow-none p-0 bg-transparent"
                >
                  View as Billing.
                </Button>
              </p>
              <p className="m-0 siteowner-row">
                To view this account as a Site Manager, select{" "}
                <Button
                  onClick={() => this.viewOwner(account ? account.id : null)}
                  className="border-0 shadow-none p-0 bg-transparent"
                >
                  View as Site Manager.
                </Button>
              </p>
            </div>
          }
          id={account ? account.id : null}
          visible={this.state.visibleConfirm}
          onClose={() => this.setState({ visibleConfirm: false })}
        />
        <CommonWarningModal
          heading={
            this.props.match.params.id
              ? "Are you sure you want to exit editing this Billing & Site Manager Account?"
              : "Are you sure you want to exit creating this Billing & Site Manager Account?"
          }
          visible={this.state.warningModalVisible}
          onClose={() => this.showWarningModal(false)}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the account, select View Account."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(routes.dashboard.customer_account.view, {
                id: account.id,
              })
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(CreateCustomerOwnerAccount);
