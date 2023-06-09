import React, {Component} from "react";
import {Button, Collapse, Tree} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image, Image as Images} from "../../../Images";
import {getServiceFamilyById} from "../../../../Controller/api/lineItemsServices";
import {handleError} from "../../../../Controller/Global";
import {MANAGEMENT_TREE_TYPES, SERVICE_LINE_ITEM,} from "../../../../Controller/utils";
import {withRouter} from "react-router-dom";
import {history} from "../../../../Controller/history";
import {reverse} from "named-urls/dist/index.es";
import {routes} from "../../../../Controller/Routes";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../Store/actions/breadcrumbAction";

const {Panel} = Collapse;

class LineItemSummaryTree extends Component {
    state = {
        treeData: [],
        package: null,
    };
    onSelect = (selectedKeys, info) => {
    };

    componentDidMount() {
        getServiceFamilyById(this.props.match.params.id)
            .then((res) => {
                let arr = [
                    {
                        title: "Services",
                        url: routes.dashboard.management.service.self,
                    },
                    {
                        title: "Service Families",
                        url: routes.dashboard.management.service.self,
                    },
                    {title: res.data.name, url: "#"},
                ];
                this.props.setBreadcrumb(arr);
                let treeData = this.handleKey(
                    res.data.parent.children,
                    res.data.parent.id
                );
                this.setState({treeData, itemPackage: res.data});
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
            item.key = id ? id + "parent" + index : item.id;
            item.children = this.handleKey(item.children);
        });
        return newData;
    };

    render() {
        const {itemPackage, treeData} = this.state;
        if (!itemPackage) return <div/>;

        return (
            <React.Fragment>
                <div className="col-12 mt-30">
                    <div className="row mx-0 summary-info-inner-row">
                        <div className="col-12">
                            <Collapse
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
                                                    onClick={() =>
                                                        history.push({
                                                          pathname: reverse(routes.dashboard.management.service.family.edit,
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
                                    <div className="row summary-collapse-inner-row-main">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                    <h6 className="text-uppercase">
                                                        Service Family Name*
                                                    </h6>
                                                    <h5 className="mb-0">{itemPackage.name}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                    <h6 className="text-uppercase">Description</h6>
                                                    <h5 className="mb-0">{itemPackage.description}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Service Family <sup>*</sup>
                      </span>
                                            <Button
                                                // onClick={() =>
                                                //     history.push(
                                                //         reverse(
                                                //             routes.dashboard.management.service.family.edit,
                                                //             {id: this.props.match.params.id}
                                                //         )
                                                //     )
                                                // }
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.service.family.edit,
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
                                                    <span>Services</span>
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
                                                    defaultExpandAll={true}
                                                    switcherIcon={
                                                        <img src={Image.treeArrow} alt="arrow"/>
                                                    }
                                                    selectable={false}
                                                    titleRender={(data) => {
                                                        return (
                                                            <div
                                                                className="row mx-0 custom-tree-row align-items-center justify-content-between"
                                                                onClick={() => {
                                                                    if (data.tier_type === SERVICE_LINE_ITEM) {
                                                                        history.push(
                                                                            reverse(
                                                                                routes.dashboard.management.service
                                                                                    .line_items.view,
                                                                                {id: data.id}
                                                                            )
                                                                        );
                                                                    } else {
                                                                        return null;
                                                                    }
                                                                }}
                                                            >
                                                                <div className="d-flex align-items-center">
                                                                    <div
                                                                        className="branch-icon-text d-flex align-items-center">
                                                                        {data.tier_type === SERVICE_LINE_ITEM && (
                                                                            <img
                                                                                src={Images.line_item_icon_green}
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
                                                                <div className="text-green-tag text-right-tree">
                                                                    {MANAGEMENT_TREE_TYPES[data.tier_type].name}
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
                                                            height:'50px'
                                                        }}
                                                        className="row mx-0 mb-0 mt-3 border-0 no-data-card-row align-items-center bg-transparent justify-content-center">
                                                        <div className="col-12 text-center">
                                                            <img
                                                                alt={""}
                                                                className="img-fluid"
                                                                src={Images.service_family_empty_state_icon}
                                                            />
                                                            <h6 className="mb-0">No Service Families</h6>
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
    withRouter(LineItemSummaryTree)
);
