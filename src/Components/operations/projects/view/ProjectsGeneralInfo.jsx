import React, { Component } from 'react';
import { Image as Images } from "../../../Images";
import { Select } from "antd";
import { handleError } from '../../../../Controller/Global';
import { getGoogleAuthenticateURL } from '../../../../Controller/api/authServices';
import { formatDate } from '../../../../Controller/utils';
import { withRouter } from 'react-router-dom';
const { Option } = Select;

class ProjectsGeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleGoogleBtnClick = () => {
    getGoogleAuthenticateURL({ redirect_url: window.location.href }).then(
      (r) => {
        window.location.href = r.data.url;
      }
    );
  };

  render() {
    const { project, statusTypes } = this.props;
    return (
      <React.Fragment>
        <div className="row summary-collapse-inner-row-main">
          <div className="col-12">
            <div className="row summary-view-row-vehicle">
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <h6 className="text-uppercase">
                  Associated Opportunity
                </h6>
                <div
                  style={{ minHeight: "76px", height: "76px" }}
                  className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main"
                >
                  <div className="col-12">
                    <div className="user-icons-div">
                      <img
                        src={Images.leads_icon_black}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="user-info-div">
                      <h6>{project.opportunity?.name}</h6>
                      <p className="mb-0">
                        {project.opportunity?.status?.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                <h6 className="text-uppercase">Associated proposal</h6>
                <div
                  style={{ minHeight: "76px", height: "76px" }}
                  className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main"
                >
                  <div className="col-12">
                    <div className="user-icons-div">
                      <img
                        src={Images.folder_icon_black}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="user-info-div">
                      <h6>{project?.proposal?.name}</h6>
                      <p className="mb-0">{project?.proposal?.status.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row summary-view-row-vehicle">
              <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                <h6 className="text-uppercase">Project ID</h6>
                <h5 className="mb-0">{project.id}</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                <h6 className="text-uppercase">Project NAME</h6>
                <h5 className="mb-0">{project.name}</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                <h6 className="text-uppercase">STATUS</h6>
                <Select
                  labelInValue
                  className="status-small-select"
                  placeholder={"Select"}
                  defaultValue={{
                    value: project.status?.id,
                    label: project.status?.title,
                  }}
                  value={{ value: project.status?.id, label: project.status?.title }}
                  style={{ width: '100%',textAlign:'center' }}
                  onChange={this.props.handleChange}
                  suffixIcon={
                    <img
                      src={Images.caret_small_icon_select}
                      alt=""
                      className="img-fluid"
                    />
                  }
                >
                  {statusTypes?.map((item) => (
                    <Option value={item.id} key={item.id}>
                      <div className="text-capitalise">{item.title}</div>
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                <h6 className="text-uppercase">Project SOURCE</h6>
                <h5 className="mb-0">{project?.source?.name || "-"}</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                <h6 className="text-uppercase">Project Created</h6>
                <h5 className="mb-0">{formatDate(project.created)}</h5>
              </div>
            </div>
            <div className="row summary-view-row-vehicle border-0">
              <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                <h6 className="text-uppercase">PROJECT START AND END DATES</h6>
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">Start</li>
                  <li className="list-inline-item gray-color-li">
                    {formatDate(project.project_start_date)}
                  </li>
                </ul>
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">End</li>
                  <li className="list-inline-item gray-color-li">
                    {formatDate(project.project_end_date)}
                  </li>
                </ul>
              </div>
              <div className="col-12 col-sm-6 col-md-9 col-lg-9">
                <h6 className="text-uppercase">DESCRIPTION</h6>
                <h5 className="mb-0">{project.description}</h5>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ProjectsGeneralInfo);