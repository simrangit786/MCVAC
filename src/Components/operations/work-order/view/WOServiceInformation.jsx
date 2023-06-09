import React, { Component } from 'react';
import moment from 'moment';
class WoServiceInformation extends Component {

    render() {
        const { workOrder } = this.props
        return (
            <React.Fragment>
                <div className="row summary-collapse-inner-row-main">
                    <div className="col-12">
                        <div className="row summary-view-row-vehicle border-bottom-0">
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                <h6 className="text-uppercase">SERVICE DATE</h6>
                                <h5 className="mb-0">{workOrder?.service_date ? moment(workOrder?.service_date).format("MMM DD,YYYY") :
                                    "-"}</h5>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                <h6 className="text-uppercase">Estimated start Time</h6>
                                <h5 className="mb-0">{workOrder?.start_time ? moment(workOrder?.start_time, "HH:mm").format('HH:mm A') : '-'}</h5>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                <h6 className="text-uppercase">Estimated End Time</h6>
                                <h5 className="mb-0">{workOrder?.end_time ? moment(workOrder?.end_time, "HH:mm").format('HH:mm A') : '-'}</h5>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                <h6 className="text-uppercase">Billing Account PO#/Job#</h6>
                                <h5 className="mb-0">{workOrder?.billing_account_po || '-'}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default WoServiceInformation;