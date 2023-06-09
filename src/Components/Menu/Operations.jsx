import React, {Component} from "react";
import {Image as Images} from "../Images";
import {routes} from "../../Controller/Routes";
import {history} from "../../Controller/history";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../Store/actions/breadcrumbAction";
import {isAccessible} from "../../Controller/utils";

class Operations extends Component {

    render() {
        return (
            <React.Fragment>
                <div className="main-content-div">
                    <div className="row mt-4 mx-0 opportunities-table-main-dashboard">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-6">
                                    <div
                                        onClick={() => history.push(routes.dashboard.operations.projects.self)}
                                        className="shade-card-main-div mx-0 curser-pointer
                    row"
                                        // disabled={true}
                                    >
                                        <div className="col-12 p-0">
                                            <div
                                                className="shade-img-section float-left d-flex align-items-center justify-content-center">
                                                {/*primary-icons-img*/}
                                                <img
                                                    src={Images.Projects}
                                                    alt={""}
                                                    className="img-fluid"
                                                />

                                                {/*inactive-icon-img*/}
                                                {/*<img src={Images.project_icon} alt={""}*/}
                                                {/*     className="img-fluid"/>*/}
                                            </div>
                                            <div className="card-content-section float-left position-relative">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <h5 className="mb-0">Projects</h5>
                                                        <h6 className="mb-0">Finalized jobs/services</h6>
                                                    </div>
                                                </div>
                                                {/*<div className="coming-soon-div d-flex align-items-center m-auto">Coming Soon</div>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-6">
                                    <div
                                        className="shade-card-main-div curser-pointer row mx-0"
                                        // disabled={true}
                                        onClick={() => history.push(routes.dashboard.operations.work_order.self)}
                                    >
                                        <div className="col-12 p-0">
                                            <div
                                                className="shade-img-section float-left d-flex align-items-center justify-content-center">
                                                {/*primary-icons-img*/}
                                                <img src={Images.WorkOrder} alt={""}
                                                     className="img-fluid"/>

                                                {/*inactive-icon-img*/}
                                                {/*<img
                                                    src={Images.work_order_inactive_img}
                                                    alt={""}
                                                    className="img-fluid"
                                                />*/}
                                            </div>
                                            <div className="card-content-section float-left position-relative">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <h5 className="mb-0">Work Orders</h5>
                                                        <h6 className="mb-0">
                                                            Jobs/services ready to be assigned
                                                        </h6>
                                                    </div>
                                                </div>
                                                {/*<div className="coming-soon-div d-flex align-items-center m-auto">
                                                    Coming Soon
                                                </div>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {isAccessible(['ADMIN']) &&
                                <>
                                <div className="col-12 col-sm-12 col-md-6">
                                    <div
                                        className="shade-card-main-div curser-pointer row mx-0"
                                        // disabled={true}
                                        onClick={()=>history.push(routes.dashboard.operations.dispatch.self)}
                                    >
                                        <div className="col-12 p-0">
                                            <div
                                                className="shade-img-section float-left d-flex align-items-center justify-content-center">
                                                {/*primary-icons-img*/}
                                                <img src={Images.Dispatch} alt={""} className="img-fluid"/>

                                                {/*inactive-icon-img*/}
                                                {/*<img
                                                    src={Images.dispatch_inactive_img}
                                                    alt={""}
                                                    className="img-fluid"
                                                />*/}
                                            </div>
                                            <div className="card-content-section float-left position-relative">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <h5 className="mb-0">Dispatch</h5>
                                                        <h6 className="mb-0">
                                                            Jobs/services to be set in motion
                                                        </h6>
                                                    </div>
                                                </div>
                                                {/*<div className="coming-soon-div d-flex align-items-center m-auto">
                                                    Coming Soon
                                                </div>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-6">
                                    <div
                                        className="shade-card-main-div shade-card-inactive-section row mx-0"
                                        disabled={true}
                                    >
                                        <div className="col-12 p-0">
                                            <div
                                                className="shade-img-section float-left d-flex align-items-center justify-content-center">
                                                {/*primary-icons-img*/}
                                                {/*<img src={Images.Dispatch} alt={""}*/}
                                                {/*     className="img-fluid"/>*/}

                                                {/*inactive-icon-img*/}
                                                <img
                                                    src={Images.warehouse_management_coming_soon}
                                                    alt={""}
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <div className="card-content-section float-left position-relative">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <h5 className="mb-0">Warehouse Management</h5>
                                                        <h6 className="mb-0">
                                                            Short description of this section
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div className="coming-soon-div d-flex align-items-center m-auto">
                                                    Coming Soon
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(Operations);
