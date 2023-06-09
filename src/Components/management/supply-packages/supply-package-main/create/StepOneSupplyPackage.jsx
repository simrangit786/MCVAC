import React, { Component } from "react";
import { Button, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import CreateSupplyPackage from "./CreateSupplyPackage";

const { Panel } = Collapse;

function callback(key) {
  // console.log(key);
}

class StepOneSupplyPackage extends Component {
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
                  <h5 className="mb-0">Supply Family</h5>
                  <Button className="border-0 p-0 bg-transparent text-uppercase">
                    required
                  </Button>
                </div>
              </div>
            }
            key="1"
          >
            <CreateSupplyPackage {...this.props} />
          </Panel>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default StepOneSupplyPackage;
