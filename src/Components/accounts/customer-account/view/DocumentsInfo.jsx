import React, { Component } from "react";
import { Button, message, Table, Upload } from "antd";
import { Image as Images } from "../../../Images";
import {
  createCustomerDocuments,
  getCustomerDocuments,
} from "../../../../Controller/api/customerAccountServices";
import { withRouter } from "react-router-dom";
import { formatFileSize } from "../../../../Controller/utils";

class DocumentsInfo extends Component {
  state = {
    files: [],
  };
  columns = [
    {
      title: "NAME",
      sorter: true,
      render: (data) => (
        <div>
          <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          <span className="ml-2">
            <a target="_blank" rel="noopener noreferrer" href={data.document}>
              {data.name}
            </a>
          </span>
        </div>
      ),
    },
    {
      title: "SIZE",
      sorter: true,
      dataIndex: "size",
      render: (data) => <div>{formatFileSize(data)}</div>,
    },
    {
      title: "FILE FORMAT",
      sorter: true,
      dataIndex: "format",
    },
  ];
  uploadFile = (data) => {
    let file = data.file;
    let form_data = new FormData();
    form_data.append("account", this.props.match.params.id);
    form_data.append("document", file);
    createCustomerDocuments(form_data)
      .then((res) => {
        this.fetchFiles();
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  fetchFiles = (params = {}) => {
    params.account = this.props.match.params.id;
    params.page = "all";
    getCustomerDocuments(params)
      .then((res) => {
        this.setState({ files: res.data });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  componentDidMount() {
    this.fetchFiles();
  }

  onSearch = (e) => {
    this.fetchFiles({ search: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          {!this.props.hideSearch && (
            <div className="col-12">
              <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
                <div className="new-oppobtnrtunity--div">
                  <Upload
                    multiple
                    showUploadList={false}
                    customRequest={this.uploadFile}
                  >
                    <Button className="new-opportunity-btn text-capitalize">
                     + Upload
                    </Button>
                  </Upload>
                </div>
                {this.props.hideTitle && (
                  <Button
                    onClick={() => this.props.tabChange("4")}
                    className="view-all-btn text-uppercase ml-auto"
                  >
                    VIEW ALL{" "}
                  </Button>
                )}
              </div>
            </div>
          )}
          <div className="col-12 table-responsive main-table-div documents-table-main">
            {this.state.files.length > 0 ? (
              <Table
                pagination={false}
                className=" border-0 carpet-cleaning-table"
                columns={this.columns}
                dataSource={this.state.files}
                size="middle"
              />
            ) : (
              <div className="documents-upload-height my-3 d-flex align-items-center justify-content-center w-100">
                <Upload showUploadList={false} customRequest={this.uploadFile}>
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
      </React.Fragment>
    );
  }
}

export default withRouter(DocumentsInfo);
