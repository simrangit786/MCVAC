import React, {Component} from 'react';
import {Button, Collapse} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import WorkOrderGeneralInfoCreate from "./create/WorkOrderGeneralInfoCreate";
import WorkOrderServiceInfoCreate from "./create/WorkOrderServiceInfoCreate";
import WorkOrderBillingAccountCreate from "./create/WorkOrderBillingAccountCreate";
import WorkOrderSiteManagerAccountCreate from "./create/WorkOrderSiteManagerAccountCreate";
import WorkOrderServicevarientCreate from "./create/WorkOrderServiceVarientCreate";
import WorkOrderDocumentCreate from "./create/WorkOrderDocumentCreate";
import WareHouseDispatchOriginCreate from "./create/WareHouseDispatchOriginCreate";
import {checkWorkOrderRequired, getActiveKey} from '../../../Controller/utils';
import {handleError} from '../../../Controller/Global';
import {addWorkOrderPdf, getWorkOrderById} from '../../../Controller/api/workOrderServices';
import {setBreadcrumb} from '../../../Store/actions/breadcrumbAction';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import CommonConfirmationModal from '../../modals/CommonConfirmationModal';
import CommonWarningModal from '../../modals/CommonWarningModal';
import {reverse} from 'named-urls';
import {routes} from '../../../Controller/Routes';
import {history} from '../../../Controller/history';
import UnsavedDataPrompt from '../../modals/UnsavedDataPrompt';


const {Panel} = Collapse;

class OperationsWorkOrderCreateMain extends Component {
    state = {
        workOrder: null,
        activeKey: ["1"],
        requiredSuccessModalVisible: false,
        visibleConfirm: false,
        warningModalVisible: false,
        workorderComplete: false,
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
    setWorkOrder = (workOrder, num) => {
        if (workOrder.workorder_warehouse.length && workOrder.work_owner_contact.length && workOrder.work_customer_contact.length &&
            workOrder.service_date && workOrder.start_time && workOrder.status
            && workOrder.workorder_variant.length) {
            this.setState({workorderComplete: true, unsavedExit: false})

        } else {
            this.setState({unsavedExit: true})
        }
        let alreadyExist = null;
        if (this.state.activeKey.length > 1) {
            alreadyExist = this.state.activeKey.find((i) => i == num);
        }
        if (!alreadyExist) {
            this.setState((prevState) => {
                return {
                    workOrder,
                    activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "6")],
                };
            });
        } else {
            this.setState({workOrder})
        }
        // this.setState({proposal, activeKey: getActiveKey(this.state.activeKey, "5")})
    };
    collapseOnChange = (activeKey) => {
        this.setState({activeKey});
    };
    fetchWorkOrder = (id) => {
        getWorkOrderById(
            this.props.match.params.id ? this.props.match.params.id : id
        ).then((res) => {
                this.setState({workOrder: res.data}, () => {
                    console.log(this.state.workOrder,"workorder response")
                    // if (this.state.workOrder?.name
                    //     && !this.props.match.params.id) {  
                    //     this.setState({unsavedExit: false});
                    // } else {
                    //     this.setState({unsavedExit: true});
                    // }
                });
            })
            .catch((err) => {
                handleError(err);
            });
    };

    componentDidMount() {
        let arr = [];
        if (this.props.match.params.id) {
            this.fetchWorkOrder();
            arr = [{title: 'Edit Work Order', url: ''}]
            this.setState({activeKey: this.props.location.editTab || "1"})
        } else {
            arr = [{title: 'Create Work Order', url: ''}]
        }
        this.props.setBreadcrumb(arr)
    }

    handleViewMainButtonCLick = () => {
        let {workOrder} = this.state;
            this.showConfirmModal(true);
        
    };

    handleDocumentPdf = () => {
        const params = {
            workorder: this.state.workOrder.id
        }
        addWorkOrderPdf(params).then(
            (r) => {
                console.log(r, "response");
                // window.open(URL.createObjectURL(r.data))
            }
        );
    }

    render() {
        let {workOrder, activeKey, regions, workorderComplete} = this.state;
        let CREATE_SCREEN = this.props.location.pathname.includes('create')
        return (<React.Fragment>
            {/* <UnsavedDataPrompt
                // unsavedExit={this.state.unsavedExit} exit={true} message={""}
                when={this.state.unsavedExit && !this.props.match.params.id}
                title="Are you sure you want to exit creating this proposal?"
                cancelText="Continue"
                okText="Exit"
                onOK={() => true}
                onCancel={() => false}
                setCancel={() => {
                    this.setState({required: true})
                }}
            /> */}
            <div className="main-content-div">
                <div className="row mx-0 create-opportunity-row">
                    <div className="col-12 col-sm-10">
                        <Collapse
                            // accordion
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
                                <WorkOrderGeneralInfoCreate workOrder={workOrder} setWorkOrder={this.setWorkOrder}/>
                            </Panel>
                            <Panel
                                disabled={!workOrder}
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">Service Information <sup>*</sup></h5>
                                        {((this.state.required || this.props.match.params?.id) && checkWorkOrderRequired(workOrder, "SERVICE_INFO"))
                                            &&
                                            (<p className="mb-0 info-signifire">
                                                Please complete required information to avoid issues
                                            </p>)
                                        }
                                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                    </div>
                                </div>}
                                key="2"
                            >
                                <WorkOrderServiceInfoCreate workOrder={workOrder} setWorkOrder={this.setWorkOrder}/>
                            </Panel>
                            <Panel
                                disabled={!workOrder}
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">Warehouse / Dispatch Origin <sup>*</sup></h5>
                                        {((this.state.required || this.props.match.params?.id) && checkWorkOrderRequired(workOrder, "WAREHOUSE"))
                                            &&
                                            (<p className="mb-0 info-signifire">
                                                Please complete required information to avoid issues
                                            </p>)
                                        }
                                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                    </div>
                                </div>}
                                key="3"
                            >
                                <WareHouseDispatchOriginCreate
                                    workOrder={workOrder}
                                    fetchWorkOrder={this.fetchWorkOrder}
                                    setWorkOrder={this.setWorkOrder}
                                />
                            </Panel>
                            <Panel
                                disabled={!workOrder}
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">Billing Account *</h5>
                                        {((this.state.required || this.props.match.params?.id) && checkWorkOrderRequired(workOrder, "CUSTOMER"))
                                            &&
                                            (<p className="mb-0 info-signifire">
                                                Please complete required information to avoid issues
                                            </p>)
                                        }
                                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                    </div>
                                </div>}
                                key="4"
                            >
                                <WorkOrderBillingAccountCreate workOrder={workOrder}
                                                               fetchWorkOrder={this.fetchWorkOrder}
                                                               setWorkOrder={this.setWorkOrder}/>
                            </Panel>
                            <Panel
                                disabled={!workOrder}
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">Site Manager Account *</h5>
                                        {((this.state.required || this.props.match.params?.id) && checkWorkOrderRequired(workOrder, "OWNER"))
                                            &&
                                            (<p className="mb-0 info-signifire">
                                                Please complete required information to avoid issues
                                            </p>)
                                        }
                                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                                    </div>
                                </div>}
                                key="5"
                            >
                                <WorkOrderSiteManagerAccountCreate workOrder={workOrder}
                                                                   fetchWorkOrder={this.fetchWorkOrder}
                                                                   setWorkOrder={this.setWorkOrder}/>
                            </Panel>
                            <Panel
                                disabled={!workOrder}
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">
                                            Service Variants <sup>*</sup>
                                        </h5>
                                        {((this.state.required || this.props.match.params?.id) && checkWorkOrderRequired(workOrder, "SERVICE_VARIENT"))
                                            &&
                                            (<p className="mb-0 info-signifire">
                                                Please complete required information to avoid issues
                                            </p>)
                                        }
                                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                    </div>
                                </div>}
                                key="6"
                            >
                                <WorkOrderServicevarientCreate
                                    workOrder={workOrder}
                                    fetchWorkOrder={this.fetchWorkOrder}
                                    setWorkOrder={this.setWorkOrder}
                                />
                            </Panel>

                            <Panel
                                disabled={!workOrder}
                                header={<div className="col-12">
                                    <div
                                        className="row info-card-heading-row align-items-center justify-content-between">
                                        <h5 className="mb-0">
                                            Documents
                                        </h5>
                                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                                    </div>
                                </div>}
                                key="7"
                            >
                                <WorkOrderDocumentCreate workOrder={workOrder} fetchWorkOrder={this.fetchWorkOrder}
                                                         setWorkOrder={this.setWorkOrder}/>
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
                                        style={
                                            CREATE_SCREEN ?
                                                {width: '37%'}
                                                : {width: '39%'}
                                        }
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
                                        disabled={!workorderComplete && !this.props.match.params.id}
                                        type={"primary"}
                                    >
                                        {this.props.location.pathname?.includes('create') ? 'Create Work Order' : 'View Work Order and Generate PDF'}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommonConfirmationModal
                heading={this.props.match.params.id ? `You’ve successfully updated this Work Order!` : `Work Order Created Successfully!`}
                subHeading={
                    <p className="mb-0">

                        Work Order PDF and Manifest/Bill of Lading (if any) have been generated
                        To view this Work Order, select &nbsp;
                        <Button
                            onClick={() => {
                                history.push(
                                    reverse(routes.dashboard.operations.work_order.view, {
                                        id: workOrder.id,
                                    })
                                )
                            }
                            }
                            className="border-0 bg-transparent shadow-none p-0"
                        >
                            View Work Order.
                        </Button>
                    </p>
                    // <p className="mb-0">Work Order PDF and Manifest/Bill of Lading (if any) have been generated
                    //   To view this Work Order, select View Work Order.
                    // </p>
                }
                visible={this.state.visibleConfirm}
                okAction={() => {
                    this.handleDocumentPdf()
                    history.push(
                        reverse(routes.dashboard.operations.work_order.view, {id: workOrder.id})
                    )
                }
                }
                okTitle={"View  Work Order"}
                onClose={() => this.showConfirmModal(false)}
            />
            <CommonWarningModal
                heading={`Are you sure you want to exit ${this.props.match.params.id ? "editing" : "creating"
                } this Work Order?`}
                visible={this.state.warningModalVisible}
                onClose={() => this.showWarningModal(false)}
            />
            {/* <RequireSuccessModal
        visible={this.state.requiredSuccessModalVisible}
        heading={"Work order created successfully."}
        subHeading={
          'Work Order PDF and Manifest/Bill of Lading (if any) have been generated To view this Work Order, select View Work Order. '
        }
        onClose={() => {
          this.showRequiredSuccessModal(false);
        }}
        okText={"View Workorder"}
        onOK={() => {
          // this.callMultiple()
          this.showRequiredSuccessModal(false);
          history.push(
            reverse(routes.operations.work_order.view, { id: workOrder.id })
          );
        }} 
     /> */}
        </React.Fragment>);
    }
}

export default connect(null, {setBreadcrumb})(withRouter(OperationsWorkOrderCreateMain));
