import React, { Component } from "react";
import { Breadcrumb, Drawer } from "antd";
import { Image as Images } from "../../../../Images";
import { Link } from "react-router-dom";

import CreateLargeTrenchShovels from "./supply-group-create-inn/CreateLargeTrenchShovels";
// function mapStateToProps(state) {
//     return {};
// }

class SupplyDrawer extends Component {
  render() {
    const { visible, item, onClose } = this.props;
    return (
      <Drawer
        className="main-drawer-div main-all-form-modal inline-item-drawer"
        title={
          <div className="d-flex align-items-center">
            <img
              alt=""
              className="img-fluid"
              src={Images.supply_sub_tier_icon}
            />
            <span className="ml-3">{item.name}</span>
          </div>
        }
        destroyOnClose
        placement="right"
        width={700}
        closable={false}
        onClose={onClose}
        visible={visible}
        style={{ position: "absolute" }}
      >
        <div className="breadcrumb-inner-details inline-item-breadcrumb">
          <Breadcrumb
            separator={
              <img
                src={Images.arrow_small_breadcrumb}
                alt={""}
                className="img-fluid"
              />
            }
          >
            {item.breadcrumb.map((name) => {
              return (
                <Breadcrumb.Item key={name}>
                  <Link>{name}</Link>
                </Breadcrumb.Item>
              );
            })}
            <Breadcrumb.Item key={item.name}>
              <Link>{item.name}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <CreateLargeTrenchShovels item={item} onClose={onClose} />
      </Drawer>
    );
  }
}

export default SupplyDrawer;
