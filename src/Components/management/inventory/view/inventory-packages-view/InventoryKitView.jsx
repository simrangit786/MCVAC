import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import { getInventoryKitItem } from "../../../../../Controller/api/inventoryServices";
import { handleError } from "../../../../../Controller/Global";
import { formatMoney } from "../../../../../Controller/utils";

class InventoryKitView extends Component {
  state = {
    kits: [],
  };

  componentDidMount() {
    this.fetchInventoryKit();
  }

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
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="opportunity_info-collapse account-summary-header row mx-0 align-items-center">
              <span>Inventory Kits</span>
            </div>
          </div>
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ">
              <div className="search-bar-div d-flex align-items-center">
                <Form className="position-relative">
                  <Input
                    onChange={(e) =>
                      this.fetchInventoryKit({ search: e.target.value })
                    }
                    placeholder="Inventory Items"
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
              {/*<Button className="view-all-btn text-uppercase">VIEW*/}
              {/*    ALL </Button>*/}
            </div>
          </div>
        </div>

        {this.state.kits.length > 0 ? (
          <div className="row mx-0 mt-3">
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
                        {formatMoney(item.quantity * item.item.unit_cost)}
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
              <h6 className="mb-0 text-gray-tag">No Inventory Items</h6>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(InventoryKitView);
