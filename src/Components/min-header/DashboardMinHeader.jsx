import React, { Component } from "react";
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Popover,
  Row,
  Select,
} from "antd";
import { Image as Images } from "../Images";
import { CaretRightOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;
function handleChange(value) {
  // console.log(`selected ${value}`);
}

function onChange(date, dateString) {
  // console.log(date, dateString);
}

function onChangeCheckbox(checkedValues) {
  // console.log("checked = ", checkedValues);
}

const { Panel } = Collapse;

function callback(key) {
  // console.log(key);
}

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}
const CheckboxGroup = Checkbox.Group;

class DashboardMinHeader extends Component {
  state = {
    visible: false,
    indeterminate: true,
    checkAll: false,
  };

  filterDataPop = [
    <React.Fragment>
      <div className="filter-main-card row mx-0">
        <div className="col-12 col-sm-3">
          <div className="row mx-0 type-working-checkbox">
            <div className="col-12">
              <h6 className="d-flex align-items-center justify-content-between">
                Type{" "}
                <Button className="clear-btn border-0 p-0 bg-transparent">
                  Clear
                </Button>
              </h6>
            </div>
            <div className="col-12">
              <Checkbox.Group onChange={onChangeCheckbox}>
                <Row>
                  <Col span={24}>
                    <Checkbox value="A">Work Orders</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="B">Proposals</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="C">Projects</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="D">Leads</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="E">Accounts</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="F">Tasks</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="G">Contacts</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </div>
          </div>
          <div className="row mx-0 type-working-checkbox">
            <div className="col-12">
              <h6 className="d-flex align-items-center justify-content-between">
                Status{" "}
                <Button className="clear-btn border-0 p-0 bg-transparent">
                  Clear
                </Button>
              </h6>
            </div>
            <div className="col-12">
              <div className="site-checkbox-all-wrapper">
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  checked={this.state.checkAll}
                >
                  Select All
                </Checkbox>
              </div>
              <Collapse
                defaultActiveKey={["1"]}
                onChange={callback}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel header="Work Orders" key="1">
                  <CheckboxGroup onChange={this.onChange}>
                    <Row>
                      <Col span={24}>
                        <Checkbox value="A">Created</Checkbox>
                      </Col>
                    </Row>
                  </CheckboxGroup>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-3">
          <div className="row">
            <div className="col-12">
              <div className="row mx-0 type-working-checkbox">
                <div className="col-12">
                  <h6 className="d-flex align-items-center justify-content-between">
                    <span>
                      Accounts <small>(1/24)</small>
                    </span>
                    <Button className="clear-btn border-0 p-0 bg-transparent">
                      Clear
                    </Button>
                  </h6>
                </div>
                <div className="col-12">
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    checked={this.state.checkAll}
                  >
                    Select All
                  </Checkbox>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Enter Account Name"
                    defaultValue={["Hudson Cleanup"]}
                    onChange={handleChange}
                  >
                    {children}
                  </Select>
                </div>
              </div>
              <div className="row mx-0 type-working-checkbox">
                <div className="col-12">
                  <h6 className="d-flex align-items-center justify-content-between">
                    <span>
                      Proposals <small>(1/24)</small>
                    </span>
                    <Button className="clear-btn border-0 p-0 bg-transparent">
                      Clear
                    </Button>
                  </h6>
                </div>
                <div className="col-12">
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    checked={this.state.checkAll}
                  >
                    Select All
                  </Checkbox>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Enter Account Name"
                    defaultValue={["Hudson Cleanup", "Proposal Name"]}
                    onChange={handleChange}
                  >
                    {children}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-3">
          <div className="row">
            <div className="col-12">
              <div className="row mx-0 type-working-checkbox">
                <div className="col-12">
                  <h6 className="d-flex align-items-center justify-content-between">
                    <span>Expenses</span>
                    <Button className="clear-btn border-0 p-0 bg-transparent">
                      Clear
                    </Button>
                  </h6>
                </div>
                <div className="col-12">
                  <div className="row mx-0 expenses-values-row-main">
                    <div className="col-12">
                      <Form>
                        <div className="row expenses-row-inner align-items-center justify-content-between position-relative">
                          <Input placeholder="Min" />
                          <Input placeholder="Min" />
                          <span className="between-space">-</span>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mx-0 type-working-checkbox">
                <div className="col-12">
                  <h6 className="d-flex align-items-center justify-content-between">
                    <span>Revenue</span>
                    <Button className="clear-btn border-0 p-0 bg-transparent">
                      Clear
                    </Button>
                  </h6>
                </div>
                <div className="col-12">
                  <div className="row mx-0 expenses-values-row-main">
                    <div className="col-12">
                      <Form>
                        <div className="row expenses-row-inner align-items-center justify-content-between position-relative">
                          <Input placeholder="Min" />
                          <Input placeholder="Min" />
                          <span className="between-space">-</span>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mx-0 type-working-checkbox">
                <div className="col-12">
                  <h6 className="d-flex align-items-center justify-content-between">
                    <span>Profit</span>
                    <Button className="clear-btn border-0 p-0 bg-transparent">
                      Clear
                    </Button>
                  </h6>
                </div>
                <div className="col-12">
                  <div className="row mx-0 expenses-values-row-main">
                    <div className="col-12">
                      <Form>
                        <div className="row expenses-row-inner align-items-center justify-content-between position-relative">
                          <Input placeholder="Min" />
                          <Input placeholder="Min" />
                          <span className="between-space">-</span>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mx-0 type-working-checkbox">
                <div className="col-12">
                  <h6 className="d-flex align-items-center justify-content-between">
                    <span>Hours Worked</span>
                    <Button className="clear-btn border-0 p-0 bg-transparent">
                      Clear
                    </Button>
                  </h6>
                </div>
                <div className="col-12">
                  <div className="row mx-0 expenses-values-row-main">
                    <div className="col-12">
                      <Form>
                        <div className="row expenses-row-inner align-items-center justify-content-between position-relative">
                          <Input placeholder="Min" />
                          <Input placeholder="Min" />
                          <span className="between-space">-</span>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-3">
          <div className="row mx-0 date-created-row">
            <Collapse
              defaultActiveKey={["1"]}
              onChange={callback}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 90} />
              )}
            >
              <Panel header="Date Created" key="1">
                <RangePicker />
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
      <div className="footer-row-main-fix row mx-0">
        <div>
          <Button>Clear All</Button>
          <Button type={"primary"}>Apply Filter</Button>
        </div>
      </div>
    </React.Fragment>,
  ];

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0 align-items-center mini-header-filter-list-grid-row">
          <div className="col-12">
            <div className="row mx-0 justify-content-end">
              <div className="filters-div">
                <Popover
                  overlayClassName="popover-main-all"
                  content={this.filterDataPop}
                  title={false}
                  trigger="click"
                  visible={this.state.visible}
                  placement="bottom"
                  onVisibleChange={this.handleVisibleChange}
                >
                  <Button className="filter-btn text-capitalize">
                    <img
                      alt=""
                      className="img-fluid"
                      src={Images.filter_icon}
                    />
                    Filter
                  </Button>
                </Popover>
              </div>
              <div className="month-select-picker-div">
                <Select
                  dropdownClassName="select-month-day-select"
                  placeholder="This Month"
                  onChange={handleChange}
                  suffixIcon={
                    <img
                      src={Images.green_small_caret_down}
                      alt=""
                      className="img-fluid"
                    />
                  }
                >
                  <Option value="a">Today</Option>
                  <Option value="b">This Week</Option>
                  <Option value="c">This Month</Option>
                  <Option value="d">This Year</Option>
                  <Option value="e">All TIme</Option>
                  <Option value="f">Customi Date</Option>
                </Select>
              </div>
              <div className="list-view-div">
                <Button className="list-view-btn text-uppercase">
                  <img
                    alt=""
                    className="img-fluid"
                    src={Images.list_view_img}
                  />
                  List view
                </Button>
              </div>
              <div className="calendar-view-div">
                <DatePicker
                  className={
                    "calendar-view-btn p-0 d-flex align-items-center justify-content-center"
                  }
                  suffixIcon={
                    <img
                      alt=""
                      className="img-fluid"
                      src={Images.calendar_view_img}
                    />
                  }
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DashboardMinHeader;
