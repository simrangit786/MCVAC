import React, { Component } from 'react';
import { Button, Dropdown, Form, Menu, message, Select, Spin } from "antd";
import { Image as Images } from "../../../Images";
import { createWorkOrderWarehouse, deleteWorkOrderWarehouse, getWorkOrderWarehouse } from '../../../../Controller/api/workOrderServices';
import { handleError } from '../../../../Controller/Global';
import { getInternalLocation } from '../../../../Controller/api/vehicleServices';
import CreateWarehouseDispatchDrawer from './CreateWarehouseDispatchDrawer';


const layout = {
  labelCol: { span: 24 }, wrapperCol: { span: 24 },
};
const { Option } = Select;

class WareHouseDispatchOriginCreate extends Component {
  state = {
    warehouse: [],
    fetching: true,
    visible: false
  }
  formRef = React.createRef();

  fetchWarehouse = (params = {}) => {
    getInternalLocation(params)
      .then((res) => {
        this.setState({ warehouse: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err)
        this.setState({ fetching: false });
      });
  };

  componentDidMount() {
    if (this.props.match?.params?.id || this.props.workOrder?.id) {
      this.getWorkOrderLocation()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.workOrder != this.props.workOrder) {
      this.getWorkOrderLocation()
    }
  }

  getWorkOrderLocation = () => {
    getWorkOrderWarehouse({ work_order: this.props.match?.params?.id || this.props.workOrder?.id })
      .then((res) => {
        this.setState({
          // newWarehouse: res.data?.results[0]?.warehouse,
          fetching: false,
        });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  handleDeleteWarehouse = (id) => {
    deleteWorkOrderWarehouse(id).then(() => {
      this.getWorkOrderLocation()
      this.props.fetchWorkOrder(this.props.workOrder.id);

    })
  };

  callbackContact = (item) => {
    const params = {
      warehouse: item.id,
      work_order: this.props.workOrder.id
    }
    createWorkOrderWarehouse(params).then((res) => {
      this.props.fetchWorkOrder(this.props.workOrder.id)
    })
  }

  handleSubmit = () => {
    this.props.setWorkOrder(this.props.workOrder, 4);
    message.success("Warehouse updated successfully!");
  };

  handleSelect = (obj) => {
    this.formRef.current.setFieldsValue({
      warehouse: null,
    });
    const values = {
      work_order: this.props.workOrder.id,
      warehouse: obj.value

    };
    createWorkOrderWarehouse(values).then((res) => {
      this.props.fetchWorkOrder(this.props.workOrder.id)
      
    });
  };

  showFacility = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  render() {
    const { newWarehouse, fetching } = this.state
    const warehouse = this.props.workOrder?.workorder_warehouse[0]?.warehouse || []
    const selectedWarehouse = this.props.workOrder?.workorder_warehouse || []

    return (<React.Fragment>
      <div className="row common-form-card-row mx-0">
        <div className="col-12">
          <div className="row info-gray-div align-items-center">
            <h6 className="mb-0">
              Please choose warehouse/ Dispatch Origin
            </h6>
          </div>
        </div>
        <div className="col-12 p-0">
          <Form
            onFinish={this.handleSubmit}
            ref={this.formRef}
            {...layout}
            className="main-inner-form"
          >
            <div className="row">
              <div className="col-12">
                <Form.Item
                  dropdownClassName={"option-design-fix"}
                  name="warehouse"
                  label={"Warehouse *"}
                  rules={[{
                    required: selectedWarehouse.length == 0 ? true : false,
                    message: "Please select at Warehouse",
                  },]}
                  className="position-relative"
                >
                  <Select
                    labelInValue
                    notFoundContent={
                      fetching ? <Spin size="small" /> : null
                    }
                    className="search-and-select-tag"
                    showSearch={true}
                    disabled={selectedWarehouse.length > 0 ? true : false}
                    onFocus={() => this.fetchWarehouse()}
                    onSearch={(e) => this.fetchWarehouse({ search: e })}
                    onChange={this.handleSelect}
                    placeholder="Search"
                    filterOption={false}
                    removeIcon={""}
                  >
                    {this.state.warehouse?.map((d) => (
                      <Option key={d.id} value={d.id}>
                        <div className="row custom-tree-row custom-tree-row-1">
                          <div
                            className="common-select-option-row col-12 d-flex align-items-center">
                            <div
                              style={{
                                width: "40px",
                              }}
                              className="float-left"
                            >
                              <img style={{ height: '30px' }} src={Images.location_black_icon}
                                alt={""} className="img-fluid" />

                            </div>
                            <div className="float-left warehouse-select-box">
                              <h6 className="mb-0 w-100 d-inline-block ml-1">
                                {d.name}
                              </h6>
                              <p style={{
                                color: '#BDBDBD', fontSize: '11px'
                              }} className="mb-0">
                                {d.street_address || ""}, {d.city || ""},{" "}{d.state || ""},{d.zip || ""} {d.country || ""}
                              </p>
                            </div>
                            <div
                              style={{
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
                <Button
                  className="search-icon bg-transparent border-0 p-0 position-absolute"
                  style={{ top: 43, left: 25 }}
                >
                  <img src={Images.search_small_icon} alt="" className="img-fluid" />
                </Button>
                <Button
                  disabled={selectedWarehouse.length > 0 ? true : false}
                  className="create-btn-main position-absolute text-capitalize"
                  onClick={() => this.showFacility(true)}
                >
                  + Create
                </Button>
              </div>
              {/*when-data-available*/}
              {/* {this.state.newWarehouse ?  */}
              <div className="col-12 col-sm-12">
                <div className={"row mx-0"}>
                  {selectedWarehouse.length ?
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12">
                          <div className="row site-details-row-card mb-2 position-relative">
                            <div className="col-12 col-sm-3 bg-gray-main p-0">
                              <div
                                className="row mx-0 align-items-center pt-lg-3 pt-md-3 pt-3">
                                <div
                                  className="col-12 col-sm-3 pr-lg-0 pr-md-0">
                                  <img
                                    src={Images.location_black_icon}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="col-12 col-sm-9 pl-lg-2">
                                  <h6
                                    style={{
                                      fontSize: "15px",
                                      color: "#4f4f4f",
                                      fontWeight: "500",
                                    }}
                                    className="text-capitalize mb-0"
                                  >
                                    {warehouse.name}
                                  </h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-9 px-3 pt-2 pb-4">
                              <div className="row pt-lg-3 pt-md-3 pt-3">
                                <div className="col-12 col-sm-4">
                                  <h6 className="text-uppercase">
                                    ADDRESS
                                  </h6>
                                  <p className="mb-0">
                                    {warehouse?.street_address || ""}{" "}{warehouse?.apartment || ""}{" "}{warehouse?.city || ""},{" "}{warehouse?.state || ""}{" "}{warehouse?.zip_code || ""} USA
                                  </p>
                                </div>
                                <div className="col-12 col-sm-4">
                                  <h6 className="text-uppercase">
                                    EMAIL ADDRESS
                                  </h6>
                                  <p
                                    className="mb-0"
                                    style={{ width: 100 }}
                                  >
                                    {warehouse.email}
                                  </p>
                                </div>
                                <div className="col-12 col-sm-3">
                                  <h6 className="text-uppercase">
                                    PHONE NUMBER
                                  </h6>
                                  <p className="mb-0">
                                    {warehouse.phone}
                                  </p>
                                </div>
                                <div
                                  className="col-12 col-sm-1 position-relative">
                                  <Dropdown
                                    overlayClassName="add-remove-dropdown-main"
                                    placement="bottomCenter"
                                    overlay={<Menu>
                                      <Menu.Item
                                        onClick={() => {
                                          selectedWarehouse.length &&
                                            this.handleDeleteWarehouse(selectedWarehouse[0].id)
                                        }
                                        }
                                        key="0"
                                      >
                                        <Button
                                          className="bg-transparent border-0 shadow-none p-0">
                                          Remove
                                        </Button>
                                      </Menu.Item>
                                    </Menu>}
                                    trigger={["click"]}
                                  >
                                    <Button
                                      style={{
                                        width: '20px'
                                      }}
                                      className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <img
                                        src={Images.black_dots_elipsis}
                                        alt=""
                                        className="img-fluid"
                                      />
                                    </Button>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    :
                    <div className="col-12">
                      <div className="row no-data-card-row align-items-center justify-content-center">
                        <div className="col-12 text-center">
                          <img src={Images.location_gray} alt={"location-icon"}
                            className="img-fluid" />
                          <h6 className="mb-0">No warehouses</h6>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>

            </div>
            <div className="col-12 validate-div-col text-md-right">
              <Form.Item>
                <Button className="validate-btn-main" htmlType="submit">
                  Save and Continue
                </Button>
              </Form.Item>
              {/* <button onClick={()=>{deleteCustomer(3)}}> Delete </button> */}
            </div>
          </Form>
        </div>
      </div>

      <CreateWarehouseDispatchDrawer
        callbackContact={this.callbackContact}
        fetchContacts={this.fetchContacts}
        visible={this.state.visible}
        showFacility = {this.showFacility}
        onClose={(values) => this.showFacility(false, values)}
      />

      {/*<Modal
          className="main-all-form-modal design-update-modal inner-modal-main"
          closable={true}
          footer={false}
          title="Add contact"
          onOk={() => this.handleContactModel(null, false)}
          onCancel={() => this.handleContactModel(null, false)}
          destroyOnClose
          visible={this.state.showContactModel}
        >
          <div className="col-12 p-0">
            <Form
              className={"main-inner-form"}
              {...layout}
              ref={this.contactRef}
            >
              <Form.Item
                name="contact"
                label={"Contacts *"}
                rules={[
                  {
                    required: true,
                    message: "this field is required",
                  },
                ]}
                className="position-relative"
              >
                <Select
                  dropdownClassName={"option-design-fix"}
                  // mode="multiple"
                  className="search-and-select-tag dropdown-fixed"
                  showSearch={true}
                  removeIcon={""}
                  placeholder="Search"
                  filterOption={false}
                  onChange={this.handleContactSelect}
                  // onDeselect={this.handleContactDeselect}
                  notFoundContent={loading ? <Spin size="small" /> : null}
                  onSearch={value => this.getAllContacts({search: value})}
                  onFocus={() => this.getAllContacts()}
                >
                  {this.state.contacts.map((item, index) => (
                    <Select.Option key={index} value={item.id}>
                      <div className="row mx-0 custom-tree-row custom-tree-row-1 align-items-center justify-content-between">
                        <div
                          className="common-select-option-row"
                          style={{ padding: "10px 0" }}
                        >
                          <div className="select-option-details d-flex align-items-center">
                            <div className={"select-option-icon"}>
                              <img
                                style={{
                                  height: "30px",
                                }}
                                src={Images.contact_icon_small}
                                alt={""}
                                className="img-fluid"
                              />
                            </div>
                            <h6 className="mb-0">
                              {item.full_name}
                              <br />
                              {item.role && (
                                <>
                                  {" "}
                                  <small
                                    style={{
                                      color: "#BDBDBD",
                                      fontSize: "11px",
                                      lineHeight: "8px",
                                    }}
                                  >
                                    {item.role || ""}
                                  </small>{" "}
                                  <br />
                                </>
                              )}
                              {item.account && (
                                <small
                                  style={{
                                    color: "#BDBDBD",
                                    fontSize: "11px",
                                    lineHeight: "8px",
                                  }}
                                >
                                  {item.account?.name || ""}
                                </small>
                              )}
                            </h6>
                          </div>
                        </div>
                        <div className="text-green-tag select-text-tier">
                          Contact
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  className="search-icon bg-transparent border-0 p-0 position-absolute"
                  style={{ top: 6, left: 10 }}
                >
                  <img
                    src={Images.search_small_icon}
                    alt=""
                    className="img-fluid"
                  />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal
          className={"main-all-form-modal design-update-modal inner-modal-main"}
          title="Add Sites"
          closable={true}
          footer={false}
          onOk={() => this.handleSiteModel(null, false)}
          onCancel={() => this.handleSiteModel(null, false)}
          destroyOnClose
          visible={this.state.showSiteModel}
        >
          <div className="col-12 p-0">
            <Form className={"main-inner-form"} {...layout} ref={this.siteRef}>
              <Form.Item
                name="site"
                label={"Site *"}
                rules={[
                  {
                    required: true,
                    message: "this field is required",
                  },
                ]}
                className="position-relative"
              >
                <Select
                  // mode="multiple"
                  className="search-and-select-tag dropdown-fixed"
                  dropdownClassName={"option-design-fix"}
                  showSearch={true}
                  removeIcon={""}
                  placeholder="Search"
                  filterOption={false}
                  onChange={this.handleSiteSelect}
                  // onDeselect={this.handleSiteDeselect}
                  notFoundContent={loading ? <Spin size="small" /> : null}
                  onFocus={this.getAllSites}
                >
                  {this.state.sites.map((item, index) => (
                    <Select.Option key={index} value={item.id}>
                      <div className="row mx-0 custom-tree-row custom-tree-row-1 align-items-center justify-content-between">
                        <div
                          className="common-select-option-row"
                          style={{ padding: "10px 0" }}
                        >
                          <div className="select-option-details d-flex align-items-center">
                            <div className={"select-option-icon"}>
                              <img
                                style={{
                                  height: "30px",
                                }}
                                src={Images.location_black_icon}
                                alt={""}
                                className="img-fluid"
                              />
                            </div>
                            <h6 className="mb-0">
                              {item.name}
                              <br />
                              {item.account && (
                                <small
                                  style={{
                                    color: "#BDBDBD",
                                    fontSize: "11px",
                                    lineHeight: "8px",
                                  }}
                                >
                                  {item.site?.address || ""}
                                </small>
                              )}
                            </h6>
                          </div>
                        </div>
                        <div className="text-green-tag select-text-tier">
                          Site
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  className="search-icon bg-transparent border-0 p-0 position-absolute"
                  style={{ top: 6, left: 10 }}
                >
                  <img
                    src={Images.search_small_icon}
                    alt=""
                    className="img-fluid"
                  />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>*/}

      {/*<CommonWarningModal
          commonInternalLocationPopup
          resourceWarning
          heading={"Are you sure you want to remove this Account?"}
          subHeadingUOM={
            "If you choose to remove this Site Manager Account, this might cause issues."
          }
          visible={this.state.removeVisible}
          showWarningModal2={() => {
            this.setState({ deletableAccountId: null, removeVisible: false });
            this.handleDeleteOwnerAccount();
          }}
          onClose={() => this.showRemoveAccount(false)}
        />*/}
      {/*<CommonWarningModal
          // newCommonModal
          wageInfoDelete
          removeItem={() => {
            this.setState({
              selectedItem: null,
              deletableContactId: null,
              contactDrawerVisible: false,
            });
            this.handleDeleteContact();
          }}
          heading={"Are you sure you want to remove this contact?"}
          subHeadingUOM={" "}
          visible={this.state.contactDrawerVisible}
          // commonFunc={() => }
          onClose={() => this.removeContact(false)}
        />*/}
      {/*<CommonWarningModal
          wageInfoDelete
          // newCommonModal
          removeItem={() => {
            this.setState({
              selectedSite: null,
              deletableSiteId: null,
              siteDrawerVisible: false,
            });
            this.handleDeleteSite();
          }}
          heading={"Are you sure you want to remove this site?"}
          subHeadingUOM={" "}
          visible={this.state.siteDrawerVisible}
          // commonFunc={() => }
          onClose={() => this.handleRemoveSite(false)}
        />*/}
    </React.Fragment>);
  }
}

export default WareHouseDispatchOriginCreate;