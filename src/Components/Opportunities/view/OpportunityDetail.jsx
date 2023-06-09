import React, {useEffect, useState} from "react";
import {Tabs} from "antd";
import SummaryInfoTab from "./SummaryInfoTab";
import AccountsInfo from "./AccountsInfo";
import ProposalsInfo from "./ProposalsInfo";
import ActivityInfo from "./ActivityInfo";
import DocumentsInfo from "./DocumentsInfo";
import OpportunityPostTab from "./OpportunityPostTab";
import {opportunityDetailAction} from "../../../Store/actions/opportunityAction";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../Store/actions/breadcrumbAction";
import {routes} from "../../../Controller/Routes";
import OppurtunityOwnerInfo from "./OppurtunityOwnerInfo";
import {checkOpportunityFieldsRequired} from "../../../Controller/utils";

const {TabPane} = Tabs;

const OpportunityDetail = props => {
    const [active, setActive] = useState('1')
    const [opportunity_filled, setFilled] = useState(true);

    useEffect(() => {
        props.opportunityDetailAction(props.match.params.id)
            .then(() => {
                // console.log(props.opportunity)
                let arr = [
                    {
                        title: "Opportunities",
                        url: routes.dashboard.opportunities.self,
                    },
                    {
                        title: props.opportunity.name,
                        url: "#",
                    },
                ];
                props.setBreadcrumb(arr);
                setFilled(checkOpportunityFieldsRequired(props.opportunity))
            });
    }, [props.opportunity.name])

    const onTabChange = (key) => {
        setActive(key)
    };
    return (
        <React.Fragment>
            <div className="main-content-div">
                <div className="row mx-0 carpet-cleaning-main-row position-relative">
                    {opportunity_filled &&
                        <div className="row mx-0 info-gray-div info-red-div align-items-center">
                            <h6 className="mb-0">
                                Please complete all required information to avoid issues.
                            </h6>
                        </div>
                    }
                    <Tabs
                        className="carpet-cleaning-main-common-tab"
                        activeKey={active}
                        onChange={onTabChange}
                    >
                        <TabPane tab="Summary" key="1">
                            <SummaryInfoTab onTabChange={onTabChange}/>
                        </TabPane>
                        <TabPane tab="Posts" key="6">
                            <OpportunityPostTab />
                        </TabPane>
                        <TabPane tab="Activity" key="7">
                            <ActivityInfo viewAll/>
                        </TabPane>
                        <TabPane tab="Billing Accounts" key="2">
                            <AccountsInfo/>
                        </TabPane>
                        <TabPane tab="Site Manager Account" key="3">
                            <OppurtunityOwnerInfo/>
                        </TabPane>
                        <TabPane tab="Proposals" key="4">
                            <ProposalsInfo/>
                        </TabPane>
                        <TabPane tab="Documents" key="5">
                            <DocumentsInfo/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    return {...state};
}

const actionCreators = {
    opportunityDetailAction,
    setBreadcrumb,
};

export default connect(mapStateToProps, actionCreators)(OpportunityDetail);
