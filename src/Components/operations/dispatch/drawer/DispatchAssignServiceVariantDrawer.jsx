import React, { Component } from "react";
import { Button, Divider, Drawer, Dropdown, Form, Menu, Select, Space, Spin } from "antd";
import { Image as Images } from "../../../Images";
import DisptachAssignServiceTableMain from "../dispatch-right/tabs/DisptachAssignServiceTableMain";
import moment from "moment";
import { getLaborEmployees } from "../../../../Controller/api/labourServices";
import { handleError } from "../../../../Controller/Global";
import { getDispatchDataById, postDispatchData, updateDispatchData } from "../../../../Controller/api/dispatchServices";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class DispatchAssignServiceVariantDrawer extends Component {
  state = {
    crewChief: "",
    employees: [],
    search: "",
    page: 1,
    fetching: false,
    totalCount: 0,
    dispatchNow: false,
    dispatchData: "",
  };

  formRef = React.createRef()
  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.handleRemove()}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  static getDerivedStateFromProps(props) {
    return { crewChief: {...props.workOrder} };
  }

  
  handleRemove = () => {
    this.handleSelect({crew_chief:null})
  }

  fetchEmployees = (params = {}) => {
    this.setState({fetching: true})
    getLaborEmployees(params)
      .then((res) => {
        this.setState({totalCount: res.data.count})
        if(this.state.page == 1) {
          this.setState({employees: res.data.results})
        } else {
        this.setState(prevState => {
          return {employees: [...prevState.employees, ...res.data.results]}
        })
      }
      })
      .catch((err) => {
        handleError(err);
      }).finally(() => {
        this.setState({fetching: false})
      })
  };


  handlePagination = () => {
    this.setState((prevState) => {
      return { page: prevState.page + 1}
    },() => {
      this.fetchEmployees({page: this.state.page});
    })
  }

  
  handleSelect = (params) => {
      updateDispatchData(params, this.props.workOrder?.dispatch?.id).then((res) => {
          this.setState({crewChief: res.data})
          this.handleDispatchDataById()
          this.formRef.current.setFieldsValue({
              crew_chief: null
          })
      }).catch((err) => {
          handleError(err);
      })

  }

  handleDispatchDataById = () => {
    let workOrderId = this.props.workOrder?.dispatch?.id;
    getDispatchDataById(workOrderId).then((res) => {
     this.setState({dispatchData: res.data},() => {
      this.handleRequiredCheck()
     }) 
    }).catch((err) => {
      handleError(err)
    })
  } 

  handleRequiredCheck = () => {
    const { dispatchData } = this.state
  
    let checked = [];
    const tablePricing  = dispatchData?.workorder?.workorder_variant[0]?.variant_data
   const tableData = tablePricing?.table_pricing?.length&& tablePricing?.table_pricing.forEach((item, index) => {

      if(item.type === "LABOR"){
        const checking =  dispatchData.labor_assignee.find(i => i.id == item.id)
        if(checking) {
          checked.push(true)
        } else {
          checked.push(false)
        }
      } else if(item.type === "SUPPLY_GROUP") {
         if(dispatchData.supply_assignee.find(i => i.id == item.id)) {
           checked.push(true)
         } else {
           checked.push(false)
         }
      } else if(item.type === "FLEET_GROUP") {
        const checking =  dispatchData.fleet_assignee.find(i => i.id == item.id)
        if(checking) {
          checked.push(true)
        } else {
          checked.push(false)
        }
      } 
      return checked;

  })
      const valueCheck = (value) => value === true
      const everyCheck = checked.every(valueCheck)

      if(!this.state.dispatchData.crew_chief) {
        this.handleDispatchNow(false)
      }
     
      if(everyCheck && this.state.dispatchData.crew_chief) {
      
        this.handleDispatchNow(true)
      } else {
        this.handleDispatchNow(false)
      }
  }

  handleCardStatus = (value,id) => {
    const params = {
      status: value,
    };
    postDispatchData(params,id).then((res) => {
      this.handleDispatchDataById()
    }).catch((err) => {
      handleError(err)
    })
  }

  handleDispatchNow = (val) => {
    this.setState({dispatchNow: val})
  }
  render() {
    const { workOrder } = this.props;
    const { crewChief,fetching, employees, totalCount,dispatchData } = this.state;
    let site = workOrder?.work_owner_contact?.length && workOrder?.work_owner_contact[0]?.site?.length && workOrder?.work_owner_contact[0]?.site[0]?.site || '-'
    let account_name = workOrder?.work_owner_contact?.length && workOrder?.work_owner_contact[0]?.account
    return (
      <React.Fragment>
        <Drawer
          className="main-all-form-modal main-drawer-div drawer-update"
          title="Assign Resources"
          placement="right"
          width={"75%"}
          maskClosable={false}
          closable={true}
          onClose={this.props.onClose}
          visible={this.props.visible}
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row mx-0 dispatch-word-card position-relative pb-0">
                <div className={"status-btn"}>{workOrder?.status}</div>
                <div className="col-12 position-relative dispatch-card-heading">
                  <h6>
                    <div className="work-id">{workOrder?.id}</div>
                    <div className="project-name">
                      {workOrder?.project?.name}
                    </div>
                  </h6>
                </div>
                <div className="col-12">
                  <ul className="list-inline  ">
                    <li className="pl-0 text-left">
                      <img
                        src={Images.calendar_gary}
                        alt={""}
                        className="img-fluid"
                      />
                      {moment(workOrder?.service_date).format(
                            "MMM D ,YYYY"
                          )}{" "}
                      {/* {workOrder?.workorders?.length > 0 && workOrder?.workorders[0]?.workorder?.service_date
                        ? moment(workOrder?.service_date).format(
                            "MMM D ,YYYY"
                          )
                        : "-"}{" "} */}
                      |{" "}
                      {moment(workOrder?.start_time, "HH:mm").format("HH:mm A")}{" "}
                      {/* {workOrder?.workorders?.length > 0 && workOrder?.workorders[0]?.workorder?.start_time
                        ? moment(
                          workOrder?.workorders[0]?.workorder?.start_time,
                            "HH:mm"
                          ).format("HH:mm A")
                        : "-"}{" "} */}
                      -{" "}
                      {moment(
                          workOrder?.end_time,
                            "HH:mm"
                          ).format("HH:mm A")}
                      {/* {workOrder?.workorders?.length > 0 && workOrder?.workorders[0]?.workorder?.end_time
                        ? moment(
                          workOrder?.workorders[0]?.workorder?.end_time,
                            "HH:mm"
                          ).format("HH:mm A")
                        : ""} */}
                    </li>
                  </ul>
                </div>
                <div className="col-12 ">
                  <Button
                  // disabled={true}
                    disabled={!this.state.dispatchNow}
                    className="common-project-btn assign-btn dispatch-btn-new"
                    onClick={() => {
                      this.handleCardStatus("PENDING",workOrder?.dispatch?.id)
                      this.props.onClose()
                    } 
                    }
                  >
                    dispatch now
                  </Button> 

                </div>
              </div>
            </div>
            <div className="col-12">
              <hr className="hr-line" />
            </div>
            <div className="col-12">
              <Form
                ref={this.formRef}
                {...layout}
                className="main-inner-form"
              >
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="crew_chief"
                      label={"Crew Chief"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                      className="position-relative remove-cross-icon"
                    > 
                      <Select
                        // disabled={true}
                        placeholder="Search"
                        // notFoundContent={fetching ? <Spin size="small"/> : null}
                        filterOption={false}
                        onFocus={() => {
                          this.setState({page: 1},() =>{
                            this.fetchEmployees({page: this.state.page})
                          })
                        }}
                        onSearch={(e) => this.fetchEmployees({search:e})}
                        onSelect={(e) => this.handleSelect({crew_chief:e})}
                        showSearch={true}
                        // onDeselect={this.handleRemovefromSelect}
                        className="custom-search-select"
                        dropdownClassName={
                          "custom-search-select option-design-fix"
                        }
                        dropdownRender={(options) => (
                          <>
                            {options}
                            <Divider style={{ margin: '0 0 10px' }} />
                            <Space align="center" className="d-flex align-items-center justify-content-center" style={{ padding: '0 8px 4px' }}>
                              <div className="row">
                                <div className="col-12 text-center create-div">
                                  {fetching ? (
                                    <Spin />
                                  ) : (
                                    employees.length !== totalCount && (
                                      <div className="d-flex align-items-center justify-content-center">
                                        <Button className="load-more-btn w-auto bg-transprent" onClick={(e) => {
                                          this.handlePagination();
                                          e.stopPropagation();
                                        }}>
                                          Load More
                                        </Button>
                                        {/* <span className="remaining-tag">{`(${(totalCount - lineItems.length)})` || 0}</span> */}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </Space>
                          </>
                        )}
                      >
                        {employees.map((i) =>(
                          <Option key={i.id} value={i.id}>
                            <div className="row mx-0 custom-tree-row custom-tree-row-1 align-items-center justify-content-between">
                              <div
                                className="common-select-option-row"
                                style={{ padding: "10px 0" }}
                              >
                                <div className="select-option-details d-flex align-items-center">
                                  <div className={"select-option-icon"}>
                                    <span className="text-uppercase user-name-tg">
                                      {i.first_name.split("")[0]}{i.last_name.split("")[0]}
                                    </span>
                                  </div>
                                  <h6 className="mb-0">{i.first_name} {i.last_name}</h6>
                                </div>
                              </div>
                              <div className="text-green-tag select-text-tier">
                                Employee
                              </div>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                      <img
                        src={Images.search_small_icon}
                        alt=""
                        className="img-fluid"
                      />
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
            {!dispatchData?.crew_chief && (
              <div className="col-12">
                <div
                  style={{ height: "68px", minHeight: "68px" }}
                  className="row mx-0 no-data-card-row align-items-center justify-content-center"
                >
                  <div className="col-12 text-center">
                    <img
                      src={Images.creq_chef_small}
                      alt=""
                      className="img-fluid"
                    />
                    <h6
                      style={{
                        color: "#bdbdbd",
                      }}
                      className="mb-0"
                    >
                      No Crew Chief
                    </h6>
                  </div>
                </div>
              </div>
            )}

            {dispatchData?.crew_chief && (
              <div className="col-12">
                <div className="row contact-row-line">
                  <div className="col-12">
                    <div
                      style={{ height: "68px", minHeight: "68px" }}
                      className="row mx-0 align-items-center user-info-div-main position-relative opportunity-info-div-main"
                    >
                      <div className="col-12">
                        <div className="row mx-0 align-items-center">
                          <div
                            style={{ width: "80%" }}
                            className="d-flex align-items-center float-left"
                          >
                            <div className="user-icons-div">
                              <span className="text-uppercase user-name-tg">
                                {dispatchData.crew_chief.split(" ")[0].split("")[0]}{dispatchData.crew_chief.split(" ")[1].split("")[0]}
                              </span>
                            </div>
                            <div className="user-info-div pt-0">
                              <h6>{dispatchData.crew_chief}</h6>
                            </div>
                          </div>
                          <div
                            style={{ width: "20%" }}
                            className="resource-name float-left text-right"
                          >
                            Crew Chief
                          </div>
                        </div>
                        <Dropdown
                          overlayClassName="add-remove-dropdown-main"
                          overlay={this.menu()}
                          trigger={["click"]}
                        >
                          <Button
                            className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              src={Images.more_black}
                              alt=""
                              className="img-fluid"
                            />
                          </Button>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="col-12 update-table-dispatch">
              {workOrder ? (
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
                        {/*<div className="custom-table-cell-th custom-table-cell-th-3">*/}
                        {/*    <div className="custom-th-heading">*/}
                        {/*        crew chief*/}
                        {/*    </div>*/}
                        {/*</div>*/}
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
                      {workOrder?.workorder_variant && workOrder?.workorder_variant?.map((n) => {
                        return (
                          <DisptachAssignServiceTableMain
                            assignPending={this.props.assignPending}
                            key={n?.id}
                            child={
                              n?.variant_data?.table_pricing ||
                              n?.children ||
                              []
                            }
                            foundRegion={n.variant_data?.region}
                            workorderData={dispatchData}
                            handleDispatchNow={this.handleDispatchNow}
                            manually_added={
                              n?.resource_type === "INVENTORY_KIT"
                                ? true
                                : false
                            }
                            margin={n?.margin}
                            getDispatchInqueue={this.handleDispatchDataById}
                            crewChief = {this.state.crewChief}
                            newPricing={n}
                            view={false}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-12 mt-3">
                  <div className="row no-data-card-row align-items-center justify-content-center">
                    <div className="col-12 text-center">
                      <img
                        src={Images.line_items_empty_state_icon}
                        alt={""}
                        className="img-fluid"
                      />
                      <h6 className="mb-0">No Service Variants</h6>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default DispatchAssignServiceVariantDrawer;
