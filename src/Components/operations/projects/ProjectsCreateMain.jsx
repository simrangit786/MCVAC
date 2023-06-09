import React, { Component } from 'react';
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import ProjectGeneralInfoCreate from "./create/ProjectGeneralInfoCreate";
import ProjectsTeamsCreate from "./create/ProjectsTeamsCreate";
import ProjectsBillingAccountCreate from "./create/ProjectsBillingAccountCreate";
import ProjectsSiteManagerAccountCreate from "./create/ProjectsSiteManagerAccountCreate";
import ProjectsServiceVarients from "./create/ProjectsServiceVarientsCreate";
import ProjectsDocumentsCreate from "./create/ProjectsDocumentsCreate";
import { generateMultipleProjects, getProjectById } from '../../../Controller/api/projectServices';
import { handleError } from '../../../Controller/Global';
import { routes } from '../../../Controller/Routes';
import UnsavedDataPrompt from '../../modals/UnsavedDataPrompt';
import { reverse } from 'named-urls/src';
import { history } from '../../../Controller/history';
import { getRegion } from '../../../Controller/api/vehicleServices';
import { getActiveKey, checkProjectRequired } from '../../../Controller/utils';
import { setBreadcrumb } from '../../../Store/actions/breadcrumbAction';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RequireSuccessModal from '../../modals/requiredDataModals/RequireSuccessModal';
import CommonWarningModal from '../../modals/CommonWarningModal';
import CommonConfirmationModal from '../../modals/CommonConfirmationModal';

const { Panel } = Collapse;

class ProjectsCreateMain extends Component {
  state = {
    project: null,
    visibleConfirm: false,
    warningModalVisible: false,
    activeKey: ["1"],
    unsavedExit: false,
    requiredSuccessModalVisible: false,
    regions: [],
    multiple_created: false,
    required: false,
  };
  showWarningModal = (visible) => {
    this.setState({
      warningModalVisible: visible,
    });
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


  setProject = (project, num) => {
    // if (this.state.project?.name) {
    //   if (
    //     // proposal?.documents?.length > 0 &&
    //     project?.sales_manager.length && project?.sales_assistant.length &&
    //     project?.sales_person.length && project?.customer_contact.length &&
    //     project?.owner_contact.length && project?.cost_setting && project?.tax_basis &&
    //     project?.payment_terms && project?.deposit &&
    //     project?.service_variant_count > 0) {
    //     // console.log("second");
    //     this.setState(() => {
    //       return { project, unsavedExit: false };
    //     });
    //     // if (!this.props.match.params.id) {
    //     //   this.setState({ requiredSuccessModalVisible: true });
    //     // }
    //   } else {
    //     this.setState(() => {
    //       return { project };
    //     });
    //   }
    // } else {
    //   this.setState(() => {
    //     return { project, unsavedExit: true };
    //   });
    // }
    if ((project.sales_manager.length || project.sales_person.length || project.sales_assistant.length) && project.project_owner_contact.length && project.project_customer_contact.length &&
      project.service_variant_count !== 0) {
      this.setState({ projectComplete: true, unsavedExit: false })

    } else {
      this.setState({ unsavedExit: true })
    }

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          project,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
        };
      });
    } else {
      this.setState({ project })
    }
    // this.setState({proposal, activeKey: getActiveKey(this.state.activeKey, "5")})
  };
  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };


  fetchProject = (id) => {
    getProjectById(
      this.props.match.params.id ? this.props.match.params.id : id
    )
      .then((res) => {
        this.setState({ project: res.data }, () => {
          if (this.state.project?.name
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
      this.fetchProject();
      this.fetchRegion();
      arr = [{ title: 'Edit Project', url: '' }]
      this.setState({ activeKey: this.props.location.editTab || "1" })
    }
    else {
      arr = [{ title: 'Create Project', url: '' }]
    }
    this.props.setBreadcrumb(arr)
  }
  handleViewMainButtonCLick = () => {
    let { project } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.operations.projects.view, { id: project.id })
      );
    } else {
      this.showConfirmModal(true);
    }
  };
  // createMultipleProjects = () => {
  //   generateMultipleProjects({ project: this.state.project.id ? this.state.project.id : this.props.match.params.id }).then(() => {
  //     // message.success('Multiple generated!')
  //     this.setState({ multiple_created: true })
  //   }).catch(err => {
  //     handleError(err)
  //   })
  // }
  // callMultiple = () => {
  //   if (this.props.location.pathname.includes('create') && !this.state.multiple_created) {
  //     this.createMultipleProjects()
  //   }
  // }

  render() {
    let { activeKey, regions, project } = this.state;

    let CREATE_SCREEN = this.props.location.pathname.includes('create')
    return (<React.Fragment>
      {/* <UnsavedDataPrompt unsavedExit={this.state.unsavedExit} exit={true} message={""} />  */}
      <UnsavedDataPrompt
        // unsavedExit={this.state.unsavedExit} exit={true} message={""}
        when={this.state.unsavedExit && !this.props.match.params.id}
        title="Are you sure you want to exit creating this project?"
        cancelText="Continue with project"
        unsavedText={"Exiting project creation without adding all of the required information may cause issues. To avoid issues, please continue and finish this proposal. If you would like to exit anyway, select Exit."}
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
              // defaultActiveKey={
              //   this.props.location.editTab
              //     ? [this.props.location.editTab]
              //     : ["1"]
              // }
              activeKey={activeKey}
              expandIcon={({ isActive }) => (<CaretRightOutlined rotate={isActive ? 90 : 0} />)}
            >
              <Panel
                header={<div className="col-12">
                  <div
                    className="row info-card-heading-row align-items-center justify-content-between">
                    <h5 className="mb-0">
                      General Information <sup>*</sup>
                    </h5>
                    {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                  </div>
                </div>}
                key="1"
              >
                <ProjectGeneralInfoCreate
                  project={project}
                  setProject={this.setProject}
                />
              </Panel>
              <Panel
                disabled={!project}
                header={<div className="col-12">
                  <div
                    className="row info-card-heading-row align-items-center justify-content-between">
                    <h5 className="mb-0">Team *</h5>
                    {((this.state.required || this.props.match.params?.id) && checkProjectRequired(project, "TEAMS"))
                      &&
                      (<p className="mb-0 info-signifire">
                        Please complete required information to avoid issues
                      </p>)
                    }
                    {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                  </div>
                </div>}
                key="2"
              >
                <ProjectsTeamsCreate
                  fetchProject={this.fetchProject}
                  project={project}
                  setProject={this.setProject}
                />
              </Panel>
              <Panel
                disabled={!project}
                header={<div className="col-12">
                  <div
                    className="row info-card-heading-row align-items-center justify-content-between">
                    <h5 className="mb-0">Billing Account *</h5>

                    {((this.state.required || this.props.match.params?.id) && checkProjectRequired(project, "CUSTOMER"))
                      &&
                      (<p className="mb-0 info-signifire">
                        Please complete required information to avoid issues
                      </p>)
                    }
                  </div>
                </div>}
                key="3"
              >
                <ProjectsBillingAccountCreate
                  fetchProject={this.fetchProject}
                  project={project}
                  setProject={this.setProject}
                />
              </Panel>
              <Panel
                disabled={!project}
                header={<div className="col-12">
                  <div
                    className="row info-card-heading-row align-items-center justify-content-between">
                    <h5 className="mb-0">Site Manager Account *</h5>
                    {((this.state.required || this.props.match.params?.id) && checkProjectRequired(project, "OWNER"))
                      &&
                      (<p className="mb-0 info-signifire">
                        Please complete required information to avoid issues
                      </p>)
                    }
                  </div>
                </div>}
                key="4"
              >
                <ProjectsSiteManagerAccountCreate
                  fetchProject={this.fetchProject}
                  project={project}
                  setProject={this.setProject} />
              </Panel>
              <Panel
                disabled={!project}
                header={<div className="col-12">
                  <div
                    className="row info-card-heading-row align-items-center justify-content-between">
                    <h5 className="mb-0">
                      Service Variants <sup>*</sup>
                    </h5>
                    {((this.state.required || this.props.match.params?.id) && checkProjectRequired(project, "SERVICE_VARIENT"))
                      &&
                      (<p className="mb-0 info-signifire">
                        Please complete required information to avoid issues
                      </p>)
                    }
                    {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                  </div>
                </div>}
                key="5"
              >
                <ProjectsServiceVarients
                  project={project}
                  fetchProject={this.fetchProject}
                  setProject={this.setProject}
                />
              </Panel>

              <Panel
                disabled={!project}
                header={<div className="col-12">
                  <div
                    className="row info-card-heading-row align-items-center justify-content-between">
                    <h5 className="mb-0">
                      Documents
                    </h5>
                    {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                  </div>
                </div>}
                key="6"
              >
                <ProjectsDocumentsCreate
                  fetchProject={this.fetchProject}
                  project={project}
                  setProject={this.setProject}
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
                    style={
                      CREATE_SCREEN ?
                        { width: '37%' }
                        : {}
                    }
                    onClick={() => {
                      // this.callMultiple()
                      if (this.state.unsavedExit) {
                        history.push(
                          reverse(routes.dashboard.operations.projects.view, {
                            id: project.id,
                          })
                        )
                      }
                      else {
                        this.handleViewMainButtonCLick()
                      }
                    }
                    }
                    disabled={!project}
                    type={"primary"}
                  >
                    {'View Project'}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonConfirmationModal
        heading={this.props.match.params.id ? `You’ve successfully updated this Project!` : `Project Created Successfully!`}
        subHeading={
          <p className="mb-0">
            To view this billing account, select &nbsp;
            <Button
              onClick={() => {
                // history.push(reverse(routes.dashboard.operations.projects.self))
                history.push(
                  reverse(routes.dashboard.operations.projects.view, { id: project.id })
                );
              }
              }
              className="border-0 bg-transparent shadow-none p-0"
            >
              View Project.
            </Button>
            .
          </p>
        }
        visible={this.state.visibleConfirm}
        okAction={() => {
          // history.push(reverse(routes.dashboard.operations.projects.self))
          history.push(
            reverse(routes.dashboard.operations.projects.view, { id: project.id })
          );
        }
        }
        okTitle={"View Project"}
        onClose={() => this.showConfirmModal(false)}
      />
      <CommonWarningModal
        heading={`Are you sure you want to exit ${this.props.match.params.id ? "editing" : "creating"
          } this Project?`}
        visible={this.state.warningModalVisible}
        onClose={() => this.showWarningModal(false)}
      />
      {/* <RequireSuccessModal
        visible={this.state.requiredSuccessModalVisible}
        heading={"Project(s) created successfully."}
        subHeading={
          "If there were multiple billing accounts on this project, a project was created for each one."
        }
        onClose={() => {
          this.showRequiredSuccessModal(false);
        }}
        okText={"View Project"}
        onOK={() => {
          this.callMultiple()
          this.showRequiredSuccessModal(false);
          history.push(
            reverse(routes.operations.projects.view, { id: project.id })
          );
        }}
      /> */}
    </React.Fragment>);
  }
}

export default connect(null, { setBreadcrumb })(withRouter(ProjectsCreateMain));
