import React, { Component } from "react";
import { Button, Form, Input, Select, Spin, message } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../Images";
import { handleError } from "../../../../../Controller/Global";
import { getSupplyGroup } from "../../../../../Controller/api/supplyServices";
import CustomSelectOption from "../../../../CustomSelectOption";
import {
  createSupplyGroup,
  updateSupplyGroup,
} from "../../../../../Controller/api/supplyServices";
import { SUPPLY_GROUP } from "../../../../../Controller/utils";
import { debounce } from 'lodash';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateGeneralInfoSupplyGroup extends Component {
  state = {
    subtiers: [],
    fetching: false,
    supplyMargin: null
  };
  formRef = React.createRef();

  fetchSubTiers = (params = {}) => {
    this.setState({ fetching: true });
    getSupplyGroup({ ...params, not_group: true })
      .then((res) => {
        this.setState({ subtiers: res.data.results, fetching: false });
        // if (this.props.data) {
        this.formRef.current.setFieldsValue({
          ...this.props.data,
          parent: this.props.data.parent.id,
          margin: this.props.data.margin ? `${this.props.data.margin}%` : null
        });
        // }
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      this.fetchSubTiers();
    }
  }

  handleSubmit = (values) => {
    values.margin = this.state.supplyMargin
    if (this.props.data) {
      updateSupplyGroup(this.props.data.id, values)
        .then((res) => {
          this.props.setData(res.data, 2);
          this.setState({
            data: res.data,
          });
          message.success("Supply Group Updated successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      values.tier_type = SUPPLY_GROUP;

      createSupplyGroup(values)
        .then((res) => {
          this.props.setData(res.data, 2);
          this.setState({
            data: res.data,
          });
          message.success("Supply Group created successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };
      debounceEvent = (...args) => {
        this.debouncedEvent = debounce(...args);
        return (e) => {
          return this.debouncedEvent(e);
        };
      };

  handleMargin = (val) => {
    this.setState({supplyMargin: val})
    this.formRef.current.setFieldsValue({
      margin: `${val}%`
    })

  }

  render() {
    const { fetching, subtiers } = this.state;
    const { name, subtier, measurement_unit, onChange } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input information to complete supply group calculations.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              ref={this.formRef}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Supply Group Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      value={name}
                      onChange={(e) => onChange("name", e.target.value)}
                      placeholder={"Supply Group Name"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="parent"
                    label={
                      <div className="d-flex align-items-center">
                        <span className="mr-1">Supply Family / Tier *</span>
                        <img
                          src={Images.info_small}
                          alt={""}
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
                    className="position-relative custom-select-main"
                  >
                    <Select
                      showSearch={true}
                      value={subtier}
                      placeholder="Search Supply Families and Tiers"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchSubTiers()}
                      onSearch={this.debounceEvent((e) => this.fetchSubTiers({ search: e }),1000)}
                      dropdownClassName="custom-select-drop-main"
                      onChange={(v) => {
                        onChange("subtier", v);
                        // this.formRef.current.setFieldsValue({
                        //     name: subtiers.find(p => p.id === v).name
                        // });
                        // onChange('name', subtiers.find(p => p.id === v).name)
                      }}
                      optionLabelProp={"label"}
                    >
                      {subtiers.map((d, index) => (
                        <Option key={index} label={d.name} value={d.id}>
                          <CustomSelectOption
                            data={d}
                            img={d.parent ? null : Images.supply_sub_tier_icon}
                            type={d.parent ? "Supply Tier" : "Supply Family"}
                          />
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/*<Button className="search-icon bg-transparent border-0 p-0 position-absolute">*/}
                  {/*    <img src={Images.search_small_icon} alt='' className="img-fluid"/>*/}
                  {/*</Button>*/}
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="margin"
                    label={"Margin *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      onBlur ={(e) => this.handleMargin(e.target.value)}
                      // onChange={(e) => onChange("name", e.target.value)}
                      placeholder={"Margin"}
                    />
                  </Form.Item>
                </div>
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="measurement_unit" label={"Unit of Measurement*"}
                                               rules={[{
                                                   required: true,
                                                   message: 'this field is required'
                                               }]} className="position-relative">
                                        <Select
                                            value={measurement_unit}
                                            suffixIcon={
                                                <img alt="" src={Images.caret_down_small_select}
                                                     className="img-fluid"/>
                                            }
                                            onChange={(v) => onChange("measurement_unit", v)}
                                            placeholder="Select"
                                        >
                                            <Option value={'UNITS'}>Units</Option>
                                            <Option value={'FEET'}>Feet</Option>
                                            <Option value={'POUNDS'}>Pounds</Option>
                                        </Select>
                                    </Form.Item>
                                </div> */}

                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button htmlType="submit" className="validate-btn-main">
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

export default withRouter(CreateGeneralInfoSupplyGroup);
