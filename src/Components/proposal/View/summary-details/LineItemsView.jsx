import React, {Component} from "react";
import {Button, Form, Input} from "antd";
import {Image as Images} from "../../../Images";
import LineItemsTableCustomMain from "./LineItemsTableCustomMain";

class LineItemsView extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="row mx-0">
                    <div className="col-12">
                        <div
                            className="row mx-0 new-opportunity-header-row align-items-center carpet-cleaning-mini-header">
                            <h6 className="mb-0 d-flex align-items-center">
                                <aside>Line Items</aside>
                                <Button className="edit-btn-summary ml-2">
                                    <img src={Images.pencil_green} alt="" className="img-fluid"/>
                                    Edit
                                </Button>
                            </h6>
                        </div>
                    </div>
                    <div className="col-12">
                        <div
                            className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
                            <div className="search-bar-div">
                                <Form className="position-relative">
                                    <Input placeholder="Search Site"/>
                                    <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                        <img
                                            src={Images.search_icon_gray}
                                            className="img-fluid"
                                            alt="search icon"
                                        />
                                    </Button>
                                </Form>
                            </div>
                            <div className="new-opportunity-btn-div">
                                {/*<Button className="new-opportunity-btn text-capitalize">ADD</Button>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mx-0 py-lg-4 py-md-4 py-sm-3">
                    <LineItemsTableCustomMain/>
                    <div className="col-12 p-0">
                        <div className="row line-items-row-main">
                            <div className="col-12 col-sm-4">
                                <div className="row">
                                    <div className="col-12">
                                        <span className="sub-total-text gray-1">Cost setting</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="sub-total-text">Standard</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-7 offset-sm-1">
                                <div className="row estimated-total-row">
                                    <div className="col-8">
                                        <span className="sub-total-text">Estimated Cost:</span>
                                    </div>
                                    <div className="col-4 text-md-right">
                                        <span className="sub-total-text gray-1">$64,199.82</span>
                                    </div>
                                </div>
                                <div className="row estimated-total-row">
                                    <div className="col-8">
                                        <span className="sub-total-text">Margin:</span>
                                    </div>
                                    <div className="col-4 text-md-right">
                                        <span className="sub-total-text gray-1">49.79%</span>
                                    </div>
                                </div>
                                <div className="row estimated-total-row">
                                    <div className="col-8">
                    <span className="sub-total-text">
                      Estimated Total Price Pre-tax:
                    </span>
                                    </div>
                                    <div className="col-4 text-md-right">
                                        <span className="sub-total-text gray-1">49.79%</span>
                                    </div>
                                </div>
                                <div className="row estimated-total-row">
                                    <div className="col-7">
                                        <span className="sub-total-text">Estimated Taxes:</span>
                                    </div>
                                    <div className="col-5 text-md-right">
                                        <ul className="list-inline mb-0">
                                            <li className="list-inline-item">
                                                <small>8.875%</small>
                                            </li>
                                            <li className="list-inline-item">|</li>
                                            <li className="list-inline-item">
                                                <span className="sub-total-text gray-1">$8,534.64</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="row estimated-total-row-3 estimated-total-row">
                                    <div className="col-7">
                    <span className="sub-total-text-main">
                      Estimated Total:
                    </span>
                                    </div>
                                    <div className="col-5 text-md-right">
                                        <span className="sub-total-text-main">$0.00</span>
                                    </div>
                                </div>
                                <div className="row estimated-total-row-2 pt-1 pb-0 estimated-total-row">
                                    <div className="col-7">
                                        <span className="sub-total-text">Estimated Profit:</span>
                                    </div>
                                    <div className="col-5 text-md-right">
                                        <ul className="list-inline mb-0">
                                            <li className="list-inline-item">
                                                <small>8.875%</small>
                                            </li>
                                            <li className="list-inline-item">|</li>
                                            <li className="list-inline-item">
                                                <span className="sub-total-text gray-1">$8,534.64</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {/*<div className="row estimated-total-row-4 estimated-total-row">*/}
                                {/*    <div className="col-12">*/}
                                {/*        <small*/}
                                {/*            className="small-text-main position-relative small-text-main-2">Taxes*/}
                                {/*            are calculated by customer’s billing address</small>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default LineItemsView;
