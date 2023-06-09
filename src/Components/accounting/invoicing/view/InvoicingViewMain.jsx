import React, { Component } from "react";
import { Tabs } from "antd";
import InvoicingSummary from "./InvoicingSummary";
import ViewInvoicingPost from "./ViewInvoicingPost";
import ViewInvoicingActivity from "./ViewInvoicingActivity";
import ViewInvoicingSites from "./ViewInvoicingSites";
import ViewInvoicingBillingAccounts from "./ViewInvoicingBillingAccounts";
import ViewInvoicingDocuments from "./ViewInvoicingDocumnets";
import { getInvoiceById } from "../../../../Controller/api/invoiceServices";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { connect } from 'react-redux';
import { handleError } from "../../../../Controller/Global";
import { routes } from "../../../../Controller/Routes";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
const { TabPane } = Tabs;

class InvoicingViewMain extends Component {
  state = {
    active: "1",
    invoice: []
  };
  onTabChange = (key) => {
    this.setState({ active: key });
  };

  componentDidMount() {
    this.fetchInvoice();
  }


  fetchInvoice = () => {
   
    getInvoiceById(this.props.match.params.id)
      .then(res => {
        let arr = [
          {
            title: "View Invoice",
            url: routes.dashboard.accounting.self,
          },
          // {
          //   // title: res.data.id,
          //   title: "",
          //   url: "",
          // },
        ];
        this.props.setBreadcrumb(arr);
        this.setState({ invoice: res.data })
      }).catch((err) => {
        handleError(err);
      });
  }

  render() {
    const {proposal_filled } = this.state;
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 carpet-cleaning-main-row position-relative">
            {proposal_filled && (
              <div className="row mx-0 info-gray-div info-red-div align-items-center">
                <h6 className="mb-0">
                  Please complete all required information to view and send the proposal PDF.
                </h6>
              </div>
            )}
            <Tabs
              className="carpet-cleaning-main-common-tab"
              onChange={this.onTabChange}
              activeKey={this.state.active}
            >
              <TabPane tab="Summary" key="1">
                <InvoicingSummary
                 Invoice={this.state.invoice}
                 fetchInvoice={this.fetchInvoice}
                 onTabChange={this.onTabChange}
                />
              </TabPane>
              <TabPane tab="Posts" key="6">
                <ViewInvoicingPost/>
              </TabPane>
              <TabPane tab="Activity" key="7">
                <ViewInvoicingActivity/>
              </TabPane>
              <TabPane tab="Site Manager Account" key="2">
                <ViewInvoicingSites/>
              </TabPane>
              <TabPane tab="Billing Accounts" key="3">
                <ViewInvoicingBillingAccounts/>
              </TabPane>
              <TabPane tab="Documents" key="5">
                <ViewInvoicingDocuments/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const actionCreators = {
  setBreadcrumb,
}
export default connect(null, actionCreators)(withRouter(InvoicingViewMain));
