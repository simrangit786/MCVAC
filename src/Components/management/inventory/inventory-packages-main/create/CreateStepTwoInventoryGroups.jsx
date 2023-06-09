import React, { Component } from "react";
import { Breadcrumb, Button, Collapse, Dropdown, Menu } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../../Images";
import CreateInventoryGroupCost from "./inventory-group-create-inn/CreateInventoryGroupCost";
import { handleError } from "../../../../../Controller/Global";
import { getInventoryPackageById } from "../../../../../Controller/api/inventoryServices";
import CreateInventoryPackage from "./CreateInventoryPackage";

const { Panel } = Collapse;

function callback(key) {
  // console.log(key);
}

class CreateStepTwoInventoryGroups extends Component {
  state = {
    lastChild: [],
  };
  menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="#">
          Remove
        </a>
      </Menu.Item>
    </Menu>
  );

  componentDidMount() {
    // this.getPackage(this.props.packageData.id)
  }

  getPackage = (id) => {
    getInventoryPackageById(id)
      .then((res) => {
        this.fetchLastChild(res.data.parent.children, [], res.data.parent.name);
      })
      .catch((err) => {
        handleError(err);
      });
  };
  fetchLastChild = (data, prevArr, parent) => {
    data.forEach((item) => {
      item.parent = [...prevArr];
      item.parent.push(parent);
      let children = item.children.filter((i) => !i.type);
      if (children.length === 0) {
        this.setState((prevState) => ({
          lastChild: [...prevState.lastChild, item],
        }));
      } else {
        this.fetchLastChild(children, item.parent, item.name);
      }
    });
  };

  render() {
    let { lastChild } = this.state;
    return (
      <React.Fragment>
        <Collapse
          accordion
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          onChange={callback}
        >
          <Panel
            header={
              <div className="col-12">
                <div className="row info-card-heading-row align-items-center justify-content-between">
                  <h5 className="mb-0">Inventory Family</h5>
                  <Button className="border-0 p-0 bg-transparent text-uppercase">
                    required
                  </Button>
                </div>
              </div>
            }
            key="2"
          >
            <CreateInventoryPackage hideTitle {...this.props} />
          </Panel>
        </Collapse>
      </React.Fragment>

      // <React.Fragment>
      //     <Collapse className="vehicle-group-collapse-main" accordion
      //               expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
      //               defaultActiveKey={[0]} onChange={callback}>
      //         {lastChild.map((item, index) => (<Panel header={
      //             <React.Fragment>
      //                 <div className="col-12">
      //                     <div className="row info-card-heading-row align-items-center justify-content-between">
      //                         <h5 className="mb-0 vehicle-group-heading d-flex align-items-center">
      //                             <img src={Images.create_inventory_group_icon} alt={" "} className="img-fluid"/>
      //                             {item.name}
      //                         </h5>
      //                         <Button className="border-0 p-0 bg-transparent text-uppercase">required</Button>
      //                     </div>
      //                 </div>
      //                 <div className="col-12">
      //                     <div
      //                         className="row align-items-center justify-content-between collapse-breadcrumb-main">
      //                         <div className="breadcrumb-inner-details">
      //                             <Breadcrumb separator={
      //                                 <img src={Images.arrow_small_breadcrumb} alt={""} className="img-fluid"/>
      //                             }>
      //                                 <Breadcrumb separator={
      //                                     <img src={Images.arrow_small_breadcrumb} alt={""}
      //                                          className="img-fluid"/>
      //                                 }>{item.parent.map(b => (
      //                                     <Breadcrumb.Item>{b}</Breadcrumb.Item>
      //                                 ))}
      //                                     <Breadcrumb.Item>{item.name}</Breadcrumb.Item>
      //                                 </Breadcrumb>
      //                             </Breadcrumb>
      //                         </div>
      //                         <div className="remove-dropdown">
      //                             <Dropdown trigger={'click'} overlay={this.menu}>
      //                                 <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
      //                                     <img src={Images.eva_more_elisis} className="img-fluid" alt=""/>
      //                                 </a>
      //                             </Dropdown>
      //                         </div>
      //                     </div>
      //                 </div>
      //             </React.Fragment>
      //         } key={index}>
      //             <CreateInventoryGroupCost data={item}/>
      //         </Panel>))}

      //     </Collapse>
      // </React.Fragment>
    );
  }
}

export default CreateStepTwoInventoryGroups;
