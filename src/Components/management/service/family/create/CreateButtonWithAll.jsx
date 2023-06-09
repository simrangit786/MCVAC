import React, { Component } from "react";
import { Breadcrumb, Button, Dropdown, Menu, Select, Spin } from "antd";
import { Image as Images } from "../../../../Images";
import { handleError } from "../../../../../Controller/Global";
import { getFleetGroup, getFleetKit } from "../../../../../Controller/api/vehicleServices";
import {
  getInventoryKit,
  getInventoryPackageItem,
} from "../../../../../Controller/api/inventoryServices";
import { getSupplyGroup } from "../../../../../Controller/api/supplyServices";
import {
  DISPOSAL,
  FLEET_GROUP,
  SERVICE_RESOURCES,
  SUPPLY_GROUP,
} from "../../../../../Controller/utils";
import { createLineItemResource } from "../../../../../Controller/api/lineItemsServices";
import {
  getEmployeeType,
  getLaborGroup,
} from "../../../../../Controller/api/labourServices";
import { getDisposal } from "../../../../../Controller/api/disposalServices";
//button, input,dropdown
const { Option } = Select;

class CreateButtonWithAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      renderType: "button",
      subtierName: "",
      type: null,
      fetching: false,
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ renderType: "button", subtierName: "", data: [] });
    }
  };

  handleInput = (type) => {
    this.setState({ renderType: "input", type });
  };

  handleDropdown = () => {
    this.setState({ renderType: "dropdown" });
  };

  addResource = (e) => {
    let obj = this.state.data.find((p) => p.id === e);
    const { item, getResource } = this.props;
    const data = {
      line_item: item.id,
      labor_type: this.state.type == "LABOR" ? obj.id : null,
      item_type: SERVICE_RESOURCES[this.state.type].server_key,
      item_id: this.state.type != "LABOR" ? obj.id : null,
    };
    createLineItemResource(data).then((response) => {
      getResource();
    });
    this.setState({
      renderType: "button",
      data: [],
      subtierName: "",
      type: null,
    });
  };

  fetchData = (params = {}) => {
    this.setState({ fetching: true });
    switch (this.state.type) {
      case SERVICE_RESOURCES.FLEET.key: {
        getFleetGroup({ ...params, tier_type: FLEET_GROUP })
          .then((res) => {
            this.setState({
              data: res.data.results.filter((p) => p.parent),
              fetching: false,
            });
          })
          .catch((err) => {
            handleError(err);
            this.setState({ fetching: false });
          });
        break;
      }
      case SERVICE_RESOURCES.FLEET_KIT.key: {
        getFleetKit({ ...params, tier_type: "FLEET_KIT" })
          .then((res) => {
            this.setState({
              data: res.data.results,
              fetching: false,
            });
          })
          .catch((err) => {
            handleError(err);
            this.setState({ fetching: false });
          });
        break;
      }
      case SERVICE_RESOURCES.INVENTORY.key: {
        getInventoryPackageItem({ ...params, tier_type: "INVENTORY_ITEM" })
          .then((res) => {
            this.setState({
              data: res.data.results.filter((p) => p.parent),
              fetching: false,
            });
          })
          .catch((err) => {
            handleError(err);
            this.setState({ fetching: false });
          });
        break;
      }
      case SERVICE_RESOURCES.INVENTORY_KIT.key: {
        getInventoryKit(params)
          .then((res) => {
            this.setState({ data: res.data.results, fetching: false });
          })
          .catch((err) => {
            handleError(err);
            this.setState({ fetching: false });
          });
        break;
      }

      case SERVICE_RESOURCES.SUPPLY.key: {
        getSupplyGroup({ ...params, tier_type: SUPPLY_GROUP })
          .then((res) => {
            this.setState({ data: res.data.results, fetching: false });
          })
          .catch((err) => {
            handleError(err);
            this.setState({ fetching: false });
          });
        break;
      }
      case SERVICE_RESOURCES.LABOR.key: {
        getEmployeeType(params)
          .then((res) => {
            this.setState({ data: res.data.results, fetching: false });
          })
          .catch((err) => {
            handleError(err);
            this.setState({ fetching: false });
          });
        break;
      }
      case SERVICE_RESOURCES.DISPOSAL.key: {
        getDisposal({ ...params, tier_type: DISPOSAL })
          .then((res) => {
            this.setState({ data: res.data.results, fetching: false });
          })
          .catch((err) => {
            handleError(err);
            this.setState({ fetching: false });
          });
        break;
      }
      default: {
        this.setState({ fetching: false });
      }
    }
  };

  getMenu = () => {
    return (
      <Menu>
        {Object.keys(SERVICE_RESOURCES).map((key) => {
          return (
            <Menu.Item key="0">
              <Button
                className="w-100 text-left border-0 shadow-none"
                onClick={() => this.handleInput(key)}
              >
                <img
                  alt={""}
                  className="img-fluid"
                  src={SERVICE_RESOURCES[key].icon}
                />
                {SERVICE_RESOURCES[key].name}
              </Button>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  // changeDropdown = () => {
  //     this.setState({renderType: "subDropdown", type: "LABOR", data: []}, () => this.fetchData())
  // }

  render() {
    let { renderType, fetching, data, type } = this.state;

    return (
      <div className="col-12 p-0" ref={this.wrapperRef}>
        {renderType === "button" ? (
          <div
            onClick={this.handleDropdown}
            className="add-resource-btn add-resources-btn-update text-right-tree"
          >
            +Add Resources
          </div>
        ) : renderType === "dropdown" ? (
          <div
            id={"area"}
            className="row mx-0 add-sub-tier-input-form add-sub-tier-input-form-resources"
          >
            <Dropdown
              getPopupContainer={() => document.getElementById("area")}
              visible={true}
              placement="bottomCenter"
              overlayClassName="add-adding-dropdown"
              overlay={this.getMenu}
              trigger={["click"]}
            >
              <Button
                className="ant-dropdown-link text-uppercase w-100 text-left border-0"
                onClick={(e) => e.preventDefault()}
              >
                Add Resources...
              </Button>
            </Dropdown>
          </div>
        ) : (
          <div
            className="row mx-0 add-sub-tier-input-form add-resources add-search-icon position-relative"
            id={"area_multi"}
          >
            <Select
              dropdownClassName={"sub-tier-select"}
              autoFocus
              defaultOpen={true}
              placeholder=" "
              filterOption={false}
              getPopupContainer={() => document.getElementById("area_multi")}
              notFoundContent={fetching ? <Spin size="small" /> : null}
              onSearch={(e) => this.fetchData({ search: e })}
              showSearch={true}
              onChange={this.addResource}
            >
              {data.map((item) => (
                <Option value={item.id}>
                  <div className="row mx-0 vc-tr-select-option-row">
                    <div className="vc-select-option-img">
                      <img
                        src={SERVICE_RESOURCES[type].icon}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="vc-select-option-data">
                      <div className="row">
                        <div className="col-12">
                          <h6 className="mb-0">
                            {this.state.type == "LABOR"
                              ? item.title
                              : this.state.type == "DISPOSAL" ? `${item.disposal_code || ""} ${item.disposal_code ? '-' : ''} ${item.name}` : item.name }
                          </h6>
                        </div>
                        {item.breadcrumb && (
                          <div className="col-12">
                            <Breadcrumb
                              separator={
                                <img
                                  src={Images.arrow_right_search_select_small}
                                  alt=""
                                  className="img-fluid"
                                />
                              }
                            >
                              {item.breadcrumb.map((b) => (
                                <Breadcrumb.Item>{b}</Breadcrumb.Item>
                              ))}
                            </Breadcrumb>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
            <Button className="icon-div-search position-absolute border-0 bg-transparent shadow-none p-0 rounded-0">
              <img
                src={Images.search_icon_gray}
                alt={""}
                className="img-fluid"
              />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default CreateButtonWithAll;
