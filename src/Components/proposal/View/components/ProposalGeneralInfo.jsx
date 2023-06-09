import React, { Component } from "react";
import { Image as Images } from "../../../Images";
import { Select } from "antd";
import { formatDate } from "../../../../Controller/utils";
import { CaretDownOutlined } from "@ant-design/icons";
import { handleError } from "../../../../Controller/Global";
import { getProposalPdf } from "../../../../Controller/api/proposalServices";
import { connect } from "react-redux";
import { getGoogleAuthenticateURL } from "../../../../Controller/api/authServices";
import CommonWarningModal from "../../../modals/CommonWarningModal";

const { Option } = Select;

class ProposalGeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileURL: null,
      pdfValue: 'select',
      pdfLoading: false,
      googleModalVisible: false
    }
  }

  getSalesPdf = () => {
    this.setState({pdfLoading: true})
    getProposalPdf(this.props.proposal.id).then(res => {
      const file = new Blob([res.data], {
        type: "application/pdf"
      });
      const fileURL = URL.createObjectURL(file);
      this.setState({fileURL, pdfLoading: false}, () => {
        this.props.fetchProposal()
        window.open(this.state.fileURL, '_blank');
      })
    }).catch(err =>{
      handleError(err)
    })
  } 

  handleGoogleBtnClick = () => {
    getGoogleAuthenticateURL({ redirect_url: window.location.href }).then(
      (r) => {
        window.location.href = r.data.url;
      }
    );
  };
  
  handleChange = (value) => {
    const user = this.props.userdata;
    if (value === "send_pdf") {
      if(user?.google_authorised_email) {
      this.props.callbackSendProposal();
      }
      else {
        this.setState({googleModalVisible: true})
      }
    }
    else {
      // this.getSalesPdf();
      this.props.onTabChange('5');
    }
    this.setState({pdfValue: 'select'})
  };

  render() {
    const { proposal, statusTypes, user, proposal_filled } = this.props;
    const {googleModalVisible} = this.state;
    return (
      <div className="row summary-collapse-inner-row-main">
        <div className="col-12">
          <div className="row summary-view-row-vehicle">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <h6 className="text-uppercase">
                Associated Opportunity / project
              </h6>
              <div
                style={{ minHeight: "76px", height: "76px" }}
                className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main"
              >
                <div className="col-12">
                  <div className="user-icons-div">
                    <img
                      src={Images.leads_icon_black}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="user-info-div">
                    <h6>{proposal.opportunity?.name}</h6>
                    <p className="mb-0">
                      {proposal.opportunity?.status?.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <h6 className="text-uppercase">Associated project</h6>
              <div
                style={{ minHeight: "76px", height: "76px" }}
                className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main"
              >
                <div className="col-12">
                  <div className="user-icons-div">
                    <img
                      src={Images.folder_icon_black}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="user-info-div">
                    <h6>New York Waste Removal</h6>
                    <p className="mb-0">Under Review</p>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <h6 className="text-uppercase">Actions</h6>
              <div className="row">
                <div className="col-12 position-relative">
                  <Select
                    dropdownClassName={"pdf-select-view"}
                    suffixIcon={<CaretDownOutlined />}
                    className="select-pdf-options"
                    placeholder="Select"
                    defaultValue="select"
                    onChange={this.handleChange}
                    disabled={proposal_filled}
                    value={this.state.pdfValue}
                  >
                    {/* <Option value="select">Select</Option> */}
                    <Option value="send_pdf">
                      Generate and Send Proposal PDF
                      <br/>
                      <small style={{color: '#BDBDBD'}}>Generate and send an up to date proposal pdf</small>
                    </Option>
                    <Option value="view_pdf">
                      View Proposal PDF
                      <br/>
                      <small style={{color: '#BDBDBD'}}>View all proposal PDFs and other documents uploaded</small>
                    </Option>
                  </Select>
                  <span className="pdf-icon-tg position-absolute">
                    <img
                      alt={""}
                      src={Images.pdf_icon_light_green}
                      className="img-fluid"
                    />
                  </span>
                </div>
              </div>
              {this.state.pdfLoading &&
              <p>Loading...</p>
              }
            </div>
          </div>
          <div className="row summary-view-row-vehicle">
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <h6 className="text-uppercase">Proposal Id</h6>
              <h5 className="mb-0">{proposal.id}</h5>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-15-bt">
              <h6 className="text-uppercase">Proposal Name</h6>
              <h5 className="mb-0" style={{fontWeight: 700}}>{proposal.name}</h5>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <h6 className="text-uppercase">PROPOSAL DATES</h6>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">Create</li>
                <li className="list-inline-item gray-color-li">
                  {formatDate(proposal.creation_date)}
                </li>
              </ul>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">Due</li>
                <li className="list-inline-item gray-color-li">
                  {formatDate(proposal.due_date)}
                </li>
              </ul>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">Response</li>
                <li className="list-inline-item gray-color-li">
                  {formatDate(proposal.response_date)}
                </li>
              </ul>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <h6 className="text-uppercase">START AND END DATES</h6>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">Start</li>
                <li className="list-inline-item gray-color-li">
                  {formatDate(proposal.project_start_date)}
                </li>
              </ul>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">End</li>
                <li className="list-inline-item gray-color-li">
                  {formatDate(proposal.project_end_date)}
                </li>
              </ul>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <h6 className="text-uppercase">STATUS</h6>
              <Select
                labelInValue
                className="status-small-select"
                placeholder={"Select"}
                defaultValue={{
                  value: proposal.status?.id,
                  label: proposal.status?.title,
                }}
                // value={{value: proposal.status?.id, label: proposal.status?.title}}
                style={{ width:'100%',textAlign:"center" }}
                onChange={this.props.handleChange}
                suffixIcon={
                  <img
                    src={Images.caret_small_icon_select}
                    alt=""
                    className="img-fluid"
                  />
                }
              >
                {statusTypes?.map((item) => (
                  <option value={item.id}>
                    <div className="text-capitalise">{item.title}</div>
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <h6 className="text-uppercase">Estimated Revenue</h6>
              <h5 className="mb-0">{`${proposal.estimated_revenue ? `$${proposal.estimated_revenue}` : "-"}`}</h5>
            </div>
          </div>
          <div className="row summary-view-row-vehicle border-0">
            <div className="col-12">
              <h6 className="text-uppercase">PROPOSAL DESCRIPTION</h6>
              <h5 className="mb-0">{proposal.description}</h5>
            </div>
            {/*<div className="col-12 col-sm-6 col-md-3 col-lg-3">*/}
            {/*    <h6 className="text-uppercase">QUALIFIERS</h6>*/}
            {/*    <ul className="pl-4">*/}
            {/*        <li className="w-100">{proposal.qualifiers}</li>*/}
            {/*        /!*<li className="w-100">Bullet point</li>*!/*/}
            {/*    </ul>*/}
            {/*</div>*/}
            {/*<div className="col-12 col-sm-6 col-md-6 col-lg-6"/>*/}
            {/*<div className="col-12 col-sm-6 col-md-3 col-lg-3">*/}
            {/*    <h6 className="text-uppercase">COMMENTS</h6>*/}
            {/*    <ul className="pl-4 mb-0">*/}
            {/*        <li className="w-100">{proposal.comments}</li>*/}
            {/*        /!*<li className="w-100">Bullet point</li>*!/*/}
            {/*    </ul>*/}
            {/*</div>*/}
          </div>
        </div>
        <CommonWarningModal
          heading={
            "You need to sign in with Google to move forward. Would you like to sign in?"
          }
          subHeadingUOM={`If you would like to sign in with Google, you would be redirected to Google's sign in page. After signing in, you would be brought back to the dashboard.`}
          handleGoogleBtnClick={() => {
            this.handleGoogleBtnClick();
          }}
          visible={googleModalVisible}
          onClose={() => {
            this.setState({googleModalVisible: false});
          }}
          googleSigninModal
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps, null)(ProposalGeneralInfo);
