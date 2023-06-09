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
import DisposalDrawer from "./DisposalDrawer";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import TierDrawer from "./TierDrawer";
import { routes } from "../../../../../Controller/Routes";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";

class TreeMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      inputLoader: false,
      visibleItemDrawer: false,
      visibleTierDrawer: false,
      itemDrawer: null,
      tierDrawer: null,
      editFormValue: "",
      keys: [],
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
          <img src={Images.disposal} alt="" className="img-fluid mr-2" />
          Disposal
        </div>
      </Menu.Item>
    </Menu>
  );

  handleTierDrawer = (item = null) => {
    this.setState({
      visibleTierDrawer: !this.state.visibleTierDrawer,
      tierDrawer: item,
    });
  };

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
        className="row ml-0 tree-row-main custom-tree-row align-items-center justify-content-between"
      >
        <div className="d-flex align-items-center">
          <div className="branch-icon-text d-flex align-items-center">
            <h6 className="mb-0 d-flex align-items-center">
              {item.tier_type === DISPOSAL_TIER ? (
                <div className="only-text d-flex align-items-center">
                  <span onClick={() => this.handleTierDrawer(item)}>
                    {" "}
                    {item.name}
                  </span>
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
                </div>
              ) : item.tier_type === DISPOSAL ? (
                <div
                  onClick={() => this.handleItemDrawer(item)}
                  className="mb-0 d-flex images-with-name children-heading-last align-items-center"
                >
                  <img
                    src={Images.disposal}
                    alt=""
                    className="img-fluid"
                    style={{ marginRight: "10px" }}
                  />
                  {item.title}
                </div>
              ) : (
                <div className="mb-0 d-flex input-with-name children-heading-last align-items-center">
                  {item.item_type === DISPOSAL && (
                    <img src={Images.disposal} alt="" className="img-fluid" />
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
                className="ant-dropdown-link cancel-btn-tree
                            cancel-btn-tree-1 d-flex align-items-center border-0 bg-transparent shadow-none p-0"
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
    const treeData = this.handleTreeData(children, inputItem);
    const keys = this.state.keys;
    keys.push(inputItem.key);
    this.setState({ treeData: [...treeData], editFormValue: "", keys: keys });
  };

  onEditItem = (inputItem) => {
    let { children } = this.props.packageData.parent;
    // cloning of children array
    children = JSON.parse(JSON.stringify(children));
    const treeData = this.handleTreeData(children, inputItem, true);
    this.setState({ treeData: [...treeData], editFormValue: inputItem.name });
  };
  onRemoveInputField = (inputItem) => {
    const { children } = this.props.packageData.parent;
    const treeData = this.handleTreeData(children);
    this.setState({ treeData: [...treeData] });
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
    let treeData = [];
    if (packageData?.parent)
      treeData = this.handleTreeData(packageData.parent.children);
    this.setState({ treeData });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.packageData !== prevProps.packageData) {
      this.setFieldData(this.props.packageData);
    }
  }

  componentDidMount() {
    this.setFieldData(this.props.packageData);
  }

  showWarningModal = (visible) => {
    this.setState({
      warningModalVisible: visible,
    });
  };

  onExpand = (keys) => {
    this.setState({ keys });
  };

  render() {
    const {
      treeData,
      visibleItemDrawer,
      itemDrawer,
      visibleTierDrawer,
      tierDrawer,
    } = this.state;
    if (!treeData.length) return <div />;
    return (
      <React.Fragment>
        <Tree
          defaultExpandAll={true}
          className="custom-tree-structure custom-tree-structure-update"
          switcherIcon={<img src={Image.treeArrow} alt="arrow" />}
          onSelect={this.onSelect}
          titleRender={this.renderItemTree}
          treeData={treeData}
          autoExpandParent={false}
        />
        {visibleItemDrawer
          ? history.push(
              reverse(routes.dashboard.management.disposal.items.view, {
                id: itemDrawer.id,
              })
            )
          : // routes.dashboard.management.disposal.items.view
            // <DisposalDrawer visible={visibleItemDrawer} item={itemDrawer}
            //                 onClose={this.handleItemDrawer}/>
            ""}
        {visibleTierDrawer ? (
          <TierDrawer
            visible={visibleTierDrawer}
            item={tierDrawer}
            packageData={this.props.packageData}
            getPackage={this.props.getPackage}
            onClose={this.handleTierDrawer}
          />
        ) : (
          ""
        )}
        <CommonConfirmationModal
          heading={`Are you sure you want to delete this ${
            this.state.deleteItem?.tier_type == DISPOSAL_TIER
              ? "Tier"
              : "Disposal"
          }?`}
          okAction={() => this.removeItem()}
          subHeading={
            <p className="mb-0 mx-auto" style={{ width: "91%" }}>
              <span>
                {this.state.deleteItem?.tier_type == DISPOSAL_TIER
                  ? "If you choose to delete this Tier, the Tier and everything that it includes (Tiers, Disposal) would be deleted."
                  : "If you choose to delete this Disposal, this Disposal and everything that it includes would be deleted."}
              </span>
            </p>
          }
          visible={this.state.warningModalVisible}
          onClose={() => this.showWarningModal(false)}
          deleteLineItem={true}
          cancelText="No, I want to go back"
        />
      </React.Fragment>
    );
  }
}

export default TreeMain;
