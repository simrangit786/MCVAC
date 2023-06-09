import React, { Component } from 'react';
import { Image as Images } from "../../../Images";
import { Select } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { formatDate } from '../../../../Controller/utils';

const { Option } = Select;

class WOGeneralInfo extends Component {
    handlePdf = () => {
        // getWorkOrderPdf(this.props.workOrder.id).then(
        //   (r) => {
        //       window.open(URL.createObjectURL(r.data))
        //   }
        // );
        this.props.onTabChange('7');
      };

    render() {
        const { workOrder, statusTypes } = this.props;
        return (
            <React.Fragment>
                <div className="row summary-collapse-inner-row-main">
                    <div className="col-12">
                        <div className="row summary-view-row-vehicle border-top-1 border-bottom-0">
                            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                <h6 className="text-uppercase">Associated project</h6>
                                <div
                                    style={{ minHeight: "76px", height: "76px" }}
                                    className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main"
                                >
                                    <div className="col-12">
                                        <div className="user-icons-div">
                                            <img
                                                src={Images.folder_icon_black}
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                        <div className="user-info-div">
                                            <h6>{workOrder?.project.name}</h6>
                                            <p className="mb-0">{workOrder?.project?.status?.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                <h6 className="text-uppercase">Actions</h6>
                                <div className="row">
                                    <div className="col-12 position-relative">
                                        <Select
                                            dropdownClassName={"pdf-select-view"}
                                            suffixIcon={<CaretDownOutlined />}
                                            className="select-pdf-options"
                                            placeholder="Select"
                                            defaultValue="select"
                                            onChange={this.handlePdf}
                                        // disabled={proposal_filled}
                                        // value={this.state.pdfValue}
                                        >
                                            {/* <Option value="select">Select</Option> */}
                                            <Option value="view_pdf">
                                                View Work Order PDFs
                                                <br />
                                                <small style={{ color: '#BDBDBD' }}>View work order,manifest,or BOL PDFs and other <br />
                                                    documents uploaded to this workorder</small>
                                            </Option>
                                            {/* <Option value="view_pdf">
                                                View Proposal PDF
                                                <br/>
                                                <small style={{color: '#BDBDBD'}}>View all proposal PDFs and other
                                                    documents uploaded</small>
                                            </Option> */}
                                        </Select>
                                        <span className="pdf-icon-tg position-absolute">
                                            <img
                                                alt={""}
                                                src={Images.pdf_icon_light_green}
                                                className="img-fluid"
                                            />
                                        </span>
                                    </div>
                                </div>
                                {/*{this.state.pdfLoading && <p>Loading...</p>}*/}
                            </div>
                        </div>
                        <div className="row summary-view-row-vehicle border-bottom-0">
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                <h6 className="text-uppercase">Work order ID</h6>
                                <h5 className="mb-0">{workOrder?.id}</h5>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                <h6 className="text-uppercase">STATUS</h6>
                                <Select
                                    labelInValue
                                    className="status-small-select"
                                    placeholder={workOrder?.status === "SERVICE_REQUEST" ? "Service Request" : workOrder?.status === "IN_QUEUE" ? "Scheduled/In Queue" : workOrder?.status === "COMPLETED_WORK_ORDER" ? "Completed Work Order" : workOrder?.status}
                                    // defaultValue={{
                                    //     value: workOrder?.status.id,
                                    //     label: workOrder?.status.title,
                                    //   }}
                                    // value={{value: proposal.status?.id, label: proposal.status?.title}}
                                    style={{ width: '100%',textAlign:'center' }}
                                    onChange={this.props.handleChange}
                                    suffixIcon={
                                        <img
                                            src={Images.caret_small_icon_select}
                                            alt=""
                                            className="img-fluid"
                                        />
                                    }
                                >
                                        <>
                                        <option value={"SERVICE_REQUEST"}>Service Request</option>
                                        <option value={"IN_QUEUE"}>Scheduled/In Queue</option>
                                        <option value={"RESCHEDULED"}>Need to be Rescheduled</option>
                                        <option value={"CANCELED"}>Permanently Canceled</option>
                                        <option value={"COMPLETED"}>Completed</option>
                                        </>
                                </Select>
                            </div>
                            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
                                <h6 className="text-uppercase">Project Created</h6>
                                <h5 className="mb-0">{formatDate(workOrder?.created)}</h5>
                            </div>
                        </div>
                        <div className="row summary-view-row-vehicle border-0">
                            <div className="col-12">
                                <h6 className="text-uppercase">DESCRIPTION</h6>
                                <h5 className="mb-0">{workOrder?.description}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default WOGeneralInfo;