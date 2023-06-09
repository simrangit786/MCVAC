import React, { Component } from "react";
import { Form, Input, InputNumber, Select, Spin } from "antd";
import { Image as Images } from "../../../../Images";
import { getSubUnitName } from "../../../../../Controller/api/disposalServices";
import { handleError } from "../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Option, OptGroup } = Select;

class GeneratePriceForm extends Component {
  state = {
    allOptions: [],
  };

  formRef = React.createRef();
  costFormRef = React.createRef();
  handleFormChange = () => {
    this.props.newFunc(this.formRef.current.getFieldsValue());
  };

  handleCostFormChange = () => {
    this.props.newFunc(this.costFormRef.current.getFieldsValue());
    const cost_uom = this.costFormRef.current.getFieldValue('cost_uom');
    if(cost_uom) {
      this.formRef.current.setFieldsValue({
        pricing_uom: {value: cost_uom?.value, name: cost_uom?.label}
      })
    }
  }

  componentDidMount() {
    const  {selectedPricing} = this.props;
    this.formRef.current.setFieldsValue({
      hourly_price: selectedPricing?.hourly_price, 
      daily_price: selectedPricing?.daily_price, 
      price: selectedPricing?.price,
      pricing_uom: selectedPricing?.cost_uom ? {value: selectedPricing?.cost_uom?.id, name: selectedPricing?.cost_uom?.name} : {value: selectedPricing?.pricing_uom?.id, name: selectedPricing?.pricing_uom?.name}, 
    });
    this.costFormRef.current.setFieldsValue({
      unit_cost: selectedPricing?.unit_cost,
      cost_uom: selectedPricing?.cost_uom ? {value: selectedPricing?.cost_uom?.id, name: selectedPricing?.cost_uom?.name} : {value: selectedPricing?.pricing_uom?.id, name: selectedPricing?.pricing_uom?.name}
    })
    this.getUnitName();
  }

  getUnitName = (params) => {
    this.setState({ fetching: true });
    getSubUnitName(params)
      .then((res) => {
        const UnitTypes={};
        res.data.forEach((item) => {
          if (!UnitTypes[item.unit_type.name]) {
            UnitTypes[item.unit_type.name] = [];
          }
          UnitTypes[item.unit_type.name].push(item);
        });
        this.setState({ allOptions: UnitTypes });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        this.setState({ fetching: false });
      });
  };

  componentDidUpdate(prevProps, prevState) {
    const {selectedPricing} = this.props;
    if(prevProps.selectedPricing?.margin != selectedPricing?.margin) {
      this.formRef.current.setFieldsValue({
        hourly_price: selectedPricing?.hourly_price, 
        daily_price: selectedPricing?.daily_price, 
        price: selectedPricing?.price,
        pricing_uom: selectedPricing?.cost_uom ? {value: selectedPricing?.cost_uom?.id, name: selectedPricing?.cost_uom?.name} : {value: selectedPricing?.pricing_uom?.id, name: selectedPricing?.pricing_uom?.name}, 
      });
      this.costFormRef.current.setFieldsValue({
        unit_cost: selectedPricing?.unit_cost,
        cost_uom: selectedPricing?.cost_uom ? {value: selectedPricing?.cost_uom?.id, name: selectedPricing?.cost_uom?.name} : {value: selectedPricing?.pricing_uom?.id, name: selectedPricing?.pricing_uom?.name}
      })
    }
  }

  render() {
    const { newPrice } = this.props;
    const suggested_daily_price = this.props.selectedPricing?.suggested_daily_price;
    const suggested_hourly_price = this.props.selectedPricing?.suggested_hourly_price;
    const daily_cost = this.props.selectedPricing?.daily_cost;
    const hourly_cost = this.props.selectedPricing?.hourly_cost;
    // const unit_cost = this.props.selectedPricing?.unit_cost || 0.00;
    const { fetching } = this.state;
    return (
      <React.Fragment>
        <div className="col-12 bg-white price-estimated-row-table-1">
          <div className="row mx-0 suggest-price-row">
            <div className="col-12 col-sm-4">
              <h6 className="mb-0">Cost:</h6>
            </div>
            <div className="col-12 col-sm-8">
              <div className="row common-form-card-row">
                <div className="col-12">
                  <Form
                    {...layout}
                    hideRequiredMark={true}
                    className="main-inner-form"
                  >
                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Item
                          name="hourly_cost"
                          label={"Hourly Cost *"}
                          className="position-relative"
                        >
                          <Input
                            disabled={true}
                            placeholder={
                              `$${hourly_cost || 0.00}`
                            }
                          />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Item
                          name="daily"
                          label={"Daily Cost *"}
                          className="position-relative"
                        >
                          <Input
                            disabled={true}
                            placeholder={`$${daily_cost || 0.0}`}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <h6 className="mb-0">Unit Cost:</h6>
            </div>
            <div className="col-12 col-sm-8">
              <div className="row common-form-card-row">
                <div className="col-12">
                  <Form
                    {...layout}
                    ref={this.costFormRef}
                    hideRequiredMark={true}
                    onFieldsChange={this.handleCostFormChange}
                    className="main-inner-form"
                  >
                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Item
                          name="unit_cost"
                          label={"Cost"}
                          className={
                            this.costFormRef.current?.getFieldValue(
                              "unit_cost"
                            )
                              ? "position-relative add-dollar-main-item color-change"
                              : "position-relative add-dollar-main-item"
                          }
                        >
                          <Input
                            style={{ paddingLeft: "22px" }}
                            placeholder={`0.00`}
                          />
                        </Form.Item>
                        <small className="add-dollar add-dollar-2 position-absolute">
                          $
                        </small>
                      </div>
                      <div className="col-12 col-sm-6">
                      <span
                        style={{
                          color: "#333333",
                          lineHeight: "22px",
                          fontSize: "17px",
                          left: "-3px",
                          bottom: "29px",
                        }}
                        className="position-absolute"
                      >
                        /{" "}
                      </span>
                      <Form.Item
                                name="cost_uom"
                                label={"Unit"}
                                rules={[
                                  {
                                    required: false,
                                    message: "",
                                  },
                                ]}
                              >
                                <Select
                                  labelInValue
                                  // dropdownClassName="custom-uom-dropdown"
                                  dropdownClassName="dropdown-select-search"
                                  suffixIcon={
                                    <img
                                      alt=""
                                      className="img-fluid"
                                      src={Images.caret_down_small_select}
                                    />
                                  }
                                  showSearch
                                  notFoundContent={fetching ? <Spin /> : null}
                                  filterOption={false}
                                  onSearch={(e) =>
                                    this.getUnitName({ search: e })
                                  }
                                  defaultValue={
                                    newPrice?.cost_uom
                                      ? {
                                          value: newPrice?.cost_uom?.id,
                                          name: newPrice?.cost_uom?.name,
                                        }
                                      : "a"
                                  }
                                >
                                  {/* <Option value="a">Select</Option> */}
                                  {Object.entries(this.state.allOptions).map((i, index, arr) =>  {
                                return (
                                <OptGroup
                                key={i && i[0]}
                                value={i && i[0]}
                                label={i && i[0]}
                                className={"kit-uom-optgroup"}
                              >
                            {i && 
                              i[1].map((u) => {
                                return (
                                  <Option
                                    key={u.id}
                                    value={u.id}
                                    className="text-lowercase"
                                  >
                                    {u.name}
                                  </Option>
                                );
                              })}
                          </OptGroup>
                                    );
                                  })}
                                  
                                </Select>
                              </Form.Item>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <div className="row mx-0 suggest-price-row">
            <div className="col-12 col-sm-4">
              <h6 className="mb-0">Suggested Price:</h6>
            </div>
            <div className="col-12 col-sm-8">
              <div className="row common-form-card-row">
                <div className="col-12">
                  <Form
                    {...layout}
                    hideRequiredMark={true}
                    className="main-inner-form"
                  >
                    <div className="row">
                      <div className="col-12 col-sm-6">
                        <Form.Item
                          name="suggested_hourly_price"
                          label={"Hourly Price *"}
                          className="position-relative"
                        >
                          <Input
                            disabled={true}
                            placeholder={
                              `$${suggested_hourly_price || 0.00}`
                            }
                          />
                        </Form.Item>
                      </div>
                      <div className="col-12 col-sm-6">
                        <Form.Item
                          name="suggested_daily_price"
                          label={"Daily Price *"}
                          className="position-relative"
                        >
                          <Input
                            disabled={true}
                            placeholder={`$${suggested_daily_price || 0.0}`}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 bg-white price-estimated-row-table-2">
          <div className="row mx-0">
            <div className="col-12">
              <Form
                ref={this.formRef}
                {...layout}
                hideRequiredMark={true}
                onFieldsChange={this.handleFormChange}
                className="main-inner-form"
              >
                <div className="col-12">
                  <div className="row mr-0 suggest-price-row">
                    <div className="col-12 col-sm-4">
                      <h6 className="mb-0">Price:</h6>
                    </div>
                    <div className="col-12 col-sm-8">
                      <div className="row mr-0 common-form-card-row pb-0 pr-0">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-sm-6">
                              <Form.Item
                                name="hourly_price"
                                label={"Hourly Price *"}
                                className={
                                  this.formRef.current?.getFieldValue(
                                    "hourly_price"
                                  )
                                    ? "position-relative add-dollar-main-item color-change"
                                    : "position-relative add-dollar-main-item"
                                }
                              >
                                <Input
                                  style={{ paddingLeft: "22px" }}
                                  // formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  placeholder={`${this.props.hourPrice || 0.0}`}
                                />
                              </Form.Item>
                              <small className="add-dollar add-dollar-2 position-absolute">
                                $
                              </small>
                            </div>
                            <div className="col-12 col-sm-6">
                              <Form.Item
                                name="daily_price"
                                label={"Daily Price *"}
                                className={
                                  this.formRef.current?.getFieldValue(
                                    "daily_price"
                                  )
                                    ? "position-relative add-dollar-main-item color-change"
                                    : "position-relative add-dollar-main-item"
                                }
                              >
                                <Input
                                  style={{ paddingLeft: "22px" }}
                                  // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                  placeholder={`${
                                    this.props.totalPrice || 0.0
                                  }`}
                                />
                              </Form.Item>
                              <small className="add-dollar add-dollar-2 position-absolute">
                                $
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mr-0 suggest-price-row">
                    <div className="col-12 col-sm-4">
                      <h6 className="mb-0">Unit Price:</h6>
                    </div>
                    <div className="col-12 col-sm-8">
                      <div className="row mr-0 common-form-card-row pt-0 pr-0">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-sm-6">
                              <Form.Item
                                name="price"
                                label={"Price"}
                                className="position-relative"
                              >
                                <InputNumber
                                  formatter={(value) =>
                                    `$ ${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  }
                                  parser={(value) =>
                                    value.replace(/\$\s?|(,*)/g, "")
                                  }
                                  placeholder={"$0.00"}
                                />
                              </Form.Item>
                            </div>
                            <div className="col-12 col-sm-6">
                              <span
                                style={{
                                  color: "#333333",
                                  lineHeight: "22px",
                                  fontSize: "17px",
                                  left: "-3px",
                                  bottom: "29px",
                                }}
                                className="position-absolute"
                              >
                                /{" "}
                              </span>
                              <Form.Item
                                name="pricing_uom"
                                label={"Unit"}
                                rules={[
                                  {
                                    required: false,
                                    message: "",
                                  },
                                ]}
                              >
                                <Select
                                  labelInValue
                                  // dropdownClassName="custom-uom-dropdown"
                                  disabled
                                  dropdownClassName="dropdown-select-search"
                                  suffixIcon={
                                    <img
                                      alt=""
                                      className="img-fluid"
                                      src={Images.caret_down_small_select}
                                    />
                                  }
                                  showSearch
                                  notFoundContent={fetching ? <Spin /> : null}
                                  filterOption={false}
                                  onSearch={(e) =>
                                    this.getUnitName({ search: e })
                                  }
                                  defaultValue={
                                    newPrice?.pricing_uom
                                      ? {
                                          value: newPrice?.pricing_uom?.id,
                                          name: newPrice?.pricing_uom?.name,
                                        }
                                      : "a"
                                  }
                                >
                                  {/* <Option value="a">Select</Option> */}
                                  {Object.entries(this.state.allOptions).map((i, index, arr) =>  {
                                return (
                                <OptGroup
                                key={i && i[0]}
                                value={i && i[0]}
                                label={i && i[0]}
                                className={"kit-uom-optgroup"}
                              >
                            {i && 
                              i[1].map((u) => {
                                return (
                                  <Option
                                    key={u.id}
                                    value={u.id}
                                    className="text-lowercase"
                                  >
                                    {u.name}
                                  </Option>
                                );
                              })}
                          </OptGroup>
                                    );
                                  })}
                                  
                                </Select>
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default GeneratePriceForm;
