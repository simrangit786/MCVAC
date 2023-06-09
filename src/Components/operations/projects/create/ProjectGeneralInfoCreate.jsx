import React, { Component } from 'react';
import { getOpportunities, getSource } from "../../../../Controller/api/opportunityServices";
import { Button, DatePicker, Form, Input, message, Select, Spin } from "antd";
import { handleError } from "../../../../Controller/Global";
import moment from "moment";
import { Image as Images } from "../../../Images";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { connect } from "react-redux";
import { ProposalDetailAction } from "../../../../Store/actions/proposalAction";
import { withRouter } from "react-router-dom";
import { createProject, getAssociateProposals, getProjectStatusOptions, updateProject } from '../../../../Controller/api/projectServices';
import { useEffect } from 'react';
import CustomSelectOption from '../../../CustomSelectOption';
const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { TextArea } = Input;
class ProjectGeneralInfoCreate extends Component {
  state = {
    opportunities: [],
    proposals: [],
    fetching: false,
    buttonLoading: false,
    statusTypes: [],
    visibleRetrieveWarning: false,
    retrieve_pro: false,
    proposalVal: null,
    source: []
  };
  formRef = React.createRef();

  componentDidMount() {
    this.getProjectStatusOptions(true);

  }

  // fetchOpportunities = (params = {}) => {
  //   this.setState({ fetching: true });
  //   getOpportunities(params)
  //     .then((res) => {
  //       this.setState({ opportunities: res.data.results, fetching: false });
  //     })
  //     .catch((err) => {
  //       handleError(err)
  //       this.setState({ fetching: false });
  //     });
  // };

  fetchProposals = (params = {}) => {
    this.setState({ fetching: true });
    getAssociateProposals(params)
      .then((res) => {
        this.setState({ proposals: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err)
        this.setState({ fetching: false });
      });
  };

  getProjectStatusOptions = (SET_DEFAULT, params) => {

    getProjectStatusOptions(params)
      .then((res) => {
        this.setState({ statusTypes: res.data.results });
        if (SET_DEFAULT) {
          let status = res.data.results.find(ele => ele.title === 'Under Review')
          if (this.props.location.pathname?.includes('create')) {
            this.formRef.current.setFieldsValue({
              status: {
                label: status?.title,
                value: status?.id
              }
            })
          }
        }
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSubmit = (values, FIRST_UPDATE) => {
    console.log(values,"values")
    const { retrieve_pro } = this.state;
    const { proposal_data } = this.props;
    this.setState({ buttonLoading: true })


    if (retrieve_pro && !this.props.proposal) {
      values.retrieve_proposal = retrieve_pro
    }

    // console.log(values.opportunity, "values")
    if (values.opportunity) {
      values.opportunity = proposal_data?.opportunity ? proposal_data?.opportunity.id : null;
    }
    // console.log(proposal_data, values, "dsfsd")
    values.status = values.status.value;
    values.project_end_date = values.project_end_date?.format("YYYY-MM-DD");
    values.project_start_date = values.project_start_date?.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD")
    values.source = values.source ? values.source.value : null
    values.proposal = values.proposal?.value
    console.log(values,"values")
    if (this.props.project) {
      // delete values.opportunity;
      updateProject(this.props.project.id, values)
        .then((res) => {
          this.props.setProject(res.data, 2);
          this.setState({ buttonLoading: false });
          if (!FIRST_UPDATE) {
            message.success("Project Updated Successfully");
          }
        })
        .catch((err) => {
          handleError(err);
          this.setState({ buttonLoading: false });
        });
    } else {
      createProject(values)
        .then((res) => {
          this.props.setProject(res.data, 2);
          this.setState({ buttonLoading: false, retrieve_pro: false });
          message.success("Project Created Successfully");
        })
        .catch((err) => {
          handleError(err);
          this.setState({ buttonLoading: false });
        });
    }
  };

  handleRetrieveProposal = () => {
    const { proposal_data } = this.props;
    this.setState({ retrieve_pro: true, visibleRetrieveWarning: false }, () => {
      const values = {
        project_start_date: proposal_data?.project_start_date ? moment(proposal_data?.project_start_date) : null,
        project_end_date: proposal_data?.project_end_date ? moment(proposal_data?.project_end_date) : null,
        description: proposal_data?.description,
        name: proposal_data?.name,
        opportunity: proposal_data?.opportunity?.name
      }
      this.formRef.current.setFieldsValue({
        ...values,
      })
    })
  }

  handleWarningModal = visibleRetrieveWarning => {
    this.setState({ visibleRetrieveWarning })
  }

  handleSelectProposal = proposalVal => {
    this.setState({ proposalVal }, () => {
      this.props.ProposalDetailAction(proposalVal?.value)
    })
  }

  fetchSource = (search = {}) => {
    this.setState({ fetching: true });
    getSource(search)
      .then((res) => {
        this.setState({ source: res.data.results });
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        this.setState({ fetching: false });
      })
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.project !== this.props.project) {

      this.formRef.current.setFieldsValue({
        ...this.props.project,
        status: {
          label: this.props.project.status?.title,
          value: this.props.project.status?.id,
        },
        proposal: {
          value: this.props.project.proposal?.id,
          label: this.props.project.proposal?.name,
        },
        opportunity: this.props.project.opportunity?.name,
        source: {
          value: this.props.project.source?.id,
          label: this.props.project.source?.name,
        },
        project_start_date: this.props.project.project_start_date
          ? moment(this.props.project.project_start_date)
          : moment(),
        due_date: this.props.project.due_date
          ? moment(this.props.project.due_date)
          : null,
        response_date: this.props.project.response_date
          ? moment(this.props.project.response_date)
          : null,
        // project_start_date:
        //   this.props.project.project_start_date ? moment(this.props.project.project_start_date) : null,
        project_end_date: this.props.project.project_end_date ? moment(this.props.project.project_end_date) : null,
      });
      // }
    }
  }


  render() {
    const { fetching, buttonLoading, statusTypes, proposalVal, proposals, source } = this.state;
    const { project } = this.props
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">Please input general information for project.</h6>
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="proposal"
                    label={"Associated Proposal"}
                    //    rules={[{
                    //        required: true,
                    //        message: 'this field is required'
                    //    }]}
                    className="position-relative"
                  >
                    <Select
                      labelInValue
                      disabled={project?.proposal}
                      showSearch={true}
                      placeholder="Associated Proposal"
                      dropdownClassName="custom-select-drop-main"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSelect={value => this.handleSelectProposal(value)}
                      onFocus={() => this.fetchProposals()}
                      onSearch={(e) => this.fetchProposals({ search: e })}
                      optionLabelProp={"label"}
                    >
                      {proposals.map((d) => (
                        <Option key={d.id} label={d.name} value={d.id}>
                          {/* {d.name} */}
                          <CustomSelectOption
                            img={Images.proposal_dropdown}
                            data={d}
                            type={"Proposal"}
                          />
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                    <img src={Images.search_small_icon} alt='' className="img-fluid" />
                  </Button> */}
                  {window.location.href.includes('create') && proposalVal &&
                    <span className={`retrieve-oppo ${project && 'cursor'}`}
                      // <span className={`retrieve-oppo`}
                      onClick={() => {
                        if (!project) {
                          this.handleWarningModal(true)
                        }
                      }}
                    >Retrieve information</span>
                  }
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="opportunity"

                    label={"Associated Opportunity"}
                    rules={[
                      {
                        required: false,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    {/* <Select
                      labelInValue
                      // disabled={project?.opportunity}
                      disabled={true}
                      showSearch={true}

                      placeholder="Associated Opportunity"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      // onSelect={value => this.handleSelectOpp(value)}
                      onFocus={() => this.fetchOpportunities()}
                      onSearch={(e) => this.fetchOpportunities({ search: e })}
                    >
                      {opportunities.map((d) => (
                        <Option key={d.id} value={d.id}>
                          {d.name}
                        </Option>
                      ))}
                    </Select> */}
                    <Input placeholder="Associated opportunity" disabled={true} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="name"
                        label={"Project Name *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Input placeholder="Project Name" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="status"
                    label={"Project Status *"}
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
                      showSearch
                      labelInValue
                      // defaultValue={this.statusvalue}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Status"
                      onFocus={() => this.getProjectStatusOptions(false)}
                      onSearch={(e) => this.getProjectStatusOptions(false, { search: e })}
                    >
                      {statusTypes.map((item, index) => (
                        <Option value={item.id} key={item.id}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="source"
                    label={"Project Source"}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "this field is required",
                    //   },
                    // ]}
                  >
                    <Select
                      showSearch
                      labelInValue
                      filterOption={false}
                      onSearch={(e) => this.fetchSource({ search: e })}
                      onFocus={() => this.fetchSource()}
                      notFoundContent={
                        this.state.fetching ? (
                          <Spin size="small" />
                        ) : (
                          "Not Found"
                        )
                      }
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Source"
                    >
                      {source.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6" />
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="project_start_date"
                    label={"Project Start Date"}
                    //  rules={[{
                    //      required: true,
                    //      message: 'this field is required'
                    //  }]}
                    className="position-relative"
                  >
                    <DatePicker
                      defaultValue={moment()}
                      format={"MM/DD/YYYY"}
                    // showTime
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
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
                    // defaultValue={moment()}
                    // showTime
                    />
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="description"
                    label={"Description"}
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
          heading={"Are you sure you want to retrieve information from this proposal?"}
          subHeadingUOM={
            "If you click Continue, information would be retrieved from the selected proposal. Once you click Save & Continue on this widget, you cannot change the associated proposal anymore."
          }
          uomWarning
          retrieveWarning
          okAction={this.handleRetrieveProposal}
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
// export default ProjectGeneralInfoCreate;
export default connect(mapStateToProps, { ProposalDetailAction })(withRouter(ProjectGeneralInfoCreate));
