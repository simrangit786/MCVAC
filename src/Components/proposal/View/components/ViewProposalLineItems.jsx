import React, {Component} from "react";
import {Button, Form, Input, InputNumber} from "antd";
import {Image as Images} from "../../../Images";
import LineItemsTableCustomMain from "../summary-details/LineItemsTableCustomMain";
import {getSubUnitName} from "../../../../Controller/api/disposalServices";
import {handleError} from "../../../../Controller/Global";
import {formatPrice, laborCalculations, supplyCalculation, vehicleCalculations,} from "../../../../Controller/utils";
import {costSettingOptions, paymentOptions,} from "../../../../Controller/proposalServiceVariantDropdown";
import {getServiceVariantProposal} from "../../../../Controller/api/proposalServices";
import { getRegion } from "../../../../Controller/api/vehicleServices";

class ViewProposalLineItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOptions: [],
            newPricing: [],
            regions: []
        };
    }

    componentDidMount() {
        this.getUnitName();
        this.fetchRegion();
        this.getSelectedServiceVariants();
    }

    getSelectedServiceVariants = () => {
        const {proposal} = this.props;
        getServiceVariantProposal({proposal: proposal?.id}).then(resp => {
            console.log(resp.data, "getting")
            this.setState({newPricing: resp.data})
        })
            .catch(err => {
                handleError(err)
            })
    }

    getUnitName = () => {
        this.setState({fetching: true});
        getSubUnitName()
            .then((res) => {
                this.setState({allOptions: res.data});
            })
            .catch((err) => {
                handleError(err);
            })
            .finally(() => {
                this.setState({fetching: false});
            });
    };

    getTotalCost = (preTax) => {
        // const {costSetting} = this.state;
        let newPricing = this.state.newPricing || [];
        let costPricing = 0;
        newPricing.forEach((item) => {
            if (item?.manually_added) {
                const checkedValue =
                    (parseInt(item.proposal_qty) || 1) *
                    parseFloat(item.kit_pricing_value || item.item_pricing_value || 0);
                if (preTax) {
                    costPricing =
                        costPricing + (item?.include_subtotal ? checkedValue : 0);
                } else {
                    costPricing =
                        costPricing +
                        (item?.include_subtotal && item?.taxable ? checkedValue : 0);
                }
            } else {
                let pricing_value =
                    item.selectedUnit == "c"
                        ? item.hourly_price
                        : item.selectedUnit == "a"
                            ? item.price
                            : item.daily_price;
                let secondCheckedValue =
                    (parseInt(item.proposal_qty) || 1) * parseFloat(pricing_value || 0);
                if (preTax) {
                    costPricing =
                        costPricing + (item?.include_subtotal ? secondCheckedValue : 0);
                } else {
                    costPricing =
                        costPricing +
                        (item?.include_subtotal && item?.taxable ? secondCheckedValue : 0);
                }
            }
        });
        //  console.log(costPricing, "hk")
        return costPricing;
    };

    getResourcePricingCost = () => {
        let newPricing = this.props.proposal.line_item;
        let cost = 0;
        newPricing.forEach((item) => {
            const qty = parseInt(item.proposal_qty) || 1;
            if (item.table_data) {
                let totalLaborQty = 0;
                let totalLaborCost = 0;
                for (let [index, i] of item.table_data.entries()) {
                    console.log(i, "item");
                    if (i.item_type == "FLEET_GROUP") {
                        // console.log('fleet')
                        // console.log(vehicleCalculations(i.data) * qty, 'fleet')
                        cost = cost + vehicleCalculations(i.data) * qty;
                    } else if (i.item_type == "labor_child") {
                        const labor_qty = i.hours || 1;
                        totalLaborQty = totalLaborQty + (parseInt(i.hours) || 1);
                        // console.log((laborCalculations(i.data, i.time, i.name)), "laborCalculated");
                        totalLaborCost =
                            totalLaborCost +
                            (laborCalculations(i.data, i.time, i.name) * labor_qty || 0);
                        if (item.table_data[index + 1].item_type != "labor_child") {
                            // console.log(totalLaborCost, totalLaborQty, totalLaborCost / totalLaborQty, "laborCalc")
                            cost = cost + totalLaborCost / totalLaborQty;
                        }
                        // cost  = cost + ((laborCalculations(i.data, i.time, i.name) * i.labor_qty) || 0)
                    } else if (i.item_type == "SUPPLY_GROUP") {
                        cost = cost + (supplyCalculation(i.data) * qty || 0);
                    } else if (i.item_type == "INVENTORY_ITEM") {
                        console.log(
                            "inventory",
                            i?.kit_child ? parseInt(i.unit_cost) : parseInt(i.data?.unit_cost)
                        );
                        cost =
                            cost +
                            ((i?.kit_child
                                ? parseInt(i.unit_cost)
                                : parseInt(i.data?.unit_cost)) * qty || 0);
                    } else if (i.item_type == "DISPOSAL") {
                        cost = cost + (parseInt(i.data?.unit_cost) * qty || 0);
                    }
                }
            } else {
                // console.log(cost, "costSetting")
                cost = cost + parseInt(item.unit_cost) * qty;
            }
        });
        // console.log(cost, 'cost')
        return cost;
    };

    calculatedEstimatedTotal = () => {
        const estimatedTaxes = this.calculatedEstimatedTaxes();
        const estimatedTotal =
            Number(estimatedTaxes) + Number(this.getTotalCost(true));
        return estimatedTotal.toFixed(2);
    };

    calculatedEstimatedTaxes = () => {
        const estimatedTax = (this.getTotalCost() * 8.875) / 100;
        return estimatedTax.toFixed(2);
    };

    calculatedProfitMargin = () => {
        const totalPricePreTax = this.getTotalCost(true);
        const totalCost = this.getResourcePricingCost();
        const profitMargin = ((totalPricePreTax - totalCost) / totalCost) * 100;
        return profitMargin.toFixed();
    };

    fetchRegion = () => {
        getRegion()
          .then((res) => {
            this.setState({ regions: res.data.results});
          })
          .catch((err) => {
            handleError(err);
          });
    };

    render() {
        const {viewAll, proposal} = this.props;
        const {newPricing, regions} = this.state;
        return (
            <div className={`col-12 ${!this.props.viewAll ? "mt-30" : ""}`}>
                <div
                    className={`row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
                        !this.props.viewAll ? "border-1 d-none" : ""
                    }`}
                >
                    {/*<div className="search-bar-div d-flex align-items-center">
                        <Form className="position-relative">
                            <Input placeholder="Search"/>
                            <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                <img
                                    src={Images.search_icon_gray}
                                    className="img-fluid"
                                    alt="search icon"
                                />
                            </Button>
                        </Form>
                    </div>*/}
                    {viewAll && (
                        <Button
                            onClick={() => this.props.onTabChange("4")}
                            className="view-all-btn text-uppercase"
                        >
                            VIEW ALL{" "}
                        </Button>
                    )}
                </div>
                {newPricing.length > 0 ?
                    <div className="col-12 mt-3 table-responsive main-table-div position-relative wage-table view-proposal-table">
                        <div className="row mx-0 custom-table-main-row custom-table-main-row-proposal-line-item custom-table-main-row-wage-info-main proposal-update-table">
                            <div className="col-12 custom-table-change service-variants-table">
                                <div className="row custom-table-header custom-table-header-2">
                                        <div className="custom-table-cell-th custom-table-cell-th-1">
                                            <div className="custom-th-heading">Type</div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-2">
                                            <div className="custom-th-heading">Name / Info</div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-3">
                                            <div className="custom-th-heading">FACILITY</div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-4">
                                            <div className="custom-th-heading">Qty</div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-5">
                                            <div className="custom-th-heading">Uom</div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-6">
                                            <div className="custom-th-heading">
                                                Price
                                                <br/>
                                                Per unit
                                            </div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-7">
                                            <div className="custom-th-heading">Taxable</div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-8">
                                            <div className="custom-th-heading">
                                                Include
                                                <br/>
                                                In Subtotal
                                            </div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-9">
                                            <div className="custom-th-heading">Total Price</div>
                                        </div>
                                        <div className="custom-table-cell-th custom-table-cell-th-9">
                                            <div className="custom-th-heading">Document</div>
                                        </div>
                                    </div>
                                <div className="row">
                                        {newPricing?.map((n) => {
                                            // let foundRegion = regions.find(r => r.id == n.variant?.region);
                                            // console.log(foundRegion)
                                                return (
                                                    <LineItemsTableCustomMain
                                                        allOptions={this.state.allOptions}
                                                        margin={n?.margin}
                                                        newPricing={n}
                                                        child={
                                                            n?.variant_data?.table_pricing || n?.children || []
                                                        }
                                                        manually_added={n?.resource_type === "INVENTORY_KIT" ? true : false}
                                                        view
                                                        removeThreeDots
                                                        foundRegion={n.variant_data?.region}
                                                    />
                                                );
                                            })}
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="col-12 mt-3">
                        <div
                            className="row mx-0 border-0 bg-white no-data-card-row align-items-center">
                            <div className="col-12 text-center">
                                <img src={Images.line_items_empty_state_icon} alt={''} className="img-fluid"/>
                                 <h6 className="mb-0 mt-1">No Service Variants</h6>
                            </div>
                        </div>
                    </div>
                }
                <div className={`row ${!viewAll ? "custom-row-space" : ""}`}>
                    <div className="col-12 p-0">
                        <div className="row line-items-row-main">
                            <div className="col-12 col-sm-4">
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <span className="sub-total-text">Cost Setting</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="sub-total-text gray-1">
                                          {
                                              costSettingOptions.find(
                                                  (i) => proposal?.cost_setting === i.value
                                              )?.name
                                         || "Standard" }
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <span className="sub-total-text">Tax Basis</span>
                                    </div>
                                    <div className="col-12">
                                        <span
                                            className="sub-total-text gray-1">{proposal?.tax_basis?.name || "-"}</span>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <span className="sub-total-text">Payment Terms</span>
                                    </div>
                                    <div className="col-12">
                                <span className="sub-total-text gray-1">
                                {
                                    paymentOptions.find(
                                        (n) => n.value === proposal?.payment_terms
                                    )?.name
                                || "30 Days" }
                                </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <span className="sub-total-text">Deposit</span>
                                    </div>
                                    <div className="col-12">
                                        <span className="sub-total-text gray-1">
                                          {proposal?.deposit === "YES" ? "Yes" : proposal?.deposit === "NO" ? "No" : "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-7 offset-sm-1">
                                {/* <div className="row estimated-total-row">
                                    <div className="col-8">
                                        <span className="sub-total-text">Estimated Cost:</span>
                                    </div>
                                    <div className="col-4 text-md-right">
                                    <span className="sub-total-text gray-1"> */}
                                      {/* ${this.getResourcePricingCost()} */}
                                        {/* ${formatPrice(proposal?.estimated_cost) || 0.00}
                                    </span>
                                    </div>
                                </div> */}
                                {/* <div className="row estimated-total-row">
                                    <div className="col-8">
                                        <span className="sub-total-text">Profit Margin:</span>
                                    </div>
                                    <div className="col-4 text-md-right">
                    <span className="sub-total-text gray-1"> */}
                      {/* {this.calculatedProfitMargin()}% */}
                        {/* {proposal?.profit_margin == 0 ? "-" : proposal?.profit_margin} %
                    </span>
                                    </div>
                                </div> */}
                                <div className="row estimated-total-row">
                                    <div className="col-8">
                    <span className="sub-total-text">
                      Estimated Total Price Pre-tax:
                    </span>
                                    </div>
                                    <div className="col-4 text-md-right">
                    <span className="sub-total-text gray-1">
                    {(proposal?.cost_setting == "LUMP_SUM") 
                    ||
                        (proposal?.cost_setting == "LUMP_SUM_WITH_UOM_AND_QTY") 
                        ?
                        <>${formatPrice(proposal?.estimated_total_price_pre_tax)}</>
                        :
                        <>${formatPrice(proposal?.estimated_total_price_pre)}</>
                    }
                        {/* ${this.getTotalCost(true)} */}
                    </span>
                                    </div>
                                </div>
                                <div className="row estimated-total-row">
                                    <div className="col-7">
                                        <span className="sub-total-text">Estimated Taxes:</span>
                                    </div>
                                    <div className="col-5 text-md-right">
                                        <ul className="list-inline mb-0">
                                            <li className="list-inline-item">
                                                <small>{proposal?.tax_basis?.percentage != 0 ? proposal?.tax_basis?.percentage : "-"}%</small>
                                            </li>
                                            <li className="list-inline-item">|</li>
                                            <li className="list-inline-item">
                        <span className="sub-total-text gray-1">
                          {/* ${this.calculatedEstimatedTaxes()} */}
                            ${formatPrice(proposal?.estimated_taxes) || 0.00}
                        </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`${
                          proposal?.cost_setting == "TOTAL_PRICE_PER_UNIT" &&
                          "normal-text"
                        } row estimated-total-row-3 estimated-total-row`}>
                                    <div className="col-7">
                    <span className="sub-total-text-main">
                      Estimated Total:
                    </span>
                                    </div>
                                    <div className="col-5 text-md-right">
                                    {(proposal?.cost_setting == "LUMP_SUM" || proposal?.cost_setting == "LUMP_SUM_WITH_UOM_AND_QTY") &&
                        <span className="sub-total-text cut-text mr-2">
                            ${proposal?.standard_estimated_total}
                          </span>
                        }
                    <span className="sub-total-text-main">
                      {/* ${this.calculatedEstimatedTotal()} */}
                        ${formatPrice(proposal?.estimated_total)?.toLocaleString()}
                    </span>
                                    </div>
                                </div>
                                <div className="row estimated-total-row-2 pt-1 pb-0 estimated-total-row">
                                    {/* <div className="col-7">
                                        <span className="sub-total-text">Estimated Profit:</span>
                                    </div>
                                    <div className="col-5 text-md-right">
                                        <ul className="list-inline mb-0">
                                            <li className="list-inline-item">
                                                <small>{proposal?.profit_margin == 0 ? "-" : proposal?.profit_margin} %</small>
                                            </li>
                                            <li className="list-inline-item">|</li>
                                            <li className="list-inline-item">
                                                <span className="sub-total-text gray-1">
                                                     
                                                    ${formatPrice(proposal?.estimated_profit) || 0.00}
                                                </span>
                                            </li>
                                        </ul>
                                    </div> */}
                                </div>
                                {/*<div className="row estimated-total-row-4 estimated-total-row">*/}
                                {/*    <div className="col-12">*/}
                                {/*        <small*/}
                                {/*            className="small-text-main position-relative small-text-main-2">Taxes*/}
                                {/*            are calculated by customer’s billing address</small>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {proposal?.cost_setting === "TOTAL_PRICE_PER_UNIT" && (
                        <>
                          <div className="row estimated-total-row-2 pt-1 pb-0 estimated-total-row align-items-center">
                            <div className="col-5">
                              <span className="sub-total-text">
                                Total Unit:
                              </span>
                            </div>
                            <div className="col-7 text-md-right value-div-inner">
                              <ul className="list-inline mb-0">
                                <li className="list-inline-item">
                                  <Input disabled placeholder={proposal?.proposal_uom ? `${proposal?.proposal_uom?.name} (${proposal?.proposal_uom?.symbol})` : "Select"} />
                                </li>
                                <li className="list-inline-item">
                                  <InputNumber
                                    disabled
                                    value={proposal?.total_units || 0}
                                  />
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="row estimated-total-row-2 pt-3 pb-0 estimated-total-row">
                            <div className="col-5">
                              <span className="sub-total-text-main">
                                Price Per Unit:
                              </span>
                            </div>
                            <div className="col-7 text-md-right">
                              <span className="sub-total-text-main">
                                $ {formatPrice(proposal?.price_per_unit)}
                                {/* {
                                (
                                  this.calculatedEstimatedTotal() /
                                  (this.state.units || 1)
                                ).toFixed(2)}{" "} */}
                                {proposal?.proposal_uom &&
                                   ` / ${proposal?.proposal_uom?.symbol} `
                                }
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="row estimated-total-row-4 estimated-total-row">
                        <div className="col-12">
                          <small className="small-text-main position-relative small-text-main-2">
                            Taxes are calculated by customer’s billing address
                          </small>
                        </div>
                      </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`row bullet-point-row ${
                        !viewAll ? "custom-row-space" : ""
                    }`}
                >
                    <div className="col-12 col-sm-4">
                        <div className="row">
                            <div className="col-12 mb-1">
                                <span className="sub-total-text">Qualifiers</span>
                            </div>
                            {proposal?.qualifiers?.split('^')?.map(item => {
                                return (
                                <div className="col-12">
                                <span className="sub-total-text gray-1">{item != "<br>"? ('•'+" "+item).replace(/\&nbsp;/g, ''):""}</span>
                                </div>
                            )
                            })
                            }
                            {/* <div className="col-12">
                                <span className="sub-total-text gray-1">• Bullet point</span>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-12 col-sm-7 offset-sm-1">
                        <div className="row">
                            <div className="col-12 mb-1">
                                <span className="sub-total-text">Comments</span>
                            </div>
                            {proposal?.comments?.split('^')?.map(item => {
                                return (
                                    <div className="col-12">
                                        <span className="sub-total-text gray-1">{item != "<br>" ? ('•' + " " + item).replace(/\&nbsp;/g, '') : ""}</span>
                                    </div>
                                );
                            })}
                           { /* <div className="col-12">
                                <span className="sub-total-text gray-1">• Bullet point</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewProposalLineItems;
