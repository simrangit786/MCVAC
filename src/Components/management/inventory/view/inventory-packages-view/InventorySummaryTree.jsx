import React, {Component} from "react";
import {Button, Collapse, Tree} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image, Image as Images} from "../../../../Images";
import {withRouter} from "react-router-dom";
import {handleError} from "../../../../../Controller/Global";
import {getInventoryFamilyById} from "../../../../../Controller/api/inventoryServices";
import {history} from "../../../../../Controller/history";
import {reverse} from "named-urls/dist/index.es";
import {routes} from "../../../../../Controller/Routes";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../../Store/actions/breadcrumbAction";
import {checkInventoryFieldRequired, INVENTORY_GROUP, MANAGEMENT_TREE_TYPES} from "../../../../../Controller/utils";

const {Panel} = Collapse;

class InventorySummaryTree extends Component {
    state = {
        treeData: [],
    };
    collapseOnChange = (activeKey) => {
        this.setState({activeKey});
    };

    componentDidMount() {
        getInventoryFamilyById(this.props.match.params.id)
            .then((res) => {
                let arr = [
                    {
                        title: "Inventory",
                        url: routes.dashboard.management.inventory.self,
                    },
                    {
                        title: "Inventory Families",
                        url: routes.dashboard.management.inventory.self,
                    },
                    {title: res.data.name, url: "#"},
                ];
                this.props.setBreadcrumb(arr);
                let treeData = this.handleKey(
                    res.data.parent.children,
                    res.data.parent.id
                );
                this.setState({treeData, itemPackage: res.data});
                // console.log(treeData,"tree data")
            })
            .catch((err) => {
                handleError(err);
            });
    }

    handleKey = (data, id = null) => {
        if (!data) {
            return;
        }
        let newData = [...data];
        newData.forEach((item, index) => {
            if (!item.type) {
                item.key = id ? id + "parent" + index : item.id;
            }
            item.children = this.handleKey(item.children);
        });
        return newData;
    };

    checkRequired = (data) => {
        // console.log(data);
        if (
            data.margin &&
            data.name &&
            data.unit_cost &&
            data.uom &&
            data.uom_array &&
            data.internal_location &&
            data.inventory_uom &&
            data.inventory_family
        ) {
            return false;
        } else {
            return true;
        }
    };

    render() {
        const {treeData, itemPackage} = this.state;
        return (
            <React.Fragment>
                <div className="col-12 mt-30">
                    <div className="row mx-0 summary-info-inner-row">
                        <div className="col-12">
                            <Collapse
                                onChange={this.collapseOnChange}
                                // accordion
                                defaultActiveKey={["1"]}
                                expandIcon={({isActive}) => (
                                    <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                                )}
                            >
                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        General Information <sup>*</sup>
                      </span>
                                            <Button
                                                // onClick={() =>
                                                //     history.push(
                                                //         reverse(
                                                //             routes.dashboard.management.inventory
                                                //                 .inventory_packages.edit,
                                                //             {id: this.props.match.params.id}
                                                //         )
                                                //     )
                                                // }
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.inventory.inventory_packages.edit,
                                                        { id: this.props.match.params.id }
                                                      ),
                                                      editTab: "1"
                                                    })
                                                  }
                                                className="edit-btn-summary"
                                            >
                                                <img
                                                    src={Images.pencil_green}
                                                    alt=""
                                                    className="img-fluid"
                                                />
                                                Edit
                                            </Button>
                                        </div>
                                    }
                                    key="1"
                                >
                                    <div className="row mx-0 px-0 summary-collapse-inner-row-main">
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <h6 className="mb-0 text-uppercase">
                                                Inventory Family Name
                                            </h6>
                                            <h5 className="mb-0">{itemPackage?.name}</h5>
                                        </div>
                                        <div className="col-12 col-sm-6 col-md-8 col-lg-9">
                                            <h6 className="mb-0 text-uppercase">Description</h6>
                                            <h5 className="mb-0">{itemPackage?.description}</h5>
                                        </div>
                                    </div>
                                </Panel>
                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Inventory Family <sup>*</sup>
                      </span>
                                            <Button
                                                 onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.inventory.inventory_packages.edit,
                                                        { id: this.props.match.params.id }
                                                      ),
                                                      editTab: "2"
                                                    })
                                                  }
                                                className="edit-btn-summary"
                                            >
                                                <img
                                                    src={Images.pencil_green}
                                                    alt=""
                                                    className="img-fluid"
                                                />
                                                Edit
                                            </Button>
                                        </div>
                                    }
                                    key="2"
                                >
                                    <div className="row mx-0 px-0 pt-0 summary-collapse-inner-row-main">
                                        <div className="col-12 tree-heading">
                                            <div className="row mx-0">
                                                <div className="col-6">
                                                    <span>INVENTORY</span>
                                                </div>
                                                <div className="col-6 text-right">
                                                    <span>TYPE</span>
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.treeData.length > 0 ? (
                                                <div className="col-12 p-0">
                                                    <Tree
                                                        className="custom-tree-structure"
                                                        showLine
                                                        filterTreeNode={(node) => {
                                                            if (node.tier_type === INVENTORY_GROUP &&
                                                                checkInventoryFieldRequired(node)) {
                                                                return true;
                                                            }
                                                            return false;
                                                        }}
                                                        defaultExpandAll={true}
                                                        switcherIcon={
                                                            <img src={Image.treeArrow} alt="arrow"/>
                                                        }
                                                        selectable={false}
                                                        titleRender={(data) => {
                                                            return (
                                                                <div
                                                                    className={`row mx-0 custom-tree-row align-items-center justify-content-between ${
                                                                        data.tier_type === INVENTORY_GROUP &&
                                                                        checkInventoryFieldRequired(data) &&
                                                                        "is-required"
                                                                    }

                                `}
                                                                    onClick={() =>
                                                                        data.tier_type === INVENTORY_GROUP
                                                                            ? history.push(
                                                                                reverse(
                                                                                    routes.dashboard.management.inventory
                                                                                        .inventory_items.view,
                                                                                    {id: data.id}
                                                                                )
                                                                            )
                                                                            : null
                                                                    }
                                                                >
                                                                    <div className="d-flex align-items-center">
                                                                        <div
                                                                            className="branch-icon-text d-flex align-items-center">
                                                                            {data.tier_type === INVENTORY_GROUP && (
                                                                                <img
                                                                                    src={Images.inventory_item_icon}
                                                                                    alt=""
                                                                                    className="img-fluid"
                                                                                />
                                                                            )}
                                                                            <h6 className="mb-0">{data.name}</h6>
                                                                        </div>
                                                                        {data.children &&
                                                                            data.children.filter((item) => !item.type)
                                                                                .length !== 0 && (
                                                                                <div
                                                                                    className="branch-div-tg d-flex align-items-center">
                                        <span className="count-span-tg">
                                          {
                                              data.children.filter(
                                                  (item) => !item.type
                                              ).length
                                          }
                                        </span>
                                                                                    <img
                                                                                        src={Images.branch_icon_gray}
                                                                                        alt={""}
                                                                                        className="img-fluid"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                    <div className="d-flex align-items-center">
                                                                        {data.tier_type === INVENTORY_GROUP &&
                                                                            checkInventoryFieldRequired(data) && (
                                                                                <div
                                                                                    className="d-flex mr-3 align-items-center">
                                                                                    {/* <img
                                          src={Images.tree_warning}
                                          alt={""}
                                          className="img-fluid"
                                        /> */}
                                                                                    <p
                                                                                        className="mb-0 ml-1"
                                                                                        style={{
                                                                                            fontSize: "11px",
                                                                                            fontStyle: "italic",
                                                                                            color: "#EB5757",
                                                                                        }}
                                                                                    >
                                                                                        Please complete all required
                                                                                        information to avoid issues
                                                                                        {/* Information required, go to{" "}
                                          <strong
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              history.push(
                                                reverse(
                                                  routes.dashboard.management
                                                    .inventory.inventory_items
                                                    .edit,
                                                  { id: data.id }
                                                )
                                              );
                                            }}
                                          >
                                            Edit
                                          </strong> */}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        <div className="text-green-tag text-right-tree">
                                                                            {MANAGEMENT_TREE_TYPES[data.tier_type].name}
                                                                            {/* {data.tier_type == INVENTORY_TIER
                                      ? "Inventory Tier"
                                      : "Inventory Item"} */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }}
                                                        treeData={treeData}
                                                    />
                                                </div>
                                            )
                                            :
                                            (
                                                <div className="col-12">
                                                    <div
                                                        style={{
                                                            height: '50px'
                                                        }}
                                                        className="row mx-0 mb-0 mt-3 border-0 no-data-card-row align-items-center bg-transparent justify-content-center">
                                                        <div className="col-12 text-center">
                                                            <img
                                                                alt={""}
                                                                className="img-fluid"
                                                                src={Images.Inventory_empty_state_icon}
                                                            />
                                                            <h6 className="mb-0">No Inventory</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(
    withRouter(InventorySummaryTree)
);
