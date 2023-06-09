import React, { Component } from "react";
import { Button, Form, Modal, Select } from "antd";
import { Image as Images } from "../../../../../Images";
import CreateVendor from "../../../../../drawers/disposal/CreateVendor";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
class AddVendorDisposal extends Component {
  formRef = React.createRef();

  handleCreate =() => {
    this.props.showVendorDrawer(true);
    this.props.modalClose()
  }
  render() {
    return (
      <React.Fragment>
        <Modal
          width={"548px"}
          title={"Add Vendor"}
          visible={this.props.visible}
          onOk={this.props.onClose}
          onClose={this.props.onClose}
          onCancel={this.props.onClose}
          centered
          className="main-all-form-modal modal-disposal"
          footer={false}
        >
          <div className="row mx-0 confirm-modal-row">
            <div className="col-12">
              <Form
                {...layout}
                ref={this.formRef}
                className="common-form warehouse-select-modal"
              >
                <Form.Item
                  name="internal_locations"
                  label={"Vendors *"}
                  className="position-relative remove-cross-icon search-overlap"
                >
                  <Select
                    // labelInValue
                    // disabled={!this.state.selectValue}
                    // mode="multiple"
                    showSearch={true}
                    placeholder="Search"
                    filterOption={false}
                    onFocus={() => this.props.getAllAccounts()}
                    onSearch={(e) =>
                      this.props.getAllAccounts({ search: e, type: "DISPOSAL" })
                    }
                    onChange={(e) => {
                      this.props.handleSelectVendor(e);
                      this.formRef.current.resetFields();
                    }}
                    // onDeselect={this.handleDeselect}
                    // value={this.state.newLoc.map(i => ({value: i.vendor.id, label: i.vendor.name})
                    // )}
                  >
                    {this.props.location.map((d) => (
                      <Option key={d.id} value={d.id}>
                        <div className="row custom-tree-row">
                          <div className="common-select-option-row col-12">
                            <div
                              style={{
                                width: "40px",
                              }}
                              className="float-left"
                            >
                              <img
                                src={Images.vendor_icon_small}
                                alt={""}
                                className="img-fluid"
                              />
                            </div>
                            <div className="float-left warehouse-select-box">
                              <h6 className="mb-0 w-100 d-inline-block">
                                {d.name}
                              </h6>
                              <p
                                style={{
                                  color: "#BDBDBD",
                                  fontWeight: "500",
                                  fontSize: "11px",
                                  lineHeight: "13px",
                                }}
                                className="mb-0 d-inline-block"
                              >
                                {d.main_address?.street_address || ""},{" "}
                                {d.main_address?.city || ""},{" "}
                                {d.main_address?.state || ""},
                                {d.main_address?.zip_code || ""}{" "}
                                {d.main_address?.country || ""}
                              </p>
                            </div>
                            <div
                              style={{
                                paddingTop: "15px",
                                display: "inline-block",
                              }}
                              className="text-green-tag text-center select-text-tier"
                            >
                              Vendor
                            </div>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                  <img
                    src={Images.search_small_icon}
                    alt=""
                    className="img-fluid"
                  />
                </Button>
                <Button
                  className="create-btn-main position-absolute"
                  onClick={() => this.handleCreate()}
                >
                  + Create
                </Button>
              </Form>
            </div>
          </div>
        </Modal>
        <CreateVendor
          visible={this.props.visibleVendor}
          // visibleVendors = {this.props.visibleVendors}
          onClose={() => this.props.showVendorDrawer(false)}
          // onCancel={() => this.props.showVendorDrawer(false)}
          handleVendorInfo = {this.props.handleVendorInfo}
          handleVendorAddress = {this.props.handleVendorAddress}
          editVendorData = {this.props.editVendorData}
          editVendor = { this.props.editVendor}
        />
      </React.Fragment>
    );
  }
}

export default AddVendorDisposal;
