import React, {Component} from "react";
import {Breadcrumb, Button, Collapse, Spin} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image, Image as Images} from "../../../../Images";
import {Link, withRouter} from "react-router-dom";
import InternalLocationView from "./InternalLocationView";
import DisposalDocumentsView from "./DisposalDocumentsView";
import {getDisposalById} from "../../../../../Controller/api/disposalServices";
import {handleError} from "../../../../../Controller/Global";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../../Store/actions/breadcrumbAction";
import {history} from "../../../../../Controller/history";
import {routes} from "../../../../../Controller/Routes";
import {reverse} from "named-urls/dist/index.es";
import {formatMoney} from "../../../../../Controller/utils";
import CustomUnitOfMeasurementsView from "./CustomUnitOfMeasurementsView";
import UniversalUnitsofMeasurementsView from "./UniversalUnitsofMeasurementsView";
import UnitConverterView from "./UnitConverterView";

const {Panel} = Collapse;

class DisposalItemViewSummary extends Component {
    state = {
        data: null,
        loading: true,
        supply: [],
        total_price: null,
    };

    componentDidMount() {
        this.setState({loading: true});
        getDisposalById(this.props.match.params.id)
            .then((res) => {
                let arrGrp = [];
                if (!this.props.match.url.includes("inventory")) {
                    arrGrp = [
                        {
                            title: "Disposal",
                            url: routes.dashboard.management.disposal.self,
                        },
                        {
                            title: "Disposal",
                            url: routes.dashboard.management.disposal.self,
                        },
                        {title: res.data.name, url: "#"},
                    ];
                } else {
                    arrGrp = [
                        {
                            title: "Inventory",
                            url: routes.dashboard.management.inventory.self,
                        },
                        {
                            title: "Disposal Inventory",
                            url: routes.dashboard.management.inventory.self,
                        },
                        {title: res.data.name, url: "#"},
                    ];
                }
                let sub_total = (res.data.unit_cost / 100) * res.data.margin;
                let unit_cost = res.data.unit_cost;
                let total = parseFloat(sub_total) + parseFloat(unit_cost);
                let calculated = {
                    price: total,
                };
                this.props.setBreadcrumb(arrGrp);
                this.setState({data: {...res.data, ...calculated}, loading: false});
            })
            .catch((err) => {
                handleError(err);
                this.setState({loading: false});
            });
    }

    render() {
        const {data, loading} = this.state;
        const {disposal} = this.props;
        if (loading) {
            return (
                <div className="row">
                    <div className="col-12 text-center">
                        <Spin/>
                    </div>
                </div>
            );
        }
        return (
            <React.Fragment>
                <React.Fragment>
                    <div className="row summary-info-inner-row mt-30">
                        <div className="col-12">
                            <Collapse
                                // accordion
                                defaultActiveKey={["1"]}
                                expandIcon={({isActive}) => (
                                    <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                                )}
                            >
                                {/* routes.dashboard.management.disposal.items.edit */}
                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        General Information <sup>*</sup>
                      </span>
                                            {!this.props.match.url.includes("inventory") && (
                                                <Button
                                                    // onClick={() =>
                                                    //     history.push(
                                                    //         reverse(
                                                    //             routes.dashboard.management.disposal.items.edit,
                                                    //             {id: this.props.match.params.id}
                                                    //         )
                                                    //     )
                                                    // }
                                                    onClick={() =>
                                                        history.push({
                                                          pathname: reverse(routes.dashboard.management.disposal.items.edit,
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
                                            )}
                                        </div>
                                    }
                                    key="1"
                                >
                                    <div className="row summary-collapse-inner-row-main">
                                        <div className="col-12">
                                            <div className="row">
                                            <div className="col-12 col-sm-6 col-md-3">
                                                    <h6 className="text-uppercase">Disposal Code</h6>
                                                    <h5 className="mb-0">{data?.disposal_code}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-3">
                                                    <h6 className="text-uppercase">Disposal ID</h6>
                                                    <h5 className="mb-0">{data?.id}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-3">
                                                    <h6 className="text-uppercase">Disposal name</h6>
                                                    <h5 className="mb-0">{data?.name}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-6 mt-3">
                                                    <h6 className="text-uppercase">
                                                        Disposal FAMILY / TIER
                                                    </h6>
                                                    <h5 className="mb-0">
                                                        <Breadcrumb
                                                            separator={
                                                                <img
                                                                    src={Image?.arrow_small_breadcrumb}
                                                                    alt={""}
                                                                    className="img-fluid"
                                                                />
                                                            }
                                                        >
                                                            {data?.breadcrumb?.map((name, index) => {
                                                                return (
                                                                    <Breadcrumb.Item key={index}>
                                                                        <Link>{name}</Link>
                                                                    </Breadcrumb.Item>
                                                                );
                                                            })}
                                                            <Breadcrumb.Item>{data?.name}</Breadcrumb.Item>
                                                        </Breadcrumb>
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>

                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>Unit Converter</span>
                                            {/* {!this.props.match.url.includes('inventory') &&
                                        <Button
                                            onClick={() => history.push(reverse(routes.dashboard.management.disposal.items.edit, { id: this.props.match.params.id }))}
                                            className="edit-btn-summary">
                                            <img src={Images.pencil_green} alt="" className="img-fluid" />
                                            Edit
                                        </Button>
                                        } */}
                                        </div>
                                    }
                                    key="2"
                                >
                                    <UnitConverterView disposal={disposal}/>
                                </Panel>
                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Universal Units of Measurement <sup>*</sup>
                      </span>
                                            {!this.props.match.url.includes("inventory") && (
                                                <Button
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.disposal.items.edit,
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
                                            )}
                                        </div>
                                    }
                                    key="3"
                                >
                                    <UniversalUnitsofMeasurementsView disposal={disposal}/>
                                </Panel>

                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>Custom Units of Measurement</span>
                                            {!this.props.match.url.includes("inventory") && (
                                                <Button
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.disposal.items.edit,
                                                        { id: this.props.match.params.id }
                                                      ),
                                                      editTab: "3"
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
                                            )}
                                        </div>
                                    }
                                    key="4"
                                >
                                    <CustomUnitOfMeasurementsView
                                        disposal={disposal}
                                        {...this.props}
                                    />
                                </Panel>

                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Warehouse & Vendor Disposal Facilities <sup>*</sup>
                      </span>
                                            {!this.props.match.url.includes("inventory") && (
                                                <Button
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.disposal.items.edit,
                                                        { id: this.props.match.params.id }
                                                      ),
                                                      editTab: "4"
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
                                            )}
                                        </div>
                                    }
                                    key="5"
                                >
                                    <InternalLocationView {...this.props} />
                                </Panel>

                                {/*<Panel header={*/}
                                {/*    <div*/}
                                {/*        className="opportunity_info-collapse d-flex align-items-center justify-content-between">*/}
                                {/*        <span>External Locations</span>*/}
                                {/*        <Button*/}
                                {/*            onClick={() => history.push(reverse(routes.dashboard.management.disposal.items.edit, { id: this.props.match.params.id }))}*/}
                                {/*            className="edit-btn-summary">*/}
                                {/*            <img src={Images.pencil_green} alt="" className="img-fluid" />*/}
                                {/*            Edit*/}
                                {/*        </Button>*/}
                                {/*    </div>*/}
                                {/*} key="7">*/}
                                {/*    <DropOffFacilitiesView {...this.props} />*/}
                                {/*</Panel>*/}

                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>Reference Price</span>
                                            {!this.props.match.url.includes("inventory") && (
                                                <Button
                                                    // onClick={() => history.push({
                                                    //     pathname: reverse(routes.dashboard.management.disposal.items.edit, {id: this.props.match.params.id}),
                                                    //     editTab: "5"
                                                    //   })}
                                                    onClick={() =>
                                                        history.push({
                                                          pathname: reverse(routes.dashboard.management.disposal.items.edit,
                                                            { id: this.props.match.params.id }
                                                          ),
                                                          editTab: "5"
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
                                            )}
                                        </div>
                                    }
                                    key="6"
                                >
                                    <div className="col-12">
                                        <div className="row summary-collapse-inner-row-main">
                                            <div className="col-12">
                                                {data ?
                                                    <div className="row">
                                                        <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                                            <h6 className="text-uppercase">
                                                                Unit of measurement
                                                            </h6>
                                                            <h5 className="mb-0 text-capitalize">
                                                                {data.uom?.name.toLowerCase() || "-"}{" "}
                                                                <span className="text-lowercase">
                                                                {data?.uom ? `(${data?.uom?.symbol})`:""}
                                                                  </span>
                                                            </h5>
                                                        </div>
                                                        <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                                            <h6 className="text-uppercase">Unit cost</h6>
                                                            <h5 className="mb-0">
                                                                {formatMoney(data.unit_cost || "-")}{data?.uom && '/'}
                                                                {data.uom?.symbol?.toLowerCase()}
                                                            </h5>
                                                        </div>
                                                        <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                                            <h6 className="text-uppercase">Margin</h6>
                                                            <h5 className="mb-0">{data?.margin ? `${parseInt(data?.margin).toFixed(2)}%` : "-"}</h5>
                                                        </div>
                                                        <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                                            <h6 className="text-uppercase">Price</h6>
                                                            <h5 className="mb-0">
                                                                {formatMoney(data.price || "-")}{data?.uom && '/'}
                                                                {data.uom?.symbol?.toLowerCase()}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="row mx-0 bg-transparent common-card-upload">
                                                                <div className="col-12 text-center">
                                                                    <img
                                                                        src={Images.billing_empty_state_icon}
                                                                        alt={""}
                                                                        className="img-fluid"
                                                                    />
                                                                    <h6 className="mb-0 color-gray-3">No Reference Price</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Panel>

                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>Documents</span>
                                            {/*<Button className="edit-btn-summary">*/}
                                            {/*    <img src={Images.pencil_green} alt="" className="img-fluid"/>*/}
                                            {/*    Edit*/}
                                            {/*</Button>*/}
                                        </div>
                                    }
                                    key="7"
                                >
                                    <DisposalDocumentsView {...this.props} />
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </React.Fragment>
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(
    withRouter(DisposalItemViewSummary)
);
