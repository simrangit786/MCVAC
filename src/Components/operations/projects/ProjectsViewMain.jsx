import React, { Component } from 'react';
import { Tabs } from "antd";
import ProjectSummaryView from "./view/ProjectSummaryView";
import ProjectsBillingAccountView from "./view/ProjectsBillingAccountView";
import ProjectsSiteManagerAccountView from "./view/ProjectsSiteManagerAccountView";
import ProjectsServiceVarientsView from "./view/ProjectsServiceVarientsView";
import ProjectsDocumentsView from "./view/ProjectsDocumentsView";
import { routes } from '../../../Controller/Routes';
import { handleError } from '../../../Controller/Global';
import { getProjectById } from '../../../Controller/api/projectServices';
import { checkProjectFieldsRequired } from "../../../Controller/utils";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { connect } from 'react-redux';
import { getOwnerSites } from "../../../Controller/api/ownerAccountServices";
import { withRouter } from 'react-router-dom';
import ProjectsPost from './view/ProjectsPost';
import ProjectsActivityView from './view/ProjectsActivityView';
const { TabPane } = Tabs;

class ProjectsViewMain extends Component {
  state = {
    project: null,
    sites: [],
    active: "1",
    projectContacts: [],
    project_filled: true,
  };

  componentDidMount() {
    this.fetchProject()
  }

  fetchProject = () => {
    getProjectById(this.props.match.params.id)
      .then((res) => {
        let arr = [
          {
            title: "Projects",
            url: routes.dashboard.operations.projects.self,
          },
          {
            title: res.data.name,
            url: "",
          },
        ];
        this.props.setBreadcrumb(arr);
        this.setState({ project: res.data, project_filled: checkProjectFieldsRequired(res.data) })
        // , () => {
        //     // this.getServiceVariantProposal();
        // });
        if (res.data.site) {
          getOwnerSites({ account: res.data.site.id }).then((response) => {
            this.setState({ sites: response.data.results });
          });
        }
      })
      .catch((err) => {
        handleError(err);
      });
  };
  onTabChange = (key) => {
    this.setState({ active: key });
  };


  render() {
    const { project, sites, project_filled } = this.state
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 carpet-cleaning-main-row position-relative">
            {/* {project_filled && (
              <div className="row mx-0 info-gray-div info-red-div align-items-center">
                <h6 className="mb-0">
                  Please complete all required information to view .
                </h6>
              </div>
            )} */}
            <Tabs
              className="carpet-cleaning-main-common-tab"
              onChange={this.onTabChange}
              activeKey={this.state.active}
              // defaultActiveKey="1"
            >
              <TabPane tab="Summary" key="1">
                <ProjectSummaryView
                  project_filled={project_filled}
                  onTabChange={this.onTabChange}
                  onChange={(key) => this.onChange(key)}
                  sites={sites}
                  project={project}
                  fetchProject={this.fetchProject}
                />
              </TabPane>
              <TabPane tab="Posts" key="7">
              <ProjectsPost {...this.props} project={project}/>
              </TabPane>
              <TabPane tab="Activity" key="8">
                <ProjectsActivityView
                {...this.props} project={project}
                />
              </TabPane>
              <TabPane tab="Billing Account" key="3">
                <ProjectsBillingAccountView
                  {...this.props}
                  project={project}
                />
              </TabPane>
              <TabPane tab="Site Manager Account" key="4">
                <ProjectsSiteManagerAccountView {...this.props} />
              </TabPane>
              <TabPane className="custom-tab-pane" tab="Service Variants" key="5">
                <ProjectsServiceVarientsView  project={project}/>
              </TabPane>
              <TabPane tab="Documents" key="6">
                <ProjectsDocumentsView />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const actionCreators = {
  setBreadcrumb,
};
export default connect(null, actionCreators)(withRouter(ProjectsViewMain));