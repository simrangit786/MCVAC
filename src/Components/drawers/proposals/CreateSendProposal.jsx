import React, { Component } from "react";
import { Button, DatePicker, Drawer, Form, Input, message, Select } from "antd";
import { Image as Images } from "../../Images";
import moment from "moment";
import { connect } from "react-redux";
import { handleError } from "../../../Controller/Global";
import { getContact } from "../../../Controller/api/contactsServices";
import { getProposalPdf, sendPdfProposal } from "../../../Controller/api/proposalServices";
import { withRouter } from "react-router-dom";
const { Option, OptGroup } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateSendProposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      selectedContacts: [],
      selectedEmails:[],
      selectedBCCEmails: [],
      selectedBCC: [],
      selectedCC: [],
      selectedCCEmails: [],
      proposalContacts: [],
      loading: false,
      showCCSelect: false,
      showBCCSelect: false,
      btnLoader: false,
      fileURL: null,
      pdfLoading: false
    }
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const {proposal} = this.props;
    let customer_contacts = [];
    let owner_contacts = [];
    let selectedEmails = []
        for(let i of proposal?.customer_contact) {
            for(let c of i.contact) {
              customer_contacts.push(c.contact)
            }
        }
        for(let i of proposal?.owner_contact) {
          for(let c of i.contact) {
            owner_contacts.push(c.contact)
        }
      }
    selectedEmails.push(this.props.proposal?.proposal_recipient?.default_email?.email);
    this.setState({selectedEmails, proposalContacts: [...customer_contacts, ...owner_contacts]?.filter(i => i?.default_email != null)});
  }

  getAllContacts = (params) => {
    const {proposalContacts} = this.state;
    this.setState({ loading: true });
    getContact(params)
      .then((response) => {
        let newArr = response.data.results.filter(i => i.default_email != null);
       
        newArr  = newArr.filter(function(array_el){
          return proposalContacts.filter(function(anotherOne_el){
             return anotherOne_el.default_email.email == array_el.default_email.email;
          }).length == 0
       });
        // console.log(newArr)
        this.setState({ contacts: newArr});
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        this.setState({loading: false})
      })
      ;
  };


  handleSubmit = values => {
    const {selectedCCEmails, selectedBCCEmails, selectedEmails} = this.state;
    this.setState({btnLoader: true})
    const newValues = {
      ...values,
      to: selectedEmails,
      cc: selectedCCEmails,
      bcc: selectedBCCEmails
    }
    sendPdfProposal(this.props.match.params.id, newValues).then(() => {
      this.setState({btnLoader: false})
      message.success('Proposal sent successfully!')
      this.props.onClose()
    }).catch(err => {
      handleError(err)
    })
    // console.log(newValues, "values")
  }

  handleSelect = (e, item) => {
    let selectedEmails = e.map(i => i.label)
      this.setState({selectedContacts: e, selectedEmails})
  }

  showCCSelect = () => {
    this.setState({showCCSelect: true})
  }

  showBCCSelect = () => {
    this.setState({showBCCSelect: true})
  }

  handleCCSelect = (e, item) => {
    // console.log(e, item, "item")
    let selectedCCEmails = e.map(i => i.label)
      this.setState({selectedCC: e, selectedCCEmails})
  }

  handleBCCSelect = (e, item) => {
    let selectedBCCEmails = e.map(i => i.label)
      this.setState({selectedBCC: e, selectedBCCEmails})
  }

  populateData = () => {
    this.formRef.current.setFieldsValue({
      subject: `${this.props.proposal.name} - a Quote Attached`,
      message: `Attached is our quote for the above-mentioned project. \n\nWe will look forward to working with you on this important project.\n\nFor your future reference please keep McVac in mind for the other services we offer. McVac specializes in services centered around our fleet of powerful and versatile vacuum trucks and services related to our fleet of equipment and trained personnel. Some of these services include Emergency Spill Response, Transportation and Disposal of hazardous and non-hazardous liquid & solid waste, Vacuum Excavation (Hydro and/or Pneumatic Excavation), Ground Water Treatment, Pipe Cleaning & CCTV Inspection, Environmental Site Cleanup and Remediation, hazardous and non-hazardous waste management, and finally Tank & Facility cleaning.\n\nPlease visit us at www.mcvacenvironmental.com.`
    })
  }

  fetchPdf = () => {
    this.setState({pdfLoading: true})
    const params = {
      preview:"1"
    }
    getProposalPdf(this.props.proposal.id,params).then(res => {
      const file = new Blob([res.data],{
        type: "application/pdf"
      })
      const fileURL = URL.createObjectURL(file);
      this.setState({fileURL,pdfLoading: false},() => {
        window.open(this.state.fileURL,'_blank')
      })
    }).catch((err) => {
      handleError(err)
    })

  }

  render() {
    const {contacts, selectedContacts, showCCSelect, showBCCSelect, selectedBCC, selectedCC, proposalContacts, btnLoader} = this.state;
    const { proposal} = this.props;
    const user = this.props.userdata;
    return (
      <React.Fragment>
        <Drawer
          centered
          afterVisibleChange={this.populateData}
          title={"Send Proposal"}
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-all-form-modal main-drawer-div drawer-update"
          width={"575px"}
          placement={"right"}
          closeIcon={false}
          footer={
            <div
              className="preview"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent : "space-between"
              }}
            >
              <span className="preview-pdf-proposal">
                <Button onClick={this.fetchPdf}>Preview PDF </Button>
                </span>
                <div className="d-flex align-items-center">
                <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={() => {
                this.formRef.current.submit()
              }} type="primary" loading={btnLoader}>
                Send Proposal
              </Button>
                </div>

            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row mx-0 info-gray-div align-items-center">
                <h6 className="mb-0">
                  Please select who you would like to send this proposal to. You
                  can choose among Contacts associated to this Proposal’s Site
                  Manager and Billing Accounts, and you can also add other email
                  addresses as well. The selected Customer Account is the
                  address to at the proposal.
                </h6>
              </div>
            </div>
            {/* <div className="col-12 my-lg-3 my-2">
               <Button className="print-pdf-btn float-lg-right d-flex align-items-center text-capitalize">
                   <img src={Images.pdf_icon_gray} alt="" className="img-fluid"/>
                   Print / Preview
               </Button>
             </div> */}
            {/*<div className="col-12">*/}
            {/*    <h5>Proposal Recipient</h5>*/}
            {/*</div>*/}
            {/*<div className="col-12">*/}
            {/*    <div*/}
            {/*        className="row mx-0 align-items-center user-info-div-main position-relative">*/}
            {/*        <div className="col-12">*/}
            {/*            <div className="user-icons-div">*/}
            {/*                <img src={Images.person_black_icon} alt=""*/}
            {/*                     className="img-fluid"/>*/}
            {/*            </div>*/}
            {/*            <div className="user-info-div">*/}
            {/*                <h6>Erdos Technologies</h6>*/}
            {/*                <p className="mb-0">Billing Account</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="col-12">
              <h6>Proposal Recipient</h6>
            </div>
            <div className="col-12">
              <div className="row customer-account-send">
                <div className="col-12 col-sm-12">
                  <div className="row mx-0 align-items-center user-info-div-main position-relative">
                    <div className="col-12">
                      <div className="user-icons-div">
                        <img
                          src={Images.contact_file_icon_black}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="user-info-div">
                        <h6>
                          {proposal?.proposal_recipient?.full_name || "-"}
                          <span className="role-name-tg">{proposal?.proposal_recipient?.role || "-"}</span>
                        </h6>
                        <p className="mb-0">{proposal?.proposal_recipient?.default_email?.email || "-"}, {proposal?.proposal_recipient?.default_phone?.phone_number || "-"}</p>
                      </div>
                    </div>
                    <span className="position-absolute home-labor-group main-content-div">
                      Proposal Recipient
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <Form
                ref={this.formRef}
                {...layout}
                onFinish={this.handleSubmit}
                className="main-inner-form proposal-send-form"
              >
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="date"
                      label={"Date "}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <DatePicker disabled={true} defaultValue={moment()} format={'MM/DD/YYYY'} />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="from"
                      label={"From "}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <Input disabled={true} placeholder={"Enter Email"} 
                       defaultValue={user?.google_authorised_email}
                       />
                    </Form.Item>
                  </div>
                  <div className="col-12 custom-select-multi">
                    <Form.Item
                      name="to"
                      label={"To *"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                      className="position-relative search-overlap"
                    >
                      <Select
                        labelInValue
                        dropdownClassName={"opt-group-multi"}
                        mode="tags"
                        placeholder="Select"
                        showArrow={false}
                        className={"search-and-select-tag"}
                        // notFoundContent={this.state.fetching ?
                        //     <Spin size="small"/> : null}
                        filterOption={false}
                        onChange={(e, item) => this.handleSelect(e, item)}
                        value={selectedContacts}
                        optionLabelProp="label"
                        showSearch={true}
                        onSearch={value => this.getAllContacts({search: value})}
                        onFocus={() => this.getAllContacts()}
                        defaultValue={{value: proposal?.proposal_recipient?.id, key: proposal?.proposal_recipient?.id, label: proposal?.proposal_recipient?.default_email?.email}}
                      >
                       
                        <OptGroup label="Contacts associated to accounts within this proposal">
                        {proposalContacts?.map(c => {
                          return <Option value={c.id} label={c.default_email.email} key={c.id}>
                              <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                <div className="common-select-option-row">
                                  <div className="select-option-details d-flex align-items-center">
                                    <div className={"select-option-icon"}>
                                      <img
                                        src={Images.contact_file_icon_black}
                                        alt={""}
                                        className={"img-fluid"}
                                      />
                                    </div>
                                    <div>
                                      <h6 className="mb-0">{c.full_name || ""}</h6>
                                      <p className="mb-0">{c.role || "-"}</p>
                                      <p className="mb-0">{c.account?.name}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-green-tag select-text-tier">
                                  Contact
                                </div>
                              </div>
                            </Option>
                        })}
                        </OptGroup>
                        <OptGroup label="Others">
                          {contacts
                          // .drawer(n => typeof(n.value) == 'number')
                          .map(c => {
                            // console.log(typeof(c.value))
                            return (
                            <Option value={c.id} label={c.default_email.email} key={c.id}>
                              <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                <div className="common-select-option-row">
                                  <div className="select-option-details d-flex align-items-center">
                                    <div className={"select-option-icon"}>
                                      <img
                                        src={Images.contact_file_icon_black}
                                        alt={""}
                                        className={"img-fluid"}
                                      />
                                    </div>
                                    <div>
                                      <h6 className="mb-0">{c.full_name || ""}</h6>
                                      <p className="mb-0">{c.role || "-"}</p>
                                      <p className="mb-0">{c.account?.name}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-green-tag select-text-tier">
                                  Contact
                                </div>
                              </div>
                            </Option>
                            )
                          })}
                        </OptGroup>
                      </Select>
                    </Form.Item>
                    <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                      <img
                        src={Images.search_small_icon}
                        alt=""
                        className="img-fluid"
                      />
                    </Button>
                    <ul className="mb-0 list-inline to-associate-details position-absolute">
                      <li className="list-inline-item" onClick={this.showCCSelect}>Cc</li>
                      <li className="list-inline-item" onClick={this.showBCCSelect}>Bcc</li>
                    </ul>
                  </div>
                  {showCCSelect &&
                  <div className="col-12 custom-select-multi">
                    <Form.Item
                      name="cc"
                      label={"Cc"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                      className="position-relative search-overlap"
                    >
                      <Select
                        labelInValue
                        dropdownClassName={"opt-group-multi"}
                        mode="tags"
                        placeholder="Select"
                        showArrow={false}
                        className={"search-and-select-tag"}
                        // notFoundContent={this.state.fetching ?
                        //     <Spin size="small"/> : null}
                        filterOption={false}
                        onChange={(e, item) => this.handleCCSelect(e, item)}
                        value={selectedCC}
                        optionLabelProp="label"
                        showSearch={true}
                        onSearch={value => this.getAllContacts({search: value})}
                        onFocus={() => this.getAllContacts()}
                      > 
                      <OptGroup label="Contacts associated to accounts within this proposal">
                        {proposalContacts?.map(c => {
                          return <Option value={c.id} label={c.default_email.email} key={c.id}>
                              <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                <div className="common-select-option-row">
                                  <div className="select-option-details d-flex align-items-center">
                                    <div className={"select-option-icon"}>
                                      <img
                                        src={Images.contact_file_icon_black}
                                        alt={""}
                                        className={"img-fluid"}
                                      />
                                    </div>
                                    <div>
                                      <h6 className="mb-0">{c.full_name || ""}</h6>
                                      <p className="mb-0">{c.role || "-"}</p>
                                      <p className="mb-0">{c.account?.name}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-green-tag select-text-tier">
                                  Contact
                                </div>
                              </div>
                            </Option>
                        })}
                      </OptGroup>
                        <OptGroup label="Others">
                          {contacts.map(c => {
                            return (
                            <Option value={c.id} label={c.default_email.email} key={c.id}>
                              <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                <div className="common-select-option-row">
                                  <div className="select-option-details d-flex align-items-center">
                                    <div className={"select-option-icon"}>
                                      <img
                                        src={Images.contact_file_icon_black}
                                        alt={""}
                                        className={"img-fluid"}
                                      />
                                    </div>
                                    <div>
                                      <h6 className="mb-0">{c.full_name || ""}</h6>
                                      <p className="mb-0">{c.role || "-"}</p>
                                      <p className="mb-0">{c.account?.name}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-green-tag select-text-tier">
                                  Contact
                                </div>
                              </div>
                            </Option>
                            )
                          })}
                        </OptGroup>
                      </Select>
                    </Form.Item>
                    <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                      <img
                        src={Images.search_small_icon}
                        alt=""
                        className="img-fluid"
                      />
                    </Button>
                    {/* <ul className="mb-0 list-inline to-associate-details position-absolute">
                      <li className="list-inline-item" onClick={this.showCCSelect}>Cc</li>
                      <li className="list-inline-item">Bcc</li>
                    </ul> */}
                  </div>
                  }

                  {showBCCSelect &&
                  <div className="col-12 custom-select-multi">
                    <Form.Item
                      name="bcc"
                      label={"Bcc"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                      className="position-relative search-overlap"
                    >
                      <Select
                        labelInValue
                        dropdownClassName={"opt-group-multi"}
                        mode="tags"
                        placeholder="Select"
                        showArrow={false}
                        className={"search-and-select-tag"}
                        // notFoundContent={this.state.fetching ?
                        //     <Spin size="small"/> : null}
                        filterOption={false}
                        onChange={(e, item) => this.handleBCCSelect(e, item)}
                        value={selectedBCC}
                        optionLabelProp="label"
                        showSearch={true}
                        onSearch={value => this.getAllContacts({search: value})}
                        onFocus={() => this.getAllContacts()}
                      >
                        <OptGroup label="Contacts associated to accounts within this proposal">
                          {proposalContacts?.map(c => {
                            return <Option value={c.id} label={c.default_email.email} key={c.id}>
                                <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                  <div className="common-select-option-row">
                                    <div className="select-option-details d-flex align-items-center">
                                      <div className={"select-option-icon"}>
                                        <img
                                          src={Images.contact_file_icon_black}
                                          alt={""}
                                          className={"img-fluid"}
                                        />
                                      </div>
                                      <div>
                                        <h6 className="mb-0">{c.full_name || ""}</h6>
                                        <p className="mb-0">{c.role || "-"}</p>
                                        <p className="mb-0">{c.account?.name}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-green-tag select-text-tier">
                                    Contact
                                  </div>
                                </div>
                              </Option>
                          })}
                        </OptGroup>
                        <OptGroup label="Others">
                          {contacts.map(c => {
                            return (
                            <Option value={c.id} label={c.default_email.email} key={c.id}>
                              <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                <div className="common-select-option-row">
                                  <div className="select-option-details d-flex align-items-center">
                                    <div className={"select-option-icon"}>
                                      <img
                                        src={Images.contact_file_icon_black}
                                        alt={""}
                                        className={"img-fluid"}
                                      />
                                    </div>
                                    <div>
                                      <h6 className="mb-0">{c.full_name || ""}</h6>
                                      <p className="mb-0">{c.role || "-"}</p>
                                      <p className="mb-0">{c.account?.name}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-green-tag select-text-tier">
                                  Contact
                                </div>
                              </div>
                            </Option>
                            )
                          })}
                        </OptGroup>
                      </Select>
                    </Form.Item>
                    <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                      <img
                        src={Images.search_small_icon}
                        alt=""
                        className="img-fluid"
                      />
                    </Button>
                    {/* <ul className="mb-0 list-inline to-associate-details position-absolute">
                      <li className="list-inline-item" onClick={this.showCCSelect}>Cc</li>
                      <li className="list-inline-item">Bcc</li>
                    </ul> */}
                  </div>
                  }
                  <div className="col-12">
                    <Form.Item
                      name="subject"
                      label={"Subject * "}
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Subject",
                        },
                      ]}
                    >
                      <Input placeholder={"Subject"}/>
                    </Form.Item>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="message"
                      label={"Message * "}
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Message",
                        },
                      ]}
                    >
                         <Input.TextArea
                        className={"text-editor-field mt-0"}
                        placeholder={"Message"}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {...state, userdata: state?.userdata}
}

export default connect(mapStateToProps)(withRouter(CreateSendProposal));
