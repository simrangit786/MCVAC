import React, {Component} from 'react';
import {Image as Images} from "../../../Images";

class q extends Component {
    render() {
        const { workOrder } = this.props
        const warehouse = workOrder?.workorder_warehouse[0]
        return (<React.Fragment>
            <div className={"row-0 mx-0 summary-collapse-inner-row-main"}>
                {warehouse ? 
                <div className="col-12">
                    <div className="row site-details-row-card mb-2 position-relative">
                        <div className="col-12 col-sm-3 bg-gray-main p-0">
                            <div
                                className="row mx-0 align-items-center pt-lg-3 pt-md-3 pt-3">
                                <div
                                    className="col-12 col-sm-3 pr-lg-0 pr-md-0">
                                    <img
                                        src={Images.location_black_icon}
                                        alt=""
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="col-12 col-sm-9 pl-lg-2">
                                    <h6
                                        style={{
                                            fontSize: "15px", color: "#4f4f4f", fontWeight: "500",
                                        }}
                                        className="text-capitalize mb-0"
                                    >
                                        {warehouse.warehouse.name}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-9 px-3 pt-2 pb-4">
                            <div className="row pt-lg-3 pt-md-3 pt-3">
                                <div className="col-12 col-sm-4">
                                    <h6 className="text-uppercase">
                                        ADDRESS
                                    </h6>
                                    <p className="mb-0">
                                        {warehouse.warehouse.street_address || ""}{" "}{warehouse.warehouse.apartment || ""}{" "}{warehouse.warehouse.city || ""},{" "}{warehouse.warehouse.state || ""}{" "}{warehouse.warehouse.zip_code || ""} USA
                                    </p>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <h6 className="text-uppercase">
                                        EMAIL ADDRESS
                                    </h6>
                                    <p
                                        className="mb-0"
                                        style={{width: 100}}
                                    >
                                        {warehouse.warehouse.email}
                                    </p>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <h6 className="text-uppercase">
                                        PHONE NUMBER
                                    </h6>
                                    <p className="mb-0">
                                        {warehouse.warehouse.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> :
                <div className="col-12">
                    <div className="row no-data-card-row align-items-center justify-content-center">
                        <div className="col-12 text-center">
                            <img src={Images.location_gray} alt={"location-icon"}
                                 className="img-fluid"/>
                            <h6 className="mb-0">No warehouses</h6>
                        </div>
                    </div>
                </div>
    }
            </div>
        </React.Fragment>);
    }
}

export default q;