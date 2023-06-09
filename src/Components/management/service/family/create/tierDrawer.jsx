import React, { Component } from "react";
import { Breadcrumb, Drawer } from "antd";
import CreateResource from "./line-item-group-inn/CreateResource";
import { Image as Images } from "../../../../Images";
import { Link } from "react-router-dom";
import TreeMain from "./TreeMain";
import ServiceTree from "./ServiceTree";

function mapStateToProps(state) {
  return {};
}

class TierDrawer extends Component {
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
              src={Images.line_item_icon_green}
            />
            <span className="ml-3">{item.name}</span>
          </div>
        }
        placement="right"
        width={"880px"}
        closable={false}
        onClose={onClose}
        visible={visible}
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
            {item?.breadcrumb?.map((name) => {
              return (
                <Breadcrumb.Item key={name}>
                  <Link>{name}</Link>
                </Breadcrumb.Item>
              );
            })}
            <Breadcrumb.Item key={item?.name}>
              <Link>{item?.name}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <ServiceTree
          item={[item]}
          drawerItem={true}
          packageData={this.props.packageData}
          getPackage={this.props.getPackage}
        />
      </Drawer>
    );
  }
}

export default TierDrawer;
