import React, { Component } from "react";
import { Button, Collapse, Form, Input, Spin } from "antd";
import { Image as Images } from "../../../../Images";
import { CaretRightOutlined } from "@ant-design/icons";
import { handleError } from "../../../../../Controller/Global";
import {
  getInventory,
  getInventoryKitItem,
  getInventoryPackageItemById,
} from "../../../../../Controller/api/inventoryServices";
import { withRouter } from "react-router-dom";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../Controller/Routes";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import { formatMoney } from "../../../../../Controller/utils";

const { Panel } = Collapse;

class InventorySummary extends Component {
  state = {
    data: null,
    visible: false,
    loading: true,
    inventory: [],
    kits: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    getInventoryPackageItemById(this.props.match.params.id)
      .then((res) => {
        let arrGrp = [
          {
            title: "Inventory",
            url: routes.dashboard.management.inventory.self,
          },
          {
            title: "Inventory Groups",
            url: routes.dashboard.management.inventory.self,
          },
          { title: res.data.name, url: "#" },
        ];
        this.props.setBreadcrumb(arrGrp);
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });

    this.fetchInventory();
    this.fetchInventoryKit();
  }

  fetchInventory = (params = {}) => {
    getInventory({ ...params, item: this.props.match.params.id })
      .then((res) => {
        this.setState({ inventory: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  fetchInventoryKit = (params = {}) => {
    getInventoryKitItem({ ...params, item: this.props.match.params.id })
      .then((res) => {
        this.setState({ kits: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { data, loading } = this.state;
    if (loading) {
      return (
        <div className="row">
          <div className="col-12 text-center">
            <Spin />
          </div>
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="col-12">
          <div className="row mx-0 summary-info-inner-row">
            <div className="col-12">
              <Collapse
                // accordion
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>General Information</span>
                      <Button
                        onClick={() =>
                          history.push(
                            reverse(
                              routes.dashboard.management.inventory
                                .inventory_groups.edit,
                              { id: this.props.match.params.id }
                            )
                          )
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
                            Inventory group name
                          </h6>
                          <h5 className="mb-0">{data.name}</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                          <h6 className="text-uppercase">
                            Inventory Family / tier
                          </h6>
                          <h5 className="mb-0">
                            {data.inventory_package.name}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Cost</span>
                      <Button
                        onClick={() =>
                          history.push(
                            reverse(
                              routes.dashboard.management.inventory
                                .inventory_groups.edit,
                              { id: this.props.match.params.id }
                            )
                          )
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
                  <div className="col-12">
                    <div className="row summary-collapse-inner-row-main">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Unit of measurement
                            </h6>
                            <h5 className="mb-0 text-capitalize">
                              {data.unit?.toLowerCase() || "-"}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Estimated unit cost
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(data.unit_cost || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">Margin</h6>
                            <h5 className="mb-0">{data.margin || "0"}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Inventory Items </span>
                    </div>
                  }
                  key="3"
                >
                  <div className="col-12">
                    <div className="row mb-4 new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="search-bar-div d-flex align-items-center">
                        <Form className="position-relative">
                          <Input
                            onChange={(e) =>
                              this.fetchInventory({ search: e.target.value })
                            }
                            placeholder="Search"
                          />
                          <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                            <img
                              src={Images.search_icon_gray}
                              className="img-fluid"
                              alt="search icon"
                            />
                          </Button>
                        </Form>
                        {/*<Button className="add-btn-collapse ml-2 text-uppercase">Add</Button>*/}
                      </div>
                      <Button
                        onClick={() => this.props.onTabChange("2")}
                        className="view-all-btn text-uppercase"
                      >
                        VIEW ALL{" "}
                      </Button>
                    </div>
                    {this.state.inventory.length > 0 ? (
                      <div className="row mx-0">
                        {this.state.inventory.map((item) => (
                          <div className="col-12 col-sm-6">
                            <div className="row mx-0 add-vehicles-main-row align-items-center position-relative">
                              <div className="add-vehicles-img float-left">
                                <img
                                  src={Images.inventory_icon_black}
                                  alt={""}
                                  className="img-fluid"
                                />
                              </div>
                              <div className="add-vehicles-content float-left">
                                <h6>{item.name}</h6>
                                <p className="mb-0">{item.sku}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
                        <div className="col-12 text-center cursor-pointer">
                          <img
                            src={Images.supply_icon_gray_small}
                            alt=""
                            className="img-fluid"
                          />
                          <h6 className="mb-0 text-gray-tag">
                            No Inventory Items
                          </h6>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Inventory Kits </span>
                    </div>
                  }
                  key="4"
                >
                  <div className="col-12">
                    <div className="row mb-4 new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="search-bar-div d-flex align-items-center">
                        <Form className="position-relative">
                          <Input
                            onChange={(e) =>
                              this.fetchInventoryKit({ search: e.target.value })
                            }
                            placeholder="Search"
                          />
                          <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                            <img
                              src={Images.search_icon_gray}
                              className="img-fluid"
                              alt="search icon"
                            />
                          </Button>
                        </Form>
                        {/*<Button className="add-btn-collapse ml-2 text-uppercase">Add</Button>*/}
                      </div>
                      <Button
                        onClick={() => this.props.onTabChange("3")}
                        className="view-all-btn text-uppercase"
                      >
                        VIEW ALL{" "}
                      </Button>
                    </div>
                    {this.state.kits.length > 0 ? (
                      <div className="row mx-0">
                        {this.state.kits.map((item) => (
                          <div className="col-12 col-sm-6">
                            <div className="row mx-0 add-vehicles-main-row align-items-center position-relative">
                              <div className="add-vehicles-img float-left">
                                <img
                                  src={Images.inventory_set_box_icons_green}
                                  alt={""}
                                  className="img-fluid"
                                />
                              </div>
                              <div className="add-vehicles-content d-flex align-items-center justify-content-between float-left">
                                <div>
                                  <h6>{item.item.name}</h6>
                                  <p className="mb-0 text-capitalize">
                                    QTY:{item.quantity}
                                  </p>
                                </div>
                                <div>
                                  <h6>
                                    Subtotal:{" "}
                                    {formatMoney(
                                      item.quantity * item.item.unit_cost
                                    )}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
                        <div className="col-12 text-center cursor-pointer">
                          <img
                            src={Images.inventory_kits_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <h6 className="mb-0 text-gray-tag">
                            No Inventory Items
                          </h6>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(withRouter(InventorySummary));
