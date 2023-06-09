import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Select,
  Spin,
  message,
  Radio,
  Breadcrumb,
  Divider,
  Space,
} from "antd";
import { Image as Images } from "../../../../Images";

import { withRouter } from "react-router-dom";
import {
  deleteFleetGroup,
  deleteFleetKit,
  getFleetGroup,
  updateFleetKit,
} from "../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../Controller/Global";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class createFleetGroup extends Component {
  state = {
    fetching: false,
    fleetGroup: null,
    fleetGroupOptions: [],
    page: 1,
    search: "",
    totalCount: ""
  };
  formRef = React.createRef();

  menu = (item,id)=> (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.handleRemove(item,id)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  static getDerivedStateFromProps(props) {
    return {fleetGroup: props.fleetKit}
  }
  
  handleRemove = (data,id) => {
    const params = {
      remove_fleet: id
    }
    updateFleetKit(data.id,params).then(res => {
      this.props.handleFleetKit(res.data)

    })

  }
  fetchFleetKit = (params={}) => {
    const { page, fetching } = this.state;
    this.setState({fetching: true})
    getFleetGroup({...params,page})
      .then((res) => {
        this.setState({totalCount: res.data.count})
        if(page == 1) {
          this.setState({ fleetGroupOptions: res.data.results });
        } else {
          this.setState(prevState => {
            return { fleetGroupOptions: [...prevState.fleetGroupOptions, ...res.data.results]};
          })
        }
      })
      .catch((err) => {
        handleError(err);
      }).finally(() => {
        this.setState({fetching: false})
      })
  };

  handlePagination = () => {
    this.setState((prevState) => {
      return { page: prevState.page + 1}
    },() => {
      this.fetchFleetKit()
    })
  }


  handleSelect = (val) => {
    const params = {
      fleet_group_id: val,
    };
    this.formRef.current.setFieldsValue({
      fleetgroup: "",
    });
    updateFleetKit(this.props.fleetKit?.id, params)
      .then((res) => {
        this.props.handleFleetKit(res.data)
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleContinue = () => {
      if(this.props.fleetKit) {
          message.success("Fleet Group updated successfully");
      } else {
          message.success("Fleet Group created successfully");
      }
  }

  render() {
    const {
      fetching,
      fleetKit,
      fleetGroupOptions,
      totalCount
    } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              hideRequiredMark={true}
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <div className="row mx-0 info-gray-div align-items-center">
                        <h6 className="mb-0">
                          Please add all the fleet groups belong to this kit.
                        </h6>
                      </div>
                    </div>

                    <div className="col-12">
                      <Form.Item
                        name="fleetgroup"
                        label={"Fleet Group "}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                        className="position-relative remove-cross-icon"
                      >
                        <Select
                          // mode="multiple"
                          placeholder="Search"
                          // notFoundContent={
                          //   fetching ? <Spin size="small" /> : null
                          // }
                          filterOption={false}
                          onFocus={() => {
                            this.setState({page: 1},() =>{
                              this.fetchFleetKit()
                            })       
                          }}
                          // onSearch={this.debounceEvent((e) => this.fetchContacts({search: e}),1000)}
                          onSelect={this.handleSelect}
                          onSearch={(e) => this.fetchFleetKit({search: e})}
                          showSearch={true}
                          // onDeselect={this.handleRemovefromSelect}
                          className="custom-search-select"
                          dropdownClassName={
                            "custom-search-select option-design-fix"
                          }
                          dropdownRender={(options) => (
                            <>
                              {options}
                              <Divider style={{ margin: '0 0 10px' }} />
                              <Space align="center" className="d-flex align-items-center justify-content-center" style={{ padding: '0 8px 4px' }}>
                                <div className="row">
                                  <div className="col-12 text-center create-div">
                                    {fetching ? (
                                      <Spin />
                                    ) : (
                                      fleetGroupOptions.length !== totalCount && (
                                        <div className="d-flex align-items-center justify-content-center">
                                          <Button className="load-more-btn w-auto bg-transprent" onClick={(e) => {
                                            this.handlePagination();
                                            e.stopPropagation();
                                          }}>
                                            Load More
                                          </Button>
                                          {/* <span className="remaining-tag">{`(${(totalCount - lineItems.length)})` || 0}</span> */}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </Space>
                            </>
                          )}
                        >
                          {fleetGroupOptions.map((item, i) => {
                            return (
                              <Option label={item.name} value={item.id}>
                                <div className="row mx-0 vc-tr-select-option-row align-items-start border-0">
                                  <div
                                    style={{ width: "38px" }}
                                    className="vc-select-option-img float-left"
                                  >
                                    <img
                                      src={Images.fleet_group}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div
                                    style={{ width: "calc(100% - 38px)" }}
                                    className="vc-select-option-data float-left"
                                  >
                                    <div
                                      className="row"
                                      style={{ width: "87%", float: "left" }}
                                    >
                                      <div className="col-12">
                                        <h6 className="mb-0">{item.name}</h6>
                                      </div>
                                      {item.breadcrumb && (
                                        <div className="col-12">
                                          <Breadcrumb
                                            separator={
                                              <img
                                                src={
                                                  Images.arrow_right_search_select_small
                                                }
                                                alt=""
                                                className="img-fluid"
                                              />
                                            }
                                          >
                                            {item.breadcrumb.map((b) => (
                                              <Breadcrumb.Item>
                                                {b}
                                              </Breadcrumb.Item>
                                            ))}
                                          </Breadcrumb>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-green-tag select-text-tier">
                                      Fleet Group
                                    </div>
                                  </div>
                                </div>
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                        <img
                          src={Images.search_small_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </Button>
                    </div>
                    {this.state.fleetGroup ? (
                      <div className="col-12 fleet-kit-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>TYPE</th>
                              <th>Name / Info</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Fleet Kit</td>
                              <td>
                                {/* Vac Truck Kit */}
                                {this.state.fleetGroup.name}
                                {/* <Dropdown
                                  className="custoom-dropdown"
                                  overlay={" "}
                                  trigger={["click"]}
                                >
                                  <a onClick={(e) => e.preventDefault()}>
                                    <img
                                      src={Images.black_dots_elipsis}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </a>
                                </Dropdown> */}
                              </td>
                            </tr>
                            {this.state.fleetGroup?.fleet_group.map((i) => {
                              return (
                                <tr>
                                  <td>Fleet Group </td>
                                  <td className="position-relative">
                                    <span className='rectangle-icon-div rectangle-icon-update position-absolute'>
                                        <img src={Images.rectangle_gray_icon} alt={''} className='img-fluid'/>
                                    </span>
                                    {/* Vac Truck 3800 */}
                                    <div className="branch-tree-div">
                                    {i.name}
                                    </div>
                                    <Dropdown
                                      className="custoom-dropdown"
                                      overlay={this.menu(this.state.fleetGroup,i.id)}
                                      trigger={["click"]}  
                                    >
                                      <a onClick={(e) => e.preventDefault()}>
                                        <img
                                          src={Images.black_dots_elipsis}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      </a>
                                    </Dropdown>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="col-12 mt-3">
                        <div className="row no-data-card-row align-items-center justify-content-center">
                          <img
                            src={Images.truck_empty}
                            alt={""}
                            className="img-fluid"
                          />
                          <h6 className="mb-0">No Fleet Group</h6>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button htmlType="submit" className="validate-btn-main" onClick={this.handleContinue}>
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(createFleetGroup);
