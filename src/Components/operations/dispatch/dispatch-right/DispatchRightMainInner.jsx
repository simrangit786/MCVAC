import React, {Component} from "react";
import {Button, Checkbox, Dropdown, Menu, Tabs} from "antd";
import WorkOrderTabDispatchView from "./tabs/WorkOrderTabDispatchView";
import VehicleFleetsTab from "./tabs/VehicleFleetsTab";
import {isDomainAccessible} from "../../../../Controller/utils";
import { Image as Images } from "../../../Images";

const {TabPane} = Tabs;

class DispatchRightMainInner extends Component {
    state = {
        columnDates: "",
        fleetKit: "",
        fleetGroup: "",
        fleetView: false,
        dropdownVisible: false,
        active: true,
        inactive: false,
        dispatchNow: false
    };
    child = React.createRef();
    child1 = React.createRef();
    child2 = React.createRef();


    handleDispatchNow = (val) => {
        this.setState({dispatchNow: val})
    }

    handleMenuClick = (e) => {
        if(e.key == "3") {
            this.setState({dropdownVisible: false})
        }
    }

    handleVisibleChange = (flag) => {
        this.setState({dropdownVisible: flag})

    }

    handleCheckBox = (e) => {
        if(e.target.checked) {
            this.setState({active: true,inactive: false},() => {
                if(this.state.fleetGroup) {
                    this.child2.current.getDispatchFleetGroupData({active: this.state.active ? "1" : "0",warehouse: this.props.warehouseId, service_date: this.child2.current.state.closeDate})
                    }
            })
        } 

    }
    
    handleCheckInactive = (e) => {
        if(e.target.checked) {
            this.setState({inactive: true, active: false},() => {
                if(this.state.fleetGroup) {
                    this.child2.current.getDispatchFleetGroupData({active: this.state.active ? "1" : "0",warehouse: this.props.warehouseId, service_date: this.child2.current.state.closeDate})
                    }
            })
        }

    }

    editMenu = (data) => (
        <Menu style={{"width":"240px"}} onClick={this.handleMenuClick}>
            <p className="ms-5" style={{"margin-left": "15px","margin-top": "20px"}}>Vehicle Status</p>
            <Menu.Item key="0">
            <Button
             className="border-0 p-0 shadow-none bg-transparent"
                >
               <Checkbox 
                checked={this.state.active}
                onChange={this.handleCheckBox}
                // onClick={(e) => e.preventDefault()
                
                >
               Active</Checkbox> 
                </Button>
            </Menu.Item>
            <Menu.Item key="1">
                <Button
                    // onClick={()=>this.showEditWarehouse(true,data)}
                    className="border-0 p-0 shadow-none bg-transparent"
                >
                    <Checkbox checked={this.state.inactive} onChange={this.handleCheckInactive}>
                    Inactive
                    </Checkbox>
                </Button>
            </Menu.Item>
        </Menu>
        );

    handleUpdate = () => {
        this.child.current.getDispatchInqueue({
            service_date: this.child.current.state.closeDate,
            warehouse: this.props.warehouseId
        })
        if (this.state.fleetKit && this.state.fleetGroup) {
            this.child1.current.getWorkOrderInqueue({
                service_date: this.child1.current.state.closeDate,
                warehouse: this.props.warehouseId
            })
            this.child2.current.getWorkOrderInqueue({
                service_date: this.child2.current.state.closeDate,
                warehouse: this.props.warehouseId
            })
        } else if (this.state.fleetKit) {
            this.child1.current.getWorkOrderInqueue({
                service_date: this.child1.current.state.closeDate,
                warehouse: this.props.warehouseId
            })

        } else if (this.state.fleetGroup) {
            this.child2.current.getWorkOrderInqueue({
                service_date: this.child2.current.state.closeDate,
                warehouse: this.props.warehouseId
            })
        }
    };

    handleFleetKitCall = (val) => {
        this.setState({fleetKit: val});
    };

    handleFleetGroupCall = (val) => {
        this.setState({fleetGroup: val})
    }

    render() {
        return (
            <>
                <Tabs
                    defaultActiveKey={["2"]}
                    className={"carpet-cleaning-main-common-tab common-tab-dispatch"}
                >
                    <TabPane tab="Work Orders" key="1">
                        <WorkOrderTabDispatchView {...this.props} ref={this.child} warehouseId={this.props.warehouseId}
                                                  fetchWorkorder={this.props.fetchWorkorder}
                                                  handleDispatchNow={this.handleDispatchNow}
                                                  />
                    </TabPane>
                    {/* <TabPane tab="Vehicles(FLEET GROUPS)" key="3">
            <VehiclesGroupTabsDispatchView {...this.props} ref={this.child2} handleFleetGroupCall={this.handleFleetGroupCall}/>
          </TabPane> */}
                    {/*<TabPane tab="Employees" key="2">
                        <EmployeesTabsDispatchView/>
                    </TabPane>*/}
                    {/*<TabPane tab="Vehicles(FLEET KITS)" key="3">
            <VehiclesTabsDispatchView
              {...this.props}
              ref={this.child1}
              handleFleetKitCall={this.handleFleetKitCall}
            />
          </TabPane>

          {/*<TabPane tab="Supplies" key="4">
                        <SuppliesTabsDispatchView/>
                    </TabPane>
                    <TabPane tab="Projects" key="5">
                        <ProjectsTabDispatchView/>
                    </TabPane>
                    <TabPane tab="Sites" key="6">
                        <SiteTabDispatchView/>
                    </TabPane>*/}
                    {/* <TabPane tab="Vehicles(FLEET GROUPS)" key="4">
            <VehiclesGroupTabsDispatchView {...this.props} ref={this.child2} handleFleetGroupCall={this.handleFleetGroupCall}/>
          </TabPane> */}
                    {/* <TabPane tab="Vehicles(FLEET GROUPS)" key="5">
                <DemoFleetGroups/>
            </TabPane> */}
                    <TabPane tab="Vehicles(FLEET GROUPS)" key="5">
                        <VehicleFleetsTab {...this.props} ref={this.child2}
                                          handleFleetGroupCall={this.handleFleetGroupCall}
                                          handleDispatchNow = {this.handleDispatchNow}
                                          handleUpdate = {this.handleUpdate}
                                          dispatchNow = {this.state.dispatchNow}
                                          activeKey={this.state.active}
                                          fetchWorkorder={this.props.fetchWorkorder}/>
                        {/*<DemoDragDrop/>*/}
                    </TabPane>
                </Tabs>
                <div tab="filter" className="my__custom">
                <Dropdown
                //  overlayClassName="add-remove-dropdown-main w-auto"
                //  placement="bottomCenter"
                 trigger={'click'}
                 onVisibleChange={this.handleVisibleChange}
                 visible={this.state.dropdownVisible}
                 overlay={this.editMenu}
                 >
                <Button  className="filter-btn pd-filter d-flex align-items-center justify-content-center text-capitalize">
                <img alt={' '} className="img-fluid" src={Images.filter_icon}/>
                  filter
                </Button>
                </Dropdown>
                    
                    </div>
            </>
        );
    }
}

export default DispatchRightMainInner;
