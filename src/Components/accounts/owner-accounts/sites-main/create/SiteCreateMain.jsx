import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image } from "../../../../Images";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import CreateGeneralInfoSite from "./CreateGeneralInfoSite";
import DocumentsCreateSite from "./DocumentsCreateSite";
import { getSingleOwnerSites } from "../../../../../Controller/api/ownerAccountServices";
import { handleError } from "../../../../../Controller/Global";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/src";
import { routes } from "../../../../../Controller/Routes";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import { withRouter } from "react-router-dom";
import { getActiveKey } from "../../../../../Controller/utils";

const { Panel } = Collapse;

class SiteCreateMain extends Component {
  state = {
    warningModalVisible: false,
    visibleConfirm: false,
    siteData: null,
    // siteDetail:null,
    activeKey:["1"]
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

  componentDidMount() {
    const Id = this.props.match.params.id ? this.props.match.params.id : this.state.siteData?.id
    if(Id) {
    this.getSiteData();
    }
  }

  setSite = (site, num) => {
    this.setState({siteData: site},() => {
      this.setState(prevState => {
        return{
          activeKey:[...prevState.activeKey,"2"]
        }
    })
  })
  }

  onCollapseChange = (activeKey) => {
    this.setState({activeKey})   
  }

  
  getSiteData = () => {
    const Id = this.props.match.params.id ? this.props.match.params.id : this.state.siteData.id
    getSingleOwnerSites(Id)
      .then((res) => {
        let arr = [
          {
            title: `${this.props.match.params?.id ? "Edit" : "Create"} Site`,
            // url: routes.dashboard.customer_account.self
          },
        ];
        this.props.setBreadcrumb(arr);
        this.setState({ siteData: res.data });
      })
      .catch((err) => {
        handleError(err);
      });
  };
  documentsCallback = (data) => {
    this.setState({ docs: data });
  };
  handleViewMainButtonCLick = () => {
    if (this.props.match.params?.id || this.state.siteDetail?.id) {
      history.push(
        reverse(routes.dashboard.owner_account.site_account.view, {
          id: this.props.match.params?.id|| this.state.siteDetail?.id,
        })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    const { siteData } = this.state;
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <Collapse
                //   accordion
                activeKey={this.state.activeKey}
                onChange={this.onCollapseChange}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                defaultActiveKey={["1"]}
              >
                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className={"mb-0"}>General Information</h5>

                        {/*{account && account.name !== "" ?*/}
                        {/*<img alt={''} className="img-fluid" src={Image.create_ac_checkmark}/>*/}
                        {/*:*/}
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                        {/*}*/}
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <CreateGeneralInfoSite siteData={siteData} setSite = {this.setSite} />
                </Panel>

                <Panel
                  disabled={!siteData}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className={"mb-0"}>Documents</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <DocumentsCreateSite siteDetail={siteData} documentscallback={this.documentsCallback}/>
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
                      disabled={!siteData}
                      onClick={() => this.handleViewMainButtonCLick()}
                      type={"primary"}
                    >
                      {" View Site"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={"You’ve successfully created this site!"}
          subHeading={
            <p className="mb-0">
              To view this site, select{" "}
              <Button
                onClick={() =>
                  history.push(
                    reverse(routes.dashboard.owner_account.site_account.view, {
                      id: siteData.id,
                    })
                  )
                }
                className="border-0 shadow-none p-0 bg-transparent"
              >
                View Site.
              </Button>
            </p>
          }
          okTitle={"View Site"}
          okAction={() =>
            history.push(
              reverse(routes.dashboard.owner_account.site_account.view, {
                id: siteData.id,
              })
            )
          }
          visible={this.state.visibleConfirm}
          onClose={() => this.showConfirmModal(false)}
        />
        <CommonWarningModal
          heading={
            this.props.match.params.id
              ? "Are you sure you want to exit editing this Site?"
              : "Are you sure you want to exit creating this Site?"
          }
          visible={this.state.warningModalVisible}
          onClose={() => this.showWarningModal(false)}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(withRouter
(SiteCreateMain)
);
