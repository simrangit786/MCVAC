import React, { Component } from "react";
import { Breadcrumb, Button, Form, Modal, Select } from "antd";
import { Image as Images } from "../../../../../Images";
import CreateInternalLocationDisposal from "../../../../../drawers/disposal/CreateInternalLocationDisposal";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class AddWarehouseDisposal extends Component {
  formRef = React.createRef();

  render() {
    return (
      <React.Fragment>
        <Modal
          width={"548px"}
          title={"Add Warehouse"}
          visible={this.props.visible}
          onOk={this.props.visible}
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
                  label={"Warehouses *"}
                  className="position-relative remove-cross-icon search-overlap"
                >
                  <Select
                    // mode="multiple"
                    // showSearch={true}
                    // labelInValue
                    showSearch={true}
                    // disabled={!this.props.selectValue}
                    // mode="multiple"
                    // defaultOpen={true}
                    placeholder="Search"
                    notFoundContent={null}
                    filterOption={false}
                    // onFocus={() => this.props.fetchContacts({type: "DISPOSAL"})}
                    onFocus={() => this.props.fetchContacts()}
                    onSearch={(e) => this.props.fetchContacts({ search: e })}
                    // onChange={this.handleSelect}
                    onChange={(e) => {
                      this.props.handleSelect(e);
                      this.formRef.current.resetFields();
                      this.props.showFacility(false)
                    }}
                    // onDeselect={this.handleDeselect}
                    // value={this.state.newSites.map(i => ({value: i.internal_location.id, label: i.internal_location.name})
                    //     )}
                  >
                    {this.props.contacts?.map((d) => (
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
                                src={Images.location_black_icon}
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
                                {d.street_address || ""}, {d.city || ""},{" "}
                                {d.state || ""},{d.zip || ""} {d.country || ""}
                              </p>
                            </div>
                            <div
                              style={{
                                paddingTop: "15px",
                                display: "inline-block",
                              }}
                              className="text-green-tag text-center select-text-tier"
                            >
                              Warehouse
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
                  className="create-btn-main position-absolute text-capitalize"
                  onClick={() => this.props.showFacility(true)}
                >
                 + Create
                </Button>
              </Form>
            </div>
          </div>
        </Modal>
        <CreateInternalLocationDisposal
          callbackContact={this.props.callbackContact}
          fetchContacts={this.props.fetchContacts}
          editData={this.props.editData}
          visible={this.props.visibleInternal}
          onClose={(values) => this.props.showContact(false, values)}
        />
      </React.Fragment>
    );
  }
}

export default AddWarehouseDisposal;
