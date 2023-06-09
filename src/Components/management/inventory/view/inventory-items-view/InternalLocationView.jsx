import React, { Component } from "react";
import { Button, Collapse, Form, Input, InputNumber, Menu, Select } from "antd";
import { Image as Images } from "../../../../Images";
import { handleError } from "../../../../../Controller/Global";
import { getInventoryLocationById } from "../../../../../Controller/api/inventoryServices";
import { withRouter } from "react-router-dom";
import { reverse } from 'named-urls';
import { history } from '../../../../../Controller/history';
import { routes } from '../../../../../Controller/Routes';

const { Option, OptGroup } = Select;
const { Panel } = Collapse;

class InternalLocationView extends Component {
  state = {
    newSites: [],
    uom: null,
  };
  // columns = [
  //     {
  //         title: <div>Min QTY<br/>(UOM)</div>,
  //         dataIndex: 'min_qty',
  //         key: 'min_qty',
  //         sorter: true,
  //         render: () => <div className="position-relative">
  //             <InputNumber placeholder={1}/>
  //             <span className="position-absolute add-uom-details">{this.state?.selectOption.children[2]}</span>
  //         </div>,
  //     },
  //     {
  //         title: <div>Max QTY<br/>(UOM)</div>,
  //         dataIndex: 'max_qty',
  //         key: 'max_qty',
  //         sorter: true,
  //         render: () => <div className="position-relative">
  //             <InputNumber placeholder={10}/>
  //             <span className="position-absolute add-uom-details">{this.state?.selectOption.children[2]}</span>
  //         </div>,
  //     },
  //     {
  //         title: <div>QTY<br/>(UOM)</div>,
  //         dataIndex: 'qty',
  //         key: 'qty',
  //         sorter: true,
  //         render: () => <div className="position-relative">
  //             <InputNumber placeholder={5}/>
  //             <span className="position-absolute add-uom-details">{this.state?.selectOption.children[2]}</span>
  //         </div>,
  //     },
  // ];
  // data = [
  //     {
  //         key: 1,
  //         min_qty: '',
  //         max_qty: '',
  //         qty: '',
  //     },
  // ];

  componentDidMount() {
    getInventoryLocationById({ inventory_item: this.props.match.params.id })
      .then((res) => {
        this.setState({
          newSites: res.data.results[0]?.location,
          uom: res.data.results[0]?.uom,
        });
      })
      .catch((err) => {
        handleError(err);
      });
  }

  menu = () => (
    <Menu>
      <Menu.Item key="0">
        <Button className="border-0 p-0 shadow-none bg-transparent">
          Remove
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button className="border-0 p-0 shadow-none bg-transparent">
          Edit
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleChange = (value, option) => {
    this.setState({ selectValue: value, selectOption: option });
  };

  render() {
    const { inventory } = this.props;
    const { uom } = this.state;
    return (
      <React.Fragment>
        <div className="col-12">
          <div
            className={`row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
              this.props.editBtn ? "design-update-bar" : ""
            }`}
          >
            <div className="search-bar-div d-flex align-items-center">
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
            <ul className="mb-0 d-flex align-items-center list-inline">
              {/*<li className="list-inline-item">*/}
              {/*    <Select*/}
              {/*        dropdownClassName={'custom-uom-dropdown'}*/}
              {/*        placeholder="Unit of Measurement: pieces (pc)"*/}
              {/*        suffixIcon={*/}
              {/*            <img src={Images.arrow_small_gray_icon} alt={""} className="img-fluid"/>*/}
              {/*        }*/}
              {/*        className="unit-measurement-select"*/}
              {/*        onChange={this.handleChange}*/}
              {/*        value={this.state?.selectValue}*/}
              {/*    >*/}
              {/*        <OptGroup label="Universal UOM">*/}
              {/*            {inventory?.uom_array?.map(i => {*/}
              {/*                return (*/}
              {/*                    <Option value={i.id} key={i.id}><span className="check-icon-mark">*/}
              {/*                <img src={Images.check_icon_green} alt="" className="img-fluid"/>*/}
              {/*            </span> {i.name} ({i.symbol})</Option>*/}
              {/*                )*/}
              {/*            })}*/}
              {/*        </OptGroup>*/}
              {/*        /!* <OptGroup label="Custom UOM">*/}
              {/*            {inventory?.com?.map((i, idx) => {*/}
              {/*                return (*/}
              {/*                    <Option value={i.id} key={i + idx}> <span className="check-icon-mark">*/}
              {/*                    <img src={Images.check_icon_green} alt="" className="img-fluid"/>*/}
              {/*                    </span>{i.name}</Option>*/}
              {/*                )*/}
              {/*            })}*/}
              {/*        </OptGroup> *!/*/}
              {/*    </Select>*/}
              {/*</li>*/}
              <li className="list-inline-item">
                {this.props.editBtn ? (
                  <Button className="edit-btn-summary"
                  onClick={() =>
                    history.push({
                      pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                        { id: this.props.match.params.id }
                      ),
                      editTab: "5"
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
                ) : (
                  <Button
                    className="view-all-btn text-uppercase"
                    onClick={() => this.props.tabChange("3")}
                  >
                    VIEW ALL{" "}
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="col-12 my-3">
          <div className="row mx-0 mb-3">
            <div className="col-12 summary-collapse-inner-row-main pt-0">
              <div className="row">
                <div
                  style={{ borderBottom: "1px solid #e0e0e0" }}
                  className="col-12 pb-3"
                >
                  <h6>Unit Of Measurement</h6>
                  <h5>{uom ? `${uom.name} (${uom.symbol})` : "-"} </h5>
                </div>
              </div>
            </div>
          </div>
          {/*<Collapse*/}
          {/*    className={`inner-collapse-section ${this.props.editBtn ? "border-add" : ""}`}*/}
          {/*    accordion*/}
          {/*    defaultActiveKey={['1']}*/}
          {/*    expandIcon={({isActive}) => <CaretRightOutlined*/}
          {/*        rotate={isActive ? 90 : 0}/>}*/}

          {/*>*/}
          {this.state.newSites?.length > 0 ? (
            this.state.newSites?.map((i) => {
              return (
                // <Panel header={
                // } key={i.id}>
                //     <div className="row mx-0 contact-green-small-heading position-relative">
                //         <h5 className="mb-0 bg-gray-main">QTY</h5>
                //     </div>
                <div className="row mx-0 margin-btn-30">
                  <div className="col-12">
                    <div className="row m-0  site-details-row-card site-details-row-card-2  position-relative">
                      <div className="col-12 col-sm-3">
                        <div className="site-name-location">
                          <img
                            src={Images.location_black_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <span>{i?.internal_location?.name}</span>
                        </div>
                      </div>
                      <div className="col-12 col-sm-9 pb-0">
                        <div className="row">
                          <div className="col-12 col-sm-4">
                            <h6 className="text-uppercase">ADDRESS</h6>
                            <p className="mb-0">{`${i.internal_location?.street_address} ${i.internal_location?.name} ${i.internal_location?.city} ${i.internal_location?.state} ${i.internal_location?.country}`}</p>
                          </div>
                          <div className="col-12 col-sm-4">
                            <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                            <p className="mb-0">
                              {i?.internal_location?.email}
                            </p>
                          </div>
                          <div className="col-12 col-sm-4">
                            <h6 className="text-uppercase">PHONE NUMBER</h6>
                            <p className="mb-0">
                              {i?.internal_location?.phone}
                            </p>
                          </div>
                          <div className="col-12 Quantities-details-div">
                            <h6 className="text-uppercase">Quantities</h6>
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item">
                                Min QTY (Reorder Point):
                              </li>
                              <li className="list-inline-item">
                                {i.min_qty || 0}{" "}
                                {this.state?.selectOption?.children[4]}{" "}
                                {uom?.symbol}
                              </li>
                            </ul>
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item">
                                Max QTY (Single Restock QTY):
                              </li>
                              <li className="list-inline-item">
                                {i.max_qty || 0}{" "}
                                {this.state?.selectOption?.children[4]}{" "}
                                {uom?.symbol}
                              </li>
                            </ul>
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item">Current QTY:</li>
                              <li className="list-inline-item font-weight-bold">
                                {i.qty || 0}{" "}
                                {this.state?.selectOption?.children[4]}{" "}
                                {uom?.symbol}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {/* <Dropdown overlayClassName="add-remove-dropdown-main" overlay={this.menu}
                                                      trigger={['click']}>
                                                <Button
                                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                    onClick={e => e.preventDefault()}>
                                                    <img src={Images.more_black} alt="" className="img-fluid"/>
                                                </Button>
                                            </Dropdown> */}
                    </div>
                  </div>
                  {/*<div className="col-12 p-0 table-responsive custom-internal-location">*/}
                  {/*    <div className="row mx-0 custom-table-thead">*/}
                  {/*        <div className="custom-th-main">*/}
                  {/*            <div>Min QTY<br/>(UOM)</div>*/}
                  {/*        </div>*/}
                  {/*        <div className="custom-th-main">*/}
                  {/*            <div>Max QTY<br/>(UOM)</div>*/}
                  {/*        </div>*/}
                  {/*        <div className="custom-th-main">*/}
                  {/*            <div>QTY<br/>(UOM)</div>*/}
                  {/*        </div>*/}
                  {/*    </div>*/}
                  {/*    <div className="row mx-0 custom-table-tbody">*/}
                  {/*        <div className="custom-td position-relative">*/}
                  {/*            <InputNumber placeholder='' disabled defaultValue={i.min_qty || 0}/>*/}
                  {/*            <span*/}
                  {/*                className="position-absolute add-uom-details">{this.state?.selectOption?.children[4]}</span>*/}
                  {/*        </div>*/}
                  {/*        <div className="custom-td position-relative">*/}
                  {/*            <InputNumber placeholder='' disabled defaultValue={i.max_qty || 0}/>*/}
                  {/*            <span*/}
                  {/*                className="position-absolute add-uom-details">{this.state?.selectOption?.children[4]}</span>*/}
                  {/*        </div>*/}
                  {/*        <div className="custom-td position-relative">*/}
                  {/*            <InputNumber placeholder='' disabled defaultValue={i.qty || 0}/>*/}
                  {/*            <span*/}
                  {/*                className="position-absolute add-uom-details">{this.state?.selectOption?.children[4]}</span>*/}
                  {/*        </div>*/}
                  {/*    </div>*/}
                  {/*    /!* <InputNumber value={item.qty} onChange={value => this.handleEmailListChange(value, item, index)}>*/}
                  {/*                                            </InputNumber>  *!/*/}
                  {/*</div>*/}
                </div>
                // <div className="row mx-0 my-3 location-row-main-3 contact-green-small-heading position-relative">
                //         <h5 className="mb-0 bg-gray-main">Unit Cost</h5>
                //     </div>
                //     <div className="row view-cost-input">
                //         <div className="col-12 col-sm-4">
                //             {/*<label className="mt-3" style={{fontWeight: '500'}}>Unit Cost</label>*/}
                //             <div className="row">
                //                 <div className="col-12">
                //                     <InputNumber placeholder='' disabled
                //                                  defaultValue={i.unit_cost || 0}/>
                //                     <small style={{top: '13px',right: '30px'}}
                //                            className="position-absolute unit-cost-name">
                //                         {this.state?.selectOption?.children[4]}
                //                     </small>
                //             </div>
                //         </div>
                //     </div>
                //     </div>
                // </Panel>
              );
            })
          ) : (
            <div className="col-12">
              <div className="row mx-0 common-card-upload">
                <div className="col-12 text-center">
                  <img
                    src={Images.location_gray}
                    alt={""}
                    className="img-fluid"
                  />
                  <h6 className="mb-0">No Warehouse</h6>
                </div>
              </div>
            </div>
          )}
          {/*</Collapse>*/}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(InternalLocationView);
