import React, { Component } from "react";
import { Button, Form, Input, message, Table, Upload } from "antd";
import { Image as Images } from "../../../../Images";
import { formatFileSize } from "../../../../../Controller/utils";
import {
  createCustomerDocuments,
  getCustomerDocuments,
  createSiteDocument,
  getSiteDocuments
} from "../../../../../Controller/api/customerAccountServices";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";

class SiteManagerDocumentsInfo extends Component {
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
    form_data.append("site", this.props.siteData.id);
    form_data.append("document", file);
    createSiteDocument(form_data)
      .then((res) => {
        message.success("Document uploaded successfully!")
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

  fetchFiles = () => {
    getSiteDocuments({ site: this.props.siteData?.id}).then(res => {
       this.setState({files: res.data.results})
    }).catch(err => {
      handleError(err);
    })
  }

  // fetchFiles = () => {
  //   getCustomerDocuments({ account: this.props.match.params.id })
  //     .then((res) => {
  //       this.setState({ files: res.data.results });
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         Object.keys(err.response.data).map((e) => {
  //           message.error(err.response.data[e]);
  //         });
  //       }
  //     });
  // };

  componentDidMount() {
    if (this.props.siteData?.id) {
    this.fetchFiles();
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="new-opportunity-btn-div">
                <Upload multiple showUploadList={false} customRequest={this.uploadFile}>
                  <Button className="new-opportunity-btn text-capitalize">
                    + Upload
                  </Button>
                </Upload>
              </div>
              {this.props.hideTitle && (
                <Button
                  onClick={() => this.props.tabChange("5")}
                  className="view-all-btn text-uppercase ml-auto"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
          <div className="col-12 mt-3 table-responsive main-table-div documents-table-main">
            {this.state.files.length > 0 ? (
              <Table
                pagination={false}
                className=" border-0 carpet-cleaning-table"
                columns={this.columns}
                dataSource={this.state.files}
                size="middle"
              />
            ) : (
              <div className="documents-upload-height d-flex align-items-center justify-content-center w-100">
                <Upload multiple showUploadList={false} customRequest={this.uploadFile}>
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
        {/*<div className="h-100 w-100 align-items-center justify-content-center row mx-0">*/}
        {/*    <div className="col-12">*/}
        {/*        <div className="row no-data-upload-screens">*/}
        {/*            <div className="col-12 text-center">*/}
        {/*                <img src={Images.cloud_upload_icon} alt="cloud upload" className="img-fluid"/>*/}
        {/*                <h6 className="mb-0 mt-1">Upload a document here</h6>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*</div>*/}
      </React.Fragment>
    );
  }
}

export default withRouter(SiteManagerDocumentsInfo);
