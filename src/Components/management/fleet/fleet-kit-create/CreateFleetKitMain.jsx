import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
// import GeneralInformationVehicle from "./info-create/GeneralInformationVehicle";
// import CreateVehicleGroupCalculations from "./info-create/CreateVehicleGroupCalculations";
import { withRouter } from "react-router-dom";
// import { getFleetGroupById } from "../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../Controller/Global";
import { connect } from "react-redux";
import { routes } from "../../../../Controller/Routes";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { getActiveKey } from "../../../../Controller/utils";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";
import GeneralInformationKit from "./fleet-info-create/GeneralInformationKit";
import CreateFleetGroup from "./fleet-info-create/CreateFleetGroup";
import { getFleetKitById } from "../../../../Controller/api/vehicleServices";


const { Panel } = Collapse;

class CreateFleetKitMain extends Component {
  state = {
    fleetKit: null,
    name: "",
    subtier: null,
    activeKey: ["1"],
    visible: false,
    visibleWarning: false,
    unsavedExit: false,
    kitCreate: null,
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
        title: "Create Fleet Kit",
        url: routes.dashboard.management.fleet.kit.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Fleet Kit",
        url: routes.dashboard.management.fleet.kit.edit,
      },
    ];
    if (this.props.match?.params.id) {
      this.props.setBreadcrumb(arrEdit);
      getFleetKitById(this.props?.match?.params?.id)
        .then((res) => {
          this.setState({
            fleetKit: res?.data,
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

  handleFleetKit = (data, num) => {
    this.setState({fleetKit: data})
    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (alreadyExist) {
      return null;
    } else {
      this.setState((prevState) => {
        return {
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "2")],
        };
      });
    }
  }

  onCollapseChange = (key) => {
    this.setState({ activeKey: key });
  };

  render() {
    let { fleetKit, activeKey } = this.state;
    return (
      <React.Fragment>
        <UnsavedDataPrompt
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
                onChange={this.onCollapseChange}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          General Information <sup>*</sup>
                        </h5>
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <GeneralInformationKit
                    fleetKit={fleetKit}
                    handleFleetKit = {this.handleFleetKit}
                  />
                </Panel>

                <Panel
                  disabled={!this.state.fleetKit}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Fleet Groups
                        </h5>
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <CreateFleetGroup
                    fleetKit={fleetKit}
                    handleFleetKit={this.handleFleetKit}
                  />
                </Panel>
              </Collapse>
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 justify-content-end common-form-btn-row">
                    <Button
                      style={{ margin: "0 8px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!this.state.fleetKit}
                      onClick={() =>
                          history.push(
                              reverse(
                                routes.dashboard.management.fleet.kit.view,
                                { id: fleetKit.id}
                              )
                            )
                      }
                      type={"primary"}
                    >
                      View Fleet Kit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(CreateFleetKitMain)
);
