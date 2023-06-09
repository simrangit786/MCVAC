import React, { Component } from "react";
import { Button, Form, Input, Table, Upload } from "antd";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../Controller/Routes";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import {
  createSupplyDoc,
  getSupplyDoc,
} from "../../../../../Controller/api/supplyServices";
import { handleError } from "../../../../../Controller/Global";
import { formatFileSize } from "../../../../../Controller/utils";

class DocumentsTab extends Component {
  state = {
    data: [],
    files: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
  };
  columns = [
    {
      title: "NAME",
      dataIndex: "name",
      sorter: true,
      render: (data) => (
        <div>
          <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          <span className="ml-2">{data}</span>
        </div>
      ),
    },
    {
      title: "SIZE",
      dataIndex: "size",
      sorter: true,
      render: (data) => <div>{formatFileSize(data)}</div>,
    },
    {
      title: "FILE Format",
      dataIndex: "format",
      sorter: true,
    },
  ];
  docsData = [
    {
      key: "1",
      docs_name: "Mike",
      size: 32,
      format: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  componentDidMount() {
    this.getFiles();
  }

  getFiles = (params = {}) => {
    getSupplyDoc({ ...params, supply: this.props.match.params.id })
      .then((res) => {
        this.setState({ files: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  uploadFile = (data) => {
    let file = data.file;
    let form_data = new FormData();
    form_data.append("supply", this.props.match.params.id);
    form_data.append("document", file);
    createSupplyDoc(form_data)
      .then((res) => {
        this.getFiles();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0 summary-collapse-inner-row-main mt-30 no-data-card-row-new">
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ">
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
              {/* <Button
                // onClick={() =>
                //   history.push({
                //     pathname: reverse(
                //       routes.dashboard.management.supply_tools.supply_tools
                //         .edit,
                //       { id: this.props.match.params.id }
                //     ),
                //     editTab: "4",
                //   })
                // }
                
                className="edit-btn-summary ml-auto"
              >
                <img src={Images.pencil_green} alt="" className="img-fluid" />
                Edit
              </Button> */}
            </div>
          </div>
          <div className="col-12 p-0">
            <div className="row summary-collapse-inner-row-main pt-0 pb-0">
              <div className="col-12 table-responsive main-table-div">
                {this.state.files.length > 0 ? (
                  <Table
                    pagination={true}
                    loading={this.state.loading}
                    className="main-table-all"
                    columns={this.columns}
                    dataSource={this.state.files}
                    size="middle"
                    // locale={{
                    //     emptyText:
                    //         (<div style={{textAlign: "center"}}>
                    //                 <img src={Images.cloud_upload_icon} alt={"cloud icon"}
                    //                      style={{width: 40}}/>
                    //                 <p style={{textAlign: "center", color: "#38BC94"}}> Upload
                    //                     Document </p>
                    //             </div>
                    //         )
                    // }}
                  />
                ) : (
                  <div className="documents-upload-height d-flex align-items-center justify-content-center w-100">
                    <Upload
                      showUploadList={false}
                      customRequest={this.uploadFile}
                    >
                      <Button className="bg-transparent border-0 p-0 shadow-none h-auto">
                        <img
                          src={Images.cloud_upload_icon}
                          alt={"cloud icon"}
                          style={{ width: 40 }}
                        />
                        <p style={{ textAlign: "center", color: "#38BC94" }}>
                          {" "}
                          Upload Document{" "}
                        </p>
                      </Button>
                    </Upload>
                  </div>
                )}
              </div>
            </div>
            {/*<div*/}
            {/*    className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">*/}
            {/*    <div className="col-12 text-center">*/}
            {/*        <img src={Images.billing_gray_no_data_icon} alt="" className="img-fluid"/>*/}
            {/*        <h6 className="mb-0 color-gray-3">Docs Name</h6>*/}
            {/*    </div>*/}
            {/*</div>*/}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(DocumentsTab);
