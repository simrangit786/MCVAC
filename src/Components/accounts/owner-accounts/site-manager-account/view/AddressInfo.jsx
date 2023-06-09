import React, { Component } from "react";
import { Button, Dropdown, Form, Input, message } from "antd";
import { Image as Images } from "../../../../Images";
import { getOneOwnerAccount } from "../../../../../Controller/api/ownerAccountServices";
import { withRouter } from "react-router-dom";
import { formatPhone } from "../../../../../Controller/utils";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../Controller/Routes";

class AddressInfo extends Component {
  state = {
    main: null,
    billing: null,
  };

  componentDidMount() {
    getOneOwnerAccount({ account: this.props.match.params.id })
      .then((res) => {
        this.setState({ main: res.data.results[0].main_address });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
    getOneOwnerAccount({ account: this.props.match.params.id })
      .then((res) => {
        this.setState({ billing: res.data.results[0].billing_address });
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
    let { main, billing } = this.state;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          {this.props.hideTitle && (
            <div className="col-12">
              <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
                {this.props.hideTitle && (
                  <Button
                    className="edit-btn-summary"
                    onClick={() =>
                      history.push({
                        pathname: reverse(routes.dashboard.owner_account.edit, {
                          id: this.props.match.params.id,
                        }),
                        editTab: "3",
                      })
                    }
                  >
                    <img
                      src={Images.pencil_green}
                      alt=""
                      className="img-fluid"
                    />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          )}
          <div className="col-12">
            <div className="row summary-collapse-inner-row-main px-0">
              <div className="col-12">
                {main ? (
                  <div className="row site-details-row-card position-relative">
                    <div className="col-12 col-sm-3 title">
                      <div className="site-name-location">
                        <img
                          src={Images.location_gray}
                          alt=""
                          className="img-fluid"
                        />
                        <span>Main Address</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">{`${main.street_address} ${main.apartment} ${main.city} ${main.state} ${main.zip_code} ${main.country}`}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">{main.email}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">{formatPhone(main.phone)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="row mx-0 no-data-card-row no-data-card-row-2 align-items-center justify-content-center">
                    <div className="col-12 text-center">
                      <img
                        alt={""}
                        className="img-fluid"
                        src={Images.location_gray}
                      />
                      <h6 className="mb-0">No Address Information</h6>
                    </div>
                  </div>
                )}
                {billing && (
                  <div className="row site-details-row-card position-relative">
                    <div className="col-12 col-sm-3 title">
                      <div className="site-name-location">
                        <img
                          src={Images.location_gray}
                          alt=""
                          className="img-fluid"
                        />
                        <span>Billing Address</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">{`${billing.street_address} ${billing.apartment} ${billing.city} ${billing.state} ${billing.zip_code} ${billing.country}`}</p>
                    </div>
                    {/*<div className="col-12 col-sm-3">*/}
                    {/*    <h6 className="text-uppercase">Same As Main Address</h6>*/}
                    {/*    <p className="mb-0">{billing.is_same_main_address ? 'Yes' : 'No'}</p>*/}
                    {/*</div>*/}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(AddressInfo);
