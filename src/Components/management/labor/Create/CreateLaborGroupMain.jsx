import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformationLabor from "./labor-create-all/GeneralInformationLabor";
import CreateEmployeesLabor from "./labor-create-all/CreateEmployeesLabor";
import CreateShiftInfoLabor from "./labor-create-all/CreateShiftInfoLabor";
import CreateWageInfoLabor from "./labor-create-all/CreateWageInfoLabor";
import { withRouter } from "react-router-dom";
import { getLaborGroupById } from "../../../../Controller/api/labourServices";
import { handleError } from "../../../../Controller/Global";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../Controller/Routes";
import { getActiveKey } from "../../../../Controller/utils";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import RequireSuccessModal from "../../../modals/requiredDataModals/RequireSuccessModal";
import { Image } from "../../../Images";

const { Panel } = Collapse;

function callback(key) {
  // console.log(key);
}
class CreateLaborGroupMain extends Component {
  state = {
    group: null,
    activeKey: ["1"],
    visible: false,
    visibleWarning: false,
    lastActive: 1,
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

  setGroup = (group, num) => {
    let alreadyExist = null;
    if (this.state.activeKey.length > 1) {
      alreadyExist = this.state.activeKey.find((i) => i == num);
    }
    if (alreadyExist) {
      return null;
    } else {
      this.setState((prevState) => {
        let findLastKey = "";
        for (let i = 0; i <= this.state.activeKey.length; i++) {
          if (i == this.state.activeKey.length) {
            findLastKey = i.toString();
          }
        }
        return {
          group: group,
          activeKey: [
            ...prevState.activeKey,
            ...getActiveKey(findLastKey, "4"),
          ],
        };
      });
    }
  };

  handleAllFilled = (group) => {
    if (group) {
      this.setState({ requiredSuccessModalVisible: true });
    }
  };

  collapseOnChange = (activeKey) => {
    this.setState({ activeKey });
  };

  componentDidMount() {
    let arrCreate = [
      {
        title: "Create Labor Group",
        url: routes.dashboard.management.labor.labor_group.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Labor Group",
        url: routes.dashboard.management.labor.labor_group.edit,
      },
    ];
    this.props.setBreadcrumb(this.props.match.params.id ? arrEdit : arrCreate);
    if (this.props.match.params.id) {
      getLaborGroupById(this.props.match.params.id)
        .then((res) => {
          this.setState({ group: res.data });
      this.setState({ activeKey: this.props.location.editTab || "1" })
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }

  handleViewMainButtonCLick = () => {
    let { group } = this.state;
    if (this.props?.match?.params?.id) {
      history.push(
        reverse(routes.dashboard.management.labor.labor_group.view, {
          id: group.id,
        })
      );
    } else {
      this.showConfirmModal(true);
    }
  };

  render() {
    let { group, activeKey } = this.state;
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <Collapse
                //   accordion
                activeKey={activeKey}
                onChange={this.collapseOnChange}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                // defaultActiveKey={["1"]}
                // defaultActiveKey={this.props.location.editTab ? [this.props.location.editTab] : ["1"]}
              >
                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          General Information <sup>*</sup>
                        </h5>
                        {/* {
                          group && group.labor_group_name != "" ? (
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
                  <GeneralInformationLabor
                    group={group}
                    setGroup={this.setGroup}
                    handleAllFilled={this.handleAllFilled}
                  />
                </Panel>
                {/*<Panel disabled={!group} header={*/}
                {/*    <div className="col-12">*/}
                {/*        <div*/}
                {/*            className="row info-card-heading-row align-items-center justify-content-between">*/}
                {/*            <h5 className="mb-0">Shift Information</h5>*/}
                {/*            {group && group.title != null ?*/}
                {/*            <img alt={''} className="img-fluid" src={Image.create_ac_checkmark} />*/}
                {/*            :*/}
                {/*            <Button*/}
                {/*                className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                {/*            }*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*} key="2">*/}
                {/*    <CreateShiftInfoLabor group={group} setGroup={this.setGroup}/>*/}
                {/*</Panel>*/}
                <Panel
                  disabled={!group}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Wage Information</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <CreateWageInfoLabor group={group} setGroup={this.setGroup} />
                  {/*<CreateOperatorCosts/>*/}
                </Panel>
                {/*<Panel header={*/}
                {/*    <div className="col-12">*/}
                {/*        <div*/}
                {/*            className="row info-card-heading-row align-items-center justify-content-between">*/}
                {/*            <h5 className="mb-0">Operator Costs</h5>*/}
                {/*            <Button*/}
                {/*                className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*} key="4">*/}
                {/*    <CreateOperatorCosts/>*/}
                {/*</Panel>*/}
                {/*<Panel header={*/}
                {/*    <div className="col-12">*/}
                {/*        <div*/}
                {/*            className="row info-card-heading-row align-items-center justify-content-between">*/}
                {/*            <h5 className="mb-0">Tech Costs</h5>*/}
                {/*            <Button*/}
                {/*                className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*} key="5">*/}
                {/*    <CreateTeachCosts/>*/}
                {/*</Panel>*/}
                {/*<Panel header={*/}
                {/*    <div className="col-12">*/}
                {/*        <div*/}
                {/*            className="row info-card-heading-row align-items-center justify-content-between">*/}
                {/*            <h5 className="mb-0">Apprentice Costs</h5>*/}
                {/*            <Button*/}
                {/*                className="border-0 p-0 bg-transparent text-uppercase">OPTIONAL</Button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*} key="6">*/}
                {/*    <CreateApprenticeCosts/>*/}
                {/*</Panel>*/}
                <Panel
                  disabled={!group}
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">Employees</h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">optional</Button>*/}
                      </div>
                    </div>
                  }
                  key="3"
                >
                  <CreateEmployeesLabor
                    group={group}
                    setGroup={this.setGroup}
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
                        this.unsavedExit
                          ? history.push(
                              reverse(
                                routes.dashboard.management.labor.labor_group
                                  .view,
                                { id: group.id }
                              )
                            )
                          : this.handleViewMainButtonCLick()
                      }
                      disabled={!group}
                      type={"primary"}
                    >
                      View Labor Group
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
          } this Labor Group!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(
                      routes.dashboard.management.labor.labor_group.view,
                      { id: group.id }
                    )
                  )
                }
                className="bg-transparent border-0 shadow-none p-0"
              >
                View Labor Group
              </Button>
              .{" "}
            </p>
          }
          okTitle={"View Labor Group"}
          okAction={() =>
            history.push(
              reverse(routes.dashboard.management.labor.labor_group.view, {
                id: group.id,
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
          } this Labor Group?`}
        />
        <RequireSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          subHeading={
            "Thank you for adding all the required information! To continue adding optional information, select Continue. To view the labor group, select View laborGroup."
          }
          onClose={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"View laborGroup"}
          onOK={() => {
            this.showRequiredSuccessModal(false);
            history.push(
              reverse(routes.dashboard.management.labor.labor_group.view, {
                id: group.id,
              })
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(null, { setBreadcrumb })(CreateLaborGroupMain)
);
