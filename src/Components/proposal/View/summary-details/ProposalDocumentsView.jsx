import React, { Component } from "react";
import { Button, Form, Input, message, Table, Upload } from "antd";
import { Image as Images } from "../../../Images";
import { formatFileSize } from "../../../../Controller/utils";
import {
  createProposalDocument,
  getProposalDocuments,
} from "../../../../Controller/api/proposalServices";
import { handleError } from "../../../../Controller/Global";
import { withRouter } from "react-router-dom";

class ProposalDocumentsView extends Component {
  state = {
    files: [],
  };
  docsColumns = [
    {
      title: "name",
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
      title: "Size",
      dataIndex: "size",
      render: (data) => <div>{formatFileSize(data)}</div>,
    },
    {
      title: "FILE Format",
      dataIndex: "format",
    },
  ];
  docsData = [
    {
      name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">File Name</div>
        </div>
      ),
      size: <div className="name-id-details">15 KB</div>,
      format: <div className="name-id-details">.docx</div>,
    },
    {
      name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">File Name</div>
        </div>
      ),
      size: <div className="name-id-details">15 KB</div>,
      format: <div className="name-id-details">.docx</div>,
    },
  ];

  fetchFiles = (params = {}) => {
    params.proposal = this.props.match.params.id;
    getProposalDocuments(params)
      .then((res) => {
        this.setState({ files: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  componentDidMount() {
    this.fetchFiles();
  }

  uploadFile = (data) => {
    let file = data.file;
    let form_data = new FormData();
    form_data.append("proposal", this.state.proposal.id);
    form_data.append("document", file);
    createProposalDocument(form_data)
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

  render() {
    let { files } = this.state;
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row align-items-center carpet-cleaning-mini-header">
              <h6 className="mb-0 d-flex align-items-center">
                <aside>
                  Documents
                  {/*<span>(16)</span>*/}
                </aside>
                {/*<Button className="edit-btn-summary ml-2">*/}
                {/*    <img src={Images.pencil_green} alt="" className="img-fluid"/>*/}
                {/*    Edit*/}
                {/*</Button>*/}
              </h6>
            </div>
          </div>
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse justify-content-between align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div d-flex align-items-center">
                <Form className="position-relative">
                  <Input placeholder="Search Site" />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
                <Upload showUploadList={false} customRequest={this.uploadFile}>
                  <Button className="add-btn-collapse ml-2 text-capitalize">
                    + Upload
                  </Button>
                </Upload>
                '
              </div>
              <Button className="view-all-btn text-uppercase">VIEW ALL </Button>
            </div>
          </div>
        </div>
        <div className="row mx-0 mt-4">
          <div className="col-12">
            <div className="row">
              <div className="col-12 table-responsive main-table-div">
                <Table
                  className="main-table-all"
                  scroll={{ y: 240 }}
                  columns={this.docsColumns}
                  dataSource={files}
                  size="middle"
                  pagination={false}
                  locale={{
                    emptyText: (
                      <div className="col-12">
                        <div className="row no-data-upload-screens no-data-second m-0 border-0">
                          <div className="col-12 text-center">
                            <Upload
                              showUploadList={false}
                              customRequest={this.uploadFile}
                            >
                              <Button className="border-0 h-auto shadow-none">
                                <img
                                  src={Images.cloud_upload_icon}
                                  alt=""
                                  className="img-fluid"
                                />
                                <h6 className="mb-0 text-green-tag">
                                  Upload Document
                                </h6>
                              </Button>
                            </Upload>
                          </div>
                        </div>
                      </div>
                    ),
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        window.open(record.document, "_blank");
                      },
                    };
                  }}
                />
              </div>
            </div>
            {/*<div*/}
            {/*    className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">*/}
            {/*    <div className="col-12 text-center cursor-pointer">*/}
            {/*        <img src={Images.cloud_upload_icon}*/}
            {/*             className="img-fluid"*/}
            {/*             alt="search icon"/>*/}
            {/*        <h6 className="mb-0 text-green-tag">Upload Document</h6>*/}
            {/*    </div>*/}
            {/*</div>*/}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ProposalDocumentsView);
