import React, { Component } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Spin,
  Table,
  Upload,
} from "antd";
import { Image as Images } from "../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const Option = Select;
const { TextArea } = Input;

class ViewTask extends Component {
  state = {
    data: [],
    value: [],
    fetching: false,
  };
  fileColumns = [
    {
      title: "file icon",
      dataIndex: "file_icon",
    },
    {
      title: "file name",
      dataIndex: "file_name",
    },
    {
      title: "file size",
      dataIndex: "file_size",
    },
    {
      title: "download",
      dataIndex: "download",
      render: (text) => (
        <Button className="border-0 rounded-0 p-0 shadow-none bg-transparent">
          <img src={Images.download_icon} alt="" className="img-fluid" />
        </Button>
      ),
    },
    {
      title: "trash",
      dataIndex: "trash",
      render: (text) => (
        <Button className="border-0 rounded-0 p-0 shadow-none bg-transparent">
          <img src={Images.trash_icon} alt="" className="img-fluid" />
        </Button>
      ),
    },
  ];
  fileData = [
    {
      key: "1",
      file_icon: (
        <img src={Images.docs_file_icon} alt="" className="img-fluid" />
      ),
      file_name: <div className="file-name">Lead description.doc</div>,
      file_size: <div>1.6 MB</div>,
    },
  ];

  fetchUser = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch("https://randomuser.me/api/?results=5")
      .then((response) => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        const data = body.results.map((user) => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        this.setState({ data, fetching: false });
      });
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <React.Fragment>
        <Drawer
          centered
          title={
            <div className="d-flex align-items-center justify-content-between">
              <div className="create-note-div d-flex align-items-center">
                <img
                  src={Images.circle_checked_icon}
                  alt=""
                  className="img-fluid mr-2"
                />
                <div className="create-note-heading-drawer bg-transparent p-0">
                  Contact client for details
                </div>
              </div>
              <Button className="delete-btn-drawer p-0 border-0 bg-transparent">
                <img
                  src={Images.delete_icon_drawer}
                  alt=""
                  className="img-fluid"
                />
              </Button>
            </div>
          }
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-drawer-div"
          width={"450px"}
          onClose={this.props.onClose}
          placement={"right"}
          closeIcon={
            <img
              src={Images.right_arrow_icon_drawer}
              alt=""
              className="img-fluid"
            />
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form {...layout} className="main-inner-form">
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="Assignee"
                      label={
                        <div className="d-flex align-items-center">
                          <img
                            src={Images.info_small}
                            alt=""
                            className="img-fluid ml-1"
                          />
                          <span>Assignee </span>
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <Select
                        mode="multiple"
                        labelInValue
                        value={value}
                        placeholder="Search Assignee"
                        notFoundContent={
                          fetching ? <Spin size="small" /> : null
                        }
                        filterOption={false}
                        onSearch={this.fetchUser}
                        onChange={this.handleChange}
                      >
                        {data.map((d) => (
                          <Option key={d.value}>{d.text}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                      <img
                        src={Images.search_small_icon}
                        alt=""
                        className="img-fluid"
                      />
                    </Button>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="due_date"
                      label={
                        <div className="d-flex align-items-center">
                          <span>Due Date </span>
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <DatePicker />
                    </Form.Item>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="Description"
                      label={
                        <div className="d-flex align-items-center">
                          <img
                            src={Images.info_small}
                            alt=""
                            className="img-fluid ml-1"
                          />
                          <span>Description </span>
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <TextArea
                        className="text-area-main text-area-task"
                        placeholder={"Enter Description"}
                      />
                    </Form.Item>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="file"
                      label={
                        <div className="d-flex align-items-center">
                          <Button className="border-0 rounded-0 p-0 mr-1 bg-transparent">
                            <img
                              src={Images.plus_rounded_icon}
                              alt=""
                              className="img-fluid"
                            />
                          </Button>
                          <span>Files </span>
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Upload {...props}>
                        <Button className="upload-file-btn w-100 d-flex align-items-center justify-content-center">
                          <div className="d-flex align-items-center">
                            <img
                              src={Images.cloud_upload_icon}
                              alt="cloud icon"
                              className="img-fluid"
                            />
                            Drag & Drop or <span>Browse</span>
                          </div>
                        </Button>
                      </Upload>
                    </Form.Item>
                  </div>
                  <div className="col-12 table-responsive">
                    <Table
                      className="file-table-main"
                      pagination={false}
                      columns={this.fileColumns}
                      dataSource={this.fileData}
                      size="middle"
                    />
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default ViewTask;
