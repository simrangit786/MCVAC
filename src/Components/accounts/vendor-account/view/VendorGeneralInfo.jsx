import { Spin } from 'antd';
import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { formatEin } from '../../../../Controller/utils';

class VendorGeneralInfo extends Component {
    render() {
        const {vendor, loading} = this.props;
        if(loading) {
            return (
            <div className="row summary-collapse-inner-row-main">
                <div className="col-12 text-center">
                    <Spin />
                </div>
             </div>
            )
        }
        return (<div className="row summary-collapse-inner-row-main">
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                    <h6 className="text-uppercase">ACCOUNT NAME</h6>
                    <h5 className="text-capitalize font-weight-bold">{vendor?.name}</h5>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                    <h6 className="text-uppercase">ACCOUNT TYPE</h6>
                    <h5 className="mb-0 text-capitalize">Vendor</h5>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                    <h6 className="text-uppercase">EIN</h6>
                    <h5 className={'text-capitalize'}>{vendor?.ein ? formatEin(vendor?.ein) : "-"}</h5>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                    <h6 className="text-uppercase">1099</h6>
                    <h5 className="text-capitalize">{vendor?.account_1099 === "YES" ? "Yes" :vendor?.account_1099 === "NO" ? "No" : "-"}</h5>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                    <h6 className="text-uppercase">Epa Id</h6>
                    <h5 className="text-capitalize">{vendor?.epa_id || "-"}</h5>
                </div>
            </div>);
    }
}

export default withRouter(VendorGeneralInfo);