import React, {Component} from "react";
import {Breadcrumb, Collapse, Table} from "antd";
import {Image as Images} from "../../../Images";
import {Link, withRouter} from "react-router-dom";
import {getAssociatedLineItems,} from "../../../../Controller/api/lineItemsServices";
import {handleError} from "../../../../Controller/Global";
import ManagementHeader from "../../ManagementHeader";
import {routes} from "../../../../Controller/Routes";
import {reverse} from "named-urls/src";
import {history} from "../../../../Controller/history";
import {debounce} from "lodash";

const {Panel} = Collapse;

let icons = {
    FLEET_GROUP: Images.create_vehicle_group_icon,
    LABOR: Images.labor_sub_tier_icon,
    SUPPLY_GROUP: Images.create_supply_group_icon,
    INVENTORY_ITEM: Images.create_inventory_group_icon,
    INVENTORY_KIT: Images.inventory_kit_sub_tier_icon,
};

class LineItemsView extends Component {
    state = {
        children: [],
        loading: false,
        pagination: {
            current: 1,
            pageSize: 15,
            showSizeChanger: false,
            // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
        },
    };
    columns = [
        {
            title: "dry Name",
            key: "name",
            render: (data) => {
                return (
                    <div className="d-flex align-items-center">
                        <img alt={""} className="img-fluid" src={icons[data.item_type]}/>
                        <span className="ml-2">{data.resource_name}</span>
                    </div>
                );
            },
        },
    ];
    itemsColumns = [
        {
            title: "Service Name",
            dataIndex: "name",
            sorter: {
                compare: (a, b) => a.name?.localeCompare(b.name),
            },
        },
        {
            title: "Service Family",
            render: (item) => (
                <Breadcrumb
                    separator={
                        <img
                            src={Images.arrow_small_breadcrumb}
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
    ];

    componentDidMount() {
        this.getPackage({page: 1});
    }

    // fetchChildren = (data, newChild) => {
    //     if (newChild) {
    //         this.setState({children: []})
    //     }
    //     data.forEach(item => {
    //         console.log(item, "item")
    //         let children = item.children.drawer(i => i.tier_type === SERVICE_LINE_ITEM);
    //         if (children.length) {
    //             this.setState(prevState => ({
    //                 children: [...prevState.children, ...children]
    //             }))
    //         }
    //         this.fetchChildren(item.children)
    //     })
    //     // this.setState({loading: false})
    // };

    // handleDrawer = (e, item) => {
    //     e.stopPropagation()
    //     this.setState({openDrawer: true, setDrawerItem: item})
    // }

    // onClose = () => {
    //     this.setState({openDrawer: false}, () => this.getPackage(null, true))
    // }

    // getPackage = (data, newChild) => {
    getPackage = (params = {}) => {
        // console.log(params, "date")
        this.setState({loading: true});
        getAssociatedLineItems({...params, parent: this.props.match.params.id})
            .then((res) => {
                this.setState({
                    children: res.data.results,
                    pagination: {
                        ...this.state.pagination,
                        current: params.page || 1,
                        total: res.data.count,
                    },
                });
            })
            .catch((err) => {
                handleError(err);
            })
            .finally(() => {
                this.setState({loading: false});
            });
    };

    searchServices = (e) => {
        this.getPackage({search: e.target.value});
    };

    handleTableItemChange = (pagination, filters, sorter) => {
        this.getPackage({page: pagination.current});
    };

    debounceEvent = (...args) => {
        this.debouncedEvent = debounce(...args);
        return (e) => {
            e.persist();
            return this.debouncedEvent(e);
        };
    };
    getLocaleData = () =>{
      return(
          <div className="col-12 no-data-card-row-new-table">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div className="col-12 text-center">
                      <img src={Images.line_items_gray_small} alt="" className="img-fluid"/>
                      <h6 className="mb-0 no-data-main-tg">No Services</h6>
                  </div>
              </div>
          </div>
      )
    }

    render() {
        let {openDrawer, setDrawerItem, children} = this.state;
        return (
            <React.Fragment>
                <ManagementHeader
                    // buttonLink={null}
                    buttonName={"Create Service"}
                    onSearch={this.debounceEvent(this.searchServices, 1000)}
                    fetchData={(data) => this.getPackage(data)}
                />
                <div className="row mt-4 mx-0 opportunities-table-main-dashboard">
                    <div className="col-12">
                        <div className="row">
                            <div
                                className="col-12 table-responsive main-table-div opportunity-db-table customer-account-table">
                                <Table
                                    loading={this.state.loading}
                                    className="main-table-all"
                                    columns={this.itemsColumns}
                                    dataSource={children}
                                    pagination={this.state.pagination}
                                    onChange={this.handleTableItemChange}
                                    size="middle"
                                    rowKey={(record) => record.id}
                                    locale={{emptyText:this.getLocaleData()}}
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onClick: (event) => {
                                                history.push(
                                                    reverse(
                                                        routes.dashboard.management.service.line_items.view,
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
                {/* <div className="row mx-0 create-opportunity-row line-items-row-view pt-3">
                    <div className="col-12 col-sm-12">
                        <Collapse className="vehicle-group-collapse-main min-head-collapse" accordion
                                  expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                  defaultActiveKey={[0]}>
                            {children.map((child, i) => (
                                <Panel key={child.id} header={
                                    <React.Fragment>
                                        <div className="col-12">
                                            <div
                                                className="row info-card-heading-row align-items-center justify-content-between">
                                                <h5 className="mb-0 p-0 vehicle-group-heading d-flex align-items-center">
                                                    <img src={Images.line_items_group_icons} alt={" "}
                                                         className="img-fluid"/>
                                                    {child.name}
                                                </h5>
                                                <Button className="edit-btn-summary"
                                                        onClick={e => this.handleDrawer(e, child)}>
                                                    <img src={Images.pencil_green} alt="" className="img-fluid"/>
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div
                                                className="row align-items-center justify-content-between collapse-breadcrumb-main">
                                                <div className="breadcrumb-inner-details">
                                                    <Breadcrumb separator={
                                                        <img src={Images.arrow_small_breadcrumb} alt={""}
                                                             className="img-fluid"/>}>
                                                        {child.breadcrumb.map(b => (
                                                            <Breadcrumb.Item>{b}</Breadcrumb.Item>
                                                        ))}
                                                        <Breadcrumb.Item>{child.name}</Breadcrumb.Item>
                                                    </Breadcrumb>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                }>
                                    <div className="row mx-0">
                                        <div className="col-12 table-responsive create-dry-table main-table-div">
                                            <Table
                                                className="main-table-all"
                                                dataSource={child.resource}
                                                columns={this.columns}
                                                size="middle"
                                                pagination={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="row common-form-card-row mx-0">
                                        <div className="col-12 p-0">
                                            <div className="row">
                                                <div className="col-12 small-heading-in-form">
                                                    <h6>Service Variants</h6>
                                                </div>
                                                {child.pricing.length == 0 ?
                                                    <div className="col-12">
                                                        <div style={child.resource.length === 0 ? {
                                                            cursor: 'not-allowed',
                                                            opacity: '0.6'
                                                        } : {}}
                                                             className="row mt-3 mx-0 no-data-card-row align-items-center justify-content-center">
                                                            <div style={child.resource.length === 0 ? {

                                                                pointerEvents: 'none'
                                                            } : {}}
                                                                 className="col-12 text-center">
                                                                <img src={Images.billing_gray_no_data_icon} alt=""
                                                                     className="img-fluid"/>
                                                                <h6 className="mb-0 text-gray-tag">No Pricing</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="col-12">
                                                        <Collapse
                                                            className="vehicle-group-collapse-main dry-group-collapse-main"
                                                            accordion
                                                            expandIcon={({isActive}) => <CaretRightOutlined
                                                                rotate={isActive ? 90 : 0}/>}
                                                            defaultActiveKey={[0]}>
                                                            {child.pricing.map((item, index) => <Panel header={
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
                                                                                {/*<div*/}
                {/*    className="remove-dropdown">*/}
                {/*    <Dropdown*/}
                {/*        onClick={e => e.stopPropagation()}*/}
                {/*        trigger={'click'}*/}
                {/*        overlay={this.menu}>*/}
                {/*        <a className="ant-dropdown-link"*/}
                {/*           onClick={e => e.stopPropagation()}>*/}
                {/*            <img src={Images.eva_more_elisis}*/}
                {/*                 className="img-fluid"*/}
                {/*                 alt=""/>*/}
                {/*        </a>*/}
                {/*    </Dropdown>*/}
                {/*</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                            } key={index + 1}>
                                                                <React.Fragment>
                                                                    <div className="row mx-0"
                                                                         style={{overflow: "auto"}}>
                                                                        <GeneratePricingTable view
                                                                                              child={item.table_data || []}
                                                                                              margin={item.margin}/>
                                                                        {/*<PricingTableViewLineItems/>
                                                                    </div>
                                                                </React.Fragment>
                                                            </Panel>)}
                                                        </Collapse>
                                                    </div>
                                                }
                                                {!child.pricing.length == 0 &&
                                                <div className="col-12 pb-3">
                                                <span className="small-text-main d-flex align-items-center">
                                                    <img src={Images.info_small} alt={""} className="img-fluid mr-2"/>
                                                    Note: Estimated total price per hour is calculated by Straight time.
                                                </span>
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Panel>))}


                        </Collapse>
                    </div>
                </div>
                {this.state.openDrawer &&
                <LineItemDrawer visible={openDrawer} item={setDrawerItem}
                                onClose={this.onClose}/>}  */}
            </React.Fragment>
        );
    }
}

export default withRouter(LineItemsView);
