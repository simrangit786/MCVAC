import React, {Component} from 'react';
import {Tabs} from "antd";
import VendorSummaryInfo from "./view/VendorSummaryInfo";
import { connect } from "react-redux"
import { vendorAccountDetailAction } from '../../../Store/actions/vendorAccountAction';
import { setBreadcrumb } from '../../../Store/actions/breadcrumbAction';
import { routes } from '../../../Controller/Routes';
import { withRouter } from 'react-router-dom';
const { TabPane } = Tabs;

class VendorAccountViewMain extends Component {
  componentDidMount() {
    this.props.vendorAccountDetailAction(this.props.match.params.id).then(() => {
      const { vendor } = this.props;
      let arr = [
        {
          title: "Vendor Accounts",
          url: routes.dashboard.owner_account.self,
        },
        {
          title: vendor.name,
          url: "#",
        },
      ];
      this.props.setBreadcrumb(arr);
    });
  }
    render() {
        return (
            <React.Fragment>
              <div className="main-content-div">
                <div className="row mx-0 carpet-cleaning-main-row position-relative">
                  <Tabs
                    defaultActiveKey="1"
                    // onChange={this.tabChange}
                    className="carpet-cleaning-main-common-tab"
                  >
                    <TabPane tab="Summary" key="1">
                     <VendorSummaryInfo/>
                    </TabPane>
                    {/*<TabPane tab="Documents" key="2">*/}
                    {/*  <DocumentsInfo />*/}
                    {/*</TabPane>*/}
                  </Tabs>
                </div>
              </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
  return { ...state };
};


export default connect(mapStateToProps, {
  vendorAccountDetailAction,
  setBreadcrumb,
})(withRouter(VendorAccountViewMain)
);


