import React, { Component } from "react";
import { Button, Form, Input, Radio } from "antd";
import { Image as Images } from "../../Images";
import { formatPhone } from "../../../Controller/utils";
import { connect } from "react-redux";
import { history } from "../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../Controller/Routes";

class ContactsInfo extends Component {
  render() {
    const spanStyle = { color: "#38bc94", fontWeight: 500 };
    const { contact } = this.props;
    if (!contact.id) return <div />;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "no-data-card-row-new mt-30" : ""
          }`}
        >
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input placeholder="Search" onChange={this.onSearch} />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
              {!this.props.hideTitle && (
                <Button
                  onClick={() =>
                    history.push(
                      reverse(routes.dashboard.contacts.edit, {
                        id: contact.id,
                      })
                    )
                  }
                  className="edit-btn-summary ml-auto"
                >
                  <img src={Images.pencil_green} alt="" className="img-fluid" />
                  Edit
                </Button>
              )}
              {this.props.hideTitle && (
                <Button
                  onClick={() => this.props.tabChange("2")}
                  className="view-all-btn text-uppercase ml-auto"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="row summary-collapse-inner-row-main px-0">
              {/* <div className="col-12">
                                <div className="row"> */}
              <div className="col-12 col-sm-6">
                {contact.emails.map((item) => (
                  <div
                    style={{ minHeight: "76px" }}
                    className={`row mx-0 pb-0 align-items-center user-info-div-main mb-3 position-relative opportunity-info-div-main ${
                      item.default_email && "active"
                    }`}
                  >
                    <div className="col-12 contact-col-12 d-flex align-items-center">
                      <div className="user-icons-div">
                        <img
                          src={Images.email_inbox_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="user-info-div">
                        <h6>{item?.name}</h6>
                        <p className="mb-0">{item?.email}</p>
                      </div>
                      {item?.id === contact?.default_email?.id && (
                        <span className="w-25" style={spanStyle}>
                          Default Email
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-12 col-sm-6">
                {contact.phone_numbers.map((item) => (
                  <div
                    style={{ minHeight: "76px" }}
                    className={`row mx-0 pb-0 align-items-center user-info-div-main mb-3 position-relative opportunity-info-div-main ${
                      item.default_phone && "active"
                    }`}
                  >
                    <div className="col-12 contact-col-12 d-flex align-items-center">
                      <div className="user-icons-div">
                        <img
                          src={Images.call_add_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="user-info-div">
                        <h6>{item?.name}</h6>
                        <p className="mb-0">
                          {formatPhone(item?.phone_number)}
                        </p>
                      </div>
                      {item?.id === contact?.default_phone?.id && (
                        <span className="w-25" style={spanStyle}>
                          Default Phone
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-12">
                {contact?.phone_numbers?.length === 0 &&
                contact?.emails?.length === 0 ? (
                  <div className="row no-data-upload-screens bg-transparent no-data-second m-0 border-0">
                    <div className="col-12 text-center">
                      <img
                        src={Images.contacts_empty_state_icon}
                        alt=""
                        className="img-fluid"
                      />
                      <h6 className="mb-0 text-gray-tag">No Contact Information</h6>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* </div>
                    </div> */}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(ContactsInfo);
