import React, { Component } from "react";
import { connect } from "react-redux";
import {
  formatDuns,
  titleCase,
  formatEin,
} from "../../../../../Controller/utils";
import { Image } from "../../../../Images";

class PaymentInfo extends Component {
  render() {
    const payment_info = this.props.customer.payment_information || {};
    return (
      <>
        {
        // this.props.customer.payment_information &&
         (
          <div className="row summary-collapse-inner-row-main">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
              <h6 className="text-uppercase">CREDIT RATING</h6>
              <h5 className="text-capitalize">
                {titleCase(payment_info.credit_rating) || " - "}
              </h5>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-15-bt">
              <h6 className="text-uppercase">CREDIT LIMIT</h6>
              <h5 className="text-capitalize">
                {payment_info.credit_limit || " - "}
              </h5>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-15-bt">
              <h6 className="text-uppercase">DUNS NUMBER</h6>
              <h5 className="text-capitalize">
                {formatDuns(payment_info.duns_number) || " - "}
              </h5>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-15-bt">
              <h6 className="text-uppercase">EIN</h6>
              <h5 className="text-capitalize">
                {formatEin(payment_info.ein) || "-"}
              </h5>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <h6 className="text-uppercase">ENTITY TYPE</h6>
              <h5 className="mb-0 text-capitalize">
                {payment_info?.entity_type === "CORPORATION" ? "C Corporation" : (titleCase(payment_info.entity_type) || "-")}
              </h5>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
              <h6 className="text-uppercase">PAYMENT TERM</h6>
              <h5 className="text-capitalize text-capitalize">
                {titleCase(payment_info.payment_term) || " - "}
              </h5>
            </div>
            {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                    <h6 className="text-uppercase">SALES TAX TYPE</h6>
                    <h5 className="text-capitalize">{ payment_info.sales_tax_type ? payment_info.sales_tax_type.toLowerCase() : " - "}</h5>
                </div> */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-15-bt">
              <h6 className="text-uppercase">ACTIVE</h6>
              <h5 className="text-capitalize">
                {payment_info.active === true ? "Yes" : payment_info.active === false ? "No" : '-'}
              </h5>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
              <h6 className="text-uppercase">Sales Tax Exemption Status</h6>
              <h5 className="text-capitalize">
                {payment_info?.default_sales_tax === "EXEMPT" || payment_info?.default_sales_tax === true ? "Exempt" 
                : (payment_info.default_sales_tax == "NON_EXEMPT" || payment_info?.default_sales_tax === false ? "Non Exempt" : "-") || " - "}
              </h5>
            </div>
          </div>
        ) 
        // : (
        //   <div className="col-12">
        //     <div className="row no-data-upload-screens no-data-second m-0 border-0">
        //       <div className="col-12 text-center">
        //         <img
        //           src={Image.pricing_icon}
        //           alt=""
        //           className="img-fluid mb-2"
        //           width={35}
        //         />
        //         <h6 className="mb-0 text-gray-tag">
        //           No Payment Information added
        //         </h6>
        //       </div>
        //     </div>
        //   </div>
        // )
      }
      </>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(PaymentInfo);
