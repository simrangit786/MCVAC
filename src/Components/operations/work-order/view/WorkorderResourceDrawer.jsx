import React, { Component } from "react";
import { Button, Divider, Drawer, Dropdown, Form, Menu, Select, Space, Spin } from "antd";
import { Image as Images } from "../../../Images";
import moment from "moment";
import { getLaborEmployees } from "../../../../Controller/api/labourServices";
import { handleError } from "../../../../Controller/Global";
import { updateDispatchData } from "../../../../Controller/api/dispatchServices";
import WorkOrderAssignServiceTableMain from "./WorkOrderAssignServiceTableMain";
import { debounceEvent } from "../../../../Controller/utils";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class WorkorderResourceDrawer extends Component {
  state = {
    crewChief: "",
    employees: [],
    page: 1,
    fetching: false,
    totalCount: 0
  };

  formRef = React.createRef()
  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.handleRemove(item.id)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  static getDerivedStateFromProps(props) {
    return { crewChief: {...props.workOrder?.dispatch} };
  }

  handleRemove = (e) => {
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
    this.formRef.current.setFieldsValue({
        crew_chief: null
    })
      updateDispatchData(params, this.props.workOrder?.dispatch?.id).then((res) => {
          this.setState({crewChief: res.data})
          this.props.fetchWorkOrder()
      }).catch((err) => {
          handleError(err);
      })

  }
  render() {
    const { workOrder } = this.props;
    const { crewChief,fetching, employees, totalCount } = this.state;
    return (
      <React.Fragment>
        <Drawer
          className="main-all-form-modal main-drawer-div drawer-update"
          title="Assign Resources"
          placement="right"
          width={"75%"}
          maskClosable={false}
          closable={true}
          onClose={this.props.handleClose}
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
                      {workOrder?.service_date
                        ? moment(workOrder?.service_date).format(
                            "MMM D ,YYYY"
                          )
                        : "-"}{" "}
                      |{" "}
                      {workOrder?.start_time
                        ? moment(
                            workOrder?.start_time,
                            "HH:mm"
                          ).format("HH:mm A")
                        : "-"}{" "}
                      -{" "}
                      {workOrder?.end_time
                        ? moment(
                            workOrder?.end_time,
                            "HH:mm"
                          ).format("HH:mm A")
                        : ""}
                    </li>
                  </ul>
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
                        placeholder="Search"
                        // notFoundContent={fetching ? <Spin size="small"/> : null}
                        filterOption={false}
                        onFocus={() => {
                          this.setState({page: 1},() =>{
                            this.fetchEmployees({page: this.state.page})
                          })
                        }}
                        onSearch={(e) => {
                          this.setState({page: 1},() => {
                            this.fetchEmployees({search:e})}
                          )  
                        } }
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
            {!crewChief?.crew_chief && (
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

            {crewChief?.crew_chief && (
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
                                {crewChief.crew_chief.split(" ")[0].split("")[0]}{crewChief.crew_chief.split(" ")[1].split("")[0]}
                              </span>
                            </div>
                            <div className="user-info-div pt-0">
                              <h6>{crewChief.crew_chief}</h6>
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
                          overlay={this.menu(crewChief)}
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
                      {workOrder?.workorder_variant.map((n) => {
                        return (
                          <WorkOrderAssignServiceTableMain
                            key={n?.id}
                            child={
                              n?.variant_data?.table_pricing ||
                              n?.children ||
                              []
                            }
                            foundRegion={n.variant_data?.region}
                            workorderData={workOrder.dispatch}
                            fetchWorkOrder={this.props.fetchWorkOrder}
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

export default WorkorderResourceDrawer;
