import React, { Component } from "react";
import { Button, Form, InputNumber, message, Select } from "antd";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";
import { getInventoryById, updateInventory } from "../../../../../Controller/api/inventoryServices";
import { Image as Images } from "../../../../Images";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateCostInventoryItems extends Component {
  formRef = React.createRef();
  state = {
    selectValue: null,
    unit_type: null
  };

  componentDidMount() {
    
    // if (this.props.inventory) {
    //   this.formRef.current.setFieldsValue({
    //     ...this.props.inventory,
    //     uom: {
    //       value: this.props.inventory.uom?.id,
    //       label: this.props.inventory.uom?.name,
    //     },
    //   });
    //   this.setState({ selectValue: this.props.inventory.uom?.id });
    // }
    // this.handleFormChange();
if (this.props.match?.params?.id) {
  getInventoryById(this.props.match?.params?.id)
  .then(res=>{
    const foundUom = res.data.unit_type === "COM" ? res.data.com?.find(i => i.id === res.data.uom.id) : res.data.uom_array?.find(i => i.id === res.data.uom.id)
    this.formRef.current.setFieldsValue({
          ...res.data,
          uom: {
            value: foundUom?.id,
            label: foundUom?.name,
          },
        });
        this.setState({ selectValue: foundUom?.id, unit_type: res.data.unit_type });
      this.handleFormChange();
  }).catch(err=>{
    handleError(err)
  })
}

  }

  handleSubmit = (values) => {
    const {selectValue, unit_type} = this.state;
    if (selectValue) {
      const newValues = {
        ...values,
        uom: selectValue,
        unit_type
      };
      updateInventory(this.props.inventory.id, newValues)
        .then((res) => {
          this.props.setInventory(res.data, 5);
          message.success("Inventory updated successfully");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  // handleFormChange = () => {
  //     let { getFieldValue, setFieldsValue } = this.formRef.current;
  //     let price = (getFieldValue('margin') || 0);
  //     setFieldsValue({price: price?.toFixed(2) || 0})
  // }

  handleFormChange = () => {
    let { getFieldValue, setFieldsValue } = this.formRef.current;
    let sub_total =
      (getFieldValue("unit_cost") / 100) * getFieldValue("margin") || 0;
    let total = sub_total + parseFloat(getFieldValue("unit_cost"));
    setFieldsValue({
      price: parseFloat(total.toFixed(2)),
    });
  };

  handleSelectChange = (data) => {

    let value = data.value;
    if (value) {
        let unit_type = (typeof (value) === 'string' && value.includes('COM')) ? 'COM' : 'UOM';
        let selectid;
        if (unit_type === 'COM') {
            let splitt = value?.split('_');
            selectid = parseInt(splitt[splitt.length - 1]);
        }
        else {
            selectid = value;
        }
        this.setState({ selectValue: selectid, unit_type })
    }
    // this.setState({
    //   selectValue: this.formRef.current.getFieldValue("uom").value,
    // });
  };

  render() {
    const { inventory } = this.props;
    const {selectValue , unit_type} = this.state;
    const selectName = unit_type === "COM" ? 
     inventory?.com?.find(i => i.id === selectValue)?.abbreviation
     :
     inventory?.uom_array?.find(n => n.id === selectValue)?.symbol;
    // const selectName = inventory?.unit_type === "COM" ?
    //   this.props.inventory?.com.find(i => i => i.id === )
    //   ? this.props.inventory?.uom_array?.find(
    //       (i) => i.id === this.state.selectValue
    //     )?.symbol
      // : this.props.inventory?.uom_array?.find(
      //     (i) => i.id === this.props.inventory?.uom?.id
      //   )?.symbol;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              onFieldsChange={this.handleFormChange}
              className="main-inner-form"
            >
              <div className="row">
                {/*<div className="col-12">*/}
                {/*    <div className="row mx-0 info-card-heading-row-info align-items-center">*/}
                {/*        <div*/}
                {/*            className="info-icon-card-flag-info d-flex align-items-center justify-content-center">*/}
                {/*            <img src={Images.info_yellow} alt="" className="img-fluid"/>*/}
                {/*        </div>*/}
                {/*        <div className="info-icon-card-details-info">*/}
                {/*            <h6 className="mb-0">Estimated Total Cost is the main cost for Proposals</h6>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      This section gives us the information we need in order to
                      factor the price of an inventory item (e.g. garbage bag)
                      when creating a line item.
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
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Select
                      labelInValue
                      onChange={this.handleSelectChange}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      // value={this.state.selectValue}
                      placeholder="Select Option"
                    >
                      {inventory?.uom_array?.map((i) => {
                        return (
                          <Select.Option value={i.id}>
                            {i.name} ({i.symbol})
                          </Select.Option>
                        );
                      })}
                      {inventory?.com?.map(
                          (i) => {
                              let COM_ID = `COM_${i.id}`
                              return (
                                  <Select.Option
                                      key={COM_ID}
                                      value={COM_ID}
                                  >
                                      {i.name} ({i.abbreviation})
                                  </Select.Option>
                              );
                          }
                      )}
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
                    label={"Estimate Unit Cost *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
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
                    <small className="cost-symbol">{ selectName}</small>
                  ) : (
                    <small className="cost-symbol" style={{ color: "red" }}>
                      UOM
                    </small>
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="margin"
                    label="Margin *"
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
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
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

export default withRouter(CreateCostInventoryItems);
