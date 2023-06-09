import React, { Component } from "react";
import {
  Breadcrumb,
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Select,
  Space,
  Spin,
} from "antd";
import { Image, Image as Images } from "../../../Images";
import { withRouter } from "react-router-dom";
import Bullet from "../../../Bullet";
import ProjectsLineItemCustomTableMain from "./ProjectsLineItemCustomTableMain";
import {
  getLineItemPricing,
  getProposalPricingList,
} from "../../../../Controller/api/lineItemsServices";
import { handleError } from "../../../../Controller/Global";
import {
  costSettingOptions,
  paymentOptions,
} from "../../../../Controller/proposalServiceVariantDropdown";
import { debounce } from "lodash";
import {
  addServiceVariantProject,
  deleteServiceVariant,
  getServiceVariantProject,
  updateProject,
  updateServiceVariantProject,
} from "../../../../Controller/api/projectServices";
import { getTaxBasisOptions } from "../../../../Controller/api/proposalServices";
import {
  calculatePercentage,
  formatPrice,
  supplyCalculation,
  TYPES,
} from "../../../../Controller/utils";
import {
  getInventoryKit,
  getInventoryLineItem,
} from "../../../../Controller/api/inventoryServices";
import ServiceVarientsFilterDrawer from "../../../drawers/ServiceVarientsFilterDrawer";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { getDisposal, getSubUnitName } from "../../../../Controller/api/disposalServices";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import ServiceCommonView from "../../../modals/ServiceCommonView";
import CommonViewModal from "../../../modals/CommonViewModal";
import { getSupplyGroup } from "../../../../Controller/api/supplyServices";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ProjectsServiceVarientsCreate extends Component {
  state = {
    showResourceModel: false,
    lineItems: [],
    otherItems: [],
    fetching: false,
    disposal: [],
    value: 1,
    pricing: [],
    data: [],
    selectedType: null,
    searchValue: null,
    loading: true,
    newPricing: [],
    kit_items: [],
    allOptions: [],
    costSetting: null,
    pricePreTax: 0,
    selectedUom: null,
    id: null,
    units: 1,
    taxBasisOptions: [],
    warningVisible: false,
    removableId: null,
    modalVisible: false,
    totalCount: 0,
    autoOpen: false,
    page: 1,
    search: "",
    filterObj: null,
    filterApplied: false,
    breadcrumb: [],
    depositExist: false,
    parsedValue: null,
    supply: [],
    depositAmountKey: null
  };
  formRef = React.createRef();

  fetchLineItems = (params = {}) => {
    const { page, search, filterObj } = this.state;
    this.setState({ fetching: true });
    getProposalPricingList({ ...params, ...filterObj, page, search })
      .then((res) => {
        if (params.isSearched) {
          this.setState({
            lineItems: res.data.results,
            fetching: false,
            totalCount: res.data.count,
          });
        } else {
          this.setState((prevState) => {
            return {
              lineItems: [...prevState.lineItems, ...res.data.results],
              fetching: false,
              totalCount: res.data.count,
            };
          });
        }
      })
      .catch((err) => {
        this.setState({ fetching: false });
        handleError(err);
      });
  };
  fetchPricing = (id) => {
    getLineItemPricing({ item: id })
      .then((res) => {
        this.setState({
          pricing: [...this.state.pricing, ...res.data.results],
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };


  async componentDidMount() {
    const { project } = this.props;
    await this.formRef.current.setFieldsValue({
      qualifiers: project?.qualifiers ? project?.qualifiers.split("^") : null,
      comments: project?.comments ? project.comments.split("^") : null,
      cost_setting: project?.cost_setting || "STANDARD",
      payment_terms: project?.payment_terms || "30_DAYS",
      deposit: project?.deposit || null,
      tax_basis: project?.tax_basis
        ? {
            label: project?.tax_basis?.name,
            value: project?.tax_basis?.id,
            key: project?.tax_basis?.id,
          }
        : undefined,
    });
    this.setState({
      loading: false,
      costSetting: project?.cost_setting,
      units: project?.total_units,
      projectUom: project?.project_uom?.id,
      pricePreTax: project?.estimated_total_price_pre_tax
        ? project?.estimated_total_price_pre_tax
        : project?.estimated_total_price_pre,
    });
    this.getSelectedServiceVariants();
    this.getUnitName();
    this.getTaxBasisOptions();
    this.handleDepositField();
    if(this.props?.project?.deposit_amount) {
      this.formRef.current.setFieldsValue({
        deposit_amount: `$${this.props?.project?.deposit_amount}`
      })
    } else {
      this.formRef.current.setFieldsValue({
        deposit_amount: this.state.depositAmountKey || '$0.00'
      })

    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { project } = this.props;
    if (prevProps.project != project) {
      this.formRef.current.setFieldsValue({
        qualifiers: project?.qualifiers ? project?.qualifiers.split("^") : null,
        comments: project?.comments ? project.comments.split("^") : null,
        cost_setting: project?.cost_setting || "STANDARD",
        // payment_terms: project?.payment_terms || "30_DAYS",
        deposit: project?.deposit || null,
        deposit_amount: project?.deposit_amount || null,
        tax_basis: project?.tax_basis
          ? {
              label: project?.tax_basis?.name,
              value: project?.tax_basis?.id,
              key: project?.tax_basis?.id,
            }
          : undefined,
      });

      if(this.props.location.view) {
      this.handleDepositField();
    } 
      if(this.props?.project?.deposit_amount) {
        this.formRef.current.setFieldsValue({
          deposit_amount: `$${this.props?.project?.deposit_amount}`
        })
      } 
      else {
        this.formRef.current.setFieldsValue({
          deposit_amount: this.state.depositAmountKey || '$0.00'
        })
  
      }

    }
  }

  getTaxBasisOptions = () => {
    const { searchValue } = this.state;
    const params = {
      search: searchValue,
      page: this.state.page,
    };
    getTaxBasisOptions(params)
      .then((res) => {
        if (this.state.page === 1) {
          this.setState({ taxBasisOptions: res.data.results });
        } else {
          this.setState((prevState) => {
            return {
              taxBasisOptions: [
                ...prevState.taxBasisOptions,
                ...res.data.results,
              ],
              totalCount: res.data.count,
            };
          });
        }
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSelect = (e) => {
    let foundItem = this.state.newPricing?.find((n) => n.id == e);
    if (foundItem) {
      message.error("You can not add same item again");
    } else {
      const { project } = this.props;
      let params = {
        variant: e,
        project: project?.id,
      };
      addServiceVariantProject(params)
        .then(() => {
          this.getSelectedServiceVariants(true);
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  getSelectedServiceVariants = (ADDED_NEW) => {
    const { project, fetchProject } = this.props;
    getServiceVariantProject({
      project: project?.id || this.props.match.params.id,
    })
      .then(async (resp) => {
        this.setState({ newPricing: resp.data }, () => {
          if (ADDED_NEW) {
            fetchProject(project?.id);
          }
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSubmit = (values, CHANGES_MADE) => {
    let qualifiersArr = [];
    let commentsArr = [];
    let qualifiers = document.getElementById("qualifiers");
    let comments = document.getElementById("comments");
    // console.log(contentEditableInput, contentEditableInput?.childNodes, "sdfsdf");
    if (qualifiers.childNodes.length > 0) {
      qualifiers.childNodes.forEach((i) => {
        qualifiersArr.push(i.innerHTML);
      });
    }
    if (comments.childNodes.length > 0) {
      comments.childNodes.forEach((i) => {
        commentsArr.push(i.innerHTML);
      });
    }
    if (!CHANGES_MADE) {
      values.qualifiers = qualifiersArr?.join("^");
      values.comments = commentsArr?.join("^");
      values.tax_basis = values.tax_basis?.value;
      values.deposit_amount = this.state.parsedValue;
      values.project_uom = this.state.projectUom;
      values.total_units = this.state.units;
      values.estimated_total_price_pre_tax = this.state.pricePreTax || 0;
    }
    updateProject(this.props.project.id, values)
      .then((res) => {
        this.props.setProject(res.data, 6);
        if (!CHANGES_MADE) {
          message.success("Project Updated ");
        }
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleResourceModel = (resourceModelItem, showResourceModel) => {
    this.setState({ resourceModelItem, showResourceModel });
  };

  handleChange = (e) => {
    this.setState({ projectUom: e });
  };

  handleUnitSelectChange = (e, id,data) => {
    const { newPricing } = this.state;
    const fetchId = newPricing.find((i) => i.id === id);
    if (!fetchId.edited) {
      this.setState({ unitModalVisible: true });
    }

    let params;
    if(data) {
      if(data === "DISPOSAL") {
      let val = e?.split("_")[0];
      let valType = e?.split("_")[1];
      params = {
        disposal_unit_id: val,
        disposal_unit_type: valType
      }
    }
    } else {
    params = {
      selected_unit: e
    }
  }
    this.handleUpdateVariantRow(params, id);
  };

  handleQuantitySelectChange = (e, id) => {
    const params = {
      project_qty: e,
    };
    this.handleUpdateVariantRow(params, id);
  };

  handleUpdateVariantRow = (params, id) => {
    updateServiceVariantProject(params, id)
      .then(() => {
        this.getSelectedServiceVariants();
        this.props.fetchProject(this.props.project?.id);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleCheckBox = (e, id, type) => {
    let params = {};
    if (type === "TAX") {
      this.setState({ taxVisible: e, modalVisible: true, taxCheckBox: true });
      params["taxable"] = e;
    } else {
      this.setState({
        subtotalVisible: e,
        modalVisible: true,
        taxCheckBox: false,
      });
      params["include_subtotal"] = e;
    }
    this.handleUpdateVariantRow(params, id);
  };

  closeViewModal = () => {
    this.setState({ modalVisible: false });
  };

  handleCostSettingChange = (value) => {
    this.setState({ warningVisible: true, costSettingSelected: value });
  };

  renderRow = (item) => {
    switch (item.type) {
      case TYPES.supply.name:
        return (
          <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>{TYPES.supply.title}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-2">
              <div>{item.name}</div>
            </div>

            <div className="custom-table-cell-td custom-table-cell-td-4">
              <div>Hours</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5">
              <div className="editalble-form-data">
                <Form className="position-relative">
                  <InputNumber
                    value={item.hours || 0}
                    disabled={true}
                    onChange={(e) => this.handleHoursChange(e, item)}
                    placeholder={0}
                  />
                  <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                    <EditOutlined />
                  </Button>
                </Form>
                {/*<span className="px-3 w-100 d-inline-block">8</span>*/}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6">
              <div>${supplyCalculation(item.data)}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{0}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>${calculatePercentage(supplyCalculation(item.data), 0)}</div>
            </div>
          </div>
        );
      case TYPES.inventory.name:
        return (
          <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>Inventory Sub-tier</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-2">
              <div className="name-info-div p-0 position-relative">
                <span>{item.name}</span>
              </div>
            </div>

            <div className="custom-table-cell-td custom-table-cell-td-4">
              <div className="text-capitalize">
                {item.data?.unit?.toLowerCase()}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5">
              <div className="editalble-form-data">
                <span className="px-3 w-100 d-inline-block">-</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6">
              <div>${item.data?.unit_cost || 0}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{item.data?.margin || 0}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                ${calculatePercentage(item.data?.unit_cost, item.data?.margin)}
              </div>
            </div>
          </div>
        );
      case TYPES.inventory_kit.name:
        return (
          <>
            <div className="custom-table-row custom-table-row-level-1 row mx-0">
              <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>{TYPES.inventory_kit.title}</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-2">
                <div>{item.name}</div>
              </div>

              <div className="custom-table-cell-td custom-table-cell-td-4">
                <div>Amount</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-5">
                <div className="editalble-form-data">
                  <span className="px-3 d-inline-block w-100">-</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-6">
                <div>
                  {item.data?.inventory_package_items?.reduce(
                    (p, i) => p + i.item.unit_cost * i.quantity,
                    0
                  )}
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                <div>
                  {item.data?.inventory_package_items
                    ?.reduce((p, i) => p + parseFloat(i.item?.margin || 0), 0)
                    .toFixed(2)}
                  %
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div>
                  $
                  {item.data?.inventory_package_items
                    ?.reduce(
                      (p, i) =>
                        p +
                        parseFloat(
                          calculatePercentage(
                            i.item.unit_cost * i.quantity,
                            i.item.margin
                          )
                        ),
                      0
                    )
                    .toFixed(2)}
                </div>
              </div>
            </div>
            {item.data?.inventory_package_items?.map((p) => (
              <div
                key={p.id}
                className="custom-table-row custom-table-row-level-1 row mx-0"
              >
                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                  <div>Inventory Group</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-2">
                  <div className="name-info-div position-relative">
                    <span className="rectangle-icon-div position-absolute">
                      <img
                        src={Images.rectangle_gray_icon}
                        alt=""
                        className={"img-fluid"}
                      />
                    </span>
                    <span>{p.item.name}</span>
                  </div>
                </div>

                <div className="custom-table-cell-td custom-table-cell-td-4">
                  <div>Amount</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-5">
                  <div className="editalble-form-data">
                    <span className="px-3 w-100 d-inline-block">-</span>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-6">
                  <div>${p.item.unit_cost * p.quantity}</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>{p.item.margin || 0}%</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-8">
                  <div>
                    $
                    {calculatePercentage(
                      p.item.unit_cost * p.quantity,
                      p.item.margin
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        );

      default:
        return <></>;
    }
  };

  fetchAllInventories = (params = {}) => {
    this.setState({ loading: true });
    params["tier_type"] = "INVENTORY_ITEM";
    getInventoryLineItem(params)
      .then((res) => {
        this.setState({
          // inventories: res.data.results,
          inventoryItem: res.data.results
            .filter((p) => p.children.length === 0)
            .map((d) => delete d.children && d),
          loading: false,
        });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
  };
  fetchAllInventoryKits = (params = {}) => {
    this.setState({ loading: true });
    getInventoryKit(params)
      .then((res) => {
        this.setState({
          kits: res.data.results,
          loading: false,
        });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
  };

  fetchDisposal = (params = {}) => {
    this.setState({ loading: true});
    params["tier_type"] = "DISPOSAL";
    getDisposal(params).then((res) => {
      this.setState({
        disposal: res.data.results,
        loading: false
      })
    }).catch((err) => {
      handleError(err);
      this.setState({loading: false})
    })
    
  }

  fetchSupplyGroup = (params = {}) => {
    this.setState({ loading: true});
    params["tier_type"] = "SUPPLY_GROUP";
    getSupplyGroup(params).then((res) => {
      this.setState({
        supply: res.data.results,
        loading: false
      })
    }).catch((err) => {
      handleError(err);
      this.setState({loading: false})
    })
    
  }

  fetchKitItems = (value) => {
    let newPricing = [...this.state.newPricing];
    let foundItem = newPricing.find((i) => i.id == value);
    if (foundItem) {
      message.error("you can not add same item again");
    } else {
      let params = {
        resource_id: value,
        resource_type: "INVENTORY_KIT",
        project: this.props.project?.id,
      };
      addServiceVariantProject(params)
        .then(() => {
          this.getSelectedServiceVariants(true);
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };


  fetchInventoryItem = (value) => {
    let newPricing = [...this.state.newPricing];
    let foundItem = newPricing.find((n) => n.id == value);
    if (foundItem) {
      message.error("you can not add same item again");
    } else {
      let params = {
        resource_id: value,
        resource_type: "INVENTORY_ITEM",
        project: this.props.project?.id,
      };
      addServiceVariantProject(params)
        .then(() => {
          this.getSelectedServiceVariants(true);
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  fetchDisposalItem = (value) => {
    let newPricing = [...this.state.newPricing];
    let foundItem = newPricing.find((i) => i.id == value);
    if(foundItem) {
      message.error("you can not add same item again")
    } else {
      let params = {
        resource_id: value,
        resource_type: 'DISPOSAL',
        project: this.props.project?.id
      }
      addServiceVariantProject(params).then(() => {
        this.getSelectedServiceVariants(true)
      }).catch((err) => {
        handleError(err);
      })
    }
  }

  fetchSupplyItem = (value) => {
    let newPricing = [...this.state.newPricing];
    let foundItem = newPricing.find((i) => i.id == value);
    if(foundItem) {
      message.error("you can not add same item again")
    } else {
      let params = {
        resource_id: value,
        resource_type: 'SUPPLY_GROUP',
        project: this.props.project?.id
      }
      addServiceVariantProject(params).then(() => {
        this.getSelectedServiceVariants(true)
      }).catch((err) => {
        handleError(err);
      })
    }
  }
  // getInventoryById(value)
  //   .then((res) => {
  //     let newPricing = [...this.state.newPricing];
  //     let item = {
  //       ...res.data,
  //       type: "INVENTORY_ITEM",
  //       item_pricing_value: calculatePercentage(
  //         res.data.unit_cost,
  //         res.data.margin
  //       ),
  //       manually_added: true,
  //     };
  //     newPricing.push(item);
  //     this.addDefaultCheckedKey(newPricing);
  //   })
  //   .catch((err) => {
  //     handleError(err);
  //   });
  // }
  // };
  getUnitName = () => {
    this.setState({ fetching: true });
    getSubUnitName()
      .then((res) => {
        this.setState({ allOptions: res.data });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        this.setState({ fetching: false });
      });
  };

  handleTaxBasisChange = (value) => {
    let ID = value.value;
    this.handleSubmit({ tax_basis: ID }, true);
  };

  showWarning = (warningVisible) => {
    this.setState({ warningVisible });
  };

  // handlePriceUnit = (val, id) => {
  //     const { newPricing } = this.state
  //     const fetchId = newPricing.find(i => i.id === id)
  //     if (!fetchId.edited) {
  //         this.setState({ serviceModalVisible: val })
  //     }
  // }

  handleServiceModal = (visible, value, priceId) => {
    this.setState({ serviceModalVisible: visible, value, priceId });
  };

  handleUnitModal = (val) => {
    this.setState({ unitModalVisible: false });
  };

  handlePricePerUnitChange = debounce((e, id) => {
    const params = {
      price_per_unit: e,
      edited: true,
    };
    this.handleUpdateVariantRow(params, id);
  });

  deleteServiceVariant = () => {
    const { removableId } = this.state;
    deleteServiceVariant(removableId)
      .then(() => {
        this.getSelectedServiceVariants(true);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleRemoveWarning = (removeWarningVisible, id = null) => {
    this.setState({ removeWarningVisible, removableId: id });
  };

  debounceEvent = (...args) => {
    this.debouncedEvent = debounce(...args);
    return (e) => {
      return this.debouncedEvent(e);
    };
  };

  onSearchServiceVariant = (e) => {
    this.setState({ search: e, page: 1 }, () => {
      this.fetchLineItems({ isSearched: true });
    });
  };

  handlePagination = () => {
    this.setState(
      (prevState) => {
        return { page: prevState.page + 1 };
      },
      () => {
        this.fetchLineItems();
      }
    );
  };

  handlePriceOnChange = () => {
    this.handlePricePerUnitChange(this.state.value, this.state.priceId);
  };

  handleFilterDrawer = (visibleFilter) => {
    this.setState({ visibleFilter });
  };

  setFilterObj = (filterObj,breadcrumb) => {
    let counter = true;
    if (
      filterObj &&
      (filterObj.daily_high ||
        filterObj.daily_low ||
        filterObj.family ||
        filterObj.hourly_high ||
        filterObj.hourly_low ||
        filterObj.region ||
        filterObj.service ||
        filterObj.unit ||
        filterObj.tier ||
        filterObj.unit_high ||
        filterObj.unit_low ||
        filterObj.variant)
    ) {
      counter = true;
    } else {
      counter = false;
    }
    this.setState(
      { filterObj,breadcrumb, page: 1, autoOpen: true, filterApplied: counter },
      () => {
        this.fetchLineItems({ isSearched: true });
      }
    );
  };

  handleDepositField = () => {

    let depositKey = this.formRef.current?.getFieldValue("deposit");
    if(depositKey == "YES") {
      this.setState({depositExist: true})
    } else {
      this.setState({depositExist: false})
    }
  }

  handleDepositAmount = (e) => {
    this.setState({depositAmountKey: e.target.value})

  }

  handleDepositInput = (val) => {
    let value = val?.toString() || "0";
    let parseVal = value?.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, { minimumFractionDigits: 2 });
    let moneyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    let depositData = moneyFormatter.format(parseVal);
    this.formRef.current.setFieldsValue({
        deposit_amount: depositData
    })
    this.setState({depositValue: depositData},() => {
      const parseVal = depositData
          ?.replace(/\$\s?|(,*)/g, "")
          .toLocaleString(undefined, { minimumFractionDigits: 2 });

          this.setState({parsedValue: parseVal})
      

    })
    
  }

  render() {
    const {
      fetching,
      pricing,
      selectedType,
      data,
      costSetting,
      allOptions,
      projectUom,
      taxBasisOptions,
      totalCount,
      lineItems,
      filterApplied,
      filterObj,
    } = this.state;
    let selectedUom = allOptions.find((item) => item.id === projectUom);
    const { project, regions } = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Button
            className="w-100 text-left border-0 shadow-none"
            onClick={() => this.handleResourceModel("Inventory Item", true)}
          >
            <img
              alt={""}
              className="img-fluid"
              src={Images.inventory_sub_tier_icon}
            />
            Inventory Item
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button
            className="w-100 text-left border-0 shadow-none"
            onClick={() => this.handleResourceModel("Inventory Kit", true)}
          >
            <img
              alt={""}
              className="img-fluid"
              src={Images.inventory_kit_sub_tier_icon}
            />
            Inventory Kit
          </Button>
        </Menu.Item>
        <Menu.Item key="3">
          <Button
            className="w-100 text-left border-0 shadow-none"
            onClick={() => this.handleResourceModel("Disposal", true)}
          >
            <img
              alt={""}
              className="img-fluid"
              src={Images.disposal}
            />
            Disposal
          </Button>
        </Menu.Item>
        <Menu.Item key="4">
          <Button
            className="w-100 text-left border-0 shadow-none"
            onClick={() => this.handleResourceModel("Supply Group", true)}
          >
            <img
              alt={""}
              className="img-fluid"
              src={Images.supply_group_icon_new}
            />
            Supply
          </Button>
        </Menu.Item>
      </Menu>
    );

    return (
      <React.Fragment>
        <div className="row common-form-card-row common-form-card-row-line-items mx-0">
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row line-items-inner-row-pd">
                    <div className="col-12">
                      <div className="row mx-0 info-gray-div align-items-center">
                        <h6 className="mb-0">
                          Please add Service Variants to this Project by
                          searching and selecting through the searchbar. After
                          adding a Service Variant, you can also add resources
                          on the fly by clicking Add Resources (which will show
                          up once you have added a Service Variant).
                        </h6>
                      </div>
                    </div>
                    {filterApplied && (
                      <div className="container">
                        <div className="col-12">
                          <div className="row banner-apply-filter-row">
                            <div className="col-12">
                              <ul className="list-inline mb-0">
                                <li className="list-inline-item">
                                  <Button className="applied-filter">
                                    ✓ Filter Applied
                                  </Button>
                                </li>
                                <li className="list-inline-item">
                                  <Button
                                    className="clear-btn"
                                    onClick={() => this.setFilterObj(null)}
                                  >
                                    <img
                                      src={Images.close_small}
                                      alt={""}
                                      className="img-fluid"
                                    />
                                    Clear
                                  </Button>
                                </li>
                              </ul>
                            </div>
                            <div className="col-12">
                              <ul className="list-inline mb-0">
                                {filterObj?.familyName && (
                                  <li className="list-inline-item">
                                    <strong>Service Family:</strong>{" "}
                                    {filterObj?.familyName}
                                  </li>
                                )}
                                {/* {filterObj?.tierName &&
                                                <li className="list-inline-item">
                                                    <strong>Tier:</strong> {filterObj?.tierName}
                                                </li>
                                            } */}
                                            {this.state.breadcrumb.length > 0 &&
                                                <li className="list-inline-item tier-filter-data">
                                                    <strong>Tier:</strong> 
                                                    {/* {filterObj?.tierName} */}
                                                    {this.state.breadcrumb.map(i => (
                                                        <span>{` ${i}`}</span>
                                                    ))}
                                                </li>
                                            }
                                {filterObj?.serviceName && (
                                  <li className="list-inline-item">
                                    <strong>Service Name:</strong>{" "}
                                    {filterObj?.serviceName}
                                  </li>
                                )}
                                {filterObj?.display_name &&
                                    <li className="list-inline-item">
                                        <strong>Display Name:</strong> {filterObj?.display_name}
                                    </li>
                                    }
                                {filterObj?.variant && (
                                  <li className="list-inline-item">
                                    <strong>Service Variant Name:</strong>{" "}
                                    {filterObj?.variant}
                                  </li>
                                )}
                                {filterObj?.regionName && (
                                  <li className="list-inline-item">
                                    <strong>Region:</strong>{" "}
                                    {filterObj?.regionName}
                                  </li>
                                )}
                                {(filterObj?.daily_high ||
                                  filterObj?.daily_low) && (
                                  <li className="list-inline-item">
                                    <strong>Daily Price:</strong> $
                                    {filterObj?.daily_low || ""}-$
                                    {filterObj?.daily_high || ""}
                                  </li>
                                )}
                                {(filterObj?.hourly_high ||
                                  filterObj?.hourly_low) && (
                                  <li className="list-inline-item">
                                    <strong>Hourly Price:</strong> $
                                    {filterObj?.hourly_low || ""}-$
                                    {filterObj?.hourly_high || ""}
                                  </li>
                                )}
                                {(filterObj?.unit_high ||
                                  filterObj?.unit_low) && (
                                  <li className="list-inline-item">
                                    <strong>Unit Price:</strong> $
                                    {filterObj?.unit_low || ""}-$
                                    {filterObj?.unit_high || ""}
                                  </li>
                                )}
                                {filterObj?.unitName && (
                                  <li className="list-inline-item">
                                    <strong>Unit:</strong> {filterObj?.unitName}
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-12">
                      <Form.Item
                        name="line_item"
                        label={"Service Variants *"}
                        rules={[
                          {
                            required: false,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative ant-select-single-placeholder"
                      >
                        <Select
                          multiple
                          dropdownClassName={"option-design-fix"}
                          className="search-and-select-tag dropdown-fixed select-paddingLFT-0"
                          placeholder="Search Service Variants"
                          notFoundContent={
                            fetching ? <Spin size="small" /> : "No Result"
                          }
                          filterOption={false}
                          open={this.state.autoOpen}
                          onDropdownVisibleChange={(autoOpen) =>
                            this.setState({ autoOpen })
                          }
                          showSearch={true}
                          onFocus={() => {
                            if (this.state.lineItems.length == 0) {
                              this.fetchLineItems({ isSearched: true });
                            }
                          }}
                          // onSearch={this.fetchLineItems({ search: e })}
                          onSearch={this.debounceEvent(
                            this.onSearchServiceVariant,
                            1000
                          )}
                          onChange={this.handleSelect}
                          optionLabelProp="label"
                          dropdownRender={(options) => (
                            <>
                              {options}
                              <Divider style={{ margin: "0 0 10px" }} />
                              <Space
                                align="center"
                                className="d-flex align-items-center justify-content-center"
                                style={{ padding: "0 8px 4px" }}
                              >
                                <div className="row">
                                  <div className="col-12 text-center create-div">
                                    {fetching ? (
                                      <Spin />
                                    ) : (
                                      lineItems.length !== totalCount && (
                                        <div className="d-flex align-items-center justify-content-center">
                                          <Button
                                            className="load-more-btn w-auto bg-transprent"
                                            onClick={(e) => {
                                              this.handlePagination();
                                              e.stopPropagation();
                                            }}
                                          >
                                            Load More
                                          </Button>
                                          <span className="remaining-tag">
                                            {`(${
                                              totalCount - lineItems.length
                                            })` || 0}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </Space>
                            </>
                          )}
                        >
                          {lineItems.map((item, i) => {
                            {
                              /* let foundRegion = regions.find(r => r.id == item.region); */
                            }
                            return (
                              <Option label={item.name} value={item.id}>
                                <div className="row mx-0 vc-tr-select-option-row align-items-start border-0 justify-content-between">
                                  <div
                                    style={{ width: "38px" }}
                                    className="vc-select-option-img float-left"
                                  >
                                    <img
                                      src={Image.line_item_icon_green}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div
                                    style={{ width: "calc(100% - 38px)" }}
                                    className="vc-select-option-data float-left"
                                  >
                                    <div className="row">
                                      <div className="col-12">
                                        <h6 className="mb-0">{`${
                                          item.line_item?.name
                                        } ${item.region && "/"} ${
                                          item.region?.title || ""
                                        } - ${item?.name}`}</h6>
                                      </div>
                                      {item.breadcrumb && (
                                        <div className="col-12">
                                          <Breadcrumb
                                            separator={
                                              <img
                                                src={
                                                  Images.arrow_right_search_select_small
                                                }
                                                alt=""
                                                className="img-fluid"
                                              />
                                            }
                                          >
                                            {item.breadcrumb.map((b) => (
                                              <Breadcrumb.Item>
                                                {b}
                                              </Breadcrumb.Item>
                                            ))}
                                            <Breadcrumb.Item>
                                              {item.line_item.name}/
                                              {item.region.title}-{item.name}
                                            </Breadcrumb.Item>
                                          </Breadcrumb>
                                        </div>
                                      )}
                                      <div className="row">
                                        <div className="col-12">
                                          <h6 className="col-12 vc-select-display-name"><span className="display-data">{`Display Name:${item.display_name}`}</span></h6>
                                        </div>
                                      </div>
                                      {item.labor_groups.length > 0 && (
                                        <div className="col-12 proposal-labor">
                                          <img
                                            src={Images.labor_gray_icon}
                                            alt=""
                                            className="labor-grp-icon"
                                          />
                                          <span className="ml-1 labor-groups">
                                            {item.labor_groups.join(", ")}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                        <img
                          src={Images.search_small_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </Button>
                      <Button
                        onClick={() => this.handleFilterDrawer(true)}
                        className="filter-btn ps-filter d-flex align-items-center justify-content-center text-capitalize"
                      >
                        <img alt={" "} src={Images.filter_icon} /> Filter
                      </Button>
                    </div>
                    <div className="col-6">
                      <div className="row mx-0 mt-0 mb-3 add-sub-tier-input-form">
                        <Dropdown
                          placement="bottomCenter"
                          overlayClassName="add-adding-dropdown add-resource-dropdown"
                          overlay={menu}
                          trigger={["click"]}
                        >
                          <Button
                            style={{ position: "unset", top: "unset" }}
                            className="ant-dropdown-link ant-dropdown-link-resource border-0"
                            onClick={(e) => e.preventDefault()}
                          >
                            + Add Resource
                          </Button>
                        </Dropdown>
                      </div>
                    </div>
                    {this.state.newPricing.length > 0 ? (
                      <div className="col-12 table-responsive main-table-div position-relative wage-table px-3">
                        <div className="row mx-0 custom-table-main-row custom-table-main-row-proposal-line-item custom-table-main-row-wage-info-main proposal-update-table proposal-update-table-edit">
                          <div className="col-12 custom-table-change service-variants-table">
                            <div className="row custom-table-header custom-table-header-2">
                              <div className="custom-table-cell-th custom-table-cell-th-1">
                                <div className="custom-th-heading">Type</div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-2">
                                <div className="custom-th-heading">
                                  Name / Info
                                </div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-3">
                                <div className="custom-th-heading">
                                  FACILITY
                                </div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-4">
                                <div className="custom-th-heading">Qty</div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-5">
                                <div className="custom-th-heading">Uom</div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-6">
                                <div className="custom-th-heading">
                                  Price
                                  <br />
                                  Per unit
                                </div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-7">
                                <div className="custom-th-heading">Taxable</div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-8">
                                <div className="custom-th-heading">
                                  Include
                                  <br />
                                  In Subtotal
                                </div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-9">
                                <div className="custom-th-heading">
                                  Total Price
                                </div>
                              </div>
                              <div className="custom-table-cell-th custom-table-cell-th-9">
                                <div className="custom-th-heading">
                                  Document
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              {this.state.newPricing?.map((n) => {
                                {
                                  /*      let foundRegion = regions.find(r => r.id == n?.variant?.region);*/
                                }
                                {
                                  /*debugger*/
                                }
                                {
                                  /*console.log(n, "mapped")*/
                                }
                                return (
                                  <ProjectsLineItemCustomTableMain
                                    key={n.id}
                                    // view
                                    child={
                                      n?.variant_data?.table_pricing ||
                                      n?.children ||
                                      []
                                    }
                                    foundRegion={n?.variant_data?.region}
                                    modalVisible={this.state.modalVisible}
                                    taxVisible={this.state.taxVisible}
                                    subtotalVisible={this.state.subtotalVisible}
                                    taxCheckBox={this.state.taxCheckBox}
                                    handlePriceUnit={this.handlePriceUnit}
                                    handleServiceModal={this.handleServiceModal}
                                    handlePriceOnChange= {this.handlePriceOnChange}
                                    serviceModalVisible={this.state.serviceModalVisible}
                                    getSelectedServiceVariants = {this.getSelectedServiceVariants}
                                    closeViewModal={this.closeViewModal}
                                    manually_added={
                                      n?.resource_type === "INVENTORY_KIT"
                                        ? true
                                        : false
                                    }
                                    margin={n?.margin}
                                    allOptions={allOptions}
                                    handleUnitSelectChange={(e, id,data) =>
                                      this.handleUnitSelectChange(e, id, data)
                                    }
                                    handleQuantitySelectChange={(e, id) =>
                                      this.handleQuantitySelectChange(e, id)
                                    }
                                    handlePricePerUnitChange={(e, id) => {
                                      this.handlePricePerUnitChange(e, id);
                                    }}
                                    handleCheckBox={(e, id, checkboxType) =>
                                      this.handleCheckBox(e, id, checkboxType)
                                    }
                                    handleRemoveWarning={
                                      this.handleRemoveWarning
                                    }
                                    newPricing={n}
                                    view={false}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="col-12 mt-3">
                        <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                          <img
                            src={Images.line_items_empty_state_icon}
                            alt={""}
                            className="img-fluid"
                          />
                          <h6 className="mb-0">No Service Variants</h6>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/*DO NOT REMOVE COMMENTED CODE BELOW*/}
              <div className="col-12">
                <div className="row service-row-main service-line-item">
                  <div className="col-12 col-sm-4">
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          name="cost_setting"
                          label={"Cost Setting Options *"}
                          rules={[
                            {
                              required: true,
                              message: "this field is required",
                            },
                          ]}
                        >
                          <Select
                            suffixIcon={
                              <img
                                alt=""
                                src={Images.caret_down_small_select}
                                className="img-fluid"
                              />
                            }
                            defaultValue={"STANDARD"}
                            placeholder="Select"
                            onChange={this.handleCostSettingChange}
                          >
                            {costSettingOptions.map((i) => {
                              return <Option value={i.value}>{i.name}</Option>;
                            })}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          name="tax_basis"
                          className="search-small-icon-position"
                          label={"Tax Basis *"}
                          rules={[
                            {
                              required: true,
                              message: "this field is required",
                            },
                          ]}
                        >
                          <Select
                            labelInValue
                            showSearch
                            onSearch={(value) => {
                              this.setState(
                                { page: 1, searchValue: value },
                                () => {
                                  this.getTaxBasisOptions();
                                }
                              );
                            }}
                            placeholder="Select"
                            filterOption={false}
                            onPopupScroll={(e) => {
                              e.persist();
                              let target = e.target;
                              if (
                                taxBasisOptions.length !== this.state.totalCount
                              ) {
                                if (
                                  target.scrollTop + target.offsetHeight ===
                                  target.scrollHeight
                                ) {
                                  this.setState(
                                    { page: this.state.page + 1 },
                                    () => this.getTaxBasisOptions()
                                  );
                                }
                              }
                            }}
                            onChange={this.handleTaxBasisChange}
                          >
                            {/* <Search placeholder="Search and Select" /> */}
                            {taxBasisOptions.map((i) => {
                              return (
                                <Option key={i.id} value={i.id}>
                                  {i.name} - {i.percentage}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          name="payment_terms"
                          label={"Payment Terms *"}
                          rules={[
                            {
                              required: true,
                              message: "this field is required",
                            },
                          ]}
                        >
                          <Select
                            suffixIcon={
                              <img
                                alt=""
                                src={Images.caret_down_small_select}
                                className="img-fluid"
                              />
                            }
                            placeholder="Select"
                          >
                            {paymentOptions.map((i) => {
                              return <Option value={i.value}>{i.name}</Option>;
                            })}
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          name="deposit"
                          label={"Deposit *"}
                          rules={[
                            {
                              required: true,
                              message: "this field is required",
                            },
                          ]}
                        >
                          <Select
                            suffixIcon={
                              <img
                                alt=""
                                src={Images.caret_down_small_select}
                                className="img-fluid"
                              />
                            }
                            placeholder="Select"
                            onChange={this.handleDepositField}
                          >
                            <Option value={"YES"}>Yes</Option>
                            <Option value={"NO"}>No</Option>
                          </Select>
                        </Form.Item>
                      </div>
                      {this.state.depositExist ? (
                        <div className="col-12">
                        <Form.Item
                          name="deposit_amount"
                          label={"Deposit Amount*"}
                          rules={[
                            {
                              required: true,
                              message: "this field is required",
                            },
                          ]}
                        >
                          <Input
                          value = {this.state.depositValue || 0}
                          onChange = {this.handleDepositAmount}
                          onBlur={(e) => this.handleDepositInput(e.target.value)}
                          />
                        </Form.Item>
                      </div>

                      ): ""} 
                    </div>
                  </div>
                  <div className="col-12 col-sm-7 offset-sm-1 pt-4">
                    {/* <div className="row estimated-total-row">
                      <div className="col-8">
                        <span className="sub-total-text">Estimated Cost:</span>
                      </div>
                      <div className="col-4 text-md-right">
                        <span className="sub-total-text gray-1">
                          ${formatPrice(project?.estimated_cost) || 0.0}
                        </span>
                      </div>
                    </div> */}
                    {/* <div className="row estimated-total-row">
                      <div className="col-8">
                        <span className="sub-total-text">
                          Profit Margin:
                          <br />
                          <snall
                            style={{
                              fontSize: "11px",
                            }}
                          >
                            Based on in house service cost
                          </snall>
                        </span>
                      </div>
                      <div className="col-4 text-md-right">
                        <span className="sub-total-text gray-1">
                          {project?.profit_margin == 0
                            ? "-"
                            : project?.profit_margin}{" "}
                          %
                        </span>
                      </div>
                    </div> */}
                    <div className="row estimated-total-row">
                      <div className="col-8">
                        <span className="sub-total-text">
                          Estimated Total Price Pre-tax:
                        </span>
                      </div>
                      <div className="col-4 text-md-right">
                        {costSetting == "LUMP_SUM" ||
                        costSetting == "LUMP_SUM_WITH_UOM_AND_QTY" ? (
                          <InputNumber
                            value={this.state.pricePreTax || 0}
                            onChange={(value) =>
                              this.setState({ pricePreTax: value })
                            }
                            onBlur={(e) =>
                              this.handleSubmit(
                                {
                                  estimated_total_price_pre_tax: e.target.value,
                                },
                                true
                              )
                            }
                          />
                        ) : (
                          <span className="sub-total-text gray-1">
                            {/* ${this.getTotalCost(true)} */}$
                            {formatPrice(project?.estimated_total_price_pre) ||
                              0.0}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="row estimated-total-row">
                      <div className="col-7">
                        <span className="sub-total-text">Estimated Taxes:</span>
                      </div>
                      <div className="col-5 text-md-right">
                        <ul className="list-inline mb-0">
                          <li className="list-inline-item">
                            <small>
                              {project?.tax_basis?.percentage != 0
                                ? project?.tax_basis?.percentage
                                : "-"}
                              %
                            </small>
                          </li>
                          <li className="list-inline-item">|</li>
                          <li className="list-inline-item">
                            <span className="sub-total-text gray-1">
                              {/* ${this.calculatedEstimatedTaxes()} */}$
                              {formatPrice(project?.estimated_taxes) || 0.0}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div
                      className={`${
                        this.state.costSetting == "TOTAL_PRICE_PER_UNIT" &&
                        "normal-text"
                      } row estimated-total-row-3 estimated-total-row`}
                    >
                      {/* <div className={`row estimated-total-row-3 estimated-total-row`}> */}
                      <div className="col-7">
                        <span className="sub-total-text-main">
                          Estimated Total:
                        </span>
                      </div>
                      <div className="col-5 text-md-right">
                        {(costSetting == "LUMP_SUM" ||
                          costSetting == "LUMP_SUM_WITH_UOM_AND_QTY") && (
                          <span className="sub-total-text cut-text mr-2">
                            ${project?.standard_estimated_total}
                          </span>
                        )}
                        <span className="sub-total-text-main">
                          ${formatPrice(project?.estimated_total)}
                        </span>
                      </div>
                    </div>
                    {/* <div className="row estimated-total-row-2 pt-1 pb-0 estimated-total-row">
                      <div className="col-7">
                        <span className="sub-total-text">
                          Estimated Profit:
                        </span>
                      </div>
                      <div className="col-5 text-md-right">
                        <ul className="list-inline mb-0">
                          <li className="list-inline-item">
                            <small>
                              {project?.profit_margin == 0
                                ? "-"
                                : project?.profit_margin}
                              %
                            </small>
                          </li>
                          <li className="list-inline-item">|</li>
                          <li className="list-inline-item">
                            <span className="sub-total-text gray-1">
                              ${project?.estimated_profit || 0.0}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div> */}
                    {costSetting === "TOTAL_PRICE_PER_UNIT" && (
                      <>
                        <div className="row estimated-total-row-2 pt-1 pb-0 estimated-total-row align-items-center">
                          <div className="col-5">
                            <span className="sub-total-text">Total Unit:</span>
                          </div>
                          <div className="col-7 text-md-right value-div-inner">
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item">
                                <Select
                                  suffixIcon={
                                    <img
                                      alt=""
                                      src={Images.caret_down_small_select}
                                      className="img-fluid"
                                    />
                                  }
                                  value={projectUom}
                                  placeholder={"Select"}
                                  onChange={(e) => {
                                    this.handleChange(e);
                                  }}
                                >
                                  {allOptions.map((i) => (
                                    <Select.Option value={i.id}>
                                      {i.name} ({i.symbol})
                                    </Select.Option>
                                  ))}
                                </Select>
                              </li>
                              <li className="list-inline-item">
                                <InputNumber
                                  value={this.state.units}
                                  onChange={(value) =>
                                    this.setState({ units: value }, () => {
                                      this.handleSubmit(
                                        { total_units: value },
                                        true
                                      );
                                    })
                                  }
                                />
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="row estimated-total-row-2 pt-3 pb-0 estimated-total-row">
                          <div className="col-5">
                            <span className="sub-total-text-main">
                              Price Per Unit:
                            </span>
                          </div>
                          <div className="col-7 text-md-right">
                            <span className="sub-total-text-main">
                              $ {formatPrice(project?.price_per_unit)}
                              {selectedUom && ` / ${selectedUom?.symbol} `}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="row estimated-total-row-4 estimated-total-row">
                      <div className="col-12">
                        <small className="small-text-main position-relative small-text-main-2">
                          Taxes are calculated by customer’s billing address
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                {!this.state.loading && (
                  <div className="col-12 px-md-4 px-sm-3">
                    <div className="row mx-0 px-md-2 px-sm-2 py-3">
                      <div className="col-12">
                        <Form.Item
                          name="qualifiers"
                          label={"Qualifiers"}
                          rules={[
                            {
                              required: false,
                              message: "",
                            },
                          ]}
                          className="position-relative"
                        >
                          <Bullet id="qualifiers" />
                        </Form.Item>
                      </div>
                      <div className="col-12">
                        <Form.Item
                          name="comments"
                          label={"Comments"}
                          rules={[
                            {
                              required: false,
                              message: "",
                            },
                          ]}
                          className="position-relative"
                        >
                          <Bullet id={"comments"} />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-12 validate-div-col validate-div-col-line-items text-md-right">
                  <Button
                    onClick={() => this.formRef.current.submit()}
                    className="validate-btn-main"
                  >
                    Save and Continue
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>

        <Modal
          className={"main-all-form-modal design-update-modal inner-modal-main"}
          title={this.state.resourceModelItem}
          onOk={() => this.handleResourceModel(null, false)}
          onCancel={() => this.handleResourceModel(null, false)}
          destroyOnClose
          closable={true}
          footer={false}
          visible={this.state.showResourceModel}
        >
          <Form className={"main-inner-form"} {...layout} ref={this.contactRef}>
            <div className="col-12 p-0">
              <Form.Item
                name="inventory_item"
                label={this.state.resourceModelItem}
                rules={[
                  {
                    required: false, // message: 'this field is required'
                  },
                ]}
                className="position-relative"
              >
                <Select
                  // mode="multiple"
                  dropdownClassName={"option-design-fix"}
                  className="search-and-select-tag dropdown-fixed"
                  showSearch={true}
                  placeholder="Search"
                  filterOption={false}
                  removeIcon={""}
                  onChange={(value) =>
                    this.state.resourceModelItem === "Inventory Item"
                      ? this.fetchInventoryItem(value)
                      : this.state.resourceModelItem === "Disposal"
                      ? this.fetchDisposalItem(value)
                      : this.state.resourceModelItem === "Supply Group"
                      ? this.fetchSupplyItem(value)
                      : this.fetchKitItems(value)
                  }
                  onSearch={(e) =>
                    this.state.resourceModelItem === "Inventory Item"
                      ? this.fetchAllInventories({ search: e })
                      : this.state.resourceModelItem === "Disposal"
                      ? this.fetchDisposal({search: e})
                      : this.state.resourceModelItem === "Supply Group"
                      ? this.fetchSupplyGroup({search: e})
                      : this.fetchAllInventoryKits({ search: e })
                  }
                  onFocus={() =>
                    this.state.resourceModelItem === "Inventory Item"
                      ? this.fetchAllInventories()
                      : this.state.resourceModelItem === "Disposal" 
                      ? this.fetchDisposal()
                      : this.state.resourceModelItem === "Supply Group"
                      ? this.fetchSupplyGroup()
                      : this.fetchAllInventoryKits()
                  }
                >
                  {this.state.resourceModelItem === "Inventory Item" ? (
                    <>
                      {this.state.inventoryItem?.map((item, index) => (
                        <Select.Option key={item.id} value={item.id}>
                          <div className="row mx-0 vc-tr-select-option-row align-items-start border-0 justify-content-between">
                            <div className="d-flex align-items-center">
                              <div
                                style={{ width: "38px" }}
                                className="vc-select-option-img float-left"
                              >
                                <img
                                  src={Image.inventory_sub_tier_icon}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div
                                style={{ width: "calc(100% - 38px)" }}
                                className="vc-select-option-data float-left"
                              >
                                <div className="row">
                                  <div className="col-12">
                                    <h6 className="mb-0">
                                      {/* {`${item.line_item?.name} / ${item?.name}`} */}
                                      {item.name}
                                      {/* Rubber Tubing */}
                                    </h6>
                                  </div>
                                  {item.breadcrumb && (
                                    <div className="col-12">
                                      <Breadcrumb
                                        separator={
                                          <img
                                            src={
                                              Images.arrow_right_search_select_small
                                            }
                                            alt=""
                                            className="img-fluid"
                                          />
                                        }
                                      >
                                        {item.breadcrumb.map((b) => {
                                          return (
                                            <Breadcrumb.Item>
                                              {b}
                                            </Breadcrumb.Item>
                                          );
                                          {
                                            // <Breadcrumb.Item>{b}</Breadcrumb.Item>
                                          }
                                        })}
                                        <Breadcrumb.Item>
                                          {item.name}
                                        </Breadcrumb.Item>
                                      </Breadcrumb>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-green-tag select-text-tier">
                              Inventory Item
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </>
                  ) : this.state.resourceModelItem === "Disposal" ? (
                    <>
                     {this.state.disposal?.map((item,index) => (
                      <Select.Option key={item.id} value={item.id}>
                        <div className="row mx-0 vc-tr-select-option-row align-items-start border-0">
                            <div style={{ width: '87%' }} className="d-flex align-items-center">
                              <div style={{ width: '38px' }} className="vc-select-option-img float-left">
                                <img
                                  src={Image.disposal}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div style={{ width: 'calc(100% - 38px)' }} className="vc-select-option-data float-left">
                                <div className="row">
                                  <div className="col-12">
                                    <h6 className="mb-0">{item.name}</h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-green-tag select-text-tier">
                              Disposal
                            </div>
                          </div>
                      </Select.Option>
                     ))}
                     </>
                  ) :  this.state.resourceModelItem === "Supply Group" ? (
                    <>
                     {this.state.supply?.map((item,index) => (
                      <Select.Option key={item.id} value={item.id}>
                        <div className="row mx-0 vc-tr-select-option-row align-items-start border-0">
                            <div style={{ width: '87%' }} className="d-flex align-items-center">
                              <div style={{ width: '38px' }} className="vc-select-option-img float-left">
                                <img
                                  src={Image.supply_group_icon_new}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div style={{ width: 'calc(100% - 38px)' }} className="vc-select-option-data float-left">
                                <div className="row">
                                  <div className="col-12">
                                    <h6 className="mb-0">{item.name}</h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-green-tag select-text-tier">
                              Supply
                            </div>
                          </div>
                      </Select.Option>
                     ))}
                     </>
                  ) : (
                    <>
                      {this.state.kits?.map((item, index) => (
                        <Select.Option key={item.id} value={item.id}>
                          <div className="row mx-0 vc-tr-select-option-row align-items-start border-0 justify-content-between">
                            <div className="d-flex align-items-center justify-content-between">
                              <div
                                style={{ width: "38px" }}
                                className="vc-select-option-img float-left"
                              >
                                <img
                                  src={Image.inventory_kit_sub_tier_icon}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div
                                style={{ width: "calc(100% - 38px)" }}
                                className="vc-select-option-data float-left"
                              >
                                <div className="row">
                                  <div className="col-12">
                                    <h6 className="mb-0">{item.name}</h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-green-tag select-text-tier">
                              Inventory kit
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </>
                  )}
                  {/* ))} */}
                </Select>

                <Button
                  className="search-icon bg-transparent border-0 p-0 position-absolute"
                  style={{ top: 6, left: 10 }}
                >
                  <img
                    src={Images.search_small_icon}
                    alt=""
                    className="img-fluid"
                  />
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>

        <CommonWarningModal
          visible={this.state.serviceModalVisible}
          onClose={() => this.handleServiceModal(false)}
          cancelText={"No, cancel this action"}
          editedCheckWarning
          priceUnitType
          onOk={() =>
            this.setState({ serviceModalVisible: false }, () => {
              this.handlePriceOnChange();
            })
          }
          // onOk ={()=>{this.setState({allow:true})}}
          heading={
            "Are you sure you want to change this Service Variant’s Price per Unit?"
          }
          subHeadingUOM={
            "If you change the price per unit, you cannot go back to the original price per unit (unless you input it or re-add this service variant)."
          }
        />
        {/* <ServiceCommonView
                    footerText={"Okay, I understand."}
                    visible={this.state.serviceModalVisible}
                    onClose={this.handleServiceModal}
                    // onClose={this.setState({serviceModalVisible: false})}
                    heading={"You are about to change the Price per Unit."}
                    subHeading={"If you change the price per unit, you cannot go back to the original price per unit (unless you input it or re-add this service variant)."}

                /> */}

        <ServiceCommonView
          footerText={"Okay, I understand."}
          visible={this.state.unitModalVisible}
          onClose={this.handleUnitModal}
          // onClose={this.setState({serviceModalVisible: false})}
          heading={"You are about to change the UOM."}
          subHeading={
            "If you change the UOM, the price per unit will change to the selected UOM’s price per unit (unless you have already overriden it)."
          }
        />
        <CommonViewModal
          footerText={"ok"}
          visible={this.state.modalVisible}
          onClose={this.closeViewModal}
          heading={
            this.state.taxCheckBox ? (
              this.state.taxVisible ? (
                <div>This is now taxable.</div>
              ) : (
                <div>This is now nontaxable.</div>
              )
            ) : this.state.subtotalVisible ? (
              <div>This is now included in the subtotal</div>
            ) : (
              <div>This is now excluded from the subtotal.</div>
            )
          }
          subHeading={
            this.state.taxCheckBox ? (
              this.state.taxVisible ? (
                <div>To make it nontaxable, please uncheck the checkbox.</div>
              ) : (
                <div>To make it taxable, please check the checkbox.</div>
              )
            ) : this.state.subtotalVisible ? (
              <div>To make it excluded, uncheck the check box.</div>
            ) : (
              <div>To include it again, please check the checkbox.</div>
            )
          }
          footer={"ok"}
        />
        <CommonWarningModal
          visible={this.state.warningVisible}
          onClose={() => {
            this.setState({ costSettingSelected: null });
            this.formRef.current.setFieldsValue({
              cost_setting: project?.cost_setting,
            });
            this.showWarning(false);
          }}
          costSettingWarning
          confirmCloseCost={() => {
            const { project } = this.props;
            this.setState(
              { costSetting: this.state.costSettingSelected },
              async () => {
                await this.handleSubmit(
                  { cost_setting: this.state.costSettingSelected },
                  true
                );
                if (
                  this.state.costSetting == "LUMP_SUM" ||
                  this.state.costSetting == "LUMP_SUM_WITH_UOM_AND_QTY"
                ) {
                  this.setState({
                    pricePreTax: project?.estimated_total_price_pre_tax
                      ? project?.estimated_total_price_pre_tax
                      : project?.estimated_total_price_pre,
                  });
                }
              }
            );
            this.showWarning(false);
            // this.props.onClose();
            // this.formRef.current.resetFields();
          }}
          heading={"Are you sure you want to update the cost setting?"}
          subHeadingUOM={
            "Updating the cost setting would affect how the breakdown is presented on your proposal PDF."
          }
        />
        <CommonWarningModal
          common
          visible={this.state.removeWarningVisible}
          onClose={() => {
            this.setState({ removableId: null, removeWarningVisible: false });
          }}
          serviceVariantWarning
          commonFunc={() => {
            this.deleteServiceVariant();
            this.handleRemoveWarning(false);
          }}
          heading={"Are you sure you want to remove this?"}
          subHeadingUOM={" "}
        />
        <ServiceVarientsFilterDrawer
          visible={this.state.visibleFilter}
          onClose={() => this.handleFilterDrawer(false)}
          setFilterObj={this.setFilterObj}
          filterApplied={filterApplied}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ProjectsServiceVarientsCreate);
