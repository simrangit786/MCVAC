import React, { Component } from "react";
import { Button, Drawer, Form, Input, Select, Spin } from "antd";
import { Image as Images } from "../Images";
import { handleError } from "../../Controller/Global";
import { getRegion } from "../../Controller/api/vehicleServices";
import {
  getLineItem,
  getLineItemPricing,
  getServiceFamily,
  getLineItemUniquePricing,
  getLineItemDisplayName
} from "../../Controller/api/lineItemsServices";
import { getSubUnitName } from "../../Controller/api/disposalServices";
import LoadMoreDropdown from "./LoadMoreDropdown";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option, OptGroup } = Select;

class ServiceVarientsFilterDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regions: [],
      serviceFamilies: [],
      serviceVariants: [],
      displayName: [],
      items: [],
      loading: false,
      allOptions: [],
      filterObj: null,
      page: 1,
      search: "",
      kwargs: {},
      tiers: [1],
      keyEnd: 0,
      parent: null,
      endTier: null,
      removeVal: false,
      tierData: [],
      addDisabled: null,
      parentId: null,
      tierValue: null,
      breadArr: [],
      serviceID:null,
      variantsData: []
    };
    this.formRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.filterApplied !== this.props.filterApplied &&
      !this.props.filterApplied &&
      this.formRef.current
    ) {
      this.clearValues();
    }
  }

  fetchRegion = () => {
    this.setState({ fetching: true });
    const { page, search, kwargs } = this.state;
    const params = {
      page,
      search,
      ...kwargs.region,
    };
    getRegion(params)
      .then((res) => {
        if (this.state.page === 1) {
          this.setState({ regions: res.data.results, fetching: false });
        } else {
          this.setState((prevState) => {
            return { regions: [...prevState.regions, ...res.data.results] };
          });
        }
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  fetchLinePackage = (params = {}) => {
    this.setState({ loading: true });
    getServiceFamily({ ...params, page: params.page || 1 })
      .then((res) => {
        this.setState({
          serviceFamilies: res.data.results,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: res.data.count,
          },
          loading: false,
        });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
  };

  fetchLineItem = (params = {}) => {
    this.setState({ loading: true });
    if (params.tierType === "LINE_ITEM") {
      params["tier_type"] = "SERVICE_LINE_ITEM";
      params["parent"] = this.formRef.current.getFieldValue("tier")?.value;
    } else {
      params["tier_type"] = "SERVICE_TIER";
      params["parent"] = this.formRef.current.getFieldValue("family")?.value;
    }
    getLineItem({ ...params, page: params.page || 1 })
      .then((res) => {
        if (params.tierType === "LINE_ITEM") {
          this.setState({
            items: res.data.results,
            pagination: {
              ...this.state.pagination,
              current: params.page || 1,
              total: res.data.count,
            },
            loading: false,
          });
        } else {
          this.setState({
            tiers: res.data.results,
            pagination: {
              ...this.state.pagination,
              current: params.page || 1,
              total: res.data.count,
            },
            loading: false,
          });
        }
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
  };

  fetchServiceVariants = (params) => {
    const service = this.formRef.current.getFieldValue("service")?.value;
    const region = this.formRef.current.getFieldValue("region")?.value;

    this.setState({ loading: true });
    getLineItemPricing({ ...params, service, region })
      .then((res) => {
        this.setState({
          serviceVariants: res.data.results,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        handleError(err);
      });
  };


  fetchUniqueServiceVariants = (params) => {

    let family = this.formRef.current?.getFieldsValue('family')
    let service = this.formRef.current?.getFieldValue('service')
    let data;

    if(service) {
      params = {
        ...params,
        item: this.state.parent
      }
    } else if(family?.tier_1) {
      params = {
        ...params,
        tier_id: this.state.parent
      }
    } else {
      params = {
        ...params,
        parent: this.state.parent
      }
    }
    getLineItemUniquePricing(params).then(res => {
      this.setState({variantsData: res.data})
    }).catch((err) => {
      handleError(err)
    })

  }

  fetchDisplayName = (params) => {
    let family = this.formRef.current?.getFieldsValue('family')
    let service = this.formRef.current?.getFieldValue('service')

    if(service) {
      params = {
        ...params,
        item: this.state.parent
      }
    } else if(family?.tier_1) {
      params = {
        ...params,
        tier_id: this.state.parent
      }
    } else {
      params = {
        ...params,
        parent: this.state.parent
      }
    }
    getLineItemDisplayName(params).then(res => {
      this.setState({displayName: res.data})
    }).catch((err) => {
      handleError(err)
    })

  }
  getUnitName = (params) => {
    this.setState({ loading: true });
    getSubUnitName(params)
      .then((res) => {
        const UnitTypes = {};
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
        this.setState({ loading: false });
      });
  };

  handleInputsBlur = (e) => {
    let value = e.target.value;
    if (value) {
      let parseVal = value
        .replace(/\$\s?|(,*)/g, "")
        .toLocaleString(undefined, { minimumFractionDigits: 2 });
      let moneyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      this.setState({ [e.target.name]: moneyFormatter.format(parseVal) });
    }
  };

  handleApplyFilter = () => {
    const filterObj = {
      family: this.formRef.current.getFieldValue("family")?.value,
      familyName: this.formRef.current.getFieldValue("family")?.label,
      // tier: this.formRef.current.getFieldValue("tier")?.value,
      tier: this.state.endTier,
      tierName: this.formRef.current.getFieldValue("tier")?.label,
      daily_low: this.state.daily_low
        ?.replace(/\$\s?|(,*)/g, "")
        .toLocaleString(undefined, { minimumFractionDigits: 2 }),
      daily_high: this.state.daily_high
        ?.replace(/\$\s?|(,*)/g, "")
        .toLocaleString(undefined, { minimumFractionDigits: 2 }),
      hourly_low: this.state.hourly_low
        ?.replace(/\$\s?|(,*)/g, "")
        .toLocaleString(undefined, { minimumFractionDigits: 2 }),
      hourly_high: this.state.hourly_high
        ?.replace(/\$\s?|(,*)/g, "")
        .toLocaleString(undefined, { minimumFractionDigits: 2 }),
      unit_low: this.state.unit_low
        ?.replace(/\$\s?|(,*)/g, "")
        .toLocaleString(undefined, { minimumFractionDigits: 2 }),
      unit_high: this.state.unit_high
        ?.replace(/\$\s?|(,*)/g, "")
        .toLocaleString(undefined, { minimumFractionDigits: 2 }),
      unit: this.formRef.current.getFieldValue("unit")?.value,
      unitName: this.formRef.current.getFieldValue("unit")?.label,
      variant: this.formRef.current.getFieldValue("variant")?.label,
      service: this.formRef.current.getFieldValue("service")?.value,
      serviceName: this.formRef.current.getFieldValue("service")?.label,
      display_name: this.formRef.current.getFieldValue("display_name")?.label,
      region: this.formRef.current.getFieldValue("region")?.value,
      regionName: this.formRef.current.getFieldValue("region")?.label,
    };

    this.props.setFilterObj(filterObj,this.state.breadArr.map(i => i.label));
    this.props.onClose();
    this.setState({endTier:null})
  };

  clearValues = () => {
    this.formRef.current.resetFields();
    this.setState({
      daily_low: null,
      daily_high: null,
      unit_low: null,
      unit_high: null,
      hourly_high: null,
      hourly_low: null,
      kwargs: {},
      breadArr:[],
      serviceID:null
    });
    this.state.tiers.length = 1
    this.props.setFilterObj(null);
  };

  handleInputsChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setLoadMoreValue = (name, value, data) => {
    let { kwargs, breadArr } = this.state;
    const s = name.toString().substring(0, 4);
    if (this.state.removeVal) {
      this.setState({ parent: value.value });
    }

    if (name === "family") {
      kwargs["tier_1"] = { parent: value.value };
      this.setState({serviceID:value.value})
    } else if (s === "tier") {
      if(data != "remove") {
      if(breadArr.length === this.state.tiers.length){
        breadArr[breadArr.length - 1] = value
      }
      else{
        breadArr.push(value)
      }
    }
      this.setState({breadArr})
      
      kwargs["service"] = { tier_id: breadArr[breadArr.length-1]?.value};
      
      if (this.state.tiers.length >= 1) {
        if (this.state.tierData.length > 0) {
          let checkTier = this.state.tierData?.find((i) => i.id == value.value);
          this.setState({ addDisabled: checkTier?.child_exists });
          kwargs[`tier_${this.state.tiers.length}`] = {
            parent: checkTier?.parent_id || this.state.tierValue,
          };

          this.setState({
            endTier: checkTier?.id,
            parentId: checkTier?.parent_id,
          });
        }
      }
    } else if (name === "service") {
      kwargs["region"] = { service_id: value.value };
    } else if (name === "region") {
      kwargs["variant"] = { region: value.value };
    }

    this.setState({ kwargs, parent: this.state.parent });
    this.formRef.current.setFieldsValue({ [name]: value });
    this.setState({ parent: value.value });
  };

  handleTiers = (val) => {
    if (val === "remove") {
      this.setState({ endTier: this.state.parentId });
      let data = this.state.tiers.pop();
      this.state.breadArr.pop()
      this.state.kwargs["service"] = { tier_id: this.state.breadArr[this.state.breadArr.length-1]?.value};
      this.setState({ tiers: this.state.tiers });
      this.setState({ removeVal: true });
      if(this.state.tiers.length == 1) {
         this.getLineItemData()
      }
    } else {
      // this.setState({ addDisable: true });
      let tier = this.state.tiers.push(this.state.tiers.length + 1);
      this.setState({ tiers: this.state.tiers });
    }
  };

  getLineItemData = () => {
    const params = {
      parent: this.state.serviceID,
      page: 1,
      tier_type: "SERVICE_TIER"
      
    }
    getLineItem(params).then((res) => {
      this.tierSet(res.data.results)
      let value = {
        value: this.state.parentId

      }
      this.setLoadMoreValue("tier",value,"remove")
    }).catch((err) => {
      handleError(err)
    })
  }

  handleParams = (type) => {
    const { serviceObj } = this.state;
    switch (type) {
      case "service": {
        const params = {
          tier_type: "SERVICE_LINE_ITEM",
          parent: serviceObj?.tier,
        };
        return params;
      }
      case "tier": {
        const params = {
          tier_type: "SERVICE_TIER",
          parent: serviceObj?.family,
        };
        return params;
      }
      case "variant": {
        const params = {
          service: serviceObj?.service,
          region: this.formRef.current?.getFieldValue("region")?.value,
        };
        return params;
      }
      default:
        return;
    }
  };

  tierSet = (data) => {
    this.setState({ tierData: data });
  };

  render() {
    const { regions, allOptions, loading } = this.state;
    return (
      <React.Fragment>
        <Drawer
          centered
          title="Filter"
          visible={this.props.visible}
          onOk={this.props.onClose}
          closable={true}
          onClose={this.props.onClose}
          onCancel={this.clearValues}
          className="main-all-form-modal main-drawer-div drawer-update"
          width={"400px"}
          placement={"right"}
          footer={
            <div
              style={{
                // textAlign: "right",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                className="apply-filter-update"
                onClick={this.clearValues}
                style={{ marginRight: 8 }}
              >
                Clear
              </Button>
              <Button
                className="apply-filter-update"
                onClick={this.handleApplyFilter}
                type="primary"
              >
                Apply Filter
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row info-gray-div align-items-center">
                <h6 className="mb-0">
                  Please search and select to filter information.
                </h6>
              </div>
            </div>
            <div className="col-12">
              <Form {...layout} className="main-inner-form" ref={this.formRef}>
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="family"
                      label={"Service Family"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <LoadMoreDropdown
                        disabled={
                          this.formRef.current?.getFieldsValue(`family`).family
                            ? true
                            : false
                        }
                        setLoadMoreValue={(value) =>
                          this.setLoadMoreValue("family", value)
                        }
                        apiCall={getServiceFamily}
                        value={"parent.id"}
                        label={"name"}
                        //  params={() => this.handleParams('family')}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    {/* <Form.Item
                                        name="tier"
                                        label={'Tier Name'}
                                        rules={[{
                                            required: false
                                        }]}
                                        className="position-relative"
                                    >
                                        <LoadMoreDropdown
                                            setLoadMoreValue={(value) => this.setLoadMoreValue('tier', value)}
                                            initial={{tier_type: "SERVICE_TIER"}}
                                            apiCall={getLineItem} value={'id'} label={"name"}
                                            kwargs={this.state.kwargs.tier}/>
                                    </Form.Item> */}
                    {this.state.tiers.map((i, index) => {
                      return (
                        <Form.Item
                          name={`tier_${i}`}
                          label={i == 1 ? "Tier Name" : ""}
                          rules={[
                            {
                              required: false,
                            },
                          ]}
                          className="position-relative"
                        >
                          <LoadMoreDropdown
                            disabled={
                              i === this.state.tiers.length
                                ? false
                                : !!this.formRef.current?.getFieldsValue(
                                      `tier_${i}`
                                  )[`tier_${i}`]
                            }
                            setLoadMoreValue={(value) =>
                              this.setLoadMoreValue(`tier_${i}`, value, i)
                            }
                            initial={{ tier_type: "SERVICE_TIER" }}
                            apiCall={getLineItem}
                            tierSet={this.tierSet}
                            value={"id"}
                            label={"name"}
                            // kwargs={this.state.tiers.length>1?this.state.kwargs[`tier_1`]:this.state.kwargs[`tier_${this.state.tiers.length}`]
                            kwargs={{ parent: i===1 ? this.state.serviceID: this.state.breadArr[index - 1]?.value }}
                          />
                        </Form.Item>
                      );
                    })}
                  </div>
                  <div className="col-12">
                    <ul className="list-inline mb-0 text-right">
                      <li className="list-inline-item p-0">
                        <Button
                          className="remove-tier"
                          // onClick={this.handleApplyFilter}
                          onClick={this.handleTiers}
                          disabled={!this.state.addDisabled}
                        >
                          Add More
                        </Button>
                      </li>
                      <li className="list-inline-item p-0">
                        <Button
                          className="remove-tier"
                          // onClick={this.handleApplyFilter}
                          onClick={() => this.handleTiers("remove")}
                          disabled={this.state.tiers.length === 1 ? true : false}
                        >
                          Remove
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="service"
                      label={"Service Name"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      {/* <Select
                                            labelInValue
                                            showSearch
                                            filterOption={false}
                                            notFoundContent={
                                                loading ? <Spin size="small" /> : null
                                            }
                                            onSearch={e => this.fetchLineItem({ search: e, tierType: 'LINE_ITEM' })}
                                            onFocus={() => this.fetchLineItem({ tierType: 'LINE_ITEM' })}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                src={Images.caret_small_icon_select} />}
                                        >
                                            {items.map(i => {
                                                return (
                                                    <Option key={i.id} value={i.id}>{i.name}</Option>
                                                )
                                            })}
                                        </Select> */}
                      <LoadMoreDropdown
                        initial={{ tier_type: "SERVICE_LINE_ITEM",depth:1 }}
                        setLoadMoreValue={(value) =>
                          this.setLoadMoreValue("service", value)
                        }
                        apiCall={getLineItem}
                        value={"id"}
                        label={"name"}
                        kwargs={this.state.kwargs.service}
                        type={"LINE_ITEM"}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="region"
                      label={"Region"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <Select
                        labelInValue
                        filterOption={false}
                        showSearch
                        onChange={(value) =>
                          this.setLoadMoreValue("region", value)
                        }
                        onPopupScroll={(e) => {
                          e.persist();
                          let target = e.target;
                          if (
                            target.scrollTop + target.offsetHeight >=
                              target.scrollHeight * 0.9 &&
                            this.state.page !== 2
                          ) {
                            this.setState({ page: 2 }, () =>
                              this.fetchRegion()
                            );
                          }
                        }}
                        notFoundContent={loading ? <Spin size="small" /> : null}
                        // onSearch={e => this.fetchRegion({search: e})}
                        onSearch={(e) => {
                          this.setState({ page: 1, search: e }, () => {
                            this.fetchRegion();
                          });
                        }}
                        onFocus={() => {
                          this.setState({ page: 1 }, () => {
                            this.fetchRegion();
                          });
                        }}
                        placeholder="Select"
                        suffixIcon={
                          <img
                            alt={""}
                            className="img-fluid"
                            src={Images.caret_small_icon_select}
                          />
                        }
                      >
                        {regions.map((i) => {
                          return (
                            <Option key={i.id} value={i.id}>
                              {i.title}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-12 position-relative">
                    <Form.Item
                      name="variant"
                      label={"Service Variant Name"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <Select
                                            labelInValue
                                            showSearch
                                            notFoundContent={
                                                loading ? <Spin size="small" /> : null
                                            }
                                            filterOption={false}
                                            onSearch={e => this.fetchUniqueServiceVariants({ search: e })}
                                            onFocus={() => this. fetchUniqueServiceVariants()}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                src={Images.caret_small_icon_select} />}
                                        >
                                            {this.state.variantsData.map(i => {
                                                return (
                                                    <Option value={i} key={i}>{i}</Option>
                                                )
                                            })}
                                        </Select>
                      {/* <LoadMoreDropdown
                        setLoadMoreValue={(value) =>
                          this.setLoadMoreValue("variant", value)
                        }
                        apiCall={getLineItemUniquePricing}
                        value={"id"}
                        label={"name"}
                        params={this.handleParams("variant")}
                        kwargs={this.state.kwargs.variant}
                      /> */}
                    </Form.Item>
                    <small className="serviceVNote">
                      e.g. Service Type, etc
                    </small>
                  </div>
                  <div className="col-12 position-relative">
                    <Form.Item
                      name="display_name"
                      label={"Service Variant Display Name"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <Select
                                            labelInValue
                                            showSearch
                                            notFoundContent={
                                                loading ? <Spin size="small" /> : null
                                            }
                                            filterOption={false}
                                            onSearch={e => this.fetchDisplayName({ search: e })}
                                            onFocus={() => this.fetchDisplayName()}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                src={Images.caret_small_icon_select} />}
                                        >
                                            {this.state.displayName.map(i => {
                                                return (
                                                    <Option value={i} key={i}>{i}</Option>
                                                )
                                            })}
                                        </Select>
                      {/* <LoadMoreDropdown
                        setLoadMoreValue={(value) =>
                          this.setLoadMoreValue("variant", value)
                        }
                        apiCall={getLineItemUniquePricing}
                        value={"id"}
                        label={"name"}
                        params={this.handleParams("variant")}
                        kwargs={this.state.kwargs.variant}
                      /> */}
                    </Form.Item>
                    <small className="serviceVNote">
                      e.g. Service Type, etc
                    </small>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="daily_low"
                      label={"Daily Price"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <div className="row position-relative">
                        <div className="col-12 col-sm-6">
                          <Input
                            // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            // parser={(value) => value.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, {minimumFractionDigits: 2})}
                            placeholder={"$0.00"}
                            name="daily_low"
                            // step="0.01"
                            // decimalSeparator={","}
                            // stringMode
                            value={this.state.daily_low}
                            onChange={this.handleInputsChange}
                            onBlur={this.handleInputsBlur}
                          />
                        </div>
                        <span className="dashed-line position-absolute" />
                        <div className="col-12 col-sm-6">
                          <Input
                            // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            // parser={(value) => value.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, {minimumFractionDigits: 2})}
                            placeholder={"$0.00"}
                            name="daily_high"
                            // step="0.01"
                            // stringMode
                            value={this.state.daily_high}
                            onChange={this.handleInputsChange}
                            onBlur={this.handleInputsBlur}
                          />
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="hourly_price"
                      label={"Hourly Price"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <div className="row position-relative">
                        <div className="col-12 col-sm-6">
                          <Input
                            // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            // parser={(value) => value.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, {minimumFractionDigits: 2})}
                            placeholder={"$0.00"}
                            name="hourly_low"
                            value={this.state.hourly_low}
                            // step="0.01"
                            // stringMode
                            onChange={this.handleInputsChange}
                            onBlur={this.handleInputsBlur}
                          />
                        </div>
                        <span className="dashed-line position-absolute" />
                        <div className="col-12 col-sm-6">
                          <Input
                            // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            // parser={(value) => value.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, {minimumFractionDigits: 2})}
                            placeholder={"$0.00"}
                            name="hourly_high"
                            value={this.state.hourly_high}
                            // step="0.01"
                            // stringMode
                            onChange={this.handleInputsChange}
                            onBlur={this.handleInputsBlur}
                          />
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="unit_price"
                      label={"Unit Price"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <div className="row position-relative">
                        <div className="col-12 col-sm-6">
                          <Input
                            // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            // parser={(value) => value.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, {minimumFractionDigits: 2})}
                            placeholder={"$0.00"}
                            name="unit_low"
                            // step="0.01"
                            // stringMode
                            value={this.state.unit_low}
                            onChange={this.handleInputsChange}
                            onBlur={this.handleInputsBlur}
                          />
                        </div>
                        <span className="dashed-line position-absolute" />
                        <div className="col-12 col-sm-6">
                          <Input
                            // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            // parser={(value) => value.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, {minimumFractionDigits: 2})}
                            placeholder={"$0.00"}
                            name="unit_high"
                            // step="0.01"
                            // stringMode
                            value={this.state.unit_high}
                            onChange={this.handleInputsChange}
                            onBlur={this.handleInputsBlur}
                          />
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="unit"
                      label={"Unit"}
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                      className="position-relative"
                    >
                      <Select
                        labelInValue
                        filterOption={false}
                        showSearch
                        notFoundContent={loading ? <Spin size="small" /> : null}
                        onSearch={(e) => this.getUnitName({ search: e })}
                        onFocus={() => this.getUnitName()}
                        placeholder="Select"
                        suffixIcon={
                          <img
                            alt={""}
                            className="img-fluid"
                            src={Images.caret_small_icon_select}
                          />
                        }
                      >
                        {Object.entries(allOptions).map((i, index, arr) => {
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
        </Drawer>
      </React.Fragment>
    );
  }
}

export default ServiceVarientsFilterDrawer;
