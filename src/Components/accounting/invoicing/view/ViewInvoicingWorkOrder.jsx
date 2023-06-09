import React, {Component} from 'react';
import {Collapse} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from '../../../Images'
import InvoicingWorkorderTableCreate from '../create/InvoicingWorkorderTableCreate';
import { costSettingOptions, paymentOptions } from '../../../../Controller/proposalServiceVariantDropdown';
import { formatPrice } from '../../../../Controller/utils';


const {Panel} = Collapse

class InvoicingWorkOrderView extends Component {
    
    render() {
        const { Invoice } = this.props;
        const selectedWorkorders = this.props.Invoice?.invoice_workorder;
        return (<React.Fragment>
            <div className="row create-opportunity-row common-form-card-row">
                <div className="col-12 p-0">
                    <div className="row">
                        <div className="col-12">
                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1']}
                                expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                className="invoicing-inner-collapse"
                            >
                           {selectedWorkorders?.length > 0 && selectedWorkorders.map((i,index) => (
                                <Panel header={<div className="col-12">
                                    <div className="row align-items-center">
                                        <div className="col-12 col-sm-1">
                                            <img src={Images.work_order_key} alt="" className="img-fluid"/>
                                        </div>
                                        <div className="col-12 col-sm-11 pl-0">
                                            <h6 className="mt-0 mb-0">{i.workorder?.project?.name}</h6>
                                            <p style={{
                                                color: '#BDBDBD', fontWeight: '600', fontSize: '13px'
                                            }} className="mb-0">{`Total Balance Due:${i?.total_balance}`}</p>
                                        </div>
                                    </div>
                                </div>} key="1">
                                    <div className="row">
                                        <div className="col-12">
                                        {i.workorder?.dispatch?.crew_chief &&  (
                                            <div
                                                className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main mb-4 mt-0"
                                                style={{minHeight: '68px', height: '68px'}}>
                                                <div className="col-12 align-items-center d-flex">
                                                    <div className="user-icons-div">
                                                                        <span
                                                                            className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">{`${i.workorder?.dispatch?.crew_chief?.split(" ")[0]?.split("")[0]}${i.workorder?.dispatch?.crew_chief?.split(" ")[1]?.split("")[0]}`}</span>
                                                    </div>
                                                    <div className="user-info-div pt-0">
                                                        <h6 className="mb-0">{i.workorder?.dispatch?.crew_chief}</h6>
                                                        <span
                                                            className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">Crew Chief</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        </div>
                                        <div className="col-12">
                                            <div className="row">
                                            <React.Fragment>

<div className="col-12 custom-table-body p-0">
            </div>
            {/*{this.state.newPricing.length > 0 ? (*/}
                <div className="col-12 table-responsive main-table-div position-relative wage-table px-3">
                    <div
                        className="row mx-0 custom-table-main-row custom-table-main-row-proposal-line-item custom-table-main-row-wage-info-main proposal-update-table proposal-update-table-edit invoice-table-main">
                        <div className="col-12 custom-table-change service-variants-table">
                            <div className="row custom-table-header custom-table-header-2">
                                <div className="custom-table-cell-th custom-table-cell-th-1">
                                    <div className="custom-th-heading">Type</div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-2">
                                    <div className="custom-th-heading">
                                        Name / Info
                                    </div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-3">
                                    <div className="custom-th-heading">
                                        ASSIGNEE
                                    </div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-4">
                                    <div className="custom-th-heading">
                                        FACILITY
                                    </div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-5">
                                    <div className="custom-th-heading">Qty</div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-6">
                                    <div className="custom-th-heading">Uom</div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-7">
                                    <div className="custom-th-heading">
                                        Price
                                        <br/>
                                        Per unit
                                    </div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-8">
                                    <div className="custom-th-heading">Taxable</div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-9">
                                    <div className="custom-th-heading">
                                        Include
                                        <br/>
                                        In Subtotal
                                    </div>
                                </div>
                                <div className="custom-table-cell-th custom-table-cell-th-9">
                                    <div className="custom-th-heading">
                                        Total Price
                                    </div>
                                </div>
                                {/* <div className="custom-table-cell-th custom-table-cell-th-9">
                                    <div className="custom-th-heading">
                                        Document
                                    </div>
                                </div> */}
                            </div>
                            <div className="row">
                            {i?.workorder?.workorder_variant.map(n  => {
                                return (
                                <InvoicingWorkorderTableCreate
                                key={n.id}
                                invoiceVariant={n}
                                child={
                                n?.variant_data?.table_pricing || n?.children || []
                                }
                                foundRegion = {n?.variant_data?.region}
                                />
                                )
                            })
                        }
                            </div>
                        </div>
                    </div>
                </div>
            {/*) : (*/}
            {/*    <div className="col-12 mt-3">*/}
            {/*        <div className="row mx-0 no-data-card-row align-items-center justify-content-center">*/}

            {/*            <div className="col-12 text-center">*/}
            {/*                <img*/}
            {/*                    src={Images.line_items_empty_state_icon}*/}
            {/*                    alt={""}*/}
            {/*                    className="img-fluid"*/}
            {/*                />*/}
            {/*                <h6 className="mb-0">No Service Variants</h6>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </React.Fragment>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                           ))}
                            </Collapse>
                        </div>
                    </div>
                    {/*/*DO NOT REMOVE COMMENTED CODE BELOW*!/*/}
                    <div className="row">
                        <div className="col-12 p-0">
                            <div className="row service-row-main service-line-item">
                                <div className="col-12 col-sm-4">
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <div className="sub-total-text">Cost Setting</div>
                                            <div className="sub-total-text gray-1">{costSettingOptions.find((i) => Invoice?.cost_setting === i.value)?.name || "Standard" }</div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className="sub-total-text">Tax Basis</div>
                                            <div className="sub-total-text gray-1"> {Invoice?.tax_basis?.name || "-"}</div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className="sub-total-text">Payment Terms</div>
                                            <div className="sub-total-text gray-1">{paymentOptions.find((n) => n.value === Invoice?.payment_terms)?.name || "30 Days" }</div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <div className="sub-total-text">Deposit</div>
                                            <div className="sub-total-text gray-1"> {Invoice?.deposit === "YES" ? "Yes" : Invoice?.deposit === "NO" ? "No" : "-"}</div>
                                        </div>
                                        <div className="col-12">
                                            <div className="sub-total-text">Deposit Amount</div>
                                            <div className="sub-total-text gray-1"> {Invoice?.deposit_amount ? `$${Invoice?.deposit_amount}` : `$0.00`}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-7 offset-sm-1 pt-4">
                                    <div className="row estimated-total-row">
                                        <div className="col-8">
                                            <span className="sub-total-text">
                                              Total Price Pre-tax:
                                            </span>
                                        </div>
                                        <div className="col-4 text-md-right">
                                            <span>${formatPrice(Invoice?.estimated_total_price_pre_tax)} </span>
                                        </div>
                                    </div>
                                    <div className="row estimated-total-row">
                                        <div className="col-7">
                                            <span className="sub-total-text">Taxes::</span>
                                        </div>
                                        <div className="col-5 text-md-right">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <small> {Invoice?.tax_basis?.percentage != 0 ? Invoice?.tax_basis?.percentage : "-"}</small>
                                                </li>
                                                <li className="list-inline-item">|</li>
                                                <li className="list-inline-item">
                                                    <span className="sub-total-text gray-1">
                                                    ${formatPrice(Invoice?.estimated_taxes) || 0.00}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="row estimated-total-row">
                                        <div className="col-7">
                                            <span className="sub-total-text">Total:</span>
                                        </div>
                                        <div className="col-5 text-md-right">
                                            <span> ${Invoice?.standard_estimated_total}</span>
                                        </div>
                                    </div>
                                    <div className="row estimated-total-row">
                                        <div className="col-8">
                                            <span className="sub-total-text">
                                              Deposit Recieved:
                                            </span>
                                        </div>
                                        <div className="col-4 text-md-right">
                                            <span>${Invoice?.deposit_amount}</span>
                                        </div>
                                    </div>
                                    <div style={{borderTop: '1px solid #E0E0E0'}}
                                         className="row mt-3 pt-3 estimated-total-row-3 estimated-total-row">
                                        <div className="col-7">
                                            <span className="sub-total-text-main">Total Balance Due:</span>
                                        </div>
                                        <div className="col-5 text-md-right">
                                            <span className="sub-total-text-main">${Invoice?.total_balance}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>)

    }
}

export default InvoicingWorkOrderView;


