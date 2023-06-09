import React, { Component } from "react";
import { Button, Collapse, message } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformation from "./GeneralInformation";
import ProposalCustomerAccounts from "./ProposalCustomerAccounts";
import ProposalLineItems from "./ProposalLineItems";
import ProposalDocuments from "./ProposalDocuments";
import { addProposalPdf, generateMultipleProposals, getProposalById, getProposalGeneratePdf } from "../../../Controller/api/proposalServices";
import { handleError } from "../../../Controller/Global";
import CommonConfirmationModal from "../../modals/CommonConfirmationModal";
import RequireSuccessModal from "../../modals/requiredDataModals/RequireSuccessModal";
import { history } from "../../../Controller/history";
import { reverse } from "named-urls/src";
import { routes } from "../../../Controller/Routes";
import CommonWarningModal from "../../modals/CommonWarningModal";
import ProposalOwnerSites from "./ProposalOwnerSites";
import { checkProposalRequired, getActiveKey } from "../../../Controller/utils";
import ProposalTeamsCreate from "./ProposalTeamsCreate";
import UnsavedDataPrompt from "../../modals/UnsavedDataPrompt";
import { getRegion } from "../../../Controller/api/vehicleServices";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";

const { Panel } = Collapse;

class ProposalCreateMain extends Component {
  state = {
    proposal: null,
    visibleConfirm: false,
    warningModalVisible: false,
    activeKey: ["1"],
    unsavedExit: false,
    requiredSuccessModalVisible: false,
    regions: [],
    multiple_created: false,
    required:false,
  };
  showWarningModal = (visible) => {
    this.setState({
      warningModalVisible: visible,
    });
    if (visible) {
      this.callMultiple()
    }
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
  setProposal = (proposal, num) => {
    if (this.state.proposal?.name) {
      if (
        // proposal?.documents?.length > 0 && 
        proposal?.sales_manager.length && proposal?.sales_assistant.length &&
        proposal?.sales_person.length && proposal?.customer_contact.length &&
        proposal?.owner_contact.length && proposal?.cost_setting && proposal?.tax_basis &&
        proposal?.payment_terms && proposal?.deposit &&
        proposal?.service_variant_count > 0) {
        // console.log("second");
        this.setState(() => {
          return { proposal, unsavedExit: false };
        });
        // if (!this.props.match.params.id) {
        //   this.setState({ requiredSuccessModalVisible: true });
        // }
      } else {
        this.setState(() => {
          return { proposal };
        });
      }
    } else {
      this.setState(() => {
        return { proposal, unsavedExit: true };
      });
    }
    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          proposal,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
        };
      });
    }
    // this.setState({proposal, activeKey: getActiveKey(this.state.activeKey, "5")})
  };
  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };
  fetchProposal = (id) => {
    getProposalById(
      this.props.match.params.id ? this.props.match.params.id : id
    )
      .then((res) => {
        this.setState({ proposal: res.data }, () => {
          if (this.state.proposal?.name
            // && this.state?.proposal?.opportunity
            && !this.props.match.params.id) {
            // if (this.props.match.params.id) {
            //   // do nothing
            // } else {
            this.setState({ unsavedExit: false });
            // }
          } else {
            this.setState({ unsavedExit: true });
          }
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };
  fetchRegion = () => {
    getRegion()
      .then((res) => {
        this.setState({ regions: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };
  componentDidMount() {
    let arr = [];
    if (this.props.match.params.id) {
      this.fetchProposal();
      this.fetchRegion();
      this.setState({ activeKey: this.props.location.editTab || "1" })
      arr = [{ title: 'Edit Proposal', url: '' }]
    }
    else {
      arr = [{ title: 'Create Proposal', url: '' }]
    }
    this.props.setBreadcrumb(arr)
  }
  handleViewMainButtonCLick = () => {
    let { proposal } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.sales.proposal.view, { id: proposal.id })
      );
    } else {
      this.showConfirmModal(true);
    }
  };
  createMultipleProposals = () => {
    generateMultipleProposals({ proposal: this.state.proposal.id ? this.state.proposal.id : this.props.match.params.id }).then(() => {
      // message.success('Multiple generated!')
      this.setState({ multiple_created: true })
    }).catch(err => {
      handleError(err)
    })
  }

  handleCreatepdf = () => {
    const params = {
      proposal: this.state.proposal?.id 
    }
    addProposalPdf(params).then(res => {
      console.log(res);
    }).catch((err) => {
      handleError(err);
    })
  }
  callMultiple = () => {
    const { proposal } = this.state;
    if (this.props.location.pathname.includes('create') && !this.state.multiple_created) {
      this.handleCreatepdf()
      this.createMultipleProposals()
      history.push(
        reverse(routes.dashboard.sales.proposal.view, {
          id: proposal.id,
        })
      )
    }
  }
  render() {
    let { proposal, activeKey, regions } = this.state;
    let CREATE_SCREEN = this.props.location.pathname.includes('create')
    return (
      <React.Fragment>
        {/* <UnsavedDataPrompt unsavedExit={this.state.unsavedExit} exit={true} message={""} /> */}
        <UnsavedDataPrompt
          // unsavedExit={this.state.unsavedExit} exit={true} message={""}
          when={this.state.unsavedExit && !this.props.match.params.id}
          title="Are you sure you want to exit creating this proposal?"
          cancelText="Continue with proposal"
          unsavedText={"Exiting proposal creation without adding all of the required information may cause issues. To avoid issues, please continue and finish this proposal. If you would like to exit anyway, select Exit."}
          okText="Exit"
          onOK={() => {
            this.callMultiple()
            return true
          }}
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
                activeKey={activeKey}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
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
                    proposal={proposal}
                    setProposal={this.setProposal}
                  />
                </Panel>
                <Panel
                  disabled={!proposal}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Team *</h5>
                         {((this.state.required || this.props.match.params?.id) && checkProposalRequired(proposal, "TEAMS"))
                          &&
                          (<p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)
                        }
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <ProposalTeamsCreate
                    proposal={proposal}
                    setProposal={this.setProposal}
                    fetchProposal={this.fetchProposal}
                  />
                </Panel>
                <Panel
                  disabled={!proposal}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">{CREATE_SCREEN ? 'Billing Accounts' : 'Billing Account'} *</h5>

                        {((this.state.required || this.props.match.params?.id) && checkProposalRequired(proposal, "CUSTOMER"))
                          &&
                          (<p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)
                        }
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="3"
                >
                  <ProposalCustomerAccounts
                    fetchProposal={this.fetchProposal}
                    proposal={proposal}
                    setProposal={this.setProposal}
                  />
                </Panel>
                <Panel
                  disabled={!proposal}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Site Manager Account *</h5>

                        {((this.state.required || this.props.match.params?.id) && checkProposalRequired(proposal, "OWNER"))
                          &&
                          (<p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)
                        }
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="4"
                >
                  <ProposalOwnerSites
                    fetchProposal={this.fetchProposal}
                    proposal={proposal}
                    setProposal={this.setProposal}
                  />
                </Panel>
                <Panel
                  disabled={!proposal}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Service Variants <sup>*</sup>
                        </h5>

                        {((this.state.required || this.props.match.params?.id) && checkProposalRequired(proposal, "SERVICE_VARIENT"))
                          &&
                          (<p className="mb-0 info-signifire">
                            Please complete required information to avoid issues
                          </p>)
                        }
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="5"
                >
                  <ProposalLineItems
                    proposal={proposal}
                    setProposal={this.setProposal}
                    fetchProposal={this.fetchProposal}
                    regions={regions}
                  />
                </Panel>

                <Panel
                  disabled={!proposal}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Documents
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="6"
                >
                  <ProposalDocuments
                    proposal={proposal}
                    setProposal={this.setProposal}
                    fetchProposal={this.fetchProposal}
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
                      style={CREATE_SCREEN ? { width: '37%' } : {}}
                      onClick={() => {
                        this.callMultiple()
                        if (this.state.unsavedExit) {
                          history.push(
                            reverse(routes.dashboard.sales.proposal.view, {
                              id: proposal.id,
                            })
                          )
                        }
                        else {
                          this.handleViewMainButtonCLick()
                        }
                      }
                      }
                      disabled={!proposal}
                      type={"primary"}
                    >{CREATE_SCREEN ? 'Complete Creation (for all Billing Accounts)' : 'View Proposal'}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={this.props.match.params.id ? `You’ve successfully updated this Proposal!` : `Proposal Created Successfully!`}
          subHeading={
            this.props.match.params.id ?
              <p className="mb-0">
                To view, select &nbsp;
                <Button
                  onClick={() => {
                    if (window.location.href.includes('create')) {
                      history.push(reverse(routes.dashboard.sales.proposal.self))
                    }
                    else {
                      history.push(
                        reverse(routes.dashboard.sales.proposal.view, {
                          id: proposal.id,
                        })
                      )
                    }
                  }
                  }
                  className="border-0 bg-transparent shadow-none p-0"
                >
                  View Proposal.
                </Button>
                .
              </p>
              :
              <p className="mb-0">
                If there were multiple billing accounts on this proposal, a proposal was created for each one.
              </p>
          }
          visible={this.state.visibleConfirm}
          okAction={() => {
            if (window.location.href.includes('create')) {
              history.push(reverse(routes.dashboard.sales.proposal.self))
            }
            else {
              history.push(
                reverse(routes.dashboard.sales.proposal.view, { id: proposal.id })
              )
            }
          }
          }
          okTitle={"View Proposal"}
          onClose={() => this.showConfirmModal(false)}
        />
        <CommonWarningModal
          heading={`Are you sure you want to exit ${this.props.match.params.id ? "editing" : "creating"
            } this Proposal?`}
          visible={this.state.warningModalVisible}
          onClose={() => this.showWarningModal(false)}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"Proposal(s) created successfully."}
          subHeading={
            "If there were multiple billing accounts on this proposal, a proposal was created for each one."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View Proposal"}
          onOK={() => {
            this.callMultiple()
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(routes.sales.proposal.view, { id: proposal.id })
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(withRouter(ProposalCreateMain));
