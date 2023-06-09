import React, { Component } from "react";
import { Image as Images } from "../../../Images";

class PricingTableViewLineItems extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="col-12 table-responsive main-table-div position-relative">
          <div className="row mx-0 custom-table-main-row custom-table-main-row-line-item-view">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="row custom-table-header">
                    <div className="custom-table-cell-th custom-table-cell-th-1">
                      <div className="custom-th-heading">Type</div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-2">
                      <div className="custom-th-heading">Name / Info</div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-3">
                      <div className="custom-th-heading">Uom</div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-4">
                      <div className="custom-th-heading">
                        Hours/Day Estimate
                      </div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-5">
                      <div className="custom-th-heading">
                        Cost
                        <br />
                        Per unit
                      </div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-6">
                      <div className="custom-th-heading">Margin</div>
                    </div>
                    <div className="custom-table-cell-th custom-table-cell-th-7">
                      <div className="custom-th-heading">
                        Price
                        <br />
                        Per Unit
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 custom-table-body p-0">
                  <div className="custom-table-row custom-table-row-level-1 row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                      <div>Labor</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-2 gray-2-color custom-table-cell-td-name-info">
                      <div>Operator</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                      <div className="px-3">Hours</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4">
                      <div className="editalble-form-data text-right">
                        <span className="px-3">8</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5">
                      <div className="px-3">$100.00</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                      <div>50%</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7">
                      <div>$100.00</div>
                    </div>
                  </div>
                  <div className="custom-table-row custom-table-row-level-1 row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                      <div>Labor</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info">
                      <div className="name-info-div position-relative">
                        <span className="rectangle-icon-div position-absolute">
                          <img
                            src={Images.rectangle_gray_icon}
                            alt=""
                            className={"img-fluid"}
                          />
                        </span>
                        <span>Straight Time</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                      <div className="px-3">Hours</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4 background-white-div">
                      <div className="editalble-form-data">
                        <span className="px-3">2</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5">
                      <div className="px-3">$100.00</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                      <div>50%</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                      <div>$100.00</div>
                    </div>
                  </div>
                  <div className="custom-table-row custom-table-row-level-1 row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                      <div>Labor</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info">
                      <div className="name-info-div position-relative">
                        <span className="rectangle-icon-div position-absolute">
                          <img
                            src={Images.rectangle_gray_icon}
                            alt=""
                            className={"img-fluid"}
                          />
                        </span>
                        <span>Over Time</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                      <div className="px-3">Hours</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4 background-white-div">
                      <div className="editalble-form-data">
                        <span className="px-3">2</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5">
                      <div>$100.00</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                      <div>50%</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                      <div>$100.00</div>
                    </div>
                  </div>
                  <div className="custom-table-row custom-table-row-level-1 row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                      <div>Labor</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info">
                      <div className="name-info-div position-relative">
                        <span className="rectangle-icon-div position-absolute">
                          <img
                            src={Images.rectangle_gray_icon}
                            alt=""
                            className={"img-fluid"}
                          />
                        </span>
                        <span>Double Time</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                      <div className="px-3">Hours</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4 background-white-div">
                      <div className="editalble-form-data">
                        <span className="px-3">2</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5">
                      <div className="px-3">$100.00</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                      <div>50%</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                      <div>$100.00</div>
                    </div>
                  </div>
                  <div className="custom-table-row custom-table-row-level-1 row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                      <div>Labor</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info">
                      <div className="name-info-div position-relative">
                        <span className="rectangle-icon-div position-absolute">
                          <img
                            src={Images.rectangle_gray_icon}
                            alt=""
                            className={"img-fluid"}
                          />
                        </span>
                        <span>Off Shift</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                      <div className="px-3">Hours</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4 background-white-div">
                      <div className="editalble-form-data">
                        <span className="px-3">2</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5">
                      <div className="px-3">$100.00</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                      <div>50%</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                      <div>$100.00</div>
                    </div>
                  </div>
                  <div className="custom-table-row custom-table-row-level-1 row mx-0">
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                      <div>Labor</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info">
                      <div className="name-info-div position-relative">
                        <span className="rectangle-icon-div d-none-rectangle-before position-absolute">
                          <img
                            src={Images.rectangle_gray_icon}
                            alt=""
                            className={"img-fluid"}
                          />
                        </span>
                        <span>Night Time Off Shift</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-3">
                      <div className="px-3">Hours</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-4 background-white-div">
                      <div className="editalble-form-data">
                        <span className="px-3">2</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-5">
                      <div className="px-3">$100.00</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-6">
                      <div>50%</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-7 background-white-div">
                      <div>$100.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PricingTableViewLineItems;
