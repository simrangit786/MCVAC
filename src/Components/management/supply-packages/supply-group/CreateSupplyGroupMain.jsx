import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import CreateGeneralInfoSupplyGroup from "./create/CreateGeneralInfoSupplyGroup";
import CreateSupplyGroupCalculations from "./create/CreateSupplyGroupCalculations";
import { handleError } from "../../../../Controller/Global";
import { getSupplyGroupById } from "../../../../Controller/api/supplyServices";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../Controller/Routes";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { getActiveKey } from "../../../../Controller/utils";
import UnsavedDataPrompt from "../../../modals/UnsavedDataPrompt";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";


const { Panel } = Collapse;

// function callback(key) {
//     console.log(key);
// }

class CreateSupplyGroupMain extends Component {
  state = {
    data: null,
    visible: false,
    visibleWarning: false,
    activeKey: "1",
    name: null,
    subtier: null,
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
  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };

  componentDidMount() {
    let arr = [
      {
        title: "Create Supply Group",
        url: routes.dashboard.management.supply_tools.supply_groups.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Supply Group",
        url: routes.dashboard.management.supply_tools.supply_groups.edit,
      },
    ];
    if (this.props.match.params.id) {
      this.props.setBreadcrumb(arrEdit);
      getSupplyGroupById(this.props.match.params.id)
        .then((res) => {
          this.setState({
            data: res.data,
            name: res.data.name,
            subtier: res.data.parent.parent,
          });
        })
        .catch((err) => {
          handleError(err);
        });
      this.setState({ activeKey: this.props.location.editTab || "1" })
    } else {
      this.props.setBreadcrumb(arr);
    }
  }

  onChange = (name, value) => {
    this.setState({ [name]: value });
  };

  setData = (data, num) => {
    if (this.state.data?.name && this.state.data?.parent) {
      this.setState(() => {
        return { data, unsavedExit: false };
      });
      if (!this.props.match.params.id) {
        this.setState({ requiredSuccessModalVisible: true });
      }
    } else {
      this.setState(() => {
        return { data, unsavedExit: true };
      });
    }

    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (!alreadyExist) {
      this.setState((prevState) => {
        return {
          data,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "2")],
        };
      });
    }
    // this.setState({data, activeKey: getActiveKey(this.state.activeKey, "2")})
  };

  onCollapseChange = (activeKey) => {
    this.setState({ activeKey });
  };

  handleViewMainButtonCLick = () => {
    let { data } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.management.supply_tools.supply_groups.view, {
          id: data.id,
        })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { data, activeKey } = this.state;
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
                //  accordion
                activeKey={activeKey}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                // defaultActiveKey={["1"]}
                onChange={this.onCollapseChange}
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
                  <CreateGeneralInfoSupplyGroup
                    onChange={this.onChange}
                    setData={this.setData}
                    data={data}
                  />
                </Panel>

                <Panel
                  disabled={!data}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Supply Group Calculations <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <CreateSupplyGroupCalculations
                    data={data}
                    setData={this.setData}
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
                      disabled={!data}
                      onClick={() =>
                        this.state.unsavedExit
                          ? history.push(
                              reverse(
                                routes.dashboard.management.supply_tools
                                  .supply_groups.view,
                                { id: data.id }
                              )
                            )
                          : this.handleViewMainButtonCLick()
                      }
                      type={"primary"}
                    >{`View Supply Group`}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Supply Group!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(
                      routes.dashboard.management.supply_tools.supply_groups
                        .view,
                      { id: data.id }
                    )
                  )
                }
                className="bg-transparent border-0 shadow-none p-0"
              >
                View Supply Group
              </Button>
              .
            </p>
          }
          okTitle={"View Supply Group"}
          okAction={() =>
            history.push(
              reverse(
                routes.dashboard.management.supply_tools.supply_groups.view,
                { id: data.id }
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
          } this Supply Group?`}
        />
         <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Supply Group, select View Supply Group."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View Supply Group "}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(routes.dashboard.management.supply_tools.supply_groups.view,
                { id: data?.id })
            );
            console.log(data?.id,"iddd")
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(CreateSupplyGroupMain);
