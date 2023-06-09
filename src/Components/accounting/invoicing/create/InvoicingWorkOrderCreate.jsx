import React, {Component} from 'react';
import {Button, Collapse, DatePicker, Dropdown, Form, Input, InputNumber, Menu, message, Select, Spin} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from '../../../Images'
import {costSettingOptions, paymentOptions} from "../../../../Controller/proposalServiceVariantDropdown";
import {formatPrice, getShortName} from "../../../../Controller/utils";
import Bullet from "../../../Bullet";
import { getInvoiceProjectWorkorder, getInvoiceWorkorder, postInvoiceWorkorder, removeInvoiceWorkorder, updateInvoice, updateInvoiceWorkorder } from '../../../../Controller/api/invoiceServices';
import InvoicingWorkorderTableCreate from "./InvoicingWorkorderTableCreate";
import { handleError } from '../../../../Controller/Global';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { getTaxBasisOptions } from '../../../../Controller/api/proposalServices';
import CommonWarningModal from '../../../modals/CommonWarningModal';



const layout = {
    labelCol: {span: 24}, wrapperCol: {span: 24},
};
const {Panel} = Collapse;
const {Option} = Select;
const {TextArea, Search} = Input;


class InvoicingWorkOrderCreate extends Component {

   formRef = React.createRef();

    state = {
        invoiceWorkorder: [],
        fetching: false,
        invoiceData: null,
        page: 1,
        searchValue: null,
        taxBasisOptions: [],
        totalCount: 0,
        totalPriceTax: "$0.00",
        parsedValue: null,
        depositReceive: "$0.00",
        priceModalVisible: false,
        priceTaxValue: null,
    }

    componentDidMount() {
      const { Invoice } = this.props;
        this.getTaxBasisOptions()
        if(Invoice) {
        this.formRef.current.setFieldsValue({
            cost_setting: costSettingOptions.find((i) => Invoice?.cost_setting === i.value)?.name || "STANDARD",
            payment_terms: Invoice?.payment_terms || "30_DAYS",
            deposit: Invoice?.deposit || null,
            deposit_amt: Invoice?.deposit_amount,
            tax_basis: Invoice?.tax_basis
            ? {
                label: Invoice?.tax_basis?.name,
                value: Invoice?.tax_basis?.id,
                key: Invoice?.tax_basis?.id,
              }
            : undefined,
        })
        // this.setState({totalPriceTax: `$${Invoice?.estimated_total_price_pre_tax}.00`})
        if(Invoice?.estimated_total_price_pre_tax) {
           this.setState({totalPriceTax: `$${Invoice?.estimated_total_price_pre_tax}`})
          } 
        if(Invoice?.deposit_amount) {
            this.setState({depositReceive: `$${Invoice?.deposit_amount}`})
        }
    }

    }

    componentDidUpdate(prevProps,prevState) {
        const { Invoice } = this.props;
        if(prevProps.Invoice != Invoice) {
            this.formRef.current.setFieldsValue({
                cost_setting: costSettingOptions.find((i) => Invoice?.cost_setting === i.value)?.name || "STANDARD",
                payment_terms: Invoice?.payment_terms || "30_DAYS",
                deposit: Invoice?.deposit || null,
                deposit_amt: Invoice?.deposit_amount || null,
                tax_basis: Invoice?.tax_basis
                ? {
                    label: Invoice?.tax_basis?.name,
                    value: Invoice?.tax_basis?.id,
                    key: Invoice?.tax_basis?.id,
                  }
                : undefined,
            })
            this.setState({totalPriceTax: `$${Invoice?.estimated_total_price_pre_tax}.00`})
            this.setState({depositReceive: `$${Invoice?.deposit_amount}`})

        }

    }

    fetchWorkorders = (params={}) => {
       params = {
            project: this.props.Invoice?.project?.id,
            invoice: this.props.Invoice?.id,
            search: params.search

        }
        this.setState({fetching: true})
    
        getInvoiceWorkorder(params).then(res => {
            this.setState({invoiceWorkorder: res.data.results, fetching: false})
        }).catch((err) => {
            handleError(err)
        })
    
    }

    handleWorkorder = (data) => {
        const params = {
            workorder: data,
            invoice: this.props.Invoice?.id
        }
        postInvoiceWorkorder(params).then(res => {
            this.props.fetchInvoice(this.props.Invoice.id)

            this.formRef.current.setFieldsValue({
                work_order: ""
            })

        }).catch((err) => {
            handleError(err)
        })

    }

    handlUpdateData = (data,ID) => {
        updateInvoiceWorkorder(ID,data).then(res => {
            this.props.fetchInvoice(this.props.Invoice.id)
        }).catch((err) => {
            handleError(err)
        })

    }

    handleRemoveWorkorder = (id) => {
        removeInvoiceWorkorder(id).then(res => {
            this.props.fetchInvoice(this.props.Invoice.id)
        }).catch((err) => {
            handleError(err);
        })
    }

    handleSubmit = () => {
        message.success("Invoice updated successfully")
        this.props.setInvoice(this.props.Invoice, 3);
    }

    getTaxBasisOptions = () => {
        const { searchValue } = this.state;
        const params = {
          search: searchValue,
          page: this.state.page,
        };
        getTaxBasisOptions()
          .then((res) => {
            if (this.state.page === 1) {
              this.setState({ taxBasisOptions: res.data.results });
            } else {
              this.setState((prevState) => {
                return {
                  taxBasisOptions: [
                    ...prevState.taxBasisOptions,
                    ...res.data.results,
                  ],
                  totalCount: res.data.count,
                };
              });
            }
          })
          .catch((err) => {
            handleError(err);
          });
      };

    handleDataSubmit = (values) => {
       updateInvoice(this.props.Invoice.id, values).then(res => {
        this.props.fetchInvoice(this.props.Invoice.id)
       }).catch((err) => {
        handleError(err);
       })
    }

    handleTaxBasisChange = (value) => {
        let ID = value.value
        this.handleDataSubmit({tax_basis: ID})

    }

    handlePaymentTerms = (value) => {
        this.handleDataSubmit({payment_terms: value})
    }

    handleDeposit = (value) => {
        this.handleDataSubmit({deposit: value})
    }

    handleTotalPriceTax = (val) => {
    let value = val?.toString() || "0";
    let parseVal = value?.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, { minimumFractionDigits: 2 });
    let moneyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    let totalPrice = moneyFormatter.format(parseVal);

    this.setState({totalPriceTax: totalPrice},() => {
      const parseVal = totalPrice
          ?.replace(/\$\s?|(,*)/g, "")
          .toLocaleString(undefined, { minimumFractionDigits: 2 });
         
          this.setState({parsedValue: parseVal},() => {
            this.handleDataSubmit({estimated_total_price_pre_tax: this.state.parsedValue })
          })

    })
    }

    handleDepositData = (val) => {
        let value = val?.toString() || "0";
        let parseVal = value?.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, { minimumFractionDigits: 2 });
        let moneyFormatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
    
        let depositAmount = moneyFormatter.format(parseVal);
       
        this.setState({depositReceive: depositAmount},() => {
          const parseVal = depositAmount
              ?.replace(/\$\s?|(,*)/g, "")
              .toLocaleString(undefined, { minimumFractionDigits: 2 });
    
              this.setState({parsedValue: parseVal},() => {
                this.handleDataSubmit({deposit_amount: this.state.parsedValue })
              })
    
        })

    }

    handlePricePreTax = (data, val) => {
        if(this.state.totalPriceTax !== val) {
       this.setState({priceModalVisible: data,priceTaxValue: val})
        }

    }
 
    render() {
        const { fetching, taxBasisOptions } = this.state
        const { Invoice } = this.props;
        let selectedWorkorders = (this.props.Invoice?.invoice_workorder)?.reverse();
        // selectedWorkorders = [...selectedWorkorders?.reverse()]
        return (<React.Fragment>
            <div className="row common-form-card-row">
                <div className="col-12">
                    <div className="row info-gray-div align-items-center">
                        <h6 className="mb-0">The invoice will be generated based on Work Order Dispatch
                            information.</h6>
                    </div>
                </div>
                <div className="col-12 p-0">
                    <Form
                        ref={this.formRef}
                        onFinish={this.handleSubmit}
                        {...layout}
                        hideRequiredMark={true}
                        className="main-inner-form"
                    >
                        <div className="row">
                            <div className="col-12">
                                <Form.Item
                                    name="work_order"
                                    label="Work Order *"
                                    className="position-relative"
                                >
                                    {/* <Input placeholder="Search"/> */}
                                    <Select
                                     showSearch
                                     notFoundContent={
                                        fetching ? <Spin size="small" /> : null
                                    }
                                     placeholder={"search"}
                                     onChange={this.handleWorkorder}
                                     onFocus = {this.fetchWorkorders}
                                     onSearch={(e) => this.fetchWorkorders({search: e})}
                                    >
                                    {this.state.invoiceWorkorder.map(i => (
                                          <Select.Option value={i.id}>{i.project?.name}</Select.Option>

                                    ))
    }
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="col-12">
                            {selectedWorkorders?.length > 0 && selectedWorkorders.map((i,index) => (
                                <Collapse
                                    bordered={false}
                                    defaultActiveKey={[`${index + 1}`]}
                                    expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                                    className="invoicing-inner-collapse"
                                >
                                    <Panel key={index+1} forceRender={true} header={<div className="col-12">
                                        <div className="row align-items-center">
                                            <div className="col-12 col-sm-1">
                                                <img src={Images.work_order_key} alt="" className="img-fluid"/>
                                            </div>
                                            <div className="col-12 col-sm-11 pl-0 position-relative">
                                            <Dropdown
                                              overlayClassName="add-remove-dropdown-main"
                                              placement="bottomCenter"
                                              overlay={
                                                <Menu>
                                                  <Menu.Item
                                                    // onClick={() => this.handleDeleteContact(item, contact.id)}
                                                    onClick={() =>
                                                     this.handleRemoveWorkorder(i.id)
                                                    }
                                                    key="0"
                                                  >
                                                    <Button className="bg-transparent border-0 shadow-none p-0">
                                                      Remove
                                                    </Button>
                                                  </Menu.Item>
                                                </Menu>
                                              }
                                              trigger={["click"]}
                                            >
                                            <Button
                                                className="bg-transparent mr-3 position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                                onClick={(e) =>
                                                //   e.preventDefault()
                                                  e.stopPropagation()
                                                }
                                              >
                                                <img
                                                  src={
                                                    Images.black_dots_elipsis
                                                  }
                                                  alt=""
                                                  className="img-fluid"
                                                />
                                              </Button>
                                              </Dropdown>
                                                <h6 className="mt-0 mb-0">{i.workorder?.project?.name}</h6>
                                                <p style={{
                                                    color: '#BDBDBD', fontWeight: '600', fontSize: '13px'
                                                }} className="mb-0">Total Balance Due: $12,000.00</p>
                                            </div>
                                        </div>
                                    </div>}>
                                        <div className="row">
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                    name="date"
                                                    label={"Service Date"}
                                                    rules={[{
                                                        required: true, message: 'this field is required'
                                                    }]}
                                                    className="position-relative"
                                                >
                                                    <DatePicker
                                                    defaultValue={i?.service_date ? moment(i?.service_date) : null}
                                                    onChange={(e) => this.handlUpdateData({service_date: moment(e).format("YYYY-MM-DD") || null,},i.id)}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                    name="po_job" label={"Billing Account PO# / Job#"}
                                                    rules={[{
                                                        required: true, message: 'this field is required'
                                                    }]}>
                                                    <Input 
                                                    placeholder="#" 
                                                    defaultValue={i?.billing_account_po || "-"}
                                                    onBlur={(e) => this.handlUpdateData({billing_account_po: e.target.value},i.id)}
                                                    />
                                                </Form.Item>
                                            </div>
                                            <div className="col-12">
                                                <Form.Item
                                                    name="description"
                                                    label={"Description"}
                                                    className="position-relative"
                                                >
                                                    <TextArea
                                                        className="text-area-main text-area-task"
                                                        placeholder="Description"
                                                        defaultValue={i?.description || "-"}
                                                        onBlur={(e) => this.handlUpdateData({description: e.target.value},i.id)}
                                                    />
                                                </Form.Item>
                                            </div>
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
                         
                                </Collapse>
                                ))
                            }
                         </div>
                        </div>
                        {/*/*DO NOT REMOVE COMMENTED CODE BELOW*!/*/}
                        <div className="row">
                            <div className="col-12 p-0">
                                <div className="row service-row-main service-line-item">
                                    <div className="col-12 col-sm-4">
                                        <div className="row">
                                            <div className="col-12">
                                                <Form.Item
                                                    name="cost_setting"
                                                    label={"Cost Setting Options *"}
                                                    rules={[{
                                                        required: true, message: "this field is required",
                                                    },]}
                                                >
                                                    <Select
                                                        suffixIcon={<img
                                                            alt=""
                                                            src={Images.caret_down_small_select}
                                                            className="img-fluid"
                                                        />}
                                                        defaultValue={"STANDARD"}
                                                        // onChange= {this.handleCostSetting}
                                                        placeholder="Select"
                                                        // onChange={this.handleCostSettingChange}
                                                    >
                                                        {/* {costSettingOptions.map(i => {
                                                            return ( */}
                                                            <Option>Standard</Option>
                                                            {/* )
                                                            })} */}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            <div className="col-12">
                                                <Form.Item
                                                    name="tax_basis"
                                                    className="search-small-icon-position"
                                                    label={"Tax Basis *"}
                                                    rules={[{
                                                        required: true, message: "this field is required",
                                                    },]}
                                                >
                                                     <Select
                            labelInValue
                            showSearch
                            onSearch={(value) => {
                              this.setState(
                                { page: 1, searchValue: value },
                                () => {
                                  this.getTaxBasisOptions();
                                }
                              );
                            }}
                            placeholder="Select"
                            filterOption={false}
                            // onChange={(e) => this.handleTotalInvoice(e)}
                            onPopupScroll={(e) => {
                              e.persist();
                              let target = e.target;
                              if (
                                taxBasisOptions.length !== this.state.totalCount
                              ) {
                                if (
                                  target.scrollTop + target.offsetHeight ===
                                  target.scrollHeight
                                ) {
                                  this.setState(
                                    { page: this.state.page + 1 },
                                    () => this.getTaxBasisOptions()
                                  );
                                }
                              }
                            }}
                            onChange={this.handleTaxBasisChange}
                          >
                            {/* <Search placeholder="Search and Select" /> */}
                            {taxBasisOptions.map((i) => {
                              return (
                                <Option key={i.id} value={i.id}>
                                  {i.name} - {i.percentage}
                                </Option>
                              );
                            })}
                          </Select>
                                                </Form.Item>
                                            </div>
                                            <div className="col-12">
                                                <Form.Item
                                                    name="payment_terms"
                                                    label={"Payment Terms *"}
                                                    rules={[{
                                                        required: true, message: "this field is required",
                                                    },]}
                                                >
                                                    <Select
                                                        suffixIcon={<img
                                                            alt=""
                                                            src={Images.caret_down_small_select}
                                                            className="img-fluid"
                                                        />}
                                                        placeholder="Select"
                                                        onChange={this.handlePaymentTerms}
                                                    >
                                                        {paymentOptions.map(i => {
                                                            return (
                                                            <Option value={i.value}>{i.name}</Option>
                                                            )
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            <div className="col-12">
                                                <Form.Item
                                                    name="deposit"
                                                    label={"Deposit *"}
                                                    rules={[{
                                                        required: true, message: "this field is required",
                                                    },]}
                                                >
                                                    <Select
                                                        suffixIcon={<img
                                                            alt=""
                                                            src={Images.caret_down_small_select}
                                                            className="img-fluid"
                                                        />}
                                                        placeholder="Select"
                                                        onChange={this.handleDeposit}
                                                    >
                                                        <Option value={"YES"}>Yes</Option>
                                                        <Option value={"NO"}>No</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            <div className="col-12">
                                                <Form.Item
                                                    name="deposit_amt"
                                                    label={"Deposit Amount *"}
                                                    rules={[{
                                                        required: true, message: "this field is required",
                                                    },]}
                                                >
                                                    <Input disabled={true} 
                                                    placeholder="$0.00"
                                                    defaultValue={`$${Invoice?.deposit_amount}` || null}
                                                    />
                                                </Form.Item>
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
                                                <InputNumber 
                                                // placeholder="$5,000.00"
                                                value={this.state.totalPriceTax}
                                                // onBlur={(e) => this.handleTotalPriceTax(e.target.value)}
                                                onBlur = {(e) => this.handlePricePreTax(true,e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="row estimated-total-row">
                                            <div className="col-7">
                                                <span className="sub-total-text">Taxes::</span>
                                            </div>
                                            <div className="col-5 text-md-right">
                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item">
                                                        <small> {Invoice?.tax_basis?.percentage != 0
                                ? Invoice?.tax_basis?.percentage
                                : "-"}
                              %</small>
                                                    </li>
                                                    <li className="list-inline-item">|</li>
                                                    <li className="list-inline-item">
                                                    <span className="sub-total-text gray-1">
                                                    {formatPrice(Invoice?.estimated_taxes) || 0.0}
                                                    </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="row estimated-total-row">
                                            <div className="col-7">
                                                <span className="sub-total-text-main">Total:</span>
                                            </div>
                                            <div className="col-5 text-md-right">
                                                <span className="sub-total-text">${formatPrice(Invoice?.standard_estimated_total)}</span>
                                            </div>
                                        </div>
                                        <div className="row estimated-total-row">
                                            <div className="col-8">
                                            <span className="sub-total-text">
                                              Deposit Recieved:
                                            </span>
                                            </div>
                                            <div className="col-4 text-md-right">
                                                <InputNumber
                                                //  placeholder="- $500.00 "
                                                value={this.state.depositReceive}
                                                onBlur={(e) => this.handleDepositData(e.target.value)}
                                                 />
                                            </div>
                                        </div>
                                        <div style={{borderTop: '1px solid #E0E0E0'}}
                                             className="row mt-3 pt-3 estimated-total-row-3 estimated-total-row">
                                            <div className="col-7">
                                                <span className="sub-total-text-main">Total Balance Due:</span>
                                            </div>
                                            <div className="col-5 text-md-right">
                                                <span className="sub-total-text-main">${formatPrice(Invoice?.total_balance) || 0.0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 validate-div-col validate-div-col-line-items text-md-right">
                                <Button
                                    // onClick={() => this.formRef.current.submit()}
                                    onClick={this.handleSubmit}
                                    className="validate-btn-main"
                                >
                                    Save and Continue
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            <CommonWarningModal
            visible = {this.state.priceModalVisible}
            totalPricingWarning
            changeTotalPriceTax={() => {
                this.handleTotalPriceTax(this.state.priceTaxValue)
                this.handlePricePreTax(false)
            }}
            onClose={() => {
               this.handlePricePreTax(false)
            }}
            heading={
                "Are you sure you want to change Total Price Pre-tax?"
              }
              subHeadingUOM={
                "If you change Total Price Pre-tax, the only way to return to the original number is to input it."
              }
             />
        </React.Fragment>);
    }
}

export default withRouter(InvoicingWorkOrderCreate);


