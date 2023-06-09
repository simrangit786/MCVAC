import React, { Component } from "react";
import { Button, Dropdown, Form, Input, Menu, Tree } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../Images";
import { CaretDownOutlined } from "@ant-design/icons";
import CreateButton from "../../CreateButton";
import {
  createSupplyFamily,
  createSupplyGroup,
  deleteSupplyGroup,
  getSupplyFamilyById,
  updateSupplyFamily,
  updateSupplyGroup,
} from "../../../../../Controller/api/supplyServices";
import { handleError } from "../../../../../Controller/Global";
import EditPackageItem from "../../../../modals/EditPackageItem";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateSupplyPackage extends Component {
  state = {
    visible: false,
    editData: null,
    packageData: null,
    treeData: [],
  };

  formRef = React.createRef();

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getPackage(this.props.match.params.id);
    } else if (this.props.packageData) {
      this.getPackage(this.props.packageData.id);
    }
  }

  handleAddButton = (data, id = null) => {
    if (!data) {
      return;
    }
    let newData = [...data];
    newData.forEach((item, index) => {
      if (!item.type) {
        item.key = id ? id + "parent" + index : item.id;
        let obj = {
          title: `Add Tier under ${item.name}`,
          type: "add",
          key: "add" + item.name + item.id,
          parentKey: item.id,
        };
        item.children.push(obj);
      }
      item.children = this.handleAddButton(item.children);
    });
    return newData;
  };

  getPackage = (id) => {
    getSupplyFamilyById(id)
      .then((res) => {
        this.props.setPackage(res.data);
        let treeData = this.handleAddButton(res.data.parent.children, id);
        this.setState({ packageData: res.data, treeData });
        this.formRef.current.setFieldsValue({
          name: res.data.name,
          description: res.data.description,
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleAddChild = (name, parent) => {
    let data = {
      name,
      parent,
    };
    createSupplyGroup(data)
      .then((res) => {
        this.getPackage(this.state.packageData.id);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handlePackageName = () => {
    let data = {
      name: this.formRef.current.getFieldValue("name"),
      description: this.formRef.current.getFieldValue("description"),
    };
    if (this.state.packageData) {
      updateSupplyFamily(this.state.packageData.id, data)
        .then((res) => {
          this.setState({ packageData: res.data });
          this.getPackage(res.data.id);
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createSupplyFamily(data)
        .then((res) => {
          this.setState({ packageData: res.data });
          this.getPackage(res.data.id);
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  showEditModal = (visible, data = null) => {
    this.setState({ visible, editData: data });
  };
  menu = (data) => (
    <Menu>
      <Menu.Item>
        <div onClick={() => this.showEditModal(true, data)}>Edit</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => this.handleRemove(data)}>Remove</div>
      </Menu.Item>
    </Menu>
  );

  handleRemove = (data) => {
    deleteSupplyGroup(data.id)
      .then((res) => {
        this.getPackage(this.state.packageData.id);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  updatePackageItem = (id, values) => {
    updateSupplyGroup(id, values)
      .then((res) => {
        this.getPackage(this.state.packageData.id);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { packageData } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                {this.props.hideTitle && (
                  <>
                    <div className="col-12">
                      <div className="row mx-0 notes-all-common">
                        <div className="col-2 p-0">
                          <div className="row mx-0 icon-info-notes align-items-center h-100 justify-content-center">
                            <img
                              src={Images.information_green_icon}
                              alt={""}
                              className="img-fluid"
                            />
                          </div>
                        </div>
                        <div className="col-10">
                          <div className="row mx-0 h-100 icon-info-details align-items-center">
                            <small className="small-text-main">
                              Note: The tiers with nothing inside of them will
                              become{" "}
                              <b className="text-black-50">Supply Groups</b> in
                              the next step.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {this.state.treeData.length > 0 && (
                      <div className="col-12">
                        <Tree
                          className="custom-tree-structure"
                          showLine
                          defaultExpandAll={true}
                          selectable={false}
                          switcherIcon={<CaretDownOutlined />}
                          titleRender={(data) =>
                            data.type ? (
                              <CreateButton
                                addChild={this.handleAddChild}
                                parent={data.parentKey}
                                buttonName={data.title}
                              />
                            ) : (
                              <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <div className="branch-icon-text d-flex align-items-center">
                                    <img
                                      src={
                                        data.type === "parent"
                                          ? Images.supply_green
                                          : data.children.filter(
                                              (item) => !item.type
                                            ).length > 0
                                          ? null
                                          : Images.supply_green
                                      }
                                      alt={""}
                                      className="img-fluid"
                                    />
                                    <h6 className="mb-0">{data.name}</h6>
                                  </div>
                                  {data.children &&
                                    data.children.filter((item) => !item.type)
                                      .length !== 0 && (
                                      <div className="branch-div-tg d-flex align-items-center">
                                        <span className="count-span-tg">
                                          {
                                            data.children.filter(
                                              (item) => !item.type
                                            ).length
                                          }
                                        </span>
                                        <img
                                          src={Images.branch_icon_gray}
                                          alt={""}
                                          className="img-fluid"
                                        />
                                      </div>
                                    )}
                                </div>
                                <div
                                  className={`text-right-tree d-flex align-items-center ${
                                    data.children.filter(
                                      (c) => c.type !== "add"
                                    ).length === 0
                                      ? "text-red-tag"
                                      : "text-green-tag"
                                  }`}
                                >
                                  {data.children.filter((c) => c.type !== "add")
                                    .length === 0
                                    ? "Supply Group"
                                    : "Tier"}
                                  <div className="remove-dropdown">
                                    <Dropdown
                                      trigger={"click"}
                                      overlay={this.menu(data)}
                                    >
                                      <a
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                      >
                                        <img
                                          src={Images.eva_more_elisis}
                                          className="img-fluid"
                                          alt=""
                                        />
                                      </a>
                                    </Dropdown>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          treeData={this.state.treeData}
                        />
                      </div>
                    )}
                    <div className="col-12">
                      <CreateButton
                        root
                        parent={packageData ? packageData.parent.id : null}
                        addChild={this.handleAddChild}
                      />
                    </div>
                  </>
                )}
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button className="validate-btn-main">
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <EditPackageItem
          data={this.state.editData}
          onUpdate={this.updatePackageItem}
          visible={this.state.visible}
          onClose={() => this.showEditModal(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateSupplyPackage);
