import React, {useState, useEffect} from "react";
import {Button, message, Table} from "antd";
import {Image as Images} from "../../Images";
import {getActivityInfo} from "../../../Controller/api/opportunityServices";
import moment from "moment";
import {withRouter} from "react-router";
import { handleError } from "../../../Controller/Global";

const ActivityInfo = props => {
    const [activity, setActivity] = useState([])
    const [loading, setLoading] = useState();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    });
    
    const activityColumns = [
        {
            title: <div className="text-uppercase">Date</div>,
            dataIndex: "date",
            // sorter: {
            //     compare: Sorter.DATE
            // },
            render: (modified) => (
                <div className="font-weight-normal">
                    {moment(modified).format("MMM DD, YYYY hh:mm A")}
                </div>
            ),
        },
        {
            title: <div className="text-uppercase">Action</div>,
            dataIndex: "action",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // }
        },
        {
            title: <div className="text-uppercase">EMPLOYEE</div>,
            dataIndex: "user",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            render: (user) => (
                <div className="d-flex align-items-center">
           {user &&         
           <span
              className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            {user.split(" ")[0].split("")[0]}
            {user.split(" ")[1].split("")[0]}
          </span>
        }
          {user}
        </div>
            ),
        },
    ];

    useEffect(() => {
        fetchActivity();
    }, [])

    const fetchActivity = (params = {}) => {
        setLoading(true);
        getActivityInfo(props.match.params.id, params)
            .then((response) => {
                setPagination({
                    ...pagination,
                    current: params.page || 1,
                    total: !props.viewAll ? 10 : response.data.count
                })
                setActivity(!props.viewAll ? response.data.data.slice(0,10) : response.data.data);
            })
            .catch((err) => {
               handleError(err)
            })
            .finally(() => {
                setLoading(false)
            });
    };

    const handleChange = (pagination) => {
        fetchActivity({page: pagination.current})
    }

        return (
            <React.Fragment>
                <div
                    className={`row mx-0 ${
                        !props.hideTitle ? "mt-30 no-data-card-row-new" : ""
                    }`}
                >
                    {props.hideTitle && (
                        <div className="col-12">
                            <div
                                className="row new-opportunity-header-row justify-content-between account-tabs-min summary-header-details search-view-header-in-collapse align-items-center carpet-cleaning-mini-header">
                                {/* <div className="search-bar-div">
                                <Form className="position-relative">
                                    <Input placeholder="Search Activity"/>
                                    <Button
                                        className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                        <img src={Images.search_icon_gray} className="img-fluid"
                                             alt="search icon"/>
                                    </Button>
                                </Form>
                            </div> */}
                                <Button
                                    onClick={() => props.onTabChange("7")}
                                    className="view-all-btn text-uppercase ml-auto"
                                >
                                    VIEW ALL{" "}
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="col-12">
                        <div className="row">
                            {activity.length > 0 ? (
                                <div className="col-12 table-responsive main-table-div">
                                    <Table
                                        scroll={{ y: 300}}
                                        className="main-table-all"
                                        columns={activityColumns}
                                        dataSource={activity}
                                        size="middle"
                                        locale={{
                                            emptyText: (
                                                <div className="col-12">
                                                    <div className="row no-data-upload-screens no-data-second m-0 border-0">
                                                        <div className="col-12 text-center">
                                                            <img
                                                                src={Images.time_activity_add}
                                                                alt=""
                                                                className="img-fluid"
                                                            />
                                                            <h6 className="mb-0 text-gray-tag">
                                                                No Activity
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        }}
                                        loading={loading}
                                        pagination={props.viewAll && pagination}
                                        onChange={handleChange}
                                    />
                                </div>
                            ) : (
                                <div className="col-12">
                                    <div className="row no-data-upload-screens no-data-second m-0 border-0">
                                        <div className="col-12 text-center">
                                            <img
                                                src={Images.Time_empty_state_icon}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            <h6 className="mb-0 text-gray-tag">No Activity</h6>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

export default withRouter(ActivityInfo);
