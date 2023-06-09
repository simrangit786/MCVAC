import React, { Component } from "react";
import { Button, Form, Input, Menu } from "antd";
import { Image as Images } from "../../Images";
import OppurtunityCustomerAccount from "./SummaryInfo/OpportunityCustomerAccount";

class AccountsInfo extends Component {
  render() {
    return (
      <React.Fragment>
        <OppurtunityCustomerAccount />
      </React.Fragment>
    );
  }
}

export default AccountsInfo;
