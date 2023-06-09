import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
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
import { Image as Images } from "../Images";
import { getUser } from "../../Controller/api/authServices";
import moment from "moment";
import {
  createOpportunityPost,
  updateOpportunityPost,
} from "../../Controller/api/opportunityServices";
import CommonWarningModal from "../modals/CommonWarningModal";
import { useRef } from "react";
import { handleError } from "../../Controller/Global";
import { getShortName } from "../../Controller/utils";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

// function onChange(date, dateString) {
//     console.log(date, dateString);
// }

const { TextArea } = Input;
const { Option } = Select;

const CreatePostsDrawer = props => {
  const [assignees, setAssignees] = useState([])
  const [fetching, setFetching] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [warningVisible, setWarningVisible] = useState(false);
  const formRef = useRef();

  const handleChange = (v) => {
    setSelectedData(assignees.find(item => item.id === v))
  };

  const showWarningM = (warningVisible) => {
    setWarningVisible(warningVisible)
    // this.setState({ warningVisible });
  };

  const fetchUser = (params = {}) => {
    setFetching(true)
    getUser("salesperson", params)
      .then((res) => {
        setAssignees(res.data.results)
        setFetching(false)
      })
      .catch((err) => {
        handleError(err)
        setFetching(false)
      });
  };
  const handleSubmit = (values) => {
    values.opportunity = props.match.params.id;
    if(values.due_date) {
    values.due_date = moment(values.due_date).format("YYYY-MM-DD");
    }
    if (props.data) {
      updateOpportunityPost(props.data.id, values)
        .then((res) => {
          message.success("Post Updated Successfully");
          formRef.current.resetFields();
          // this.setState({ selectedData: null });
          setSelectedData(null)
          props.onSuccess();
        })
        .catch((err) => {
            handleError(err)
        });
    } else {
      createOpportunityPost(values)
        .then((res) => {
          message.success("Post Created Successfully");
          formRef.current.resetFields();
          setSelectedData(null)
          props.onSuccess();
        })
        .catch((err) => {
          handleError(err)
        });
    }
  };

  const populateData = async () => {
    if (props.data) {
      await fetchUser();
      formRef.current.setFieldsValue({
        ...props.data,
        assignee: props.data?.assignee?.id,
        due_date: props.data?.due_date
          ? moment(props.data?.due_date)
          : null,
      });
      setSelectedData(props?.data?.assignee)
    }
    };
    return (
      <React.Fragment>
        <Drawer
          afterVisibleChange={populateData}
          centered
          maskClosable={false}
          destroyOnClose={true}
          title="Post"
          visible={props.visible}
          className="main-all-form-modal main-drawer-div drawer-update"
          width={"625px"}
          onClose={() => {
            showWarningM(true);
          }}
          placement={"right"}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => {
                  showWarningM(true);
                }}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => formRef.current.submit()}
                type="primary"
              >
                {props.data ? "Update" : "Create"}
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form
                onFinish={handleSubmit}
                ref={formRef}
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
                          <span className="mr-1">Type*</span>
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
                        onFocus={() => fetchUser()}
                        onSearch={(e) => fetchUser({ search: e })}
                        onChange={handleChange}
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
                              {getShortName(selectedData.first_name, selectedData.last_name)}
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
          visible={warningVisible}
          onClose={() => showWarningM(false)}
          heading={"Are you sure you want to exit editing this Post?"}
          handlePostDrawer
          closePostDrawer={props.onClose}
        />
      </React.Fragment>
    );
  }

export default withRouter(CreatePostsDrawer);
