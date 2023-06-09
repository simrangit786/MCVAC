import React, { Component } from "react";
import {
  Breadcrumb,
  Button,
  Collapse,
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
import { Image, Image as Images } from "../../Images";
import { withRouter } from "react-router-dom";
import LineItemsTableCustomMain from "../View/summary-details/LineItemsTableCustomMain";
import {
  getLineItem,
  getLineItemPricing,
  getProposalPricingById,
  getProposalPricingList,
} from "../../../Controller/api/lineItemsServices";
import { handleError } from "../../../Controller/Global";
import {
  calculatePercentage,
  debounceEvent,
  formatPrice,
  laborCalculations,
  supplyCalculation,
  TYPES,
  vehicleCalculations,
} from "../../../Controller/utils";
import Bullet from "../../Bullet";
import { addServiceVariantProposal, deleteServiceVariant, getServiceVariantProposal, getTaxBasisOptions, updateProposal, updateServiceVariantProposal } from "../../../Controller/api/proposalServices";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import {
  getInventoryKit,
  getInventoryKitById,
  getInventoryPackageItem,
  getInventoryPackageItemById,
  getInventoryLineItem,
  getInventoryKitItem,
  getInventoryById,
} from "../../../Controller/api/inventoryServices";
import {
  getSupplyGroup,
  getSupplyGroupById,
} from "../../../Controller/api/supplyServices";
import { getDisposal, getSubUnitName } from "../../../Controller/api/disposalServices";
import {
  costSettingOptions,
  paymentOptions,
} from "../../../Controller/proposalServiceVariantDropdown";
import CommonWarningModal from "../../modals/CommonWarningModal";
import { debounce } from "lodash";
import ServiceVarientsFilterDrawer from "../../drawers/ServiceVarientsFilterDrawer";
import ServiceCommonView from "../../modals/ServiceCommonView";
import { Span } from "@sentry/tracing";
import CommonViewModal from "../../modals/CommonViewModal";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Search } = Input;

class ProposalLineItems extends Component {
  state = {
    showResourceModel: false,
    lineItems: [],
    otherItems: [],
    fetching: false,
    value: 1,
    pricing: [],
    data: [],
    selectedType: null,
    searchValue: null,
    // lineItem: {
    //   items: [],
    //   line_item: [],
    // },
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
    page: 1,
    search: "",
    filterObj: null,
    autoOpen: false,
    filterApplied: false,
    serviceModalVisible: false,
    unitModalVisible: false,
    breadcrumb:[],
    disposal: [],
    supply: []
  };
  formRef = React.createRef();

  fetchLineItems = (params = {}) => {
    const { page, search, filterObj } = this.state;
    this.setState({ fetching: true });
    getProposalPricingList({ ...params, ...filterObj, page, search })
      .then((res) => {
        if (params.isSearched) {
          this.setState({ lineItems: res.data.results, fetching: false, totalCount: res.data.count })
        }
        else {
          this.setState(prevState => {
            return { lineItems: [...prevState.lineItems, ...res.data.results], fetching: false, totalCount: res.data.count }
          })
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
    const { proposal } = this.props;
    await this.formRef.current.setFieldsValue({
      qualifiers: proposal?.qualifiers ? proposal.qualifiers.split("^") : null,
      comments: proposal?.comments ? proposal.comments.split("^") : null,
      cost_setting: proposal?.cost_setting || 'STANDARD',
      payment_terms: proposal?.payment_terms || "30_DAYS",
      deposit: proposal?.deposit || undefined,
      tax_basis: proposal?.tax_basis ? { label: proposal?.tax_basis?.name, value: proposal?.tax_basis?.id, key: proposal?.tax_basis?.id } : undefined
    });
    this.setState({
      loading: false,
      costSetting: proposal?.cost_setting,
      units: proposal?.total_units,
      proposalUom: proposal?.proposal_uom?.id,
      pricePreTax: proposal?.estimated_total_price_pre_tax ? proposal.estimated_total_price_pre_tax : proposal?.estimated_total_price_pre
    });
    this.getSelectedServiceVariants()
    this.getUnitName();
    this.getTaxBasisOptions();
  }

  componentDidUpdate(prevProps, prevState) {
    const { proposal } = this.props;
    if (prevProps.proposal != proposal) {
      this.formRef.current.setFieldsValue({
        qualifiers: proposal?.qualifiers ? proposal.qualifiers.split("^") : null,
        comments: proposal?.comments ? proposal.comments.split("^") : null,
        cost_setting: proposal?.cost_setting || 'STANDARD',
        payment_terms: proposal?.payment_terms || "30_DAYS",
        deposit: proposal?.deposit || undefined,
        tax_basis: proposal?.tax_basis ? { label: proposal?.tax_basis?.name, value: proposal?.tax_basis?.id, key: proposal?.tax_basis?.id } : undefined
      });
    }
  }


  getTaxBasisOptions = () => {
    const { searchValue } = this.state;
    const params = {
      search: searchValue,
      page: this.state.page
    }
    getTaxBasisOptions(params).then(res => {
      if (this.state.page === 1) {
        this.setState({ taxBasisOptions: res.data.results })
      } else {
        this.setState((prevState) => {
          return {
            taxBasisOptions: [...prevState.taxBasisOptions, ...res.data.results],
            totalCount: res.data.count
          }

        })
      }
    }).catch(err => {
      handleError(err)
    })

  }

  // handleSelect = (e) => {
  //     if (this.state.lineItem.line_item.includes(e)) {
  //         this.formRef.current.setFieldsValue({
  //             line_item: null
  //         })
  //         return;
  //     }
  //     this.fetchPricing(e)
  //     this.setState({
  //         lineItem: {
  //             ...this.state.lineItem,
  //             line_item: [...this.state.lineItem.items, e]
  //         }
  //     })
  //     this.formRef.current.setFieldsValue({
  //         line_item: null
  //     })
  // }


  handleSelect = (e) => {
    let foundItem = this.state.newPricing?.find((n) => n.id == e);
    if (foundItem) {
      message.error("You can not add same item again");
    } else {
      const { proposal } = this.props;
      let params = {
        variant: e,
        proposal: proposal?.id
      }
      addServiceVariantProposal(params).then(() => {
        this.setState({ search: "", page: 1 }, () => {
          this.formRef.current.setFieldsValue({
            line_item: null
          })
          this.fetchLineItems({ isSearched: true })
          this.getSelectedServiceVariants(true);
        })
      }).catch((err) => {
        handleError(err);
      });
      // getProposalPricingById(e).then((res) => {
      //   let newPricing = [...this.state.newPricing, ...[res.data]];
      //   this.addDefaultCheckedKey(newPricing);
      // });
    }
  };

  getSelectedServiceVariants = (ADDED_NEW) => {
    const { proposal, fetchProposal } = this.props;
    const Id = this.props.match.params?.id ? this.props.match.params?.id : proposal?.id;
    getServiceVariantProposal({ proposal: Id }).then(resp => {
      // console.log(resp.data, "getting")
      this.setState({ newPricing: resp.data }, () => {
        if (ADDED_NEW) {
          fetchProposal(Id);
        }
      })
    })
      .catch(err => {
        handleError(err)
      })
  }

  handleSubmit = (values, CHANGES_MADE) => {
    let qualifiersArr = [];
    let commentsArr = [];
    let qualifiers = document.getElementById("qualifiers");
    let comments = document.getElementById("comments");
    // console.log(contentEditableInput, contentEditableInput?.childNodes, "sdfsdf");
    if (qualifiers.childNodes.length > 0) {
      qualifiers.childNodes.forEach(i => {
        qualifiersArr.push(i.innerHTML)
      })
    }
    if (comments.childNodes.length > 0) {
      comments.childNodes.forEach(i => {
        commentsArr.push(i.innerHTML)
      })
    }
    //  console.log(commentsArr, qualifiersArr, "arr");
    if (!CHANGES_MADE) {
      values.qualifiers = qualifiersArr?.join("^");
      values.comments = commentsArr?.join("^");
      // values.line_item = this.state.newPricing;
      values.tax_basis = values.tax_basis?.value;
      values.proposal_uom = this.state.proposalUom;
      values.total_units = this.state.units;
      values.estimated_total_price_pre_tax = this.state.pricePreTax || 0;
    }
    updateProposal(this.props.proposal.id, values)
      .then((res) => {
        this.props.setProposal(res.data, 6);
        if (!CHANGES_MADE) {
          message.success("Proposal Updated ");
        }
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleResourceModel = (resourceModelItem, showResourceModel) => {
    this.setState({ resourceModelItem, showResourceModel });
  };

  // handleOtherItem = (e) => {
  //     this.fetchOtherData({type_id: e, type: this.state.selectedType})
  //     this.setState({
  //         lineItem: {
  //             ...this.state.lineItem,
  //             items: [...this.state.lineItem.items, {type_id: e, type: this.state.selectedType}]
  //         }, selectedType: null
  //     })
  // }

  // handleInput = (selectedType) => {
  //     this.setState({selectedType})
  // }

  handleChange = (e) => {
    this.setState({ proposalUom: e });
  };

  handleUnitSelectChange = (e, id,data) => {

    const { newPricing } = this.state
    const fetchId = newPricing.find(i => i.id === id)
    if (!fetchId.edited) {
      this.setState({ unitModalVisible: true })
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
    this.handleUpdateVariantRow(params, id)
  };

  // handleUnitSelectChange = (e, id) => {
  // let newPricing = [...this.state.newPricing].map((r) => {
  //   if (r.id === n.id) {
  //     return { ...r, selectedUnit: e };
  //   } else {
  //     return { ...r };
  //   }
  // });
  // this.setState({ newPricing });

  // handleQuantitySelectChange = (e, n) => {
  // let newPricing = [...this.state.newPricing].map((r) => {
  //   if (r.id === n.id) {
  //     return { ...r, proposal_qty: e };
  //   } else {
  //     return { ...r };
  //   }
  // });
  // this.setState({ newPricing });
  // }
  handleQuantitySelectChange = (e, id) => {
    const params = {
      proposal_qty: e
    }
    this.handleUpdateVariantRow(params, id)
  };

  handlePricePerUnitChange = debounce((e, id) => {
    // let value = e.replace(/\$\s?|(,*)/g, "")
    const params = {
      price_per_unit: e,
      edited: true
    }
    this.handleUpdateVariantRow(params, id)
  })

  handlePriceOnChange = () => {
    this.handlePricePerUnitChange(this.state.value,this.state.priceValue)
    }

  handleUpdateVariantRow = (params, id) => {
    updateServiceVariantProposal(params, id).then(() => {
      this.getSelectedServiceVariants();
      this.props.fetchProposal(this.props.proposal?.id);
    }).catch(err => {
      handleError(err)
    })
  }

  // handleCheckBox = (e, n, type) => {
  // console.log(type, "check")
  // let newPricing = [...this.state.newPricing].map((r) => {
  // //   console.log(r, "response");
  //   if (r.id === n.id) {
  //     if (type === "TAX") {
  //       return { ...r, taxable: e };
  //     }
  //     return { ...r, include_subtotal: e };
  //   } else {
  //     return { ...r };
  //   }
  // });
  // this.setState({ newPricing });
  // };

  handleCheckBox = (e, id, type) => {
    let params = {};
    if (type === "TAX") {
      this.setState({ taxVisible: e, modalVisible: true, taxCheckBox: true })
      params['taxable'] = e;
    }
    else {
      this.setState({ subtotalVisible: e, modalVisible: true, taxCheckBox: false })
      params['include_subtotal'] = e
    }
    this.handleUpdateVariantRow(params, id)
  }

  closeViewModal = () => {
    this.setState({ modalVisible: false })
  }

  // fetchData = (params = {}) => {
  //     this.setState({fetching: true})
  //     switch (this.state.selectedType) {
  //         case TYPES.subtier.name: {
  //             getLineItem(params).then(res => {
  //                 this.setState({data: res.data.results, fetching: false})
  //             }).catch(err => {
  //                 handleError(err);
  //                 this.setState({fetching: false})
  //             })
  //             break;
  //         }
  //         case  TYPES.inventory.name: {
  //             getInventoryPackageItem(params).then(res => {
  //                 this.setState({data: res.data.results.drawer(p => p.parent), fetching: false})
  //             }).catch(err => {
  //                 handleError(err);
  //                 this.setState({fetching: false})
  //             })
  //             break;
  //         }
  //         case TYPES.inventory_kit.name: {
  //             getInventoryKit(params).then(res => {
  //                 this.setState({data: res.data.results, fetching: false})
  //             }).catch(err => {
  //                 handleError(err);
  //                 this.setState({fetching: false})
  //             })
  //             break;
  //         }

  //         case TYPES.supply.name: {
  //             getSupplyGroup(params).then(res => {
  //                 this.setState({data: res.data.results, fetching: false})
  //             }).catch(err => {
  //                 handleError(err)
  //                 this.setState({fetching: false})
  //             })
  //             break;
  //         }

  //         default: {
  //             this.setState({fetching: false})
  //         }
  //     }
  // }

  // fetchOtherData = (item) => {
  //     switch (item.type) {
  //         case TYPES.supply.name:

  //             getSupplyGroupById(item.type_id).then(res => {
  //                 res.data.type = item.type
  //                 this.setState({otherItems: [...this.state.otherItems, res.data]})
  //             }).catch(err => {
  //                 handleError(err);
  //             });
  //             return;
  //         case TYPES.inventory.name:

  //             getInventoryPackageItemById(item.type_id).then(res => {
  //                 res.data.type = item.type
  //                 this.setState({otherItems: [...this.state.otherItems, res.data]})
  //             }).catch(err => {

  //             });
  //             return;
  //         case TYPES.inventory_kit.name:
  //             getInventoryKitById(item.type_id).then(res => {
  //                 res.data.type = item.type
  //                 this.setState({otherItems: [...this.state.otherItems, res.data]})
  //             }).catch(err => {
  //                 handleError(err);

  //             });
  //             return;
  //         default :

  //     }
  // }

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
                {/*<span className="rectangle-icon-div position-absolute">*/}
                {/*    <img src={Images.rectangle_gray_icon} alt="" className={"img-fluid"}/>*/}
                {/*</span>*/}
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
                {/*<Form className="position-relative">*/}
                {/*    <InputNumber placeholder={8}/>*/}
                {/*    <Button*/}
                {/*        className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
                {/*        <EditOutlined/>*/}
                {/*    </Button>*/}
                {/*</Form>*/}
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
                  {/*<Form className="position-relative">*/}
                  {/*    <InputNumber placeholder={8}/>*/}
                  {/*    <Button*/}
                  {/*        className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
                  {/*        <EditOutlined/>*/}
                  {/*    </Button>*/}
                  {/*</Form>*/}
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
                    {/*<Form className="position-relative">*/}
                    {/*    <InputNumber placeholder={8}/>*/}
                    {/*    <Button*/}
                    {/*        className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
                    {/*        <EditOutlined/>*/}
                    {/*    </Button>*/}-{/*</Form>*/}
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

  fetchSupply = (params = {}) => {
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

  fetchDisposalItem = (value) => {
    let newPricing = [...this.state.newPricing];
    let foundItem = newPricing.find((i) => i.id == value);
    if(foundItem) {
      message.error("you can not add same item again")
    } else {
      let params = {
        resource_id: value,
        resource_type: 'DISPOSAL',
        proposal: this.props.proposal?.id
      }
      addServiceVariantProposal(params).then(() => {
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
        proposal: this.props.proposal?.id
      }
      addServiceVariantProposal(params).then(() => {
        this.getSelectedServiceVariants(true)
      }).catch((err) => {
        handleError(err);
      })
    }
  }

  fetchKitItems = (value) => {
    let newPricing = [...this.state.newPricing];
    let foundItem = newPricing.find((i) => i.id == value);
    if (foundItem) {
      message.error("you can not add same item again");
    } else {
      let params = {
        resource_id: value,
        resource_type: 'INVENTORY_KIT',
        proposal: this.props.proposal?.id
      }
      addServiceVariantProposal(params).then(() => {
        // console.log(res.data)
        this.getSelectedServiceVariants(true)
      }).catch((err) => {
        handleError(err);
      });
      // getInventoryKitItem({ kit: value })
      //   .then((res) => {
      //     const kitItemsData = res.data.results;
      //     let kit = kitItemsData && kitItemsData[0] && kitItemsData[0].kit;
      //     kit = {
      //       ...kit,
      //       table_data: kitItemsData.map((i) => {
      //         let newKitItem = i.item;
      //         newKitItem = {
      //           ...newKitItem,
      //           kit_child: true,
      //           item_type: "INVENTORY_ITEM",
      //         };
      //         return newKitItem;
      //       }),
      //       kit_pricing_value: kitItemsData
      //         .reduce(
      //           (p, i) =>
      //             p +
      //             parseFloat(
      //               calculatePercentage(
      //                 i.item?.unit_cost * i.quantity,
      //                 i.item?.margin || 0
      //               )
      //             ),
      //           0
      //         )
      //         .toFixed(2),
      //       manually_added: true,
      //     };
      //     let newPricing = [...this.state.newPricing, kit];
      //     this.addDefaultCheckedKey(newPricing);
      //     // console.log(kit, "updatedKit")
      //   })
      //   .catch((err) => {
      //     handleError(err);
      //   });
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
        resource_type: 'INVENTORY_ITEM',
        proposal: this.props.proposal?.id
      }
      addServiceVariantProposal(params).then(() => {
        // console.log(res.data)
        this.getSelectedServiceVariants(true)
      }).catch((err) => {
        handleError(err);
      });
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
    }
  };
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

  addDefaultCheckedKey = (arr) => {
    let updatedPricing = arr.map((i) => {
      return { ...i, include_subtotal: i.include_subtotal || true };
    });
    this.setState({ newPricing: updatedPricing });
  };

  getTotalCost = (preTax) => {
    const { costSetting, newPricing } = this.state;
    let costPricing = 0;
    newPricing.forEach((item) => {
      if (item?.manually_added) {
        const checkedValue =
          (parseInt(item.proposal_qty) || 1) *
          parseFloat(item.kit_pricing_value || item.item_pricing_value || 0);
        if (preTax) {
          costPricing =
            costPricing + (item?.include_subtotal ? checkedValue : 0);
        } else {
          costPricing =
            costPricing +
            (item?.include_subtotal && item?.taxable ? checkedValue : 0);
        }
      } else {
        let pricing_value =
          item.selectedUnit == "c"
            ? item.hourly_price
            : item.selectedUnit == "a"
              ? item.price
              : item.daily_price;
        let secondCheckedValue =
          (parseInt(item.proposal_qty) || 1) * parseFloat(pricing_value || 0);
        if (preTax) {
          costPricing =
            costPricing + (item?.include_subtotal ? secondCheckedValue : 0);
        } else {
          costPricing =
            costPricing +
            (item?.include_subtotal && item?.taxable ? secondCheckedValue : 0);
        }
      }
    });
    //  console.log(costPricing, "hk")
    return costPricing;
  };

  getResourcePricingCost = () => {
    let newPricing = [...this.state.newPricing];
    let cost = 0;
    newPricing.forEach((item) => {
      const qty = parseInt(item.proposal_qty) || 1;
      if (item.table_data) {
        let totalLaborQty = 0;
        let totalLaborCost = 0;
        for (let [index, i] of item.table_data.entries()) {
          // console.log(i, "item")
          if (i.item_type == "FLEET_GROUP") {
            // console.log('fleet')
            // console.log(vehicleCalculations(i.data) * qty, 'fleet')
            cost = cost + vehicleCalculations(i.data) * qty;
          } else if (i.item_type == "labor_child") {
            const labor_qty = i.hours || 1;
            totalLaborQty = totalLaborQty + (parseInt(i.hours) || 1);
            // console.log((laborCalculations(i.data, i.time, i.name)), "laborCalculated");
            totalLaborCost =
              totalLaborCost +
              (laborCalculations(i.data, i.time, i.name) * labor_qty || 0);
            if (item.table_data[index + 1].item_type != "labor_child") {
              // console.log(totalLaborCost, totalLaborQty, totalLaborCost / totalLaborQty, "laborCalc")
              cost = cost + totalLaborCost / totalLaborQty;
            }
            // cost  = cost + ((laborCalculations(i.data, i.time, i.name) * i.labor_qty) || 0)
          } else if (i.item_type == "SUPPLY_GROUP") {
            cost = cost + (supplyCalculation(i.data) * qty || 0);
          } else if (i.item_type == "INVENTORY_ITEM") {
            // console.log(
            //   "inventory",
            //   i?.kit_child ? parseInt(i.unit_cost) : parseInt(i.data?.unit_cost)
            // );
            cost =
              cost +
              ((i?.kit_child
                ? parseInt(i.unit_cost)
                : parseInt(i.data?.unit_cost)) * qty || 0);
          } else if (i.item_type == "DISPOSAL") {
            cost = cost + (parseInt(i.data?.unit_cost) * qty || 0);
          }
        }
      } else {
        // console.log(cost, "costSetting")
        cost = cost + parseInt(item.unit_cost) * qty;
      }
    });
    // console.log(cost, 'cost')
    return cost;
  };

  calculatedEstimatedTotal = () => {
    const { pricePreTax, costSetting } = this.state;
    const estimatedTaxes = this.calculatedEstimatedTaxes();
    let estimatedTotal = 0;
    if (
      costSetting !== "LUMP_SUM" &&
      costSetting !== "LUMP_SUM_WITH_UOM_AND_QTY"
    ) {
      //   console.log("lumpsum");
      estimatedTotal = Number(estimatedTaxes) + Number(this.getTotalCost(true));
    } else {
      estimatedTotal = Number(estimatedTaxes) + Number(pricePreTax);
    }
    return estimatedTotal.toFixed(2);
  };

  calculatedEstimatedTaxes = () => {
    const { pricePreTax, costSetting } = this.state;
    // console.log("--", costSetting);
    let estimatedTax = 0;
    if (
      costSetting !== "LUMP_SUM" &&
      costSetting !== "LUMP_SUM_WITH_UOM_AND_QTY"
    ) {
      estimatedTax = (this.getTotalCost() * 8.875) / 100;
    } else {
      estimatedTax = (pricePreTax * 8.875) / 100;
    }
    return estimatedTax.toFixed(2);
  };

  calculatedProfitMargin = () => {
    const totalPricePreTax = this.getTotalCost(true);
    const totalCost = this.getResourcePricingCost();
    const profitMargin = ((totalPricePreTax - totalCost) / totalCost) * 100;
    return profitMargin.toFixed();
  };

  handleCostSettingChange = (value) => {
    this.setState({ warningVisible: true, costSettingSelected: value })
  };

  handleTaxBasisChange = value => {
    let ID = value.value;
    this.handleSubmit({ tax_basis: ID }, true);
  }

  handleDepositChange = value => {
    this.handleSubmit({ deposit: value }, true);
  }

  showWarning = warningVisible => {
    this.setState({ warningVisible })
  }

  deleteServiceVariant = () => {
    const { removableId } = this.state
    deleteServiceVariant(removableId).then(() => {
      this.getSelectedServiceVariants(true)
    })
      .catch(err => {
        handleError(err)
      })
  }

  handleRemoveWarning = (removeWarningVisible, id = null) => {
    this.setState({ removeWarningVisible, removableId: id })
  }

  debounceEvent = (...args) => {
    this.debouncedEvent = debounce(...args);
    return (e) => {
      return this.debouncedEvent(e);
    };
  };

  onSearchServiceVariant = e => {
    this.setState({ search: e, page: 1 }, () => {
      this.fetchLineItems({ isSearched: true })
    })
  }


  // handlePriceUnit = (val,id) => {
  //   const { newPricing } = this.state
  //   const fetchId = newPricing.find(i => i.id === id)
  //     if (!fetchId.edited) {
  //       this.setState({ serviceModalVisible: val})
  //   }
  // }
  handleServiceModal = (visible, value, priceValue) => {
    this.setState({ serviceModalVisible: visible, value, priceValue })
  }
  handleUnitModal = (val) => {
    this.setState({ unitModalVisible: false })
  }
  handlePagination = () => {
    this.setState(
      (prevState) => {
        return { page: prevState.page + 1 };
      },
      () => {
        this.fetchLineItems();
      }
    );
  }

  handleFilterDrawer = visibleFilter => {
    this.setState({ visibleFilter })
  }

  setFilterObj = (filterObj,breadcrumb) => {
    let counter = true;
    if (filterObj && (filterObj.daily_high || filterObj.daily_low || filterObj.family || filterObj.hourly_high || filterObj.hourly_low
      || filterObj.region || filterObj.service || filterObj.unit || filterObj.tier || filterObj.unit_high || filterObj.unit_low || filterObj.variant)) {
      counter = true
    }
    else {
      counter = false
    }
    this.setState({ filterObj, breadcrumb,page: 1, autoOpen: true, filterApplied: counter }, () => {
      this.fetchLineItems({ isSearched: true })
    });
  }

  render() {
    const { fetching, pricing, selectedType, data, costSetting, allOptions, proposalUom, taxBasisOptions, totalCount, lineItems, filterApplied, filterObj } = this.state;
    let selectedUom = allOptions.find((item) => item.id === proposalUom);
    const { proposal, regions } = this.props;
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
            onClick={() => this.handleResourceModel("Supply", true)}
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
                          Please add Service Variants to this Proposal by searching and selecting through the searchbar. After adding a Service Variant, you can also add resources on the fly by clicking Add Resources (which will show up once you have added a Service Variant).
                        </h6>
                      </div>
                    </div>
                    {filterApplied &&
                      <div className="container">
                        <div className="col-12">
                          <div className="row banner-apply-filter-row">
                            <div className="col-12">
                              <ul className="list-inline mb-0">
                                <li className="list-inline-item">
                                  <Button className="applied-filter">✓ Filter Applied</Button>
                                </li>
                                <li className="list-inline-item">
                                  <Button className="clear-btn" onClick={() => this.setFilterObj(null)}>
                                    <img src={Images.close_small} alt={''} className="img-fluid" />
                                    Clear</Button>
                                </li>
                              </ul>
                            </div>
                            <div className="col-12">
                              <ul className="list-inline mb-0">
                                {filterObj?.familyName &&
                                  <li className="list-inline-item">
                                    <strong>Service Family:</strong> {filterObj?.familyName}
                                  </li>
                                }
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
                                {filterObj?.serviceName &&
                                  <li className="list-inline-item">
                                    <strong>Service Name:</strong> {filterObj?.serviceName}
                                  </li>
                                }
                                {filterObj?.display_name &&
                                    <li className="list-inline-item">
                                        <strong>Display Name:</strong> {filterObj?.display_name}
                                    </li>
                                    }
                                {filterObj?.variant &&
                                  <li className="list-inline-item">
                                    <strong>Service Variant Name:</strong> {filterObj?.variant}
                                  </li>
                                }
                                {filterObj?.regionName &&
                                  <li className="list-inline-item">
                                    <strong>Region:</strong> {filterObj?.regionName}
                                  </li>
                                }
                                {(filterObj?.daily_high || filterObj?.daily_low) &&
                                  <li className="list-inline-item">
                                    <strong>Daily Price:</strong> ${filterObj?.daily_low || ""}-${filterObj?.daily_high || ""}
                                  </li>
                                }
                                {(filterObj?.hourly_high || filterObj?.hourly_low) &&
                                  <li className="list-inline-item">
                                    <strong>Hourly Price:</strong> ${filterObj?.hourly_low || ""}-${filterObj?.hourly_high || ""}
                                  </li>
                                }
                                {(filterObj?.unit_high || filterObj?.unit_low) &&
                                  <li className="list-inline-item">
                                    <strong>Unit Price:</strong> ${filterObj?.unit_low || ""}-${filterObj?.unit_high || ""}
                                  </li>
                                }
                                {filterObj?.unitName &&
                                  <li className="list-inline-item">
                                    <strong>Unit:</strong> {filterObj?.unitName}
                                  </li>
                                }
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    <div className="col-12">
                      <Form.Item
                        name="line_item"
                        label={
                          <div className="d-flex align-items-center">
                            Service Variants *
                            {/* {filterApplied &&
                            <>
                              <span style={{ fontWeight: '500' }} className="text-green-tag ml-2">
                                <CheckOutlined className="mr-1" />filter applied</span>
                                <button onClick={() => this.setState({filterApplied: false, filterObj: null})}>Clear</button>
                            </>
                            } */}
                          </div>
                        }
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
                          style={{zIndex:99}}
                          dropdownClassName={"option-design-fix"}
                          className="search-and-select-tag dropdown-fixed select-paddingLFT-0"
                          placeholder="Search Service Variants"
                          notFoundContent={
                            fetching ? <Spin size="small" /> : "No Result"
                          }
                          open={this.state.autoOpen}
                          filterOption={false}
                          showSearch={true}
                          onDropdownVisibleChange={autoOpen => this.setState({ autoOpen })}
                          onFocus={() => {
                            if (this.state.lineItems.length == 0) {
                              this.fetchLineItems({ isSearched: true })
                            }

                          }}
                          // onSearch={this.fetchLineItems({ search: e })}
                          onSearch={this.debounceEvent(this.onSearchServiceVariant, 1000)}
                          onChange={this.handleSelect}
                          optionLabelProp="label"
                          dropdownRender={(options) => (
                            <>
                              {options}
                              <Divider style={{ margin: '0 0 10px' }} />
                              <Space align="center" className="d-flex align-items-center justify-content-center" style={{ padding: '0 8px 4px' }}>
                                <div className="row">
                                  <div className="col-12 text-center create-div">
                                    {fetching ? (
                                      <Spin />
                                    ) : (
                                      lineItems.length !== totalCount && (
                                        <div className="d-flex align-items-center justify-content-center">
                                          <Button className="load-more-btn w-auto bg-transprent" onClick={(e) => {
                                            this.handlePagination();
                                            e.stopPropagation();
                                          }}>
                                            Load More
                                          </Button>
                                          <span className="remaining-tag">{`(${(totalCount - lineItems.length)})` || 0}</span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </Space>
                            </>
                          )
                          }
                        >
                          {lineItems.map((item, i) => {
                            // let foundRegion = regions.find(r => r.id == item.region);
                            return (
                              <Option label={item.name} value={item.id}>
                                <div className="row mx-0 vc-tr-select-option-row align-items-start border-0">
                                  <div style={{ width: '38px' }} className="vc-select-option-img float-left">
                                    <img
                                      src={Image.line_item_icon_green}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div style={{ width: 'calc(100% - 38px)' }} className="vc-select-option-data float-left">
                                    <div className="row">
                                      <div className="col-12">
                                        <h6 className="mb-0">{`${item.line_item?.name} ${item.region && '/'} ${item.region?.title || ""} - ${item?.name}`}</h6>
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
                                            <Breadcrumb.Item>{item.line_item.name}/{item.region.title}-{item.name}</Breadcrumb.Item>
                                          </Breadcrumb>
                                        </div>
                                      )}
                                      <div className="row">
                                        <div className="col-12">
                                          <h6 className="col-12 vc-select-display-name"><span className="display-data">{`Display Name:${item.display_name}`}</span></h6>
                                        </div>
                                      </div>
                                      {item.labor_groups.length > 0 &&
                                        <div className="col-12 proposal-labor">
                                          <img src={Images.labor_gray_icon} alt="" className="labor-grp-icon" />
                                          <span className="ml-1 labor-groups">{item.labor_groups.join(', ')}</span>
                                        </div>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </Option>
                            )
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

                    {/*<div className='col-6'>
                                        <Select
                                            placeholder="Select"
                                            disabled={!selectedType}
                                            className="w-100"
                                            filterOption={false}
                                            value={null}
                                            notFoundContent={fetching ? <Spin size="small"/> : null}
                                            onFocus={() => this.fetchData()}
                                            onSearch={(e) => this.fetchData({search: e})}
                                            showSearch={true}
                                            onChange={this.handleOtherItem}
                                            optionLabelProp="label">
                                            {data.map(item => (<Option label={item.name} value={item.id}>
                                                <div className="row mx-0 vc-tr-select-option-row">
                                                    <div className="vc-select-option-img">
                                                        {selectedType && <img src={TYPES[selectedType].icon} alt=""
                                                                              className="img-fluid"/>}
                                                    </div>
                                                    <div className="vc-select-option-data">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <h6 className="mb-0">{item.name}</h6>
                                                            </div>
                                                            {item.breadcrumb && <div className="col-12">
                                                                <Breadcrumb separator={<img
                                                                    src={Images.arrow_right_search_select_small}
                                                                    alt=""
                                                                    className="img-fluid"/>}>
                                                                    {item.breadcrumb.map(b => (
                                                                        <Breadcrumb.Item>{b}</Breadcrumb.Item>))}
                                                                </Breadcrumb>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Option>))}
                                        </Select>
                                    </div>*/}

                    {/*when-data-is-not-available*/}

                    {/* {pricing.length === 0 && otherItems.length === 0 ? <div className='col-12 mt-3'>
                                                <div
                                                    className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                                    <h6 className="mb-0">No Line Items</h6>
                                                </div>
                                            </div> :


                                            <div className="col-12">
                                                <Collapse
                                                    className="vehicle-group-collapse-main dry-group-collapse-main"
                                                    accordion
                                                    expandIcon={({isActive}) => <CaretRightOutlined
                                                        rotate={isActive ? 90 : 0}/>}>
                                                    {newPricing.map((item, i) => (<Panel header={
                                                        <React.Fragment>
                                                            <div className="col-12">
                                                                <div
                                                                    className="row info-card-heading-row align-items-center justify-content-between">
                                                                    <h5 className="mb-0 vehicle-group-heading">{item.name}</h5>
                                                                    <div
                                                                        className="d-flex align-items-center justify-content-between">
                                                                        <ul className="list-inline mb-0 pricing-estimated-ul d-flex align-items-center">
                                                                            <li className="list-inline-item">
                                                                <span className="d-flex align-items-center">
                                                                    <img alt={""} className="img-fluid mr-1"
                                                                         src={Images.info_small}/>
                                                                    Estimated Hourly Price:
                                                                </span>
                                                                            </li>
                                                                            <li className="list-inline-item">
                                                                                $1,746.00
                                                                            </li>
                                                                            <li className="list-inline-item pl-1">
                                                                <span className="d-flex align-items-center">
                                                                    Estimated Daliy Price:
                                                                </span>
                                                                            </li>
                                                                            <li className="list-inline-item">
                                                                                $14,175.00
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    } key={i + "p"}>
                                                        <React.Fragment>
                                                            <div className="row mx-0">
                                                                <div
                                                                    className="col-12 table-responsive main-table-div position-relative">
                                                                    <GeneratePricingTable view
                                                                                          child={item.table_data || []}
                                                                                          margin={item.margin}/>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    </Panel>))}
                                                    {otherItems.map((ot, i) => (
                                                        <Panel header={
                                                            <React.Fragment>
                                                                <div className="col-12">
                                                                    <div
                                                                        className="row info-card-heading-row align-items-center justify-content-between">
                                                                        <h5 className="mb-0 vehicle-group-heading">{ot.name}</h5>
                                                                        <div
                                                                            className="d-flex align-items-center justify-content-between">
                                                                            <ul className="list-inline mb-0 pricing-estimated-ul d-flex align-items-center">
                                                                                <li className="list-inline-item">
                                                                <span className="d-flex align-items-center">
                                                                    <img alt={""} className="img-fluid mr-1"
                                                                         src={Images.info_small}/>
                                                                    Estimated Hourly Price:
                                                                </span>
                                                                                </li>
                                                                                <li className="list-inline-item">
                                                                                    $1,746.00
                                                                                </li>
                                                                                <li className="list-inline-item pl-1">
                                                                <span className="d-flex align-items-center">
                                                                    Estimated Daliy Price:
                                                                </span>
                                                                                </li>
                                                                                <li className="list-inline-item">
                                                                                    $14,175.00
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        } key={i + "pt"}>
                                                            <React.Fragment>
                                                                <div className="row mx-0">
                                                                    <div
                                                                        className="col-12 table-responsive main-table-div position-relative">
                                                                        <div className="row mx-0 custom-table-main-row">
                                                                            <div className="col-12">
                                                                                <div
                                                                                    className="row custom-table-header">
                                                                                    <div
                                                                                        className="custom-table-cell-th custom-table-cell-th-1">
                                                                                        <div
                                                                                            className="custom-th-heading">Type
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="custom-table-cell-th custom-table-cell-th-2">
                                                                                        <div
                                                                                            className="custom-th-heading">Name
                                                                                            / Info
                                                                                        </div>
                                                                                    </div>

                                                                                    <div
                                                                                        className="custom-table-cell-th custom-table-cell-th-4">
                                                                                        <div
                                                                                            className="custom-th-heading">Uom
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="custom-table-cell-th custom-table-cell-th-5">
                                                                                        <div
                                                                                            className="custom-th-heading">Hours/Day
                                                                                            Estimate
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="custom-table-cell-th custom-table-cell-th-6">
                                                                                        <div
                                                                                            className="custom-th-heading">Cost<br/>Per
                                                                                            unit
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="custom-table-cell-th custom-table-cell-th-7">
                                                                                        <div
                                                                                            className="custom-th-heading">Margin
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="custom-table-cell-th custom-table-cell-th-8">
                                                                                        <div
                                                                                            className="custom-th-heading">Price<br/>Per
                                                                                            Unit
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-12 custom-table-body p-0">


                                                                                <GeneratePricingTable view child={this.state.newPricing?.table_data || []}
                                                                                          margin={this.state.newPricing?.margin}
                                                                                          />
                                                                                

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        </Panel>
                                                    ))}
                                                </Collapse>
                                            </div>} */}
                    {/*USE THIS CUSTOM TABLE IF NEEDED*/}
                    <div className="col-12">
                      {/* <LineItemsTableCustomMain/> */}
                      {/* <div className="col-12 custom-table-body p-0"> */}
                      {/* <Collapse
                                        accordion
                                        defaultActiveKey={['1']}
                                        expandIcon={({isActive}) => <CaretRightOutlined
                                            rotate={isActive ? 90 : 0}/>}
                                        className="custom-table-collapse-main"
                                    >
                                        <Panel header={
                                            <React.Fragment>
                                                <div className="custom-table-row custom-table-row-level-1 row mx-0">
                                                    <div
                                                        className="custom-table-cell-td wage-info-collapse-td gray-2-color">
                                                        <div className="d-flex align-items-center">
                                                            <img alt={""} src={Images.line_item_icon_green}
                                                                 className="img-fluid mr-2"/>
                                                            Pneumatic Vac / CT Union 201
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="custom-table-cell-td custom-table-cell-td-3 background-white-div gray-2-color">
                                                        <div className="px-3 d-inline-block w-100 text-right">6</div>
                                                    </div>
                                                    <div
                                                        className="custom-table-cell-td custom-table-cell-td-4 gray-2-color">
                                                        <Select
                                                            className="edit-select-box"
                                                            suffixIcon={
                                                                <CaretDownOutlined/>
                                                            }
                                                            // onChange={handleChange}
                                                            >
                                                            <Option value="a">Uom</Option>
                                                            <Option value="b">Daily</Option>
                                                            <Option value="c">Hourly</Option>
                                                        </Select>
                                                    </div>
                                                    <div
                                                        className="custom-table-cell-td custom-table-cell-td-5 justify-content-end d-flex gray-2-color">
                                                        <span className="px-3 d-inline-block w-100">$1,183.33</span>
                                                    </div>
                                                    <div
                                                        className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex gray-2-color">
                                                        <span>50%</span>
                                                    </div>
                                                    <div
                                                        className="custom-table-cell-td custom-table-cell-td-7 justify-content-end d-flex gray-2-color">
                                                        <span>$1775.00</span>
                                                    </div>
                                                    <div
                                                        className="custom-table-cell-td custom-table-cell-td-8 justify-content-center gray-2-color">
                                                        <Checkbox checked 
                                                        // onChange={onChange}
                                                        />
                                                    </div>
                                                    <div
                                                        className="custom-table-cell-td custom-table-cell-td-9 gray-2-color">
                                                        <div className="px-3 d-inline-block w-100">
                                                            $10,706.04
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        } key="1"> */}
                      {this.state.newPricing.length > 0 ? <div className="col-12 table-responsive main-table-div position-relative wage-table">
                        <div className="row mx-0 custom-table-main-row custom-table-main-row-proposal-line-item custom-table-main-row-wage-info-main proposal-update-table proposal-update-table-edit ">
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
                              {
                                this.state.newPricing?.map((n) => {
                                  // let foundRegion = regions.find(r => r.id == n?.variant?.region);
                                  // debugger
                                  // console.log(n, "mapped")
                                  return (
                                    <LineItemsTableCustomMain
                                      key={n.id}
                                      // view
                                      child={
                                        n?.variant_data?.table_pricing || n?.children || []
                                      }
                                      modalOk={this.state.allow||null}
                                      foundRegion={n?.variant_data?.region}
                                      handlePriceUnit={this.handlePriceUnit}
                                      getSelectedServiceVariants= {this.getSelectedServiceVariants}
                                      handleServiceModal={this.handleServiceModal}
                                      handlePriceOnChange= {this.handlePriceOnChange}
                                      serviceModalVisible={this.state.serviceModalVisible}
                                      manually_added={n?.resource_type === "INVENTORY_KIT" ? true : false}
                                      margin={n?.margin}
                                      allOptions={allOptions}
                                      handleUnitSelectChange={(e, id,data) =>
                                        this.handleUnitSelectChange(e, id, data)
                                      }
                                      handleQuantitySelectChange={(e, id) =>
                                        this.handleQuantitySelectChange(e, id)
                                      }
                                      handlePricePerUnitChange={(e, id) => {
                                        this.handlePricePerUnitChange(e, id)
                                      }}
                                      handleCheckBox={(e, id, checkboxType) =>
                                        this.handleCheckBox(
                                          e,
                                          id,
                                          checkboxType
                                        )
                                      }
                                      handleRemoveWarning={this.handleRemoveWarning}
                                      // deleteServiceVariant={this.deleteServiceVariant}
                                      newPricing={n}
                                      view={false}
                                    />
                                  );
                                })
                                // <div className='col-12 mt-3'>
                                //         <div
                                //             className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                //             <h6 className="mb-0">No Line Items</h6>
                                //         </div>
                                //     </div>
                                //     :
                              }
                            </div>
                          </div>
                        </div>
                      </div> :
                        <div className="col-12 mt-3">
                          <div className="row no-data-card-row align-items-center justify-content-center">
                            <img src={Images.line_items_empty_state_icon} alt={''} className="img-fluid" />
                            <h6 className="mb-0">No Service Variants</h6>
                          </div>
                        </div>
                      }
                      {/* </Panel>
                                        </Collapse> */}
                      {/* </div> */}
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
                                return (
                                  <Option value={i.value}>{i.name}</Option>
                                );
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
                              placeholder="Select"
                              onSearch={value => {
                                this.setState({ page: 1, searchValue: value }, () => {
                                  this.getTaxBasisOptions()
                                })
                              }}
                              filterOption={false}
                              onPopupScroll={(e) => {
                                e.persist();
                                let target = e.target;
                                if (taxBasisOptions.length !== this.state.totalCount) {
                                  if (
                                    target.scrollTop +
                                    target.offsetHeight ===
                                    target.scrollHeight
                                  ) {
                                    this.setState(
                                      { page: this.state.page + 1 },
                                      () => this.getTaxBasisOptions()
                                    );
                                  }
                                }
                              }}
                              onChange={this.handleTaxBasisChange}>
                              {/* <Search placeholder="Search and Select" /> */}
                              {taxBasisOptions.map(i => {
                                return (
                                  <Option key={i.id} value={i.id}>
                                    {i.name} - {i.percentage}
                                  </Option>
                                )
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
                                return (
                                  <Option value={i.value}>{i.name}</Option>
                                );
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
                              onChange={this.handleDepositChange}
                            >
                              <Option value={"YES"}>Yes</Option>
                              <Option value={"NO"}>No</Option>
                            </Select>
                          </Form.Item>
                        </div>
                        {/*<div className="col-12">*/}
                        {/*    <Radio.Group onChange={this.onChange}>*/}
                        {/*        <Radio style={radioStyle} value={1}>*/}
                        {/*            With tax*/}
                        {/*        </Radio>*/}
                        {/*        <Radio style={radioStyle} value={2}>*/}
                        {/*            Without tax*/}
                        {/*        </Radio>*/}
                        {/*    </Radio.Group>*/}
                        {/*</div>*/}
                      </div>
                    </div>
                    <div className="col-12 col-sm-7 offset-sm-1 pt-4">
                    {/* <div className="row estimated-total-row">
                        <div className="col-8">
                          <span className="sub-total-text">
                            Estimated Cost:
                          </span>
                        </div>
                        <div className="col-4 text-md-right">
                          <span className="sub-total-text gray-1"> */}
                            {/* ${this.getResourcePricingCost()} */}
                            {/* ${formatPrice(proposal?.estimated_cost) || 0.00}
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
                            {proposal?.profit_margin == 0 ? "-" : proposal?.profit_margin} %
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
                              onChange={value => this.setState({ pricePreTax: value })}
                              onBlur={e => this.handleSubmit({ estimated_total_price_pre_tax: e.target.value }, true)}
                            />
                          ) : (
                            <span className="sub-total-text gray-1">
                              {/* ${this.getTotalCost(true)} */}
                              ${formatPrice(proposal?.estimated_total_price_pre) || 0.00}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="row estimated-total-row">
                        <div className="col-7">
                          <span className="sub-total-text">
                            Estimated Taxes:
                          </span>
                        </div>
                        <div className="col-5 text-md-right">
                          <ul className="list-inline mb-0">
                            <li className="list-inline-item">
                              <small>{proposal?.tax_basis?.percentage != 0 ? proposal?.tax_basis?.percentage : "-"}%</small>
                            </li>
                            <li className="list-inline-item">|</li>
                            <li className="list-inline-item">
                              <span className="sub-total-text gray-1">
                                {/* ${this.calculatedEstimatedTaxes()} */}
                                ${formatPrice(proposal?.estimated_taxes) || 0.00}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div
                        className={`${this.state.costSetting == "TOTAL_PRICE_PER_UNIT" &&
                          "normal-text"
                          } row estimated-total-row-3 estimated-total-row`}
                      >
                        <div className="col-7">
                          <span className="sub-total-text-main">
                            Estimated Total:
                          </span>
                        </div>
                        <div className="col-5 text-md-right">
                          {(costSetting == "LUMP_SUM" || costSetting == "LUMP_SUM_WITH_UOM_AND_QTY") &&
                            <span className="sub-total-text cut-text mr-2">
                              ${proposal?.standard_estimated_total}
                            </span>
                          }
                          <span className="sub-total-text-main">
                            ${formatPrice(proposal?.estimated_total)}
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
                              <small>{proposal?.profit_margin == 0 ? "-" : proposal?.profit_margin}%</small>
                            </li>
                            <li className="list-inline-item">|</li>
                            <li className="list-inline-item">
                              <span className="sub-total-text gray-1">
                                ${proposal?.estimated_profit || 0.00} */}
                                {/* {(
                                  this.getTotalCost(true) -
                                  this.getResourcePricingCost()
                                ).toFixed(2)} */}
                              {/* </span>
                            </li>
                          </ul>
                        </div>
                      </div> */}
                      {costSetting === "TOTAL_PRICE_PER_UNIT" && (
                        <>
                          <div className="row estimated-total-row-2 pt-1 pb-0 estimated-total-row align-items-center">
                            <div className="col-5">
                              <span className="sub-total-text">
                                Total Unit:
                              </span>
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
                                    value={proposalUom}
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
                                        this.handleSubmit({ total_units: value }, true);
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
                                $ {formatPrice(proposal?.price_per_unit)}
                                {/* {
                                (
                                  this.calculatedEstimatedTotal() /
                                  (this.state.units || 1)
                                ).toFixed(2)}{" "} */}
                                {selectedUom &&
                                  ` / ${selectedUom?.symbol} `
                                }
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
                      : this.state.resourceModelItem === "Supply"
                      ? this.fetchSupplyItem(value)
                      : this.fetchKitItems(value)
                  }
                  onSearch={(e) =>
                    this.state.resourceModelItem === "Inventory Item"
                      ? this.fetchAllInventories({ search: e })
                      : this.state.resourceModelItem === "Disposal"
                      ? this.fetchDisposal({search: e})
                      : this.state.resourceModelItem === "Supply"
                      ? this.fetchSupply({search: e})
                      : this.fetchAllInventoryKits({ search: e })
                  }
                  onFocus={() =>
                    this.state.resourceModelItem === "Inventory Item"
                      ? this.fetchAllInventories() 
                      : this.state.resourceModelItem === "Disposal" 
                      ? this.fetchDisposal()
                      : this.state.resourceModelItem === "Supply"
                      ? this.fetchSupply()
                      : this.fetchAllInventoryKits()
                  }
                // onChange={this.handleContactSelect}
                // onDeselect={this.handleContactDeselect}
                // notFoundContent={loading ? <Spin size="small"/> : null}
                // onFocus={this.getAllContacts}
                >
                  {/*{this.state.contacts.map((item, index) => (*/}
                  {this.state.resourceModelItem === "Inventory Item" ? (
                    <>
                      {this.state.inventoryItem?.map((item, index) => (
                        <Select.Option key={item.id} value={item.id}>
                          <div className="row mx-0 vc-tr-select-option-row align-items-start border-0">
                            <div style={{ width: '87%' }} className="d-flex align-items-center">
                              <div style={{ width: '38px' }} className="vc-select-option-img float-left">
                                <img
                                  src={Image.inventory_sub_tier_icon}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div style={{ width: 'calc(100% - 38px)' }} className="vc-select-option-data float-left">
                                <div className="row">
                                  <div className="col-12">
                                    <h6 className="mb-0">
                                      {/*{`${item.line_item?.name} / ${item?.name}`}*/}
                                      {item.name}
                                      {/* Rubber Tubing */}
                                    </h6>
                                  </div>
                                  {/*{item.breadcrumb && */}
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
                                          <Breadcrumb.Item>{b}</Breadcrumb.Item>
                                        );
                                        {
                                          /* <Breadcrumb.Item>
                                                                        {b}
                                                            </Breadcrumb.Item> */
                                        }
                                      })}
                                      <Breadcrumb.Item>
                                        {item.name}
                                      </Breadcrumb.Item>
                                    </Breadcrumb>
                                  </div>
                                  {/*}*/}
                                </div>
                              </div>
                            </div>
                            <div style={{ width: '13%' }} className="text-green-tag select-text-tier">
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
                  ) :  this.state.resourceModelItem === "Supply" ? (
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
                          <div className="row mx-0 vc-tr-select-option-row align-items-start border-0">
                            <div style={{ width: '87%' }} className="d-flex align-items-center">
                              <div style={{ width: '38px' }} className="vc-select-option-img float-left">
                                <img
                                  src={Image.inventory_kit_sub_tier_icon}
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
                              Inventory kit
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </>
                  )}
                  {/*))}*/}
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
          visible={this.state.warningVisible}
          onClose={() => {
            this.setState({ costSettingSelected: null })
            this.formRef.current.setFieldsValue({ cost_setting: proposal?.cost_setting })
            this.showWarning(false);
          }}
          costSettingWarning
          confirmCloseCost={() => {
            const { proposal } = this.props;
            this.setState({ costSetting: this.state.costSettingSelected }, async () => {
              await this.handleSubmit({ cost_setting: this.state.costSettingSelected }, true);
              if (
                this.state.costSetting == "LUMP_SUM" ||
                this.state.costSetting == "LUMP_SUM_WITH_UOM_AND_QTY"
              ) {
                this.setState({ pricePreTax: proposal?.estimated_total_price_pre_tax ? proposal?.estimated_total_price_pre_tax : proposal?.estimated_total_price_pre });
              }
            });
            this.showWarning(false);
            // this.props.onClose();
            // this.formRef.current.resetFields();
          }}
          heading={
            "Are you sure you want to update the cost setting?"
          }
          subHeadingUOM={
            "Updating the cost setting would affect how the breakdown is presented on your proposal PDF."
          }
        />
         <CommonWarningModal
          visible={this.state.serviceModalVisible}
          onClose={() =>this.handleServiceModal(false)}
          cancelText={"No, cancel this action"}
          editedCheckWarning
          priceUnitType
          onOk = {() => this.setState({serviceModalVisible: false},() => {
            this.handlePriceOnChange()
          })}
          // onOk ={()=>{this.setState({allow:true})}}
          heading={"Are you sure you want to change this Service Variant’s Price per Unit?"}
          subHeadingUOM={"If you change the price per unit, you cannot go back to the original price per unit (unless you input it or re-add this service variant)."}
          
        />
        {/* <ServiceCommonView
          footerText={"Okay, I understand."}
          visible={this.state.serviceModalVisible}
          onClose={() => this.handleServiceModal(false)}
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
          subHeading={"If you change the UOM, the price per unit will change to the selected UOM’s price per unit (unless you have already overriden it)."}
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
          common
          visible={this.state.removeWarningVisible}
          onClose={() => {
            this.setState({ removableId: null, removeWarningVisible: false })
          }}
          serviceVariantWarning
          commonFunc={() => {
            this.deleteServiceVariant()
            this.handleRemoveWarning(false);
          }}
          heading={
            "Are you sure you want to remove this?"
          }
          subHeadingUOM={" "}
        />
        <ServiceVarientsFilterDrawer visible={this.state.visibleFilter} onClose={() => this.handleFilterDrawer(false)} setFilterObj={this.setFilterObj} filterApplied={this.state.filterApplied} />
      </React.Fragment>
    );
  }
}

export default withRouter(ProposalLineItems);
