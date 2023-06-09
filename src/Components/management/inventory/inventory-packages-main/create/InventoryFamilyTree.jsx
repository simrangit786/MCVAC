import React, { Component } from "react";
import { Button, Form, message } from "antd";
import CreateButtonSubTier from "./CreateButtonSubTier";
import TreeMain from "./TreeMain";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class InventoryFamilyTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    return (
      <div className="row common-form-card-row">
        <div className="col-12 tree-heading-second tree-heading">
          <div className="row mx-0">
            <div className="col-6">
              <span>INVENTORY</span>
            </div>
            <div className="col-6 text-right">
              <span>TYPE</span>
            </div>
          </div>
        </div>
        <div className="col-12 p-0">
          <Form
            ref={this.formRef}
            {...layout}
            hideRequiredMark={true}
            className="main-inner-form"
          >
            <div className="row">
              <div className="col-12">
                <div className="row mx-0 info-gray-div align-items-center">
                  <h6 className="mb-0">
                    Please build your inventory family using tiers and inventory
                    items.
                  </h6>
                </div>
              </div>
              <div className="col-12">
                <TreeMain {...this.props} />
              </div>
              <div className="col-12">
                <CreateButtonSubTier {...this.props} />
              </div>
              <div className="col-12 validate-div-col text-md-right">
                <Form.Item>
                  <Button
                    htmlType="submit"
                    className="validate-btn-main"
                    onClick={() =>
                      message.success("Inventory Family updated successfully!")
                    }
                  >
                    Save and Continue
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default InventoryFamilyTree;
