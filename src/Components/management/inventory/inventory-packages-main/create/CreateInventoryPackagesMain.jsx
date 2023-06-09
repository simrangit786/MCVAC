import React, { Component } from "react";
import { Button, Collapse, Steps } from "antd";
import CreateStepOneInventoryPackage from "./CreateStepOneInventoryPackage";
import CreateStepTwoInventoryGroups from "./CreateStepTwoInventoryGroups";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../../Controller/Routes";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import RequireSuccessModal from "../../../../modals/requiredDataModals/RequireSuccessModal";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformation from "../../../service/family/create/GeneralInformation";
import ServiceTree from "../../../service/family/create/ServiceTree";
import GeneralInfoInventoryFamily from "./GeneralInfoInventoryFamily";
import InventoryFamilyTree from "./InventoryFamilyTree";
import { getInventoryFamilyById } from "../../../../../Controller/api/inventoryServices";
import { handleError } from "../../../../../Controller/Global";
import { getActiveKey } from "../../../../../Controller/utils";
import UnsavedDataPrompt from "../../../../modals/UnsavedDataPrompt";

const { Step } = Steps;
const { Panel } = Collapse;

class CreateInventoryPackagesMain extends Component {
  state = {
    current: 0,
    packageData: null,
    visible: false,
    visibleWarning: false,
    activeKey: "1",
    unsavedExit: false,
    requiredSuccessModalVisible: false,
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
  next = () => {
    this.setState({ current: this.state.current + 1 });
  };
  setPackage = (packageData, num) => {
    // if (this.state.packageData?.name && this.state.packageData?.description) {
    if (this.state.packageData?.name) {
      this.setState(() => {
        return { packageData };
      });
    } else {
      this.setState(() => {
        return { packageData, unsavedExit: true };
      });
    }

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          packageData,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "2")],
        };
      });
    }
    // this.setState({ packageData })
  };

  prev = () => {
    this.setState({ current: this.state.current - 1 });
  };
  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };
  componentDidMount() {
    if (this.props.match.params.id) {
      this.getPackage(this.props.match.params.id);
      this.setState({ activeKey: this.props.location.editTab || "1" })
    }
  }

  getPackage = (id) => {
    this.setState({ loading: true });
    getInventoryFamilyById(id)
      .then((res) => {
        this.setState({ packageData: res.data }, () => {
          let pd = this.state?.packageData;
          // if (pd?.name && pd?.description) {
          if (pd?.name) {
            if (!pd?.parent?.children?.length) {
              if (this.props.match.params.id) {
                //do nothing
              } else {
                this.setState({ packageData: pd, unsavedExit: true });
              }
            } else {
              this.setState({ packageData: pd, unsavedExit: false });
              if (!this.props.match.params.id) {
                this.setState({ requiredSuccessModalVisible: true });
              }
            }
          }
        });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleViewMainButtonCLick = () => {
    let { packageData } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.management.inventory.inventory_packages.view, {
          id: packageData.id,
        })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { activeKey, packageData } = this.state;
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
              <div className="steps-content">
                <Collapse
                  onChange={this.collapseOnChange}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  // defaultActiveKey={["1"]}
                  activeKey={activeKey}
                >
                  <Panel
                    header={
                      <div className="w-100 d-flex info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          General Information <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    }
                    key="1"
                  >
                    <GeneralInfoInventoryFamily
                      packageData={this.state.packageData}
                      setPackage={this.setPackage}
                      getPackage={this.getPackage}
                    />
                  </Panel>
                  <Panel
                    header={
                      <div className="w-100 d-flex info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Inventory Family <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    }
                    key="2"
                  >
                    <InventoryFamilyTree
                      packageData={this.state.packageData}
                      setPackage={this.setPackage}
                      getPackage={this.getPackage}
                    />
                  </Panel>
                </Collapse>
              </div>
              <div className="steps-action common-steps-action d-flex align-items-center justify-content-end">
                <Button
                  onClick={() => this.showWarningModal(true)}
                  className="border-0 shadow-none text-center"
                  style={{ margin: "0 8px" }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!packageData}
                  type="primary"
                  className="border-0 shadow-none text-center"
                  onClick={() =>
                    this.state.unsavedExit
                      ? history.push(
                          reverse(
                            routes.dashboard.management.inventory
                              .inventory_packages.view,
                            { id: packageData.id }
                          )
                        )
                      : this.handleViewMainButtonCLick()
                  }
                >
                  {`View Inventory Family`}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Inventory Family!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(
                      routes.dashboard.management.inventory.inventory_packages
                        .view,
                      { id: packageData.id }
                    )
                  )
                }
                className="bg-transparent border-0 shadow-none p-0"
              >
                View Inventory Family
              </Button>
              .
            </p>
          }
          okTitle={"View Inventory Family"}
          okAction={() =>
            history.push(
              reverse(
                routes.dashboard.management.inventory.inventory_packages.view,
                { id: packageData.id }
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
          } this Inventory Family?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the inventory family, select View inventoryFamily."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View inventoryFamily"}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(
                routes.dashboard.management.inventory.inventory_packages.view,
                { id: packageData.id }
              )
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(CreateInventoryPackagesMain);
