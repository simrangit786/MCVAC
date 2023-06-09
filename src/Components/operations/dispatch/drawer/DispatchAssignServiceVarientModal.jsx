import React, {Component} from 'react';
import {Button, Modal} from 'antd';
import {Image as Images} from "../../../Images";
import DisptachAssignServiceTableMain from '../dispatch-right/tabs/DisptachAssignServiceTableMain';
import { updateWorkOrderServiceVarient} from '../../../../Controller/api/workOrderServices';
import {handleError} from '../../../../Controller/Global';
import moment from 'moment';

class DispatchAssignServiceVarientModal extends Component {
    state={
        fetching: false,
        id: null,
        removableId: null,
        modalVisible: false,
        search: "",
    }
    formRef = React.createRef();

    handleUnitSelectChange = (e, id) => {
        const {newPricing} = this.props
        const fetchId = newPricing.find(i => i.id === id)
        if (!fetchId.edited) {
            this.setState({unitModalVisible: true})
        }
        const params = {
            selected_unit: e
        }
        this.handleUpdateVariantRow(params, id)
    };

    handleQuantitySelectChange = (e, id) => {
        const params = {
            workorder_qty: e
        }
        this.handleUpdateVariantRow(params, id)
    };
    handleUpdateVariantRow = (params, id) => {
        updateWorkOrderServiceVarient(params, id).then(() => {
            this.getSelectedServiceVariants();
            this.props.fetchWorkOrder(this.props.workOrder?.id);
        }).catch(err => {
            handleError(err)
        })
    }

    handleCheckBox = (e, id, type) => {
        let params = {};
        if (type === "TAX") {
            this.setState({taxVisible: e, modalVisible: true, taxCheckBox: true})
            params['taxable'] = e;
        } else {
            this.setState({subtotalVisible: e, modalVisible: true, taxCheckBox: false})
            params['include_subtotal'] = e
        }
        this.handleUpdateVariantRow(params, id)
    }
    handleRemoveWarning = (removeWarningVisible, id = null) => {
        this.setState({removeWarningVisible, removableId: id})
    }
    closeViewModal = () => {
        this.setState({modalVisible: false})
    }


    render() {
        const {workOrder} = this.props
        let site = workOrder?.work_owner_contact?.length && workOrder?.work_owner_contact[0]?.site?.length && workOrder?.work_owner_contact[0]?.site[0]?.site || '-'
        let account_name = workOrder?.work_owner_contact?.length && workOrder?.work_owner_contact[0]?.account
        return (
            <React.Fragment>
                <Modal
                    visible={this.props.visible}
                    onOk={this.props.onClose}
                    onCancel={this.props.onClose}
                    centered
                    width={'750px'}
                    //   className="confirmation-popup-modal account-type-all"
                    okText="Save"
                    closable={true}
                    className="dispatch-assign-variant-modal"
                    cancelText='Cancel'
                    title="Assign Resources"
                >
                    <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                            <div className="row mx-0 dispatch-word-card position-relative pb-0">
                                <div className={'status-btn'}>{workOrder?.status}</div>
                                <div className="col-12 position-relative dispatch-card-heading">
                                    <h6>
                                        <div className="work-id">{workOrder?.id}</div>
                                        <div className="project-name">{workOrder?.project?.name}</div>
                                    </h6>
                                    <small>{account_name?.name}</small>

                                </div>
                                <div className="col-12">
                                    <ul className="list-inline  ">
                                        <li className='pl-0 text-left'>
                                            <img src={Images.calendar_gary} alt={''} className="img-fluid"/>
                                        {workOrder?.service_date ? moment(workOrder?.service_date).format("MMM D ,YYYY") : "-"} | {workOrder?.start_time ? moment(workOrder?.start_time, "HH:mm").format('HH:mm A')  :"-"} - {workOrder?.end_time? moment(workOrder?.end_time, "HH:mm").format('HH:mm A') :"" } 
                                        </li>
                                        <li className='pl-0 text-left'>
                                            <img src={Images.location_gray_dispatch_14} alt=""
                                                 className="img-fluid"/>{site?.apartment || ""} {site?.street_address || ""} {site?.city || ""} {site?.state}
                                        </li>
                                    </ul>

                                </div>
                                <div className='col-12 '>
                                    <Button disabled={true} className="common-project-btn assign-btn dispatch-btn-new">dispatch now</Button>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 update-table-dispatch'>
                            {this.props.newPricing.length > 0 ?
                                <div className="col-12 table-responsive main-table-div position-relative wage-table">
                                    <div
                                        className="row mx-0 custom-table-main-row custom-table-main-row-proposal-line-item custom-table-main-row-wage-info-main proposal-update-table dispatch-service-varient"> 
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
                                                {/* <div className="custom-table-cell-th custom-table-cell-th-3">
                                                <div className="custom-th-heading">
                                                    crew chief
                                                </div>
                                            </div> */}
                                            <div className="custom-table-cell-th custom-table-cell-th-4">
                                                <div className="custom-th-heading">ASSIGNEE</div>
                                            </div>
                                            <div className="custom-table-cell-th custom-table-cell-th-5">
                                                <div className="custom-th-heading">FACILITY</div>
                                            </div>
                                            <div className="custom-table-cell-th custom-table-cell-th-6">
                                                <div className="custom-th-heading">
                                                    CONT Qty
                                                </div>
                                            </div>
                                            <div className="custom-table-cell-th custom-table-cell-th-7">
                                                <div className="custom-th-heading">CONTAINER</div>
                                            </div>
                                            <div className="custom-table-cell-th custom-table-cell-th-8">
                                                <div className="custom-th-heading">
                                                    Qty
                                                </div>
                                            </div>
                                            <div className="custom-table-cell-th custom-table-cell-th-9">
                                                <div className="custom-th-heading">
                                                    UOM
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        <div className="row mx-0 w-100">
                                            {this.props.newPricing?.map((n) => {
                                               
                                                return (
                                                    <DisptachAssignServiceTableMain
                                                        key={n.id}
                                                        child={
                                                            n?.variant_data?.table_pricing || n?.children || []
                                                        }
                                                        foundRegion={n?.variant_data?.region}
                                                        modalVisible={this.state.modalVisible}
                                                        taxVisible={this.state.taxVisible}
                                                        subtotalVisible={this.state.subtotalVisible}
                                                        taxCheckBox={this.state.taxCheckBox}
                                                        // handlePriceUnit={this.handlePriceUnit}
                                                        // handleServiceModal={this.handleServiceModal}
                                                        // serviceModalVisible={this.state.serviceModalVisible}
                                                        closeViewModal={this.closeViewModal}
                                                        manually_added={n?.resource_type === "INVENTORY_KIT" ? true : false}
                                                        margin={n?.margin}
                                                        // allOptions={allOptions}
                                                        handleUnitSelectChange={(e, id) =>
                                                            this.handleUnitSelectChange(e, id)
                                                        }
                                                        handleQuantitySelectChange={(e, id) =>
                                                            this.handleQuantitySelectChange(e, id)
                                                        }
                                                        // handlePricePerUnitChange={(e, id) => {
                                                        //     this.handlePricePerUnitChange(e, id)
                                                        // }}
                                                        handleCheckBox={(e, id, checkboxType) =>
                                                            this.handleCheckBox(
                                                                e,
                                                                id,
                                                                checkboxType
                                                            )
                                                        }
                                                        handleRemoveWarning={this.handleRemoveWarning}
                                                        // deleteServiceVariant={this.deleteServiceVariant}
                                                        newPricing={n}
                                                        view={false}
                                                    />
                                                );
                                            })}
                                            {/* <div className='col-12 mt-3'>
                                                                <div
                                                                    className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                                                    <h6 className="mb-0">No Line Items</h6>
                                                                </div>
                                                            </div>
                                                            : */}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="col-12 mt-3">
                                    <div
                                        className="row no-data-card-row align-items-center justify-content-center">
                                        <div className="col-12 text-center">
                                            <img src={Images.line_items_empty_state_icon} alt={''}
                                                 className="img-fluid"/>
                                            <h6 className="mb-0">No Service Variants</h6>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default DispatchAssignServiceVarientModal;