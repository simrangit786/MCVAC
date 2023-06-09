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
  Upload,
} from "antd";
import { Image as Images } from "../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

function onChange(date, dateString) {
  console.log(date, dateString);
}

const { TextArea } = Input;
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
const { Option } = Select;

class CreateTask extends Component {
  state = {
    data: [],
    value: [],
    fetching: false,
  };
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
          title="Create Task"
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-all-form-modal main-drawer-div"
          width={"450px"}
          placement={"right"}
          closeIcon={false}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.props.onClose} type="primary">
                Create Task
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form {...layout} className="main-inner-form">
                <div className="row">
                  <div className="col-12 small-heading-main">
                    <h6>General Information</h6>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="task_name"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Task Name*</span>
                          <img
                            src={Images.info_small}
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Task Name" />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="assignee"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Assignee</span>
                          <img
                            src={Images.info_small}
                            alt=""
                            className="img-fluid"
                          />
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

                  <div className="col-12 col-sm-6">
                    <Form.Item
                      name="date"
                      label={"Due Date"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <DatePicker onChange={onChange} />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="Description"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Description</span>
                          <img
                            src={Images.info_small}
                            alt=""
                            className="img-fluid"
                          />
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
                        className="text-area-main"
                        placeholder={"Enter Description"}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="files"
                      label={"Files"}
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
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default CreateTask;
