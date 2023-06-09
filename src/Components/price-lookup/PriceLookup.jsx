import {Breadcrumb, Button, Table, Tooltip} from "antd";
import React from "react";
import {connect} from "react-redux";
import {getProposalPricingList} from "../../Controller/api/lineItemsServices";
import {handleError} from "../../Controller/Global";
import {setBreadcrumb} from "../../Store/actions/breadcrumbAction";
import ManagementHeader from "../management/ManagementHeader";
import {debounce} from "lodash"
import {Image as Images} from "../Images"
import {formatPrice} from "../../Controller/utils";

class PriceLookup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pricingSummary: [],
            pagination: {
                current: 1,
                pageSize: 20,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            },
            regions: [],
            search: '',
            filterObj: null,
            filterApplied: false,
            breadcrumb: []
        }
    }

    itemsColumnsPricingSummary = [
        {
            title: "Service Family",
            sorter: true,
            render: (data) =>
                <div>{data.family?.name || "-"}
                    <img
                        src={Images.arrow_small_breadcrumb}
                        alt={""}
                        className="img-fluid pl-1"
                    />
                </div>,
            width: '200px'
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
                                        className="img-fluid px-1"
                                    />
                                </>
                            )
                        })}
                </div>,
            sorter: true,
            width: '400px'
        },
        {
            title: "Service Variant Name",
            sorter: true,
            key: "name",
            width: '270px',
            render: (item) => {
                return (
                    <div className="font-weight-bold">
                <span className="font-weight-normal">
                  {item.line_item?.name || "-"} /
                </span>{" "}
                        {item?.region.title} - {item.name || ""}
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
            sorter: true,
            key: "hourly",
            render: (item) =>
                <React.Fragment>{item?.hourly_price && '$'}{`${formatPrice(item?.hourly_price) || "-"}`}</React.Fragment>,
        },
        {
            title: "Daily Price",
            sorter: true,
            key: "daily",
            render: (item) =>
                <React.Fragment>{item?.daily_price && '$'}{`${formatPrice(item?.daily_price) || "-"}`}</React.Fragment>,
        },
        {
            title: "Unit Price",
            dataIndex: "price",
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

    fetchPricingList = (params = {}) => {
        const {filterObj} = this.state;
        this.setState({loading: true});
        if (!params.ordering) {
            params.ordering = "name";
        }
        let arr = [{
            title: "Price Lookup",
            url: '',
        }]
        getProposalPricingList({...params, ...filterObj, page: (params.page || 1), search: this.state.search})
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
                this.props.setBreadcrumb(arr)
            })
            .catch((err) => {
                this.setState({loading: false});
                handleError(err);
            });
    };

    // fetchRegion = (params = {}) => {
    //     this.setState({ fetching: true });
    //     getRegion(params)
    //       .then((res) => {
    //         this.setState({ regions: res.data.results, fetching: false });
    //       })
    //       .catch((err) => {
    //         handleError(err);
    //         this.setState({ fetching: false });
    //       });
    //   };

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

    onPricingSearch = (e) => {
        this.setState({search: e.target.value}, () => {
            this.fetchPricingList();
        })
    };

    componentDidMount() {
        this.fetchPricingList();
        // this.fetchRegion();
    }

    debounceEvent = (...args) => {
        this.debouncedEvent = debounce(...args);
        return (e) => {
            e.persist();
            return this.debouncedEvent(e);
        };
    };

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
        this.setState({ filterObj,breadcrumb,page: 1, filterApplied: counter }, () => {
          this.fetchPricingList()
        });
      }

    render() {
        const {filterApplied, filterObj} = this.state;
        return (
            <div className="main-content-div">
                <ManagementHeader
                    FILTER_NEW
                    setFilterObj={this.setFilterObj}
                    filterApplied={this.state.filterApplied}
                    buttonName={"Create Service"}
                    onSearch={this.debounceEvent(this.onPricingSearch, 1000)}
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
                            {/*pricing-summary-table*/}
                            {/*opportunity-db-table*/}
                            <div className="col-12 table-responsive main-table-div">
                                <Table
                                    scroll={{y: 500, x: 1600}}
                                    loading={this.state.loading}
                                    className="main-table-all"
                                    columns={this.itemsColumnsPricingSummary}
                                    dataSource={this.state.pricingSummary}
                                    locale={!this.state.loading ? {emptyText: ""} : {emptyText: " "}}
                                    pagination={this.state.pagination}
                                    size="middle"
                                    onChange={this.handleTablePriceChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, {setBreadcrumb})(PriceLookup)