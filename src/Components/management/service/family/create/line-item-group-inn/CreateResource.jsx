import React, {Component} from "react";
import {Button, Col, Collapse, Dropdown, Form, Menu, message, Radio, Row, Spin, Table, Tooltip,} from "antd";
import {withRouter} from "react-router-dom";
import {Image as Images} from "../../../../../Images";
import AddPricing from "../../../../../drawers/items/AddPricing";
import {CaretRightOutlined, IeOutlined} from "@ant-design/icons";
import {
    deleteLineItemPricing,
    deleteLineItemResource,
    getBackendPricing,
    getLineItemPricing,
    getLineItemResource,
    updateLineItem,
} from "../../../../../../Controller/api/lineItemsServices";
import {handleError} from "../../../../../../Controller/Global";
import CreateButtonWithAll from "../CreateButtonWithAll";
import {
    calculatePercentage,
    FLEET_GROUP,
    laborCalculations,
    SUPPLY_GROUP,
    supplyCalculation,
    titleCase,
    vehicleCalculations,
} from "../../../../../../Controller/utils";
import {getLaborGroup} from "../../../../../../Controller/api/labourServices";
import CommonWarningModal from "../../../../../modals/CommonWarningModal";
import PricingTableNew from "../PricingTableNew";

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24},
};
const {Panel} = Collapse;

let icons = {
    FLEET_GROUP: Images.vehicle_group_icon_new,
    FLEET_KIT_GROUP: Images.vehicle_group_icon_new,
    FLEET_KIT: Images.double_truck,
    LABOR: Images.labor_sub_tier_icon,
    SUPPLY_GROUP: Images.supply_group_icon_new,
    INVENTORY_ITEM: Images.inventory_kit_sub_tier_icon_new,
    INVENTORY_KIT: Images.inventory_kit_sub_tier_icon,
    DISPOSAL: Images.disposal,
};

class CreateResource extends Component {
    state = {
        visible: false,
        pricing: [],
        qualifier: [],
        value: 1,
        selectedPricing: null,
        fetching: true,
        resources: [],
        warningVisible: false,
        deleteResource: null,
        page: 1,
        totalCount: null,
        pricingNew: [],
        serviceText: false,
        tooltipData: [],
        // activeKey: '1'
    };
    formRef = React.createRef();
    onChange = (e) => {
        this.setState({value: e.target.value});
    };
    removePrice = (data) => {
        deleteLineItemPricing(data.id)
            .then((res) => {
                // console.log(data, "price")
                const pricing = this.state.pricing.filter(n => n.id != data.id);
                this.setState({pricing, totalCount: pricing.length})
                // this.getPricing();
            })
            .catch((err) => {
                handleError(err);
            });
    };
    menu = (data) => (
        <Menu>
            <Menu.Item>
                <div onClick={() => this.showAddPricing(true, data, true)}>Edit</div>
            </Menu.Item>
            <Menu.Item>
                <div onClick={() => this.removePrice(data)}>Remove</div>
            </Menu.Item>
        </Menu>
    );

    menu_2 = (data) => (
        <Menu>
            <Menu.Item>
                <div onClick={() => this.showWarning(true, data)}>Remove</div>
            </Menu.Item>
        </Menu>
    );

    columns = [
        {
            title: "dry Name",
            key: "name",
            render: (data) => (
                data.item_type == "FLEET_KIT"?
                <div id={`FLEET_KIT_${data.id}`} className={`d-flex align-items-center ${data?.resource_item.fleet_group.length > 0? "fleet-kit-parent":""}`}>
                    <img alt={" "} className="img-fluid" src={icons[data.item_type]}/>
                    <span className={`ml-2` }>{data.resource_name}</span>
                </div>
                :data.item_type == "FLEET_KIT_GROUP"?
                <div data-id={`FLEET_KIT_${data.fleet_id}`} className={`d-flex align-items-center fleet-kit-child`}>
                    <img alt={" "} className="img-fluid" src={icons[data.item_type]}/>
                     <span className={`ml-2` }>{data.name}</span>
                </div>
                :<div className={`d-flex align-items-center`}>
                    <img alt={" "} className="img-fluid" src={icons[data.item_type]}/>
                <span className={`ml-2` }>{data.item_type === "DISPOSAL" ? `${data.resource_item?.disposal_code || ""} ${data.resource_item?.disposal_code ? '-' : ''} ${data.resource_name}` : data?.item_type === "FLEET_KIT_GROUP" ? `${data?.name}`:data.resource_name}</span>
                </div>
            )
        },
        {
            title: "edit remove",
            key: "edit_remove",
            render: (data) => (
                <div className="d-flex align-items-center justify-content-end">
          <span className="resource-type-title">
            {titleCase(data.item_type === "FLEET_KIT_GROUP" ? "FLEET GROUP" : data.item_type)}
          </span>
                    <Dropdown trigger={"click"} overlay={() => this.menu_2(data)}>
                        <a
                            className="ant-dropdown-link"
                            onClick={(e) => e.preventDefault()}
                        >
                            <img src={Images.eva_more_elisis} className="img-fluid" alt=""/>
                        </a>
                    </Dropdown>
                </div>
            ),
        },
    ];

    handleRequiredLabel = () => {
            const { resources } = this.state;

            let laborFind = resources.find(i => i.item_type == 'LABOR')
            let fleetFind = resources.find(i => i.item_type == 'FLEET_KIT')
            let fleetGroup = resources.find(i => i.item_type == "FLEET_KIT_GROUP")

            console.log(laborFind,fleetFind,fleetGroup,"trio")

            if(laborFind && fleetFind && fleetGroup) {
                console.log("true")
                this.props.handleLabel()
            }
        }
    removeItem = () => {
        // console.log(data)
        deleteLineItemResource(this.state.deleteResource.id)
            .then((res) => {
                this.getResource();
            })
            .catch((err) => {
                handleError(err);
            });
    };

    componentDidMount() {
        if (this.props.item) {
            this.getResource();
            this.getPricing();
        }
        this.fetchGroup();
    }

    getResource = () => {
        // this.setState({fetching: true})
        getLineItemResource({item: this.props.item.id})
            .then((res) => {
                let ordering = {}, // map for efficient lookup of sortIndex
                    sortOrder = [
                        "LABOR",
                        "FLEET_GROUP",
                        "FLEET_KIT",
                        "SUPPLY_GROUP",
                        "DISPOSAL",
                        "INVENTORY_ITEM",
                        "INVENTORY_KIT",
                    ];
                for (let i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i;

                const sortedArr = res.data.results.sort(function (a, b) {
                    return (
                        ordering[a.item_type] - ordering[b.item_type] ||
                        a.item_type.localeCompare(b.item_type)
                    );
                });
                // this.setState({resources: sortedArr});
                let updateArr = []
                sortedArr.forEach((i, index) => {
                    updateArr.push(i)
                    if(i.item_type == "FLEET_KIT"){
                        i.resource_item.fleet_group.forEach((group, groupIndex) => {
                            updateArr.push({
                                item_type: "FLEET_KIT_GROUP",
                                name: group.name,
                                id: group.id,
                                fleet_id: i.id
                            })
        
                        })
                    }
                })
                
                this.setState({resources: updateArr});
                this.handleRequiredLabel();
                this.formRef.current.setFieldsValue({
                    ...this.props.item,
                    qualifier: this.props.item.qualifier?.split("^") || [],
                });
            })
            .catch((err) => {
                handleError(err);
            });
        // .finally(() => {
        //     this.setState({fetching: false})
        // })
    };
    getPricing = () => {
        this.setState({loading: true});
        getLineItemPricing({item: this.props.item.id, page: this.state.page})
            .then((res) => {
                setTimeout(() => {
                    this.setState((prevState) => {
                        return {
                            pricing: [...prevState.pricing, ...res.data.results],
                            totalCount: res.data.count,
                        };
                    });
                }, 1000);
            })
            .catch((err) => {
                handleError(err);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    };

    showAddPricing = (visible, selectedPricing = null, text) => {
        // console.log("selected", selectedPricing)
        // if(!visible) {
        //     this.setState({loading: true})
        // }
        if (visible) {
            this.setState({fetching: false});
        }
        this.setState({
            visible,
            selectedPricing,
            serviceText: text,
        });
    };

    handleUpdate = (values) => {
        // values.qualifier = values.qualifier.join('^');
        updateLineItem(this.props.item.id, values)
            .then((res) => {
                message.success("Line Item Updated Successfully");
                this.props.onClose();
            })
            .catch((err) => {
                handleError(err);
            });
    };

    fetchGroup = (params = {}) => {
        getLaborGroup(params)
            .then((res) => {
                this.setState({groups: res.data.results});
            })
            .catch((err) => {
                handleError(err);
            });
    };

    totalPrice = (item) => {
        let data = item?.table_data;
        let newPrice = 0;
        for (let i = 0; i < data?.length; i++) {
            if (data[i].item_type == "labor_child") {
                // const newItem = this.state?.groups?.drawer(grp => {
                //     return data[i]?.type_id?.value == grp.id;
                // })
                const newItem = data[i].data;
                newPrice =
                    newPrice +
                    (data[i].hours || 1) *
                    Number(
                        calculatePercentage(
                            laborCalculations(newItem, data[i].time, data[i].name),
                            item.margin
                        )
                    );
            } else if (data[i].item_type == FLEET_GROUP) {
                newPrice =
                    newPrice +
                    (data[i].hours || 1) *
                    Number(
                        calculatePercentage(
                            vehicleCalculations(data[i].data),
                            item.margin
                        )
                    );
            } else if (data[i].item_type == SUPPLY_GROUP) {
                newPrice =
                    newPrice +
                    (data[i].hours || 1) *
                    Number(
                        calculatePercentage(supplyCalculation(data[i].data), item.margin)
                    );
            } else if (data[i].item_type == "INVENTORY_ITEM") {
                if (data[i].kit_child) {
                    newPrice =
                        newPrice +
                        ((data[i].quantity ? data[i].quantity : data[i].initQuantity) ||
                            1) *
                        Number(
                            calculatePercentage(
                                data[i]?.unit_cost || 0,
                                data[i]?.margin || 0
                            )
                        );
                } else {
                    newPrice =
                        newPrice +
                        (data[i].hours || 1) *
                        Number(
                            calculatePercentage(
                                data[i].data?.unit_cost || 0,
                                data[i]?.data?.margin || 0
                            )
                        );
                }
            } else if (data[i].item_type == "DISPOSAL") {
                newPrice =
                    newPrice +
                    (data[i].hours || 1) *
                    Number(
                        calculatePercentage(
                            data[i]?.data?.unit_cost || 0,
                            data[i]?.data?.margin || 0
                        )
                    );
            }
        }
        return newPrice.toFixed(2);
    };

    hourPrice = (item) => {
        let data = item?.table_data;
        let newHoursArr = [];
        for (let i = 0; i < data?.length; i++) {
            if (data[i].item_type == "labor_child") {
                newHoursArr.push(data[i].hours);
            } else if (data[i].item_type == FLEET_GROUP) {
                newHoursArr.push(data[i].hours);
            } else if (data[i].item_type == SUPPLY_GROUP) {
                newHoursArr.push(data[i].hours);
            }
            // else if (data[i].item_type == 'INVENTORY_ITEM') {
            //     newHoursArr.push(!data[i].kit_child ? data[i].hours : data[i].quantity ? data[i].quantity : data[i].initQuantity)
            // } else if (data[i].item_type == 'DISPOSAL') {
            //     newHoursArr.push(data[i].hours)
            // }
        }
        const newArr = newHoursArr.filter((i) => i != undefined);
        if (isFinite(Math.max(...newArr))) {
            return (this.totalPrice(item) / Math.max(...newArr)).toFixed(2);
        } else {
            return this.totalPrice(item);
        }
    };

    showWarning = (warningVisible, deleteResource = null) => {
        this.setState({warningVisible, deleteResource});
    };

    handleChange = (values) => {
        const radioValue = this.formRef.current.getFieldValue("tax");
        // console.log(radioValue, "radio")
        updateLineItem(this.props.item.id, {...values, tax: radioValue})
            .then()
            .catch((err) => {
                handleError(err);
            });
    };

    handlePagination = () => {
        this.setState(
            (prevState) => {
                return {page: prevState.page + 1};
            },
            () => {
                this.getPricing();
            }
        );
    };

    // getBackendPricing = (data) => {
    //     getBackendPricing({pricing: data?.id ? data?.id : data}).then(resp => {
    //         // console.log(resp.data);
    //         this.setState({pricingNew: resp.data})
    //     })
    // }

    getBackendPricing = (data) => {
        // , TOOLTIP_DATA)
        getBackendPricing({pricing: data?.id ? data?.id : data}).then(resp => {
            // console.log(resp.data);
            // if(TOOLTIP_DATA) {
            //     let allLaborChildren = [];
            //     resp.data.forEach(i => {
            //         if(i.type === "LABOR") {
            //             if(i.children.length > 0) {
            //                 i.children.forEach(l => allLaborChildren.push(l));
            //             }
            //             else {
            //                 allLaborChildren = []
            //             }
            //         }
            //     })
            //     this.setState({tooltipData: allLaborChildren})
            // }
            // else {
            this.setState({pricingNew: resp.data})
            // }
        }).catch(err => {
            handleError(err)
        })
    }

    setSelectedPricing = selectedPricing => {
        this.setState({selectedPricing})
    }

    returnToolTipData = (tooltipData) => {
        // const { tooltipData} = this.state;
        return (    
                    <>
                    <h4 style={{borderBottom: '1px solid #BDBDBD',color:"#BDBDBD",marginBottom:5,fontSize:"15px"}}>
                       <img src={Images.teams_labor_no_data_icon} alt="" /> Labor Groups
                    </h4>
                    <ul style={{paddingLeft:"15px",paddinTop:"5px"}}>
                    {tooltipData.length > 0 ?
                        tooltipData?.map(i =>{
                        return <li>{i || "-"}</li>
                        })
                        :
                        <li>-</li>
                        }
                    </ul>
                    </>
                )
        }

    render() {
        let {pricing, resources, fetching, loading, totalCount, activeKey, tooltipData} = this.state;
        const {item} = this.props;
        resources = resources?.map(function (v) {
            delete v.resources;
            return v;
        });
        if (!item) {
            return <Spin/>;
        }

        return (
            <React.Fragment>
                {/* <div className="col-12"
                 ref="myscroll"
                 style={{ height: "500px", overflow: "auto" }}>
                    {/* {pricing.map(m => {
                        return <h1>{m.name}</h1>
                    })}  
                    </div>  */}
                <div className="row mx-0 py-0 resource-row-main">
                    {resources.length > 0 ?
                        <div className="col-12 table-responsive create-dry-table main-table-div">
                            <Table
                                className="main-table-all"
                                dataSource={resources}
                                columns={this.columns}
                                size="middle"
                                pagination={false}
                            />
                        </div>
                        :
                        <div className="col-12">
                            <div className="row mt-3 mx-0 no-data-card-row align-items-center justify-content-center">
                                <div className="col-12 text-center">
                                    <img
                                        src={Images.line_items_empty_state_icon}
                                        alt=""
                                        className="img-fluid"
                                    />
                                    <h6 className="mb-0 text-gray-tag">No Resources</h6>
                                </div>
                            </div>
                        </div>
                    }
                    <CreateButtonWithAll item={item} getResource={this.getResource}/>
                </div>
                <div className="row common-form-card-row common-dry-card-row mx-0">
                    <div className="col-12">
                        <Form
                            onFinish={this.handleUpdate}
                            onFieldsChange={this.handleChange}
                            ref={this.formRef}
                            {...layout}
                            hideRequiredMark={true}
                            className="main-inner-form"
                        >
                            <div className="row p-0">
                                {/*<div className="col-12">*/}
                                {/*    {!this.state.fetching && <Form.Item name="qualifier"*/}
                                {/*                                        label={"Qualifiers"}*/}
                                {/*                                        rules={[{*/}
                                {/*                                            required: true,*/}
                                {/*                                            message: 'this field is required'*/}
                                {/*                                        }]} className="position-relative">*/}
                                {/*        <Bullet/>*/}
                                {/*        /!*<TextArea className="text-area-main text-area-task"*!/*/}
                                {/*        /!*          placeholder="• Tap enter to create a new bullet point"/>*!/*/}
                                {/*    </Form.Item>}*/}
                                {/*</div>*/}
                                <div className="col-12">
                                    <Form.Item name="tax">
                                        <Radio.Group style={{width: "100%"}}>
                                            <Row>
                                                <Col span={2}>
                                                    <Radio value={true}>Taxable</Radio>
                                                </Col>
                                                <Col span={4}>
                                                    <Radio value={false}>Non-taxable</Radio>
                                                </Col>
                                            </Row>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </div>
                        </Form>
                    </div>

                    <div className="col-12">
                        <div className="divider-line-div"/>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 small-heading-in-form">
                                <div className="row mx-0 align-items-center">
                                    <h6>Service Variants</h6>
                                    <div className="new-opportunity-btn-div ml-3">
                                        <Button
                                            disabled={resources.length === 0}
                                            onClick={() => this.showAddPricing(true)}
                                            className="new-opportunity-btn text-capitalize"
                                        >
                                            + Create Service Variant
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row mx-0 my-3 info-gray-div align-items-center">
                                    <h6 className="mb-0">
                                        Once the resources have been added, you can create Service
                                        Variants. Names of Service Variants are ‘Region + Service
                                        Variant’s name’, (e.g. NY-Westchester - Sunday).
                                    </h6>
                                </div>
                            </div>
                            {/* <div className="col-12"
                             ref="myscroll"
                                    style={{ height: "800px", overflow: "auto" }}>
                                        <div className="row"> */}
                            {
                                this.state.page === 1 && loading ? (
                                    <div className="col-12 d-flex align-items-center text-center loading">
                                        <Spin className="mx-auto"/>
                                    </div>
                                ) : pricing.length > 0 ? (
                                    <div className="col-12">
                                        <Collapse
                                            className="vehicle-group-collapse-main dry-group-collapse-main"
                                            accordion
                                            expandIcon={({isActive}) => (
                                                <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                                            )}
                                            onChange={activeKey => {
                                                this.setState({activeKey}, () => {
                                                    this.getBackendPricing(activeKey)
                                                })
                                            }}
                                            activeKey={activeKey}
                                            // defaultActiveKey={"1"}
                                            // onChange={callback}
                                        >
                                            {pricing.map((item) => {
                                                return (
                                                    <Panel
                                                        header={
                                                            <React.Fragment>
                                                                <div className="col-12">
                                                                    <div
                                                                        className="row info-card-heading-row align-items-center pr-0 justify-content-between">
                                                                        <h5 className="mb-0 vehicle-group-heading">{`${item?.region} - ${item.name}`}
                                                                        <Tooltip
                                                                                className="labor-group-info"
                                                                                placement="top"
                                                                                title={() => this.returnToolTipData(item?.labor_groups)}
                                                                                overlayStyle={{ fontSize: 11 }}
                                                                                arrowPointAtCenter={true}
                                                                                // onMouseEnter={() => this.getBackendPricing(item, true)}
                                                                                // onMouseLeave={() => this.setState({tooltipData: []})}
                                                                                destroyTooltipOnHide
                                                                                > 
                                                                            <img src={Images.info_small} alt="" />
                                                                            </Tooltip>
                                                                            {/* <Tooltip
                                                                            placement="top"
                                                                            className="display_name_info"
                                                                            >
                                                                                <span className="display_data">{`Display Name: ${item.display_name}`}</span>
                                                                            </Tooltip> */}
                                                                        </h5>
                                                                        <Tooltip
                                                                            placement="top"
                                                                            className="display_name_info"
                                                                            title={item?.display_name}
                                                                            >
                                                                                <span className="display_data">{`Display Name: ${item.display_name || "-"} `}</span>
                                                                            </Tooltip>
                                                                        <div className="d-flex align-items-center">
                                                                            <div
                                                                                className="show-when-collapsed d-flex align-items-center justify-content-between">
                                                                                <ul className="list-inline mb-0 pricing-estimated-ul d-flex align-items-center">
                                                                                    <li className="list-inline-item">
                                            <span className="d-flex align-items-center">
                                              {/*<img alt={""} className="img-fluid mr-1"*/}
                                                {/*     src={Images.info_small}/>*/}
                                                Hourly Price:
                                            </span>
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        $
                                                                                        {item?.hourly_price?.toLocaleString() || "-"}
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                            <span className="d-flex align-items-center">
                                              {/*<img alt={""} className="img-fluid mr-1"*/}
                                                {/*     src={Images.info_small}/>*/}
                                                Daliy Price:
                                            </span>
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        $
                                                                                        {item?.daily_price?.toLocaleString() || "-"}
                                                                                    </li>
                                                                                    <li className="list-inline-item pl-1">
                                            <span className="d-flex align-items-center">
                                              Unit Price:
                                            </span>
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        ${item.price || 0.0}{" "}
                                                                                        {item?.pricing_uom &&
                                                                                            `/ ${item?.pricing_uom?.symbol}`}
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div
                                                                                className="remove-dropdown"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <Dropdown
                                                                                    trigger={"click"}
                                                                                    overlay={() => this.menu(item)}
                                                                                >
                                                                                    <a
                                                                                        className="ant-dropdown-link"
                                                                                        onClick={(e) => e.preventDefault()}
                                                                                    >
                                                                                        <img
                                                                                            src={Images.eva_more_elisis}
                                                                                            className="img-fluid"
                                                                                            alt=""
                                                                                        />
                                                                                    </a>
                                                                                </Dropdown>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                        key={item.id}
                                                    >
                                                        <React.Fragment>
                                                            <div className="row mx-0">
                                                                <div className="col-12 table-responsive main-table-div position-relative">
                                                                    {/* <GeneratePricingTable
                                                                        view
                                                                        child={
                                                                        item?.table_data?.drawer(
                                                                            (i) => i.id != "add"
                                                                        ) || []
                                                                        }
                                                                        margin={item.margin}
                                                                    /> */}
                                                                    <PricingTableNew
                                                                        view
                                                                        rows={this.state.pricingNew}
                                                                        getBackendPricing={() => this.getBackendPricing(item)}
                                                                        margin={item.margin}
                                                                    />
                                                                    <div
                                                                        className="col-12 show-when-collapse-show footer-data-main footer-data-main-update">
                                                                        <div className="row table-footer--1-row">
                                                                            <div className="col-12">
                                                                                <ul className="list-inline mb-0 pricing-estimated-ul">
                                                                                    <li className="list-inline-item">
                                                                                        Cost:
                                                                                    </li>
                                                                                    <li className="list-inline-item border-0 p-0">
                                                                                          Hourly Cost:
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        ${item?.hourly_cost || 0.0}
                                                                                    </li>
                                                                                    <li className="list-inline-item border-0 p-0">
                                                                                          Daliy Cost:
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        ${item?.daily_cost}
                                                                                    </li>
                                                                                    <li className="list-inline-item border-0 p-0">
                                                                                          Unit Cost:
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                       {item?.unit_cost ? `$${item?.unit_cost}/${item?.cost_uom?.symbol}`: "-"}
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex row table-footer--2-row">
                                                                            <div className="col-12">
                                                                                <ul className="list-inline mb-0 pricing-estimated-ul">
                                                                                    <li className="list-inline-item">
                                                                                        Suggested Price:
                                                                                    </li>
                                                                                    <li className="list-inline-item border-0 p-0">
                                                                                          Hourly Price:
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        ${item?.suggested_hourly_price || 0.0}
                                                                                    </li>
                                                                                    <li className="list-inline-item border-0 p-0">
                                                                                          Daliy Price:
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        ${item?.suggested_daily_price}
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex row table-footer--3-row">
                                                                            <div className="col-12">
                                                                                <ul className="list-inline mb-0 pricing-estimated-ul">
                                                                                    <li className="list-inline-item">
                                                                                        Price:
                                                                                    </li>
                                                                                    <li className={`list-inline-item border-0 pr-0 position-relative ${item.hourly_percentage == 0 && 'no-percentage'}`}>
                                                                                        <span>
                                                                                          {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                            {/*     src={Images.info_small}/>*/}
                                                                                            Hourly Price:
                                                                                        </span>
                                                                                        {item.hourly_percentage != 0 && 
                                                                                                <small>{item.hourly_percentage > 0 ? `${item.hourly_percentage}% markup` : `${Math.abs(item.hourly_percentage)}% markdown`}</small>
                                                                                                }                                                                                    
                                                                                        </li>
                                                                                    <li className="list-inline-item">
                                                                                        <span className="theme-color">${item.hourly_price || "-"}</span>
                                                                                    </li>
                                                                                    <li className={`list-inline-item border-0 pr-0 position-relative ${item.daily_percentage == 0 && 'no-percentage'}`}>
                                                                                        <span>
                                                                                          {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                            {/*     src={Images.info_small}/>*/}
                                                                                            Daliy Price:
                                                                                        </span>
                                                                                        {item.daily_percentage != 0 && 
                                                                                            <small>{item.daily_percentage > 0 ? `${item.daily_percentage}% markup` : `${Math.abs(item.daily_percentage)}% markdown`}</small>
                                                                                        }      
                                                                                        </li>
                                                                                    <li className="list-inline-item">
                                                                                        <span className="theme-color">${item.daily_price || "-"}</span>
                                                                                    </li>
                                                                                    <li className="list-inline-item border-0">
                                                                                        <span>
                                                                                          Unit Price:
                                                                                        </span>
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        <span className="theme-color">${item.price || 0.0}{" "}
                                                                                        {item?.pricing_uom &&
                                                                                            `/ ${item?.pricing_uom?.symbol}`}</span>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    </Panel>
                                                );
                                            })}
                                        </Collapse>
                                        <div className="row">
                                            <div className="col-12 text-center create-div">
                                                {loading ? (
                                                    <Spin/>
                                                ) : (
                                                    pricing.length !== totalCount && (
                                                        <Button onClick={this.handlePagination}>
                                                            Load More
                                                        </Button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="col-12">
                                            <div
                                                style={
                                                    resources.length === 0
                                                        ? {
                                                            cursor: "not-allowed",
                                                            opacity: "0.6",
                                                        }
                                                        : {}
                                                }
                                                className="row mt-3 mx-0 no-data-card-row align-items-center justify-content-center"
                                            >
                                                <div
                                                    style={
                                                        resources.length === 0
                                                            ? {
                                                                pointerEvents: "none",
                                                            }
                                                            : {}
                                                    }
                                                    className="col-12 text-center"
                                                >
                                                    <img
                                                        src={Images.no_varient}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                    <h6 className="mb-0 text-gray-tag">
                                                        No Service Variants
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 validate-div-col text-md-right">
                                            <Form.Item>
                                                <Button
                                                    onClick={() => this.formRef.current.submit()}
                                                    className="validate-btn-main"
                                                >
                                                    Validate
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
                <AddPricing
                    serviceText={this.state.serviceText}
                    data={this.props.item}
                    visible={this.state.visible}
                    resource={this.state.resources}
                    selectedPricing={this.state.selectedPricing}
                    setSelectedPricing={this.setSelectedPricing}
                    onClose={(data) => {
                        // console.log(data, "pricingdata")
                        this.showAddPricing(false);
                        if (data) {
                            this.getBackendPricing(data ? data.id : activeKey)
                            let newArr = [...this.state.pricing];
                            const Index = newArr.findIndex((i) => i.id === data.id);
                            // console.log(Index, "index");
                            if (Index != '-1') {
                                newArr[Index] = data;
                                this.setState({pricing: newArr});
                                // console.log(newArr[Index], "on Replacable index")
                                }
                                else {
                                newArr.push(data);
                                this.setState(prevState => {
                                    return {pricing: newArr, totalCount: prevState.totalCount + 1};
                                })
                            }
                            this.props.callBackData(data);
                        }
                    }}
                />
                <CommonWarningModal
                    visible={this.state.warningVisible}
                    onClose={() => this.showWarning(false)}
                    resourceWarning
                    addPricingWarning
                    confirmClose={() => {
                        this.removeItem();
                        this.showWarning(false);
                    }}
                    heading={"Are you sure you want to remove this Resource?"}
                    subHeadingUOM={
                        "If you choose to remove this Resource, if you already have service variants set up, this might cause issues."
                    }
                />
            </React.Fragment>
        );
    }
}

export default withRouter(CreateResource);
