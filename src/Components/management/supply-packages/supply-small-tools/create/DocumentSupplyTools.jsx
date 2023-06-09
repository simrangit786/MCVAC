import React, { Component } from "react";
import { Button, Form, message, Table, Upload } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import { formatFileSize } from "../../../../../Controller/utils";
import {
  createSupplyDoc,
  getSupplyDoc,
} from "../../../../../Controller/api/supplyServices";
import { handleError } from "../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class DocumentSupplyTools extends Component {
  state = {
    files: [],
    loading: false,
  };
  docsColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name) => (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">{name}</div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (size) => (
        <div className="name-id-details">{formatFileSize(size)} </div>
      ),
    },
    {
      title: <div className="position-relative">FORMAT</div>,
      sorter: true,
      dataIndex: "format",
      render: (format) => <div className="name-id-details">.{format}</div>,
    },
  ];
  uploadFile = (data) => {
    let file = data.file;
    let form_data = new FormData();
    form_data.append("supply", this.props.supply.id);
    form_data.append("document", file);
    createSupplyDoc(form_data)
      .then((res) => {
        this.fetchFiles();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  fetchFiles = () => {
    getSupplyDoc({ supply: this.props.supply.id })
      .then((res) => {
        this.setState({ files: res.data.results });
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
    if (this.props.match.params.id) {
      this.fetchFiles();
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
            <div className="row inner-modal-main-row">
              <div className="col-12">
                <Form
                  hideRequiredMark={true}
                  {...layout}
                  className="main-inner-form"
                >
                  <div className="row">

                  {this.state.files.length > 0 ? (
              <div className="row mx-0 summary-collapse-inner-row-main px-0 pb-0">
                <div className="col-12 table-responsive main-table-div">
                  <Table
                    loading={this.state.loading}
                    className="main-table-all carpet-cleaning-table border-0"
                    columns={this.docsColumns}
                    dataSource={this.state.files}
                    size="middle"
                  pagination={false}
                  />
                </div>
              </div>
            ):(
<div className="col-12">
                      <Form.Item
                        name="files"
                        label={"Document"}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                      >
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
                                Drag & Drop or{" "}
                                <span className="ml-1">Browse</span>
                              </div>
                            </div>
                          </Button>
                        </Upload>
                      </Form.Item>
                    </div>
            )
          }
                    
                    <div className="col-12 validate-div-col text-md-right">
                      <Form.Item>
                        <Button
                          htmlType="submit"
                          className="validate-btn-main"
                          onClick={() =>
                            message.success(
                              "Supply/Small tools updated successfully!"
                            )
                          }
                        >
                          Save and Continue
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
           
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(DocumentSupplyTools);
