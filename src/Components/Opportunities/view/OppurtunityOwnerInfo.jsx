import React, { useState, useEffect } from "react";
import { Image as Images } from "../../Images";
import { Button, Collapse, Form, Input } from "antd";
import SiteOwnerAccountView from "./SiteOwnerAccountView";
import { getOwnerAccount } from "./../../../Controller/api/opportunityServices";
import { withRouter } from "react-router-dom";
import { userTypes } from "../../../Controller/userTypes";
import { handleError } from "../../../Controller/Global";

const { Panel } = Collapse;

const OppurtunityOwnerInfo = props => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAccount();
  }, []) 

  const fetchAccount = (params = {}) => {
    setLoading(true)
    getOwnerAccount({ opportunity: props.match.params.id, ...params })
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
            !props.hideTitle ? "no-data-card-row-new d-none" : ""
          }`}
        >
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between  carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input placeholder="Search" onChange={onSearch} />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
              {props.hideTitle && (
                <Button
                  className="view-all-btn text-uppercase"
                  onClick={() => props.onTabChange("3")}
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
        </div>
        {data.results?.length > 0 ? (
          <div className={`${
            !props.hideTitle ? "sales-site-design-fix" : ""
          }`}>
            {data.results.map((item, index) => (
              <div
                key={index}
                className="col-12 account-contact-collapse-div site-owner-div opportunity-customer-div account-contact-update"
              >
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
                        <div className="col-4 col-sm-4 text-right">
                          <ul className="list-inline contact-site-add-card mb-0">
                            <li className="list-inline-item">
                              <img
                                src={Images.contacts_empty_state_icon}
                                alt={""}
                                className={"img-fluid"}
                              />
                              <span>{item.contact.length} Contacts</span>
                            </li>
                            <li className="list-inline-item">
                              <img
                                src={Images.location_gray}
                                alt={""}
                                className={"img-fluid"}
                              />
                              <span>{item.site.length} Sites</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    }
                    key="1"
                    forceRender
                  >
                    <SiteOwnerAccountView data={item} />
                  </Panel>
                </Collapse>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`col-12 ${
              !props.hideTitle ? "no-data-card-row-new" : ""
            }`}
          >
            <div className="row mx-0 mt-3 no-data-card-row align-items-center justify-content-center">
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
      </React.Fragment>
    );
}

export default withRouter(OppurtunityOwnerInfo);
