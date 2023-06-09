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
} from "antd";
import { Image as Images } from "../../Images";
import { withRouter } from "react-router-dom";
import { getUser } from "../../../Controller/api/authServices";
import moment from "moment";
import {
  createProposalPost,
  updateProposalPost,
} from "../../../Controller/api/proposalServices";
import CommonWarningModal from "../../modals/CommonWarningModal";
import { getShortName } from "../../../Controller/utils";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { TextArea } = Input;
const { Option } = Select;
const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class CreateProposalPost extends Component {
  state = {
    assignees: [],
    fetching: false,
    selectedData: null,
    warningVisible: false,
  };
  formRef = React.createRef();

  handleChange = (v) => {
    this.setState({
      selectedData: this.state.assignees.find((item) => item.id === v),
    });
  };

  showWarningM = (warningVisible) => {
    this.setState({ warningVisible });
  };

  fetchUser = (params = {}) => {
    this.setState({ fetching: true });
    getUser("salesperson", params)
      .then((res) => {
        this.setState({ assignees: res.data.results, fetching: false });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
        this.setState({ fetching: false });
      });
  };
  handleSubmit = (values) => {
    values.proposal = this.props.match.params.id;
    // console.log(values.due_date, "dsds")
    if(values.due_date) {
    values.due_date = moment(values.due_date).format("YYYY-MM-DD");
    }
    if (this.props.data) {
      updateProposalPost(this.props.data.id, values)
        .then((res) => {
          message.success("Post Updated Successfully");
          this.formRef.current.resetFields();
          this.setState({ selectedData: null });
          this.props.onSuccess();
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      createProposalPost(values)
        .then((res) => {
          message.success("Post Created Successfully");
          this.formRef.current.resetFields();
          this.setState({ selectedData: null });
          this.props.onSuccess();
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    }
  };

  populateData = async () => {
    if (this.props.data) {
      await this.fetchUser();
      this.formRef.current.setFieldsValue({
        ...this.props.data,
        assignee: this.props.data?.assignee?.id,
        due_date: this.props.data.due_date ? moment(this.props.data.due_date) : null,
      });
      this.setState({ selectedData: this.props.data.assignee });
    }
  };

  render() {
    const { fetching, assignees, selectedData } = this.state;
    return (
      <React.Fragment>
        <Drawer
          afterVisibleChange={this.populateData}
          centered
          destroyOnClose={true}
          title="Post"
          maskClosable={false}
          visible={this.props.visible}
          // onOk={this.props.onClose}
          // onCancel={this.props.onClose}
          className="main-all-form-modal main-drawer-div drawer-update"
          width={"625px"}
          onClose={() => {
            this.showWarningM(true);
          }}
          placement={"right"}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => this.showWarningM(true)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => this.formRef.current.submit()}
                type="primary"
              >
                {this.props.data ? "Update" : "Create"}
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form
                onFinish={this.handleSubmit}
                ref={this.formRef}
                hideRequiredMark={true}
                {...layout}
                className="main-inner-form"
              >
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="name"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Post Name*</span>
                          {/* <img src={Images.info_small} alt="" className="img-fluid"/> */}
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Post Name" />
                    </Form.Item>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="post_type"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Type</span>
                          {/* <img src={Images.info_small} alt="" className="img-fluid"/> */}
                        </div>
                      }
                    >
                      <Select
                        suffixIcon={
                          <img
                            alt=""
                            src={Images.caret_down_small_select}
                            className="img-fluid"
                          />
                        }
                        placeholder="Select Type"
                      >
                        <Option value={"NOTE"}>Note</Option>
                        <Option value={"TASK"}>Task</Option>
                        {/* <Option value={"DEMO_POST_TYPE"}>DEMO POST TYPE</Option> */}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="assignee"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Assignee</span>
                          {/* <img src={Images.info_small} alt="" className="img-fluid"/> */}
                        </div>
                      }
                      className="position-relative"
                    >
                      <Select
                        placeholder="Search Assignee"
                        notFoundContent={
                          fetching ? <Spin size="small" /> : null
                        }
                        filterOption={false}
                        onFocus={() => this.fetchUser()}
                        onSearch={(e) => this.fetchUser({ search: e })}
                        onChange={this.handleChange}
                        suffixIcon={
                          <img
                            alt=""
                            src={Images.caret_down_small_select}
                            className="img-fluid"
                          />
                        }
                      >
                        {assignees.map((d) => (
                          <Option
                            key={d.id}
                            value={d.id}
                          >{`${d.first_name} ${d.last_name}`}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  {selectedData && (
                    <div className="col-12">
                      <div className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main">
                        <div className="col-12">
                          <div className="user-icons-div">
                            <span className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                              {getShortName(selectedData?.first_name, selectedData?.last_name)}
                            </span>
                          </div>
                          <div className="user-info-div">
                            <h6>{`${selectedData.first_name} ${selectedData.last_name}`}</h6>
                            <p className="mb-0">
                              {selectedData.role.split("_").join(" ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-12 col-sm-6">
                    <Form.Item name="due_date" label={"Due Date"}>
                      <DatePicker format={"MM/DD/YYYY"} />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Form.Item name="priority" label={"Priority"}>
                      <Select placeholder="Select Priority">
                        <Option value={"NORMAL"}>
                          <span
                            style={{ backgroundColor: "#fcd966" }}
                            className="status-tag"
                          />
                          Normal
                        </Option>
                        <Option value={"HIGH"}>
                          <span
                            style={{ backgroundColor: "#eb8357" }}
                            className="status-tag"
                          />
                          High
                        </Option>
                        <Option value={"LOW"}>
                          <span
                            style={{ backgroundColor: "#7fd4ba" }}
                            className="status-tag"
                          />
                          Low
                        </Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="description"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Description</span>
                          {/* <img src={Images.info_small} alt="" className="img-fluid"/> */}
                        </div>
                      }
                    >
                      <TextArea
                        className="text-area-main text-area-task"
                        placeholder={"Enter Description"}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
        <CommonWarningModal
          visible={this.state.warningVisible}
          onClose={() => this.showWarningM(false)}
          heading={"Are you sure you want to exit editing this Post?"}
          handlePostDrawer
          closePostDrawer={this.props.onClose}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateProposalPost);
