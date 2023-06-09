import React, {} from "react";
import AccountingHeader from "../AccountingHeader";
import InvoicingTableMain from "./InvoicingTableMain";
import {routes} from "../../../Controller/Routes";

const InvoicingMain = () => {
    return (
      <div className="main-content-div">
        <AccountingHeader buttonLink={routes.dashboard.accounting.invoicing.create} buttonName="+ Create Invoice"/>
        <div className="row mx-0 opportunities-table-main-dashboard width-160-id">
          <InvoicingTableMain/>
        </div>
      </div>
    );
  // }
}

export default InvoicingMain;
