import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image as Images } from "../../../../Images";
import { getInventory } from "../../../../../Controller/api/inventoryServices";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";

class InventoryItems extends Component {
  state = {
    inventory: [],
  };

  componentDidMount() {
    this.fetchInventory();
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

  render() {
    let { inventory } = this.state;
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="opportunity_info-collapse account-summary-header row mx-0 align-items-center">
              <span>
                Inventory Items
                {/*<aside>({inventory.length})</aside>*/}
              </span>
            </div>
          </div>
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ">
              <div className="search-bar-div d-flex align-items-center">
                <Form className="position-relative">
                  <Input
                    onChange={(e) =>
                      this.fetchInventory({ search: e.target.value })
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
        {inventory.length > 0 ? (
          <div className="row mx-0 summary-collapse-inner-row-main">
            {inventory.map((item) => (
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
              <h6 className="mb-0 text-gray-tag">No Inventory Items</h6>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(InventoryItems);
