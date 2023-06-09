import React, {Component} from 'react';
import {Button, Divider, Select, Space, Spin} from 'antd';
import {CaretDownOutlined, LeftOutlined, RightOutlined} from "@ant-design/icons";
import DispatchLeftMinHeaderFilter from "./dispatch-left/DispatchLeftMinHeaderFilter";
import DispatchProjectDetailsAll from "./dispatch-left/DispatchProjectDetailsAll";
import DispatchRightMainInner from "./dispatch-right/DispatchRightMainInner";
import {getWarehouse} from '../../../Controller/api/workOrderServices';
import {handleError} from '../../../Controller/Global';
import {getDispatchData} from '../../../Controller/api/dispatchServices';
import {setBreadcrumb} from "../../../Store/actions/breadcrumbAction";
import {connect} from "react-redux";

const {Option} = Select;


class OperationsDispatch extends Component {
    state = {
        workOrder: [],
        filterObj: null, 
        page: 1,
        total: null,
        status: false, 
        loading: false, 
        isActive: false, 
        totalCount: null,
        warehouse: [],
        totalWarehouse: null,
        newPage: 1,
        warehouseId: null
        // pagination: {
        //     current: 1, pageSize: 15, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        // },
    }
    child = React.createRef()

    componentDidMount() {
        const arr = [
        {
            title: "Dispatch", 
            // url: ''
        }
        ]
        this.props.setBreadcrumb(arr)
    
        this.handleWorkorderWarehouse({page: this.state.newPage},"mount") 
    }

    fetchWorkorder = (params = {}) => {
        this.setState({loading: true})
        const {filterObj} = this.state
        if(params.search) {
            this.setState({page: 1})
        }
        getDispatchData({...params, ...filterObj})
            .then((res) => {
                this.setState({totalCount: res.data.count})
                if (this.state.page === 1) {
                    this.setState({workOrder: res.data.results})
                } else {
                    this.setState((prevState) => {
                        return {workOrder: [...prevState.workOrder, ...res.data.results]};
                    });
                }
            })
            .catch((err) => {
                handleError(err)
            })
            .finally(() => {
                this.setState({loading: false});
            });
    };
    setFilterObj = filterObj => {
        this.setState({filterObj}, () => {
            this.setState({page: 1})
            this.fetchWorkorder()
        });
    }

    statusUpdate = (value) => {
        if (value) {
            this.setState({page: 1},() => {
                this.fetchWorkorder({warehouse: this.state.warehouseId});
                this.child.current.handleUpdate()
            })
            
        }
    }

    handlePagination = () => {
        this.setState((prevState) => {
            return {
                page: prevState.page + 1
            }
        },() => {
            this.fetchWorkorder({page: this.state.page})
        })
    }

    handleButton = (data) => {
        this.setState({closeButton: data})
    }
    handleToggle = (e) => {
        this.setState({
            isActive: !this.state.isActive
        })
    }

    handleWarehousePagination = () => {
        this.setState((prevState) => {
            return {
                newPage: prevState.newPage + 1
            }
        },() => {
            this.handleWorkorderWarehouse({page: this.state.newPage})
        })
    }

    handleWorkorderWarehouse = (params = {},key) => {
        this.setState({loading: true})
        getWarehouse(params).then(res => {
            this.setState({totalWarehouse: res.data.count,newPage: params.page},() => {
                if(this.state.newPage === 1) {
                    this.setState({warehouse: res.data.results},() => {
                        if(key) {
                        this.setState({warehouseId: res.data.results[0].id},() => {
                            this.fetchWorkorder({warehouse: this.state.warehouseId})

                        })
                    }
                    })
                } else {
                    this.setState(prevState => {
                        return {warehouse: [...prevState.warehouse, ...res.data.results]}
                    })
                }

            }) 

        }).catch((err) => {
            handleError(err)
        }).finally(() => {
            this.setState({loading: false})
        })

    }

    handleWarehouseData = (val) => {
        this.setState({warehouseId: val})
        this.fetchWorkorder({warehouse: val})


    }
    render() {
        const { loading,warehouse,totalWarehouse } = this.state
        let warehouseVal = this.state.warehouse[0]
    
        return (<React.Fragment>
            <div className={`main-content-div ${this.state.isActive ? "update-dispatch" : ""}`}>
                <div className="row mx-0">
                    <div className="dispatch-header-fixed">
                        <div className="dispatch-header-main">
                            <div className="col-12">
                                <h6 className="mb-0">Work Orders</h6>
                                {/* <Select
                                            className="dispatch-select-header"
                                            suffixIcon={<CaretDownOutlined />}
                                            defaultValue="work_order">
                                            <Option value="work_order">Work Orders</Option>
                                            <Option value="employees">Employees</Option>
                                            <Option value="vehicles">Vehicles</Option>
                                        </Select> */}
                            </div>
                        </div>
                        {this.state.warehouse.length > 0 ? 
                        <div className="dispatch-header-main dispatch-header-main-right">
                            <div className="row w-100">
                                <div className="col-12 col-sm-10">
                                    <Select
                                        style={{paddingRight:'25px'}}
                                        className="dispatch-select-header"
                                        suffixIcon={<CaretDownOutlined/>}
                                        defaultValue={warehouseVal?.id}
                                        onChange = {(e) => {
                                            this.setState({warehouseId: null},() => {
                                                this.handleWarehouseData(e)

                                            })
                                        }}
                                        onDropdownVisibleChange={() => {
                                            this.setState({newPage: 1},() => {
                                                this.handleWorkorderWarehouse({page: this.state.newPage})
                                            })
                                            // e.stopPropagation();
                                        }}
                                        dropdownClassName='dispatch-warehouse-dropdown'
                                        dropdownRender={(options) => (
                                            <>
                                              {options}
                                              <Divider style={{ margin: '0 0 10px' }} />
                                              <Space align="center" className="d-flex align-items-center justify-content-center" style={{ padding: '0 8px 4px' }}>
                                                <div className="row">
                                                  <div className="col-12 text-center create-div">
                                                    {loading ? (
                                                      <Spin />
                                                    ) : (
                                                      warehouse.length !== totalWarehouse && (
                                                        <div className="d-flex align-items-center justify-content-center">
                                                          <Button className="load-more-btn w-auto bg-transprent" onClick={(e) => {
                                                            this.handleWarehousePagination()
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
                                        {this.state.warehouse.map(i => (
                                        <Option value={i.id} >{i.name}</Option>
                                        ))}
                                        
                                    </Select>
                                </div>
                                <div className="col-12 col-sm-2 text-right">
                                    <Select
                                        className="select-dispatch-header"
                                        suffixIcon={<CaretDownOutlined/>}
                                        defaultValue="day">
                                        <Option value="day">Day</Option>
                                    </Select>
                                </div>
                            </div>
                        </div> : ""
}
                    </div>
                    <div className="dispatch-main-left">
                        <div className="row mx-0">
                            <div className="col-12">
                                <div className="row dispatch-left-main scroll-custom-common"
                                    //  onScroll={this.handleScroll}
                                    >
                                    <div className="col-12">
                                        <div className="row">
                                        <div className="col-12">
                                        <DispatchLeftMinHeaderFilter setFilterObj={this.setFilterObj}
                                                                     fetchWorkorder={this.fetchWorkorder}/>
                                    </div>
                                    <div className="col-12">
                                        <DispatchProjectDetailsAll workOrder={this.state.workOrder}
                                                                   totalCount={this.state.totalCount}
                                                                   loading={this.state.loading}
                                                                   handlePagination = {this.handlePagination}
                                                                   statusUpdate={this.statusUpdate}/>
                                    </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dispatch-main-right position-relative">
                        <div className="pull-push-btn-div">
                            <Button onClick={() => this.handleToggle(true)} className="close-btn-dispatch">
                                {this.state.isActive && <RightOutlined/>}
                                {this.state.isActive && <br/>}
                                <span className="close-text">
                                    {this.state.isActive ? "Open" : "Close"} Work Orders
                                </span>
                                {!this.state.isActive && <br/>}
                                {!this.state.isActive && <LeftOutlined/>}
                            </Button>
                        </div>
                        <div className="row mx-0">
                            <div className="col-12">
                                <div className="row scroll-custom-common dispatch-right-main">
                                    <div className="col-12 p-0">
                                        {this.state.warehouseId &&  
                                        <DispatchRightMainInner workOrder={this.state.workOrder} ref={this.child}
                                                                warehouseId={this.state.warehouseId}
                                                                fetchWorkorder={this.fetchWorkorder}/>
                             }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="data-header-employees-scroll-common">
                <div className="row mx-0 data-card-main">
                    <div className="col-12 p-0">
                        <Board className={'custom-data-board'} data={data} />
                    </div>
                </div>
            </div> */}
        </React.Fragment>);
    }
}

// export default OperationsDispatch;
export default connect(null, {setBreadcrumb})(OperationsDispatch);
