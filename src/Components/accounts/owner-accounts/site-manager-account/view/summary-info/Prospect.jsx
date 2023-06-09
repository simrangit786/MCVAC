import React, { Component } from "react";
import { Button, Collapse, Form, Input } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../../../Images";
import { connect } from "react-redux";
import Sites from "../Sites";
import ContactsInfo from "../ContactsInfo";
import DocumentsInfo from "../DocumentsInfo";
import { routes } from "../../../../../../Controller/Routes";
import { history } from "../../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import OwnerPostTab from "../OwnerPostTab";
import AddressInfo from "../../../../customer-account/view/AddressInfo";
import OpportunityInfo from "../OpportunityInfo";
import AssociatedAccounts from "../AssociatedAccounts";
import CustomerOwnerConfirmModal from "../../../../../modals/CustomerOwnerConfirmModal";
import {
  CUSTOMER_OWNER,
  userTypes,
} from "../../../../../../Controller/userTypes";
import { updateOwnerAccount } from "../../../../../../Controller/api/ownerAccountServices";
import { withRouter } from "react-router-dom";
import ActivityInfo from "../../../../common/ActivityInfo";
import TeamInfo from "../TeamInfo";
import CommonWarningModal from "../../../../../modals/CommonWarningModal";
import { handleError } from "../../../../../../Controller/Global";
import ProposalInfo from "../ProposalInfo";
import { checkAccountRequired } from "../../../../../../Controller/utils";

const { Panel } = Collapse;

function callback(key) {
  // console.log(key);
}

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

class Prospect extends Component {
  state = {
    visibleTaskCreate: false,
    visibleCreateNote: false,
    visibleViewContact: false,
    visibleCreateContact: false,
    visibleViewAccount: false,
    visibleAddAccount: false,
    visibleConfirm: false,
    updated_owner: null,
    visibleWarning: false,
  };

  showCreateTask = (visible) => {
    this.setState({
      visibleTaskCreate: visible,
    });
  };

  showCreateNote = (visible) => {
    this.setState({
      visibleCreateNote: visible,
    });
  };

  showViewContact = (visible) => {
    this.setState({
      visibleViewContact: visible,
    });
  };

  showCreateContact = (visible) => {
    this.setState({
      visibleCreateContact: visible,
    });
  };

  showViewAccount = (visible) => {
    this.setState({
      visibleViewAccount: visible,
    });
  };

  showAddAccount = (visible) => {
    this.setState({
      visibleAddAccount: visible,
    });
  };

  updateAccountRole = () => {
    updateOwnerAccount(this.props.match.params.id, {
      account_type: CUSTOMER_OWNER,
    })
      .then((response) => {
        this.setState({
          visibleConfirm: true,
          visibleWarning: false,
          updated_owner: response.data,
        });
      })
      .catch((err) => {
        handleError(err);
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

  render() {
    let { owner } = this.props;
    let { updated_owner } = this.state;
    var acc_source;
    if (owner && owner.account_source) {
      if (owner.account_source.indexOf("_") != -1) {
        acc_source = owner.account_source.toLowerCase().replace(/_/g, " ");
      } else {
        acc_source = owner.account_source.toLowerCase();
      }
    } else {
      acc_source = "-";
    }

    if (!owner.id) return <div />;
    return (
      <React.Fragment>
        <div className="col-12">
          <div className="row summary-info-inner-row">
            <div className="col-12">
              <Collapse
                // accordion
                defaultActiveKey={["1"]}
                onChange={callback}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        General Information<sup>*</sup>
                      </span>
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.owner_account.edit,
                              { id: owner.id }
                            ),
                            editTab: "1",
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                  }
                  key="1"
                >
                  <div className="row summary-collapse-inner-row-main">
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase ">ACCOUNT NAME</h6>
                      <h5 className="font-weight-bold">{owner.name}</h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase">ACCOUNT TYPE</h6>
                      <h5
                        style={{ textTransform: "capitalize", minWidth: 300 }}
                        className="mb-0"
                      >
                        {updated_owner?.account_type === CUSTOMER_OWNER ||
                        owner.account_type === CUSTOMER_OWNER ? (
                          <div>
                            <a className={"activeRole"}>
                              {" "}
                              {userTypes.SITE_OWNER}{" "}
                            </a>
                            <a
                              className="nonActiveRole ml-2"
                              onClick={() => {
                                history.push(
                                  reverse(
                                    routes.dashboard.customer_account.view,
                                    { id: owner.id }
                                  )
                                );
                              }}
                            >
                              {userTypes.CUSTOMER}
                            </a>
                          </div>
                        ) : (
                          <div>
                            <span>{userTypes[owner.account_type]}</span>
                            <br />
                            <span>
                              <button
                                className="create-account mt-2"
                                onClick={() =>
                                  this.setState({ visibleWarning: true })
                                }
                              >
                                + Billing account
                              </button>
                            </span>
                          </div>
                        )}
                      </h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase">Industry</h6>
                      <h5>{owner?.industry?.title || "-"}</h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase">Website</h6>
                      <h5>
                        <a href={`https://${owner?.website}`} target="_blank">
                          {owner?.website || (
                            <span className="text-dark">-</span>
                          )}
                        </a>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase">Account Source</h6>
                      <h5 className="text-capitalize">{acc_source || "-"}</h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase">Note</h6>
                      <h5>{owner?.note || "-"}</h5>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Posts</span>
                    </div>
                  }
                  key="10"
                >
                  <OwnerPostTab {...this.props} hideTitle />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Activity </span>
                    </div>
                  }
                  key="13"
                >
                  <ActivityInfo
                    {...this.props}
                    hideTitle
                    hideSearch
                    owner={true}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Payment Information 
                      </span>
                      <div className="d-flex align-items-center">
                      {/* {checkAccountRequired(this.props.owner,"PAYMENT") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)} */}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.owner_account.edit,
                              { id: owner.id }
                            ),
                            editTab: "2",
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                      </div>
                    </div>
                  }
                  key="2"
                >
                  {
                    // owner.payment_information ?
                        (
                    <div className="row summary-collapse-inner-row-main">
                      {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                     <h6 className="text-uppercase">CREDIT RATING</h6>
                                     <h5>{owner.payment_information.credit_rating || " - "}</h5>
                                   </div>
                                   <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                     <h6 className="text-uppercase">CREDIT LIMIT</h6>
                                     <h5 className="mb-0">{owner.payment_information.credit_limit || " - "}</h5>
                                   </div>
                                   <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                     <h6 className="text-uppercase">DUNS NUMBER</h6>
                                     <h5 className="mb-0">{owner.payment_information.duns_number || " - "}</h5>
                                   </div>
                                   <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                     <h6 className="text-uppercase">EIN</h6>
                                     <h5 className="mb-0">{owner.payment_information.ein || "-"}</h5>
                                   </div>
                                   <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                     <h6 className="text-uppercase">PAYMENT TERM</h6>
                                     <h5 className="mb-0">{owner.payment_information.payment_term || " - "}</h5>
                                   </div>
                                   <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                     <h6 className="text-uppercase">SALES TAX TYPE</h6>
                                     <h5 className="mb-0">{owner.payment_information.sales_tax_type || " - "}</h5>
                                   </div>
                                   <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                     <h6 className="text-uppercase">ARCHIVED?</h6>
                                     <h5 className="mb-0">-</h5>
                                   </div>
                                   <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                     <h6 className="text-uppercase">ENTITY TYPE</h6>
                                     <h5 className="mb-0">{owner.payment_information.entity_type || "-"}</h5>
                                   </div> */}
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                        <h6 className="text-uppercase">
                          Sales Tax Exemption Status
                        </h6>
                        {/* <h5 className="mb-0">{owner.payment_information.tax_exemption ? "Yes" : "No" || " - "}</h5> */}
                        <h5 className="mb-0">
                          {owner.payment_information?.tax_exemption
                            ? "Exempt"
                            : "Non Exempt" || " - "}
                        </h5>
                      </div>
                    </div>
                  )
                  //   : (
                  //   <div className="col-12 pay-info">
                  //     <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  //       <div className="col-12 text-center">
                  //         <img
                  //           src={Images.pricing_icon}
                  //           alt=""
                  //           className="img-fluid mb-2"
                  //           width={35}
                  //         />
                  //         <h6 className="mb-0 approved-btn">
                  //           No Payment Information added
                  //         </h6>
                  //       </div>
                  //     </div>
                  //   </div>
                  // )
                  }
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Address Information 
                      </span>
                      <div className="d-flex align-items-center">
                      {/* {checkAccountRequired(this.props.owner,"ADDRESS") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)} */}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.owner_account.edit,
                              { id: owner.id }
                            ),
                            editTab: "3",
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                      </div>
                    </div>
                  }
                  key="3"
                >
                  <AddressInfo hideTitle={true} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Sites <sup>*</sup>
                      </span>
                      <div className="d-flex align-items-center">
                      {checkAccountRequired(this.props.owner,"SITES") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.owner_account.edit,
                              { id: owner.id }
                            ),
                            editTab: "4",
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                      </div>
                    </div>
                  }
                  key="4"
                >
                  <Sites {...this.props} hideTitle={true} viewAll={false} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Contacts </span>
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.owner_account.edit,
                              { id: owner.id }
                            ),
                            editTab: "5",
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                  }
                  key="5"
                >
                  <ContactsInfo {...this.props} hideTitle={true} viewAll={false}/>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Team </span>
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.owner_account.edit,
                              { id: owner.id }
                            ),
                            editTab: "6",
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                  }
                  key="6"
                >
                  <TeamInfo {...this.props} hideTitle={true} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Documents</span>
                    </div>
                  }
                  key="7"
                >
                  <DocumentsInfo {...this.props} hideTitle={true} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Associated Accounts</span>
                    </div>
                  }
                  key="8"
                >
                  <AssociatedAccounts {...this.props} hideTitle />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Opportunities</span>
                    </div>
                  }
                  key="9"
                >
                  <OpportunityInfo {...this.props} hideTitle />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Proposals</span>
                    </div>
                  }
                  key="14"
                >
                  <ProposalInfo {...this.props} hideTitle viewAll={false} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Projects</span>
                    </div>
                  }
                  key="11"
                >
                  <div className="col-12">
                    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="d-flex align-items-center">
                        <div className="search-bar-div">
                          <Form className="position-relative">
                            <Input placeholder="Search" />
                            <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                              <img
                                src={Images.search_icon_gray}
                                className="img-fluid"
                                alt="search icon"
                              />
                            </Button>
                          </Form>
                        </div>
                        {/* <Button className="add-btn-collapse text-uppercase">CREATE</Button> */}
                      </div>
                      <Button
                        className="view-all-btn text-uppercase"
                        onClick={() => this.props.tabChange("8")}
                      >
                        VIEW ALL
                      </Button>
                    </div>
                    <div className="row summary-collapse-inner-row-main px-0 pb-0">
                      {/*when-no-data-is-available*/}
                      <div className="col-12">
                        <div className="row no-data-upload-screens no-data-second m-0 border-0">
                          <div className="col-12 text-center">
                            <img
                              src={Images.folder_gray_no_data}
                              alt=""
                              className="img-fluid"
                            />
                            <h6 className="mb-0 text-gray-tag">No Projects</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Work Orders</span>
                    </div>
                  }
                  key="12"
                >
                  <div className="col-12">
                    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="d-flex align-items-center">
                        <div className="search-bar-div">
                          <Form className="position-relative">
                            <Input placeholder="Search" />
                            <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                              <img
                                src={Images.search_icon_gray}
                                className="img-fluid"
                                alt="search icon"
                              />
                            </Button>
                          </Form>
                        </div>
                        <Button className="add-btn-collapse text-uppercase">
                          CREATE
                        </Button>
                      </div>
                      <Button
                        className="view-all-btn text-uppercase"
                        onClick={() => this.props.tabChange("9")}
                      >
                        VIEW ALL
                      </Button>
                    </div>
                    <div className="row summary-collapse-inner-row-main px-0 pb-0">
                      {/*when-no-data-is-available*/}
                      <div className="col-12">
                        <div className="row no-data-upload-screens no-data-second m-0 border-0">
                          <div className="col-12 text-center">
                            <img
                              src={Images.work_setting}
                              alt=""
                              className="img-fluid"
                            />
                            <h6 className="mb-0 text-gray-tag">
                              No Work Order
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </div>

          <CommonWarningModal
            heading={
              "Are you sure you want this account to function as  Billing & Site Manager Account?"
            }
            subHeadingUOM={
              <p
                style={{
                  color: "#828282",
                  width: "98%",
                }}
              >
                {" "}
                If yes, select “Yes, I would like to”. If no, select “No, go
                back”.
              </p>
            }
            visible={this.state.visibleWarning}
            changeAccountTypeConfirmation
            changeAccountType={() => {
              this.updateAccountRole();
            }}
            onClose={() => this.setState({ visibleWarning: false })}
          />

          <CustomerOwnerConfirmModal
            heading={
              "You’ve successfully created this Billing & Site Manager Account!"
            }
            subHeading={
              <div>
                <p className="m-0">
                  To view this account as a Billing, select{" "}
                  <Button
                    onClick={() => this.viewCustomer(owner.id)}
                    className="border-0 shadow-none p-0 bg-transparent"
                  >
                    View Billing Account.
                  </Button>
                </p>
                <p className="m-0">
                  To view this account as a Site Manager, select{" "}
                  <Button
                    onClick={() => this.viewOwner(owner.id)}
                    className="border-0 shadow-none p-0 bg-transparent"
                  >
                    View Site Manager Account.
                  </Button>
                </p>
              </div>
            }
            id={owner.id}
            visible={this.state.visibleConfirm}
            onClose={() => this.setState({ visibleConfirm: false })}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
};
export default connect(mapStateToProps)(withRouter(Prospect));
