import React, {Component} from "react";
import {Checkbox, Collapse, Select} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from "../../../Images";
import { FLEET_GROUP, formatPrice, LABOR, MANAGEMENT_TREE_TYPES, SUPPLY_GROUP, TYPES } from "../../../../Controller/utils";

const {Panel} = Collapse;

class InvoicingWorkorderTableCreate extends Component {
    state = {
        rows: [],
        newPricing:true
    }

    static getDerivedStateFromProps(props) {
        return { rows: [...props.child] };
      }

      renderRow = (item, kit_child, kitRow) => {
        const { invoiceVariant } = this.props;
        // const { fleetData, totalFleetCount, fetching, supplyData, totalSupplyCount} = this.state
        switch (item.type) {
          case FLEET_GROUP:
            // const fleetItem = this.props.workorderData?.fleet_assignee?.find(
            //   (i) => i.id === item.id
            // );
            // const fleetAssignee = {
            //   label: fleetItem?.name,
            //   value: fleetItem?.value,
            //   key: fleetItem?.value,
            // };
            return (
              <div className="custom-table-row custom-table-row-level-1 custom-table-proposal row mx-0">
                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                  <div>{MANAGEMENT_TREE_TYPES.FLEET_GROUP.name}</div>
                </div>
                <div className="custom-table-cell-td px-3">
                  <div>{item.name}</div>
                </div>
                <div className="custom-table-cell-td justify-content-start px-3">
                 {invoiceVariant?.fleet_assignee || "-"}
              </div>
      
                <div className="custom-table-cell-td justify-content-start px-3">
                  <div>-</div>
                </div>
                <div className="custom-table-cell-td">
                  <div>{item.qty || "1"}</div>
                </div>
                <div className="custom-table-cell-td px-3">
                 {item?.uom ? item.uom?.name : "Hours"}
                </div>
                <div className="custom-table-cell-td px-3">-
                  {/* {item.modified_quantity ? item.modified_quantity : (item.qty || 1)} */}
                </div>
                <div className="custom-table-cell-td">
                  <div className="px-3">-</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-8">
                      <div>-</div>
                    </div>
                    <div className="custom-table-cell-td custom-table-cell-td-8">
                      <div>${item.total_price}</div>
                    </div>
              </div>
            );
          case SUPPLY_GROUP:
            // const supplyItem = this.props.workorderData?.supply_assignee?.find(
            //   (i) => i.id === item.id
            // );
            // const supplyAssignee = {
            //   label: supplyItem?.name,
            //   value: supplyItem?.value,
            //   key: supplyItem?.value,
            // };
            return (
              <div className="custom-table-row custom-table-row-level-1 row mx-0">
                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                  <div>{MANAGEMENT_TREE_TYPES.SUPPLY_GROUP.name}</div>
                </div>
                <div className="custom-table-cell-td px-3">
                  <div>{item.name}</div>
                </div>
                
                   <div className="custom-table-cell-td justify-content-start px-3">
                   {invoiceVariant?.supply_assignee || "-"}
                 </div>
                <div className="custom-table-cell-td justify-content-start px-3">
                  <div>-</div>
                </div>
                <div className="custom-table-cell-td">
                  <div>{item.qty || 1}</div>
                </div>
                <div className="custom-table-cell-td">
                  <div>{item?.uom ? item.uom?.name : "Hours"}</div>
                </div>
                <div className="custom-table-cell-td px-3">
                {item.qty || 1}
                </div>
                <div className="custom-table-cell-td px-3">
                  <div className="">-</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-8">
                      <div>-</div>
                    </div>
                <div className="custom-table-cell-td">${item?.total_price}</div>
              </div>
            );
          case "INVENTORY_ITEM":
            return (
              <div className="custom-table-row custom-table-row-level-1 row mx-0">
                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                  <div>Inventory Item</div>
                </div>
                <div
                  className={
                    `custom-table-cell-td` +
                    (!kitRow ? " last-child " : "")
                  }
                >
                  <div className="name-info-div p-0 position-relative">
                    {kit_child && (
                      <span className="rectangle-icon-div position-absolute">
                        <img
                          src={Images.rectangle_gray_icon}
                          alt=""
                          className={"img-fluid"}
                        />
                      </span>
                    )}
                    <span style={kit_child && { paddingLeft: "30px" }}>
                      {item?.kit_child ? item?.item?.name : item.name || "-"}
                    </span>
                  </div>
                </div>
                <div className="custom-table-cell-td">
                  <div className="editalble-form-data d-flex align-items-center justify-content-center">
                    <span className="px-3">-</span>
                  </div>
                </div>
                <div className="custom-table-cell-td px-0">
                  <div className="editalble-form-data editalble-form-data-select d-flex align-items-center px-3"></div>
                </div>
    
                <div className="custom-table-cell-td">
                  {item.qty || 1}
                  <div />
                </div>
                <div className="custom-table-cell-td">
                {item.uom?.name || "-"}
                  <div />
                </div>
                <div className="custom-table-cell-td px-3">
                -
                </div>
                <div className="custom-table-cell-td px-3">
                  <span>-</span>
                </div>
                <div className="custom-table-cell-td">-</div>
                <div className="custom-table-cell-td px-3">-</div>
              </div>
            );
          case "INVENTORY_KIT":
            return (
              <>
                <div className="custom-table-row custom-table-row-level-1 row mx-0">
                  <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                    <div>{TYPES.inventory_kit.title}</div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div>{item.name}</div>
                  </div>
                  <div className="custom-table-cell-td">
                    <div className="editalble-form-data d-flex align-items-center justify-content-center">
                      <span className="px-3">-</span>
                    </div>
                  </div>
                  <div className="custom-table-cell-td">
                    <div>-</div>
                  </div>
                  <div className="custom-table-cell-td">
                    <div>{item.qty || 1}</div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div>{item?.uom.name || "-"}</div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                  -
                  </div>
                  <div className="custom-table-cell-td">
                    <span> pieces (pc)</span>
                  </div>
                  <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div>-</div>
                      </div>
                  <div className="custom-table-cell-td">-</div>
                </div>
                {item.children.length > 0 &&
                  item.children.map((n, ind) => {
                    let kitRow = item.children.length > ind + 1;
                    return this.renderRow(n, true, kitRow);
                  })}
                {item.data?.inventory_package_items?.map((p) => (
                  <div
                    key={p.id}
                    className="custom-table-row custom-table-row-level-1 row mx-0"
                  >
                    <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                      <div>Inventory Group</div>
                    </div>
                    <div className="custom-table-cell-td">
                      <div className="name-info-div position-relative">
                        <span className="rectangle-icon-div position-absolute">
                          <img
                            src={Images.rectangle_gray_icon}
                            alt=""
                            className={"img-fluid"}
                          />
                        </span>
                        <span>{p.item.name}</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td">
                      <div>-</div>
                    </div>
                    <div className="custom-table-cell-td">
                      <div className="editalble-form-data d-flex align-items-center justify-content-center">
                        <span className="px-3">-</span>
                      </div>
                    </div>
                    <div className="custom-table-cell-td">
                      <div></div>
                    </div>
                    <div className="custom-table-cell-td">
                      <div>{p.quantity}</div>
                    </div>
                    <div className="custom-table-cell-td">
                      <span>pieces (pc)</span>
                    </div>
                  </div>
                ))}
              </>
            );
            case "FLEET_KIT":
            return (
              <>
                <div className="custom-table-row custom-table-row-level-1 row mx-0">
                  <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                    <div>{TYPES.fleet_kit.title}</div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div>{item.name}</div>
                  </div>
                  <div className="custom-table-cell-td">
                    <div className="editalble-form-data d-flex align-items-center justify-content-center">
                      <span className="px-3">-</span>
                    </div>
                  </div>
                  <div className="custom-table-cell-td">
                    <div>-</div>
                  </div>
                  <div className="custom-table-cell-td">
                    <div />
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div />
                  </div>
                  <div className="custom-table-cell-td px-3">
                  {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                  </div>
                  <div className="custom-table-cell-td">
                    <span> pieces (pc)</span>
                  </div>
                  <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div>-</div>
                      </div>
                  <div className="custom-table-cell-td"> -</div>
                </div>
                {item?.children?.length > 0 &&
                  item.children.map((n, ind) => {
                    let kitRow = item?.children?.length > ind + 1;
                    return this.handleFleetKit(n, true, kitRow,item.id);
                  })}
                  </>
            )
          case "DISPOSAL":
            return (
              <>
                <div className="custom-table-row custom-table-row-level-1 row mx-0">
                  <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                    <div>Disposal</div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div className="name-info-div p-0 position-relative">
                      <span>{item.name}</span>
                    </div>
                  </div>
                  <div className="custom-table-cell-td">
                    <div className="editalble-form-data d-flex align-items-center justify-content-center">
                      <span className="px-3">-</span>
                    </div>
                  </div>
                  <div className="custom-table-cell-td px-0">
                    <div className="editalble-form-data d-flex align-items-center justify-content-center">
                      {item?.facility_type === "VENDOR" ? item?.facility_id?.vendor?.name : item?.facility_type === "WAREHOUSE" ? item?.facility_id?.internal_location.name : "-"}
                    </div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div>{item.qty || 1}</div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div>{item.uom ? item.uom?.name : "Hours" }</div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div>-</div>
                  </div>
                  <div className="custom-table-cell-td">
                    <span>-</span>
                    <div />
                  </div>
                  <div className="custom-table-cell-td">-</div>
                  <div className="custom-table-cell-td">${item?.total_price}</div>
                </div>
              </>
            );
          case LABOR:
            // const foundItem = this.props.workorderData?.labor_assignee?.find(
            //   (i) => i.id === item.id
            // );
            // const selectedAssignee = {
            //   label: foundItem?.name,
            //   value: foundItem?.value,
            //   key: foundItem?.value,
            // };
    
            // const {totalCount, employees, page} = this.state;
    
            return (
              <>
                <div className="custom-table-row custom-table-row-level-1 row mx-0">
                  <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                    <div>Labor</div>
                  </div>
                  <div className="custom-table-cell-td gray-2-color px-3">
                    <div>{item.name}</div>
                  </div>
                  <div className="custom-table-cell-td justify-content-start">
                 {invoiceVariant?.labor_assignee || "-"}
                </div>
                  <div className="custom-table-cell-td justify-content-start">
                    <div className="px-3">-</div>
                  </div>
                  <div className="custom-table-cell-td">
                    <div className="editalble-form-data d-flex align-items-center justify-content-center">
                      {/*<span className="px-3">8</span>*/}
                      {item.qty || 1}
                    </div>
                  </div>
                  <div className="custom-table-cell-td px-3">
                    <div>{item.uom ? item.uom?.name : "Hours" }</div>
                  </div>
                  <div className="custom-table-cell-td px-3"> -
                  {/* {item.modified_quantity ? item.modified_quantity : (item.qty || 1)} */}
                    <div></div>
                  </div>
                  <div className="custom-table-cell-td">
                    <span>-</span>
                    <div />
                  </div>
                  <div className="custom-table-cell-td">-</div>
                  <div className="custom-table-cell-td">${item.total_price}</div>
                </div>
              </>
            );
          default:
            return <></>;
        }
      };
    
    render() {
        const { foundRegion, invoiceVariant } = this.props;
        return (<React.Fragment>
                <div className="col-12 custom-table-body p-0">
                    <Collapse
                        expandIcon={({isActive}) => (<CaretRightOutlined rotate={isActive ? 90 : 0}/>)}
                        className="custom-table-collapse-main"
                    >
                        
                        <Panel
                            header={<React.Fragment>
                                <div
                                    className="custom-table-row custom-collapse-line-item custom-table-row-level-1 line-item-grid row mx-0">
                                    <div
                                        className="custom-table-cell-td wage-info-collapse-td gray-2-color d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <img
                                                alt={""}
                                                src={invoiceVariant?.resource_type === "INVENTORY_KIT" ? Images.inventory_kit_variant : invoiceVariant?.resource_type === "INVENTORY_ITEM" ? Images.inventory_item_variant : Images.line_item_black}
                                                className="img-fluid mr-2"
                                            />
                                           {invoiceVariant?.resource_type === "INVENTORY_KIT" || invoiceVariant?.resource_type === "INVENTORY_ITEM"
                                           ? invoiceVariant?.resource_id?.name 
                                          //  : `${invoiceVariant?.variant_data?.line_item?.name} ${foundRegion && '/'} ${foundRegion?.title || ""} - ${invoiceVariant?.variant_data?.display_name}`
                                          : invoiceVariant?.variant_data?.display_name || "-"
                                           }
                                        </div>
                                        {/* {!removeThreeDots && <Dropdown overlay={this.menu} trigger={['click']}>
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <img alt="remove-icon"
                                                 src={Images.black_dots_elipsis}
                                                 className="img-fluid"
                                            />
                                        </a>
                                    </Dropdown>}  */}
                                    </div>
                                    <div className="custom-table-cell-td px-3 text-left">-</div>
                                    <div className="custom-table-cell-td p-0"></div>
                                    <div className="custom-table-cell-td p-0 gray-2-color">{invoiceVariant?.workorder_qty || 1}</div>
                                    <div className="custom-table-cell-td p-0">
                                      {/* <span className="d-inline-block w-100">{invoiceVariant?.price_per_unit || "-"}</span> */}
                                    </div>
                                    <div className="custom-table-cell-td gray-2-color pl-0">
                                    <span className="d-inline-block w-100">{`$${invoiceVariant?.price_per_unit}` || "-"}</span>
                                    </div>
                                    <div className="custom-table-cell-td gray-2-color pl-0"></div>
                                    <div className="custom-table-cell-td gray-2-color px-3">
                                        <div className="d-inline-block w-100">-</div>
                                    </div>
                                    <div className="custom-table-cell-td gray-2-color px-3">
                                        <div className="d-inline-block w-100">{`$${invoiceVariant?.total_price}` || "-"}</div>
                                    </div>
                                </div>
                            </React.Fragment>}
                            key="1"
                        >
                             {this.state.rows.map((r, i) => {
                            let obj = {};
                            if (r.kit) {
                                let kitRow = this.state.rows.length > i + 1;
                                obj = {
                                    id: r.id,
                                    item: r.item,
                                    qty: r.quantity,
                                    kit_uom: r.kit?.unit,
                                    type: 'INVENTORY_ITEM',
                                    kit_child: true
                                }
                                return this.renderRow(obj, true, kitRow);
                            } else {
                                return this.renderRow(r);
                            }
                        })}
                            {/* <div className="custom-table-row custom-table-row-level-1 row mx-0">
                                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                                    <div>Labor</div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-2 gray-2-color">
                                    <div>Operator</div>
                                </div>

                                <div className="custom-table-cell-td custom-table-cell-td-3">
                                    <div className="px-3">John Doe</div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-4">
                                    -
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start">
                                    <span className="px-3">-</span>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-6">
                                    <div>-</div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-7">
                                    <div>-</div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-8">
                                    <div>-</div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-9">
                                    <div>-</div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-8">
                                    <div>-</div>
                                </div>
                            </div> */}
                        </Panel>
                    </Collapse>
                </div>
               
                        {/* {this.state.rows.map((r, i) => {
                            let obj = {};
                            if (r.kit) {
                                let kitRow = this.state.rows.length > i + 1;
                                obj = {
                                    id: r.id,
                                    item: r.item,
                                    qty: r.quantity,
                                    kit_uom: r.kit?.unit,
                                    type: 'INVENTORY_ITEM',
                                    kit_child: true
                                }
                                return this.renderRow(obj, true, kitRow);
                            } else {
                                return this.renderRow(r);
                            }
                        })} */}
            </React.Fragment>)
    }
}

export default InvoicingWorkorderTableCreate;