// import React, {Component} from "react";
import React, { useState, useEffect } from 'react';
import CustomerAccountMinHeader from "../../min-header/CustomerAccountMinHeader";
import CustomerAccountTableMain from "./CustomerAccountTableMain";
import {getCustomerAccount} from "../../../Controller/api/customerAccountServices";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../Store/actions/breadcrumbAction";
import {routes} from "../../../Controller/Routes";
import {debounce} from "lodash";
import { debounceEvent } from "../../../Controller/utils";
import {Image as Images} from "../../Images";

const CustomerAccountMain = props => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [pagination, setPagination] = useState({ 
        current: 1,
        pageSize: 15,
        showSizeChanger: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
    })
    const [search, setSearch] = useState(null);
    const [date,setDate] = useState({
        start:"",
        end:"",
        start_modified: "",
        end_modified: ""
    })
    const onSearch = (e) => {
        setSearch((e.target.value));
    };

    useEffect(() => {
        let arr = [
                    {
                        title: "Billing Accounts",
                        url: routes.dashboard.customer_account.self,
                    },
                ];
                props.setBreadcrumb(arr);
                let params = {
                    ordering: 'name',
                    page: 1
                }
                fetchTableData(params)

    },[search,date])

    const fetchTableData = (params = {}) => {
        setLoading(true);
        if (!params.ordering) {
            params.ordering = "-modified";
        }
        getCustomerAccount({...params,page: params.page || 1, search,...date})
            .then((res) => {
                setLoading(false)
                setData(res.data.results)
                setPagination({...pagination,current: params.page || 1, total: res.data.count})
            })
            .catch((err) => {
            });
    };

   const getLocaleData = () => {
        return (
            <div className="col-12 no-data-card-row-new-table">
                <div className="row no-data-upload-screens no-data-second m-0 border-0">
                    <div className="col-12 text-center">
                        <img src={Images.Account_no_data_icon} alt="" className="img-fluid"/>
                        <h6 className="mb-0 no-data-main-tg">No Billing Accounts</h6>
                    </div>
                </div>
            </div>
        )
    }

    const handleDateFilter = (data) => {
        setDate({...data})

    }
   
        return (
            <React.Fragment>
                <div className="main-content-div">
                    <CustomerAccountMinHeader
                        onSearch={debounceEvent(onSearch, 1000)}
                        fetchData={(data) => handleDateFilter(data)}
                    />
                    <div className="row mx-0 opportunities-table-main-dashboard">
                        <CustomerAccountTableMain
                            loading={loading}
                            fetchTableData={fetchTableData}
                            data={data}
                            locale={!loading ? {emptyText: getLocaleData()} : {emptyText: " "}}
                            pagination={pagination}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
    

export default connect(null, {setBreadcrumb})(CustomerAccountMain);
