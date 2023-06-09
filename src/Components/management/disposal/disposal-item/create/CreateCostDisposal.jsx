import React, { Component } from "react";
import { Button, Form, InputNumber, Select, message } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";
import { getDisposalById, updateDisposal } from "../../../../../Controller/api/disposalServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateCostDisposal extends Component {
  formRef = React.createRef();
  state = {
    loading: false,
    data: null,
    selectValue: null,
  };

  handleSubmit = (values) => {
    if (this.state.selectValue) {
      const newValues = {
        ...values,
        uom: this.state.selectValue,
      };
      updateDisposal(this.props.disposal.id, newValues)
        .then((res) => {
          this.props.setdisposal(res.data, 5);
          message.success("Disposal Updated successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  componentDidMount() {
    // if (this.props.disposal) {
    //   this.formRef.current.setFieldsValue({
    //     ...this.props.disposal,
    //     uom: {
    //       value: this.props.disposal?.uom?.id,
    //       label: this.props.disposal.uom?.name,
    //     },
    //   });
    //   this.setState({ selectValue: this.props.disposal?.uom?.id });
    // }
    // this.handleFormChange();

    if (this.props.match.params.id) {
      getDisposalById(this.props.match.params.id)
        .then(res=>{
          this.formRef.current.setFieldsValue({
                ...res.data,
                uom: {
                  value: res.data?.uom?.id,
                  label: res.data.uom?.name,
                },
              });
              this.setState({ selectValue: res.data?.uom?.id });
            this.handleFormChange();
        })
        .catch(err=>{
          handleError(err)
        })
    }
  }

  handleFormChange = () => {
    let { getFieldValue, setFieldsValue } = this.formRef.current;
    let sub_total =
      (getFieldValue("unit_cost") / 100) * getFieldValue("margin") || 0;
    let total = sub_total + parseFloat(getFieldValue("unit_cost"));
    setFieldsValue({
      price: parseFloat(total.toFixed(2)),
    });
  };

  handleSelectChange = () => {
    this.setState({
      selectValue: this.formRef.current.getFieldValue("uom").value,
    });
  };

  render() {
    const { disposal } = this.props;
    const selectName = this.state.selectValue
      ? this.props.disposal?.uom_array?.find(
          (i) => i.id === this.state.selectValue
        )?.symbol
      : this.props.disposal?.uom_array?.find(
          (i) => i.id === this.props.disposal?.uom?.id
        )?.symbol;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              onFieldsChange={this.handleFormChange}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row  mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      This information is purely informational. It does not
                      affect any pricing.
                    </h6>
                  </div>
                </div>
                <div className="col-12 col-sm-6 position-relative pb-3">
                  <Form.Item
                    name="uom"
                    label={"Unit of Measurement *"}
                    rules={[
                      {
                        required: true,
                        // message: 'this field is required'
                      },
                    ]}
                  >
                    <Select
                      labelInValue
                      showSearch={true}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Select Option"
                      onChange={this.handleSelectChange}
                    >
                      {disposal?.uom_array?.map((i) => {
                        return (
                          <Select.Option value={i.id}>
                            {i.name} ({i.symbol})
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <small
                    className="small-text-tag"
                    style={!this.state.selectValue ? { color: "red" } : null}
                  >
                    You're choosing Unit of Measurements from your pre-selected
                    Custom and Universal Unit of Measurements
                  </small>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="unit_cost"
                    label={"Unit Cost *"}
                    className="position-relative"
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <InputNumber
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                  {this.state.selectValue ? (
                    <small className="cost-symbol">{selectName}</small>
                  ) : (
                    <small className="cost-symbol" style={{ color: "red" }}>
                      UOM
                    </small>
                  )}
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
                  >
                    <InputNumber
                      min={0}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                      placeholder={"%"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="price"
                    label={"Price"}
                    className="position-relative"
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <InputNumber
                      disabled={true}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                  {this.state.selectValue ? (
                    <small className="cost-symbol">{selectName}</small>
                  ) : (
                    <small className="cost-symbol" style={{ color: "red" }}>
                      UOM
                    </small>
                  )}
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

export default withRouter(CreateCostDisposal);
