import React, { Component } from "react";
import {
  Button,
  Drawer,
  Dropdown,
  Form,
  Menu,
  message,
  Select,
  Spin,
} from "antd";
import { Image as Images } from "../../Images";
import { withRouter } from "react-router-dom";
// import {getUser} from "../../../Controller/api/authServices";
import {
  getVehicle,
  updateVehicle,
} from "../../../Controller/api/vehicleServices";
// import {getVehicleById} from "../../../Controller/api/vehicleServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class AddVehicles extends Component {
  state = {
    assignees: [],
    fetching: false,
    selectedData: null,
    vehicles: [],
    selected_vehicle: "",
    selected_vehicle_id: null,
    fleet_group: this.props.match.params.id,
  };
  menu = (
    <Menu>
      <Menu.Item key="0">
        <Button className="w-100 border-0 shadow-none bg-transparent text-dark">
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  fetchAllVehicles = (params = {}) => {
    this.setState({ fetching: true });
    getVehicle()
      .then((res) => {
        this.setState({ vehicles: res.data.results, fetching: false });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
        this.setState({ fetching: false });
      });
  };
  handleChange = (e) => {
    let v = this.state.vehicles.find((vehicle) => vehicle.id === e);
    this.setState({
      selected_vehicle: v.name,
      selected_vehicle_id: v.id,
      fleet_group: this.props.match.params.id,
    });
  };

  addVehicle = () => {
    updateVehicle(this.state.selected_vehicle_id, {
      fleet_group: this.props.match.params.id,
    })
      .then(() => {
        message.success("Vehicle Added Successfully");
        this.props.onSuccess();
        this.handleClose();
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
          this.handleClose();
        }
      });
  };
  handleClose = () => {
    this.setState({
      assignees: [],
      fetching: false,
      selectedData: null,
      vehicles: [],
      selected_vehicle: "",
      selected_vehicle_id: null,
      fleet_group: this.props.match.params.id,
    });
    this.props.onClose();
  };

  render() {
    const { fetching, assignees } = this.state;
    return (
      <React.Fragment>
        <Drawer
          afterVisibleChange={this.populateData}
          centered
          title="Add Vehicles"
          visible={this.props.visible}
          onOk={this.addVehicle}
          onCancel={this.handleClose}
          closable={true}
          onClose={this.handleClose}
          className="main-all-form-modal main-drawer-div drawer-update"
          width={"625px"}
          placement={"right"}
          destroyOnClose={true}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" onClick={this.addVehicle}>
                Add
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form
                onFinish={this.handleSubmit}
                ref={this.formRef}
                hideRequiredMark={true}
                {...layout}
                className="main-inner-form"
              >
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="assignee"
                      label={"Vehicles"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                      className="position-relative show-arrow-false"
                    >
                      <Select
                        showArrow={false}
                        placeholder="Search"
                        notFoundContent={
                          fetching ? <Spin size="small" /> : null
                        }
                        filterOption={false}
                        onFocus={() => this.fetchAllVehicles()}
                        // onSearch={(e) => this.fetchUser({search: e})}
                        onChange={this.handleChange}
                        suffixIcon={
                          <img
                            alt=""
                            src={Images.caret_down_small_select}
                            className="img-fluid"
                          />
                        }
                        value={null}
                      >
                        {this.state.vehicles.map((vehicle, index) => (
                          <Option key={index} value={vehicle.id}>
                            {vehicle.name}
                          </Option>
                        ))}
                      </Select>
                      <Button
                        style={{ left: "5px", top: "0", bottom: "0" }}
                        className="position-absolute p-0 border-0 bg-transparent m-auto"
                      >
                        <img
                          src={Images.search_icon_gray}
                          className="img-fluid"
                          alt="search icon"
                        />
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
            {this.state.selected_vehicle ? (
              <div className="col-12">
                <div className="row mx-0 add-vehicles-main-row align-items-center position-relative">
                  <div className="add-vehicles-img float-left">
                    <img
                      src={Images.truck_icon_black}
                      alt={""}
                      className="img-fluid"
                    />
                  </div>
                  <div className="add-vehicles-content float-left">
                    <h6>{this.state.selected_vehicle}</h6>
                    {/* <p className="mb-0">Active</p> */}
                  </div>
                  <div className="dropdown-main-select my-auto d-flex align-items-center">
                    <Dropdown
                      overlayClassName="remove-dropdown"
                      overlay={this.menu}
                      trigger={["click"]}
                    >
                      <Button
                        className="ant-dropdown-link p-0 border-0 bg-transparent shadow-none"
                        onClick={(e) => e.preventDefault()}
                      >
                        <img
                          src={Images.eva_more_elisis}
                          alt={""}
                          className="img-fluid"
                        />
                      </Button>
                    </Dropdown>
                  </div>
                </div>
              </div>
            ) : (
              <div className={"col-12"}>
                <div className="row mx-0 mt-3 no-data-card-row shadow-card-box align-items-center justify-content-center">
                  <div className="col-12 text-center">
                    <img
                      src={Images.truck_empty}
                      alt={"contact-icon"}
                      className="img-fluid"
                    />
                    <h6 className="mb-0 mt-2">No Vehicles</h6>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default withRouter(AddVehicles);
