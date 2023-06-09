import React, { Component } from "react";
import { Button, DatePicker, Form, Input, InputNumber, message, Select, Spin } from "antd";
import { Image as Images } from "../../Images";
import { withRouter } from "react-router-dom";
import { getOpportunities } from "../../../Controller/api/opportunityServices";
import moment from "moment";
import {
  createProposal,
  getProposalStatusOptions,
  updateProposal,
} from "../../../Controller/api/proposalServices";
import { handleError } from "../../../Controller/Global";
import CommonWarningModal from "../../modals/CommonWarningModal";
import { opportunityDetailAction } from "../../../Store/actions/opportunityAction";
import { connect } from "react-redux";
import { debounce } from 'lodash';
import ProposalCustomSelectOptions from "./ProposalCustomSelectOptions";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { TextArea } = Input;

class GeneralInformation extends Component {
  state = {
    opportunities: [],
    fetching: false,
    statusTypes: [],
    visibleRetrieveWarning: false,
    retrieve_opp: false,
    opportunityVal: null
  };
  formRef = React.createRef();

  componentDidMount() {
    this.getProposalStatusOptions();
  }

  fetchOpportunities = (params = {}) => {
    this.setState({ fetching: true });
    getOpportunities(params)
      .then((res) => {
        this.setState({ opportunities: res.data.results, fetching: false });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
        this.setState({ fetching: false });
      });
  };

  getProposalStatusOptions = () => {
    getProposalStatusOptions()
      .then((res) => {
        this.setState({ statusTypes: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.proposal !== this.props.proposal) {
      this.formRef.current.setFieldsValue({
        ...this.props.proposal,
        status: {
          label: this.props.proposal.status?.title,
          value: this.props.proposal.status?.id,
        },
        opportunity: {
          key: this.props.proposal.opportunity?.id,
          value: this.props.proposal.opportunity?.name,
        },
        creation_date: this.props.proposal.creation_date
          ? moment(this.props.proposal.creation_date)
          : moment(),
        due_date: this.props.proposal.due_date
          ? moment(this.props.proposal.due_date)
          : null,
        response_date: this.props.proposal.response_date
          ? moment(this.props.proposal.response_date)
          : null,
        project_start_date:
          this.props.proposal.project_start_date ? moment(this.props.proposal.project_start_date) : null,
        project_end_date: this.props.proposal.project_end_date ? moment(this.props.proposal.project_end_date) : null,
      });
      // }
    }
  }

  handleSubmit = (values, FIRST_UPDATE) => {
    const { retrieve_opp } = this.state;
    this.setState({ buttonLoading: true })
    if (retrieve_opp && !this.props.proposal) {
      values.retrieve_opportunity = retrieve_opp
    }
    values.opportunity = values.opportunity?.key;
    values.status = values.status.value;
    values.creation_date = values.creation_date
      ? values.creation_date?.format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
    values.project_end_date = values.project_end_date?.format("YYYY-MM-DD");
    values.project_start_date = values.project_start_date?.format("YYYY-MM-DD");
    values.response_date = values.response_date?.format("YYYY-MM-DD");
    values.due_date = values.due_date?.format("YYYY-MM-DD");
    if (this.props.proposal) {
      updateProposal(this.props.proposal.id, values)
        .then((res) => {
          this.props.setProposal(res.data, 2);
          this.setState({ buttonLoading: false });
          if (!FIRST_UPDATE) {
            message.success("Proposal Updated Successfully");
          }
        })
        .catch((err) => {
          handleError(err);
          this.setState({ buttonLoading: false });
        });
    } else {
      createProposal(values)
        .then((res) => {
          this.props.setProposal(res.data, 2);
          this.setState({ buttonLoading: false, retrieve_opp: false });
          message.success("Proposal Created Successfully");
        })
        .catch((err) => {
          handleError(err);
          this.setState({ buttonLoading: false });
        });
    }
  };

  handleRetrieveOpp = () => {
    const { opportunity } = this.props;
    this.setState({ retrieve_opp: true, visibleRetrieveWarning: false }, () => {
      const values = {
        project_start_date: opportunity?.project_start_date ? moment(opportunity?.project_start_date) : null,
        project_end_date: opportunity?.project_end_date ? moment(opportunity?.project_end_date) : null,
        description: opportunity?.description,
        name: opportunity?.name,
        estimated_revenue: opportunity?.estimated_revenue
      }
      this.formRef.current.setFieldsValue({
        ...values
      })
    })
  }

  handleWarningModal = visibleRetrieveWarning => {
    this.setState({ visibleRetrieveWarning })
  }

  handleSelectOpp = opportunityVal => {
    // console.log(opportunityVal)
    this.setState({ opportunityVal }, () => {
      this.props.opportunityDetailAction(opportunityVal?.value)
    })
  }
  debounceEvent = (...args) => {
    this.debouncedEvent = debounce(...args);
    return (e) => {
      return this.debouncedEvent(e);
    };
  };
  render() {
    const { fetching, opportunities, buttonLoading, statusTypes, opportunityVal } = this.state;
    const { proposal } = this.props
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">Please input Proposal information on all of the required widgets, and then click Complete Creation at the bottom of this form to create this proposal.</h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                {this.props.match.params.id && (
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          name="id"
                          label={"Proposal ID"}
                          rules={[
                            {
                              required: true,
                              message: "this field is required",
                            },
                          ]}
                          className="position-relative"
                        >
                          <Input placeholder={"Proposal ID"} disabled={true} />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="opportunity"
                    label={"Associated Opportunity"}
                    //    rules={[{
                    //        required: true,
                    //        message: 'this field is required'
                    //    }]}
                    className="position-relative"
                  >
                    <Select
                      labelInValue
                      disabled={proposal?.opportunity}
                      showSearch={true}
                      dropdownClassName="custom-select-drop-main"
                      placeholder="Search Opportunities and Projects"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSelect={value => this.handleSelectOpp(value)}
                      onFocus={() => this.fetchOpportunities()}
                      onSearch={this.debounceEvent((e) => this.fetchOpportunities({ search: e }),1000)}
                      optionLabelProp={"label"}

                    >
                      {opportunities.map((d) => (
                        <Option key={d.id} label={d.name} value={d.id}>
                          {/*{d.name}*/}
                          <ProposalCustomSelectOptions
                            data={d}
                            type={'opportunity'}
                            img={Images.opportunity_name_header}
                          />
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/*<Button className="search-icon bg-transparent border-0 p-0 position-absolute">*/}
                  {/*    <img src={Images.search_small_icon} alt='' className="img-fluid"/>*/}
                  {/*</Button>*/}
                  {window.location.href.includes('create') && opportunityVal &&
                    <span className={`retrieve-oppo ${proposal && 'cursor'}`} onClick={() => {
                      if (!proposal) {
                        this.handleWarningModal(true)
                      }
                    }}
                    >Retrieve information</span>
                  }
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="name"
                        label={"Proposal Name *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Input placeholder={"Proposal Name"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="status"
                        label={"Proposal Status *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        {/* <Select
                                                    suffixIcon={
                                                        <img alt="" src={Images.caret_down_small_select}
                                                             className="img-fluid"/>
                                                    }
                                                    placeholder="Select Status"
                                                >
                                                    <Option value={"created"}>Created</Option>
                                                    <Option value={"sent"}>Sent</Option>
                                                    <Option value={"waiting_on_response"}>Waiting on response</Option>
                                                    <Option value={"closed"}>Closed</Option>
                                                    <Option value={"moved_to_a_project"}>Moved to a project</Option>
                                                </Select> */}
                        <Select
                          labelInValue
                          suffixIcon={
                            <img
                              alt=""
                              src={Images.caret_down_small_select}
                              className="img-fluid"
                            />
                          }
                          placeholder="Status"
                          onFocus={this.getProposalStatusOptions}
                        >
                          {statusTypes.map((item, index) => (
                            <Option value={item.id} key={item.id}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-sm-6">
                <Form.Item
                    name="estimated_revenue"
                    label={"Estimated Revenue"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <InputNumber
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                    </div>
                  
                {/* <div className="col-12 col-sm-6"> */}
                  {/*<Form.Item name="site_owner_account" label={"Site Owner Account *"}*/}
                  {/*           rules={[{*/}
                  {/*               required: true,*/}
                  {/*               message: 'this field is required'*/}
                  {/*           }]} className="position-relative">*/}

                  {/*    <Select*/}
                  {/*        mode="multiple"*/}
                  {/*        placeholder="Search Site Owner Accounts"*/}
                  {/*        notFoundContent={fetching ?*/}
                  {/*            <Spin size="small"/> : null}*/}
                  {/*        filterOption={false}*/}
                  {/*        onFocus={() => this.fetchContacts()}*/}
                  {/*        onSearch={(e) => this.fetchContacts({search: e})}*/}
                  {/*        onChange={this.handleSelect}*/}
                  {/*    >*/}
                  {/*        {contacts.map(d => (*/}
                  {/*            <Option key={d.id}*/}
                  {/*                    value={d.id}>Select Region</Option>*/}
                  {/*        ))}*/}
                  {/*    </Select>*/}
                  {/*</Form.Item>*/}
                  {/*<Button className="search-icon bg-transparent border-0 p-0 position-absolute">*/}
                  {/*    <img src={Images.search_small_icon} alt='' className="img-fluid"/>*/}
                  {/*</Button>*/}
                {/* </div> */}

                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="creation_date"
                        label={"Proposal Creation Date *"}
                        //    rules={[{
                        //        required: true,
                        //        message: 'this field is required'
                        //    }]}
                        className="position-relative"
                      >
                        <DatePicker
                          defaultValue={moment()}
                          format={"MM/DD/YYYY"}
                        // showTime
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="due_date"
                        label={"Due Date"}
                        //    rules={[{
                        //        required: true,
                        //        message: 'this field is required'
                        //    }]}
                        className="position-relative"
                      >
                        <DatePicker
                          format={"MM/DD/YYYY"}
                        // defaultValue={moment()}
                        // showTime
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="response_date"
                        label={"Response by Date"}
                        //    rules={[{
                        //        required: true,
                        //        message: 'this field is required'
                        //    }]}
                        className="position-relative"
                      >
                        <DatePicker
                          format={"MM/DD/YYYY"}
                        // showTime
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6" />
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="project_start_date"
                        label={"Project Start Date"}
                        //    rules={[{
                        //        required: true,
                        //        message: 'this field is required'
                        //    }]}
                        className="position-relative"
                      >
                        <DatePicker
                          format={"MM/DD/YYYY"} />

                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="project_end_date"
                        label={"Project End Date"}
                        //    rules={[{
                        //        required: true,
                        //        message: 'this field is required'
                        //    }]}
                        className="position-relative"
                      >
                        <DatePicker
                          format={"MM/DD/YYYY"}
                        // showTime
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="description"
                    label={"Proposal Description"}
                    //    rules={[{
                    //        required: true,
                    //        message: 'this field is required'
                    //    }]}
                    className="position-relative"
                  >
                    <TextArea
                      className="text-area-main text-area-task"
                      placeholder="Type Here"
                    />
                  </Form.Item>
                </div>

                {/*<div className="col-12">*/}
                {/*    <Form.Item name="qualifiers"*/}
                {/*               label={"Qualifiers"}*/}
                {/*               rules={[{*/}
                {/*                   required: true,*/}
                {/*                   message: 'this field is required'*/}
                {/*               }]} className="position-relative">*/}
                {/*        <TextArea className="text-area-main text-area-task"*/}
                {/*                  placeholder="Lorem ipsum"/>*/}
                {/*    </Form.Item>*/}
                {/*</div>*/}

                {/*<div className="col-12">*/}
                {/*    <Form.Item name="comments"*/}
                {/*               label={"Comments"}*/}
                {/*               rules={[{*/}
                {/*                   required: true,*/}
                {/*                   message: 'this field is required'*/}
                {/*               }]} className="position-relative">*/}
                {/*        <TextArea className="text-area-main text-area-task"*/}
                {/*                  placeholder="• Tap enter to create a new bullet point"/>*/}
                {/*    </Form.Item>*/}
                {/*</div>*/}

                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      loading={buttonLoading}
                      htmlType="submit"
                      className="validate-btn-main"
                    >
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <CommonWarningModal
          heading={"Are you sure you want to retrieve information from this opportunity?"}
          subHeadingUOM={
            "If you click Continue, information would be retrieved from the selected opportunity. Once you click Save & Continue on this widget, you cannot change the associated opportunity anymore."
          }
          uomWarning
          retrieveWarning
          okAction={this.handleRetrieveOpp}
          visible={this.state.visibleRetrieveWarning}
          onClose={() => this.handleWarningModal(false)}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return { ...state };
}

export default connect(mapStateToProps, { opportunityDetailAction })(withRouter(GeneralInformation));
