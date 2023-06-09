import React, { Component } from "react";
import { Image as Images } from "../../../Images";
import { Select } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { formatDate } from "../../../../Controller/utils";
import { getGoogleAuthenticateURL } from "../../../../Controller/api/authServices";
import { connect } from "react-redux";

const { Option } = Select;

class InvoicingGeneralInfoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileURL: null,
      pdfValue: 'select',
      pdfLoading: false,
      googleModalVisible: false
    }
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
      this.props.callbackSendInvoice();
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
    const {googleModalVisible} = this.state;
    const { Invoice, statusTypes } = this.props;
    return (
      <div className="row summary-collapse-inner-row-main">
        <div className="col-12">
          <div className="row summary-view-row-vehicle">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <h6 className="text-uppercase">
                Associated project
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
                    <h6>{Invoice?.project?.name}</h6>
                    <p className="mb-0">
                      {Invoice?.project?.status?.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                    // disabled={proposal_filled}
                    value={this.state.pdfValue}
                  >
                    {/* <Option value="select">Select</Option> */}
                    <Option value="send_pdf">
                      Generate and Send Invoice PDF
                      <br/>
                      <small style={{color: '#BDBDBD'}}>Generate and send an up to date invoice pdf</small>
                    </Option>
                    <Option value="view_pdf">
                      View Invoices
                      <br/>
                      <small style={{color: '#BDBDBD'}}>View all invoice PDFs and other documents uploaded</small>
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
              {/*{this.state.pdfLoading &&*/}
              {/*<p>Loading...</p>*/}
              {/*}*/}
            </div>
          </div>
          <div className="row summary-view-row-vehicle border-bottom-0">
            <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-15-bt">
              <h6 className="text-uppercase">Invoice ID</h6>
              <h5 className="mb-0">{Invoice?.id}</h5>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-15-bt">
              <h6 className="text-uppercase">STATUS</h6>
              <Select
                labelInValue
                className="status-small-select"
                placeholder={"Select"}
                defaultValue={{
                  value: Invoice.status?.id,
                  label: Invoice.status?.title,
                }}
                value={{value: Invoice.status?.id, label: Invoice.status?.title}}
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
                  <option value={item?.id}>
                    <div className="text-capitalise">{item.title}</div>
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-15-bt">
              <h6 className="text-uppercase">Invoice Created</h6>
              <h5 className="mb-0">{formatDate(Invoice?.created)}</h5>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-15-bt">
              <h6 className="text-uppercase">Invoice DUe</h6>
              <h5 className="mb-0">{formatDate(Invoice?.due_date)}</h5>
            </div>
            <div className="col-12 col-sm-6 col-md-3 col-lg-3">
              <h6 className="text-uppercase">Invoice instruction</h6>
              <h5 className="mb-0">{Invoice?.instruction || "-"}</h5>
            </div>
            <div className="col-12 col-sm-6 col-md-9 col-lg-9">
              <h6 className="text-uppercase">DESCRIPTION</h6>
              <h5 className="mb-0">{Invoice?.description || "-"}</h5>
            </div>
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

export default connect(mapStateToProps, null)(InvoicingGeneralInfoView);

