import React, { Component } from "react";
import { Button, Form, Input, message, Table, Upload } from "antd";
import { Image as Images } from "../../Images";
import {
  createContactDocument,
  getContactDocument,
} from "../../../Controller/api/contactsServices";
import { formatFileSize } from "../../../Controller/utils";
import { withRouter } from "react-router-dom";

class DocumentsInfo extends Component {
  state = {
    files: [],
    pagination: {
      current: 1,
      pageSize: 15,
    },
    loading: false,
  };
  docsColumns = [
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
      dataIndex: "size",
      sorter: true,
      render: (data) => <div>{formatFileSize(data)}</div>,
    },
    {
      title: "FILE FORMAT",
      dataIndex: "format",
      sorter: true,
    },
  ];

  componentDidMount() {
    this.fetchDocument();
  }

  fetchDocument = (params = {}) => {
    this.setState({ loading: true });
    getContactDocument({ contact: this.props.match.params.id, ...params })
      .then((res) => {
        this.setState({ files: res.data.results, loading: false });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };
  onSearch = (e) => {
    this.fetchDocument({ search: e.target.value, page: 1 });
  };

  uploadFile = (data) => {
    let file = data.file;
    let form_data = new FormData();
    form_data.append("contact", this.props.match.params.id);
    form_data.append("document", file);
    createContactDocument(form_data)
      .then((res) => {
        this.fetchDocument();
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
    let { pagination, loading } = this.state;
    if (!this.props.pagination) {
      pagination = false;
    }
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              {/* <div className="search-bar-div">
                                <Form className="position-relative">
                                    <Input placeholder="Search Documents" onChange={this.onSearch}/>
                                    <Button
                                        className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                        <img src={Images.search_icon_gray} className="img-fluid"
                                             alt="search icon"/>
                                    </Button>
                                </Form>
                            </div> */}
              <div className="new-opportunity-btn-div">
                <Upload multiple showUploadList={false} customRequest={this.uploadFile}>
                  <Button className="new-opportunity-btn text-capitalize">
                    + Upload
                  </Button>
                </Upload>
              </div>
              {this.props.hideTitle && (
                <Button
                  onClick={() => this.props.tabChange("3")}
                  className="view-all-btn text-uppercase ml-auto"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
          <div className="col-12 table-responsive main-table-div documents-table-main">
            {this.state.files.length > 0 ? (
              <Table
                pagination={pagination}
                className="border-0 carpet-cleaning-table"
                columns={this.docsColumns}
                loading={loading}
                rowKey={(record) => record.id}
                dataSource={this.state.files}
                size="middle"
              />
            ) : (
              <div className="documents-upload-height d-flex align-items-center justify-content-center w-100">
                <Upload showUploadList={false} customRequest={this.uploadFile}>
                  <Button className="p-0 border-0 shadow-none bg-transparent">
                    <img
                      src={Images.cloud_upload_24}
                      alt={"cloud icon"}
                      className="img-fluid"
                    />
                    <p
                      className="mb-0"
                      style={{ textAlign: "center", color: "#38BC94" }}
                    >
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
