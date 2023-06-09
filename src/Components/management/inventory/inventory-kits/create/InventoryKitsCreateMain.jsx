import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformationInevntoryKits from "./GeneralInformationInevntoryKits";
import InventoryKitsCreate from "./InventoryKitsCreate";
import { getInventoryKitById } from "../../../../../Controller/api/inventoryServices";
import { handleError } from "../../../../../Controller/Global";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../../Controller/Routes";
import { getActiveKey } from "../../../../../Controller/utils";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import { withRouter } from "react-router-dom";
import RequireSuccessModal from "../../../../modals/requiredDataModals/RequireSuccessModal";

const { Panel } = Collapse;

class InventoryKitsCreateMain extends Component {
  state = {
    kit: null,
    active: ["1"],
    visible: false,
    visibleWarning: false,
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
  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };

  componentDidMount() {
    let arr = [
      {
        title: "Create Inventory Kit",
        url: routes.dashboard.management.inventory.inventory_kits.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Inventory Kit",
        url: routes.dashboard.management.inventory.inventory_kits.edit,
      },
    ];
    if (this.props.match.params.id) {
      getInventoryKitById(this.props.match.params.id)
        .then((res) => {
          this.props.setBreadcrumb(arrEdit);
          this.setState({ kit: res.data });
      this.setState({ active: this.props.location.editTab || "1" })
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      this.props.setBreadcrumb(arr);
    }
  }

  setKit = (kit, num) => {
    let alreadyExist = null;
    if (this.state.active.length > 1) {
      alreadyExist = this.state.active.find((i) => i == num);
    }
    if (alreadyExist) {
      return null;
    } else {
      this.setState((prevState) => {
        return {
          kit,
          active: [...prevState.active, ...getActiveKey(num - 1, "2")],
        };
      });
    }
    if(this.state.kit.name && this.state.kit.unit) {
      this.setState(() => {
        return {kit,unsavedExit:false}
      })
      if (!this.props.match.params.id) {
        this.setState({ requiredSuccessModalVisible: true });
      }
    } else {
      this.setState(() => {
        return {kit}
      })
    }
    // this.setState({kit, active: getActiveKey(this.state.active, "2")})
  };

  handleTabChange = (key) => {
    this.setState({ active: key });
  };

  handleViewMainButtonCLick = () => {
    let { kit } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.management.inventory.inventory_kits.view, {
          id: this.props?.match?.params?.id || kit.id,
        })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { kit } = this.state;
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <Collapse
                activeKey={this.state.active}
                onChange={this.handleTabChange}
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
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <GeneralInformationInevntoryKits
                    kit={kit}
                    setKit={this.setKit}
                  />
                </Panel>

                <Panel
                  disabled={!kit}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Inventory Items</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">Optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <InventoryKitsCreate kit={kit} setKit={this.setKit} />
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
                      disabled={!kit}
                      onClick={() =>
                        this.state.unsavedExit
                          ? history.push(
                              reverse(
                                routes.dashboard.management.inventory
                                  .inventory_kits.view,
                                { id: this.props?.match?.params?.id || kit.id }
                              )
                            )
                          : this.handleViewMainButtonCLick()
                      }
                      type={"primary"}
                    >{`View Inventory Kit`}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Inventory Kit!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(
                      routes.dashboard.management.inventory.inventory_kits.view,
                      { id: this.props.match.params.id || this.state.kit.id }
                    )
                  )
                }
                className="bg-transparent border-0 shadow-none p-0"
              >
                View Inventory Kit
              </Button>
              .
            </p>
          }
          okTitle={"View Inventory Kit"}
          okAction={() =>
            history.push(
              reverse(
                routes.dashboard.management.inventory.inventory_kits.view,
                { id: this.props.match.params.id || this.state.kit.id }
              )
            )
          }
          visible={this.state.visible}
          onClose={() => this.showConfirmModal(false)}
        />

        <CommonWarningModal
          visible={this.state.visibleWarning}
          onClose={() => this.showWarningModal(false)}
          heading={`Are you sure you want to exit ${
            this.props.match.params.id ? "editing" : "creating"
          } this Inventory Kit?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Inventory kit, select View Inventory kit."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View Inventory KIt "}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              routes.dashboard.management.inventory.inventory_kits.view,
                { id: this.props.match.params.id || this.state.kit.id }
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(InventoryKitsCreateMain)
);
