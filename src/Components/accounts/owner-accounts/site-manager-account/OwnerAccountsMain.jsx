import React, { Component } from "react";
import OwnerAccountMinHeader from "../../../min-header/OwnerAccountMinHeader";
import OwnerAccountTableMain from "./OwnerAccountTableMain";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../Controller/Routes";
import { getOwnerAccount } from "../../../../Controller/api/ownerAccountServices";
import { debounce } from "lodash";
import { message } from "antd";
import { Image as Images } from '../../../Images'
import { useState } from "react";
import { useEffect } from "react";
import { debounceEvent } from "../../../../Controller/utils";

const OwnerAccountsMain = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        showSizeChanger: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
    })
    const [search, setSearch] = useState(null);
    const [date, setDate] = useState({
        start: "",
        end: "",
        start_modified: "",
        end_modified: ""
    })
   
    useEffect(() => {
        let arr = [{
            title: "Site Manager Accounts", url: routes.dashboard.owner_account.self,
        },];
        props.setBreadcrumb(arr);
        let params = {
            ordering: 'name',
            page:1
        }
        fetchOwnerAccountData(params);
    }, [search, date])

    const fetchOwnerAccountData = (params = {}) => {
        setLoading(true);
        if (!params.ordering) {
            params.ordering = "-modified";
        }
        getOwnerAccount({...params,page: params.page || 1, search, ...date})
            .then((res) => {
                setData(res.data.results);
                setLoading(false);
                setPagination({
                    ...pagination,
                    current: params.page || 1,
                    total: res.data.count,
                })
            })
            .catch((err) => {
                setLoading(false);
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
            });
    };
    const onSearch = (e) => {
        setSearch(e.target.value)
    };


    const handleTableChange = (pagination, filters, sorter) => {
        let symbol = "";
        if (sorter.order === "descend") symbol = "-";
        let params = {
            page: pagination.current,
        };
        if (sorter.columnKey) {
            params.ordering = `${symbol}${sorter.columnKey}`;
        } else {
            params.ordering = "-modified";
        }

        fetchOwnerAccountData(params);
    };
    const getLocaleData = () => {
        return (<div className="col-12 no-data-card-row-new-table">
            <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                    <img src={Images.person_gray_icon} alt="" className="img-fluid" />
                    <h6 className="no-data-main-tg mb-0">No Site Manager Accounts</h6>
                </div>
            </div>
        </div>)
    }

    const handleDatawithFilter = (data) => {
        setDate({...data})
    }


    return (<React.Fragment>
        <OwnerAccountMinHeader
            onSearch={debounceEvent(onSearch, 1000)}
            fetchData={(data) => handleDatawithFilter(data)}
        />
        <div className="row mx-0 opportunities-table-main-dashboard">
            <OwnerAccountTableMain
                data={data}
                locale={!loading ? { emptyText: getLocaleData() } : { emptyText: " " }}
                loading={loading}
                pagination={pagination}
                handleTableChange={handleTableChange}
            />
        </div>
    </React.Fragment>);
}


export default connect(null, { setBreadcrumb })(OwnerAccountsMain);
