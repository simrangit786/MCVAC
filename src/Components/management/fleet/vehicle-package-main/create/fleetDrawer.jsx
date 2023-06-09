import React, { Component } from "react";
import { Breadcrumb, Drawer } from "antd";
import CreateVehicleGroupCalculations from "../../vehicle-group-create/info-create/CreateVehicleGroupCalculations";
import { Image } from "../../../../Images";
import { Link } from "react-router-dom";

function mapStateToProps(state) {
  return {};
}

class FleetDrawer extends Component {
  render() {
    const { visible, item } = this.props;
    return (
      <Drawer
        className="main-drawer-div main-all-form-modal inline-item-drawer"
        title={
          <div className="d-flex align-items-center">
            <img
              alt=""
              className="img-fluid"
              src={Image.line_item_icon_green}
            />
            <span className="ml-3">{item.name}</span>
          </div>
        }
        placement="right"
        width={700}
        closable={false}
        onClose={this.props.onClose}
        visible={visible}
        style={{ position: "absolute" }}
      >
        <div className="breadcrumb-inner-details inline-item-breadcrumb">
          <Breadcrumb
            separator={
              <img
                src={Image.arrow_small_breadcrumb}
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
        <CreateVehicleGroupCalculations
          data={item}
          drawer={true}
          onClose={this.props.onClose}
        />
      </Drawer>
    );
  }
}

export default FleetDrawer;
