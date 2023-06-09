import React, { Component } from "react";
import { Tabs } from "antd";
import EmpSummary from "./employee-details/EmpSummary";
import EmpLaborGroups from "./employee-details/EmpLaborGroups";
import EmpDocuments from "./employee-details/EmpDocuments";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { connect } from "react-redux";

const { TabPane } = Tabs;

class EmployeeView extends Component {
  state = {
    tab: "1",
  };

  tabChange = (key) => {
    this.setState({ tab: key });
  };
  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0">
            <div className="col-12">
              <Tabs
                className="carpet-cleaning-main-common-tab"
                onChange={this.tabChange}
                activeKey={this.state.tab}
              >
                <TabPane tab="Summary" key="1">
                  <EmpSummary tabChange={this.tabChange} />
                </TabPane>
                <TabPane tab="Labor Groups" key="2">
                  <EmpLaborGroups />
                </TabPane>
                <TabPane tab="Documents" key="3">
                  <EmpDocuments hideTitle={true} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(EmployeeView);
