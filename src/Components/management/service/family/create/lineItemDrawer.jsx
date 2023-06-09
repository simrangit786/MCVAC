import React, { Component } from "react";
import { Breadcrumb, Button, Drawer } from "antd";
import CreateResource from "./line-item-group-inn/CreateResource";
import { Image as Images } from "../../../../Images";
import { Link } from "react-router-dom";

function mapStateToProps(state) {
  return {};
}

class LineItemDrawer extends Component {
  state = {
    dataToBeUpdated: null,
    labelRequired: true
  }

callBackData = dataToBeUpdated => {
    this.setState({dataToBeUpdated})
}

handleLabel = () => {
  this.setState({labelRequired: false})

}
  render() {
    const { visible, item, onClose, regions } = this.props;
    const {dataToBeUpdated} = this.state;
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
        width={"72%"}
        maskClosable={false}
        onOk={onClose}
        onCancel={onClose}
        closable={true}
        onClose={() => onClose(dataToBeUpdated)}
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
            <Breadcrumb.Item key={item.name}>
              <Link>{item.name}</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="col-12">
          <div className="row mx-0">
            <div className="col-12">
              <div className="row mx-0 my-3 info-gray-div align-items-center">
                <h6 className="mb-0">
                  Please select the resources you would like to include in your
                  service.{this.state.labelRequired ? <span className="fleet-kit-label">Labor and Fleet Group / Fleet Kit are required *</span> : ""}
                </h6>
              </div>
            </div>
            <div className="col-12">
              <div className="row mx-0 tree-heading tree-heading-custom">
                <div className="col-6">
                  <span>Resource</span>
                </div>
                <div className="col-6 text-right">
                  <span>TYPE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CreateResource regions={regions} item={item} onClose={onClose} callBackData={data => this.callBackData(data)} handleLabel={this.handleLabel}/>
        <div
          className="col-12 validate-div-col text-md-right"
          style={{ padding: "20px 30px 50px 30px" }}
        >
          <Button className="ant-btn validate-btn-main-new" onClick={() => onClose(dataToBeUpdated)}>
            <span>Close</span>
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default LineItemDrawer;
