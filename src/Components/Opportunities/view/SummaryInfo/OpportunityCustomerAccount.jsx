import React, { useEffect, useState } from "react";
import { Button, Collapse, Form, Input } from "antd";
import { Image as Images, Image } from "../../../Images";
import CustomerAccountView from "./CustomerAccountView";
import { getCustomerAccount } from "../../../../Controller/api/opportunityServices";
import { withRouter } from "react-router-dom";
import { userTypes } from "../../../../Controller/userTypes";
import { handleError } from "../../../../Controller/Global";

const { Panel } = Collapse;

const OpportunityCustomerAccount = props => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAccount();
  }, []) 

 const fetchAccount = (params = {}) => {
    setLoading(true)
    params.opportunity = props.match.params.id;
    params.page = "all";
    getCustomerAccount({ ...params })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        handleError(err)
        setLoading(false)
      });
  };

  const onSearch = (e) => {
    fetchAccount({ search: e.target.value });
  };

    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !props.editBtn ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between  carpet-cleaning-mini-header">
              <div className="d-flex align-items-center">
                <div className="search-bar-div">
                  <Form className="position-relative">
                    <Input placeholder="Search" onChange={onSearch} />
                    <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                      <img
                        src={Image.search_icon_gray}
                        className="img-fluid"
                        alt="search icon"
                      />
                    </Button>
                  </Form>
                </div>
                {/* {props.editBtn && (
                  <Button className="edit-btn-summary ml-3">
                    <img
                      src={Images.pencil_green}
                      alt=""
                      className="img-fluid"
                    />
                    Edit
                  </Button>
                )}*/}
              </div>
              {props.editBtn && (
                <Button
                  className="view-all-btn text-uppercase"
                  onClick={() => props.onTabChange("2")}
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
        </div>
        {data.length > 0 ? (
          <div className={`${
            !props.editBtn ? "sales-site-design-fix" : ""
          }`}>
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
                      <div className="row mx-0 site-details-row-card m-0 no-data-card-row align-items-center position-relative">
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
                                {item && item.account && item.account.name}{" "}
                              </h5>
                              <h6 className="mb-0">
                                {item &&
                                  item.account &&
                                  userTypes[item.account.account_type]}{" "}
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
                    <CustomerAccountView contacts={item.contact} />
                  </Panel>
                </Collapse>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`col-12 ${
              !props.editBtn ? "no-data-card-row-new" : ""
            }`}
          >
            <div className="row mx-0 mt-3 no-data-card-row align-items-center justify-content-center">
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
    );
  }

export default withRouter(OpportunityCustomerAccount);
