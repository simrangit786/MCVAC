import React, { Component } from "react";
import { Button, Form, InputNumber, message, Select, Spin } from "antd";
import { Image as Images } from "../../../../Images";
import WageInfoTableMain from "./WageInfoTableMain";
import {
  getEmployeeType,
  updateLaborGroup,
} from "../../../../../Controller/api/labourServices";
import { handleError } from "../../../../../Controller/Global";
import { formatMoney, parseMoney } from "../../../../../Controller/utils";
import CommonWarningModal from "../../../../modals/CommonWarningModal";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateWageInfoLabor extends Component {
  state = {
    labors: [],
    employeeType: [],
    fetching: false,
    item: null,
  };

  formRef = React.createRef();

  fetchEmployeeType = (params = {}) => {
    this.setState({ fetching: true });
    getEmployeeType(params)
      .then((res) => {
        this.setState({
          employeeType: this.sortArr(res.data.results),
          fetching: false,
        });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  sortArr = (data) => {
    let sortableData = data;
    let ordering = {}, // map for efficient lookup of sortIndex
      sortOrder = [
        "Operator",
        "Tech",
        "Apprentice 1",
        "Apprentice 2",
        "Apprentice 3",
        "Apprentice 4",
      ];
    for (var i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i;
    sortableData.sort(function (a, b) {
      return ordering[a.title] - ordering[b.title];
    });
    return sortableData;
  };

  handleChangeFields = (labor) => {
    let oldLabors = this.state.labors.map((l) => {
      if (l.id === labor.id) {
        return labor;
      } else {
        return l;
      }
    });
    this.setState({ labors: oldLabors });
  };

  handleRemove = (labor) => {
    this.setState(
      (prevState) => ({
        labors: prevState.labors.filter((l) => l.id !== labor.id),
      }),
      () => this.submitTable()
    );
  };

  handleSubmit = (values) => {
    let data = {
      id: values.wage_type.value,
      wage_type: values.wage_type.label,
      base_rate: values.base_rate,
      straight_time_multiplier: 1,
      straight_time_benefits: 0,
      straight_time_health: 0,
      over_time_multiplier: 1.5,
      over_time_benefits: 0,
      over_time_health: 0,
      double_time_multiplier: 2,
      double_time_benefits: 0,
      double_time_health: 0,
      off_shift_multiplier: 2.3,
      off_shift_benefits: 0,
      off_shift_health: 0,
      night_time_off_shift_multiplier: 3,
      night_time_off_shift_benefits: 0,
      night_time_off_shift_health: 0,
    };

    let unsortedTables = [...this.state.labors, data];
    this.setState({ labors: this.sortArr(unsortedTables) });
    this.formRef.current.resetFields();
  };

  submitTable = () => {
    updateLaborGroup(this.props.group.id, { table_data: this.state.labors })
      .then((res) => {
        this.props.setGroup(res.data, 3);
        message.success("Labor Group updated successfully!");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  componentDidMount() {
    if (this.props.group.table_data) {
      this.setState({ labors: this.props.group.table_data || [] });
    }
  }

  handleVisible = (visible, item = null) => {
    this.setState({ visible, item });
  };

  render() {
    let { labors, employeeType, fetching } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please choose wage type, input base rate, then click ‘Add’
                button to generate wage information.
              </h6>
            </div>
          </div>
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
                    name="wage_type"
                    label={"Wage Type *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      showSearch
                      labelInValue
                      placeholder="Select"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchEmployeeType()}
                      onSearch={(e) => this.fetchEmployeeType({ search: e })}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                    >
                      {employeeType
                        .filter(
                          (i) => !labors.some((p) => p.wage_type === i.title)
                        )
                        .map((item) => (
                          <Option key={item.id} value={item.id}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row remove-arrow">
                    <div className="col-12">
                      <Form.Item
                        name="base_rate"
                        label={"Base Rate *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <InputNumber
                          formatter={formatMoney}
                          parser={parseMoney}
                          placeholder={"$0.00"}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 validate-div-col mt-0 text-md-right">
                  <Form.Item>
                    <Button htmlType="submit" className="validate-btn-main">
                      Add
                    </Button>
                  </Form.Item>
                </div>
                {labors.length === 0 ? (
                  <div className="col-12">
                    <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                      <div className="col-12 text-center">
                        <img
                          src={Images.billing_empty_state_icon}
                          alt=""
                          className="img-fluid"
                        />
                        <h6 className="mb-0 color-gray-3">
                          Added costs will show up here
                        </h6>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-12">
                    <div className="row mx-0">
                      <WageInfoTableMain
                        //    handleRemove={this.handleRemove}
                        handleVisible={this.handleVisible}
                        handleChangeFields={this.handleChangeFields}
                        labors={labors}
                      />
                    </div>
                  </div>
                )}

                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      disabled={labors.length === 0}
                      onClick={this.submitTable}
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
        <CommonWarningModal
          visible={this.state.visible}
          onClose={() => this.handleVisible(false)}
          wageInfoDelete
          removeItem={() => {
            // this.removeItem()
            this.handleRemove(this.state.item);
            this.handleVisible(false);
          }}
          heading={"Are you sure you want to delete this Wage Information?"}
          subHeadingUOM={
            "If you choose to delete this Wage Information, and if this Wage Information is included in service variants, this might cause issues."
          }
        />
      </React.Fragment>
    );
  }
}

export default CreateWageInfoLabor;
