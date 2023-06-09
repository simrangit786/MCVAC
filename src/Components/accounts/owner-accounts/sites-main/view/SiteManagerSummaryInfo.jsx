import React, { Component } from "react";
import { Button, Collapse, Form, Input } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../../Images";
import ActivityInfo from "../../../common/ActivityInfo";
import CustomerOwnerConfirmModal from "../../../../modals/CustomerOwnerConfirmModal";
import SiteManagerDocumentsInfo from "./SiteManagerDocumentsInfo";
import SiteManagerOpportunityInfo from "./SiteManagerOpportunityInfo";
import SiteManagerOwnerPostTab from "./SiteManagerOwnerPostTab";
import SiteManagerProposalsInfo from "./SiteManagerProposalsInfo";
import SiteGeneralInformation from "./SiteGeneralInformation";
import { history } from "../../../../../Controller/history";
import { routes } from "../../../../../Controller/Routes";
import { reverse } from "named-urls/src";
import { withRouter } from "react-router";
import { handleError } from "../../../../../Controller/Global";
import { getSingleOwnerSites } from "../../../../../Controller/api/ownerAccountServices";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
const { Panel } = Collapse;
class SiteManagerSummaryInfo extends Component {
  state = {
    visibleConfirm: false,
    siteData: null,
  };

  componentDidMount() {
    this.getSiteData();
  }

  getSiteData = () => {
    getSingleOwnerSites(this.props.match.params.id)
      .then((res) => {
        let arr = [
          {
            title: "Sites",
            url: routes.dashboard.owner_account.self,
          },
          {
            title: res.data.name || "-",
            url: "#",
          },
        ];
        this.props.setBreadcrumb(arr);
        this.setState({ siteData: res.data });
      })
      .catch((err) => {
        handleError(err);
      });
  };
  render() {
    const { siteData } = this.state;
    return (
      <React.Fragment>
        <div className="row summary-info-row-main">
          <div className="col-12 p-0">
            <div className="row mx-0 steps-main-div-inn mt-3">
              <div className="col-12">
                <div className="row summary-info-inner-row">
                  <div className="col-12">
                    <Collapse
                      // accordion
                      defaultActiveKey={["1"]}
                      // onChange={callback}
                      expandIcon={({ isActive }) => (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      )}
                    >
                      <Panel
                        header={
                          <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                            <span>
                              General Information <sup>*</sup>
                            </span>
                            <Button
                              onClick={() =>
                                history.push({
                                  pathname: reverse(
                                    routes.dashboard.owner_account.site_account
                                      .edit,
                                    { id: this.props.match.params.id }
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
                        <SiteGeneralInformation siteData={siteData} />
                      </Panel>
                      <Panel
                        header={
                          <div className="opportunity_info-collapse d-flex align-items-center">
                            <span>Documents</span>
                          </div>
                        }
                        key="2"
                      >
                        <SiteManagerDocumentsInfo
                          {...this.props}
                          siteData={siteData}
                          hideTitle={true}
                        />
                      </Panel>
                      {/* <Panel header={
                                                <div className="opportunity_info-collapse d-flex align-items-center">
                                                    <span>Opportunities</span>
                                                </div>
                                            } key="3">
                                                <SiteManagerOpportunityInfo {...this.props} hideTitle/>
                                            </Panel>

                                            <Panel header={
                                                <div className="opportunity_info-collapse d-flex align-items-center">
                                                    <span>Proposals</span>
                                                </div>
                                            } key="4">
                                                <SiteManagerProposalsInfo {...this.props} hideTitle={true}/>
                                            </Panel>

                                            <Panel header={
                                                <div className="opportunity_info-collapse d-flex align-items-center">
                                                    <span>Projects</span>
                                                </div>
                                            } key="5">
                                                <div className="col-12">
                                                    <div
                                                        className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                                                        <div className="d-flex align-items-center">
                                                            <div className="search-bar-div">
                                                                <Form className="position-relative">
                                                                    <Input placeholder="Search"/>
                                                                    <Button
                                                                        className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                                                        <img src={Images.search_icon_gray}
                                                                             className="img-fluid"
                                                                             alt="search icon"/>
                                                                    </Button>
                                                                </Form>
                                                            </div>
                                                            <Button className="add-btn-collapse text-uppercase">+
                                                                CREATE</Button>
                                                        </div>
                                                        <Button className="view-all-btn text-uppercase"
                                                                onClick={() => this.props.tabChange("8")}>
                                                            VIEW ALL
                                                        </Button>
                                                    </div>
                                                    <div className="row summary-collapse-inner-row-main px-0 pb-0">
                                                        {/*when-no-data-is-available
                                                        <div className="col-12">
                                                            <div
                                                                className="row no-data-upload-screens no-data-second m-0 border-0">
                                                                <div className="col-12 text-center">
                                                                    <img src={Images.folder_gray_no_data} alt=""
                                                                         className="img-fluid"/>
                                                                    <h6 className="mb-0 text-gray-tag">No
                                                                        Projects</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Panel>

                                            <Panel header={
                                                <div className="opportunity_info-collapse d-flex align-items-center">
                                                    <span>Work Orders</span>
                                                </div>
                                            } key="6">
                                                <div className="col-12">
                                                    <div
                                                        className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                                                        <div className="d-flex align-items-center">
                                                            <div className="search-bar-div">
                                                                <Form className="position-relative">
                                                                    <Input placeholder="Search"/>
                                                                    <Button
                                                                        className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                                                        <img src={Images.search_icon_gray}
                                                                             className="img-fluid"
                                                                             alt="search icon"/>
                                                                    </Button>
                                                                </Form>
                                                            </div>
                                                            <Button className="add-btn-collapse text-uppercase">+
                                                                CREATE</Button>
                                                        </div>
                                                        <Button className="view-all-btn text-uppercase"
                                                                onClick={() => this.props.tabChange("9")}>
                                                            VIEW ALL
                                                        </Button>
                                                    </div>
                                                    <div className="row summary-collapse-inner-row-main px-0 pb-0">
                                                        {/*when-no-data-is-available
                                                        <div className="col-12">
                                                            <div
                                                                className="row no-data-upload-screens no-data-second m-0 border-0">
                                                                <div className="col-12 text-center">
                                                                    <img src={Images.work_setting} alt=""
                                                                         className="img-fluid"/>
                                                                    <h6 className="mb-0 text-gray-tag">No
                                                                        Work Order</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Panel>

                                            <Panel header={
                                                <div className="opportunity_info-collapse d-flex align-items-center">
                                                    <span>Posts</span>
                                                </div>
                                            } key="7">
                                                <SiteManagerOwnerPostTab {...this.props} hideTitle/>
                                            </Panel>

                                            <Panel header={
                                                <div className="opportunity_info-collapse d-flex align-items-center">
                                                    <span>Activity </span>
                                                </div>
                                            } key="8">
                                                <ActivityInfo {...this.props} hideTitle hideSearch owner={true}/>
                                            </Panel>*/}
                    </Collapse>
                  </div>
                </div>
                <CustomerOwnerConfirmModal
                  heading={
                    "You’ve successfully created this Billing & Site Manager Account!"
                  }
                  subHeading={
                    <div>
                      <p className="m-0">
                        To view this account as a Billing, select{" "}
                        <Button
                          // onClick={() => this.viewCustomer(owner.id)}
                          className="border-0 shadow-none p-0 bg-transparent"
                        >
                          View Billing Account.
                        </Button>
                      </p>
                      <p className="m-0">
                        To view this account as a Site Manager, select{" "}
                        <Button
                          // onClick={() => this.viewOwner(owner.id)}
                          className="border-0 shadow-none p-0 bg-transparent"
                        >
                          View Site Manager Account.
                        </Button>
                      </p>
                    </div>
                  }
                  // id={owner.id}
                  visible={this.state.visibleConfirm}
                  onClose={() => this.setState({ visibleConfirm: false })}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(SiteManagerSummaryInfo)
);
