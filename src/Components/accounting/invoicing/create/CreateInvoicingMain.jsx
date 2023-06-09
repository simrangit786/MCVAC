import React, {Component} from 'react';
import {Button, Collapse} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import CommonConfirmationModal from '../../../modals/CommonConfirmationModal';
import CommonWarningModal from '../../../modals/CommonWarningModal';
import InvoicingGeneralInfoCreate from "./InvoicingGeneralInfoCreate";
import {setBreadcrumb} from "../../../../Store/actions/breadcrumbAction";
import {connect} from "react-redux";
import InvoicingWorkOrderCreate from "./InvoicingWorkOrderCreate";
import InvoicingBillingAccountsCreate from "./InvoicingBillingAccountsCreate";
import InvoicingSiteManagerAccountCreate from "./InvoicingSiteManagerAccountCreate";
import InvoicingDocumnetsCreate from "./InvoicingDocumentsCreate";
import { addInvoicePdf, getInvoiceById } from '../../../../Controller/api/invoiceServices';
import { handleError } from '../../../../Controller/Global';
import { getActiveKey } from '../../../../Controller/utils';
import { withRouter } from 'react-router-dom';
import { history } from '../../../../Controller/history';
import { reverse } from 'named-urls/src';
import { routes } from '../../../../Controller/Routes';
import InvoicingDocumentsCreate from './InvoicingDocumentsCreate';


const {Panel} = Collapse;

class CreateInvoicingMain extends Component {
    state = {
        invoice: null,
        activeKey: ["1"],
        requiredSuccessModalVisible: false,
        visibleConfirm: false,
        warningModalVisible: false,
        invoiceComplete: false,
        unsavedExit: false,
    };
    showWarningModal = (visible) => {
        this.setState({
            warningModalVisible: visible,
        });
    };
    showConfirmModal = (visibleConfirm) => {
        this.setState({
            visibleConfirm
        });
    };
    showRequiredSuccessModal = (visible) => {
        this.setState({
            requiredSuccessModalVisible: visible,
        });
    };
    collapseOnChange = (activeKey) => {
        this.setState({activeKey});
    };
    handleViewMainButtonCLick = () => {
        this.showConfirmModal(true);
    };

    fetchInvoice = (id) => {
        getInvoiceById(
            this.props.match.params?.id ? this.props.match.params?.id : id
        ).then((res) => {
            this.setState({invoice: res?.data})
            })
            .catch((err) => {
                handleError(err);
            });
    };

    setInvoice = (invoice, num) => {
        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    invoice,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
                };
            });
        } else {
            this.setState({invoice})
        }
        // this.setState({proposal, activeKey: getActiveKey(this.state.activeKey, "5")})
    };

    componentDidMount() {
        let arr = [];
        if (this.props.match.params?.id) {
          this.fetchInvoice();
          arr = [{ title: 'Edit Invoice', url: '' }]
          this.setState({ activeKey: this.props.location.editTab || "1" })
        }
        else {
          arr = [{ title: 'Create Invoice', url: '' }]
        }
        this.props.setBreadcrumb(arr)
      }

      handleDocumentPdf = () => {
        const params = {
            invoice: this.state.invoice?.id
        }
        addInvoicePdf(params).then(
            (r) => {
                // window.open(URL.createObjectURL(r.data))
            }
        ).catch(err => {
            handleError(err)
        })
    }


    render() {
        let {invoice, activeKey, regions, workorderComplete } = this.state;

        return (<React.Fragment>
            <div className="main-content-div">
                <div className="row mx-0 create-opportunity-row">
                    <div className="col-12 col-sm-10">
                        <Collapse
                            onChange={this.collapseOnChange}
                            defaultActiveKey={["1"]}
                            activeKey={activeKey}
                            expandIcon={({isActive}) => (<CaretRightOutlined rotate={isActive ? 90 : 0}/>)}
                        >
                            <Panel
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">
                                            General Information <sup>*</sup>
                                        </h5>
                                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                    </div>
                                </div>}
                                key="1"
                            >
                            
                                <InvoicingGeneralInfoCreate setInvoice={this.setInvoice} Invoice={invoice} fetchInvoice={this.fetchInvoice}/>
    
                            </Panel>
                            <Panel
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">Work Orders <sup>*</sup></h5>
                                        </div>
                                </div>}
                                key="2"
                            >
                                <InvoicingWorkOrderCreate setInvoice={this.setInvoice} Invoice={invoice} fetchInvoice={this.fetchInvoice}/>
                            </Panel>
                            <Panel
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">Billing Account <sup>*</sup></h5>
                                    </div>
                                </div>}
                                key="3"
                            >
                                <InvoicingBillingAccountsCreate setInvoice={this.setInvoice} Invoice={invoice} fetchInvoice={this.fetchInvoice}/>
                        </Panel>
                            <Panel
                                header={<div className="col-12">
                                    <div className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">Site Manager Account <sup>*</sup></h5>
                                    </div>
                                </div>}
                                key="4"
                            >
                                <InvoicingSiteManagerAccountCreate setInvoice={this.setInvoice} Invoice={invoice} fetchInvoice={this.fetchInvoice}/>
                            </Panel>
                            <Panel
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">
                                            Documents
                                        </h5>
                                    </div>
                                </div>}
                                key="5"
                            >
                                <InvoicingDocumentsCreate setInvoice={this.setInvoice} Invoice={invoice} fetchInvoice={this.fetchInvoice}/>
                            </Panel>
                        </Collapse>
                        <div className="row">
                            <div className="col-12">
                                <div className="row mx-0 justify-content-end common-form-btn-row">
                                    <Button
                                        onClick={() => this.showWarningModal(true)}
                                        style={{margin: "0 8px"}}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        // style={
                                        //     CREATE_SCREEN ?
                                        //         {width: '37%'}
                                        //         : {width: '39%'}
                                        // }
                                        onClick={() => {
                                            if (this.state.unsavedExit) {
                                                this.showConfirmModal(true)
                                                // history.push(
                                                //   reverse(routes.dashboard.operations.work_order.view, {
                                                //     id: workOrder.id,
                                                //   })
                                                // )
                                            } else {
                                                this.handleViewMainButtonCLick()
                                            }
                                        }
                                        }
                                        // disabled={!workorderComplete && !this.props.match.params.id}
                                        type={"primary"}
                                    >
                                        {this.props.location.pathname?.includes('create') ? 'Create Invoice' : 'View Invoice'}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommonConfirmationModal
                // heading={this.props.match.params?.id ? `You’ve successfully updated this Invoice!` : `You’ve successfully added all of the required information.`}
                InvoiceText
                // subHeading={
                //     <p className="mb-0">

                //         Work Order PDF and Manifest/Bill of Lading (if any) have been generated
                //         To view this Invoice, select &nbsp;
                //         <Button
                //             onClick={() => {
                //                 history.push(
                //                     reverse(routes.dashboard.accounting.invoicing.view, {
                //                         id: invoice?.id,
                //                     })
                //                 )
                //             }
                //             }
                //             className="border-0 bg-transparent shadow-none p-0"
                //         >
                //             View Invoice.
                //         </Button>
                //     </p>
                // }
                visible={this.state.visibleConfirm}
                okAction={() => {
                    this.handleDocumentPdf()
                    history.push(
                        reverse(routes.dashboard.accounting.invoicing.view, {id: invoice?.id})
                    )
                }
                }
                okTitle={"Continue"}
                onClose={() => this.showConfirmModal(false)}
            />
            <CommonWarningModal
                heading={`Are you sure you want to exit ${this.props.match.params?.id ? "editing" : "creating"
                } this Work Order?`}
                visible={this.state.warningModalVisible}
                onClose={() => this.showWarningModal(false)}
            />
        </React.Fragment>);
    }
}

export default connect(null,{setBreadcrumb})(withRouter(CreateInvoicingMain));
