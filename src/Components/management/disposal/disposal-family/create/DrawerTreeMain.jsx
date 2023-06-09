import React, { Component } from "react";
import { Button, Dropdown, Input, Menu, Tree } from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { Image, Image as Images } from "../../../../Images";
import {
  createDisposal,
  deleteDisposal,
  updateDisposal,
} from "../../../../../Controller/api/disposalServices";
import {
  MANAGEMENT_TREE_TYPES,
  DISPOSAL,
  DISPOSAL_TIER,
  TREE_INPUT_FIELD,
} from "../../../../../Controller/utils";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";

class DrawerTreeMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTreeData: this.props.item,
      inputLoader: false,
      visibleItemDrawer: false,
      visibleTierDrawer: false,
      itemDrawer: null,
      tierDrawer: null,
      editFormValue: "",
    };
  }

  onSelect = (selectedKeys, info) => {};

  openDeleteModal = (item) => {
    this.setState({ warningModalVisible: true, deleteItem: item });
  };

  removeItem = () => {
    deleteDisposal(this.state.deleteItem.id).then(() => {
      this.props.getPackage(this.props.packageData.id);
    });
    this.showWarningModal(false);
  };

  menu = (item) => (
    <Menu>
      <Menu.Item>
        <div onClick={() => this.onEditItem(item)}>Edit</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => this.openDeleteModal(item)}>Delete</div>
      </Menu.Item>
    </Menu>
  );
  addTierMenu = (item) => (
    <Menu>
      <Menu.Item onClick={() => this.onAddInputField(item, DISPOSAL_TIER)}>
        <div>
          <img
            src={Images.new_sub_tier_icon}
            alt=""
            className="img-fluid mr-2"
          />
          Disposal Tier
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => this.onAddInputField(item, DISPOSAL)}>
        <div>
          <img
            src={Images.line_item_icon_green}
            alt=""
            className="img-fluid mr-2"
          />
          Disposal
        </div>
      </Menu.Item>
    </Menu>
  );

  handleKeyDown = (e, item) => {
    // console.log(e);
    if (e.key == "Enter") {
      this.onBlurSaveInput(e, item);
    }
  };

  renderItemTree = (item) => {
    return (
      <div
        key={item.id}
        className="row mx-0 tree-row-main custom-tree-row align-items-center justify-content-between"
      >
        <div className="d-flex align-items-center">
          <div className="branch-icon-text d-flex align-items-center">
            <h6 className="mb-0 d-flex align-items-center">
              {item.tier_type === DISPOSAL_TIER ? (
                <>
                  {item.name}
                  <div className="add-tier-div-plus">
                    <Dropdown
                      trigger={"click"}
                      overlayClassName="add-tier-dropdown-custom"
                      overlay={() => this.addTierMenu(item)}
                    >
                      <Button
                        className="ant-dropdown-link d-flex align-items-center
                                        border-0 bg-transparent shadow-none p-0"
                      >
                        <span>+</span>
                      </Button>
                    </Dropdown>
                  </div>
                </>
              ) : item.tier_type === DISPOSAL ? (
                <div
                  onClick={() => {
                    if (this.props.drawerItem) {
                      return null;
                    }
                    this.handleItemDrawer(item);
                  }}
                  className="mb-0 d-flex children-heading-last align-items-center"
                >
                  <img
                    src={Images.line_item_icon_green}
                    alt=""
                    className="img-fluid"
                    style={{ marginRight: "10px" }}
                  />
                  {item.title}
                </div>
              ) : (
                <div className="mb-0 d-flex children-heading-last align-items-center">
                  {item.item_type === DISPOSAL && (
                    <img
                      src={Images.line_item_icon_green}
                      alt=""
                      className="img-fluid"
                    />
                  )}
                  <Input
                    value={this.state.editFormValue}
                    autoFocus
                    disabled={this.state.inputLoader}
                    onChange={(e) =>
                      this.setState({ editFormValue: e.target.value })
                    }
                    onBlur={(e) => this.onBlurSaveInput(e, item)}
                    onKeyDown={(e) => this.handleKeyDown(e, item)}
                  />
                  {this.state.inputLoader && (
                    <LoadingOutlined
                      style={{ fontSize: "25px", marginLeft: "20px" }}
                    />
                  )}
                </div>
              )}
              {item.tier_type === DISPOSAL_TIER && (
                <span className="d-flex align-items-center small-heading">
                  {item.children.length}
                  <span>
                    <img
                      src={Images.branch_icon_gray}
                      alt={""}
                      className="img-fluid"
                    />
                  </span>
                </span>
              )}
            </h6>
          </div>
        </div>
        <div className="text-green-tag text-right-tree d-flex align-items-center">
          <div className="remove-dropdown">
            {item.tier_type !== TREE_INPUT_FIELD ? (
              <Dropdown trigger={"click"} overlay={() => this.menu(item)}>
                <Button
                  className="ant-dropdown-link d-flex align-items-center border-0 bg-transparent shadow-none p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <span className="mr-1">
                    {MANAGEMENT_TREE_TYPES[item.tier_type].name}
                  </span>
                  <img
                    src={Images.eva_more_elisis}
                    className="img-fluid"
                    alt=""
                  />
                </Button>
              </Dropdown>
            ) : (
              <Button
                className="ant-dropdown-link cancel-btn-tree cancel-btn-tree-1 d-flex align-items-center border-0 bg-transparent shadow-none p-0"
                onMouseDown={(e) => this.onRemoveInputField(item)}
              >
                <span>Cancel</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  onAddInputField = (inputItem, item_type) => {
    let { children } = this.props.packageData.parent;

    // cloning of children array
    children = JSON.parse(JSON.stringify(children));
    inputItem.item_type = item_type;
    const newTreeData = this.handleTreeData(children, inputItem);
    this.setState({ newTreeData: [...newTreeData], editFormValue: "" });
  };

  onEditItem = (inputItem) => {
    let { children } = this.props.packageData.parent;
    // cloning of children array
    children = JSON.parse(JSON.stringify(children));
    const newTreeData = this.handleTreeData(children, inputItem, true);
    this.setState({
      newTreeData: [...newTreeData],
      editFormValue: inputItem.name,
    });
  };
  onRemoveInputField = (inputItem) => {
    const { children } = this.props.packageData.parent;
    const newTreeData = this.handleTreeData(children);
    this.setState({ newTreeData: [...newTreeData] });
  };

  handleItemDrawer = (item = null) => {
    this.setState({
      visibleItemDrawer: !this.state.visibleItemDrawer,
      itemDrawer: item,
    });
  };

  handleTreeData = (children, inputItem = null, update = false) => {
    children.map((item) => {
      item.title = item.name;
      item.key = item.id ? item.id : item.name;
      let innerChildren = item.children;

      // Updating input field
      if (update && inputItem && inputItem.id === item.id) {
        item.item_type = inputItem.tier_type;
        item.tier_type = TREE_INPUT_FIELD;
      }
      // Add Input Field in tree structure
      else if (!update && inputItem && inputItem.id === item.id) {
        innerChildren.unshift({
          name: "INPUT TITLE" + inputItem.id,
          tier_type: TREE_INPUT_FIELD,
          children: [],
          item_type: inputItem.item_type,
          parent: inputItem,
        });
      }
      return this.handleTreeData(innerChildren, inputItem, update);
    });
    return children;
  };

  onBlurSaveInput = (e, item) => {
    const name = e.target.value;
    if (name) {
      this.setState({ inputLoader: true });
      const data = {
        name: e.target.value,
        tier_type: item.item_type,
      };
      // Update line item then set package
      if (item.id) {
        updateDisposal(item.id, data).then(() => {
          this.setState({ inputLoader: false });
          this.props.getPackage(this.props.packageData.id);
        });
      } else {
        data["parent"] = item.parent.id;
        createDisposal(data).then((response) => {
          this.setState({ inputLoader: false });
          this.props.getPackage(this.props.packageData.id);
        });
      }
    }
  };

  setFieldData = (packageData) => {
    let newTreeData = [];
    if (packageData?.parent)
      newTreeData = this.handleTreeData(packageData.parent.children);
    this.setState({ newTreeData });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.packageData !== prevProps.packageData) {
      this.setFieldData(this.props.packageData);
    }
  }

  componentDidMount() {
    if (!this.props.drawerItem) {
      this.setFieldData(this.props.packageData);
    }
  }

  showWarningModal = (visible) => {
    this.setState({
      warningModalVisible: visible,
    });
  };

  render() {
    const {
      newTreeData,
      visibleItemDrawer,
      itemDrawer,
      visibleTierDrawer,
      tierDrawer,
    } = this.state;
    if (!this.props.item.length) return <div />;
    return (
      <React.Fragment>
        <Tree
          defaultExpandAll={true}
          className="custom-tree-structure custom-tree-structure-update"
          switcherIcon={<img src={Image.treeArrow} alt="arrow" />}
          onSelect={this.onSelect}
          titleRender={this.renderItemTree}
          treeData={this.state.newTreeData}
          autoExpandParent={false}
        />

        <CommonConfirmationModal
          heading={`Are you sure you want to delete this ${
            this.state.deleteItem?.tier_type == DISPOSAL_TIER
              ? "disposal tier"
              : "disposal"
          }?`}
          okAction={() => this.removeItem()}
          subHeading={
            <p className="mb-0 mx-auto" style={{ width: "91%" }}>
              <span>
                To permanently delete{" "}
                {this.state.deleteItem?.tier_type == DISPOSAL_TIER
                  ? "Disposal Tier"
                  : "Disposal"}
                , Select ”Yes, I want to Continue”
              </span>{" "}
              <br />
              <span>To cancel, Select ”No, I want to go back”</span>
            </p>
          }
          visible={this.state.warningModalVisible}
          onClose={() => this.showWarningModal(false)}
          deleteDisposal={true}
          cancelText="No, I want to go back"
        />
      </React.Fragment>
    );
  }
}

export default DrawerTreeMain;
