import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GeneralInformationInventoryGroup from "./create/GeneralInformationInventoryGroup";
import CreateCost from "./create/CreateCost";
import { handleError } from "../../../../Controller/Global";
import { getInventoryPackageItemById } from "../../../../Controller/api/inventoryServices";
import { routes } from "../../../../Controller/Routes";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/src";
import CommonConfirmationModal from "../../../modals/CommonConfirmationModal";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { withRouter } from "react-router-dom";

const { Panel } = Collapse;

function callback(key) {
  // console.log(key);
}

class CreateInventoryGroupsMain extends Component {
  state = {
    data: null,
    name: "",
    subtier: undefined,
    visible: false,
    visibleWarning: false,
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
        title: "Create Inventory Group",
        url: routes.dashboard.management.inventory.inventory_groups.create,
      },
    ];
    let arrEdit = [
      {
        title: "Edit Inventory Group",
        url: routes.dashboard.management.inventory.inventory_groups.edit,
      },
    ];
    if (this.props.match.params.id) {
      this.props.setBreadcrumb(arrEdit);
      getInventoryPackageItemById(this.props.match.params.id)
        .then((res) => {
          this.setState({
            data: res.data,
            name: res.data.name,
            subtier: res.data.parent,
          });
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      this.props.setBreadcrumb(arr);
    }
  }

  onChange = (name, value) => {
    this.setState({ [name]: value });
  };

  setData = (data) => {
    this.setState({ data });
  };

  render() {
    let { data, name, subtier } = this.state;
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 create-opportunity-row">
            <div className="col-12 col-sm-10">
              <Collapse
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                defaultActiveKey={["1"]}
                onChange={callback}
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
                  <GeneralInformationInventoryGroup
                    onChange={this.onChange}
                    name={name}
                    subtier={subtier}
                    data={data}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="col-12">
                      <div className="row info-card-heading-row align-items-center justify-content-between">
                        <h5 className="mb-0">
                          Cost <sup>*</sup>
                        </h5>
                        {/*<Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>*/}
                      </div>
                    </div>
                  }
                  key="2"
                >
                  <CreateCost
                    onChange={this.onChange}
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
                      onClick={() => this.showConfirmModal(true)}
                      type={"primary"}
                    >{`View Inventory Group`}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonConfirmationModal
          heading={`You’ve successfully ${
            this.props.match.params.id ? "updated" : "created"
          } this Inventory Group!`}
          subHeading={
            <p className="mb-0">
              To view, select &nbsp;
              <Button
                onClick={() =>
                  history.push(
                    reverse(
                      routes.dashboard.management.inventory.inventory_groups
                        .view,
                      { id: data.id }
                    )
                  )
                }
                className="bg-transparent border-0 shadow-none p-0"
              >
                View Inventory Group
              </Button>
              .
            </p>
          }
          okTitle={"View Inventory Group"}
          okAction={() =>
            history.push(
              reverse(
                routes.dashboard.management.inventory.inventory_groups.view,
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
          } this Inventory Group?`}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(CreateInventoryGroupsMain)
);
