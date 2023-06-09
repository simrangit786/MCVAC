import React, { Component } from "react";
import { Button, Collapse, message } from "antd";
import CreateContact from "../../modals/CreateContact";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformation from "./GeneralInformation";
import CreateDocuments from "./CreateDocuments";
import { withRouter } from "react-router-dom";
import { getOneOpportunities } from "../../../Controller/api/opportunityServices";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { routes } from "../../../Controller/Routes";
import CommonConfirmationModal from "../../modals/CommonConfirmationModal";
import { history } from "../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonWarningModal from "../../modals/CommonWarningModal";
import RequireSuccessModal from "../../modals/requiredDataModals/RequireSuccessModal";
import { checkOpportunityRequired, getActiveKey } from "../../../Controller/utils";
import Team from "./Team";
import CustomerAccounts from "./CustomerAccounts";
import SiteOwnerAccount from "./SiteOwnerAccount";
import UnsavedDataPrompt from "../../modals/UnsavedDataPrompt";

const { Panel } = Collapse;
let opportunitySuccessModal = false;
class CreateOpportunityForm extends Component {
  state = {
    opportunity: null,
    fetching: false,
    contactVisible: false,
    confirmModal: false,
    warningModalVisible: false,
    activeKey: ["1"],
    unsavedExit: false,
    requiredSuccessModalVisible: false,
    required: false,
  };

  setOpportunity = (opportunity, num) => {
    let opp = this.state?.opportunity;
    if (
      opp?.name &&
      opp?.status !== null &&
      opp?.status !== "" &&
      opp?.source !== null &&
      opp?.source !== ""
    ) {
      if (
        opportunity?.customer_contact_accounts?.length &&
        opportunity?.owner_contact_accounts?.length
      ) {
        this.setState({ opportunity, unsavedExit: false });
        if (!this.props.match.params.id && !opportunitySuccessModal) {
          opportunitySuccessModal = true;
          this.setState({ requiredSuccessModalVisible: true });
        }
      } else {
        this.setState(() => {
          return { opportunity };
        });
      }
    } else {
      this.setState(() => {
        return { opportunity, unsavedExit: true };
      });
    }
    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          opportunity,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "5")],
        };
      });
    }
  };

  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };
  showContactInfo = (visible) => {
    this.setState({
      contactVisible: visible,
    });
  };

  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };

  showConfirmModal = (visible) => {
    this.setState({
      confirmModal: visible,
    });
  };

  showWarningModal = (visible) => {
    this.setState({
      warningModalVisible: visible,
    });
  };

  componentDidMount() {
    let editArr = [
      {
        title: "Edit Opportunity",
        url: "",
      },
    ];
    let createArr = [
      {
        title: "Create Opportunity",
        url: "",
      },
    ];
    if (this.props.match.params.id) {
      this.props.setBreadcrumb(editArr);
      // this.fetchOpportunity(this.props.match.params.id)
      this.fetchOpportunity();
      this.setState({ activeKey: this.props.location.editTab || "1" })
    } else {
      this.props.setBreadcrumb(createArr);
    }
  }

  fetchOpportunity = () => {
    let ID = this.props.match.params.id || this.state.opportunity?.id;
    getOneOpportunities(ID)
      .then((res) => {
        this.setState({ opportunity: res.data }, () => {
          if (!this.props.match?.params?.id) {
            let opp = this.state?.opportunity;
            if (
              opp?.customer_contact_accounts?.length &&
              opp?.owner_contact_accounts?.length
            ) {
              this.setState({ opportunity: opp, unsavedExit: false });
            } else {
              this.setState(() => {
                return { opportunity: opp, unsavedExit: true };
              });
            }
          }
        });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).forEach((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  handleViewMainButtonCLick = () => {
    let { opportunity } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.opportunities.view, { id: opportunity.id })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { opportunity, activeKey, unsavedExit } = this.state;
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
          setCancel={() => { this.setState({ required: true }) }}
        />
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <Collapse
                // accordion
                onChange={this.collapseOnChange}
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                activeKey={activeKey}
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
                    opportunity={opportunity}
                    setOpportunity={this.setOpportunity}
                  />
                </Panel>

                <Panel
                  disabled={!opportunity}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0"> Team * </h5>
                        {((this.state.required || this.props.match.params?.id) && checkOpportunityRequired(opportunity, "TEAMS"))
                          &&
                          (<p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)
                        }
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">*/}
                        {/*  Optional*/}
                        {/*</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <Team
                    opportunity={opportunity}
                    setOpportunity={this.setOpportunity}
                  />
                </Panel>

                {/* <Panel disabled={!opportunity} header={
                  <div className="col-12">
                    <div
                      className="row info-card-heading-row align-items-center justify-content-between">
                      <h5 className="mb-0">Accounts & Contacts</h5>
                      <Button
                        className="border-0 p-0 bg-transparent text-uppercase">optional</Button>
                    </div>
                  </div>
                } key="6">
                  <AccountsContacts opportunity={opportunity} setOpportunity={this.setOpportunity} />
                </Panel> */}

                <Panel
                  disabled={!opportunity}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Billing Accounts *
                        </h5>
                        {((this.state.required || this.props.match.params?.id) && checkOpportunityRequired(opportunity, "CUSTOMER"))
                          &&
                          (<p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)
                        }
                      </div>

                    </div>
                  }
                  key="3"
                >
                  <CustomerAccounts
                    opportunity={opportunity}
                    setOpportunity={this.setOpportunity}
                    fetchOpportunity={this.fetchOpportunity}
                  />
                </Panel>

                <Panel
                  disabled={!opportunity}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Site Manager Account *
                        </h5>
                        {((this.state.required || this.props.match.params?.id) && checkOpportunityRequired(opportunity, "OWNER"))
                          &&
                          (<p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)
                        }
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="4"
                >
                  <SiteOwnerAccount
                    opportunity={opportunity}
                    fetchOpportunity={this.fetchOpportunity}
                    setOpportunity={this.setOpportunity}
                  />
                </Panel>

                <Panel
                  disabled={!opportunity}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Documents</h5>
                        {/*<Button*/}
                        {/*  className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="5"
                >
                  <CreateDocuments
                    opportunity={opportunity}
                    setOpportunity={this.setOpportunity}
                  />
                </Panel>
              </Collapse>
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 justify-content-end common-form-btn-row">
                    <Button
                      onClick={() => this.showWarningModal(true)}
                      style={{ margin: "0 8px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!opportunity}
                      onClick={() =>
                        this.state.unsavedExit
                          ? history.push(
                            reverse(routes.dashboard.opportunities.view, {
                              id: opportunity.id,
                            })
                          )
                          : this.handleViewMainButtonCLick()
                      }
                      type={"primary"}
                    >{`View Opportunity`}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CreateContact
          visible={this.state.contactVisible}
          onClose={() => this.showContactInfo(false)}
        />

        <CommonConfirmationModal
          heading={`You’ve successfully ${this.props.match.params.id ? "updated" : "created"
            } this Opportunity!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(routes.dashboard.opportunities.view, {
                      id: opportunity.id,
                    })
                  )
                }
                className="border-0 bg-transparent shadow-none p-0"
              >
                View Opportunity
              </Button>
            </p>
          }
          okAction={() =>
            history.push(
              reverse(routes.dashboard.opportunities.view, {
                id: opportunity.id,
              })
            )
          }
          okTitle={"View Opportunity"}
          visible={this.state.confirmModal}
          onClose={() => this.showConfirmModal(false)}
        />
        <CommonWarningModal
          heading={`Are you sure you want to exit ${this.props.match.params.id ? "editing" : "creating"
            } this Opportunity?`}
          visible={this.state.warningModalVisible}
          onClose={() => this.showWarningModal(false)}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Opportunity, select View Opportunity."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View Opportunity"}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(routes.dashboard.opportunities.view, {
                id: opportunity.id,
              })
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(CreateOpportunityForm)
);
