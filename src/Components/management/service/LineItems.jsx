import React, {Component} from "react";
import CommonTable from "../../common/CommonTable";
import ManagementHeader from "../ManagementHeader";
import {Breadcrumb, Button, Table, Tabs, Tooltip} from "antd";
import {routes} from "../../../Controller/Routes";
import {getLineItem, getLineItemPricing, getServiceFamily,} from "../../../Controller/api/lineItemsServices";
import {handleError} from "../../../Controller/Global";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../Store/actions/breadcrumbAction";
import {history} from "../../../Controller/history";
import {reverse} from "named-urls";
import {Image as Images} from "../../Images";
import {getRegion} from "../../../Controller/api/vehicleServices";
import {
    calculatePercentage,
    debounceEvent,
    FLEET_GROUP,
    formatPrice,
    laborCalculations,
    SUPPLY_GROUP,
    supplyCalculation,
    vehicleCalculations
} from "../../../Controller/utils";

const {TabPane} = Tabs;

class LineItems extends Component {
    state = {
        packages: [],
        pricingSummary: [],
        items: [],
        loading: false,
        currentKey: 1,
        pagination: {
            current: 1,
            pageSize: 15,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        },
        dateFilter: {
            start: "",
            end: "",
            start_modified: "",
            end_modified: ""
        },
        regions: [],
        search: '',
        filterObj: null,
        filterApplied: false,
        breadcrumb:[]
    };
    columns = [
        {
            title: "Service Family Name",
            dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
        },
        {
            title: "Services",
            dataIndex: "parent",
            // sorter: {
            //     compare: (a, b) => a.children?.length - b.children.length
            // },
            sorter: true,
            render: (data) => <div>{data.item_count}</div>,
        },
    ];
    itemsColumns = [
        {
            title: "Service Family",
            key: "service_family",
            sorter: true,
            render: (data) =>
                <div>
                    {data.service_family?.name || "-"}
                    <img
                        src={Images.arrow_small_breadcrumb}
                        alt={""}
                        className="img-fluid pl-1"
                    />
                </div>,
            width: '300px'
        },
        {
            title: "Tiers",
            dataIndex: 'breadcrumb',
            render: data =>
                <div>
                    {
                        data?.filter((i, index) => index != 0)?.map(i => {
                            return (
                                <>
                                    <span>{i}</span>
                                    <img
                                        src={Images.arrow_small_breadcrumb}
                                        alt={""}
                                        className="img-fluid mx-1"
                                    />
                                </>
                            )
                        })}
                </div>,
            sorter: true,
            width: '700px'
        },
        {
            title: "Service Name",
            dataIndex: "name",
            className: "font-weight-bold",
            // sorter: {
            //     compare: (a, b) => a.name?.localeCompare(b.name)
            // },
            sorter: true,
            key: "name",
            width: "300px"
        },
    ];
    itemsColumnsPricingSummary = [
        {
            title: "Service Family",
            render: (data) =>
                <div>
                    {data.family?.name || "-"}
                    <img
                        src={Images.arrow_small_breadcrumb}
                        alt={""}
                        className="img-fluid pl-1"
                    />
                </div>,
            sorter: true,
            width: '250px'
        },
        {
            title: "Tiers",
            dataIndex: 'breadcrumb',
            render: data =>
                <div>
                    {
                        data?.filter((i, index) => index != 0)?.map(i => {
                            return (
                                <>
                                    <span>{i}</span>
                                    <img
                                        src={Images.arrow_small_breadcrumb}
                                        alt={""}
                                        className="img-fluid mx-1"
                                    />
                                </>
                            )
                        })}
                </div>
            ,
            sorter: true,
            width: '300px'
        },
        {
            title: "Service Variant Name",
            // dataIndex: 'name',
            // sorter: {
            //     compare: (a, b) => {
            //         console.log(a, b, "sdfjsdf")
            //         return a.name - b.name
            //     }
            // },
            sorter: true,
            key: "name",
            width: '270px',
            render: (item) => {
                // const foundItem = this.state.regions.find((n) => n.id == item.region);
                return (
                    <div className="font-weight-bold">
            <span className="font-weight-normal">
              {item.line_item?.name || "-"} /
            </span>{" "}
                        {item?.region} - {item.name || ""}
                    </div>
                );
            },
        },
        {
            title: "Labor Groups",
            key: "labor_groups",
            // sorter: true,
            width: '300px',
            dataIndex: "labor_groups",
            render: labor_groups => {
                return (
                    <div>
                        {labor_groups[0] && labor_groups[0] || "-"} {labor_groups.length > 1 && `${labor_groups.length - 1} more`}
                        {labor_groups.length > 1 &&
                            <Tooltip
                                className="labor-group-info labor-group-info-update"
                                placement="top"
                                title={() => this.returnToolTipData(labor_groups)}
                                overlayStyle={{fontSize: 11}}
                                arrowPointAtCenter={true}
                                destroyTooltipOnHide
                            >
                                <img src={Images.info_small} alt=""/>
                            </Tooltip>
                        }
                    </div>
                )
            }
        },
        {
            title: "Hourly Price",
            key: "hourly",
            // dataIndex: "hourly_price",
            // sorter: {
            //     compare: (a, b) => a.hourly_price - b.hourly_price
            // },
            sorter: true,
            // key: "hourly",
            render: (item) =>
                <React.Fragment>{item?.hourly_price && '$'}{formatPrice(item?.hourly_price) || "-"}</React.Fragment>,
        },
        {
            title: "Daily Price",
            key: "daily",
            // dataIndex: "daily_price",
            // sorter: {
            //     compare: (a, b) => a.daily_price - b.daily_price
            // },
            sorter: true,
            // key: "daily",
            render: (item) =>
                <React.Fragment>{item?.daily_price && '$'}{formatPrice(item?.daily_price) || "-"}</React.Fragment>,
            // <React.Fragment>{parseFloat(item?.daily_price).toLocaleString()}</React.Fragment>,
        },
        // },
        {
            title: "Unit Price",
            dataIndex: "price",
            // sorter: {
            //     compare: (a, b) => a.price - b.price
            // },
            sorter: true,
            key: "price",
            render: (item, row) =>
                <React.Fragment>{row?.price && '$'}{item || "-"}{row?.pricing_uom && row?.price && ' / '}{row?.pricing_uom?.symbol}</React.Fragment>,
        },
    ];

    returnToolTipData = (tooltipData) => {
        return (
            <>
                <h4 style={{borderBottom: '1px solid #BDBDBD', color: "#BDBDBD", marginBottom: 5, fontSize: "15px"}}>
                    <img src={Images.teams_labor_no_data_icon} alt=""/> Labor Groups
                </h4>
                <ul style={{paddingLeft: "15px", paddinTop: "5px"}}>
                    {tooltipData.length > 0 ?
                        tooltipData?.map(i => {
                            return <li>{i || "-"}</li>
                        })
                        :
                        <li>-</li>
                    }
                </ul>
            </>
        )
    }

    componentDidMount() {
        let arr = [
            {
                title: "Services",
                url: routes.dashboard.management.service.self,
            },
            {
                title: "Service Families",
                url: routes.dashboard.management.service.self,
            },
        ];
        this.props.setBreadcrumb(arr);
        this.fetchLinePackage();
        // this.fetchLineItem()
        // this.fetchPricingList();
        this.fetchRegion();
    }

    fetchRegion = (params = {}) => {
        this.setState({fetching: true});
        getRegion(params)
            .then((res) => {
                this.setState({regions: res.data.results, fetching: false});
            })
            .catch((err) => {
                handleError(err);
                this.setState({fetching: false});
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

    fetchPricingList = (params = {}) => {
        // const newArr = [];
        // getLineItemPricing().then(res => {
        // for (let item of res.data.results) {
        //   if (item.line_item?.pricing.length) {
        //     for (let price of item.line_item.pricing) {
        //       newArr.push({ ...price, name: item.line_item.name, breadcrumb: item.line_item.breadcrumb });
        //     }
        //   }
        // }
        // this.state.items.map(item => {
        //     for (let i = 0; i < item?.pricing?.length || i === item?.pricing?.length; i++) {
        //         newArr.push(item?.pricing[i])
        //     }
        // });
        // console.log(newArr, "--pricing")
        // const myArr = newArr.drawer(i => i !== undefined);
        // this.setState({pricingSummary: myArr})
        // }).catch(err => {
        //   handleError(err);
        // })
        const {filterObj} = this.state;
        this.setState({loading: true});
        if (!params.ordering) {
            params.ordering = "name";
        }
        getLineItemPricing({...params, ...filterObj, page: (params.page || 1), search: this.state.search})
            .then((res) => {
                this.setState({
                    pricingSummary: res.data.results,
                    pagination: {
                        ...this.state.pagination,
                        current: params.page || 1,
                        total: res.data.count,
                    },
                    loading: false,
                });
            })
            .catch((err) => {
                this.setState({loading: false});
                handleError(err);
            });
    };

    fetchLinePackage = (params = {}) => {
        const {search, dateFilter} = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        getServiceFamily({...params, page: (params.page || 1), search, ...dateFilter})
            .then((res) => {
                this.setState({
                    packages: res.data.results,
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
                this.setState({loading: false});
            });
    };

    fetchLineItem = (params = {}) => {
        const {search, dateFilter} = this.state;
        this.setState({loading: true});
        if (!params.ordering) {
            params.ordering = "name";
        }
        params["tier_type"] = "SERVICE_LINE_ITEM";
        getLineItem({...params, page: (params.page || 1), search, ...dateFilter})
            .then((res) => {
                this.setState({
                    items: res.data.results,
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
                this.setState({loading: false});
            });
    };

    // debounceEvent = (...args) => {
    //   this.debouncedEvent = debounce(...args);
    //   return (e) => {
    //     e.persist();
    //     return this.debouncedEvent(e);
    //   };
    // };

    onFamilySearch = (e) => {
        this.setState({search: e.target.value}, () => {
            this.fetchLinePackage();
        })
    };
    onItemSearch = (e) => {
        this.setState({search: e.target.value}, () => {
            this.fetchLineItem();
        })
    };

    handleTableChange = (pagination, filters, sorter) => {
        let symbol = "";
        if (sorter.order === "descend") symbol = "-";
        let params = {
            page: pagination.current,
        };
        if (sorter.columnKey) {
            params.ordering = `${symbol}${sorter.columnKey}`;
        } else {
            params.ordering = "name";
        }
        // this.fetchLinePackage({ page: pagination.current })
        this.fetchLinePackage(params);
    };

    handleTableItemChange = (pagination, filters, sorter) => {
        let symbol = "";
        if (sorter.order === "descend") symbol = "-";
        let params = {
            page: pagination.current,
        };
        if (sorter.columnKey) {
            params.ordering = `${symbol}${sorter.columnKey}`;
        } else {
            params.ordering = "name";
        }
        this.fetchLineItem(params);
        // this.fetchLineItem({ page: pagination.current })
    };

    handleTablePriceChange = (pagination, filters, sorter) => {
        let symbol = "";
        if (sorter.order === "descend") symbol = "-";
        let params = {
            page: pagination.current,
        };
        if (sorter.columnKey) {
            params.ordering = `${symbol}${sorter.columnKey}`;
        } else {
            params.ordering = "name";
        }
        this.fetchPricingList(params);
        // this.fetchPricingList({ page: pagination.current })
    };

    tabChange = (key) => {
        this.setState({
            currentKey: key, search: "", dateFilter: {
                start: "",
                end: "",
                start_modified: "",
                end_modified: ""
            }
        }, () => {
            switch (key) {
                case "1":
                    let arr = [
                        {
                            title: "Services",
                            url: routes.dashboard.management.service.self,
                        },
                        {
                            title: "Service Families",
                            url: routes.dashboard.management.service.self,
                        },
                    ];
                    this.props.setBreadcrumb(arr);
                    this.fetchLinePackage();
                    return;
                case "2":
                    let arrGroup = [
                        {
                            title: "Services",
                            url: routes.dashboard.management.service.self,
                        },
                        {
                            title: "Services",
                            url: routes.dashboard.management.service.self,
                        },
                    ];
                    this.props.setBreadcrumb(arrGroup);
                    this.fetchLineItem();
                    return;
                case "3":
                    let arrGroup2 = [
                        {
                            title: "Services",
                            url: routes.dashboard.management.service.self,
                        },
                        {
                            title: "Service Variants",
                            url: routes.dashboard.management.service.self,
                        },
                    ];
                    this.props.setBreadcrumb(arrGroup2);
                    this.fetchPricingList();
                    return;
                default:
                    this.setState({
                        pagination: {
                            ...this.state.pagination,
                            current: 1,
                            pageSize: 15,
                        },
                    });
            }
        })
    };

    onPricingSearch = (e) => {
        this.setState({search: e.target.value}, () => {
            this.fetchPricingList();
        })
    };

    getLocaleData = (obj) => {
        return (
            <div className="col-12 no-data-card-row-new-table">
                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                    <div className="col-12 text-center">
                        <img src={
                            obj.key == 1 ? Images.service_family_gray_empty : Images.line_items_gray_small
                        } alt="" className="img-fluid"/>
                        <h6 className="mb-0 no-data-main-tg">{obj.key == 1 ? "No Service Families" : obj.key == 2 ? "No Services" : "No Service Variants"}</h6>
                    </div>
                </div>
            </div>
        )
    }

    handleFilterLinePackage = (data) => {
        if (data) {
            this.setState({dateFilter: {...this.state.dateFilter, ...data}}, () => {
                this.fetchLinePackage();
            })
        } else {
            this.setState({dateFilter: null}, () => {
                this.fetchLinePackage()
            })
        }
    }

    handleFilterLineItem = (data) => {
        if (data) {
            this.setState({dateFilter: {...this.state.dateFilter, ...data}}, () => {
                this.fetchLineItem();
            })
        } else {
            this.setState({dateFilter: null}, () => {
                this.fetchLineItem()
            })
        }
    }

    // setFilterObj = filterObj => {
    //     this.setState({filterObj}, () => {
    //         this.fetchPricingList()
    //     })
    // }

    setFilterObj = (filterObj,breadcrumb) => {
        let counter = true;
        if (filterObj && (filterObj.daily_high || filterObj.daily_low || filterObj.family || filterObj.hourly_high || filterObj.hourly_low
          || filterObj.region || filterObj.service || filterObj.unit || filterObj.tier || filterObj.unit_high || filterObj.unit_low || filterObj.variant)) {
          counter = true
        }
        else {
          counter = false
        }
        this.setState({ filterObj,breadcrumb, page: 1, filterApplied: counter }, () => {
          this.fetchPricingList()
        });
      }

    render() {
        const {packages, pagination, loading, pricingSummary, filterApplied, filterObj} = this.state
        return (
            <div className="main-content-div">
                <Tabs
                    onChange={this.tabChange}
                    className="carpet-cleaning-main-common-tab"
                    defaultActiveKey="1"
                >
                    <TabPane tab="Service Families" key="1">
                        <ManagementHeader
                            buttonLink={routes.dashboard.management.service.family.create}
                            buttonName={"+ Create Service Family"}
                            onSearch={debounceEvent(this.onFamilySearch, 1000)}
                            fetchData={(data) => this.handleFilterLinePackage(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row service-family-table">
                                    <CommonTable
                                        data={packages}
                                        loading={loading}
                                        pagination={pagination}
                                        onTableChange={this.handleTableChange}
                                        rowLink={routes.dashboard.management.service.family.view}
                                        columns={this.columns}
                                        locale={!loading ? {emptyText: this.getLocaleData({key: 1})} : {emptyText: " "}}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Services" key="2">
                        <ManagementHeader
                            buttonLink={routes.dashboard.management.service.family.create}
                            buttonName={"Create Service"}
                            onSearch={debounceEvent(this.onItemSearch, 1000)}
                            fetchData={(data) => this.handleFilterLineItem(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row">
                                    <div
                                        className="col-12 table-responsive main-table-div opportunity-db-table customer-account-table">
                                        <Table
                                            scroll={{y: 450}}
                                            loading={loading}
                                            className="main-table-all"
                                            columns={this.itemsColumns}
                                            dataSource={this.state.items.map(
                                                (i) => delete i.children && i
                                            )}
                                            pagination={pagination}
                                            onChange={this.handleTableItemChange}
                                            size="middle"
                                            rowKey={(record) => record.id}
                                            locale={!loading ? {emptyText: this.getLocaleData({key: 2})} : {emptyText: " "}}
                                            onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: (event) => {
                                                        history.push(
                                                            reverse(
                                                                routes.dashboard.management.service.line_items
                                                                    .view,
                                                                {id: record.id}
                                                            )
                                                        );
                                                    },
                                                };
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Service Variants" key="3">
                        <ManagementHeader
                            setFilterObj={this.setFilterObj}
                            filterApplied={this.state.filterApplied}
                            buttonName={"Create Service"}
                            onSearch={debounceEvent(this.onPricingSearch, 1000)}
                            FILTER_NEW
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                        {filterApplied &&
                            <div className="col-12">
                                <div className="row banner-apply-filter-row">
                                    <div className="col-12">
                                        <ul className="list-inline mb-0">
                                            <li className="list-inline-item">
                                                <Button className="applied-filter">✓ Filter Applied</Button>
                                            </li>
                                            <li className="list-inline-item">
                                                <Button className="clear-btn" onClick={() => this.setFilterObj(null)}>
                                                    <img src={Images.close_small} alt={''} className="img-fluid"/>
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
                        }
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 table-responsive main-table-div opportunity-db-table">
                                        <Table
                                            scroll={{y: 450, x: 1600}}
                                            loading={loading}
                                            className="main-table-all"
                                            columns={this.itemsColumnsPricingSummary}
                                            dataSource={pricingSummary}
                                            pagination={pagination}
                                            size="middle"
                                            onChange={this.handleTablePriceChange}
                                            // rowKey={record => record.id}
                                            locale={!loading ? {emptyText: this.getLocaleData({key: 3})} : {emptyText: " "}}
                                            onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: (event) => {
                                                        history.push(
                                                            reverse(
                                                                routes.dashboard.management.service.line_items
                                                                    .view,
                                                                {id: record?.line_item?.id}
                                                            ),
                                                            {pricingId: record.id}
                                                        );
                                                    },
                                                };
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default connect(null, {
    setBreadcrumb,
})(LineItems);
