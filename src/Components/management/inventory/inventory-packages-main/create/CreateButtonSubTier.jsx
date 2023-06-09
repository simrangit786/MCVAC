import React, { Component } from "react";
import { Button, Dropdown, Input, Menu } from "antd";
import { Image as Images } from "../../../../Images";
import { createLineItem } from "../../../../../Controller/api/lineItemsServices";
import { createInventoryLineItem } from "../../../../../Controller/api/inventoryServices";
import {
  INVENTORY_GROUP,
  INVENTORY_TIER,
} from "../../../../../Controller/utils";

class CreateButtonSubTier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleInput: false,
    };
  }

  onBlurSaveInput = (e) => {
    const data = {
      name: e.target.value,
      parent: this.props.packageData.parent.id,
      tier_type: this.state.tier_type,
    };
    createInventoryLineItem(data).then(() => {
      this.props.getPackage(this.props.packageData.id);
      this.setState({ visibleInput: false });
    });
  };

  handleVisibleInput = (tier_type) => {
    this.setState({
      visibleInput: !this.props.visibleInput,
      tier_type: tier_type,
    });
  };

  handleKeyDown = (e) => {
    if (e.key == "Enter") {
      this.onBlurSaveInput(e);
    }
  };

  addTierMenu = (item) => (
    <Menu>
      <Menu.Item onClick={() => this.handleVisibleInput(INVENTORY_TIER)}>
        <div>
          <img
            src={Images.new_sub_tier_icon}
            alt=""
            className="img-fluid mr-2"
          />
          Inventory Tier
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => this.handleVisibleInput(INVENTORY_GROUP)}>
        <div>
          <img
            src={Images.inventory_item_icon}
            alt=""
            className="img-fluid mr-2"
          />
          Inventory Item
        </div>
      </Menu.Item>
    </Menu>
  );

  render() {
    const { visibleInput } = this.state;
    return (
      <>
        {visibleInput && (
          <div className="row mx-0 tree-row-main custom-tree-row align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="branch-icon-text d-flex align-items-center">
                <h6 className="mb-0 d-flex align-items-center">
                  <div className="mb-0 d-flex children-heading-last align-items-center">
                    <Input
                      onBlur={(e) => this.onBlurSaveInput(e)}
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                </h6>
              </div>
            </div>
            <div className="text-green-tag text-right-tree d-flex align-items-center">
              {/* <div className="remove-dropdown">
                            <Dropdown trigger={'click'}> */}
              <Button
                className="ant-dropdown-link cancel-red-btn cancel-btn-treed-flex align-items-center"
                onMouseDown={(e) => {
                  this.setState({ visibleInput: false });
                }}
              >
                <span>Cancel</span>
                {/* <span className="mr-1">{"Tier"}</span>
                                    <img src={Images.eva_more_elisis} className="img-fluid" alt=""/> */}
              </Button>
              {/* </Dropdown>
                        </div> */}
            </div>
          </div>
        )}
        <div className="row mx-0 add-sub-tier-main-row">
          <div className="">
            <Dropdown
              trigger={"click"}
              overlayClassName="add-tier-dropdown-custom"
              overlay={() => this.addTierMenu()}
            >
              <Button className="add-sub-tier-btn bg-transparent border-0 rounded-0 shadow-none text-uppercase">
                + ADD TIER/ITEM
              </Button>
            </Dropdown>
          </div>
        </div>
      </>
    );
  }
}

export default CreateButtonSubTier;
