import React, { Component } from "react";
import { Image as Images } from "../../../../Images";
import { formatFileSize } from "../../../../../Controller/utils";
import { Button, Form, Input, Table, Upload, message } from "antd";
import {
  createDisposalDoc,
  getDisposalDoc,
} from "../../../../../Controller/api/disposalServices";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";

class DisposalDocumentsView extends Component {
  state = {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
    files: [],
  };
  docsColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render: (name) => (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">{name}</div>
        </div>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      sorter: true,
      render: (size) => (
        <div className="name-id-details">{formatFileSize(size)} </div>
      ),
    },
    {
      title: <div className="position-relative">FORMAT</div>,
      dataIndex: "format",
      sorter: true,
      render: (format) => <div className="name-id-details">.{format}</div>,
    },
  ];

  componentDidMount() {
    this.getFiles();
  }

  getFiles = (params = {}) => {
    getDisposalDoc({ ...params, disposal: this.props.match.params.id })
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
    form_data.append("disposal", this.props.match.params.id);
    form_data.append("document", file);
    createDisposalDoc(form_data)
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
        <div
          className={`col-12 ${
            this.props.editBtn ? "no-data-card-row-new px-0" : ""
          }`}
        >
          <div
            className={`row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
              this.props.editBtn ? "design-update-bar" : ""
            }`}
          >
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
              <Upload showUploadList={false} customRequest={this.uploadFile}>
                <Button className="add-btn-collapse text-uppercase">
                  Upload
                </Button>
              </Upload>
            </div>
            {!this.props.editBtn && (
              <Button
                onClick={() => this.props.tabChange("4")}
                className="view-all-btn text-uppercase"
              >
                VIEW ALL{" "}
              </Button>
            )}
          </div>
          {/*{docsData.length > 0 ?*/}
          <div className="row summary-collapse-inner-row-main px-0 pb-0">
            <div className="col-12 table-responsive main-table-div">
              {this.state.files.length > 0 ? (
                <Table
                  pagination={this.state.pagination}
                  loading={this.state.loading}
                  className="main-table-all carpet-cleaning-table border-0"
                  columns={this.docsColumns}
                  dataSource={this.state.files}
                  size="middle"
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        window.open(record.document, "_blank");
                      },
                    };
                  }}
                />
              ) : (
                <div className="documents-upload-height d-flex align-items-center justify-content-center w-100">
                  <Upload
                    showUploadList={false}
                    customRequest={this.uploadFile}
                  >
                    <Button className="bg-transparent border-0 p-0 shadow-none h-auto">
                      <img
                        src={Images.cloud_upload_24}
                        alt={"cloud icon"}
                        className="img-fluid"
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
          {/*// <div className="row mx-0 mt-3 no-data-card-row bg-transparent border-0 align-items-center justify-content-center">*/}
          {/*//     <div className="col-12 text-center">*/}
          {/*//         <img src={Images.cloud_upload_icon} alt="" className="img-fluid"/>*/}
          {/*//         <h6 className="mb-0 text-green-tag">Upload Document</h6>*/}
          {/*//     </div>*/}
          {/*// </div>*/}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(DisposalDocumentsView);
