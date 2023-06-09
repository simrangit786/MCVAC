import React, { Component } from "react";
import { Button, Form, message, Table, Upload } from "antd";
import { Image as Images } from "../../../Images";
import { formatFileSize } from "../../../../Controller/utils";
import { withRouter } from "react-router-dom";
import { createProjectDocument, getProjectDocuments } from "../../../../Controller/api/projectServices";
import { handleError } from '../../../../Controller/Global';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ProjectsDocumentsCreate extends Component {
  state = {
    files: [],
  };
  columns = [
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
      sorter: true,
    },
    {
      title: "FILE Format",
      dataIndex: "format",
      sorter: true,
    },
  ];

  fetchFiles = () => {
    getProjectDocuments({ project: this.props.project.id })
      .then((res) => {
        // this.props.setProposal(res.data)
        let newProject = {
          ...this.props.project,
          documents: res.data.results,
        };
        this.setState({ files: res.data.results })
        this.props.setProject(newProject);
      })
      .catch((err) => {
        handleError(err)
      });
  };

  uploadFile = (data) => {
    this.setState({ buttonLoading: true })
    let file = data.file;
    let form_data = new FormData();
    form_data.append("project", this.props.project.id);
    form_data.append("document", file);

    createProjectDocument(form_data)
      .then((res) => {
        this.setState({ buttonLoading: false })
        this.props.fetchProject(res.data.project);
        this.fetchFiles();
        message.success("Documents Upload Successfully")
      })
      .catch((err) => {
        handleError(err)
        this.setState({ buttonLoading: false })
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
                      columns={this.columns}
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
                      loading={this.state.buttonLoading}
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

export default withRouter(ProjectsDocumentsCreate);
