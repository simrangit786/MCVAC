import React, { Component } from "react";
import { Breadcrumb, Button, Form, message, Select, Spin, } from "antd";
import { Image, Image as Images } from "../../../Images";
import { withRouter } from "react-router-dom";
import Bullet from "../../../Bullet";
import WorkOrderServiceVarientTableCreateMain from "./WorkOrderServiceVarientTableCreateMain";
import {
    addWorkOrderServiceVarient,
    deleteWorkOrderServiceVariant,
    getWorkOrderProjectVarient,
    getWorkOrderServiceVarient,
    updateWorkOrder,
    updateWorkOrderServiceVarient
} from "../../../../Controller/api/workOrderServices";
import { handleError } from "../../../../Controller/Global";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import ServiceVarientsFilterDrawer from "../../../drawers/ServiceVarientsFilterDrawer";
import WorkorderCommonView from "./workorderCommonView";

const { Option } = Select;
const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

// const { Search } = Input;

class WorkOrderServicevarientCreate extends Component {
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
        varientModalVisible: false,
        itemModalVisible: false,
        kitModalVisible: false
    };
    formRef = React.createRef();
    //
    fetchLineItems = () => {
        // const { page, search, filterObj } = this.state;
        this.setState({ fetching: true });

        getWorkOrderProjectVarient({ workorder: this.props.workOrder.id })
            .then((res) => {
                // console.log(res.data, "response")
                this.setState({ lineItems: res.data, fetching: false })
            })
            .catch((err) => {
                // this.setState({ fetching: false });
                handleError(err);
            });
    };
    // fetchPricing = (id) => {
    //     getLineItemPricing({ item: id })
    //         .then((res) => {
    //             this.setState({
    //                 pricing: [...this.state.pricing, ...res.data.results],
    //             });
    //         })
    //         .catch((err) => {
    //             handleError(err);
    //         });
    // };
    //
    async componentDidMount() {
        const { workOrder } = this.props;
        await this.formRef.current.setFieldsValue({
            cost_setting: workOrder?.cost_setting || 'STANDARD',
            payment_terms: workOrder?.payment_terms || "30_DAYS",
            deposit: workOrder?.deposit || null,
            tax_basis: {
                label: workOrder?.tax_basis?.name,
                value: workOrder?.tax_basis?.id,
                key: workOrder?.tax_basis?.id
            },
            additional_description: workOrder?.additional_description ? workOrder.additional_description.split("^") : null,
            special_instruction: workOrder?.special_instruction ? workOrder.special_instruction.split("^") : null,

        });
        this.setState({
            loading: false,
            // newPricing: [],
            costSetting: workOrder?.cost_setting,
            units: workOrder?.total_units,
            projectUom: workOrder?.project_uom?.id,
            pricePreTax: workOrder?.estimated_total_price_pre_tax ? workOrder?.estimated_total_price_pre_tax : workOrder?.estimated_total_price_pre
        });
        this.getSelectedServiceVariants()
        // this.getUnitName();
        // this.getTaxBasisOptions();
    }

    componentDidUpdate(prevProps, prevState) {
        const { workOrder } = this.props;
        if (prevProps.workOrder != workOrder) {
            this.formRef.current.setFieldsValue({
                additional_description: workOrder?.additional_description ? workOrder.additional_description.split("^") : null,
                special_instruction: workOrder?.special_instruction ? workOrder.special_instruction.split("^") : null,
                cost_setting: workOrder?.cost_setting || 'STANDARD',
                payment_terms: workOrder?.payment_terms || "30_DAYS",
                deposit: workOrder?.deposit || undefined,
                tax_basis: {
                    label: workOrder?.tax_basis?.name,
                    value: workOrder?.tax_basis?.id,
                    key: workOrder?.tax_basis?.id
                },
            });
        }
    }

    handleSelect = (e) => {
        let foundItem = this.state.newPricing?.find((n) => n.id == e);
        let selectedVarient = this.state.lineItems.find(i => i.id === e);
        if (foundItem) {
            message.error("You can not add same item again");
        } else {
            const { workOrder } = this.props;
            let params = {
                variant: e,
                workorder: workOrder?.id
            }
            if (selectedVarient.type) {
                if (selectedVarient.type === "variant") {
                    this.handleVarientModal(true, params)
                } else if (selectedVarient.type === "item") {
                    this.handleItemModal(true, params)
                } else {
                    this.handleKitModal(true, params)
                }
            }
        }
        this.formRef.current.setFieldsValue({
            line_item: null
        });
    };

    handleWorkOrderServiceVarient = (params) => {
        addWorkOrderServiceVarient(params).then((res) => {
            this.getSelectedServiceVariants(true)
            this.fetchLineItems()
        }).catch(err => {
            handleError(err)
        })

    }


    getSelectedServiceVariants = (ADDED_NEW, val) => {
        const { workOrder, fetchWorkOrder } = this.props;
        getWorkOrderServiceVarient({ workorder: workOrder?.id || this.props.match.params.id }).then(async resp => {
            // console.log(resp.data, "getting")
            this.setState({ newPricing: resp.data }, () => {
                if (ADDED_NEW) {
                    fetchWorkOrder(workOrder?.id);
                }
            })
        })
            .catch(err => {
                handleError(err)
            })
    }

    handleSubmit = (values, CHANGES_MADE) => {
        let descriptionArr = [];
        let instructionArr = [];

        let description = document.getElementById("descriptionAdd");
        let instruction = document.getElementById("instruction");
        console.log(description,instruction,"description");

        if (description.childNodes.length > 0) {
            description.childNodes.forEach(i => {
              descriptionArr.push(i.innerHTML)
            })
          }
          if (instruction.childNodes.length > 0) {
            instruction.childNodes.forEach(i => {
              instructionArr.push(i.innerHTML)
            })
          }
        // console.log(values,"__")
        if (!CHANGES_MADE) {
            values.special_instruction = instructionArr?.join("^");
            values.additional_description = descriptionArr?.join("^");
            // values.line_item = this.state.newPricing;
            values.tax_basis = values.tax_basis?.value;
            values.project_uom = this.state.projectUom;
            values.total_units = this.state.units;
            values.estimated_total_price_pre_tax = this.state.pricePreTax || 0;
        }
        updateWorkOrder(this.props.workOrder.id, values)
            .then((res) => {
                this.props.setWorkOrder(res.data, 6);
                if (!CHANGES_MADE) {
                    message.success("Work Order Updated ");
                }
            })
            .catch((err) => {
                handleError(err);
            });
    };
    //
    handleResourceModel = (resourceModelItem, showResourceModel) => {
        this.setState({ resourceModelItem, showResourceModel });
    };


    handleChange = (e) => {
        this.setState({ projectUom: e });
    };
    //
    handleUnitSelectChange = (e, id) => {
        const { newPricing } = this.state
        const fetchId = newPricing.find(i => i.id === id)
        if (!fetchId.edited) {
            this.setState({ unitModalVisible: true })
        }
        const params = {
            selected_unit: e
        }
        this.handleUpdateVariantRow(params, id)
    };

    handleVarientModal = (visible, data) => {
        this.setState({ varientModalVisible: visible, varientData: data })
    }
    handleItemModal = (visible, data) => {
        this.setState({ itemModalVisible: visible, itemData: data })
    }
    handleKitModal = (visible, data) => {
        this.setState({ kitModalVisible: visible, kitData: data })
    }

    handleQuantitySelectChange = (e, id) => {
        let params = {};
        // if (!item.edited && item.workorder_qty) {
        //     if (item.workorder_qty !== e) {
        //         params = {
        //             workorder_qty: e,
        //             edited: true
        //         }
        //         if (item.resource_type) {
        //             if (item.resource_type === "VARIENT") {
        //                 this.handleVarientModal(true)
        //             } else if (item.resource_type === "INVENTORY_ITEM") {
        //                 this.handleItemModal(true)
        //             }
        //             else {
        //                 this.handleKitModal(true)
        //             }
        //         }

        //     }
        // } else {
        params = {
            workorder_qty: e
        }
        // }
        this.handleUpdateVariantRow(params, id)
    };

    handleChangeContainer = (value,id) => {
        let params = {}
        if(value.container_type) {
           params = {
              container_type: value.container_type
           }
        } else {
            params = {
                container_quantity: value.container_quantity
            }
        }
        this.handleUpdateVariantRow(params, id)

    }


    handleUpdateVariantRow = (params, id) => {
        updateWorkOrderServiceVarient(params, id).then(() => {
            this.getSelectedServiceVariants();
            this.props.fetchWorkOrder(this.props.workOrder?.id);
        }).catch(err => {
            handleError(err)
        })
    }

    handleCheckBox = (e, id, type) => {
        let params = {};
        if (type === "TAX") {
            this.setState({ taxVisible: e, modalVisible: true, taxCheckBox: true })
            params['taxable'] = e;
        } else {
            this.setState({ subtotalVisible: e, modalVisible: true, taxCheckBox: false })
            params['include_subtotal'] = e
        }
        this.handleUpdateVariantRow(params, id)
    }

    closeViewModal = () => {
        this.setState({ modalVisible: false })
    }

    deleteServiceVariant = () => {
        const { removableId } = this.state
        deleteWorkOrderServiceVariant(removableId).then(() => {
            this.fetchLineItems()
            this.getSelectedServiceVariants(true)
        })
            .catch(err => {
                handleError(err)
            })
    }

    handleRemoveWarning = (removeWarningVisible, id = null) => {
        this.setState({ removeWarningVisible, removableId: id })
    }

    handleFilterDrawer = visibleFilter => {
        this.setState({ visibleFilter })
    }

    setFilterObj = filterObj => {
        let counter = true;
        if (filterObj.daily_high || filterObj.daily_low || filterObj.family || filterObj.hourly_high || filterObj.hourly_low
            || filterObj.region || filterObj.service || filterObj.unit || filterObj.tier || filterObj.unit_high || filterObj.unit_low || filterObj.variant) {
            counter = true
        } else {
            counter = false
        }
        this.setState({ filterObj, page: 1, autoOpen: true, filterApplied: counter }, () => {
            this.fetchLineItems({ isSearched: true })
        });
    }

    render() {
        const {
            fetching,
            allOptions,
            projectUom,
            lineItems
        } = this.state;
        let selectedUom = allOptions.find((item) => item.id === projectUom);
        const { workOrder, regions } = this.props;

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
                                                    Please notice that a work order cannot last for more than 1 day.
                                                </h6>
                                            </div>
                                        </div>
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
                                                        fetching ? <Spin size="small" /> : "No service variant"
                                                    }
                                                    filterOption={false}
                                                    showSearch={true} 
                                                    onFocus={() => this.fetchLineItems()}
                                                    onChange={this.handleSelect}
                                                    optionLabelProp="label"
                                                >
                                                    {/* let foundRegion = regions.find(r => r.id == item.region); */}
                                                    {lineItems.map((item, i) =>
                                                        <>
                                                            {item.type === "variant" && (
                                                                <Option label={item.name} value={item.id}>
                                                                    <div
                                                                        className="row mx-0 vc-tr-select-option-row align-items-start border-0">
                                                                        <div style={{ width: '38px' }}
                                                                            className="vc-select-option-img float-left">
                                                                            <img
                                                                                src={Image.line_item_icon_green}
                                                                                alt=""
                                                                                className="img-fluid"
                                                                            />
                                                                        </div>
                                                                        <div style={{ width: 'calc(87% - 38px)' }}
                                                                            className="vc-select-option-data float-left">
                                                                            <div className="row">
                                                                                <div className="col-12">
                                                                                    <h6 className="mb-0">{`${item?.service_name} ${item.region_name && '/'} ${item.region_name || ""} - ${item?.variant_name}`}</h6>
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
                                                                                                {item.service_name}/{item.region_name}-{item?.variant_name}
                                                                                            </Breadcrumb.Item>
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
                                                                                        <img src={Images.labor_gray_icon}
                                                                                            alt=""
                                                                                            className="labor-grp-icon" />
                                                                                        <span
                                                                                            className="ml-1 labor-groups">{item.labor_groups.join(', ')}</span>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="text-green-tag select-text-tier">Service
                                                                            Varient
                                                                        </div>
                                                                    </div>


                                                                </Option>
                                                            )
                                                            }
                                                            {

                                                                item.type === "item" && (
                                                                    <Option label={item.name} value={item.id}>
                                                                        <div
                                                                            className="row mx-0 vc-tr-select-option-row align-items-start border-0 align-items-center">
                                                                            <div style={{ width: '87%' }}
                                                                                className="d-flex align-items-center">
                                                                                <div style={{ width: '38px' }}
                                                                                    className="vc-select-option-img float-left">
                                                                                    <img
                                                                                        src={Image.inventory_sub_tier_icon}
                                                                                        alt=""
                                                                                        className="img-fluid"
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    style={{ width: 'calc(100% - 38px)' }}
                                                                                    className="vc-select-option-data float-left">
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <h6 className="mb-0">
                                                                                                {/* {`${item.line_item?.name} / ${item?.name}`} */}
                                                                                                {item.item_name}
                                                                                                {/* Rubber Tubing */}
                                                                                            </h6>
                                                                                        </div>
                                                                                        {item.breadcrumb &&
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
                                                                                                            // <Breadcrumb.Item>{b}</Breadcrumb.Item>
                                                                                                        }
                                                                                                    })}
                                                                                                    <Breadcrumb.Item>
                                                                                                        {item.item_name}
                                                                                                    </Breadcrumb.Item>
                                                                                                </Breadcrumb>
                                                                                            </div>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="text-green-tag select-text-tier">
                                                                                Inventory Item
                                                                            </div>
                                                                        </div>

                                                                    </Option>
                                                                )

                                                            }
                                                            {

                                                                item.type === "kit" && (
                                                                    <Option label={item.name} value={item.id}>

                                                                        <div
                                                                            className="row mx-0 vc-tr-select-option-row align-items-start border-0">
                                                                            <div style={{ width: '87%' }}
                                                                                className="d-flex align-items-center">
                                                                                <div style={{ width: '38px' }}
                                                                                    className="vc-select-option-img float-left">
                                                                                    <img
                                                                                        src={Image.inventory_kit_sub_tier_icon}
                                                                                        alt=""
                                                                                        className="img-fluid"
                                                                                    />
                                                                                </div>
                                                                                <div
                                                                                    style={{ width: 'calc(100% - 38px)' }}
                                                                                    className="vc-select-option-data float-left">
                                                                                    <div className="row">
                                                                                        <div className="col-12">
                                                                                            <h6 className="mb-0">{item.kit_name}</h6>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="text-green-tag select-text-tier">
                                                                                Inventory kit
                                                                            </div>
                                                                        </div>

                                                                    </Option>
                                                                )

                                                            }
                                                            {

item.type === "disposal" && (
    <Option label={item.name} value={item.id}>

        <div
            className="row mx-0 vc-tr-select-option-row align-items-start border-0">
            <div style={{ width: '87%' }}
                className="d-flex align-items-center">
                <div style={{ width: '38px' }}
                    className="vc-select-option-img float-left">
                    <img
                        src={Image.disposal}
                        alt=""
                        className="img-fluid"
                    />
                </div>
                <div
                    style={{ width: 'calc(100% - 38px)' }}
                    className="vc-select-option-data float-left">
                    <div className="row">
                        <div className="col-12">
                            <h6 className="mb-0">{item.name}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="text-green-tag select-text-tier">
                disposal
            </div>
        </div>

    </Option>
)

}

{

item.type === "supply" && (
    <Option label={item.name} value={item.id}>

        <div
            className="row mx-0 vc-tr-select-option-row align-items-start border-0">
            <div style={{ width: '87%' }}
                className="d-flex align-items-center">
                <div style={{ width: '38px' }}
                    className="vc-select-option-img float-left">
                    <img
                        src={Image.supply_group_icon}
                        alt=""
                        className="img-fluid"
                    />
                </div>
                <div
                    style={{ width: 'calc(100% - 38px)' }}
                    className="vc-select-option-data float-left">
                    <div className="row">
                        <div className="col-12">
                            <h6 className="mb-0">{item.supply_name}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="text-green-tag select-text-tier">
                supply
            </div>
        </div>

    </Option>
)

}

                                                        </>
                                                    )}
                                                </Select>
                                            </Form.Item>
                                            <Button
                                                className="search-icon bg-transparent border-0 p-0 position-absolute">
                                                <img
                                                    src={Images.search_small_icon}
                                                    alt=""
                                                    className="img-fluid"
                                                />
                                            </Button>
                                            {/* <Button
                                                onClick={() => this.handleFilterDrawer(true)}
                                                className="filter-btn ps-filter d-flex align-items-center justify-content-center text-capitalize"
                                            >
                                                <img alt={" "} src={Images.filter_icon} /> Filter
                                            </Button> */}
                                        </div>
                                        <div className="col-6">
                                            {/* <div className="row mx-0 mt-0 mb-3 add-sub-tier-input-form">
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
                                            </div> */}
                                        </div>
                                    </div>

                                    {/*when-data-is-not-available*/}
                                    <div className="col-12">

                                        {this.state.newPricing.length > 0 ?
                                            <div className="container">
                                                <div
                                                    className="col-12 table-responsive main-table-div position-relative wage-table">
                                                    <div
                                                        className="row mx-0 custom-table-main-row custom-table-main-row-proposal-line-item custom-table-main-row-wage-info-main proposal-update-table service-v-update">
                                                        <div
                                                            className="col-12 custom-table-change service-variants-table">
                                                            <div
                                                                className="row custom-table-header custom-table-header-2">
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
                                                                    <div className="custom-th-heading">Cont Qty</div>
                                                                </div>
                                                                <div className="custom-table-cell-th custom-table-cell-th-4">
                                                                    <div className="custom-th-heading">Container</div>
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
                                                                {this.state.newPricing?.map((n) => {                                                                    {/*      let foundRegion = regions.find(r => r.id == n?.variant?.region);*/
                                                                    }
                                                                    {/*debugger*/
                                                                    }
                                                                    {/*console.log(n, "mapped")*/
                                                                    }
                                                                    return (
                                                                        <WorkOrderServiceVarientTableCreateMain
                                                                            key={n.id}
                                                                            // view
                                                                            child={
                                                                                n?.variant_data?.table_pricing || n?.children || []
                                                                            }
                                                                            foundRegion={n?.variant_data?.region}
                                                                            modalVisible={this.state.modalVisible}
                                                                            taxVisible={this.state.taxVisible}
                                                                            subtotalVisible={this.state.subtotalVisible}
                                                                            taxCheckBox={this.state.taxCheckBox}
                                                                            handlePriceUnit={this.handlePriceUnit}
                                                                            handleServiceModal={this.handleServiceModal}
                                                                            serviceModalVisible={this.state.serviceModalVisible}
                                                                            handleChangeContainer={this.handleChangeContainer}
                                                                            closeViewModal={this.closeViewModal}
                                                                            fetchworkorder={this.props.fetchWorkOrder}
                                                                            getSelectedServiceVariants={this.getSelectedServiceVariants}
                                                                            workorder = {this.props.workOrder}
                                                                            manually_added={n?.resource_type === "INVENTORY_KIT" ? true : false}
                                                                            margin={n?.margin}
                                                                            allOptions={allOptions}
                                                                            handleUnitSelectChange={(e, id) =>
                                                                                this.handleUnitSelectChange(e, id)
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
                                                                            // newPricing={n}
                                                                            newPricing = {n}
                                                                            view={false}
                                                                        />
                                                                    );
                                                                })}
                                                                {/* <div className='col-12 mt-3'>
                                                                <div
                                                                    className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                                                    <h6 className="mb-0">No Line Items</h6>
                                                                </div>
                                                            </div>
                                                            : */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="col-12">
                                                <div
                                                    className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                                    <img src={Images.line_items_empty_state_icon} alt={''}
                                                        className="img-fluid" />
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
                            {!this.state.loading && (
                                <div className="col-12 px-md-4 px-sm-3">
                                    <div className="row mx-0 px-md-2 px-sm-2 py-3">
                                        <div className="col-12">
                                            <Form.Item
                                                name="additional_description"
                                                label={"Additional Description of Materials Listed Above"}
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: "",
                                                    },
                                                ]}
                                                className="position-relative"
                                            >
                                                <Bullet id = {"descriptionAdd"} />
                                            </Form.Item>
                                        </div>
                                        <div className="col-12">
                                            <Form.Item
                                                name="special_instruction"
                                                label={"Special Handling Instructions and Additional Information"}
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: "",
                                                    },
                                                ]}
                                                className="position-relative"
                                            >
                                                <Bullet id = {"instruction"}/>
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
                        </Form>
                    </div>
                </div>

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
                <WorkorderCommonView
                    footerText={"Okay"}
                    visible={this.state.varientModalVisible}
                    onClose={() => {
                        this.handleWorkOrderServiceVarient(this.state.varientData)
                        this.handleVarientModal(false)
                    }
                    }
                    // onClose={this.setState({serviceModalVisible: false})}
                    heading={"Please review the quantity for this service variant."}
                    subHeading={"The quantity defaults to this service variant’s quantity within the project. To avoid issues, please make sure that if your service variant has a UOM of Day, the quantity is not more than 1."}
                />
                <WorkorderCommonView
                    footerText={"Okay"}
                    visible={this.state.itemModalVisible}
                    onClose={() => {
                        this.handleWorkOrderServiceVarient(this.state.itemData)
                        this.handleItemModal(false)
                    }
                    }
                    // onClose={this.setState({serviceModalVisible: false})}
                    heading={"Please review the quantity for this inventory item."}
                    subHeading={"The quantity defaults to this inventory item’s quantity within the project."}

                />
                <WorkorderCommonView
                    footerText={"Okay"}
                    visible={this.state.kitModalVisible}
                    onClose={() => {
                        this.handleWorkOrderServiceVarient(this.state.kitData)
                        this.handleKitModal(false)
                    }
                    }
                    // onClose={this.setState({serviceModalVisible: false})}
                    heading={"Please review the quantity for this inventory kit."}
                    subHeading={"The quantity defaults to this inventory kit’s quantity within the project."}

                />
                <ServiceVarientsFilterDrawer visible={this.state.visibleFilter}
                    onClose={() => this.handleFilterDrawer(false)}
                    setFilterObj={this.setFilterObj} />
            </React.Fragment>
        );
    }
}

export default withRouter(WorkOrderServicevarientCreate);
