import React, { Component } from 'react';
import { Button, Collapse, Spin, Tooltip } from "antd";
import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../Images";
import ProjectsGeneralInfo from "./ProjectsGeneralInfo";
import ProjectsPost from "./ProjectsPost";
import ProjectsActivityView from "./ProjectsActivityView";
import ProjectsTeamView from "./ProjectsTeamView";
import ProjectsBillingAccountView from "./ProjectsBillingAccountView";
import ProjectsSiteManagerAccountView from "./ProjectsSiteManagerAccountView";
import ProjectsWorkOrderView from "./ProjectsWorkOrderView";
import ProjectsDocumentsView from "./ProjectsDocumentsView";
import ProjectsServiceVarientsView from "./ProjectsServiceVarientsView";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls";
import { routes } from "../../../../Controller/Routes";
import { updateProject, getProjectStatusOptions } from '../../../../Controller/api/projectServices';
import { handleError } from '../../../../Controller/Global';
import { withRouter } from 'react-router-dom';
import { checkProjectRequired } from '../../../../Controller/utils';
const { Panel } = Collapse;

function getStatusCss(statusIndex, index) {
  if (statusIndex === index) return "active";
  else if (statusIndex > index) return "finish";
}

class ProjectSummaryView extends Component {
  state = {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
    visible: false,
    visibleDrawer: false,
  };

  handleChange = (e) => {
    updateProject(this.props.match.params.id, { status: e.value })
      .then((res) => {
        this.props.fetchProject();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  showSendProject = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  componentDidMount() {
    this.getProjectStatusOptions();
  }

  getProjectStatusOptions = () => {
    getProjectStatusOptions()
      .then((res) => {
        this.setState({ statusTypes: res.data.results.reverse() });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    const { sites, project, onTabChange, project_filled } = this.props;
    const { statusTypes } = this.state;
    if (!project) {
      return (
        <div className={"text-center my-2"}>
          <Spin />
        </div>
      );
    }

    const statusIndex = statusTypes?.findIndex(
      (i) => i?.id === project?.status?.id
    );
    return (
      <React.Fragment>
        <div className="col-12">
          <div
            className="row summary-info-row-main"
            style={{ marginBottom: "80px" }}
          >
            <div className="col-12">
              <div className="row mx-0 summary-info-status-green-line-main">
                {statusTypes?.map((item, index) => {
                  return (
                    <Tooltip
                      placement="top"
                      title={item?.title}
                      overlayStyle={{ fontSize: 11 }}
                      arrowPointAtCenter={true}
                    >
                      <div
                        key={index}
                        className={
                          "summary-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center " +
                          getStatusCss(statusIndex, index)
                        }
                      >
                        {getStatusCss(statusIndex, index) === "finish" ? (
                          <CheckOutlined />
                        ) : (
                          item?.title
                        )}
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="row summary-info-inner-row">
            <div className="col-12">
              <Collapse
                // accordion
                defaultActiveKey={["1"]}
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
                      <div className="d-flex align-items-center">
                        {/*<Button className="print-pdf-btn d-flex align-items-center text-capitalize">*/}
                        {/*    <img src={Images.pdf_icon_gray} alt="" className="img-fluid"/>*/}
                        {/*    Print / Preview*/}
                        {/*</Button>*/}
                        {/*<Button onClick={() => tject(true)}*/}
                        {/*        className="send-proposal-btn d-flex align-items-center text-capitalize">*/}
                        {/*    <img src={Images.send_icon_white} alt="" className="img-fluid"/>*/}
                        {/*    Send Proposal*/}
                        {/*</Button>*/}
                        <Button
                          // onClick={() => history.push(reverse(routes.dashboard.operations.projects.create))}
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.operations.projects.edit,
                                { id: this.props.match.params.id }
                              ),
                              editTab: "1"
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
                  key="1"
                >
                  <ProjectsGeneralInfo
                    project={project}
                    handleChange={this.handleChange}
                    onTabChange={this.props.onTabChange}
                    fetchProject={this.props.fetchProject}
                    project_filled={project_filled}
                    statusTypes={statusTypes}
                    callbackSendProject={() => this.showSendProject(true)}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Posts</span>
                    </div>
                  }
                  key="2"
                >
                  <ProjectsPost
                    onTabChange={onTabChange}
                    viewAll={true}
                    {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Activity</span>
                    </div>
                  }
                  key="3"
                >
                  <ProjectsActivityView
                    onTabChange={onTabChange}
                    viewAll={true}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Team *</span>
                      <div className="d-flex align-items-center">
                      {checkProjectRequired(project,"TEAMS") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        // onClick={() => history.push(reverse(routes.dashboard.operations.projects.create))}
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.operations.projects.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "2"
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
                  forceRender
                >

                    
                  <ProjectsTeamView project={project} fetchProject={this.props.fetchProject} {...this.props} onTabChange={onTabChange} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Billing Account *</span>
                      <div className="d-flex align-items-center">
                      {checkProjectRequired(project,"CUSTOMER") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        // onClick={() => history.push(reverse(routes.dashboard.operations.projects.create))}
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.operations.projects.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "3"
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
                  key="5"
                >
                  <ProjectsBillingAccountView
                    onTabChange={onTabChange}
                    hideTitle={true}
                    {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Site Manager Account *</span>
                      <div className="d-flex align-items-center">
                      {checkProjectRequired(project,"OWNER") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        // onClick={() => history.push(reverse(routes.dashboard.operations.projects.create))}
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.operations.projects.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "4"
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
                  key="6"
                >
                  <ProjectsSiteManagerAccountView
                    onTabChange={onTabChange}
                    viewAll={true}
                    {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Service Variants<sup>*</sup>
                      </span>
                      <div className="d-flex align-items-center">
                      {checkProjectRequired(project,"SERVICE_VARIENT") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        // onClick={() => history.push(reverse(routes.dashboard.operations.projects.create))}
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.operations.projects.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "5",
                            view: true,
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
                  key="7"
                >
                  <ProjectsServiceVarientsView
                  onTabChange={onTabChange}
                  project={project}
                  viewAll={true}
                  />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Work Order
                      </span>
                    </div>
                  }
                  key="8"
                >
                  <ProjectsWorkOrderView  project={project}/>
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Documents
                      </span>
                    </div>
                  }
                  key="9"
                >
                  <ProjectsDocumentsView
                    project={project}
                    onTabChange={onTabChange}
                    hideTitle={true}
                  />
                </Panel>
              </Collapse>
            </div>
          </div >
        </div >
      </React.Fragment >
    );
  }
}

export default withRouter(ProjectSummaryView);