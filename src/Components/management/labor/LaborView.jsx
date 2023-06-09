import React, { Component } from "react";
import { Spin, Tabs } from "antd";
import EmployeesView from "./labour-group/EmployeesView";
import Summary from "./labour-group/Summary";
import { getLaborGroupById } from "../../../Controller/api/labourServices";
import { handleError } from "../../../Controller/Global";
import { routes } from "../../../Controller/Routes";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { connect } from "react-redux";
import { checkLaborFieldRequired } from "../../../Controller/utils";

const { TabPane } = Tabs;

class LaborView extends Component {
  state = {
    group: null,
    active: "1",
    requiredFields: true
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      getLaborGroupById(this.props.match.params.id)
        .then((res) => {
          let arr = [
            {
              title: "Labor",
              url: routes.dashboard.management.labor.self,
            },
            {
              title: "Labor Groups",
              url: routes.dashboard.management.labor.self,
            },
            { title: res.data.labor_group_name, url: "#" },
          ];
          this.props.setBreadcrumb(arr);
          this.setState({ group: res.data },() => {
            this.setState({requiredFields: checkLaborFieldRequired(this.state.group)})
          });
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }

  handleTabChange = (key) => {
    this.setState({
      active: key,
    });
  };

  render() {
    let { group } = this.state;
    if (!group) {
      return (
        <div className="main-content-div text-center">
          <Spin />
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0">
            <div className="col-12">
            {this.state.requiredFields && (
              <div className="row mx-0 info-gray-div info-red-div align-items-center">
                <h6 className="mb-0">
                  Please complete all required information to avoid issues
                </h6>
              </div>
            )}
              <Tabs
                activeKey={this.state.active}
                onChange={this.handleTabChange}
                className="carpet-cleaning-main-common-tab"
                defaultActiveKey="1"
              >
                <TabPane tab="Summary" key="1">
                  <Summary
                    tabChange={() => this.handleTabChange("2")}
                    group={group}
                  />
                </TabPane>
                <TabPane tab="Employees" key="2">
                  <EmployeesView hideTitle={true} group={group} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(LaborView);
