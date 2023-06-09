import React, {Component} from "react";
import {Breadcrumb, Tabs} from "antd";
import ManagementHeader from "../ManagementHeader";
import CommonTable from "../../common/CommonTable";
import {routes} from "../../../Controller/Routes";
import {handleError} from "../../../Controller/Global";
import {getFleetFamilyPackages, getFleetGroup, getFleetKit, getVehicle,} from "../../../Controller/api/vehicleServices";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../Store/actions/breadcrumbAction";
import {checkFleetFieldsRequired, debounceEvent, FLEET_GROUP, getTabValue} from "../../../Controller/utils";
import {Link} from "react-router-dom";
import {Image as Images, Image} from "../../Images";
import moment from "moment";

const {TabPane} = Tabs;

class Vehicles extends Component {
    columns = [
        {
            title: "Fleet Family Name",
            dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
        },
        {
            title: "Fleet Groups",
            dataIndex: "childCount",
            // sorter: {
            //     compare: (a,b) => a.children?.length - b.children?.length
            // },
            sorter: true,
        },
        {
            title: "Last Activity Date",
            dataIndex: "modified",
            render: (data) => (
                <div>{moment(data).format("MMM DD, YYYY hh:mm A")}</div>
            ),
            // sorter: {
            //     compare: Sorter.DATE
            // },
            sorter: true,
            key: "modified",
        },
    ];
    fleetColumns = [
        {
            title: "Fleet Kit Name",
            dataIndex: "name",
            sorter: true
        },
        {
            title: "Fleet Groups",
            dataIndex: "group_count",
            sorter: true
        }
    ]
    vehicleColumns = [
        {
            title: "Vehicle Id",
            dataIndex: "id",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "id",
        },
        {
            title: "Vehicle Name",
            dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
        },
        {
            title: "Make",
            dataIndex: "make",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "make",
        },
        {
            title: "Model",
            dataIndex: "model",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "model",
        },
        {
            title: "Year",
            dataIndex: "year",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "year",
        },
        {
            title: "Vin/Sin",
            dataIndex: "vin_sin",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "vin_sin",
        },
        {
            title: "WAREHOUSE",
            dataIndex: "internal_location",
            sorter: true,
            render: (data) => <div>{data ? data.name : "-"}</div>

        },
        {
            title: "Status",
            dataIndex: "status",
            // sorter: {
            //     compare : Sorter.DEFAULT
            // },
            sorter: true,
            key: "status",
            render: (data) => (
                <span style={data === "INACTIVE" ? {color: "red"} : null}>
          {data === "INACTIVE" ? "Inactive" : "Active"}
        </span>
            ),
        },
        {
            title: "Vehicle Group",
            dataIndex: "fleet_group",
            render: (data) => data?.name || "-",
        },
    ];

    vehicleGroupColumns = [
        {
            title: "Fleet Group Name",
            // dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
            render: data => {
                return (
                    <div>
                        <p>{data.name}</p>
                        {checkFleetFieldsRequired(data) && (
                            <p className="red-text-disposal">
                                Please complete all required information to avoid issues
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Fleet Family",
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
            title: "Vehicles",
            dataIndex: "vehicle",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
        },
    ];

    state = {
        packages: [],
        groups: [],
        vehicles: [],
        fleetKit: [],
        key: "1",
        loading: false,
        pagination: {
            current: 1,
            pageSize: 15,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        },
        lengthValue: 0,
        datePackage:{
            start: "",
            end: "",
            start_modified: "",
            end_modified: ""
        },
    };
    createVehicle = () => {
        console.log("clicked");
    };

    componentDidMount() {
        let arr = [
            {
                title: "Fleet",
                url: routes.dashboard.management.fleet.self,
            },
            {
                title: "Fleet Families",
                url: routes.dashboard.management.fleet.self,
            },
        ];
        this.props.setBreadcrumb(arr);
        this.tabChange(getTabValue());
    }

    getChildren = (children, newArr) => {
        children.forEach((child) => {
            this.getAllSiblings(child, newArr);
        });
    };
    getAllSiblings = (children, newArr) => {
        newArr.push({id: children.id, tier_type: children.tier_type});
        this.getChildren(children.children, newArr);
        if (children.children.length > 1) {

        }
    };

    fetchAllPackages = (params = {}) => {
        const { search,datePackage } = this.state;
        if (!params.ordering) {
            params.ordering = "-modified";
        }
        this.setState({loading: true});
        getFleetFamilyPackages({...params,page: params.page || 1,search,...datePackage})
            .then((res) => {
                let familyPackage = res.data.results.map((i, index) => {
                    let newArr = [];
                    this.getChildren(i.parent.children, newArr);
                    let childCount = newArr.filter(
                        (i) => i.tier_type === FLEET_GROUP
                    ).length;
                    return {...i, childCount};
                });
                this.setState({
                    packages: familyPackage,
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

    fetchAllGroups = (params = {}) => {
        const { search,datePackage } = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        params["tier_type"] = "FLEET_GROUP";
        getFleetGroup({...params,page: params.page || 1,search,...datePackage})
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

    fetchAllVehicles = (params = {}) => {
        const { search, datePackage } = this.state
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        getVehicle({...params,page: params.page || 1,search,...datePackage})
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

    fetchAllFleetKit = (params={}) => {
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true})
        getFleetKit({...params,page: params.page || 1}).then((res) => {
            this.setState({fleetKit:res.data.results,
            pagination: {
                ...this.state.pagination,
                current: params.page || 1,
                total: res.data.count,
            },
            loading: false,
        })
        })
        .catch((err) => {
            handleError(err);
            this.setState({loading: false});
        });

    }

    // debounceEvent = (...args) => {
    //   this.debouncedEvent = debounce(...args);
    //   return (e) => {
    //     return this.debouncedEvent(e);
    //   };
    // };

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
    onVehicleSearch = (e) => {
        this.setState({search: e.target.value},() => {
        this.fetchAllVehicles();
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
            params.ordering = "-modified";
        }
        this.fetchAllPackages(params);
        // this.fetchAllPackages({page: pagination.current})
    };

    handleTableChangeVehicleGroups = (pagination, filters, sorter) => {
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
        // this.fetchAllGroups({page: pagination.current})
    };
    handleTableChangeVehicle = (pagination, filters, sorter) => {
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
        this.fetchAllVehicles(params);
        // this.fetchAllVehicles({page: pagination.current})
    };
    handleTableFleetKit = (pagination, filters, sorter) => {
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
        this.fetchAllFleetKit(params);
        this.fetchAllFleetKit({page: pagination.current})
    };

    tabChange = (key) => {
        this.setState({key,search:"",datePackage:{start: "",end:"",
    start_modified:"",end_modified:""}, pagination: {
        current: 1,
        pageSize: 15,
        showSizeChanger: false,

    },},() => {
        switch (key) {
            case "1":
                let arr = [
                    {
                        title: "Fleet",
                    },
                    {
                        title: "Fleet Families",
                    },
                ];
                this.props.setBreadcrumb(arr);
                this.fetchAllPackages();
                return;
            case "2":
                let arrGroup = [
                    {
                        title: "Fleet",
                        url: routes.dashboard.management.fleet.self,
                    },
                    {
                        title: "Fleet Groups",
                        url: routes.dashboard.management.fleet.self,
                    },
                ];
                this.props.setBreadcrumb(arrGroup);
                this.fetchAllGroups();
                return;
            case "3":
                let arrVehicle = [
                    {
                        title: "Fleet",
                        url: routes.dashboard.management.fleet.self,
                    },
                    {
                        title: "Vehicles",
                        url: routes.dashboard.management.fleet.self,
                    },
                ];
                this.props.setBreadcrumb(arrVehicle);
                this.fetchAllVehicles();
                return;
                case "4":
                    let arrFleet = [
                        {
                            title: "Fleet",
                            url: routes.dashboard.management.fleet.self,
                        },
                        {
                            title: "Fleet Kits",
                            url: routes.dashboard.management.fleet.self,
                        },
                    ];
                    this.props.setBreadcrumb(arrFleet);
                    this.fetchAllFleetKit();
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
                      <img src={Images.truck_empty} alt="" className="img-fluid"/>
                      <h6 className="mb-0 no-data-main-tg">{obj.key == 1 ? "No Fleet Families" : obj.key == 2 ? "No Fleet Groups" : obj.key == 3 ? "No Vehicles" : "No Fleet Kits"}</h6>
                  </div>
              </div>
          </div>
      )
    }
    handleFilterPackage = (data) => {
        if(data) {
            this.setState({ datePackage: { ...this.state.datePackage, ...data } }, () => {
              this.fetchAllPackages();
            })
          }
          else {
            this.setState({ datePackage: null}, () => {
              this.fetchAllPackages()
            })
        }
    }
    handleFilterGroup = (data) => {
        if(data) {
            this.setState({ datePackage: { ...this.state.datePackage, ...data } }, () => {
              this.fetchAllGroups();
            })
          }
          else {
            this.setState({ datePackage: null}, () => {
              this.fetchAllGroups()
            })
        }
    }
    handleFilterVehicle = (data) => {
        if(data) {
            this.setState({ datePackage: { ...this.state.datePackage, ...data } }, () => {
              this.fetchAllVehicles();
            })
          }
          else {
            this.setState({ datePackage: null}, () => {
              this.fetchAllVehicles()
            })
        }
    }
    render() {
        const {packages, loading, pagination, groups, vehicles, fleetKit} = this.state;
        return (
            <React.Fragment>
                <div className="main-content-div">
                    <Tabs
                        onChange={this.tabChange}
                        className="carpet-cleaning-main-common-tab"
                        activeKey={this.state.key}
                    >
                        <TabPane tab="Fleet Families" key="1">
                            <ManagementHeader
                                createButtonAction={() => this.createVehicle()}
                                buttonLink={
                                    routes.dashboard.management.fleet.fleet_family.create
                                }
                                buttonName={"+ Create Fleet Family"}
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
                                                routes.dashboard.management.fleet.fleet_family.view
                                            }
                                            columns={this.columns}
                                            locale={!loading ? {emptyText:this.getLocaleData({key:1})} : {emptyText: " "}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Fleet Groups" key="2">
                            <ManagementHeader
                                buttonLink={routes.dashboard.management.fleet.groups.create}
                                buttonName={"+ Create Fleet Group"}
                                onSearch={debounceEvent(this.onGroupSearch, 1000)}
                                fetchData={(data) => this.handleFilterGroup(data)}
                            />
                            <div className="row mx-0 opportunities-table-main-dashboard">
                                <div className="col-12">
                                    <div className="row vehicle-3-center">
                                        <CommonTable
                                            checkFleetRequired
                                            data={groups}
                                            loading={loading}
                                            pagination={pagination}
                                            onTableChange={this.handleTableChangeVehicleGroups}
                                            rowLink={routes.dashboard.management.fleet.groups.view}
                                            columns={this.vehicleGroupColumns}
                                            locale={!loading ? {emptyText:this.getLocaleData({key:2})} : {emptyText: " "}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab="Vehicles" key="3">
                            <ManagementHeader
                                buttonLink={routes.dashboard.management.fleet.vehicle.create}
                                buttonName={"+ Create Vehicle"}
                                onSearch={debounceEvent(this.onVehicleSearch, 1000)}
                                fetchData={(data) => this.handleFilterVehicle(data)}
                            />
                            <div className="row mx-0 opportunities-table-main-dashboard">
                                <div className="col-12">
                                    <div className="row vehicle-table-text-center width-160-id">
                                        <CommonTable
                                            data={vehicles}
                                            loading={loading}
                                            pagination={pagination}
                                            onTableChange={this.handleTableChangeVehicle}
                                            rowLink={routes.dashboard.management.fleet.vehicle.view}
                                            columns={this.vehicleColumns}
                                            locale={!loading ? {emptyText:this.getLocaleData({key:3})} : " "}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Fleet Kits" key="4">
                            <ManagementHeader
                                buttonLink={routes.dashboard.management.fleet.kit.create}
                                buttonName={"+ Create Fleet Kit"}
                                // onSearch={debounceEvent(this.onVehicleSearch, 1000)}
                                // fetchData={(data) => this.handleFilterVehicle(data)}
                            />
                            <div className="row mx-0 opportunities-table-main-dashboard">
                                <div className="col-12">
                                    <div className="row vehicle-table-text-center width-160-id">
                                        <CommonTable
                                            data={fleetKit}
                                            loading={loading}
                                            pagination={pagination}
                                            onTableChange={this.handleTableFleetKit}
                                            rowLink={routes.dashboard.management.fleet.kit.view}
                                            columns={this.fleetColumns}
                                            locale={!loading ? {emptyText:this.getLocaleData({key:4})} : " "}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(Vehicles);
