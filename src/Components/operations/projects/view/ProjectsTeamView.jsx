import React, { Component } from 'react';
import { getShortName } from '../../../../Controller/utils';
import { Image as Images } from "../../../Images";

class ProjectsTeamView extends Component {
  render() {
    const { project } = this.props;
    return (
      <React.Fragment>
        {/*<Button onClick={() => this.showCreateOpportunity(true)}*/}
        {/*        className="edit-btn-summary">*/}
        {/*  <img src={Images.pencil_green} alt="" className="img-fluid"/>*/}
        {/*  Edit*/}
        {/*</Button>*/}
        <div className="row summary-collapse-inner-row-main">
          <div className="col-12 p-0">
            <div className="row summary-info-cr">
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="row">
                  <div className="col-12">
                    <h5 className="text-uppercase">SALES MANAGERS</h5>
                  </div>
                  {project?.sales_manager?.length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12">
                          {project?.sales_manager.map((i) => {
                            return (
                              <div
                                key={i.id}
                                style={{ minHeight: "76px", height: "76px" }}
                                className={`${i.id === this.props.project.point_project && 'active'} row mx-0 teams-view align-items-center user-info-div-main opportunity-info-div-main`}
                              // className="row mx-0 teams-view align-items-center user-info-div-main opportunity-info-div-main"
                              >
                                <div className="col-12">
                                  <div className="user-icons-div">
                                    <span className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                    {getShortName(i.first_name,i.last_name)}
                                    </span>
                                  </div>
                                  <div className="user-info-div">
                                    <h6>
                                      {i.first_name} {i.last_name}
                                    </h6>
                                    <p className="mb-0">Sales Manager</p>
                                    {i.id === this.props.project.point_project && (
                                      <span className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                        Point of Contact
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) :
                    (
                      <div className="col-12">
                        <div className="row mx-0 no-data-card-row teams-update-no-teams-card align-items-center justify-content-center">
                          <div className="col-12 text-center">
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Images.teams_labor_no_data_icon}
                            />
                            <h6 className="mb-0">No Sales Managers</h6>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="row">
                  <div className="col-12">
                    <h5 className="text-uppercase">SALES ASSISTANTS</h5>
                  </div>
                  {project?.sales_assistant?.length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12">
                          {project?.sales_assistant?.map((i) => {
                            return (
                              <div
                                key={i.id}
                                style={{ minHeight: "76px", height: "76px" }}
                                // className={`row mx-0 active teams-view align-items-center user-info-div-main opportunity-info-div-main`}
                                className={`${i.id === this.props.project.point_project && 'active'} row mx-0 teams-view align-items-center user-info-div-main opportunity-info-div-main`}
                              >
                                <div className="col-12">
                                  <div className="user-icons-div">
                                    <span className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                    {getShortName(i.first_name,i.last_name)}
                                    </span>
                                  </div>
                                  <div className="user-info-div">
                                    <h6>
                                      {i.first_name} {i.last_name}
                                    </h6>
                                    <p className="mb-0">Sales Assistant</p>
                                    {i.id === this.props.project.point_project && (
                                      <span className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                        Point of Contact
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12">
                      <div className="row mx-0 no-data-card-row teams-update-no-teams-card align-items-center justify-content-center">
                        <div className="col-12 text-center">
                          <img
                            alt={""}
                            className="img-fluid"
                            src={Images.teams_labor_no_data_icon}
                          />
                          <h6 className="mb-0">No Sales Assistants</h6>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <div className="row">
                  <div className="col-12">
                    <h5 className="text-uppercase">SALES PEOPLE</h5>
                  </div>
                  {project?.sales_person?.length > 0 ? (
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12">
                          {project?.sales_person?.map((i) => {
                            return (
                              <div
                                key={i.id}
                                style={{ minHeight: "76px", height: "76px" }}
                                // className={`row mx-0 teams-view align-items-center user-info-div-main opportunity-info-div-main`}
                                className={`${i.id === this.props.project.point_project && 'active'} row mx-0 teams-view align-items-center user-info-div-main opportunity-info-div-main`}
                              >
                                <div className="col-12">
                                  <div className="user-icons-div">
                                    <span className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                    {getShortName(i.first_name,i.last_name)}
                                    </span>
                                  </div>
                                  <div className="user-info-div">
                                    <h6>
                                      {i.first_name} {i.last_name}
                                    </h6>
                                    <p className="mb-0">Salesperson</p>
                                    {i.id === this.props.project.point_project && (
                                      <span className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                        Point of Contact
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12">
                      <div className="row mx-0 no-data-card-row teams-update-no-teams-card align-items-center justify-content-center">
                        <div className="col-12 text-center">
                          <img
                            alt={""}
                            className="img-fluid"
                            src={Images.teams_labor_no_data_icon}
                          />
                          <h6 className="mb-0">No Salespeople</h6>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProjectsTeamView;