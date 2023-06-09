import React, { Component } from "react";
import { Breadcrumb, Button, Divider, Dropdown, Form, Input, Layout, Menu, Modal, Select, Space, Spin, Tree, TreeSelect } from "antd";
import { DownOutlined, LoadingOutlined } from "@ant-design/icons";
import { Image, Image as Images } from "../../../../Images";
import {
  createLineItem,
  deleteLineItem,
  getLineItem,
  getServiceFamily,
  updateLineItem,
} from "../../../../../Controller/api/lineItemsServices";
import {
  MANAGEMENT_TREE_TYPES,
  SERVICE_LINE_ITEM,
  SERVICE_TIER,
  TREE_INPUT_FIELD,
} from "../../../../../Controller/utils";
import LineItemDrawer from "./lineItemDrawer";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import TierDrawer from "./tierDrawer";
import { handleError } from "../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Option } = Select;

class TreeMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      tierTreeData: [],
      lineItems: [],
      inputLoader: false,
      moveItemDrawer: false,
      visibleItemDrawer: false,
      visibleTierDrawer: false,
      itemDrawer: null,
      tierDrawer: null,
      tiersData: null,
      selectedTierId: null,
      editFormValue: "",
      keys: [],
      tiers: [1],
      childExist: false,
      tierSelectId: null,
      serviceFamily: [],
     };
    this.formRef = React.createRef();
  }
  

  onSelect = (selectedKeys, info) => {};

  openDeleteModal = (item) => {
    this.setState({ warningModalVisible: true, deleteItem: item });
  };

  removeItem = () => {
    deleteLineItem(this.state.deleteItem.id).then(() => {
      this.props.getPackageData(this.props.packageData.id);
    });
    this.showWarningModal(false);
  };

  menu = (item) => (
    <Menu>
      <Menu.Item>
        <div onClick={() => this.onEditItem(item)}>Edit</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => this.onMoveItem(item)}>Move</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => this.openDeleteModal(item)}>Delete</div>
      </Menu.Item>
    </Menu>
  );
  addTierMenu = (item) => (
    <Menu>
      <Menu.Item onClick={() => this.onAddInputField(item, SERVICE_TIER)}>
        <div>
          <img
            src={Images.new_sub_tier_icon}
            alt=""
            className="img-fluid mr-2"
          />
          Tier
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => this.onAddInputField(item, SERVICE_LINE_ITEM)}>
        <div>
          <img
            src={Images.line_item_icon_green}
            alt=""
            className="img-fluid mr-2"
          />
          Service
        </div>
      </Menu.Item>
    </Menu>
  );

  // handleTierDrawer = (item = null) => {
  //     this.setState({visibleTierDrawer: !this.state.visibleTierDrawer, tierDrawer: item})
  // }

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
        onClick={() =>
          // item.tier_type == SERVICE_TIER ? this.handleTierDrawer(item) :
          item.tier_type == SERVICE_LINE_ITEM && this.handleItemDrawer(item)
        }
      >
        <div className="d-flex align-items-center">
          <div className="branch-icon-text d-flex align-items-center">
            <h6 className="mb-0 d-flex align-items-center">
              {item.tier_type === SERVICE_TIER ? (
                <div className="only-text d-flex align-items-center">
                  <span
                  //    onClick={() => this.handleTierDrawer(item)}
                  >
                    {" "}
                    {item.name}
                  </span>
                  <div
                    className="add-tier-div-plus"
                    onClick={(e) => e.stopPropagation()}
                  >
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
              ) : item.tier_type === SERVICE_LINE_ITEM ? (
                <div
                  onClick={() => this.handleItemDrawer(item)}
                  className="mb-0 d-flex images-with-name children-heading-last align-items-center"
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
                <div className="mb-0 d-flex input-with-name children-heading-last align-items-center">
                  {item.item_type === SERVICE_LINE_ITEM && (
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
              {item.tier_type === SERVICE_TIER && (
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
          <div className="remove-dropdown" onClick={(e) => e.stopPropagation()}>
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

  onMoveItem = (inputItem) => {
    this.setState({selectedTierId: inputItem.id})
    this.handleMoveItemDrawer(true)
  
  }

  handleMoveItemDrawer = (val) => {
    this.setState({moveItemDrawer: val})
      
  }

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

   removeServiceFromTree = (parent) => {
     parent.children = parent.children.filter((child) => {return child.tier_type === SERVICE_TIER}).map((child) => {   
      return this.removeServiceFromTree(child)
    });
    return parent;
  }


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
        updateLineItem(item.id, data).then(() => {
          this.setState({ inputLoader: false });
          this.props.getPackageData(this.props.packageData.id);
        });
      } else {
        data["parent"] = item.parent.id;
        createLineItem(data).then((response) => {
          this.setState({ inputLoader: false });
          this.props.getPackageData(this.props.packageData.id);
        });
      }
    }
  };

  setFieldData = (packageData) => {
    let treeData = [];
    let tierTreeData = []
    if (packageData?.parent){
      treeData = this.handleTreeData(packageData.parent.children);
      const parent = JSON.parse(JSON.stringify(packageData.parent))
      tierTreeData = this.removeServiceFromTree(parent)
    }
  
    if(this.props.packageData) {
    this.setState({ treeData, tierTreeData: [...tierTreeData.children, {title:"No Tier",key: null}] });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.packageData !== prevProps.packageData) {
      this.setFieldData(this.props.packageData);
    }

  }

  componentDidMount() {
    this.setFieldData(this.props.packageData);
    this.handleServiceFamily()
  }


  handleApplyFilter = () => {
    let params = {}
    if(this.state.tierSelectId == null) {
       params = {
        parent: this.props.packageData.parent?.id
       }
    } else {
     params = {
      parent: this.state.tierSelectId
    }
  }

    updateLineItem(this.state.selectedTierId,params).then(res => {
      this.setFieldData(this.props.packageData);
      this.props.getPackageData(this.props.packageData.id);
      this.handleMoveItemDrawer(false)
    }).catch((err) => {
      handleError(err);
    })

  }

  clearValues = () => {
    this.setState({tierSelectId: null})
  }

  showWarningModal = (visible) => {
    this.setState({
      warningModalVisible: visible,
    });
  };

  // clearValues = () => {
  //   this.setState({tiersData: null})
  //   console.log(this.formRef.current.setFieldsValue({
  //     tier: ""
  //   }))
  // }

  onExpand = (keys) => {
    this.setState({ keys });
  };

  tierTreeOnChange = (value) => {
      this.setState({tierSelectId: value})
  }

  handleServiceFamily = () => {
    this.setState({fetching: true})
    const data  = {
      move_tier: 1
    }
    getServiceFamily(data).then(res => {
        this.setState({serviceFamily: res.data, totalFamilyCount: res.data.count})
    }).catch((err) => {
      handleError(err)
    })
  }

  handlePagination  = () => {
    this.setState((prevState) => {
      return {page: prevState.page + 1}
  }, () => {
      this.handleServiceFamily({page: this.state.page});
  })
  }

  handleUpdateFamily = (val) => {
    let foundItem = this.state.serviceFamily.find(i => i.id === val)
    this.setFieldData(foundItem);

  }

  render() {
    const {
      treeData,
      visibleItemDrawer,
      itemDrawer,
      visibleTierDrawer,
      tierDrawer,
      tierTreeData
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
          onExpand={this.onExpand}
        />
        {visibleItemDrawer ? (
          <LineItemDrawer
            visible={visibleItemDrawer}
            item={itemDrawer}
            onClose={this.handleItemDrawer}
          />
        ) : (
          ""
        )}
        {
                        visibleTierDrawer ? 
                        <TierDrawer visible={visibleTierDrawer} item={tierDrawer}
                        packageData={this.props.packageData}
                        getPackage={this.props.getPackage}
                        onClose={this.handleTierDrawer}/>
                    :
                    ""
                    }

        <CommonConfirmationModal
          heading={`Are you sure you want to delete this ${
            this.state.deleteItem?.tier_type == SERVICE_TIER
              ? "tier"
              : "Service"
          }?`}
          okAction={() => this.removeItem()}
          subHeading={
            <p className="mb-0 mx-auto" style={{ width: "91%" }}>
              <span>
                {this.state.deleteItem?.tier_type == SERVICE_TIER
                  ? "If you choose to delete this Tier, the Tier and everything that it includes (Tiers, Services, Service Variants) would be deleted."
                  : "If you choose to delete this Service, this Service and everything that it includes (Service Variants, etc) would be deleted."}
              </span>
            </p>
          }
          visible={this.state.warningModalVisible}
          onClose={() => this.showWarningModal(false)}
          deleteLineItem={true}
          cancelText="No, I want to go back"
        />

         <Modal
          className={"main-all-form-modal design-update-modal inner-modal-main"}
          title={"Move Under..."}
          onOk={() => this.handleMoveItemDrawer(false)}
          onCancel={() => this.handleMoveItemDrawer(false)}
          destroyOnClose
          closable={true}
          // footer={false}
          visible={this.state.moveItemDrawer}
          footer={
            <div
              style={{
                // textAlign: "right",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                className="apply-filter-update"
                onClick={this.clearValues}
                style={{ marginRight: 8 }}
              >
                Clear
              </Button>
              <Button
                className="apply-filter-update"
                onClick={this.handleApplyFilter}
                type="primary"
              >
                Apply 
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row info-gray-div align-items-center">
                <h6 className="mb-0">
                Please choose where this tier / service variant need to be moved. 
                </h6>
              </div>
            </div>
            <div className="col-12">
            <Form {...layout} className="main-inner-form" ref={this.formRef}>
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="family"
                      label={"Service Family"}
                      rules={[
                        {
                          required: false, // message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      {/* <Input 
                      defaultValue = {this.props.packageData.name}
                      disabled= {true}
                      /> */}
                      <Select 
                       defaultValue = {this.props.packageData.id}
                       onChange = {this.handleUpdateFamily}
                      //  disabled= {true}
                      onFocus={() => this.handleServiceFamily({page: this.state.page})}
                      >
                        {this.state.serviceFamily?.length && this.state.serviceFamily?.map(i => (
                          <Option value={i.id}>{i.name}</Option>                        
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-12">

<TreeSelect
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="Please select"
      allowClear
      value={this.state.tierSelectId}
      showCheckedStrategy={TreeSelect.SHOW_PARENT}
      treeDefaultExpandAll
      treeData={tierTreeData}
      onChange={this.tierTreeOnChange}
      filterTreeNode
      treeNodeFilterProp={"name"}
    />


                  </div>
                 
                 </div>
              </Form>
          </div>
          </div>
        </Modal>
    
      </React.Fragment>

      

    );
  }
}

export default TreeMain;
