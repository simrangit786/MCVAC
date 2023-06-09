import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../../Images";

class ProjectsInfo extends Component {
  projectColumns = [
    {
      title: "PROPOSAL NAME",
      dataIndex: "docs_name",
      sorter: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      sorter: true,
    },
    {
      title: <div className="position-relative">FORMAT</div>,
      dataIndex: "format",
      sorter: true,
    },
  ];
  projectData = [
    {
      key: "1",
      docs_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Project Name</div>
        </div>
      ),
      size: <div className="name-id-details">15 KB</div>,
      format: <div className="name-id-details">.docx</div>,
    },
    {
      key: "2",
      docs_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Project Name</div>
        </div>
      ),
      size: <div className="name-id-details">15 KB</div>,
      format: <div className="name-id-details">.docx</div>,
    },
    {
      key: "3",
      docs_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Project Name</div>
        </div>
      ),
      size: <div className="name-id-details">15 KB</div>,
      format: <div className="name-id-details">.docx</div>,
    },
    {
      key: "4",
      docs_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Project Name</div>
        </div>
      ),
      size: <div className="name-id-details">15 KB</div>,
      format: <div className="name-id-details">.docx</div>,
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0 mt-30 no-data-card-row-new">
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
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
              {/* <div className="new-opportunity-btn-div">
                                <Button className="new-opportunity-btn text-capitalize">CREATE</Button>
                            </div> */}
            </div>
          </div>
          {/*<div className="col-12 table-responsive main-table-div">*/}
          {/*    <Table pagination={false} className="main-table-all border-0 carpet-cleaning-table"*/}
          {/*           columns={this.projectColumns}*/}
          {/*           dataSource={this.projectData} size="middle"/>*/}
          {/*</div>*/}
          {/*no-data-screens*/}
          <div className="col-12">
            <div className="row no-data-upload-screens">
              <div className="col-12 text-center">
                <img
                  src={Images.folder_gray_no_data}
                  alt="cloud upload"
                  className="img-fluid"
                />
                <h6 className="mb-0 mt-1 text-gray-tag">No Projects</h6>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProjectsInfo;
