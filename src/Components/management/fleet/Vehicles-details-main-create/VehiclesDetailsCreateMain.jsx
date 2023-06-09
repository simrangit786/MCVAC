import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformationVehicleCreate from "./Create/info-all-component/GeneralInformationVehicleCreate";
import CreateRegistrationInformation from "./Create/info-all-component/CreateRegistrationInformation";
import CreateMetrics from "./Create/info-all-component/CreateMetrics";
import CreateLIfeTimeCosts from "./Create/info-all-component/CreateLIfeTimeCosts";
import CreateTechnicalDetails from "./Create/info-all-component/CreateTechnicalDetails";
import CreatePaymentInformation from "./Create/info-all-component/CreatePaymentInformation";
import CreateVehicleCalculations from "./Create/info-all-component/CreateVehicleCalculations";
import { getVehicleById } from "../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../Controller/Global";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../Controller/Routes";
import { getActiveKey } from "../../../../Controller/utils";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { withRouter } from "react-router-dom";
import CreateInternalLocation from "./Create/info-all-component/CreateInternalLocation";
import { Image } from "../../../Images";
import CreateVehicleDocuments from "./Create/info-all-component/CreateVehicleDocuments";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";

const { Panel } = Collapse;

class VehiclesDetailsCreateMain extends Component {
  state = {
    vehicle: null,
    activeKey: ["1"],
    button: "View",
    visible: false,
    visibleWarning: false,
    unsavedExit: false,
    requiredSuccessModalVisible: false
  };

  showConfirmModal = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  showWarningModal = (visible) => {
    this.setState({
      visibleWarning: visible,
    });
  };

  componentDidMount() {
    let arrCreate = [
      {
        title: "Create Vehicle",
        url: routes.dashboard.management.fleet.vehicle.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Vehicle",
        url: routes.dashboard.management.fleet.vehicle.edit,
      },
    ];
    if (this.props.match.params.id) {
      this.props.setBreadcrumb(arrEdit);
      getVehicleById(this.props.match.params.id)
        .then((res) => {
          this.setState({
            vehicle: res.data,
            fleet_group: res.data?.fleet_group?.id,
          });
        })
        .catch((err) => {
          handleError(err);
        });
      this.setState({ activeKey: this.props.location.editTab || "1" })
    } else {
      this.props.setBreadcrumb(arrCreate);
    }
  }

  setVehicle = (vehicle, num) => {
    let vech = this.state?.vehicle;
    if (
      vech?.name &&
      this.state?.fleet_group &&
      vech?.status &&
      vech?.fuel_type
    ) {
      if (
        vehicle.current_meter_unit &&
        vehicle.secondary_meter_unit &&
        vehicle.fuel_volume_unit &&
        vehicle.internal_location
      ) {
        this.setState(() => {
          return { vehicle, unsavedExit: false };
        });
        if (!this.props.match.params.id) {
          this.setState({ requiredSuccessModalVisible: true });
        }
      } else {
        this.setState(() => {
          return { vehicle };
        });
      }
    } else {
      this.setState(() => {
        return { vehicle, unsavedExit: true };
      });
    }

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          vehicle,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "9")],
        };
      });
    }
    // this.setState({vehicle, activeKey: getActiveKey(this.state.activeKey, "7")})
  };
  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };
  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };
  onCompletedVehicleCreate = () => {
    // message.success("Vehicle Created successfully!")
    history.push(
      reverse(routes.dashboard.management.fleet.vehicle.view, {
        id: this.state?.vehicle?.id,
      })
    );
  };

  onChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleViewMainButtonCLick = () => {
    let { data } = this.state;
    if (this.props?.match?.params?.id) {
      this.onCompletedVehicleCreate();
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { vehicle, activeKey, button, fleet_group } = this.state;
    return (
      <React.Fragment>
        {/* <UnsavedDataPrompt unsavedExit={this.state.unsavedExit} exit={true} message={""}/> */}
        <UnsavedDataPrompt
          // unsavedExit={this.state.unsavedExit} exit={true} message={""}
          when={this.state.unsavedExit}
          title="You haven't added all of the required information."
          cancelText="Continue"
          okText="Exit"
          onOK={() => true}
          onCancel={() => false}
        />
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <Collapse
                activeKey={activeKey}
                onChange={this.collapseOnChange}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                // defaultActiveKey={["1"]}
              >
                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          General Information <sup>*</sup>
                        </h5>
                        {/* {
                          vehicle && vehicle.name !== "" ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <GeneralInformationVehicleCreate
                    onChange={this.onChange}
                    fleet_group={fleet_group}
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
                <Panel
                  disabled={!vehicle}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Vehicle Calculations</h5>
                        {/* {
                          vehicle && vehicle.estimated_days != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <CreateVehicleCalculations
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
                <Panel
                  disabled={!vehicle}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Warehouse <sup>*</sup>
                        </h5>
                        {/* {
                          vehicle && vehicle.internal_location != null ? (
                            <img
                              alt=""
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="3"
                >
                  <CreateInternalLocation
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
                <Panel
                  disabled={!vehicle}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Registration Information</h5>
                        {/* {
                          vehicle && vehicle.vin_sin != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="4"
                >
                  <CreateRegistrationInformation
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
                <Panel
                  disabled={!vehicle}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Metrics <sup>*</sup>
                        </h5>
                        {/* {
                          vehicle && vehicle.current_meter_unit != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="5"
                >
                  <CreateMetrics
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
                <Panel
                  disabled={!vehicle}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Lifetime Costs</h5>
                        {/* {
                          vehicle && vehicle.service_cost != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="6"
                >
                  <CreateLIfeTimeCosts
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
                <Panel
                  disabled={!vehicle}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Technical Details</h5>
                        {/* {
                          vehicle && vehicle.msrp != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="7"
                >
                  <CreateTechnicalDetails
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
                <Panel
                  disabled={!vehicle}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Payment Information</h5>
                        {/* {
                          vehicle && vehicle.monthaly_cost != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="8"
                >
                  <CreatePaymentInformation
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
                <Panel
                  disabled={!vehicle}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Documents</h5>
                        {/* {
                          vehicle && vehicle.msrp != null ? (
                            <img
                              alt={""}
                              className="img-fluid"
                              src={Image.create_ac_checkmark}
                            />
                          ) : (
                            ""
                          )
                          // <Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>
                        } */}
                      </div>
                    </div>
                  }
                  key="9"
                >
                  <CreateVehicleDocuments
                    setVehicle={this.setVehicle}
                    vehicle={vehicle}
                  />
                </Panel>
              </Collapse>
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 justify-content-end common-form-btn-row">
                    <Button
                      onClick={() => this.showWarningModal(true)}
                      style={{ margin: "0 8px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        this.state.unsavedExit
                          ? this.onCompletedVehicleCreate()
                          : this.handleViewMainButtonCLick()
                      }
                      disabled={!vehicle}
                      type={"primary"}
                    >
                      {button} Vehicle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={"You’ve successfully created this Vehicle!"}
          subHeading={
            <p className="mb-0">
              To view, select
              <Button
                style={{ marginLeft: 4 }}
                onClick={this.onCompletedVehicleCreate}
                className="shadow-none border-0 bg-transparent p-0"
              >
                View Vehicle
              </Button>
              .
            </p>
          }
          okTitle={"View Vehicle"}
          visible={this.state.visible}
          onClose={() => this.showConfirmModal(false)}
          okAction={this.onCompletedVehicleCreate}
        />
        <CommonWarningModal
          visible={this.state.visibleWarning}
          onClose={() => this.showWarningModal(false)}
          heading={`Are you sure you want to exit ${
            this.props.match.params.id ? "editing" : "creating"
          } this Vehicle?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Vehicle, select View Vehicle."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View Fleet Group "}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              routes.dashboard.management.fleet.vehicle.view,
                { id: vehicle.id }
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(VehiclesDetailsCreateMain)
);
