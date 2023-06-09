import React, {Component} from 'react';
import {Button, Collapse, Form, Input} from "antd";
import {Image, Image as Images} from "../../../Images";
import {RightOutlined} from "@ant-design/icons";
import WOBillingAccountDetails from "./WOBillingAccountDetails";
import { getWorkOrderCustomerAccount } from '../../../../Controller/api/workOrderServices';
import { userTypes } from '../../../../Controller/userTypes';
import { handleError } from '../../../../Controller/Global';
const { Panel } = Collapse;
class WOBillingAccountView extends Component {
  state = {
    data : null
  }

  componentDidMount() {
    this.fetchCustomerAccount();
  }

  fetchCustomerAccount = (params = {}) => {
    params.workorder = this.props.workOrder.id;
    getWorkOrderCustomerAccount(params)
      .then((response) => {
        this.setState({ data: response.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };
    render() {
      const { data } = this.state
        return (
             <React.Fragment>
        <div className={`row mx-0 ${!this.props.hideTitle ? "sales-site-design-fix no-data-card-row-new billing-account-data" : ""
          }`}>
          <div className="col-12">
            <div className={`row new-opportunity-header-row mt-0 summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${!this.props.viewAll ? "mt-30 border-1" : ""
              }`}>
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
                  onClick={() => this.props.onTabChange("5")}
                  className="view-all-btn text-uppercase"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
            <React.Fragment>
              {data?.length > 0 ? (
                <>
                  {data.map((item, index) => (
                    <div
                      // key={index}
                      className="col-12 account-contact-collapse-div site-owner-div opportunity-customer-div account-contact-update">
                      <Collapse
                        // accordion
                        defaultActiveKey={["1"]}
                        className="site-owner-collapse-main"
                        expandIcon={({isActive}) => <RightOutlined rotate={isActive ? 90 : 0}/>}
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
                                      {" "}{item && item.account && item.account.name}{" "}
                                    </h5>
                                    <h6 className="mb-0">
                                      {item && item.account && userTypes[item.account.account_type]}{" "}
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
                                      {item.contact.length}
                                      Contacts
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          }
                          key="1"
                          forceRender
                        >
                          <WOBillingAccountDetails contacts={item.contact}/>
                        </Panel>
                      </Collapse>
                    </div>
                  ))}
                </>
              ) : (
                <div
                  className={`col-12 ${
                    !this.props.hideTitle ? "no-data-card-row-new" : ""
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

export default WOBillingAccountView;