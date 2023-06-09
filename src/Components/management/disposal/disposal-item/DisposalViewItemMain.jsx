import React, { Component } from "react";
import { Tabs } from "antd";
import DisposalItemViewSummary from "./view/DisposalItemViewSummary";
import DisposalDocumentsView from "./view/DisposalDocumentsView";
import DropOffFacilitiesView from "./view/DropOffFacilitiesView";
import InternalLocationView from "./view/InternalLocationView";
import CustomUnitOfMeasurementsView from "./view/CustomUnitOfMeasurementsView";
import { getDisposalById } from "../../../../Controller/api/disposalServices";
import { handleError } from "../../../../Controller/Global";
import { checkDisposalFieldsRequired } from "../../../../Controller/utils";
const { TabPane } = Tabs;

class DisposalViewItemMain extends Component {
  state = {
    tab: "1",
    disposal: null,
    requiredFields: true,
  };
  tabChange = (key) => {
    this.setState({ tab: key });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      getDisposalById(this.props.match.params.id)
        .then((res) => {
          this.setState({ disposal: res.data }, () => {
            this.setState({
              requiredFields: checkDisposalFieldsRequired(this.state.disposal),
            });
          });
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }

  render() {
    const { disposal, requiredFields } = this.state;
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 carpet-cleaning-main-row position-relative">
            {requiredFields && (
              <div className="row mx-0 info-gray-div info-red-div align-items-center">
                <h6 className="mb-0">
                  Please complete all required information to avoid issues
                </h6>
              </div>
            )}
            <Tabs
              activeKey={this.state.tab}
              onChange={this.tabChange}
              className="carpet-cleaning-main-common-tab"
              defaultActiveKey="1"
            >
              <TabPane tab="Summary" key="1">
                <DisposalItemViewSummary
                  tabChange={this.tabChange}
                  disposal={disposal}
                  gridChange
                />
              </TabPane>
              <TabPane tab="Custom Units of Measurement" key="2">
                <CustomUnitOfMeasurementsView
                  editBtn={true}
                  disposal={disposal}
                />
              </TabPane>
              <TabPane tab="warehouse & vendor disposal facilities" key="3">
                <InternalLocationView viewTab disposal={disposal} />
              </TabPane>
              {/*<TabPane tab="External Locations" key="4">*/}
              {/*    <DropOffFacilitiesView editBtn={true} disposal={disposal}/>*/}
              {/*</TabPane>*/}
              <TabPane tab="Documents" key="4">
                <DisposalDocumentsView editBtn={true} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DisposalViewItemMain;
