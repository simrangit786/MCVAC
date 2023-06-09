import React, { Component } from "react";
import { Button, Divider, Drawer, Form, Input, InputNumber, Select, Space, Spin } from "antd";
import { Image as Images } from "../../Images";
import { withRouter } from "react-router-dom";
import { getRegion } from "../../../Controller/api/vehicleServices";
import { handleError } from "../../../Controller/Global";
import {
  createLineItemPricing,
  getBackendPricing,
  updateLineItemPricing,
} from "../../../Controller/api/lineItemsServices";
import CommonViewModal from "../../modals/CommonViewModal";
import CommonWarningModal from "../../modals/CommonWarningModal";
import PricingTableNew from "../../management/service/family/create/PricingTableNew";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class AddPricing extends Component {
  state = {
    fetching: false,
    regions: [],
    pricing: null,
    newValues: null,
    warningVisible: false,
    pricingNew: [],
    variantName: null,
    variantRegion: null,
    displayName: null,
    totalRegionCount: 0,
    page: 1
  };
  tableRef = React.createRef();
  formRef = React.createRef();

  componentDidMount() {
    this.fetchRegion();
    this.getBackendPricing();
  }

  fetchRegion = (params = {}) => {
    this.setState({ fetching: true });
    if(params.search) {
      this.setState({page: 1})
    }
    getRegion(params)
      .then((res) => {
        if(this.state.page == 1) {
        this.setState({ regions: res.data.results, totalRegionCount: res.data.count, fetching: false });
      } else {
        this.setState((prevState) => {
            return {regions: [...prevState.regions, ...res.data.results]}
        })
    }
      })
      .catch((err) => {
        handleError(err);
      }).finally(() => {
        this.setState({ fetching: false });
      })
  };

  showWarning = (visible) => {
    this.setState({ warningVisible: visible });
  };

  handleSubmit = (values) => {
    values.line_item = this.props.data.id;
    values.region = values.region.value;
    if (this.state.pricing) {
      updateLineItemPricing(this.state.pricing.id, values)
        .then((res) => {
          this.setState({ pricing: res.data }, () => {
            this.props.setSelectedPricing(res.data)
            this.getBackendPricing();
          });
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createLineItemPricing(values)
        .then((res) => {
          this.setState({ pricing: res.data }, () => {
            this.props.setSelectedPricing(res.data)
            this.getBackendPricing();
          });
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  getBackendPricing = () => {
    this.setState({ fetching: true })
    getBackendPricing({pricing: this.state.pricing?.id}).then(resp => {
      // console.log(resp.data);
      this.setState({ pricingNew: resp.data })
    })
      .catch(err => {
        handleError(err)
      })
      .finally(() => {
        this.setState({ fetching: false })
      })
  }

  closeViewModal = () => {
    this.setState({ visible: false });
  };
  updateTable = () => {
    let name = this.formRef.current.getFieldValue('name') 
    let region = this.formRef.current.getFieldValue('region') 
    let display_name = this.formRef.current.getFieldValue('display_name')
    let data = {}
    if (this.state.variantName !== name || this.state.variantRegion !== region.value || this.state.displayName != display_name) {
        data = {
          ...this.state.newValues,
          name: name,
          region: region.value,
          display_name
        }
    } else {
      data = {
        ...this.state.newValues,
        // table_data: rows,
      };
    }
    updateLineItemPricing(this.state.pricing.id, data)
      .then((res) => {
        this.setState({ pricing: res.data, visible: true });
        this.props.onClose(res.data);
        this.formRef.current.resetFields();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  populateData = () => {
    const selectedRegion = this.state.regions?.find(
      (i) => i.title == this.props.selectedPricing?.region
    );
    this.setState({ pricing: this.props.selectedPricing });
    if (this.props.selectedPricing) {
      this.formRef.current.setFieldsValue({
        ...this.props.selectedPricing,
        region: { label: selectedRegion?.title, value: selectedRegion?.id },
      });
      this.setState({variantName : this.props.selectedPricing.name, variantRegion: selectedRegion?.id, displayName: this.props.display_name })
      this.getBackendPricing()
    }
  };



  componentDidUpdate(prevProps, prevState) {
    if (prevState.regions !== prevState.regions) {
      const selectedRegion = this.state.regions.find(
        (i) => i.title == this.props.selectedPricing?.region
      );
      this.formRef.current.setFieldsValue({
        region: { label: selectedRegion.title, value: selectedRegion.id },
      });
    }
  }

  newFunc = (values) => {
    console.log(values, "cost values")
    const newValues = {
      ...this.state.newValues,
      hourly_price: values.hourly_price || 0,
      daily_price: values.daily_price || 0,
      price: values.price || 0,
      pricing_uom: values.pricing_uom?.value || null,
      cost_uom: values.cost_uom?.value,
      unit_cost: values.unit_cost
    };
    this.setState({ newValues: newValues });
  };

  findMergedArr = () => {
    let selectedPricing = this.props.selectedPricing?.table_data || [];
    const resource = this.props.resource || [];
    let restAftrDltdArr = selectedPricing.filter((val) => {
      return resource.find(
        (n) =>
          n.id === val.id ||
          (typeof val.id === "string" && val.id.startsWith("child"))
      );
    });
    // console.log(restAftrDltdArr, "array1")

    let newArr = [...restAftrDltdArr, ...resource];
    let dups = [];
    let arr = newArr.filter((el) => {
      // If it is not a duplicate, return true
      if (dups.indexOf(el.id) === -1) {
        dups.push(el.id);
        return true;
      }
      return false;
    });
    let sortedArr = [];
    const sortOrder = [
      "LABOR",
      "FLEET_GROUP",
      "SUPPLY_GROUP",
      "DISPOSAL",
      "INVENTORY_ITEM",
      "INVENTORY_KIT",
    ];
    sortOrder.forEach(function (key) {
      arr = arr.filter(function (item) {
        if (
          item["item_type"] === "LABOR" ||
          item["item_type"] === "labor_child"
        ) {
          sortedArr.push(item);
          return false;
        } else if (item["item_type"] === key) {
          sortedArr.push(item);
          return false;
        } else return true;
      });
    });
    return sortedArr;
  };

  handlePagination = () => {
    this.setState((prevState) => {
      return {page: prevState.page + 1}
  }, () => {
      this.fetchRegion({page: this.state.page});
  })

  }

  render() {
    let { fetching, regions, totalRegionCount } = this.state;
    const { data, selectedPricing, serviceText } = this.props;

    return (
      <React.Fragment>
        <Drawer
          afterVisibleChange={this.populateData}
          centered
          maskClosable={false}
          title={
            serviceText ? "Edit Service Variant" : "Create Service Variant"
          }
          destroyOnClose={true}
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={() => {
            this.props.onClose()
            this.setState({page: 1})
          }}
          className="main-all-form-modal main-drawer-div drawer-update-design"
          width={"750px"}
          placement={"right"}
          closable={true}
          onClose={() => {
            // this.props.onClose();
            this.showWarning(true);
            this.setState({page: 1})
            // this.formRef.current.resetFields();
          }}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => this.showWarning(true)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                disabled={!this.state.pricing}
                onClick={this.updateTable}
                type="primary"
              >
                {serviceText ? "Update" : "Create"} Service Variant
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row mx-0 info-card-heading-row pl-0 align-items-center">
                <h5 className="mb-0 vehicle-group-heading d-flex align-items-center">
                  <img
                    src={Images.line_items_group_icons}
                    alt={" "}
                    className="img-fluid"
                  />
                  {data.name}
                </h5>
              </div>
            </div>
            <div className="col-12 mt-3">
              <div className="row mx-0 info-gray-div align-items-center">
                <h6>
                  Please select a region, input a service variant name, and add
                  a margin. Margin applies to everything except for disposal,
                  disposal inventory, inventory item, and inventory kit.
                </h6>
                <h6 className={"mb-0"}>
                  Please note: You can modify the margin by modifying margin
                  then clicking generate pricing.
                </h6>
              </div>
            </div>
            {/*<div className="col-12 my-lg-4 my-md-3 my-sm-2">*/}
            {/*    <div className="row mx-0 notes-all-common">*/}
            {/*        <div className="col-2 p-0">*/}
            {/*            <div*/}
            {/*                className="row mx-0 icon-info-notes align-items-center h-100 justify-content-center">*/}
            {/*                <img src={Images.information_green_icon} alt={""}*/}
            {/*                     className="img-fluid"/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="col-10">*/}
            {/*            <div className="row mx-0 h-100 icon-info-details align-items-center">*/}
            {/*                <small className="small-text-main">*/}
            {/*                    Note: You can modify the pricing by selecting region and margin and click*/}
            {/*                    generate pricing*/}
            {/*                </small>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="col-12">
              <Form
                onFinish={this.handleSubmit}
                ref={this.formRef}
                hideRequiredMark={true}
                {...layout}
                className="main-inner-form"
              >
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <Form.Item
                      name="region"
                      label="Region *"
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Select
                        labelInValue
                        showSearch={true}
                        onFocus={() => this.fetchRegion({page: this.state.page})}
                        onSearch={(e) => this.fetchRegion({ search: e })}
                        notFoundContent={
                          fetching ? <Spin size="small" /> : null
                        }
                        filterOption={false}
                        suffixIcon={
                          <img
                            alt=""
                            src={Images.caret_down_small_select}
                            className="img-fluid"
                          />
                        }
                        placeholder="Select Type"
                        dropdownRender={(options) => (<>
                          {options}
                          <Divider style={{margin: '0 0 10px'}}/>
                          <Space align="center"
                                 className="d-flex align-items-center justify-content-center"
                                 style={{padding: '0 8px 4px'}}>
                              <div className="row">
                                  <div className="col-12 text-center create-div">
                                      {fetching ? (
                                          <Spin/>) : (regions.length !== totalRegionCount && (
                                              <div
                                                  className="d-flex align-items-center justify-content-center">
                                                  <Button
                                                      className="load-more-btn w-auto bg-transprent"
                                                      onClick={(e) => {
                                                          // this.handleFleetPagination();
                                                          this.handlePagination()
                                                          e.stopPropagation();
                                                      }}>
                                                      Load More
                                                  </Button>
                                                  {/* <span className="remaining-tag">{`(${(totalCount - lineItems.length)})` || 0}</span> */}
                                              </div>))}
                                  </div>
                              </div>
                          </Space>
                      </>)}
                      >
                        {regions.map((r) => (
                          <Option key={r.id} value={r.id}>
                            {r.title}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Form.Item
                      name="display_name"
                      label="Display Name *"
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input
                        // min={0}
                        // formatter={(value) => `${value}%`}
                        // parser={(value) => value.replace("%", "")}
                        // placeholder={"%"}
                      />
                    </Form.Item>
                  </div>
                  {/* <div className="col-12 col-sm-6" /> */}
                  <div className="col-12 col-sm-6 position-relative">
                    <Form.Item
                      name="name"
                      label="Service Variant Name *"
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder={"Name"} />
                    </Form.Item>
                    <small className="serviceVNote">e.g. Service Type, etc</small>
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
                    <small
                      style={{
                        fontWeight:400,
                        color: "#828282",
                        bottom:'-10px'
                      }}
                      className="small-text-tag"
                    >
                      Please input a margin and then click Generate Pricing. Margin applies to everything except inventory and disposal.
                    </small>
                  </div>

                  <div className="col-12 validate-div-col text-md-right">
                    <Form.Item>
                      <Button htmlType="submit" className="validate-btn-main">
                        Generate Pricing
                      </Button>
                    </Form.Item>
                  </div>
                  {!this.state.pricing ? (
                    <div className="col-12">
                      <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                        <div className="col-12 text-center">
                          <img
                            src={Images.billing_gray_no_data_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <h6 className="mb-0 text-gray-tag">No Pricing</h6>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12 service-varient-edit-col">

                      {/* <GeneratePricingTable
                        formPrice={true}
                        ref={this.tableRef}
                        margin={this.state.pricing.margin}
                        newPrice={this.state.pricing}
                        child={this.findMergedArr()}
                        //      this.props.selectedPricing?.table_data?.length > 0 ? this.props.selectedPricing?.table_data :
                        //      this.props.resource}
                        //   priceChild={this.props.selectedPricing?.table_data?.length > 0 ? true : false}
                        priceChild={false}
                        newFunc={this.newFunc}
                      /> */}
                      <PricingTableNew
                        formPrice={true}
                        newFunc={this.newFunc}
                        rows={this.state.pricingNew}
                        selectedPricing={selectedPricing}
                        setSelectedPricing={this.props.setSelectedPricing}
                        getBackendPricing={this.getBackendPricing}
                        margin={this.state.pricing.margin}
                      />
                    </div>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
        <CommonViewModal
          visible={this.state.visible}
          onClose={this.closeViewModal}
          heading={
            <div>
              You've successfully <br /> updated this Pricing!
            </div>
          }
        />
        <CommonWarningModal
          visible={this.state.warningVisible}
          onClose={() => this.showWarning(false)}
          addPricingWarning
          confirmClose={() => {
            this.showWarning(false);
            this.props.onClose();
            // this.formRef.current.resetFields();
          }}
          heading={
            "Are you sure you want to exit creating/updating this Service Variant?"
          }
          subHeadingUOM={
            "If you choose to exit, none of the progress you have made will be saved."
          }
        />
      </React.Fragment>
    );
  }
}

export default withRouter(AddPricing);
