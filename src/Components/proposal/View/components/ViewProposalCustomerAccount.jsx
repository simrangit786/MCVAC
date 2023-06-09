import React, { Component } from "react";
import { Image, Image as Images } from "../../../Images";
import { getCustomerAccount } from "../../../../Controller/api/proposalServices";
import { Button, Collapse, Form, Input } from "antd";
import { userTypes } from "../../../../Controller/userTypes";
import CustomerContactsView from "./CustomerContactsView";

const { Panel } = Collapse;

class ViewProposalCustomerAccount extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    this.fetchCustomerAccount();
  }

  fetchCustomerAccount = (params = {}) => {
    params.proposal = this.props.match.params.id;
    getCustomerAccount(params)
      .then((response) => {
        this.setState({ data: response.data.results });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { data } = this.state;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${!this.props.hideTitle ? "sales-site-design-fix no-data-card-row-new" : ""
            }`}
        >
          <div className="col-12">
            <div
              className={`row new-opportunity-header-row mt-0 summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${!this.props.viewAll ? "mt-30 border-1" : ""
                }`}
            >
              <div className="search-bar-div d-flex align-items-center">
                <Form className="position-relative">
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
                </Form>
                {/*<Upload showUploadList={false} customRequest={this.uploadFile}><Button*/}
                {/*    className="add-btn-collapse ml-2 text-uppercase">+*/}
                {/*    Upload</Button></Upload>*/}
              </div>
              {this.props.hideTitle && (
                <Button
                  onClick={() => this.props.onTabChange("3")}
                  className="view-all-btn text-uppercase"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
            <React.Fragment>
              {/*{data.length > 0 ? data.map((data, index) =>
                                    <div key={index} className="col-12 mt-3">
                                        <div
                                            className="row mx-0 customer-account-ifo align-items-center justify-content-center">
                                            <div className='col-12'>
                                                <div
                                                    className="row bg-transparent border-0 mb-0 align-items-center user-info-div-main position-relative">
                                                    <div className="col-12">
                                                        <div className="user-icons-div">
                                                            <img src={Images.person_black_icon} alt=""
                                                                 className="img-fluid"/>
                                                        </div>
                                                        <div className="user-info-div">
                                                            <h6>{data.account?.name}</h6>
                                                            <p className="mb-0">{data.account?.account_type}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {data.contact.length > 0 ?
                                            <div className="row">
                                                {data.contact.map((contact, index) => <div key={index}
                                                                                           className='col-12 col-sm-6'>
                                                    <div
                                                        className="row mx-0 align-items-center user-info-div-main user-info-div-main-view">
                                                        <div className="col-12">
                                                            <div className="row mx-0 align-items-center">
                                                                <div className="user-icons-div">
                                                                    <img src={Images.contact_file_icon_black} alt=""
                                                                         className="img-fluid"/>
                                                                </div>
                                                                <div className="user-info-div position-relative">
                                                                    <h6 className="mb-0">{`${contact.contact?.first_name} ${contact.contact?.last_name}`}</h6>
                                                                    <p className="mb-0">{contact.contact?.role}</p>
                                                                    {contact.default_customer_recipient &&
                                                                    <h5 className="mb-0 proposal-recipient-tag position-absolute">Proposal Recipient</h5>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>)}
                                            </div>
                                            :
                                            <div
                                                className="row mx-0 mt-3 no-data-card-row align-items-center justify-content-center">
                                                <h6 className="mb-0">No Billing Account</h6>
                                            </div>
                                        }
                                    </div>
                                )
                                :
                                <div className="col-12">
                                    <div
                                        className="row mx-0 mt-3 no-data-card-row align-items-center justify-content-center">
                                        <div className="col-12 text-center">
                                            <img src={Images.no_account_icon} alt={'contact-icon'}
                                                 className="img-fluid"/>
                                            <h6 className="mb-0 mt-2">No Billing Contacts</h6>
                                        </div>
                                    </div>
                                </div>
                            }*/}

              {data.length > 0 ? (
                <>
                  {data.map((item, index) => (
                    <div
                      key={index}
                      className="col-12 account-contact-collapse-div site-owner-div opportunity-customer-div account-contact-update"
                    >
                      <Collapse
                        // accordion
                        defaultActiveKey={["1"]}
                        className="site-owner-collapse-main"
                      // expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
                      >
                        <Panel
                          header={
                            <div className="row mx-0 site-details-row-card m-0 no-data-card-row align-items-center position-relative h-auto">
                              <div className="col-9 col-sm-9 p-0">
                                <div className="row mx-0 align-items-center">
                                  <div className="pl-3 pr-2">
                                    <img
                                      src={Image.person_black_icon}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="">
                                    <h5 className="text-capitalize">
                                      {" "}
                                      {item &&
                                        item.account &&
                                        item.account.name}{" "}
                                    </h5>
                                    <h6 className="mb-0">
                                      {item &&
                                        item.account &&
                                        userTypes[
                                        item.account.account_type
                                        ]}{" "}
                                      Account
                                    </h6>
                                  </div>
                                </div>
                              </div>
                              <div className="col-3 col-sm-3 text-right">
                                <ul className="list-inline contact-site-add-card mb-0">
                                  <li className="list-inline-item">
                                    <img
                                      src={Image.contact_widget_icon}
                                      alt={""}
                                      className={"img-fluid"}
                                    />
                                    <span
                                      style={{
                                        color: "#4F4F4F",
                                      }}
                                    >
                                      {item.contact.length} Contacts
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          }
                          key="1"
                          forceRender
                        >
                          <CustomerContactsView contacts={item.contact} />
                        </Panel>
                      </Collapse>
                    </div>
                  ))}
                </>
              ) : (
                <div
                  className={`col-12 ${!this.props.hideTitle ? "no-data-card-row-new" : ""
                    }`}
                >
                  <div className="row mt-3 no-data-card-row align-items-center justify-content-center">
                    <div className="col-12 text-center">
                      <img
                        src={Images.Account_no_data_icon}
                        alt={"contact-icon"}
                        className="img-fluid"
                      />
                      <h6 className="mb-0 mt-2">No Billing Accounts</h6>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ViewProposalCustomerAccount;
