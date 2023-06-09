import React, {Component} from 'react';
import {Button, DatePicker, Form, Input} from "antd";
import {Image as Images} from "../../../Images";
import DispatchWorkOrderFilter from "../drawer/DispatchWorkOrderFilter";
import { getProjects } from '../../../../Controller/api/projectServices';
import { handleError } from '../../../../Controller/Global';
import { getInternalLocation } from '../../../../Controller/api/vehicleServices';
import { getOwnerAccount, getOwnerSites } from '../../../../Controller/api/ownerAccountServices';
import { getCustomerAccount } from '../../../../Controller/api/customerAccountServices';
import { debounceEvent } from '../../../../Controller/utils';

class DispatchLeftMinHeaderFilter extends Component {
    state ={
        visible:false,
        project: [],
        fetching: false,
        warehouse:[],
        customer_acc:[],
        owner_acc:[],
        sites:[],
                
    }
    showWorkOrder = (visible) =>{
        this.setState({
            visible:visible
        })
    }

    getProject = (params = {}) => {
        this.setState({fetching: true})
        // console.log(params,"params")
        getProjects(params).then(res => {
            // console.log(res,"response");
            this.setState({project: res.data.results,fetching: false})
            // this.setState({})
        }).catch((err) => {
            handleError(err);
        }).finally(() => {
            this.setState({fetching: false})
        })
    }

    getWarehouse =(params={})=>{
        this.setState({fetching: true})
        // console.log(params,"params")
        getInternalLocation(params).then(res => {
            // console.log(res,"response");
            this.setState({warehouse: res.data.results,fetching: false})
            // this.setState({})
        }).catch((err) => {
            handleError(err);
        }).finally(() => {
            this.setState({fetching: false})
        })
    }
    getBillingAccount =(params={})=>{
        this.setState({fetching: true})
        // console.log(params,"params")
        getCustomerAccount(params).then(res => {
            // console.log(res,"response bill");
            this.setState({customer_acc: res.data.results,fetching: false})
            // this.setState({})
        }).catch((err) => {
            handleError(err);
        }).finally(() => {
            this.setState({fetching: false})
        })
    }
    getSitemanagerAcoount =(params={})=>{
        this.setState({fetching: true})
        // console.log(params,"params")
        getOwnerAccount(params).then(res => {
            // console.log(res,"response");
            this.setState({owner_acc: res.data.results,fetching: false})
            // this.setState({})
        }).catch((err) => {
            handleError(err);
        }).finally(() => {
            this.setState({fetching: false})
        })
    }
    getSites=(params={})=>{
        this.setState({fetching: true})
        // console.log(params,"params")
        getOwnerSites(params).then(res => {
            // console.log(res,"response");
            this.setState({sites: res.data.results,fetching: false})
            // this.setState({})
        }).catch((err) => {
            handleError(err);
        }).finally(() => {
            this.setState({fetching: false})
        })
    }

    render() {
       const {warehouse,customer_acc,owner_acc,sites}= this.state
        return (<React.Fragment>
                <div className="row dispatch-left-min-header-row">
                    <div className="col-12">
                        <div className="row mx-0">
                            <div className="search-bar-div">
                                <Form className="position-relative">
                                    <Input
                                        placeholder="Search"
                                        onChange={debounceEvent((e)=>this.props.fetchWorkorder({ search: e.target.value }),1000)}
                                    />
                                    <Button
                                        className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                        <img
                                            src={Images.search_icon_gray}
                                            className="img-fluid"
                                            alt="search icon"
                                        />
                                    </Button>
                                </Form>
                            </div>
                            <div className="new-opportunity-btn-div">
                                <Button onClick={()=>this.showWorkOrder(true)} className="filter-btn pd-filter d-flex align-items-center justify-content-center text-capitalize">
                                    <img alt={' '} className="img-fluid" src={Images.filter_icon}/>
                                    filter
                                </Button>
                            </div>
                        </div>
                        {/* <div className="row dispatch-date-input-row">
                            <div className="col-12 col-sm-6 pr-2 position-relative">
                                <DatePicker/>
                                <span className="dash-line"/>
                            </div>
                            <div className="col-12 col-sm-6 pl-2">
                                <DatePicker/>
                            </div>
                        </div> */}
                    </div>
                </div>
            <DispatchWorkOrderFilter 
            visible={this.state.visible} 
            onClose={()=>this.showWorkOrder(false)}
            fetching={this.state.fetching}
            project = {this.state.project}
            getProject = {this.getProject}
            getBillingAccount={this.getBillingAccount}
            getWarehouse={this.getWarehouse}
            getSitemanagerAcoount={this.getSitemanagerAcoount}
            getSites={this.getSites}
            warehouse={warehouse}
            customer_acc={customer_acc}
            owner_acc={owner_acc}
            sites={sites}
            setFilterObj={this.props.setFilterObj}
            />
            </React.Fragment>);
    }
}

export default DispatchLeftMinHeaderFilter;