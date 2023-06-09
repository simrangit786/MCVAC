import React, { useState, useEffect } from "react";
import SummaryInfo from "./SummaryInfo/SummaryInfo";
import { connect } from "react-redux";
import { handleError } from "../../../Controller/Global";
import { getStatusData } from "../../../Controller/api/opportunityServices";
import { CheckOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

function getStatusCss(statusIndex, index) {
  if (statusIndex === index) return "active";
  else if (statusIndex > index) return "finish";
}

const SummaryInfoTab = props => {
  const [statusTypes, setStatusTypes] = useState([])
  useEffect(() => {
    getStatusDataFunc()
  }, [])

  const getStatusDataFunc = () => {
    getStatusData()
      .then((res) => {
        setStatusTypes(res.data.results)
      })
      .catch((err) => {
        handleError(err);
      });
  };

    const opp = props.opportunity;
    if (!opp.id) return <div />;
    const statusIndex = statusTypes?.filter((i) => i.id != 12).findIndex((ind) => ind.id === opp?.status?.id);
    return (
      <React.Fragment>
        <div className="row summary-info-row-main">
          <div className="col-12">
            <div className="row mx-0 summary-info-status-green-line-main bar-scroll">
              {opp.status?.id == 12 ? (
                <div
                  className={
                    "summary-line-main lost-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center "
                  }
                >
                  LOST
                </div>
              ) : (
                statusTypes
                  .filter((i) => i.id != 12)
                  .map((item, index) => {
                    // console.log(item, "jhdsj")
                    return (
                      <Tooltip
                        placement="top"
                        title={item?.title}
                        overlayStyle={{ fontSize: 11 }}
                        arrowPointAtCenter={true}
                      >
                        <div
                          key={index}
                          className={
                            "summary-line-main text-uppercase position-relative p-0 " +
                            getStatusCss(statusIndex, index)
                          }
                        >
                          {getStatusCss(statusIndex, index) === "finish" ? (
                            <CheckOutlined />
                          ) : (
                            item?.title
                          )}
                        </div>
                      </Tooltip>
                    );
                  })
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="row mx-0 steps-main-div-inn">
              <SummaryInfo {...props} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(SummaryInfoTab);
