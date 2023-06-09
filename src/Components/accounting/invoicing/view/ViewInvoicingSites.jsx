import React, { Component } from "react";
import { Button, Collapse, Form, Input } from "antd";
import { Image as Images } from "../../../Images";
import { getSiteOwnerContacts } from "../../../../Controller/api/proposalServices";
import { userTypes } from "../../../../Controller/userTypes";
import SiteOwnerAccountView from "../../../Opportunities/view/SiteOwnerAccountView";
import InvoicingSitesOwnerAccount from "../create/InvoicingSitesOwnerAccount";
import { getInvoiceOwnerAccount } from "../../../../Controller/api/invoiceServices";
import { handleError } from "../../../../Controller/Global";

const { Panel } = Collapse;

class ViewInvoicingSites extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    this.fetchSiteOwnerContact();
  }

  fetchSiteOwnerContact = (params = {}) => {
    params.invoice = this.props?.Invoice?.id;
    getInvoiceOwnerAccount(params)
      .then((response) => {
        this.setState({ data: response.data.results });
      })
      .catch((err) => {
        handleError(err)
      });
  };

  handleChangeTab = () => {
    this.props.onChange("2");
  };

  render() {
    const { data } = this.state;
    const { viewAll } = this.props;
    return (
      <React.Fragment>
        <div className={`row mx-0 ${!this.props.viewAll ? "sales-site-design-fix" : ""}`}>
          <div className="col-12">
            <div
              className={`row new-opportunity-header-row mt-0 summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
                !this.props.viewAll ? "mt-30 border-1 d-none" : ""
              }`}
            >
              <div className="search-bar-div d-flex align-items-center">
                {/*<Form className="position-relative">
                  <Input
                    placeholder="Search"
                    onChange={(e) =>
                      this.fetchSiteOwnerContact({ search: e.target.value })
                    }
                  />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>*/}
                {/*<Upload showUploadList={false} customRequest={this.uploadFile}><Button*/}
                {/*    className="add-btn-collapse ml-2 text-uppercase">+*/}
                {/*    Upload</Button></Upload>*/}
              </div>
              {viewAll && (
                <Button
                  // onClick={() => this.props.onTabChange("2")}
                  className="view-all-btn text-uppercase"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
          {data?.length > 0 ? (
            <>
            {data.map(item => (
                <div className="col-12 account-contact-collapse-div site-owner-div opportunity-customer-div account-contact-update">
                  <Collapse
                    accordion
                    defaultActiveKey={["1"]}
                    className="site-owner-collapse-main"
                    // expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                  >
                    <Panel
                      header={
                        <div className="row mx-0 site-details-row-card m-0 no-data-card-row align-items-center position-relative">
                          <div className="col-8 col-sm-8 p-0">
                            <div className="row mx-0 align-items-center">
                              <div className="pl-3 pr-2">
                                <img
                                  src={Images.person_black_icon}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div className="">
                                <h5 className="text-capitalize">
                                {" "}{item && item.account && item.account.name}{" "}
                                </h5>
                                <h6 className="mb-0">
                                {item && item.account && userTypes[item.account.account_type]}{" "}
                                  Site Manager Account
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-4 col-sm-4 text-right">
                            <ul className="list-inline contact-site-add-card mb-0">
                              <li className="list-inline-item">
                                <img
                                  src={Images.contacts_empty_state_icon}
                                  alt={""}
                                  className={"img-fluid"}
                                />
                                <span>2 Contacts</span>
                              </li>
                              <li className="list-inline-item">
                                <img
                                  src={Images.location_gray}
                                  alt={""}
                                  className={"img-fluid"}
                                />
                                 <span>
                                {item.site.length}
                                  Sites</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      }
                      key="1"
                      forceRender
                    >
                      <InvoicingSitesOwnerAccount data ={item}/>
                    </Panel>
                  </Collapse>
                </div>
            ))}
            </>
          ) : (
            <div className={`col-12 ${!this.props.viewAll ? "no-data-card-row-new" : ""}`}>
              <div className="row mt-3 mx-0 no-data-card-row align-items-center justify-content-center">
                <div className="col-12 text-center">
                  <img
                    src={Images.Account_no_data_icon}
                    alt={"contact-icon"}
                    className="img-fluid"
                  />
                  <h6 className="mb-0 mt-2">No Site Manager Accounts</h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ViewInvoicingSites;
