import React, {Component} from "react";
import CommonTable from "../../common/CommonTable";
import ManagementHeader from "../ManagementHeader";
import {Breadcrumb, Tabs} from "antd";
import {routes} from "../../../Controller/Routes";
import {handleError} from "../../../Controller/Global";
import {
    getInventoryFamily,
    getInventoryKit,
    getInventoryLineItem,
    getInventoryPackageItem,
} from "../../../Controller/api/inventoryServices";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../Store/actions/breadcrumbAction";
import {Image as Images, Image} from "../../Images";
import {Link} from "react-router-dom";
import {checkInventoryFieldRequired, debounceEvent, getTabValue} from "../../../Controller/utils";
import {getDisposal, getDisposalFamily,} from "../../../Controller/api/disposalServices";

const {TabPane} = Tabs;

class Inventory extends Component {
    state = {
        packages: [
            {
                key: 1,
                name: "",
                parent: "",
            },
            {
                key: 2,
                name: "",
                parent: "",
            },
        ],
        // groups: [],
        inventories: [],
        disInvFamilies: [],
        kits: [],
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
        },
        disposalInventory: [],
    };
    columns = [
        {
            title: "Inventory family Name",
            dataIndex: "name",
            sorter: true,
            key: "name",
            // render: () => <div>Tubing</div>
        },
        {
            title: "Inventory Items",
            dataIndex: "parent",
            render: (data) => <div>{(data && data.children.length) || "0"}</div>,
        },
    ];

    disposalInventoryFamilyColumns = [
        {
            title: "Disposal Inventory Family Name",
            dataIndex: "name",
            sorter: true,
            key: "name",
            // render: () => <div>Outdated Fridge Parts</div>,
        },
        {
            title: "Disposal Items",
            dataIndex: "parent",
            render: (data) => <div>{(data && data.children.length) || "0"}</div>,
            sorter: true,
        },
    ];
    // inventoryGropusColumns = [
    //     {
    //         title: 'Name',
    //         dataIndex: 'name',
    //         sorter: true
    //     },
    //     {
    //         title: 'inventory items',
    //         dataIndex: 'inventory_items',
    //         sorter: true
    //     },
    // ];
    inventoryItemsColumns = [
        {
            title: "Inventory Id",
            dataIndex: "id",
            sorter: true,
            key: "id",
        },
        {
            title: "Inventory Name",
            sorter: true,
            key: "name",
            // render: (data) => <div className="font-weight-bold">{data}</div>,
            render: (data) => {
                return (
                    <div>
                        <p>{data.name}</p>
                        {checkInventoryFieldRequired(data) && (
                            <p className="red-text-disposal">
                                Please complete all required information to avoid issues
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Inventory Family/Tier",
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
                    {item?.breadcrumb?.map((name) => {
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
            title: "Cost",
            render: (data) => (
                <div>
                    ${data?.unit_cost || 0.0}
                    {data?.uom?.symbol && "/"}
                    {data?.uom?.symbol}
                </div>
            ),
        },
        {
            title: "Quantity per Warehouse",
            sorter: false,
            render: (data) => (
                <div className="row">
                    <div className="col-12">
                        <ul className="mb-0 list-inline qty-location-ul">
                            <li>
                                <strong>
                                    {(data?.internal_location &&
                                            data?.internal_location[0] &&
                                            data?.internal_location[0]?.internal_location?.name) ||
                                        "-"}
                                </strong>
                                <span className="font-weight-normal">
                  {(data?.internal_location &&
                          data?.internal_location[0] &&
                          data?.internal_location[0]?.qty) ||
                      "-"}{" "}
                                    {data?.internal_location &&
                                        data?.internal_location[0] &&
                                        data?.internal_location[0]?.qty &&
                                        data?.inventory_uom?.symbol}
                </span>
                            </li>
                            <li>
                                <strong>
                                    {(data?.internal_location &&
                                            data?.internal_location[1] &&
                                            data?.internal_location[1]?.internal_location?.name) ||
                                        "-"}
                                </strong>
                                <span className="font-weight-normal">
                  {(data?.internal_location &&
                          data?.internal_location[1] &&
                          data?.internal_location[1]?.qty) ||
                      "-"}{" "}
                                    {data?.internal_location &&
                                        data?.internal_location[1] &&
                                        data?.internal_location[1]?.qty &&
                                        data?.inventory_uom?.symbol}
                </span>
                            </li>
                            <li>
                                <strong>
                                    {(data?.internal_location &&
                                            data?.internal_location[2] &&
                                            data?.internal_location[2]?.internal_location?.name) ||
                                        "-"}
                                </strong>
                                <span className="font-weight-normal">
                  {(data?.internal_location &&
                          data?.internal_location[2] &&
                          data?.internal_location[2]?.qty) ||
                      "-"}{" "}
                                    {data?.internal_location &&
                                        data?.internal_location[2] &&
                                        data?.internal_location[2]?.qty &&
                                        data?.inventory_uom?.symbol}
                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            ),
        },
    ];
    inventoryKitColumns = [
        {
            title: "Inventory Kit name",
            dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
            render: (data) => <div className="font-weight-bold">{data}</div>,
        },
        {
            title: "Items",
            dataIndex: "items",
            // sorter: {
            //     compare: Sorter.DEFAULT,
            // },
            sorter: true
            // render:()=><div>12</div>
        },
    ];

    disposalInventoryColumns = [
        {
            title: "Disposal ID",
            dataIndex: "id",
            sorter: true,
            key: "id",
            // render: (item) =><div>{item}</div>
        },
        {
            title: "Disposal Name",
            dataIndex: "name",
            sorter: true,
            key: "name",
        },
        {
            title: "Disposal Family / Tier",
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
            title: "Cost",
            sorter: true,
            key: "cost",
            render: (data) => (
                <div>
                    ${data?.unit_cost || 0.0}
                    {data?.uom?.symbol && "/"}
                    {data?.uom?.symbol}
                </div>
            ),
        },
        {
            title: "Quantity per Warehouse",
            sorter: false,
            render: (data) => (
                <div className="row">
                    <div className="col-12">
                        <ul className="mb-0 list-inline qty-location-ul">
                            <li>
                                <strong>
                                    {(data?.internal_location[0] &&
                                            data?.internal_location[0]?.internal_location?.name) ||
                                        "-"}
                                </strong>
                                <span className="font-weight-normal">
                  {(data?.internal_location[0] &&
                          data?.internal_location[0]?.qty) ||
                      "-"}{" "}
                                    {data?.internal_location[0] &&
                                        data?.internal_location[0]?.qty &&
                                        data?.disposal_uom?.symbol}
                </span>
                            </li>
                            <li>
                                <strong>
                                    {(data?.internal_location[1] &&
                                            data?.internal_location[1]?.internal_location?.name) ||
                                        "-"}
                                </strong>
                                <span className="font-weight-normal">
                  {(data?.internal_location[1] &&
                          data?.internal_location[1]?.qty) ||
                      "-"}{" "}
                                    {data?.internal_location[1] &&
                                        data?.internal_location[1]?.qty &&
                                        data?.disposal_uom?.symbol}
                </span>
                            </li>
                            <li>
                                <strong>
                                    {(data?.internal_location[2] &&
                                            data?.internal_location[2]?.internal_location?.name) ||
                                        "-"}
                                </strong>
                                <span className="font-weight-normal">
                  {(data?.internal_location[2] &&
                          data?.internal_location[2]?.qty) ||
                      "-"}{" "}
                                    {data?.internal_location[2] &&
                                        data?.internal_location[2]?.qty &&
                                        data?.disposal_uom?.symbol}
                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            ),
        },
    ];

    componentDidMount() {
        let arr = [
            {
                title: "Inventory",
                url: routes.dashboard.management.inventory.self,
            },
            {
                title: "Inventory Families",
                url: routes.dashboard.management.inventory.self,
            },
        ];
        this.props.setBreadcrumb(arr);
        // this.fetchAllPackages()
        this.tabChange(getTabValue());
    }

    fetchAllPackages = (params = {}) => {
        const { search,dateFilter } = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        getInventoryFamily({...params,page: params.page || 1,search, ...dateFilter})
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

    fetchAllGroups = (params = {}) => {
        const {search} = this.state
        this.setState({loading: true});
        getInventoryPackageItem(params)
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

    fetchAllInventories = (params = {}) => {
        const { search, dateFilter } = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        params["tier_type"] = "INVENTORY_ITEM";
        getInventoryLineItem({...params,page: params.page || 1,search,...dateFilter})
            .then((res) => {
                this.setState({
                    // inventories: res.data.results,
                    inventories: res.data.results
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
    fetchAllInventoryKits = (params = {}) => {
        const { search,dateFilter } = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        getInventoryKit({...params,page: params.page || 1,search,...dateFilter})
            .then((res) => {
                this.setState({
                    kits: res.data.results,
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

    fetchAllDisposalInventories = (params = {}) => {
        const { search,dateFilter } = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        params["tier_type"] = "DISPOSAL";
        params["is_inventory"] = "True";
        getDisposal({...params,page: params.page || 1,search,...dateFilter})
            .then((res) => {
                this.setState({
                    disposalInventory: res.data.results
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
    onKitSearch = (e) => {
        this.setState({search: e.target.value},() => {
        this.fetchAllInventoryKits();
        })
    };
    onItemSearch = (e) => {
        this.setState({search: e.target.value},() => {
        this.fetchAllInventories();
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

    handleTableChangeInventoryGroups = (pagination, filters, sorter) => {
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
    handleTableChangeInventory = (pagination, filters, sorter) => {
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
        this.fetchAllInventories(params);
        // this.fetchAllInventories({ page: pagination.current })
    };
    handleTableChangeInventoryKit = (pagination, filters, sorter) => {
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
        this.fetchAllInventoryKits(params);
        // this.fetchAllInventoryKits({ page: pagination.current })
    };

    handleDisInvTableChange = (pagination, filters, sorter) => {
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
        this.fetchAllDisposalInventories(params);
        // this.fetchAllDisposalInventories({ page: pagination.current })
    };

    handleDisInvFamTableChange = (pagination, filters, sorter) => {
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
        this.fetchAllFamily(params);
        // this.fetchAllPackages({ page: pagination.current })
    };

    tabChange = (key) => {
        this.setState({key,search:"",dateFilter:{
            start:"",
            end:"",
            start_modified:"",
            end_modified:""
        }, pagination: {
            current: 1,
            pageSize: 10,
        },},() => {
        switch (key) {
            case "1":
                let arr = [
                    {
                        title: "Inventory",
                        url: routes.dashboard.management.inventory.self,
                    },
                    {
                        title: "Inventory Families",
                        url: routes.dashboard.management.inventory.self,
                    },
                ];
                this.props.setBreadcrumb(arr);
                this.fetchAllPackages();
                return;
            // case "2":
            // let arrGrp = [{
            //     title: 'Inventory',
            //     url: routes.dashboard.management.inventory.self
            // }, {
            //     title: 'Inventory Groups',
            //     url: routes.dashboard.management.inventory.self
            // }];
            // this.props.setBreadcrumb(arrGrp);
            // // this.fetchAllGroups();
            // return;
            case "2":
                let arrKits = [
                    {
                        title: "Inventory",
                        url: routes.dashboard.management.inventory.self,
                    },
                    {
                        title: "Inventory Items",
                        url: routes.dashboard.management.inventory.self,
                    },
                ];
                this.props.setBreadcrumb(arrKits);
                this.fetchAllInventories();
                return;
            case "3":
                let arrIn = [
                    {
                        title: "Inventory",
                        url: routes.dashboard.management.inventory.self,
                    },
                    {
                        title: "Inventory Kits",
                        url: routes.dashboard.management.inventory.self,
                    },
                ];
                this.props.setBreadcrumb(arrIn);
                this.fetchAllInventoryKits();
                return;
            case "4":
                let arrInFam = [
                    {
                        title: "Inventory",
                        url: routes.dashboard.management.inventory.self,
                    },
                    {
                        title: "Disposal Inventory Families",
                        url: routes.dashboard.management.inventory.self,
                    },
                ];
                this.props.setBreadcrumb(arrInFam);
                this.fetchAllFamily();
                return;
            case "5":
                let arrDisInv = [
                    {
                        title: "Inventory",
                        url: routes.dashboard.management.inventory.self,
                    },
                    {
                        title: "Disposal Inventory",
                        url: routes.dashboard.management.inventory.self,
                    },
                ];
                this.props.setBreadcrumb(arrDisInv);
                this.fetchAllDisposalInventories();
                return;
            default:
        }
    })
        // this.setState({
        //     pagination: {
        //         current: 1,
        //         pageSize: 10,
        //     },
        // });
    };

    fetchAllFamily = (params = {}) => {
        const { search,dateFilter } = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        getDisposalFamily({...params, is_inventory: "True",page: params.page || 1,search,...dateFilter})
            .then((res) => {
                this.setState({
                    disInvFamilies: res.data.results,
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

    onDisInvSearch = (e) => {
        this.setState({search: e.target.value},() => {
        this.fetchAllDisposalInventories();
        })
    };

    onDisInvFamilySearch = (e) => {
        this.setState({search: e.target.value},() => {
        this.fetchAllFamily();
        })
    };


    getLocaleData = (obj) =>{
      return(
          <div className="col-12 no-data-card-row-new-table">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div className="col-12 text-center">
                      <img src={
                          obj.key == 1 || obj.key == 2 ? Images.inventory_empty_gray_icon :
                              obj.key == 3 ? Images.inventory_empty : Images.disposal_empty_icon
                      } alt="" className="img-fluid"/>
                      <h6 className="mb-0 no-data-main-tg">{
                          obj.key == 1 ? "No Inventory Families"
                          :
                          obj.key == 2 ? "No Inventory Items"
                          :
                          obj.key ==3 ? "No Inventory Kits"
                          :
                          obj.key ==4 ? "No Disposal Inventory Families"
                          :
                          "No Disposal Inventory"}</h6>
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

    handleFilterInventories = (data) => {
        if(data) {
            this.setState({ dateFilter: { ...this.state.dateFilter, ...data } }, () => {
              this.fetchAllInventories();
            })
          }
          else {
            this.setState({ dateFilter: null}, () => {
              this.fetchAllInventories()
            })
        }
    }

    handleFilterInventoryKits = (data) => {
        if(data) {
            this.setState({ dateFilter: { ...this.state.dateFilter, ...data } }, () => {
              this.fetchAllInventoryKits();
            })
          }
          else {
            this.setState({ dateFilter: null}, () => {
              this.fetchAllInventoryKits()
            })
        }
    }

    handleFilterFamily = (data) => {
        if(data) {
            this.setState({ dateFilter: { ...this.state.dateFilter, ...data } }, () => {
              this.fetchAllFamily();
            })
          }
          else {
            this.setState({ dateFilter: null}, () => {
              this.fetchAllFamily()
            })
        }
    }

    handleFilterDisposalInventories = (data) => {
        if(data) {
            this.setState({ dateFilter: { ...this.state.dateFilter, ...data } }, () => {
              this.fetchAllDisposalInventories();
            })
          }
          else {
            this.setState({ dateFilter: null}, () => {
              this.fetchAllDisposalInventories()
            })
        }
    }

    render() {
        const {packages,loading,pagination, inventories, kits, disInvFamilies, disposalInventory} = this.state;
        return (
            <div className="main-content-div">
                <Tabs
                    onChange={this.tabChange}
                    className="carpet-cleaning-main-common-tab"
                    activeKey={this.state.key}
                >
                    <TabPane tab="Inventory Families" key="1">
                        <ManagementHeader
                            buttonLink={
                                routes.dashboard.management.inventory.inventory_packages.create
                            }
                            buttonName={"+ Create Inventory Family"}
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
                                            routes.dashboard.management.inventory.inventory_packages
                                                .view
                                        }
                                        columns={this.columns}
                                        locale={!loading ? {emptyText:this.getLocaleData({key:1})} : " "}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    {/*<TabPane tab="Inventory Groups" key="2">*/}
                    {/*    <ManagementHeader buttonLink={routes.dashboard.management.inventory.inventory_groups.create}*/}
                    {/*        buttonName={'Create Inventory Group'} onSearch={this.onGroupSearch} />*/}
                    {/*    <div className="row mx-0 opportunities-table-main-dashboard">*/}
                    {/*        <div className="col-12">*/}
                    {/*            <div className="row">*/}
                    {/*                <CommonTable data={this.state.groups}*/}
                    {/*                    loading={this.state.loading}*/}
                    {/*                    pagination={this.state.pagination}*/}
                    {/*                    onTableChange={this.handleTableChangeInventoryGroups}*/}
                    {/*                    rowLink={routes.dashboard.management.inventory.inventory_groups.view}*/}
                    {/*                    columns={this.inventoryGropusColumns} />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</TabPane>*/}
                    <TabPane tab="Inventory Items" key="2">
                        <ManagementHeader
                            buttonLink={
                                routes.dashboard.management.inventory.inventory_items.create
                            }
                            buttonName={"+ Create Inventory Item"}
                            onSearch={debounceEvent(this.onItemSearch, 1000)}
                            fetchData={(data) => this.handleFilterInventories(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row vehicle-table-text-center width-160-id">
                                    <CommonTable
                                        checkInventoryRequired
                                        data={inventories}
                                        loading={loading}
                                        pagination={pagination}
                                        onTableChange={this.handleTableChangeInventory}
                                        rowLink={
                                            routes.dashboard.management.inventory.inventory_items.view
                                        }
                                        columns={this.inventoryItemsColumns}
                                        locale={!loading ? {emptyText:this.getLocaleData({key:2})} : {emptyText: " "}}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Inventory Kits" key="3">
                        <ManagementHeader
                            buttonLink={
                                routes.dashboard.management.inventory.inventory_kits.create
                            }
                            buttonName={"+ Create Inventory Kit"}
                            onSearch={debounceEvent(this.onKitSearch, 1000)}
                            fetchData={(data) => this. handleFilterInventoryKits(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row service-family-table">
                                    <CommonTable
                                        data={kits}
                                        loading={loading}
                                        pagination={pagination}
                                        onTableChange={this.handleTableChangeInventoryKit}
                                        rowLink={
                                            routes.dashboard.management.inventory.inventory_kits.view
                                        }
                                        columns={this.inventoryKitColumns}
                                        locale={!loading ? {emptyText:this.getLocaleData({key:3})} : {emptyText: " "}}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Disposal Inventory Family" key="4">
                        <ManagementHeader
                            // buttonLink={routes.dashboard.management.inventory.inventory_kits.create}
                            buttonName={"Create Service"}
                            onSearch={debounceEvent(this.onDisInvFamilySearch, 1000)}
                            fetchData={(data) => this.handleFilterFamily(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row service-family-table">
                                    <CommonTable
                                        data={disInvFamilies}
                                        loading={loading}
                                        pagination={pagination}
                                        onTableChange={this.handleDisInvFamTableChange}
                                        rowLink={
                                            routes.dashboard.management.disposal_inventory.family.view
                                        }
                                        columns={this.disposalInventoryFamilyColumns}
                                        rowClassName={this.checkRequiredAddClass}
                                        locale={!loading ? {emptyText:this.getLocaleData({key:4})} : {emptyText: " "}}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Disposal Inventory" key="5">
                        <ManagementHeader
                            buttonName={"Create Disposal Inventory"}
                            onSearch={debounceEvent(this.onDisInvSearch, 1000)}
                            fetchData={(data) => this.handleFilterDisposalInventories(data)}
                        />
                        <div className="row mx-0 opportunities-table-main-dashboard">
                            <div className="col-12">
                                <div className="row service-family-table">
                                    <CommonTable
                                        data={disposalInventory}
                                        loading={loading}
                                        pagination={pagination}
                                        onTableChange={this.handleDisInvTableChange}
                                        rowLink={
                                            routes.dashboard.management.disposal_inventory.view
                                        }
                                        columns={this.disposalInventoryColumns}
                                        locale={!loading ? {emptyText:this.getLocaleData({key:5})} : {emptyText: " "}}
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

export default connect(null, {setBreadcrumb})(Inventory);
