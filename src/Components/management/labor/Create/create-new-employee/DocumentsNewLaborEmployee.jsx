import React, { Component } from "react";
import { Button, Form, message, Table, Upload } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import { formatFileSize } from "../../../../../Controller/utils";
import {
  createEmployeeDoc,
  getEmployeeDoc,
} from "../../../../../Controller/api/labourServices";
import { handleError } from "../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class DocumentsNewLaborEmployee extends Component {
  state = {
    files: [],
    loading: false,
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
  uploadFile = (data) => {
    let file = data.file;
    let form_data = new FormData();
    form_data.append("employee", this.props.employee.id);
    form_data.append("document", file);
    createEmployeeDoc(form_data)
      .then((res) => {
        this.fetchFiles();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  fetchFiles = () => {
    getEmployeeDoc({ employee: this.props.employee.id })
      .then((res) => {
        this.setState({ files: res.data.results });
      })
      .catch((err) => {
      handleError(err)
      });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.fetchFiles(this.props.match.params.id);
    }else{
      this.fetchFiles()
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please upload all related documents here.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form {...layout} className="main-inner-form">
              <div className="row">
                {this.state.files.length > 0 ? (
                  <div className="col-12 table-responsive">
                    <Table
                      className="documents-table"
                      columns={this.docsColumns}
                      dataSource={this.state.files}
                      size="middle"
                      pagination={false}
                    />
                  </div>
                ) : (
                  <div className="col-12 mb-4">
                    <Upload
                      showUploadList={false}
                      customRequest={this.uploadFile}
                    >
                      <Button className="upload-file-btn w-100 d-flex align-items-center justify-content-center">
                        <div className="row">
                          <div className="col-12">
                            <img
                              src={Images.cloud_upload_24}
                              alt="cloud icon"
                              className="img-fluid"
                            />
                          </div>
                          <div className="col-12 mt-1">
                            Drag & Drop or <span className="ml-1">Browse</span>
                          </div>
                        </div>
                      </Button>
                    </Upload>
                  </div>
                )}
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      loading={this.state.loading}
                      htmlType={"submit"}
                      className="validate-btn-main"
                    >
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>

    );
  }
}

export default withRouter(DocumentsNewLaborEmployee);
