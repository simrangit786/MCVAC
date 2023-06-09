import React, { Component } from "react";
import { Button, Dropdown, Menu, Select, Spin } from "antd";
import { Image as Images } from "../../../Images";
import { Link } from "react-router-dom";
import WorkOrderViewDetailsDrawer from "../drawer/WorkOrderViewDetailsDrawer";
import moment from "moment";
import { handleError } from "../../../../Controller/Global";
import { postDispatchData } from "../../../../Controller/api/dispatchServices";
import { Option } from "antd/lib/mentions";
import { statusLabel } from "../../../../Controller/utils";

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
  </Menu>
);

class DispatchProjectDetailsAll extends Component {
  state = {
    visible: false,
  };
  showWorkOrderDetails = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  handleClick = (id) => {
    const params = {
      status: "IN_QUEUE",
    };
    postDispatchData(params, id)
      .then((res) => {
        this.props.statusUpdate(true);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleStatusChange = (value, id) => {
    const params = {
      status: value,
    };
    postDispatchData(params, id)
      .then((res) => {
        this.props.statusUpdate(true);
      })
      .catch((err) => {
        handleError(err);
      });
  };
  render() {
    const { workOrder } = this.props;

    return (
      <>
        <div className="row dispatch-work-details-row-main">
          <div className="col-12">
            {workOrder.map((i) => {
              let site =
                i?.workorder?.work_owner_contact?.length &&
                i?.workorder?.work_owner_contact[0]?.site?.length &&
                i?.workorder?.work_owner_contact[0]?.site[0]?.site;
              return (
                <div className="row mx-0 dispatch-word-card">
                  <div className="col-12 position-relative">
                    <h6>
                      <div className="work-id">{i?.workorder?.id}</div>
                      <div className="project-name">
                        {i?.workorder?.project?.name || "-"}
                      </div>
                    </h6>
                    <small>
                      {i?.workorder?.work_owner_contact &&
                        i?.workorder?.work_owner_contact[0]?.account?.name}
                    </small>
                    {/*<Dropdown overlay={menu} trigger={['click']}>
                                    <Button className="ant-dropdown-link ant-dropdown-link-custom"
                                            onClick={e => e.preventDefault()}>
                                        <img src={Images.menu_dispatch_elipsis} alt={' '} className="img-fluid"/>
                                    </Button>
                                </Dropdown>*/}
                  </div>
                  <div className="col-12">
                    <ul className="list-inline">
                      <li>
                        <img
                          src={Images.calendar_gary}
                          alt={""}
                          className="img-fluid"
                        />
                        {i?.workorder?.service_date
                          ? moment(i?.workorder?.service_date).format(
                              "MMM D, YYYY"
                            )
                          : "-"}{" "}
                        |{" "}
                        {i?.workorder?.start_time
                          ? moment(i?.workorder?.start_time, "HH:mm").format(
                              "HH:mm A"
                            )
                          : "-"}{" "}
                        -{" "}
                        {i?.workorder?.end_time
                          ? moment(i?.workorder?.end_time, "HH:mm").format(
                              "HH:mm A"
                            )
                          : ""}
                      </li>
                      <li>
                        <img
                          src={Images.location_gray_dispatch_14}
                          alt=""
                          className="img-fluid"
                        />
                        {site?.apartment || ""} {site?.street_address || ""}{" "}
                        {site?.city || ""} {site?.state}
                      </li>
                    </ul>
                    <div
                      style={{ marginBottom: "25px" }}
                      className="rescheduled-div p-0 shadow-none bg-transprent"
                    >
                      {/* {i.status} */}
                      <Select
                        className="status-small-select"
                        // placeholder={i.status}
                        value={statusLabel(i?.status)}
                        style={{
                          width: "100%",
                          textAlign: "center",
                          fontSize: "13px",
                        }}
                        onChange={(e) => this.handleStatusChange(e, i.id)}
                        suffixIcon={
                          <img
                            src={Images.caret_small_icon_select}
                            alt=""
                            className="img-fluid"
                          />
                        }
                      >
                        <Option value={"IN_QUEUE"}>Scheduled/In Queue</Option>
                        <Option value={"RESCHEDULED"}>
                          Need to be Rescheduled
                        </Option>
                        <Option value={"CANCELED"}>Permanently Canceled</Option>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={() => this.handleClick(i.id)}
                    style={{ color: "#38BC94", backgroundColor: "#FFFFFF" }}
                    className="common-project-btn assign-btn"
                  >
                    Add to calendar
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="col-12 text-center create-div">
          {this.props.loading ? <Spin /> : ( this.props.workOrder.length !== this.props.totalCount && 
          <div className="d-flex align-items-center justify-content-center">
          <Button className="load-more-btn w-auto bg-transprent" onClick={(e) => {
            this.props.handlePagination()
            e.stopPropagation()
          }
            }>
            Load More</Button>
            </div>
            )
  }
  </div>
          
          {/*<div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <div className="row mx-0 heading-dispatch-left">
                                    <div className="col-12 col-sm-6">
                                        <h6 className="mb-0">Tue, May 4, 2021</h6>
                                    </div>
                                    <div className="col-12 col-sm-6 text-right">
                                        <h6 className="mb-0 color-gray-3"><span>3</span> Service Request</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div style={{
                                    cursor:'pointer'
                                }} onClick={()=>this.showWorkOrderDetails(true)} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <h6>
                                            <div className="work-id">302654</div>
                                            <div className="project-name">Lower Manhattan Big Cleaning Phase 1</div>
                                        </h6>
                                        <small>Site Owner Account</small>
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <Button className="ant-dropdown-link ant-dropdown-link-custom"
                                                    onClick={e => e.preventDefault()}>
                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                     className="img-fluid"/>
                                            </Button>
                                        </Dropdown>
                                    </div>
                                    <div className="col-12 col-sm-8">
                                        <p>
                                            <img src={Images.location_gray_dispatch_14} alt=""
                                                 className="img-fluid"/>
                                            123 W 112TH ST New York</p>
                                    </div>
                                    <div className="col-12 col-sm-4 position-relative">
                                        <Button className="repeats-btn">Repeats
                                            <img src={Images.recurrence} alt={' '} className="img-fluid"/>
                                        </Button>
                                    </div>
                                </div>
                                <div style={{
                                    cursor:'pointer'
                                }} onClick={()=>this.showWorkOrderDetails(true)} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <h6>
                                            <div className="work-id">302654</div>
                                            <div className="project-name">Lower Manhattan Big Cleaning Phase 1</div>
                                        </h6>
                                        <small>Site Owner Account</small>
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <Button className="ant-dropdown-link ant-dropdown-link-custom"
                                                    onClick={e => e.preventDefault()}>
                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                     className="img-fluid"/>
                                            </Button>
                                        </Dropdown>
                                    </div>
                                    <div className="col-12 col-sm-8">
                                        <p>
                                            <img src={Images.location_gray_dispatch_14} alt=""
                                                 className="img-fluid"/>
                                            123 W 112TH ST New York</p>
                                    </div>
                                    <div className="col-12 col-sm-4 position-relative">
                                        <Button className="repeats-btn">Repeats
                                            <img src={Images.recurrence} alt={' '} className="img-fluid"/>
                                        </Button>
                                    </div>
                                </div>
                                <div style={{
                                    cursor:'pointer'
                                }} onClick={()=>this.showWorkOrderDetails(true)} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <h6>
                                            <div className="work-id">302654</div>
                                            <div className="project-name">Lower Manhattan Big Cleaning Phase 1</div>
                                        </h6>
                                        <small>Site Owner Account</small>
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <Button className="ant-dropdown-link ant-dropdown-link-custom"
                                                    onClick={e => e.preventDefault()}>
                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                     className="img-fluid"/>
                                            </Button>
                                        </Dropdown>
                                    </div>
                                    <div className="col-12 col-sm-8">
                                        <p>
                                            <img src={Images.location_gray_dispatch_14} alt=""
                                                 className="img-fluid"/>
                                            123 W 112TH ST New York</p>
                                    </div>
                                    <div className="col-12 col-sm-4 position-relative">
                                        <Button className="repeats-btn">Repeats
                                            <img src={Images.recurrence} alt={' '} className="img-fluid"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <div className="row mx-0 heading-dispatch-left">
                                    <div className="col-12 col-sm-6">
                                        <h6 className="mb-0">Tue, May 4, 2021</h6>
                                    </div>
                                    <div className="col-12 col-sm-6 text-right">
                                        <h6 className="mb-0 color-gray-3"><span>3</span> Service Request</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <Link to={''} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <h6>
                                            <div className="work-id">302654</div>
                                            <div className="project-name">Lower Manhattan Big Cleaning Phase 1</div>
                                        </h6>
                                        <small>Site Owner Account</small>
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <Button className="ant-dropdown-link ant-dropdown-link-custom"
                                                    onClick={e => e.preventDefault()}>
                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                     className="img-fluid"/>
                                            </Button>
                                        </Dropdown>
                                    </div>
                                    <div className="col-12 col-sm-8">
                                        <p>
                                            <img src={Images.location_gray_dispatch_14} alt=""
                                                 className="img-fluid"/>
                                            123 W 112TH ST New York</p>
                                    </div>
                                    <div className="col-12 col-sm-4 position-relative">
                                        <Button className="repeats-btn">Repeats
                                            <img src={Images.recurrence} alt={' '} className="img-fluid"/>
                                        </Button>
                                    </div>
                                </Link>
                                <Link to={''} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <h6>
                                            <div className="work-id">302654</div>
                                            <div className="project-name">Lower Manhattan Big Cleaning Phase 1</div>
                                        </h6>
                                        <small>Site Owner Account</small>
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <Button className="ant-dropdown-link ant-dropdown-link-custom"
                                                    onClick={e => e.preventDefault()}>
                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                     className="img-fluid"/>
                                            </Button>
                                        </Dropdown>
                                    </div>
                                    <div className="col-12 col-sm-8">
                                        <p>
                                            <img src={Images.location_gray_dispatch_14} alt=""
                                                 className="img-fluid"/>
                                            123 W 112TH ST New York</p>
                                    </div>
                                    <div className="col-12 col-sm-4 position-relative">
                                        <Button className="repeats-btn">Repeats
                                            <img src={Images.recurrence} alt={' '} className="img-fluid"/>
                                        </Button>
                                    </div>
                                </Link>
                                <Link to={''} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <h6>
                                            <div className="work-id">302654</div>
                                            <div className="project-name">Lower Manhattan Big Cleaning Phase 1</div>
                                        </h6>
                                        <small>Site Owner Account</small>
                                        <Dropdown overlay={menu} trigger={['click']}>
                                            <Button className="ant-dropdown-link ant-dropdown-link-custom"
                                                    onClick={e => e.preventDefault()}>
                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                     className="img-fluid"/>
                                            </Button>
                                        </Dropdown>
                                    </div>
                                    <div className="col-12 col-sm-8">
                                        <p>
                                            <img src={Images.location_gray_dispatch_14} alt=""
                                                 className="img-fluid"/>
                                            123 W 112TH ST New York</p>
                                    </div>
                                    <div className="col-12 col-sm-4 position-relative">
                                        <Button className="repeats-btn">Repeats
                                            <img src={Images.recurrence} alt={' '} className="img-fluid"/>
                                        </Button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <div className="row mx-0 heading-dispatch-left">
                                    <div className="col-12">
                                        <h6 className="mb-0 text-green-tag">Local Union 101 <span
                                            className="color-gray-3">(5)</span></h6>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <Link to={''} style={{
                                    minHeight: '72px', borderBottom: '1px solid #e0e0e0'
                                }} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <div className={'operator-initial'}>
                                            <span className="emp-tag-name text-uppercase">JS</span>
                                        </div>
                                        <div className="operator-details">
                                            <h6 className="mb-0">John Doe</h6>
                                            <p className="m-0">Operator</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link to={''} style={{
                                    minHeight: '72px', borderBottom: '1px solid #e0e0e0'
                                }} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <div className={'operator-initial'}>
                                            <span className="emp-tag-name text-uppercase">JS</span>
                                        </div>
                                        <div className="operator-details">
                                            <h6 className="mb-0">John Doe</h6>
                                            <p className="m-0">Operator</p>
                                        </div>
                                    </div>
                                </Link>
                                <Link to={''} style={{
                                    minHeight: '72px', borderBottom: '1px solid #e0e0e0'
                                }} className="row mx-0 dispatch-word-card">
                                    <div className="col-12 position-relative">
                                        <div className={'operator-initial'}>
                                            <span className="emp-tag-name text-uppercase">JS</span>
                                        </div>
                                        <div className="operator-details">
                                            <h6 className="mb-0">John Doe</h6>
                                            <p className="m-0">Operator</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    */}
          <WorkOrderViewDetailsDrawer
            visible={this.state.visible}
            onClose={() => this.showWorkOrderDetails(false)}
          />
        </div>
      </>
    );
  }
}

export default DispatchProjectDetailsAll;
