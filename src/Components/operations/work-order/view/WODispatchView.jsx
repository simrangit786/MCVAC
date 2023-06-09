import React, {Component} from 'react';
import {Image as Images} from '../../../Images'
import {Button, Form, Input} from "antd";
import DispatchAssignServiceVarientModal from '../../dispatch/drawer/DispatchAssignServiceVarientModal';
import DisptachAssignServiceTableMain from '../../dispatch/dispatch-right/tabs/DisptachAssignServiceTableMain';
import WorkOrderAssignServiceTableMain from './WorkOrderAssignServiceTableMain';

class WoDispatchView extends Component {
    state = {
        no_data: ''
    }
    
    render() {
        return (
            <>
                <div className={`row mx-0 ${!this.props.hideTitle ? "sales-site-design-fix no-data-card-row-new billing-account-data" : ""
                    }`}>
                    <div className="col-12">
                        <div
                            className={`row new-opportunity-header-row mt-0 summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${!this.props.viewAll ? "mt-30 border-1" : ""
                            }`}>
                            <div className="search-bar-div d-flex align-items-center">
                                <Form className="position-relative">
                                    <Input
                                        placeholder="Search"
                                        // onChange={(e) =>
                                        //     this.fetchSiteOwnerContact({search: e.target.value})
                                        // }
                                    />
                                    <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                        <img
                                            src={Images.search_icon_gray}
                                            className="img-fluid"
                                            alt="search icon"
                                        />
                                    </Button>
                                </Form>
                            </div>
                            {this.props.hideTitle && (
                                <Button
                                    // onClick={() => this.props.onTabChange("5")}
                                    className="view-all-btn text-uppercase"
                                >
                                    VIEW ALL{" "}
                                </Button>
                            )}
                        </div>
                    </div>
                             <div className="col-12 update-table-dispatch">
                             {this.props.workOrder?.workorder_variant?.length ? (
                               <div className="col-12 table-responsive main-table-div position-relative wage-table">
                                 <div className="row mx-0 custom-table-main-row custom-table-main-row-proposal-line-item custom-table-main-row-wage-info-main proposal-update-table dispatch-service-varient">
                                   <div className="col-12 custom-table-change service-variants-table">
                                     <div className="row custom-table-header custom-table-header-2">
                                       <div className="custom-table-cell-th custom-table-cell-th-1">
                                         <div className="custom-th-heading">Type</div>
                                       </div>
                                       <div className="custom-table-cell-th">
                                         <div className="custom-th-heading">Name / Info</div>
                                       </div>
                                       <div className="custom-table-cell-th">
                                         <div className="custom-th-heading">ASSIGNEE</div>
                                       </div>
                                       <div className="custom-table-cell-th">
                                         <div className="custom-th-heading">FACILITY</div>
                                       </div>
                                       <div className="custom-table-cell-th">
                                         <div className="custom-th-heading">CONT Qty</div>
                                       </div>
                                       <div className="custom-table-cell-th">
                                         <div className="custom-th-heading">CONTAINER</div>
                                       </div>
                                       <div className="custom-table-cell-th">
                                         <div className="custom-th-heading">Qty</div>
                                       </div>
                                       <div className="custom-table-cell-th">
                                         <div className="custom-th-heading">UOM</div>
                                       </div>
                                     </div>
                                   </div>
                                   <div className="row mx-0 w-100">
                                     {this.props.workOrder?.workorder_variant?.map((n) => {
                                       return (
                                        <WorkOrderAssignServiceTableMain
                                          workorderDispatchView
                                          key={n?.id}
                                          child={
                                            n?.variant_data?.table_pricing ||
                                            n?.children ||
                                            []
                                          }
                                          foundRegion={n.variant_data?.region}
                                          workorderData={this.props.workOrder.dispatch}
                                          handleActiveRadio={this.props.handleActiveRadio}
                                          closeViewModal={this.closeViewModal}
                                          manually_added={
                                            n?.resource_type === "INVENTORY_KIT"
                                              ? true
                                              : false
                                          }
                                          margin={n?.margin}
                                          newPricing={n}
                                          view={false}
                                        />
                                      );
                                     })}
                                   </div>
                                 </div>
                               </div>)
                            :
                            <div className="row mx-0 mt-3">
                                <div className="col-12">
                                    <div style={{
                                        height: '75px',
                                    }} className="row mx-0 align-items-center no-data-card-row">
                                        <div className="col-12 text-center">
                                            <img alt={''} className="img-fluid"
                                                 src={Images.empty_dispatch_icon}/>
                                            <h6 className="mb-0 text-gray-tag">No Dispatch</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        
                    </div>
                </div>
            </>
        );
    }
}

export default WoDispatchView;