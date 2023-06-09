import React, { Component } from "react";
import { Button, Collapse, Spin } from "antd";
import { Image as Images } from "../../../../Images";
import { CaretRightOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import InventoryKitsItemsView from "./InventoryKitsItemsView";
import { routes } from "../../../../../Controller/Routes";
import { reverse } from "named-urls/dist/index.es";
import { history } from "../../../../../Controller/history";
import { handleError } from "../../../../../Controller/Global";
import {
  getInventoryKitById,
  getInventoryKitItem,
} from "../../../../../Controller/api/inventoryServices";

const { Panel } = Collapse;

class InventoryKitsSummaryMain extends Component {
  state = {
    kit: null,
    items: [],
  };

  componentDidMount() {
    getInventoryKitById(this.props.match.params.id)
      .then((res) => {
        let arrKits = [
          {
            title: "Inventory",
            url: routes.dashboard.management.inventory.self,
          },
          {
            title: "Inventory Kits",
            url: routes.dashboard.management.inventory.self,
          },
          { title: res.data.name, url: "#" },
        ];
        this.props.setBreadcrumb(arrKits);
        this.setState({ kit: res.data });
      })
      .catch((err) => {
        handleError(err);
      });
    this.fetchKits();
  }

  fetchKits = (params = {}) => {
    getInventoryKitItem({ ...params, kit: this.props.match.params.id })
      .then((res) => {
        this.setState({ items: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { kit, items } = this.state;
    if (!kit) {
      return (
        <div className="text-center my-4">
          <Spin />
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="row mx-0 summary-info-inner-row inventory-items-inner-row">
              <div className="col-12">
                <Collapse
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                >
                  <Panel
                    header={
                      <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                        <span>
                          General Information <sup>*</sup>
                        </span>
                        <Button
                          // onClick={() =>
                          //   history.push(
                          //     reverse(
                          //       routes.dashboard.management.inventory
                          //         .inventory_kits.edit,
                          //       { id: this.props.match.params.id }
                          //     )
                          //   )
                          // }
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.management.inventory.inventory_kits.edit,
                                { id: this.props.match.params.id }
                              ),
                              editTab: "1"
                            })
                          }
                          className="edit-btn-summary"
                        >
                          <img
                            src={Images.pencil_green}
                            alt=""
                            className="img-fluid"
                          />
                          Edit
                        </Button>
                      </div>
                    }
                    key="1"
                  >
                    <div className="row summary-collapse-inner-row-main">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Inventory Kit Name
                            </h6>
                            <h5 className="mb-0">
                              {/* Filter Replacement Kit */}
                              {kit?.name}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Unit of measurement
                            </h6>
                            <h5 className="mb-0 text-capitalize">
                              {/* pieces (pc) */}
                              {kit?.unit?.name?.toLowerCase()}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Panel>

                  <Panel
                    header={
                      <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                        <span>Inventory Items</span>
                        <Button
                           onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.management.inventory.inventory_kits.edit,
                                { id: this.props.match.params.id }
                              ),
                              editTab: "2"
                            })
                          }
                          className="edit-btn-summary"
                        >
                          <img
                            src={Images.pencil_green}
                            alt=""
                            className="img-fluid"
                          />
                          Edit
                        </Button>
                      </div>
                    }
                    key="2"
                  >
                    <InventoryKitsItemsView
                      kit={this.state.kit}
                      onTabChange={this.props.onTabChange}
                    />
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(
  withRouter(InventoryKitsSummaryMain)
);
