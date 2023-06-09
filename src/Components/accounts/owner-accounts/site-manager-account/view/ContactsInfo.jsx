import React, { Component } from "react";
import { Button, Form, Input, message, Radio, Spin, Table } from "antd";
import { Image as Images } from "../../../../Images";
import { getContact } from "../../../../../Controller/api/contactsServices";
import { withRouter } from "react-router-dom";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../Controller/Routes";
import moment from "moment";


class ContactsInfo extends Component {
  state = {
    pagination: {
      current: 1,
      pageSize: 15,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    },
    data: [],
    page: 1,
    view: false,
    total: null
  };

  contactColumns = [
    {
      title: "CONTACT NAME",
      dataIndex: "full_name",
      sorter: true,
    },
    {
      title: "LAST ACTIVITY DATE",
      dataIndex: "modified",
      sorter: true,
      render: (modified) => (
        <div>{moment(modified).format("MMM DD,YYYY hh:mm A")}</div>
      ),
    },
  ];

  componentDidMount() {
    // getContact({ account: this.props.match.params.id })
    //   .then((response) => {
    //     this.setState({data: this.props.viewAll === false ? response.data.results.slice(0,10) : response.data.results, total: response.data.count});
    //   })
    //   .catch((err) => {
    //     if (err.response) {
    //       Object.keys(err.response.data).map((e) => {
    //         message.error(err.response.data[e]);
    //       });
    //     }
    //   });
    this.fetchContact()
  }

  handleChange = (pagination) => {
    this.fetchContact({ page: pagination.current })

  }

  Pagination = () => {
    this.setState(
      (prevState) => {
        return { page: prevState.page + 1 };
      },
      () => {
        this.fetchContactonLoadmore();
      }
    );
  };

  fetchContactonLoadmore = () => {
    this.setState({ loading: true });
    getContact({ account: this.props.match.params.id, page: this.state.page })
      .then((response) => {
        this.setState({
          data: [...this.state.data, ...response.data.results], loading: false,
        });
      })
  }

  fetchContact = (params = {}) => {
    this.setState({ loading: true });
    getContact({ account: this.props.match.params.id, ...params, page: this.state.page })
      .then((response) => {
        this.setState({
          data: !this.props.viewAll ? response.data.results.slice(0, 10) : response.data.results, loading: false,
          total: response.data.count,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: this.props.viewAll === false ? 10 : response.data.count,
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
    this.fetchContact({ search: e.target.value, page: 1 });
  };

  render() {
    let { data } = this.state;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${!this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
            }`}
        >
          <div className="col-12 p-0 service-family-table">
            <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
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
                    onClick={() => this.props.tabChange("4")}
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
                        editTab: "5",
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
            {data.length > 0 ? (
              !this.state.view ? (
                <div className="row summary-collapse-inner-row-main px-0">
                  {data.map((item) => (
                    <div
                      className="col-12 col-sm-6"
                      onClick={() =>
                        history.push(
                          reverse(routes.dashboard.contacts.view, {
                            id: item.id,
                          })
                        )
                      }
                    >
                      <div
                        style={{ height: "100px", minHeight: "100px" }}
                        className="row mx-0 align-items-center user-info-div-main position-relative opportunity-info-div-main"
                      >
                        <div className="col-12">
                          <div className="user-icons-div">
                            <img
                              src={Images.contact_file_icon_black}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="user-info-div">
                            <h6>{`${item.first_name} ${item.last_name}`}</h6>
                            <p className="mb-0">{item?.role} {item?.account.name}</p><br />
                            <p className="mb-0">{item?.default_phone && item?.default_email ? `${item?.default_phone?.phone_number || " "} | ${item?.default_email?.email || " "}` : item?.default_phone ? (item?.default_phone?.phone_number || " ") : (item?.default_email?.email || " ") || " "}</p>
                          </div>
                        </div>
                        {/*<div className="col-12 p-0 radio-btn-custom">*/}
                        {/*    <Radio className="active">Default Email</Radio>*/}
                        {/*</div>*/}
                      </div>
                    </div>
                  ))}
                   <div className="row">
                     <div className="col-12 text-center create-div">
                      {this.state.loading && (
                        <Spin />
                      )
                      }
                    {
                      this.props.viewAll === true && !this.state.loading && (data.length != this.state.total) &&
                          <Button onClick={this.Pagination}>Load More</Button>
                    }
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-12 table-responsive opportunity-db-table contact-info-table main-table-div pt-3">
                  <Table
                    className="main-table-all"
                    columns={this.contactColumns}
                    dataSource={data}
                    size="middle"
                    pagination={this.props.viewAll === false ? false : this.state.pagination}
                    onChange={this.handleChange}
                    onRow= {(record,rowIndex) => {
                      return {
                        onClick : (event) =>
                          history.push(
                            reverse(routes.dashboard.contacts.view, {
                              id: record.id,
                            })
                          )
                      }
                    }}
                  //  loading={loading}
                  />

                </div>
              )
            ) : (
              <div className="col-12">
                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div className="col-12 text-center">
                    <img
                      src={Images.contacts_empty_state_icon}
                      alt=""
                      className="img-fluid"
                    />
                    <h6 className="mb-0 text-gray-tag">No Contacts</h6>
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

export default withRouter(ContactsInfo);
