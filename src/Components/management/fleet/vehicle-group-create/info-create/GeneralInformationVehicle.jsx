import React, { Component } from "react";
import { Button, Form, Input, message, Select, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../Images";
import { handleError } from "../../../../../Controller/Global";
import {
  createFleetGroup,
  getFleetGroup,
  updateFleetGroup,
} from "../../../../../Controller/api/vehicleServices";
import CustomSelectOption from "../../../../CustomSelectOption";
import { FLEET_GROUP } from "../../../../../Controller/utils";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class GeneralInformationVehicle extends Component {
  state = {
    subtiers: [],
    fetching: false,
  };
  formRef = React.createRef();

  componentDidMount() {
    this.fetchSubTiers();
  }

  fetchSubTiers = (params = {}) => {
    this.setState({ fetching: true });
    getFleetGroup({ ...params, not_group: true })
      .then((res) => {
        this.setState({ subtiers: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      await this.fetchSubTiers({ search: this.props.name });
      this.formRef.current.setFieldsValue({
        name: this.props.name,
        parent: {
          label: this.props?.subtier?.name || this.props?.subtier?.label,
          value: this.props?.subtier?.id || this.props?.subtier?.key,
        },
        // parent: { label: this.props.subtier.label, value: this.props.subtier.key }
      });
    }
  }

  handleSubmit = (values) => {
    // console.log(values, "check parent");
    const newValues = {
      ...values,
      parent: values.parent.value,
      tier_type: FLEET_GROUP,
    };
    if (this.props.data) {
      updateFleetGroup(this.props.data.id, newValues)
        .then((res) => {
          // this.setState({data: res.data})
          this.props.setData(res.data, 2);
          message.success("Fleet Group updated successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createFleetGroup(newValues)
        .then((res) => {
          // this.setState({data: res.data})
          this.props.setData(res.data, 2);
          message.success("Fleet Group created successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  render() {
    const { fetching, subtiers } = this.state;
    const { name, subtier, onChange } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input fleet group name and choose fleet family / tier.
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
                    label={"Fleet Group Name *"}
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
                      placeholder={"Enter Fleet Group Name"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="parent"
                    label={
                      <div className="d-flex align-items-center">
                        <span>Fleet Family / Tier *</span>
                        {/* <img src={Images.info_small} alt="" className="img-fluid ml-2"/> */}
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
                      // defaultOpen={true}
                      labelInValue
                      showSearch={true}
                      placeholder="Search and Select Region"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchSubTiers()}
                      dropdownClassName="custom-select-drop-main"
                      value={{ label: subtier?.label, value: subtier?.key }}
                      onSearch={(e) => this.fetchSubTiers({ search: e })}
                      onChange={(v) => {
                        onChange("subtier", v);
                        // this.formRef.current.setFieldsValue({
                        //     name: subtiers.find(p => p.id === v).name
                        // });
                        // onChange('name', subtiers.find(p => p.id === v).name)
                      }}
                      optionLabelProp={"label"}
                    >
                      {subtiers.map((d) => (
                        <Option key={d.id} label={d.name} value={d.id}>
                          <CustomSelectOption
                            img={d.parent ? null : Images.fleet_group_truck}
                            data={d}
                            type={d.parent ? "Fleet Tier" : "Fleet Family"}
                          />
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/*<Button className="search-icon bg-transparent border-0 p-0 position-absolute">*/}
                  {/*    <img src={Images.search_small_icon} alt='' className="img-fluid"/>*/}
                  {/*</Button>*/}
                </div>

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

export default withRouter(GeneralInformationVehicle);
