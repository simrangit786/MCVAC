import React, {Component} from "react";
import {Breadcrumb, Button, Collapse, Spin, Table, Tooltip,} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from "../../../Images";
import {withRouter} from "react-router-dom";
import {
    deleteLineItemResource,
    getBackendPricing,
    getLineItemById,
    getLineItemPricing,
} from "../../../../Controller/api/lineItemsServices";
import {handleError} from "../../../../Controller/Global";
import LineItemDrawer from "../family/create/lineItemDrawer";
import {getLaborGroup} from "../../../../Controller/api/labourServices";
import {
    calculatePercentage,
    FLEET_GROUP,
    laborCalculations,
    SUPPLY_GROUP,
    supplyCalculation,
    titleCase,
    vehicleCalculations,
    formatPrice,
} from "../../../../Controller/utils";
import {setBreadcrumb} from "../../../../Store/actions/breadcrumbAction";
import {connect} from "react-redux";
import {routes} from "../../../../Controller/Routes";
import PricingTableNew from "../family/create/PricingTableNew";

const {Panel} = Collapse;

let icons = {
    FLEET_KIT_GROUP: Images.vehicle_group_icon_new,
    FLEET_GROUP: Images.vehicle_group_icon_new,
    FLEET_KIT: Images.double_truck,
    LABOR: Images.labor_sub_tier_icon,
    SUPPLY_GROUP: Images.supply_group_icon_new,
    INVENTORY_ITEM: Images.inventory_kit_sub_tier_icon_new,
    INVENTORY_KIT: Images.inventory_kit_sub_tier_icon,
    DISPOSAL: Images.disposal,
};

class SingleLineItemsView extends Component {
    state = {
        child: [],
        loading: false,
        openDrawer: false,
        // warningVisible: false,
        deleteResource: null,
        resource: [],
        regions: [],
        page: 1,
        pricing: [],
        pricingNew: [],
        // tooltipData: [],
        dataToBeUpdated: null
    };
    columns = [
        {
            title: "Dry Name",
            key: "name",
            sorter: true,
            render: (data) => (
                data.item_type == "FLEET_KIT"?
                <div id={`FLEET_KIT_${data.id}`} className={`d-flex align-items-center ${data?.resource_item.fleet_group.length > 0? "fleet-kit-parent":""}`}>
                    <img alt={" "} className="img-fluid" src={icons[data.item_type]}/>
                    <span className={`ml-2` }>{data.resource_name}</span>
                {/* <span className={`ml-2` }>{data.item_type === "DISPOSAL" ? `${data.resource_item?.disposal_code || ""} ${data.resource_item?.disposal_code ? '-' : ''} ${data.resource_name}` : data?.item_type === "FLEET_KIT_GROUP" ? `${data?.name}`:data.resource_name}</span> */}
                </div>
                :data.item_type == "FLEET_KIT_GROUP"?
                <div data-id={`FLEET_KIT_${data.fleet_id}`} className={`d-flex align-items-center fleet-kit-child`}>
                    <img alt={" "} className="img-fluid" src={icons[data.item_type]}/>
                     <span className={`ml-2` }>{data.name}</span>
                {/* <span className={`ml-2` }>{data.item_type === "DISPOSAL" ? `${data.resource_item?.disposal_code || ""} ${data.resource_item?.disposal_code ? '-' : ''} ${data.resource_name}` : data?.item_type === "FLEET_KIT_GROUP" ? `${data?.name}`:""}</span> */}
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
                    {/* <Dropdown trigger={'click'} overlay={() => this.menu_2(data)}>
                    <a className="ant-dropdown-link"
                       onClick={e => e.preventDefault()}>
                        <img src={Images.eva_more_elisis}
                             className="img-fluid"
                             alt=""/>
                    </a>
                </Dropdown> */}
                </div>
            ),
        },
    ];

    // fetchRegion = (params = {}) => {
    //   this.setState({ fetching: true });
    //   getRegion(params)
    //     .then((res) => {
    //       this.setState({ regions: res.data.results, fetching: false });
    //     })
    //     .catch((err) => {
    //       handleError(err);
    //       this.setState({ fetching: false });
    //     });
    // };

    sortArr = () => {
        const {child} = this.state;
        let ordering = {}, // map for efficient lookup of sortIndex
            sortOrder = [
                "LABOR",
                "FLEET_GROUP",
                "SUPPLY_GROUP",
                "DISPOSAL",
                "INVENTORY_ITEM",
                "INVENTORY_KIT",
            ];
        for (let i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i;

        const sortedArr = child?.resource?.sort(function (a, b) {
            return (
                ordering[a.item_type] - ordering[b.item_type] ||
                a.item_type.localeCompare(b.item_type)
            );
        });
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
        
        this.setState({resource: updateArr});
        
    };

    // menu_2 = (data) => (
    //     <Menu>
    //         <Menu.Item>
    //             <div onClick={() => this.showWarning(true, data)}>
    //                 Delete
    //             </div>
    //         </Menu.Item>
    //     </Menu>
    // );

    removeItem = () => {
        // console.log(data)
        deleteLineItemResource(this.state.deleteResource.id)
            .then((res) => {
                this.getLineItem(this.props.match.params.id);
            })
            .catch((err) => {
                handleError(err);
            });
    };

    componentDidMount() {
        this.getLineItem(this.props.match.params.id);
        this.fetchGroup();
        this.getPricing();
        // this.fetchRegion();
    }

    getLineItem = (id) => {
        this.setState({loading: true});
        getLineItemById(id)
            .then((res) => {
                let arr = [
                    {
                        title: "Services",
                        url: routes.dashboard.management.service.self,
                    },
                    {
                        title: "Services",
                        url: routes.dashboard.management.service.self,
                    },
                    {title: `${res.data.name}`, url: "#"},
                ];
                this.props.setBreadcrumb(arr);
                this.setState({child: res.data}, () => {
                    this.sortArr();
                });
            })
            .catch((err) => {
                handleError(err);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    };

    handleDrawer = (e) => {
        e.stopPropagation();
        this.setState({openDrawer: true});
    };

    onClose = () => {
        this.setState({openDrawer: false});
        this.getLineItem(this.props.match.params.id, true);
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

    getPricing = () => {
        this.setState({loading: true});
        getLineItemPricing({
            item: this.props.match.params.id,
            page: this.state.page,
        })
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
                // console.log( (data[i].hours || 1) * Number(calculatePercentage(vehicleCalculations(data[i].data), item.margin)), 'fleet')
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
        // console.log(newPrice, "dsds")
        return newPrice.toFixed(2);
    };

    hourPrice = (item) => {
        // console.log(item)
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
            //  else if (data[i].item_type == 'INVENTORY_ITEM') {
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

    // showWarning = (warningVisible, deleteResource) => {
    //     this.setState({warningVisible, deleteResource})
    // }


    getBackendPricing = (data) => {
        // , TOOLTIP_DATA
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
            //             // i.children.forEach(l => allLaborChildren.push(l));
            //         }
            //     })
            //     console.log(allLaborChildren, "alllabor")
            //     this.setState({tooltipData: allLaborChildren})
            // }
            // else {
            this.setState({pricingNew: resp.data})
            // }
        }).catch(err => {
            handleError(err)
        })
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
        let {child, resource, regions, pricing, totalCount, loading, page, activeKey, tooltipData} = this.state;
        // if (loading)
        //     return <Spin/>
        return (
            <React.Fragment>
                <div className="row mx-0 create-opportunity-row line-items-row-view pt-3">
                    <div className="col-12 col-sm-12">
                        <Collapse
                            className="vehicle-group-collapse-main min-head-collapse"
                            accordion
                            expandIcon={({isActive}) => (
                                <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                            )}
                            defaultActiveKey={"1"}
                        >
                            <Panel
                                key={"1"}
                                header={
                                    <React.Fragment>
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0 p-0 vehicle-group-heading d-flex align-items-center">
                                                    <img
                                                        src={Images.line_items_group_icons}
                                                        alt={" "}
                                                        className="img-fluid"
                                                    />
                                                    {child.name}
                                                </h5>
                                                <Button
                                                    className="edit-btn-summary"
                                                    onClick={this.handleDrawer}
                                                >
                                                    <img
                                                        src={Images.pencil_green}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div
                                                className="row align-items-center justify-content-between collapse-breadcrumb-main">
                                                <div className="breadcrumb-inner-details">
                                                    <Breadcrumb
                                                        separator={
                                                            <img
                                                                src={Images.arrow_small_breadcrumb}
                                                                alt={""}
                                                                className="img-fluid"
                                                            />
                                                        }
                                                    >
                                                        {child?.breadcrumb?.map((b) => (
                                                            <Breadcrumb.Item>{b}</Breadcrumb.Item>
                                                        ))}
                                                        <Breadcrumb.Item>{child.name}</Breadcrumb.Item>
                                                    </Breadcrumb>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                }
                            >
                                <div className="row mx-0">
                                    <div className="col-12">
                                        <div className="row tree-heading tree-heading-custom">
                                            <div className="col-6">
                                                <span>Resource</span>
                                            </div>
                                            <div className="col-6 text-right">
                                                <span>TYPE</span>
                                            </div>
                                        </div>
                                    </div>
                                    {resource?.length > 0 ?
                                        <>
                                        <div
                                            className="col-12 table-responsive create-dry-table line-items-details-table main-table-div">
                                            <Table
                                                className="main-table-all"
                                                dataSource={resource}
                                                columns={this.columns}
                                                size="middle"
                                                pagination={false}
                                            />
                                        </div>
                                        <div className="col-12 taxable-nontaxable-div">
                                            <h6>TAXABLE OR NONTAXABLE?</h6>
                                            <p>{child.tax ? "Taxable" : "Non-taxable"} </p>
                                        </div>
                                    </>
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
                                </div>
                                <div className="row common-form-card-row px-3 mx-0">
                                    <div className="col-12 p-0">
                                        <div className="row">
                                            <div className="col-12 small-heading-in-form">
                                                <div
                                                    className="row mx-0 w-100 align-items-center justify-content-between">
                                                    <h6>Service Variants</h6>
                                                    <p>
                                                        Total Number of Variants: {totalCount || 0}
                                                    </p>
                                                </div>
                                            </div>
                                            {pricing?.length == 0 ? (
                                                <div className="col-12">
                                                    <div
                                                        style={
                                                            resource?.length === 0
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
                                                                resource?.length === 0
                                                                    ? {
                                                                        pointerEvents: "none",
                                                                    }
                                                                    : {}
                                                            }
                                                            className="col-12 text-center"
                                                        >
                                                            {loading && (page === 1) ?
                                                                <Spin/>
                                                                :
                                                                <>
                                                                    <img
                                                                        src={Images.line_items_empty_state_icon}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                    <h6 className="mb-0 text-gray-tag">No Service Variants</h6>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
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
                                                        defaultActiveKey={
                                                            this.props.location.state?.pricingId
                                                                ? [`${this.props.location.state.pricingId}`]
                                                                : [0]
                                                        }
                                                    >
                                                        {pricing?.map((item, index) => {
                                                            // const foundRegion = regions.find(
                                                            //   (n) => n.id == item.region
                                                            // );
                                                            return (
                                                                <Panel
                                                                    header={
                                                                        <React.Fragment>
                                                                            {/* {  console.log(item.table_data, "child_table_data")} */}
                                                                            <div className="col-12">
                                                                                <div
                                                                                    className="row info-card-heading-row align-items-center justify-content-between">
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
                                                                                    </h5>
                                                                                    <div
                                                                                        className="show-when-collapsed d-flex align-items-center justify-content-between">
                                                                                        <ul className="list-inline mb-0 pricing-estimated-ul d-flex align-items-center">
                                                                                        <li className="list-inline-item">
                                                                                                {`Display Name: ${item?.display_name || "-"}`}
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                <span className="d-flex align-items-center">
                                                  {/*<img alt={""} className="img-fluid mr-1"*/}
                                                    {/*     src={Images.info_small}/>*/}
                                                    Hourly Price:
                                                </span>
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                $
                                                                                                {item.hourly_price || "-"}
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                <span className="d-flex align-items-center">
                                                  {/*<img alt={""} className="img-fluid mr-1"*/}
                                                    {/*     src={Images.info_small}/>*/}
                                                    Daily Price:
                                                </span>
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                $
                                                                                                {item.daily_price || "-"}
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
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    }
                                                                    key={item.id}
                                                                >
                                                                    <React.Fragment>
                                                                        <div className="col-12">
                                                                            <div
                                                                                className="row"
                                                                                style={{overflow: "auto"}}
                                                                            >
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
                                                                                {/*<PricingTableViewLineItems/>*/}
                                                                            </div>
                                                                        </div>
                                                                        <div className="row mx-0">
                                                                            <div
                                                                                className="col-12 show-when-collapse-show footer-data-main footer-data-main-update">
                                                                                <div
                                                                                    className="row table-footer--1-row">
                                                                                    <div className="col-12">
                                                                                        <ul className="list-inline mb-0 pricing-estimated-ul">
                                                                                            <li className="list-inline-item">
                                                                                                Cost:
                                                                                            </li>
                                                                                            <li className="list-inline-item border-0 p-0">
                                                                                                <span>
                                                                                                  {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                                    {/*     src={Images.info_small}/>*/}
                                                                                                    Hourly Cost:
                                                                                                </span>
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                ${item?.hourly_cost?.toLocaleString() || 0.0}
                                                                                            </li>
                                                                                            <li className="list-inline-item border-0 p-0">
                                                                                                {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                                {/*     src={Images.info_small}/>*/}
                                                                                                Daily Cost:
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                ${item?.daily_cost?.toLocaleString()}
                                                                                            </li>
                                                                                            <li className="list-inline-item border-0 p-0">
                                                                                                {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                                {/*     src={Images.info_small}/>*/}
                                                                                                Unit Cost:
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                {item?.unit_cost ? `$${item?.unit_cost?.toLocaleString()}/${item?.cost_uom?.symbol}` : "-"}
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="row table-footer--2-row">
                                                                                    <div className="col-12">
                                                                                        <ul className="list-inline mb-0 pricing-estimated-ul">
                                                                                            <li className="list-inline-item">
                                                                                                Suggested Price:
                                                                                            </li>
                                                                                            <li className="list-inline-item border-0 p-0">
                                                                                                {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                                {/*     src={Images.info_small}/>*/}
                                                                                                Hourly Price:
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                ${item?.suggested_hourly_price?.toLocaleString() || 0.0}
                                                                                            </li>
                                                                                            <li className="list-inline-item border-0 p-0">
                                                                                                {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                                {/*     src={Images.info_small}/>*/}
                                                                                                Daily Price:
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                ${item?.suggested_daily_price?.toLocaleString()}
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="row table-footer--3-row">
                                                                                    <div className="col-12">
                                                                                        <ul className="list-inline mb-0 pricing-estimated-ul">
                                                                                            <li className="list-inline-item">
                                                                                                Price:
                                                                                            </li>
                                                                                            <li className={`list-inline-item border-0 pr-0 position-relative ${item.hourly_percentage == 0 && 'no-percentage'}`}>
                                                                                                {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                                {/*     src={Images.info_small}/>*/}
                                                                                                Hourly Price:
                                                                                                {item.hourly_percentage != 0 &&
                                                                                                    <small>{item.hourly_percentage > 0 ? `${item.hourly_percentage}% markup` : `${Math.abs(item.hourly_percentage)}% markdown`}</small>
                                                                                                }
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                <span
                                                                                                    className="theme-color">${formatPrice(item?.hourly_price) ||  "-"}</span>
                                                                                            </li>
                                                                                            <li className={`list-inline-item border-0 pr-0 position-relative ${item.daily_percentage == 0 && 'no-percentage'}`}>
                                                                                                <span>
                                                                                                  {/*<img alt={""} className="img-fluid mr-1"*/}
                                                                                                    {/*     src={Images.info_small}/>*/}
                                                                                                    Daily Price:
                                                                                                </span>
                                                                                                {item.daily_percentage != 0 &&
                                                                                                    <small>{item.daily_percentage > 0 ? `${item.daily_percentage}% markup` : `${Math.abs(item.daily_percentage)}% markdown`}</small>
                                                                                                }
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                <span
                                                                                                    className="theme-color"> ${formatPrice(item?.daily_price) ||  "-"}</span>
                                                                                            </li>
                                                                                            <li className="list-inline-item border-0 pr-0">
                                                                                                Unit Price:
                                                                                            </li>
                                                                                            <li className="list-inline-item">
                                                                                                <span
                                                                                                    className={'theme-color'}>${item.price || 0.0}{" "}
                                                                                                    {item?.pricing_uom &&
                                                                                                        `/ ${item?.pricing_uom?.symbol}`}</span>
                                                                                            </li>
                                                                                        </ul>
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
                                                                pricing?.length !== totalCount && (
                                                                    <Button onClick={this.handlePagination}>
                                                                        Load More
                                                                    </Button>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* {!child.pricing?.length == 0 &&
                                            <div className="col-12 pb-3">
                                                <span className="small-text-main d-flex align-items-center">
                                                    <img src={Images.info_small} alt={""} className="img-fluid mr-2"/>
                                                    Note: Estimated total price per hour is calculated by Straight time.
                                                </span>
                                            </div>
                                            } */}
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
                {/* {this.state.openDrawer && */}
                <LineItemDrawer
                    visible={this.state.openDrawer}
                    item={this.state.child}
                    onClose={(data) => {
                        this.getBackendPricing(activeKey);
                        if (data) {
                            let newArr = [...this.state.pricing];
                            const Index = newArr.findIndex((i) => i.id === data.id);
                            if (Index != '-1') {
                                newArr[Index] = data;
                                this.setState({pricing: newArr});
                                // console.log(newArr[Index], "on Replacable index")
                            } else {
                                newArr.push(data);
                                this.setState(prevState => {
                                    return {pricing: newArr, totalCount: prevState.totalCount + 1};
                                })
                            }
                            // this.onClose();
                        }
                        this.onClose();
                    }}
                    regions={regions}
                />
                {/* <CommonWarningModal
                    visible={this.state.warningVisible}
                    onClose={()=>this.showWarning(false)}

                    addPricingWarning
                    resourceWarning
                    confirmClose={() => {
                        this.removeItem()
                        this.showWarning(false)
                    }} 
                    heading={'Are you sure you want to exit creating/updating this Service Variant?'}
                    subHeadingUOM={'If you choose to exit, none of the progress you have made will be saved.'}
                /> */}
            </React.Fragment>
        );
    }
}

export default withRouter(
    connect(null, {setBreadcrumb})(SingleLineItemsView)
);
