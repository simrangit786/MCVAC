import React, {Component} from "react";
import {Breadcrumb, Tabs} from "antd";
import {routes} from "../../../Controller/Routes";
import ManagementHeader from "../ManagementHeader";
import CommonTable from "../../common/CommonTable";
import {Image as Images, Image} from "../../Images";
import {Link} from "react-router-dom";
import {handleError} from "../../../Controller/Global";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../Store/actions/breadcrumbAction";
import {checkDisposalFieldsRequired, debounceEvent, DISPOSAL, getTabValue} from "../../../Controller/utils";

import {getDisposal, getDisposalFamily,} from "../../../Controller/api/disposalServices";

const {TabPane} = Tabs;

function callback(key) {
    // console.log(key);
}

class Disposal extends Component {
    state = {
        packages: [],
        // groups: [],
        disposals: [],
        key: "1",
        loading: false,
        pagination: {
            current: 1,
            pageSize: 15,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        },
        dateFilter:{
            start:"",
            end:"",
            start_modified:"",
            end_modified:""
        }
    };

    columns = [
        {
            title: "Disposal Family Name",
            dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
            // render: () => <div>Outdated Fridge Parts</div>,
        },
        {
            title: "Disposal Items",
            dataIndex: "parent",
            render: (data) => <div>{(data && data.children.length) || "0"}</div>,
            // sorter: {
            //     compare: (a, b) => a.children.length - b.children.length
            // }
            sorter: true,
        },
    ];

    disposalColumns = [
        {
            title: "Disposal ID",
            dataIndex: "id",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "id",
            // render: (item) =><div>{item}</div>
        },
        {
            title: "Disposal Code",
            dataIndex: "disposal_code",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "disposal_code",
            render: (item) =><div>{item || "-"}</div>
        },
        {
            title: "Disposal Name",
            // dataIndex: 'name',
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "name",
            render: (data) => {
                return (
                    <div>
                        <p>{data.name}</p>
                        {checkDisposalFieldsRequired(data) && (
                            <p className="red-text-disposal">
                                Please complete all required information to avoid issues
                            </p>
                        )}
                    </div>
                );
            },
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
            // sorter: {
            //     compare: (a, b) => a - b
            // },
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
                title: "Disposal",
                url: routes.dashboard.management.disposal.self,
            },
            {
                title: "Disposal Families",
                url: routes.dashboard.management.disposal.self,
            },
        ];
        this.props.setBreadcrumb(arr);
        this.fetchAllFamily();
        this.tabChange(getTabValue());
    }

    fetchAllFamily = (params = {}) => {
        const { search,dateFilter } = this.state;
        if (!params.ordering) {
            params.ordering = "name";
        }
        this.setState({loading: true});
        getDisposalFamily({...params,page: params.page || 1,search,...dateFilter})
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

    fetchAllDisposals = (params = {}) => {
        const { search, dateFilter } = this.state;
        this.setState({loading: true});
        if (!params.ordering) {
            params.ordering = "name";
        }
        params["tier_type"] = "DISPOSAL";
        getDisposal({...params,page: params.page || 1,search,...dateFilter})
            .then((res) => {
                this.setState({
                    disposals: res.data.results
                        .filter((p) => p.children.length === 0)
                        .map((d) => delete d.children && d),
                    pagination: {
                        ...this.state.pagination,
                        current: params.page || 1,
                        total: res.data.count,
                    },
                    loading: false,
                });
                // console.log("data = ", this.state.disposals);
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

    onSearch = (e) => {
        this.setState({search: e.target.value},() => {
            this.fetchAllFamily();
        })
       
    };

    onGroupSearch = (e) => {
        this.setState({search: e.target.value},() => {
        this.fetchAllDisposals();
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
        this.fetchAllFamily(params);
        // this.fetchAllFamily({ page: pagination.current })
    };

    handleTableChangeDisposal = (pagination, filters, sorter) => {
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
        this.fetchAllDisposals(params);
        // this.fetchAllDisposals({ page: pagination.current })
    };

    tabChange = (key) => {
        this.setState({key,search:"", dateFilter:{
            start:"",end:"",start_modified:"",end_modified:""
        }, pagination: {
            current: 1,
            pageSize: 15,
        }},() => {
        switch (key) {
            case "1":
                let arr = [
                    {
                        title: "Disposal",
                        url: routes.dashboard.management.disposal.self,
                    },
                    {
                        title: "Disposal Families",
                        url: routes.dashboard.management.disposal.self,
                    },
                ];
                this.props.setBreadcrumb(arr);
                this.fetchAllFamily();
                return;
            case "2":
                let arrSupply = [
                    {
                        title: "Disposal",
                        url: routes.dashboard.management.disposal.self,
                    },
                    {
                        title: "Disposal",
                        url: routes.dashboard.management.disposal.self,
                    },
                ];
                this.props.setBreadcrumb(arrSupply);
                this.fetchAllDisposals();
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
    getLocaleData = (DISPOSAL) =>{
      return(
          <div className="col-12 no-data-card-row-new-table">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div className="col-12 text-center">
                      <img src={Images.no_disposal_gray} alt="" className="img-fluid"/>
                      <h6 className="mb-0 no-data-main-tg">{DISPOSAL ? "No Disposal" : "No Disposal Families"}</h6>
                  </div>
              </div>
          </div>
      )
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

    handleFilterDisposal = (data) => {
        if(data) {
            this.setState({ dateFilter: { ...this.state.dateFilter, ...data } }, () => {
              this.fetchAllDisposals();
            })
          }
          else {
            this.setState({ dateFilter: null}, () => {
              this.fetchAllDisposals()
            })
        }
    }


    render() {
        const {packages,loading,pagination, disposals} = this.state;
        return (
            <React.Fragment>
                <div className="main-content-div">
                    <Tabs
                        onChange={this.tabChange}
                        className="carpet-cleaning-main-common-tab"
                        activeKey={this.state.key}
                    >
                        <TabPane tab="Disposal Families" key="1">
                            <ManagementHeader
                                buttonLink={routes.dashboard.management.disposal.family.create}
                                buttonName={"+ Create Disposal Family"}
                                onSearch={debounceEvent(this.onSearch, 1000)}
                                fetchData={(data) => this.handleFilterFamily(data)}
                            />
                            <div className="row mx-0 opportunities-table-main-dashboard">
                                <div className="col-12">
                                    <div className="row service-family-table">
                                        <CommonTable
                                            data={packages}
                                            loading={loading}
                                            pagination={pagination}
                                            onTableChange={this.handleTableChange}
                                            rowLink={routes.dashboard.management.disposal.family.view}
                                            columns={this.columns}
                                            // rowClassName={this.checkRequiredAddClass}
                                            locale={!loading ? {emptyText:this.getLocaleData()} : {emptyText: " "}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Disposal" key="2">
                            <ManagementHeader
                                buttonLink={routes.dashboard.management.disposal.items.create}
                                buttonName={"+ Create Disposal"}
                                onSearch={debounceEvent(this.onGroupSearch, 1000)}
                                fetchData={(data) => this.handleFilterDisposal(data)}
                            />
                            <div className="row mx-0 opportunities-table-main-dashboard">
                                <div className="col-12">
                                    <div className="row vehicle-table-text-center width-160-id">
                                        <CommonTable
                                            checkDisposalRequired
                                            data={disposals}
                                            loading={loading}
                                            pagination={pagination}
                                            onTableChange={this.handleTableChangeDisposal}
                                            rowLink={routes.dashboard.management.disposal.items.view}
                                            columns={this.disposalColumns}
                                            locale={!loading ? {emptyText:this.getLocaleData(true)} : {emptyText: " "}}
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

export default connect(null, {setBreadcrumb})(Disposal);
