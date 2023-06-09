import React, {Component} from "react";
import CommonTable from "../../common/CommonTable";
import ManagementHeader from "../ManagementHeader";
import {Breadcrumb, Tabs} from "antd";
import {routes} from "../../../Controller/Routes";
import {handleError} from "../../../Controller/Global";
import {getSupply, getSupplyFamily, getSupplyGroup,} from "../../../Controller/api/supplyServices";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../Store/actions/breadcrumbAction";
import {
    checkSupplyFieldRequired,
    debounceEvent,
    formatMoney,
    getTabValue,
    SUPPLY_GROUP
} from "../../../Controller/utils";
import {Link} from "react-router-dom";
import {Image as Images, Image} from "../../Images";

const {TabPane} = Tabs;

class SupplyTools extends Component {
    state = {
        packages: [],
        groups: [],
        supplies: [],
        key: "1",
        loading: false,
        pagination: {
            current: 1,
            pageSize: 15,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        },
        dateFilter : {
            start:"",
            end:"",
            start_modified:"",
            end_modified: ""
        }
    };

    supplyGroupColumns = [
        {
            title: "Supply Group Name",
            // dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
            render: (data) => {
                return (
                    <div>
                        <p>{data.name}</p>
                        {checkSupplyFieldRequired(data) && (
                            <p className="red-text-disposal">
                                Please complete all required information to avoid issues
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Supply Family",
            render: (item) => (
                <Breadcrumb
                    separator={
                        <img
                            src={Image.arrow_small_breadcrumb}
                            alt={""}
                            className="img-fluid"
                        />
                    }
                >
                    {item.breadcrumb.map((name) => {
                        return (
                            <Breadcrumb.Item key={name}>
                                <Link>{name}</Link>
                            </Breadcrumb.Item>
                        );
                    })}
                    <Breadcrumb.Item key={item.name}>
                        <Link>{item.name}</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
            ),
        },
        {
            title: "Supplies / Small TOols",
            dataIndex: "supply_items",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // }
            // sorter: true,
        },
    ];
    columns = [
        {
            title: "Supply Family Name",
            dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
        },
        {
            title: "Supply Groups",
            dataIndex: "group_count",
            // render: (data) => <div>{(data && data.children.length) || "0"}</div>,
            // sorter: {
            //     compare: (a, b) => a.children?.length - b.children?.length
            // },
            // sorter: true,
        },
    ];
    // ];
    supplySmallToolsColumns = [
        {
            title: "Supply ID",
            dataIndex: "id",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "id",
        },
        {
            title: "Supply Name",
            dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
        },
        {
            title: "WAREHOUSE",
            dataIndex: "internal_location",
            sorter: true,
            render: (data) => <div>{data ? data.name : "-"}</div>

        },
        {
            title: "Supply Group",
            dataIndex: "supply_group",
            render: (data) => data.name || "-",
        },
        {
            title: "Total Cost / Day",
            dataIndex: "purchase_price",
            render: (data) => (
                <div className="text-center">{formatMoney(data || "0")}</div>
            ),
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "purchase_price",
        },
    ];

    componentDidMount() {
        let arr = [
            {
                title: "Supplies/Small Tools",
                url: routes.dashboard.management.supply_tools.self,
            },
            {
                title: "Supply Families",
                url: routes.dashboard.management.supply_tools.self,
            },
        ];
        this.props.setBreadcrumb(arr);
        this.fetchAllPackages();
        this.tabChange(getTabValue());
    }

    fetchAllPackages = (params = {}) => {
        const { search, dateFilter } = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        getSupplyFamily({...params,page: params.page || 1,search,...dateFilter})
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

    // debounceEvent = (...args) => {
    //   this.debouncedEvent = debounce(...args);
    //   return (e) => {
    //     return this.debouncedEvent(e);
    //   };
    // };

    fetchAllGroups = (params = {}) => {
        const { search,dateFilter} = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        params["tier_type"] = SUPPLY_GROUP;
        getSupplyGroup({...params,page: params.page || 1,search,...dateFilter})
            .then((res) => {
                this.setState({
                    groups: res.data.results
                        .filter((p) => p.children.length === 0)
                        .map((d) => delete d.children && d),
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

    fetchAllSupplies = (params = {}) => {
        const { search, dateFilter} = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        getSupply({...params,page: params.page || 1,search,...dateFilter})
            .then((res) => {
                this.setState({
                    vehicles: res.data.results,
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

    onSearch = (e) => {
        this.setState({search: e.target.value},() => {
            this.fetchAllPackages();
        })
        
    };

    onGroupSearch = (e) => {
        this.setState({search: e.target.value},() => {
        this.fetchAllGroups();
        })
    };

    onSupplySearch = (e) => {
        this.setState({search: e.target.value},() => {
        this.fetchAllSupplies();
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
        this.fetchAllPackages(params);
        // this.fetchAllPackages({ page: pagination.current })
    };

    handleTableChangeSupplyGroups = (pagination, filters, sorter) => {
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
        this.fetchAllGroups(params);
        // this.fetchAllGroups({ page: pagination.current })
    };

    handleTableChangeSupply = (pagination, filters, sorter) => {
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
        this.fetchAllSupplies(params);
        // this.fetchAllSupplies({ page: pagination.current })
    };
    // supplyGroupColumns = [
    //     {
    //         title: 'Supply Group Name',
    //         dataIndex: 'name',
    //         sorter: true
    //     },
    //     {
    //         title: 'Supply Family',
    //         render: (item) =>
    //             <Breadcrumb separator={
    //                 <img src={Image.arrow_small_breadcrumb} alt={""}
    //                     className="img-fluid" />
    //             }>
    //                 {item.breadcrumb.map(name => {
    //                     return <Breadcrumb.Item key={name}>
    //                         <Link>{name}</Link>
    //                     </Breadcrumb.Item>
    //                 })}
    //                 <Breadcrumb.Item key={item.name}>
    //                     <Link>{item.name}</Link>
    //                 </Breadcrumb.Item>
    //             </Breadcrumb>,
    //         sorter: true
    //     },
    //     {
    //         title: 'Supplies / Small TOols',
    //         dataIndex: 'supply_items',
    //         sorter: true
    //     },

    tabChange = (key) => {
        this.setState({key,search:"",dateFilter:{
            start:"",
            end:"",
            start_modified:"",
            end_modified:""
        },pagination: {
            current: 1,
            pageSize: 15,
        },},() => {
        switch (key) {
            case "1":
                let arr = [
                    {
                        title: "Supplies/Small Tools",
                        url: routes.dashboard.management.supply_tools.self,
                    },
                    {
                        title: "Supply Families",
                        url: routes.dashboard.management.supply_tools.self,
                    },
                ];
                this.props.setBreadcrumb(arr);
                this.fetchAllPackages();
                return;
            case "2":
                let arrGrp = [
                    {
                        title: "Supplies/Small Tools",
                        url: routes.dashboard.management.supply_tools.self,
                    },
                    {
                        title: "Supply Groups",
                        url: routes.dashboard.management.supply_tools.self,
                    },
                ];
                this.props.setBreadcrumb(arrGrp);
                this.fetchAllGroups();
                return;
            case "3":
                let arrSupply = [
                    {
                        title: "Supplies/Small Tools",
                        url: routes.dashboard.management.supply_tools.self,
                    },
                    {
                        title: "Supply/Small Tools",
                        url: routes.dashboard.management.supply_tools.self,
                    },
                ];
                this.props.setBreadcrumb(arrSupply);
                this.fetchAllSupplies();
                return;
            default:
        }
    })
        // this.setState({
        //     pagination: {
        //         current: 1,
        //         pageSize: 15,
        //     },
        // });
    };

    getLocaleData = (obj) =>{
      return(
          <div className="col-12 no-data-card-row-new-table">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div className="col-12 text-center">
                      <img src={Images.supply_icon_gray_small} alt="" className="img-fluid"/>
                      <h6 className="mb-0 no-data-main-tg">{obj.key == 1 ? "No Supply Families" : obj.key == 2 ? "No Supply Groups" : "No Supplies/Small Tools"}</h6>
                  </div>
              </div>
          </div>
      )
    }

    handleFilterPackage = (data) => {
        if(data) {
            this.setState({ dateFilter: { ...this.state.dateFilter, ...data } }, () => {
              this.fetchAllPackages();
            })
          }
          else {
            this.setState({ dateFilter: null}, () => {
              this.fetchAllPackages()
            })
        }
    }

    handleFilterGroup = (data) => {
        if(data) {
            this.setState({ dateFilter: { ...this.state.dateFilter, ...data } }, () => {
              this.fetchAllGroups();
            })
          }
          else {
            this.setState({ dateFilter: null}, () => {
              this.fetchAllGroups()
            })
        }
    }

    handleFilterSupply = (data) => {
        if(data) {
            this.setState({ dateFilter: { ...this.state.dateFilter, ...data } }, () => {
              this.fetchAllSupplies();
            })
          }
          else {
            this.setState({ dateFilter: null}, () => {
              this.fetchAllSupplies()
            })
        }
    }

    render() {
        const {packages, loading, pagination, groups, vehicles} = this.state
        return (
            <div className="main-content-div">
                <Tabs
                    onChange={this.tabChange}
                    className="carpet-cleaning-main-common-tab"
                    activeKey={this.state.key}
                >
                    <TabPane tab="Supply Families" key="1">
                        <ManagementHeader
                            buttonLink={
                                routes.dashboard.management.supply_tools.supply_packages.create
                            }
                            buttonName={"+ Create Supply Family"}
                            onSearch={debounceEvent(this.onSearch, 1000)}
                            fetchData={(data) => this.handleFilterPackage(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row service-family-table">
                                    <CommonTable
                                        data={packages}
                                        loading={loading}
                                        pagination={pagination}
                                        onTableChange={this.handleTableChange}
                                        rowLink={
                                            routes.dashboard.management.supply_tools.supply_packages
                                                .view
                                        }
                                        columns={this.columns}
                                        locale={!loading ? {emptyText: this.getLocaleData({key:1})} : {emptyText: " "}}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>

                    <TabPane tab="Supply Groups" key="2">
                        <ManagementHeader
                            buttonLink={
                                routes.dashboard.management.supply_tools.supply_groups.create
                            }
                            buttonName={"+ Create Supply Group"}
                            onSearch={debounceEvent(this.onGroupSearch, 1000)}
                            fetchData={(data) => this. handleFilterGroup(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row vehicle-3-center">
                                    <CommonTable
                                        checkSupplyRequired
                                        data={groups}
                                        loading={loading}
                                        pagination={pagination}
                                        onTableChange={this.handleTableChangeSupplyGroups}
                                        columns={this.supplyGroupColumns}
                                        rowLink={
                                            routes.dashboard.management.supply_tools.supply_groups
                                                .view
                                        }
                                        locale={!loading ? {emptyText: this.getLocaleData({key:2})} : {emptyText: " "}}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Supplies/Small Tools" key="3">
                        <ManagementHeader
                            buttonLink={
                                routes.dashboard.management.supply_tools.supply_tools.create
                            }
                            buttonName={"+ Create Supply/Small Tools"}
                            onSearch={debounceEvent(this.onSupplySearch, 1000)}
                            fetchData={(data) => this.handleFilterSupply(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row vehicle-3-center vehicle-table-text-center width-160-id">
                                    <CommonTable
                                        data={vehicles}
                                        loading={loading}
                                        pagination={pagination}
                                        onTableChange={this.handleTableChangeSupply}
                                        rowLink={
                                            routes.dashboard.management.supply_tools.supply_tools.view
                                        }
                                        columns={this.supplySmallToolsColumns}
                                        locale={!loading ? {emptyText: this.getLocaleData({key:3})} : {emptyText: " "}}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default connect(null, {setBreadcrumb})(SupplyTools);
