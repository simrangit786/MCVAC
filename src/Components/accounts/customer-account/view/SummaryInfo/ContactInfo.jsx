import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, message } from "antd";
import { Image as Images } from "../../../../Images";
import { getContact } from "../../../../../Controller/api/contactsServices";

class ContactInfo extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    const account = this.props.customer;
    getContact({ account: account.id })
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  }

  render() {
    const contacts = this.state.data.results || [];
    return (
      <div className="col-12">
        <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
          <div className="d-flex align-items-center">
            <div className="search-bar-div">
              <Form className="position-relative">
                <Input placeholder="Search" />
                <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                  <img
                    src={Images.search_icon_gray}
                    className="img-fluid"
                    alt="search icon"
                  />
                </Button>
              </Form>
            </div>
          </div>
          <Button className="view-all-btn text-uppercase">VIEW ALL </Button>
        </div>
        <div className="row summary-collapse-inner-row-main px-0 pb-0">
          {contacts.map((item, index) => {
            return (
              <div className="col-12 col-sm-6">
                <div className="row mx-0 align-items-center user-info-div-main mb-3 position-relative opportunity-info-div-main">
                  <div className="col-12">
                    <div className="user-icons-div">
                      <img
                        src={Images.contact_file_icon_black}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="user-info-div">
                      <h6>
                        {item.first_name} {item.last_name}
                      </h6>
                      <p className="mb-0">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(ContactInfo);
