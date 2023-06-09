import React, { Component } from "react";
import { Button, Form, Input, Spin } from "antd";
import { Image as Images } from "../../../Images";
import { getAccountContacts } from "../../../../Controller/api/opportunityServices";
class AccountViewContact extends Component {
  state = {
    data: [],
    loading: false,
  };

  componentDidMount() {
    this.fetchOpportunity();
  }

  fetchOpportunity = (params = {}) => {
    this.setState({ loading: true });
    const opportunity = this.props.opportunity;
    params.opportunity = opportunity.id;
    params.page = "all";
    getAccountContacts(params)
      .then((response) => {
        this.setState({ data: response.data, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };
  render() {
    const contacts = this.state.data || [];
    if (this.state.loading)
      return (
        <div className={"text-center mx-auto"}>
          <Spin size={"small"} />
        </div>
      );
    return (
      <React.Fragment>
        <div className="col-12">
          {this.props.hideTitle && (
            <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input
                    placeholder="Search"
                    onChange={(e) =>
                      this.fetchOpportunity({ search: e.target.value })
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
              </div>
              {/*<Button className="view-all-btn text-uppercase">VIEW ALL </Button>*/}
            </div>
          )}
          <div className="row summary-collapse-inner-row-main">
            {contacts.map((item, index) => {
              return (
                <>
                  <div className="col-6 col-sm-6" key={index}>
                    <div className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main">
                      {item.account ? (
                        <div className="col-6">
                          <div className="user-icons-div">
                            <img
                              src={Images.contact_file_icon_black}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="user-info-div">
                            <h6>{item.account.name} </h6>
                            <p className="mb-0">{item.account.account_type}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="col-6">
                          <div className="user-info-div">
                            <p className="mb-0">No account associated</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-6 col-sm-6">
                    <div className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main">
                      {item.contact ? (
                        <div className="col-6">
                          <div className="user-icons-div">
                            <img
                              src={Images.contact_file_icon_black}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="user-info-div">
                            <h6>
                              {item.contact.first_name} {item.contact.last_name}{" "}
                            </h6>
                            <p className="mb-0">{item.contact.role}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="col-6">
                          <div className="user-info-div">
                            <p className="mb-0">No account associated</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          {contacts.length === 0 && (
            <div className="col-12">
              <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                <h6 className="mb-0">No Accounts & Contacts</h6>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default AccountViewContact;
