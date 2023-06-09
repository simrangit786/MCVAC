import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformation from "./GeneralInformation";
import SitesInfo from "./SitesInfo";
import ContactsInfo from "./ContactsInfo";
import DocsInfo from "./DocsInfo";
import { withRouter, Prompt } from "react-router-dom";
import { getOneOwnerAccount } from "../../../../../Controller/api/ownerAccountServices";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../../Controller/Routes";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import AddressInformation from "../../../customer-account/create/AddressInformation";
import { Image } from "../../../../Images";
import CreateTeams from "./CreateTeams";
import UnsavedDataPrompt from "../../../../modals/UnsavedDataPrompt";
import { checkAccountRequired, getActiveKey } from "../../../../../Controller/utils";
import { handleError } from "../../../../../Controller/Global";
import PaymentInformation from "./PaymentInformation";
import RequireSuccessModal from "../../../../modals/requiredDataModals/RequireSuccessModal";
import RequiredWarningModal from "../../../../modals/requiredDataModals/RequiredWarningModal";


const { Panel } = Collapse;

class CreateOwnerAccount extends Component {
  state = {
    account: null,
    payment: null,
    warningModalVisible: false,
    visibleConfirm: false,
    address: null,
    contacts: null,
    sites: null,
    docs: null,
    unsavedExit: false,
    activeKey: ["1"],
    requiredSuccessModalVisible: false,
    requiredWarningModalVisible: false,
    required: false
  };

  // setAccount = (account) => {
  //     this.setState({ account, unsavedExit: true })
  // };

  setAccount = (account, num) => {
    if (this.state.account?.name) {
      this.setState(() => {
        return { account };
      });
    } else {
        this.setState(() => {
          return { account, unsavedExit: true };
        })
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
    let alreadyExist = null;
    // debugger
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
    this.setState({ payment })
    if (this.state?.sites?.length && this.state?.address) {
      this.setState({ payment, unsavedExit: false });
      if (!this.props.match.params.id) {
        this.setState({ requiredSuccessModalVisible: true });
      }
    } else this.setState({
      payment,
    });
    // if(!this.props.match.params.id) {
    //   this.getOwnerAccount(payment);
    // }
    // this.getOwnerAccount();
    
  };

  showConfirmModal = (visible) => {
    this.setState({
      visibleConfirm: visible,
    });
  };
  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };
  showRequiredWarningModal = (visible) => {
    this.setState({
      requiredWarningModalVisible: visible,
    });
  };

  getOwnerAccount = (id) => {
    getOneOwnerAccount(this.props.match.params.id || id)
      .then((res) => {
        let address = {
          main: res.data.main_address,
          billing: res.data.billing_address,
        };
        this.setState({
          account: res.data,
          payment: res.data.payment_information,
          address,
        });
      })
      .catch((err) => {
        handleError(err);
      });
  }

  componentDidMount() {
    let arrCreate = [
      {
        title: "Create Site Manager Account",
        url: routes.dashboard.owner_account.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Site Manager Account",
        url: routes.dashboard.owner_account.edit,
      },
    ];
    if (this.props.match.params.id) {
      this.props.setBreadcrumb(arrEdit);
      getOneOwnerAccount(this.props.match.params.id)
        .then((res) => {
          let address = {
            main: res.data.main_address,
            billing: res.data.billing_address,
          };
          this.setState({
            account: res.data,
            payment: res.data.payment_information,
            address,
            activeKey: this.props.location.editTab || "1"
          });
        })
        .catch((err) => {
          handleError(err);
        });

    } else {
      this.props.setBreadcrumb(arrCreate);
    }
  }

  checkSiteData = () => {
    const { account } = this.state;
    if(!account?.sites?.length) {
      this.setState({unsavedExit: true})
    } else {
      this.setState({unsavedExit: false})
    }
  }

  getSiteDetail = (data) => {
    // if (this.state?.address && this.state?.payment) {

    //     this.setState({ sites: data, unsavedExit: false });
    //     if (!this.props.match.params.id) {
    //         this.setState({ requiredSuccessModalVisible: true })
    //     }
    // }
    // else
    //     this.setState({ sites: data });
    if (data?.length) {
      this.getOwnerAccount(data[0].account.id)
      if (this.state?.address && this.state?.payment) {
        this.setState({ sites: data, account: {...this.state.account, sites: data}},() => {
          this.checkSiteData()
        });
        if (!this.props.match.params.id) {
          if (!this.props.match.params.id && this.state.sites && (this.state.sites?.map(i => i.id === data.find(i => i.id)))) {
            this.setState({ requiredSuccessModalVisible: false });
          }
          else {
            this.setState({ requiredSuccessModalVisible: true });
          }

        }
        // if (!this.props.match.params.id) { 
        //   this.setState({ requiredSuccessModalVisible: true });
        // }

      } else {
        this.setState({sites: data, account: {...this.state.account, sites: data}},() => {
          this.checkSiteData()
        });
       
      }
    } else {
      this.getOwnerAccount()
  }
  };

  contactCallback = (data) => {
    // console.log(data)
    this.setState({ contacts: data });
  };

  documentsCallback = (data) => {
    this.setState({ docs: data })
  };

  showWarningModal = (visible) => {
    this.setState({
      warningModalVisible: visible,
    });
  };

  setAddress = (address, num) => {
    if (this.state?.sites?.length && this.state?.payment) {
      this.setState({ address, unsavedExit: false });
      if (!this.props.match.params.id) {
        this.setState({ requiredSuccessModalVisible: true });
      }
    } else this.setState({ address });

    let alreadyExist = null;
    // debugger
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find(i => i == num);
    }
    if (!alreadyExist) {
      this.setState(prevState => {
        return { address, activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")] }
      })
    }
    // if(!this.props.match.params.id) {
    //   this.getOwnerAccount(address.main)
    // }
    // this.getOwnerAccount()
  };
  // setAddress = (address, num) => {
  //     let alreadyExist = null;
  //     if (this.state.activeKey.length > 1) {
  //         alreadyExist = this.state.activeKey.find(i => i == num);
  //     }
  //     if (!alreadyExist) {
  //         this.setState(prevState => {
  //             return { address, activeKey: [...prevState.activeKey, ...getActiveKey(num - 2, "6")] }
  //         })
  //     }
  // };

  handleCollapseChange = (activeKey) => {
    this.setState({ activeKey });
  };

  handleViewMainButtonCLick = () => {
    let { account } = this.state;
    if (this.props?.match?.params?.id) {
      this.setState(
        { unsavedExit: false },
        history.push(
          reverse(routes.dashboard.owner_account.view, { id: account.id })
        )
      );
    } else {
      this.showConfirmModal(true);
    }
  };
  render() {
    let { account, address, sites, contacts, docs, activeKey, payment, sitesDetail } =
      this.state;
    return (
      <React.Fragment>
        {/* <UnsavedDataPrompt unsavedExit={this.state.unsavedExit} exit={true} message={""} /> */}
        <UnsavedDataPrompt
          // unsavedExit={this.state.unsavedExit} exit={true} message={""}
          when={this.state.unsavedExit}
          title="You haven't added all of the required information."
          cancelText="Continue"
          okText="Exit"
          onOK={() => true}
          onCancel={() => false}
          setCancel= {()=>{this.setState({required:true})}}
        />
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <Collapse
                //   accordion
                activeKey={activeKey}
                onChange={this.handleCollapseChange}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                defaultActiveKey={
                  this.props.location.editTab
                    ? [this.props.location.editTab]
                    : ["1"]
                }
              >
                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5
                          className={
                            account && account.name !== ""
                              ? "panel-title mb-0"
                              : "mb-0"
                          }
                        >
                          General Information <sup>*</sup>
                        </h5>
                        {/* 
                        {
                          account && account.name !== "" ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
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
                        <h5
                          className={
                            payment?.tax_exemption != null
                              ? "panel-title mb-0"
                              : "mb-0"
                          }
                        >
                          Payment Information
                        </h5>
                        {/* {(this.state.required || this.props.match.params.id) && checkAccountRequired(account,"PAYMENT") && (
                          <p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)} */}
                        {/* {
                          payment?.tax_exemption != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
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
                        <h5
                          className={
                            address?.billing != null || address?.main != null
                              ? "panel-title mb-0"
                              : "mb-0"
                          }
                        >
                          Address Information
                        </h5>
                        {/* {(this.state.required || this.props.match.params.id) && checkAccountRequired(account,"ADDRESS") && (
                          <p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)} */}
                        {/* {
                          address?.billing != null || address?.main != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="3"
                >
                  <AddressInformation
                    account={account}
                    address={address}
                    setAddress={this.setAddress}
                  // setAccount={this.setAccount}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5
                          className={
                            sites?.length > 0 ? "panel-title mb-0" : "mb-0"
                          }
                        >
                          Sites <sup>*</sup>
                        </h5>
                        {(this.state.required || this.props.match.params.id) && checkAccountRequired(account,"SITES") && (
                          <p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)}
                        {/* {
                          sites?.length > 0 ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="4"
                >
                  <SitesInfo
                    account={account}
                    getSiteDetail={this.getSiteDetail}
                    setAccount={this.setAccount}
                    address = {address}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5
                          className={
                            contacts && contacts.length > 0
                              ? "panel-title mb-0"
                              : "mb-0"
                          }
                        >
                          Contacts
                        </h5>
                        {/* {
                          contacts && contacts.length > 0 ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="5"
                >
                  <ContactsInfo
                    account={account}
                    contactCallback={this.contactCallback}
                    setAccount={this.setAccount}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5
                          className={
                            // contacts && contacts.length > 0 ? "panel-title mb-0" :
                            "mb-0"
                          }
                        >
                          Team
                        </h5>
                        {/* {contacts && contacts.length > 0 ?
                                                <img alt={''} className="img-fluid" src={Image.create_ac_checkmark}/>
                                                : */}
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                      </div>
                    </div>
                  }
                  key="6"
                >
                  <CreateTeams
                    account={account}
                    contactCallback={this.contactCallback}
                    setAccount={this.setAccount}
                  />
                </Panel>
                <Panel
                  disabled={!account}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5
                          className={
                            docs && docs.length > 0
                              ? "panel-title mb-0"
                              : "mb-0"
                          }
                        >
                          Documents
                        </h5>
                        {/* {docs && docs.length > 0 ? (
                          <img
                            alt={""}
                            className="img-fluid"
                            src={Image.create_ac_checkmark}
                          />
                        ) : (
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>
                          ""
                        )} */}
                      </div>
                    </div>
                  }
                  key="7"
                >
                  <DocsInfo
                    account={account}
                    documentsCallback={this.documentsCallback}
                  />
                </Panel>
              </Collapse>
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 justify-content-end common-form-btn-row">
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        this.state.unsavedExit
                          ? history.push(routes.dashboard.owner_account.self)
                          : this.showWarningModal(true);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!account}
                      onClick={() =>
                        this.state.unsavedExit
                          ? history.push(
                            reverse(routes.dashboard.owner_account.view, {
                              id: account.id,
                            })
                          )
                          : this.handleViewMainButtonCLick()
                      }
                      type={"primary"}
                    >
                      {"View Account"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={"You’ve successfully created this Site Manager Account!"}
          subHeading={
            <p className="mb-0">
              To view, select{" "}
              <Button
                onClick={() =>
                  history.push(
                    reverse(routes.dashboard.owner_account.view, {
                      id: account.id,
                    })
                  )
                }
                className="border-0 shadow-none p-0 bg-transparent"
              >
                View Site Manager Account.
              </Button>
            </p>
          }
          okTitle={"View Site Manager Account"}
          okAction={() => {
            this.setState(
              { unsavedExit: false },
              history.push(
                reverse(routes.dashboard.owner_account.view, { id: account.id })
              )
            );
          }}
          visible={this.state.visibleConfirm}
          onClose={() => this.showConfirmModal(false)}
        />
        <CommonWarningModal
          heading={
            this.props.match.params.id
              ? "Are you sure you want to exit editing this Site Manager Account?"
              : "Are you sure you want to exit creating this Site Manager Account?"
          }
          visible={this.state.warningModalVisible}
          onClose={() => this.showWarningModal(false)}
          okAction={() => {
            this.setState({ unsavedExit: false }, () => {
              history.push(routes.dashboard.owner_account.self);
            });
          }}
          uomWarning={true}
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
              reverse(routes.dashboard.owner_account.view, { id: account.id })
            );
          }}
        />
        {/* <RequiredWarningModal
                    visible={this.state.requiredWarningModalVisible}
                    heading={"You haven't added all of the required information."}
                    subHeading={"Not add the required information may cause issues down the line.If you'd like to continue adding information, select Continue.If you would like to exit anyway, select Exit."}
                    onClose={() => { this.showRequiredWarningModal(false) }}
                    onOK={() => { this.setState({ unsavedExit: false }, () => { this.showRequiredWarningModal(false); history.push(reverse(routes.dashboard.owner_account.view, { id: account.id })) }) }}
                /> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
};

export default connect(mapStateToProps, { setBreadcrumb })(
  withRouter(CreateOwnerAccount)
);
