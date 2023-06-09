import React, { Component } from "react";
import { Button, Form, Input, message, Select, Spin } from "antd";
import { Image as Images } from "../../../../Images";
import { getContact } from "../../../../../Controller/api/contactsServices";
import {
  getShift,
  updateLaborGroup,
} from "../../../../../Controller/api/labourServices";
import { handleError } from "../../../../../Controller/Global";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateShiftInfoLabor extends Component {
  state = {
    shifts: [],
    fetching: false,
  };

  formRef = React.createRef();

  componentDidMount() {
    this.fetchShifts();
    if (this.props.group.title) {
      this.formRef.current.setFieldsValue({
        title: this.props.group.title.id,
      });
    }
  }

  fetchShifts = (params = {}) => {
    this.setState({ fetching: true });
    getShift(params)
      .then((res) => {
        this.setState({ fetching: false, shifts: res.data.results });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  handleSubmit = (values) => {
    updateLaborGroup(this.props.group.id, values)
      .then((res) => {
        this.props.setGroup(res.data);
        message.success("Labor Group updated successfully!");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    const { fetching, shifts, buttonLoading } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="title"
                    label={"Title here"}
                    rules={[
                      {
                        required: false,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      showSearch={true}
                      placeholder="Search and Select Shift"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchShifts()}
                      onSearch={(e) => this.fetchShifts({ search: e })}
                      onChange={this.handleSelect}
                    >
                      {shifts.map((d) => (
                        <Option key={d.id} value={d.id}>
                          {d.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/*<Button className="search-icon bg-transparent border-0 p-0 position-absolute">*/}
                  {/*    <img src={Images.search_small_icon} alt='' className="img-fluid"/>*/}
                  {/*</Button>*/}
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="title_2"
                        label={"Title here"}
                        rules={[
                          {
                            required: false,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Input placeholder={"Input"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      loading={buttonLoading}
                      htmlType="submit"
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

export default CreateShiftInfoLabor;
