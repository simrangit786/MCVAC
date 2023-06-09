import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformationVehicle from "./info-create/GeneralInformationVehicle";
import CreateVehicleGroupCalculations from "./info-create/CreateVehicleGroupCalculations";
import { withRouter } from "react-router-dom";
import { getFleetGroupById } from "../../../../Controller/api/vehicleServices";
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


const { Panel } = Collapse;

class CreateVehicleGroupMain extends Component {
  state = {
    data: null,
    name: "",
    subtier: null,
    activeKey: ["1"],
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
        title: "Create Fleet Group",
        url: routes.dashboard.management.fleet.groups.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Fleet Group",
        url: routes.dashboard.management.fleet.groups.edit,
      },
    ];
    if (this.props.match?.params.id) {
      this.props.setBreadcrumb(arrEdit);
      getFleetGroupById(this.props?.match?.params?.id)
        .then((res) => {
          this.setState({
            data: res?.data,
            name: res.data.name,
            subtier: res.data.parent,
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
      alreadyExist = this.state.activeKey?.find((i) => i == num);
    }
    if (alreadyExist) {
      return null;
    } else {
      this.setState((prevState) => {
        return {
          data,
          activeKey: [...prevState.activeKey, ...getActiveKey(num - 1, "2")],
        };
      });
    }
    // this.setState({data, active: getActiveKey(this.state.active, "2")})
  };

  onCollapseChange = (key) => {
    this.setState({ activeKey: key });
  };

  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };


  handleViewMainButtonCLick = () => {
    let { data } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.management.fleet.groups.view, { id: data.id })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { data, name, subtier, activeKey } = this.state;
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
                onChange={this.onCollapseChange}
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
                  <GeneralInformationVehicle
                    onChange={this.onChange}
                    name={name}
                    subtier={subtier}
                    setData={this.setData}
                    data={data}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Fleet Group Calculations <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <CreateVehicleGroupCalculations
                    name={name}
                    subtier={subtier}
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
                                routes.dashboard.management.fleet.groups.view,
                                { id: data.id }
                              )
                            )
                          : this.handleViewMainButtonCLick()
                      }
                      type={"primary"}
                    >
                      View Fleet Group
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Fleet Group !`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(routes.dashboard.management.fleet.groups.view, {
                      id: data.id,
                    })
                  )
                }
                className="border-0 bg-transparent shadow-none p-0"
              >
                View Fleet Group
              </Button>
              .
            </p>
          }
          okTitle={"View Fleet Group"}
          okAction={() =>
            history.push(
              reverse(routes.dashboard.management.fleet.groups.view, {
                id: data.id,
              })
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
          } this Fleet Group?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the Fleet Group, select View Fleet Group."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View Fleet Group "}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(
                routes.dashboard.management.fleet.groups.view,
                { id: data.id }
                )
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(CreateVehicleGroupMain)
);
