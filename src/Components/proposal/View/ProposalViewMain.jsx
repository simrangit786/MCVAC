import React, { Component } from "react";
import { Tabs } from "antd";
import ProposalSummary from "./ProposalSummary";
import ProposalActivityView from "./summary-details/ProposalActivityView";
import ViewProposalCustomerAccount from "./components/ViewProposalCustomerAccount";
import { getProposalById, getServiceVariantProposal } from "../../../Controller/api/proposalServices";
import { routes } from "../../../Controller/Routes";
import { getOwnerSites } from "../../../Controller/api/ownerAccountServices";
import { handleError } from "../../../Controller/Global";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ViewProposalPost from "./components/ViewProposalPost";
import ViewProposalDocuments from "./components/ViewProposalDocuments";
import ViewProposalLineItems from "./components/ViewProposalLineItems";
import ViewProposalSites from "./components/ViewProposalSites";
import { checkProposalFieldsRequired } from "../../../Controller/utils";

const { TabPane } = Tabs;

class ProposalViewMain extends Component {
  state = {
    proposal: null,
    sites: [],
    active: "1",
    proposalContacts: [],
    proposal_filled: true,
    // service_variants: 0
  };

  componentDidMount() {
    // this.getServiceVariantProposal()
    this.fetchProposal();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(this.state.proposal != prevState.proposal) {
  //      this.getServiceVariantProposal()
  //   }
  // }

  // getServiceVariantProposal = () => {
  //   getServiceVariantProposal({proposal: this.props.match.params.id}).then(resp => {
  //     this.setState({service_variants: resp.data.length}, () => {
  //       this.setState({proposal_filled: checkProposalFieldsRequired(this.state.proposal, resp.data.length)})
  //     // });
  //   })
  //   .catch(err => {
  //     handleError(err)
  //   })
  // }

  fetchProposal = () => {
    // const {service_variants} = this.state;
    getProposalById(this.props.match.params.id)
      .then((res) => {
        let arr = [
          {
            title: "Proposals",
            url: routes.dashboard.sales.proposal.self,
          },
          {
            title: res.data.name,
            url: "",
          },
        ];
        this.props.setBreadcrumb(arr);
        this.setState({ proposal: res.data, proposal_filled: checkProposalFieldsRequired(res.data) })
        // , () => {
        //     // this.getServiceVariantProposal();
        // });
        if (res.data.site) {
          getOwnerSites({ account: res.data.site.id }).then((response) => {
            this.setState({ sites: response.data.results });
          });
        }
      })
      .catch((err) => {
        handleError(err);
      });
  };
  onTabChange = (key) => {
    this.setState({ active: key });
  };

  render() {
    const { proposal, sites, proposal_filled } = this.state;
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
                <ProposalSummary
                  proposal_filled={proposal_filled}
                  onTabChange={this.onTabChange}
                  onChange={(key) => this.onChange(key)}
                  sites={sites}
                  proposal={proposal}
                  fetchProposal={this.fetchProposal}
                />
              </TabPane>
              <TabPane tab="Posts" key="6">
                <ViewProposalPost {...this.props} />
              </TabPane>
              <TabPane tab="Activity" key="7">
                <ProposalActivityView />
              </TabPane>
              <TabPane tab="Site Manager Account" key="2">
                <ViewProposalSites {...this.props} />
              </TabPane>
              <TabPane tab="Billing Accounts" key="3">
                <ViewProposalCustomerAccount
                  {...this.props}
                  proposal={proposal}
                />
              </TabPane>
              <TabPane className="custom-tab-pane" tab="Service Variants" key="4">
                <ViewProposalLineItems proposal={proposal} />
              </TabPane>
              <TabPane tab="Documents" key="5">
                <ViewProposalDocuments />
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
};
export default connect(null, actionCreators)(withRouter(ProposalViewMain));
