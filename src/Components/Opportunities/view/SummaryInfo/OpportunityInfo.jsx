import React, { useState, useEffect } from "react";
import { message, Select } from "antd";
import { Image as Images } from "../../../Images";
import { connect } from "react-redux";
import {Link, withRouter} from "react-router-dom";
import { handleError, STATUS_TYPES } from "../../../../Controller/Global";
import {
  getStatusData,
  getStatusReasonOptions,
  updateOpportunity,
} from "../../../../Controller/api/opportunityServices";
import { opportunityDetailAction } from "../../../../Store/actions/opportunityAction";
import OpportunityStatusModal from "../../../modals/OpportunityStatusModal";
import { formatDate } from "../../../../Controller/utils";
import { BidSectorOptions } from "../../../../Controller/opportunityBidSectorOptions";

const { Option } = Select;

const OpportunityInfo = props => {
  // state = {
  //   visible: false,
  //   statusTypes: [],
  //   reasons: [],
  //   reasonLoading: false
  // };
  const [visible, setVisible] = useState(false);
  const [statusTypes, setStatusTypes] = useState([])
  const [reasons, setReasons] = useState([])
  const [reasonLoading, setReasonLoading] = useState(false)

  const showOppStatus = (visible) => {
    setVisible(visible)
  };
  const handleChange = (v) => {
    if (v == 12) {
      showOppStatus(true);
    } else {
      handleUpdate(v);
    }
  };

  const handleUpdate = (v) => {
    // console.log(v);
    const data = { ...v, status: v?.status ? v?.status : v };
    updateOpportunity(props.match.params.id, data)
      .then((res) => {
        props.opportunityDetailAction(props.match.params.id);
        if (v?.status == 12) {
          message.success(
            `Opportunity ${props.opportunity.name}'s status has been successfully changed to LOST.`
          );
        }
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const getReasons = () => {
    setReasonLoading(true)
    getStatusReasonOptions().then(res => {
      setReasons(res.data.results)
      setReasonLoading(false)
    }).catch(err => {
      handleError(err)
    })
  }

  useEffect(() => {
    getStatusDataFunc();
  }, [])

  const getStatusDataFunc = () => {
    getStatusData()
      .then((res) => {
        setStatusTypes(res.data.results);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const getLostData = () => {
    const opp = props.opportunity;
    return (
       <div className="row lost-row-show">
                    <div className="col-12">
                      {/* <Button onClick={()=>showOppStatus(true)}>Modal</Button> */}
                      <ul className="list-inline">
                        <li className="list-inline-item">Competitor Name:</li>
                        <li className="list-inline-item">
                          {opp?.competitor_name}
                        </li>
                      </ul>
                      <ul className="list-inline">
                        <li className="list-inline-item">
                          Winning Bid Amount:
                        </li>
                        <li className="list-inline-item">${opp?.bid_amount}</li>
                      </ul>
                      <ul className="list-inline">
                        <li style={{ color: "#4F4F4F" }} className="w-100">
                          Reason:
                        </li>
                        <li className="w-100">{opp.reason_options?.id === 10 ? <span> Others - {opp?.reason} </span> : opp.reason_options?.title}</li>
                      </ul>
                    </div>
                  </div>
    )
  }
    const opp = props.opportunity;
    if (!opp.id) return <div />;
    return (
      <React.Fragment>
        {/*<Button onClick={() => showCreateOpportunity(true)}*/}
        {/*        className="edit-btn-summary">*/}
        {/*  <img src={Images.pencil_green} alt="" className="img-fluid"/>*/}
        {/*  Edit*/}
        {/*</Button>*/}
        <div className="row summary-collapse-inner-row-main">
          <div className="col-12">
            <div className="row border-pr-row-btm mb-3">
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                <h6 className="text-uppercase">OPPORTUNITY ID</h6>
                <h5>{opp.id}</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                <h6 className="text-uppercase">OPPORTUNITY NAME</h6>
                <h5>{opp.name}</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                <h6 className="text-uppercase">STATUS</h6>
                <Select
                  className="status-small-select"
                  placeholder={opp.status?.title}
                  // value={opp.status?.id}
                  style={{ width: '100%',textAlign:'center', fontSize: "13px" }}
                  onChange={handleChange}
                  suffixIcon={
                    <img
                      src={Images.caret_small_icon_select}
                      alt=""
                      className="img-fluid"
                    />
                  }
                >
                  {statusTypes.map((item, index) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.title}
                      </Option>
                    );
                  })}
                </Select>
                {opp.status?.id == 12 && 
                getLostData()
                }
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                <h6 className="text-uppercase">OPPORTUNITY SOURCE</h6>
                <h5 className="mb-0">{opp.source.name}</h5>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row border-pr-row-btm mb-3">
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                <h6 className="text-uppercase">Estimated Revenue</h6>
                <h5>${opp?.estimated_revenue || 0.0}</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <h6 className="text-uppercase">ESTIMATED START AND END DATES</h6>
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">Start</li>
                  <li className="list-inline-item gray-color-li">
                    {formatDate(opp?.project_start_date) || "-"}
                  </li>
                </ul>
                <ul className="list-inline">
                  <li className="list-inline-item">End</li>
                  <li className="list-inline-item gray-color-li">
                    {formatDate(opp?.project_end_date) || "-"}
                  </li>
                </ul>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-6 mb-15-bt">
                <h6 className="text-uppercase">DESCRIPTION</h6>
                <h5>{opp.description}</h5>
              </div>
            </div>
          </div>
           <div className="col-12">
            <div className="row">
              <div className="col-12 col-sm-4 col-md-3 col-lg-2">
                <h6 className="text-uppercase">Bid</h6>
                <h5 className="mb-0">{opp?.bid === "YES" ? "Yes" : opp?.bid === "NO" ? "No" : "-"}</h5>
              </div>
              <div className="col-12 col-sm-4 col-md-3 col-lg-2">
                <h6 className="text-uppercase">Bid Date</h6>
                <h5 className="mb-0"> {formatDate(opp?.bid_date) || "-"}</h5>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <h6 className="text-uppercase">Link to Bid Advertisement</h6>
                <h5 className="mb-0"><a href={`https://${opp?.bid_link}`} target="_blank">{opp?.bid_link || "-"}</a></h5>
              </div>
              <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                <h6 className="text-uppercase">Total Bid Value</h6>
                <h5 className="mb-0">{opp?.bid_value ? `$${opp?.bid_value}` : "-"}</h5>
              </div>
              <div className="col-12 col-sm-4 col-md-3 col-lg-2">
                <h6 className="text-uppercase">Bid Sector</h6>
                <h5 className="mb-0">{opp?.bid_sector ? BidSectorOptions?.find(i => i.value === opp?.bid_sector)?.name : "-"}</h5>
              </div>
            </div>
          </div>
        </div>
        <OpportunityStatusModal
          reasons={reasons}
          reasonLoading={reasonLoading}
          getReasons={getReasons}
          visible={visible}
          onClose={() => showOppStatus(false)}
          handleUpdate={handleUpdate}
        />
      </React.Fragment>
    );
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps, { opportunityDetailAction })(
  withRouter(OpportunityInfo)
);
