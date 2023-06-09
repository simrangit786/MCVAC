import React, { Component } from "react";
import { Button, Form, Input, Select, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";
import { getInventoryPackageItem } from "../../../../../Controller/api/inventoryServices";
import { Image as Images } from "../../../../Images";
import CustomSelectOption from "../../../../CustomSelectOption";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class GeneralInformationInventoryGroup extends Component {
  state = {
    subtiers: [],
    fetching: false,
  };
  formRef = React.createRef();

  fetchSubTiers = (params = {}) => {
    this.setState({ fetching: true });
    getInventoryPackageItem(params)
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
        subtier: this.props.subtier,
      });
    }
  }

  render() {
    const { fetching, subtiers } = this.state;
    const { name, subtier, onChange } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">Lorem ipsum</h6>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Inventory Group Name *"}
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
                      placeholder={"Inventory Group Name"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="subtier"
                    label={
                      <div className="d-flex align-items-center">
                        <span>Inventory Family / Sub-Tiers *</span>
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
                      placeholder="Inventory Family / Sub-Tiers *"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchSubTiers()}
                      onSearch={(e) => this.fetchSubTiers({ search: e })}
                      value={subtier}
                      dropdownClassName="custom-select-drop-main"
                      onChange={(v) => {
                        onChange("subtier", v);
                        this.formRef.current.setFieldsValue({
                          name: subtiers.find((p) => p.id === v).name,
                        });
                        onChange("name", subtiers.find((p) => p.id === v).name);
                      }}
                      optionLabelProp={"label"}
                    >
                      {subtiers.map((d) => (
                        <Option key={d.id} value={d.id} label={d.name}>
                          <CustomSelectOption
                            img={
                              d.parent
                                ? Images.list_nested_icon_green
                                : Images.package_icon_vehicle
                            }
                            data={d}
                          />
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
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

export default withRouter(GeneralInformationInventoryGroup);
