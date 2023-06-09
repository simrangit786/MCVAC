import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformationSupplyTools from "./create/GeneralInformationSupplyTools";
import DocumentSupplyTools from "./create/DocumentSupplyTools";
import CostSupplyTools from "./create/CostSupplyTools";
import CreateInternalLocation from "./create/CreateInternalLocation";
import { getSupplyById } from "../../../../Controller/api/supplyServices";
import { handleError } from "../../../../Controller/Global";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/src";
import { routes } from "../../../../Controller/Routes";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { connect } from "react-redux";
import { getActiveKey } from "../../../../Controller/utils";
import { Image } from "../../../Images";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";

const { Panel } = Collapse;

function callback(key) {
  // console.log(key);
}

class CreateSupplySmallToolsMain extends Component {
  state = {
    supply: null,
    visible: false,
    visibleWarning: false,
    activeKey: ["1"],
    unsavedExit: false,
    requiredSuccessModalVisible: false
  };

  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };

  setSupply = (supply, num) => {
    if (this.state.supply?.name && this.state.supply?.supply_group) {
      if (
        supply?.internal_location &&
        supply.estimate_days &&
        supply.estimate_life &&
        supply.average_hours &&
        supply.purchase_price
      ) {
        this.setState(() => {
          return { supply, unsavedExit: false };
        });
        if (!this.props.match.params.id) {
          this.setState({ requiredSuccessModalVisible: true });
        }
      } else {
        this.setState(() => {
          return { supply };
        });
      }
    } else {
      this.setState(() => {
        return { supply, unsavedExit: true };
      });
    }

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          supply,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "4")],
        };
      });
    }
    // this.setState({supply, activeKey: getActiveKey(this.state.activeKey, "5")})
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
    let arrEdit = [
      {
        title: "Edit Supply/Small tool",
        url: routes.dashboard.management.supply_tools.self,
      },
    ];
    let arr = [
      {
        title: "Create Supply/Small tool",
        url: routes.dashboard.management.supply_tools.self,
      },
    ];

    if (this.props.match.params.id) {
      this.props.setBreadcrumb(arrEdit);

      getSupplyById(this.props.match.params.id)
        .then((res) => {
          this.setState({ supply: res.data });
      this.setState({ activeKey: this.props.location.editTab || "1" })
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      this.props.setBreadcrumb(arr);
    }
  }

  getSupply = () => {
    let ID = this.props.match.params.id || this.state.supply.id;
    getSupplyById(ID)
      .then((res) => {
        this.setState({ supply: res.data }, () => {
          let sup = this.state?.supply;
          if (sup?.name && sup?.supply_group) {
            if (!this.props.match.params.id) {
              if (
                sup?.internal_location &&
                sup.estimate_days &&
                sup.estimate_life &&
                sup.average_hours &&
                sup.purchase_price
              ) {
                this.setState(() => {
                  return { supply: sup, unsavedExit: false };
                });
              } else {
                this.setState(() => {
                  return { supply: sup, unsavedExit: true };
                });
              }
            }
          }
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };
  handleViewMainButtonCLick = () => {
    let { supply } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.management.supply_tools.supply_tools.view, {
          id: supply.id,
        })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { supply, activeKey } = this.state;
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
                // accordion
                activeKey={activeKey}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                // defaultActiveKey={["1"]}
                onChange={this.collapseOnChange}
              >
                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          General Information <sup>*</sup>
                        </h5>
                        {/* {
                          supply && supply.name != "" ? (
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
                  <GeneralInformationSupplyTools
                    supply={supply}
                    setSupply={this.setSupply}
                  />
                </Panel>
                <Panel
                  disabled={!supply}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Warehouse</h5>
                        {/* {supply && supply.internal_location != null ? (
                          <img
                            alt={""}
                            className="img-fluid"
                            src={Image.create_ac_checkmark}
                          />
                        ) : (
                          <Button className="border-0 p-0 bg-transparent text-uppercase">
                            required
                          </Button>
                        )} */}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <CreateInternalLocation
                    supply={supply}
                    setSupply={this.setSupply}
                    getSupply={this.getSupply}
                  />
                </Panel>
                <Panel
                  disabled={!supply}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Supply/Small Tools Calculations <sup>*</sup>
                        </h5>
                        {/* {
                          supply && supply.estimate_days != null ? (
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
                  key="3"
                >
                  <CostSupplyTools
                    supply={supply}
                    setSupply={this.setSupply}
                    getSupply={this.getSupply}
                  />
                </Panel>

                <Panel
                  disabled={!supply}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Documents</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="4"
                >
                  <DocumentSupplyTools
                    supply={supply}
                    setSupply={this.setSupply}
                  />
                </Panel>
              </Collapse>
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 justify-content-end common-form-btn-row">
                    <Button
                      onClick={() => this.showWarningModal(true)}
                      className="border-0 shadow-none text-center"
                      style={{ margin: "0 8px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!supply}
                      onClick={() =>
                        this.state.unsavedExit
                          ? history.push(
                              reverse(
                                routes.dashboard.management.supply_tools
                                  .supply_tools.view,
                                { id: supply.id }
                              )
                            )
                          : this.handleViewMainButtonCLick()
                      }
                      type={"primary"}
                    >{`View Supply/Small Tools`}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Supply/Small Tool!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(
                      routes.dashboard.management.supply_tools.supply_tools
                        .view,
                      { id: supply.id }
                    )
                  )
                }
                className="bg-transparent border-0 shadow-none p-0"
              >
                View Supply/Small Tool
              </Button>
              .
            </p>
          }
          okTitle={"View Supply/Small Tool"}
          okAction={() =>
            history.push(
              reverse(
                routes.dashboard.management.supply_tools.supply_tools.view,
                { id: supply.id }
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
          } this Supply/Small Tool?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Supply Small Tool, select View Supply Small Tool."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View Supply Small Tool "}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              routes.dashboard.management.supply_tools.supply_tools.view,
                { id: supply.id }
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(CreateSupplySmallToolsMain);
