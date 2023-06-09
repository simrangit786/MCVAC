import React, { Component } from "react";
import { Button, Dropdown, Input, Select, Menu } from "antd";
import { Image as Images } from "../../../../Images";
import { createLineItem } from "../../../../../Controller/api/lineItemsServices";
import {
  SERVICE_LINE_ITEM,
  SERVICE_TIER,
} from "../../../../../Controller/utils";

const { Option } = Select;

class CreateButton extends Component {
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
    createLineItem(data).then(() => {
      this.props.getPackageData(this.props.packageData.id);
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
      <Menu.Item onClick={() => this.handleVisibleInput(SERVICE_TIER)}>
        <div>
          <img
            src={Images.new_sub_tier_icon}
            alt=""
            className="img-fluid mr-2"
          />
          Tier
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => this.handleVisibleInput(SERVICE_LINE_ITEM)}>
        <div>
          <img
            src={Images.line_item_icon_green}
            alt=""
            className="img-fluid mr-2"
          />
          Service
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
                      autoFocus
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
                className="ant-dropdown-link cancel-btn-tree d-flex align-items-center border-0 bg-transparent shadow-none p-0"
                onMouseDown={(e) => {
                  this.setState({ visibleInput: false });
                }}
              >
                <span>Cancel</span>
                {/* <span className="mr-1">{this.state.tier_type == FLEET_TIER ? "Tier" : "FLEET GROUP"}</span> */}
                {/* <img src={Images.eva_more_elisis} className="img-fluid" alt=""/> */}
              </Button>
              {/* </Dropdown>
                        </div>*/}
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
                + ADD TIER/Service
              </Button>
            </Dropdown>
          </div>
        </div>
      </>
    );
  }
}

export default CreateButton;
