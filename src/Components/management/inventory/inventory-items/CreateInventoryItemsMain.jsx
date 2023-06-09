import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import CreateGeneralInfoInventoryItems from "./create/CreateGeneralInfoInventoryItems";
import CreateCostInventoryItems from "./create/CreateCostInventoryItems";
import CreateInternalLocationsInventory from "./create/CreateInternalLocationsInventory";
import CreateCustomUnitOfMeasurement from "./create/CreateCustomUnitOfMeasurement";
import CreateVendor from "./create/CreateVendor";
import CreateUniversalMeasurement from "./create/CreateUniversalMeasurement";
import { handleError } from "../../../../Controller/Global";
import { getInventoryById } from "../../../../Controller/api/inventoryServices";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../Controller/Routes";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { withRouter } from "react-router-dom";
import CreateInventoryItemDocuments from "./create/CreateInventoryItemDocuments";
import { getActiveKey } from "../../../../Controller/utils";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";

const { Panel } = Collapse;

class CreateInventoryItemsMain extends Component {
  state = {
    inventory: null,
    active: ["1"],
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
    let arr = [
      {
        title: "Create Inventory Item",
        url: routes.dashboard.management.inventory.inventory_items.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Inventory Item",
        url: routes.dashboard.management.inventory.inventory_items.edit,
      },
    ];
    if (this.props.match.params.id) {
      this.props.setBreadcrumb(arrEdit);
      this.getInventoryItem();
      this.setState({ active: this.props.location.editTab || "1" })
    } else {
      this.props.setBreadcrumb(arr);
    }
  }

  getInventoryItem = () => {
    let Id = this.props.match?.params?.id || this.state.inventory?.id;
    getInventoryById(Id)
      .then((res) => {
        this.setState(
          { inventory: res.data, subtier: res.data.parent.id },
          () => {
            let inven = this.state?.inventory;
            if (inven?.name && inven?.inventory_family) {
              if (!this.props.match?.params?.id) {
                if (
                  inven?.uom_array?.length &&
                  inven?.uom &&
                  inven?.margin &&
                  inven?.unit_cost &&
                  inven?.internal_location?.length
                ) {
                  this.setState(() => {
                    return { inventory: inven, unsavedExit: false };
                  });
                } else {
                  this.setState(() => {
                    return { inventory: inven, unsavedExit: true };
                  });
                }
              }
            }
          }
        );
      })
      .catch((err) => {
        handleError(err);
      });
  };

  onCollapseChange = (key) => {
    this.setState({ active: key });
  };

  setInventory = (inventory, num) => {
    let inven = this.state?.inventory;
    if (inven?.name && inven?.inventory_family) {
      if (
        inventory?.uom_array?.length &&
        inventory?.uom &&
        inventory?.margin &&
        inventory?.unit_cost &&
        inventory?.internal_location?.length
      ) {
        this.setState(() => {
          return { inventory, unsavedExit: false };
        });
        if (!this.props.match.params.id) {
          this.setState({ requiredSuccessModalVisible: true });
        }
      } else {
        this.setState(() => {
          return { inventory };
        });
      }
    } else {
      this.setState(() => {
        return { inventory, unsavedExit: true };
      });
    }

    let alreadyExist = null;
    if (this.state.active.length > 1) {
      alreadyExist = this.state.active.find((i) => i == num);
    }
    if (alreadyExist) {
      return null;
    } else {
      this.setState((prevState) => {
        return {
          inventory,
          active: [...prevState.active, ...getActiveKey(num - 1, "7")],
        };
      });
    }
    // this.setState({inventory, activeKey: getActiveKey(this.state.activeKey, "5")})
  };

  onChange = (name, value) => {
    this.setState({ [name]: value });
  };

  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };

  handleViewMainButtonCLick = () => {
    let { inventory } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.management.inventory.inventory_items.view, {
          id: inventory.id,
        })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    const { inventory, subtier } = this.state;
    return (
      <React.Fragment>
        {/* <UnsavedDataPrompt unsavedExit={this.state.unsavedExit} exit={true} message={""} /> */}
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
                activeKey={this.state.active}
                onChange={this.onCollapseChange}
                // accordion
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                // defaultActiveKey={['1']}
                // defaultActiveKey={
                //   this.props.location.editTab
                //     ? [this.props.location.editTab]
                //     : ["1"]
                // }
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
                  <CreateGeneralInfoInventoryItems
                    onChange={this.onChange}
                    subtier={subtier}
                    inventory={inventory}
                    setInventory={this.setInventory}
                  />
                </Panel>

                <Panel
                  disabled={!inventory}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0 text-capitalize">
                          Universal Units of Measurement <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <CreateUniversalMeasurement
                    inventory={inventory}
                    setInventory={this.setInventory}
                  />
                </Panel>

                <Panel
                  disabled={!inventory}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Custom units of Measurement</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="3"
                >
                  <CreateCustomUnitOfMeasurement
                    getInventoryItem={this.getInventoryItem}
                    inventory={inventory}
                    setInventory={this.setInventory}
                  />
                </Panel>
                <Panel
                  disabled={!inventory}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Unit Price <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="4"
                >
                  <CreateCostInventoryItems
                    inventory={inventory}
                    setInventory={this.setInventory}
                  />
                </Panel>
                <Panel
                  disabled={!inventory}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Warehouses <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="5"
                >
                  <CreateInternalLocationsInventory
                    getInventoryItem={this.getInventoryItem}
                    inventory={inventory}
                    setInventory={this.setInventory}
                    setInternalLocOnDelete={this.setInternalLocOnDelete}
                  />
                </Panel>
                <Panel
                  disabled={!inventory}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Vendors</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="6"
                >
                  <CreateVendor
                    inventory={inventory}
                    setInventory={this.setInventory}
                  />
                </Panel>
                <Panel
                  disabled={!inventory}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Documents</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="7"
                >
                  <CreateInventoryItemDocuments 
                  inventory={inventory}
                  setInventory={this.setInventory}/>
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
                          ? history.push(
                              reverse(
                                routes.dashboard.management.inventory
                                  .inventory_items.view,
                                { id: inventory.id }
                              )
                            )
                          : this.handleViewMainButtonCLick()
                      }
                      type={"primary"}
                    >{`View Inventory Item`}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Inventory Item!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(
                      routes.dashboard.management.inventory.inventory_items
                        .view,
                      { id: inventory.id }
                    )
                  )
                }
                className="bg-transparent border-0 shadow-none p-0"
              >
                View Inventory Item
              </Button>
              .
            </p>
          }
          okTitle={"View Inventory Item"}
          okAction={() =>
            history.push(
              reverse(
                routes.dashboard.management.inventory.inventory_items.view,
                { id: inventory.id }
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
          } this Inventory Item?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Inventory Item, select View Inventory Item."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View InventoryItem"}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse( routes.dashboard.management.inventory.inventory_items.view, {
                id: inventory.id,
              })
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(CreateInventoryItemsMain)
);
