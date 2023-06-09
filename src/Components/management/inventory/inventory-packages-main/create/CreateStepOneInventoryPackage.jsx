import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import CreateInventoryPackage from "./CreateInventoryPackage";

const { Panel } = Collapse;
function callback(key) {
  // console.log(key);
}
class CreateStepOneInventoryPackage extends Component {
  render() {
    return (
      <React.Fragment>
        <Collapse
          accordion
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          defaultActiveKey={["1"]}
          onChange={callback}
        >
          <Panel
            header={
              <div className="col-12">
                <div className="row info-card-heading-row align-items-center justify-content-between">
                  <h5 className="mb-0">General Information</h5>
                  <Button className="border-0 p-0 bg-transparent text-uppercase">
                    required
                  </Button>
                </div>
              </div>
            }
            key="1"
          >
            <CreateInventoryPackage {...this.props} />
          </Panel>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default CreateStepOneInventoryPackage;
