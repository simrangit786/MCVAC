import React, { Component } from "react";
import ManagementHeader from "../../../management/ManagementHeader";
import { Table } from "antd";
import { routes } from "../../../../Controller/Routes";
import { reverse } from "named-urls";
import { history } from "../../../../Controller/history";
import { handleError } from "../../../../Controller/Global";
import { getOwnerSites } from "../../../../Controller/api/ownerAccountServices";
import { debounce } from "lodash";
import { Image as Images } from "../../../Images";
import { useState, useEffect } from "react";
import { debounceEvent } from "../../../../Controller/utils";

const SitesAccountsMain = () => {
    const [sitesData, setSitesData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        showSizeChanger: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    })
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(null);
    const [date,setDate] = useState({
        start:"",
        end:"",
        start_modified: "",
        end_modified: ""
    })

    const siteColumns = [
        {
            title: "Site Name",
            dataIndex: "name",
            sorter: true,
            render: (name) => name || "-",
            key: "name",
        },
        {
            title: "Site manager Account",
            dataIndex: "account",
            sorter: true,
            key: "account",
            render: (data) => <div>{data?.name}</div>,
        },
        {
            title: "Address",
            // dataIndex: 'account',
            // sorter: true,
            // key: "account",
            render: (data) => (
                <div>
                    {`${data?.apartment || ""}`} {data.street_address || "-"}
                    <br />
                    {data.city || "-"} {data.city && `${data.city || ""},`}{" "}
                    {data.state || ""}
                    <br />
                    {data.zip_code || ""} {data.country || ""}
                </div>
            ),
        },
        {
            title: "Email Address",
            dataIndex: "email",
            sorter: true,
            key: "email",
            render: (email) => <div>{email || "-"}</div>,
        },
        {
            title: "Phone Number",
            dataIndex: "phone",
            sorter: true,
            key: "phone",
            render: (phone) => <div>{phone || "-"}</div>,
        },
    ];


    useEffect(() => {
        getSitesData({page:1});
    }, [search,date])

    const getSitesData = (params = {}) => {
        // const { search } = this.state
        setLoading(true);
        if (!params.ordering) {
            params.ordering = "name";
        }
        getOwnerSites({ ...params, page: params.page || 1, search, ...date })
            .then((res) => {
                setSitesData(res.data.results);
                setLoading(false);
                setPagination({
                    ...pagination,
                    current: params.page || 1,
                    total: res.data.count,

                })
            })
            .catch((err) => {
                handleError(err);
            });
    };

    const onItemSearch = (e) => {
        setSearch(e.target.value)

    }

    const handleTableChange = (pagination, filters, sorter) => {
        let symbol = "";
        if (sorter.order === "descend") symbol = "-";
        let params = {
            page: pagination.current,
        };
        if (sorter.columnKey) {
            params.ordering = `${symbol}${sorter.columnKey}`;
        } else {
            params.ordering = "name";
        }
        // this.getSitesData({page: pagination.current})
        getSitesData(params);
    };

    const getLocaleData = () => {
        return (<div className="col-12 no-data-card-row-new-table">
            <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                    <img src={Images.location_gray} alt="" className="img-fluid" />
                    <h6 className="no-data-main-tg mb-0">No Sites</h6>
                </div>
            </div>
        </div>)
    }

    const handleDateFilter = (data) => {
        setDate({...data})

    }


    return (
        <React.Fragment>
            <ManagementHeader
                buttonLink={routes.dashboard.owner_account.site_account.create}
                buttonName={"+ Create Site"}
                onSearch={debounceEvent(onItemSearch, 1000)}
                fetchData={(data) => handleDateFilter(data)}
            />
            <div className="row mx-0 opportunities-table-main-dashboard">
                <div className="col-12">
                    <div className="row">
                        <div
                            className="col-12 table-responsive main-table-div opportunity-db-table customer-account-table">
                            <Table
                                scroll={{ y: 450 }}
                                locale={!loading ? { emptyText: getLocaleData() } : { emptyText: " " }}
                                className="main-table-all"
                                columns={siteColumns}
                                dataSource={sitesData}
                                pagination={pagination}
                                onChange={handleTableChange}
                                loading={loading}
                                size="middle"
                                onRow={(record) => {
                                    return {
                                        onClick: (event) => {
                                            history.push(
                                                reverse(
                                                    routes.dashboard.owner_account.site_account.view,
                                                    { id: record.id }
                                                )
                                            );
                                        },
                                    };
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SitesAccountsMain;
