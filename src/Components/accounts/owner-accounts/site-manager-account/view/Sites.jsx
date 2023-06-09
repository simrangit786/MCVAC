import React, { Component } from "react";
import { Button, Form, Input, message, Table } from "antd";
import { Image as Images } from "../../../../Images";
import { getOwnerSites } from "../../../../../Controller/api/ownerAccountServices";
import { withRouter } from "react-router-dom";
import { formatPhone } from "../../../../../Controller/utils";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../Controller/Routes";

class Sites extends Component {
  state = {
    sites: [],
    visible: false,
    // selectedData: null,
    pagination: {
      current: 1,
      pageSize: 15,
    },
    loading: false,
    view: false,
    total: null
  };

  siteColumns = [
    {
      title: "SITE NAME",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "SITE MANAGER ACCOUNT",
      dataIndex: "account",
      sorter: true,
      render: (account) => (
          <span>
            {account.account_type == "CUSTOMER_OWNER"
              ? "Billing, Site Manager Account"
              : "Site Manager Account"}
          </span>
      ),
    },
    {
      title: "ADDRESS",
      dataIndex: "",
      sorter: true,
      render: (address) => (
          <span>
            {address.street_address || ""} <br />
            {address.city || ""}
            <br /> {address.state || ""} {address.country || ""}{" "}
            {address.zip_code || ""}
          </span>
      ),
    },
    {
      title: "EMAIL ADDRESS",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone",
      sorter: true,
    },
  ];

  componentDidMount() {
    // getOwnerSites({ account: this.props.match.params.id })
    //   .then((res) => {
    //     this.setState({ sites: this.props.viewAll === false ? res.data.results.slice(0,10) : res.data.results, total:res.data.count});
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       Object.keys(err.response.data).map((e) => {
    //         message.error(err.response.data[e]);
    //       });
    //     }
    //   });
    this.getSites()
  }

  getSites = (params = {}) => {
    this.setState({ loading: true });
    getOwnerSites({ account: this.props.match.params.id, ...params })
      .then((res) => {
        this.setState({
          sites: this.props.viewAll === false ? res.data.results.slice(0,10) : res.data.results,
          loading: false,
          total: res.data.count,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: this.props.viewAll === false ? 10 : res.data.count,
          },
        });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  onSearch = (e) => {
    this.getSites({ search: e.target.value, page: 1 });
  };
  handleChange = (pagination) => {
    this.getSites({page:pagination.current})
  }

  render() {
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          <div className="col-12 p-0">
            <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between  carpet-cleaning-mini-header">
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
              <div className="d-flex align-items-center grid-system-div">
                <ul className="mb-0 list-inline">
                  <li className="list-inline-item w-auto">
                    Total : {this.state.total}
                  </li>
                  <li className="list-inline-item w-auto">
                    <Button
                      className={`${this.state.view ? "active" : ""}`}
                      onClick={() => this.setState({ view: true })}
                    >
                      <img
                        src={Images.list_view_icon}
                        className="img-fluid img-gray"
                        alt="list view"
                      />
                      <img
                        src={Images.list_view_icon_active}
                        className="img-fluid img-active"
                        alt="list view"
                      />
                    </Button>
                  </li>
                  <li className="list-inline-item w-auto">
                    <Button
                      className={`${!this.state.view ? "active" : ""}`}
                      onClick={() => this.setState({ view: false })}
                    >
                      <img
                        src={Images.grid_view_icon}
                        className="img-fluid img-gray"
                        alt="grid view"
                      />
                      <img
                        src={Images.grid_view_icon_active}
                        className="img-fluid img-active"
                        alt="grid view"
                      />
                    </Button>
                  </li>
                </ul>
                {this.props.hideTitle && (
                  <Button
                    onClick={() => this.props.tabChange("3")}
                    className="view-all-btn text-uppercase ml-auto"
                  >
                    VIEW ALL{" "}
                  </Button>
                )}
                {!this.props.hideTitle && (
                  <Button
                    className="edit-btn-summary ml-auto"
                    onClick={() =>
                      history.push({
                        pathname: reverse(routes.dashboard.owner_account.edit, {
                          id: this.props.match.params.id,
                        }),
                        editTab: "4",
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
            {this.state.sites.length > 0 ? (
              !this.state.view ? (
                <div className="row summary-collapse-inner-row-main px-0">
                  <div className="col-12">
                    {this.state.sites.map((item) => (
                      <div
                          style={{
                            minHeight:'102px'
                          }}
                        key={item.id}
                        onClick={() =>
                          history.push(
                            reverse(routes.dashboard.owner_account.site_account.view, {
                              id: item.id,
                            })
                          )
                        }
                        className="row mx-0 site-details-row-card position-relative"
                      >
                        <div className="col-12 col-sm-3 bg-gray-main">
                          {/*<h6 className="text-uppercase">SITE NAME</h6>*/}
                          <div className="site-name-location">
                            <img
                              src={Images.location_black_icon}
                              alt=""
                              className="img-fluid"
                            />
                            <span>{item.name}</span>
                          </div>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">ADDRESS</h6>
                          <p className="mb-0">{`${item.apartment || ""} ${
                            item.street_address || ""
                          } ${item.city || ""} ${item.state || ""} ${
                            item.country || ""
                          } ${item.zip_code || ""}`}</p>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                          <p className="mb-0 text-elipsiss">{item.email || "-"}</p>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">PHONE NUMBER</h6>
                          <p className="mb-0">{formatPhone(item.phone)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="col-12 table-responsive main-table-div pt-3">
                  <Table
                    className="main-table-all"
                    columns={this.siteColumns}
                    dataSource={this.state.sites}
                    size="middle"
                    pagination={this.props.viewAll === false ? false : this.state.pagination}
                    onChange={this.handleChange}
                    onRow= {(record,rowIndex) => {
                      return {
                        onClick : (event) =>
                        history.push(
                          reverse(routes.dashboard.owner_account.site_account.view, {
                            id: record.id,
                          })
                        )
                      }
                    }}
                    // loading={loading}
                  />
                </div>
              )
            ) : (
              <div className="col-12">
                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div className="col-12 text-center">
                    <img
                      src={Images.location_gray}
                      alt=""
                      className="img-fluid"
                    />
                    <h6 className="mb-0 text-gray-tag">No Sites</h6>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Sites);
