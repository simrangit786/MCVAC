import React, { Component } from "react";
import { Button, Dropdown, Form, Menu, message, Radio, Select, Spin, } from "antd";
import { Image as Images } from "../../Images";
import { withRouter } from "react-router-dom";
import { getUser } from "../../../Controller/api/authServices";
import { getProposalById, updateProposal, } from "../../../Controller/api/proposalServices";
import { getShortName } from "../../../Controller/utils";
import CommonWarningModal from "../../modals/CommonWarningModal";
import { handleError } from '../../../Controller/Global';

const { Option } = Select;
const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const types = {
    salesPerson: "salesperson",
    salesAssistant: "salesassistant",
    salesManager: "salesmanager",
};

const typeForm = {
    salesPerson: "sales_person",
    salesAssistant: "sales_assistant",
    salesManager: "sales_manager",
};

class ProposalTeamsCreate extends Component {
    state = {
        salesPerson: [],
        salesAssistant: [],
        salesManager: [],
        salesPersonSelected: [],
        salesAssistantSelected: [],
        salesManagerSelected: [],
        fetching: false,
        buttonLoading: false,
    };
    formRef = React.createRef();

    showWarningModal = (visible, item, type) => {
        if (visible) {
            this.setState({ item, type });
        }
        this.setState({
            visible: visible,
        });
    };

    menu = (item, type) => (
        <Menu>
            <Menu.Item key="0">
                <Button
                    onClick={() => {
                        // this.removeUsers(item, type)
                        this.showWarningModal(true, item, type);
                    }}
                    className="border-0 bg-transparent text-center p-0 w-100"
                >
                    Remove
                </Button>
            </Menu.Item>
        </Menu>
    );

    removeUsers = () => {
        const { item, type } = this.state;
        this.setState({
            [`${type}Selected`]: this.state[`${type}Selected`].filter(
                (i) => i.id !== item.id
            ),
        });
        // this.formRef.current.setFieldsValue({
        //     [typeForm[type]]: this.formRef.current.getFieldValue(typeForm[type]).drawer(i => i !== item.id)
        // })
    };

    fetchUser = (type, search = {}) => {
        this.setState({ fetching: true });
        getUser(types[type], search)
            .then((res) => {
                this.setState({
                    [type]: res.data.results,
                    fetching: false,
                });
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

    handleSelect = (e, type) => {
        const { salesAssistantSelected, salesManagerSelected, salesPersonSelected } = this.state;
        if (salesManagerSelected.length == 0 &&
            salesPersonSelected.length == 0 &&
            salesAssistantSelected.length == 0) {
            this.handleUpdatePoc(e)
        }
        this.formRef.current.setFieldsValue({
            [typeForm[type]]: null,
        });
        let data = this.state[type].filter((i) => e === i.id);
        let newData = this.state[`${type}Selected`]?.find((n) => e === n.id);
        if (newData) {
            return null;
        } else {
            this.setState((prevState) => {
                return {
                    [`${type}Selected`]: [...prevState[`${type}Selected`], ...data],
                };
            });
        }
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        if(id) {
            getProposalById(id).then((res) => {
                this.setState({
                    salesPersonSelected: res?.data?.sales_person || [],
                    salesAssistantSelected: res?.data?.sales_assistant || [],
                    salesManagerSelected: res?.data?.sales_manager || [],
                });
                this.fetchUser("salesManager");
                this.fetchUser("salesAssistant");
                this.fetchUser("salesPerson");

            }).catch((err)=>{
                handleError(err)
            })
    }else{
        this.setState({
            salesPersonSelected: this.props.proposal?.sales_person || [],
            salesAssistantSelected: this.props.proposal?.sales_assistant || [],
            salesManagerSelected: this.props.proposal?.sales_manager || [],
        });
        this.fetchUser("salesManager");
        this.fetchUser("salesAssistant");
        this.fetchUser("salesPerson");
    }
    }

    // componentDidUpdate(prevProps, prevState) {
    //   if((prevProps.proposal.sales_person.length != this.props.proposal.sales_person.length) || (prevProps.proposal.sales_assistant.length != this.props.proposal.sales_manager.length) || (prevProps.proposal.sales_manager.length != this.props.proposal.sales_assistant.length)) {
    //     this.setState({
    //       salesPersonSelected: this.props.proposal?.sales_person || [],
    //       salesAssistantSelected: this.props.proposal?.sales_assistant || [],
    //       salesManagerSelected: this.props.proposal?.sales_manager || [],
    //     });
    //   }
    // }

    handleSubmit = () => {
        const { salesManagerSelected, salesAssistantSelected, salesPersonSelected } = this.state;
        if (salesManagerSelected.length > 0 || salesAssistantSelected.length > 0 || salesPersonSelected.length > 0) {
            this.setState({ buttonLoading: true });
            const values = {
                sales_manager: this.state.salesManagerSelected.map((i) => i.id),
                sales_assistant: this.state.salesAssistantSelected.map((i) => i.id),
                sales_person: this.state.salesPersonSelected.map((i) => i.id),
            };
            if (this.props.match.params.id) {
                updateProposal(this.props.match.params.id, values)
                    .then((res) => {
                        message.success("Team Updated Successfully!");
                        this.props.setProposal(res.data, 3);
                        this.setState({ buttonLoading: false });
                    })
                    .catch((err) => {
                        if (err.response) {
                            Object.keys(err.response.data).map((e) => {
                                message.error(err.response.data[e]);
                            });
                        }
                        this.setState({ buttonLoading: false });
                    });
            } else {
                updateProposal(this.props.proposal?.id, values)
                    .then((res) => {
                        message.success("Team added Successfully!");
                        this.props.setProposal(res.data, 3);
                        this.setState({ buttonLoading: false });
                    })
                    .catch((err) => {
                        if (err.response) {
                            Object.keys(err.response.data).map((e) => {
                                message.error(err.response.data[e]);
                            });
                        }
                        this.setState({ buttonLoading: false });
                    });
            }
        }
    };

    handleUpdatePoc = (itemId) => {
        updateProposal(this.props.proposal.id, { point_proposal: itemId })
            .then((res) => {
                this.props.setProposal(res.data);
            })
            .catch((err) => {
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
            });
    };

    render() {
        return (
            <React.Fragment>
                <div className="row common-form-card-row general-info">
                    <div className="col-12">
                        <div className="row info-gray-div align-items-center">
                            <h6 className="mb-0">
                                A minimum of one team member must be assigned in order to Save & Continue.
                            </h6>
                        </div>
                    </div>
                    <div className="col-12 p-0">
                        <Form
                            onFinish={this.handleSubmit}
                            requiredMark={false}
                            ref={this.formRef}
                            {...layout}
                            className="main-inner-form"
                        >
                            <Radio.Group value={this.props.proposal?.point_proposal}>
                                <div className="row">
                                    <div className="col-12 col-sm-12">
                                        <div className="row">
                                            <div className="col-12">
                                                <Form.Item
                                                    name="sales_manager"
                                                    label={"Sales Managers"}
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: "",
                                                        },
                                                    ]}
                                                    className="position-relative search-overlap"
                                                >
                                                    <Select
                                                        dropdownClassName={"option-design-fix"}
                                                        // mode="multiple"
                                                        placeholder="Search"
                                                        notFoundContent={
                                                            this.state.fetching ? <Spin size="small" /> : null
                                                        }
                                                        filterOption={false}
                                                        onChange={(e) =>
                                                            this.handleSelect(e, "salesManager")
                                                        }
                                                        showSearch={true}
                                                        onFocus={() => this.fetchUser("salesManager")}
                                                        onSearch={(e) =>
                                                            this.fetchUser("salesManager", { search: e })
                                                        }
                                                        className="custom-search-select"
                                                    >
                                                        {this.state.salesManager.map((d) => (
                                                            <Option key={d.id} value={d.id}>
                                                                <div
                                                                    className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                                                    <div className="common-select-option-row">
                                                                        <div
                                                                            className="select-option-details d-flex align-items-center">
                                                                            <div className={"select-option-icon"}>
                                                                                <span className="text-uppercase user-name-tg">
                                                                                    {getShortName(
                                                                                        d.first_name,
                                                                                        d.last_name
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <h6 className="mb-0">{`${d.first_name} ${d.last_name}`}</h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-green-tag select-text-tier">
                                                                        Sales Manager
                                                                    </div>
                                                                </div>
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Button
                                                    className="search-icon bg-transparent border-0 p-0 position-absolute">
                                                    <img
                                                        src={Images.search_small_icon}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                </Button>
                                                {/* <Button
                                                // onClick={() => this.showSalesManager(true)}
                                                className="create-btn-main position-absolute">
                                                <span>+ Create</span>
                                            </Button> */}
                                            </div>
                                            {this.state.salesManagerSelected?.length === 0 && (
                                                <div className="col-12">
                                                    <div
                                                        className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                                        <div className="col-12 text-center">
                                                            <img
                                                                alt={""}
                                                                className="img-fluid"
                                                                src={Images.teams_labor_no_data_icon}
                                                            />
                                                            <h6 className="mb-0">No Sales Managers</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {this.state.salesManagerSelected?.map((i) => (
                                                <div key={i.id} className="col-6">
                                                    <div
                                                        className={`row mx-0 mb-3 pb-0 opportunity-info-div-main align-items-center user-info-div-main position-relative ${this.props.proposal?.point_proposal === i.id &&
                                                            "active"
                                                            }`}
                                                    >
                                                        <div className="col-12 contact-col-12">
                                                            <div className="user-icons-div">
                                                                <span
                                                                    className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                                                    {getShortName(i.first_name, i.last_name)}
                                                                </span>
                                                            </div>
                                                            <div className="user-info-div">
                                                                <h6>{`${i.first_name} ${i.last_name}`}</h6>
                                                                <p className="mb-0">Sales Manager</p>
                                                            </div>
                                                            <Dropdown
                                                                overlayClassName="add-remove-dropdown-main"
                                                                overlay={() => this.menu(i, "salesManager")}
                                                                placement="bottomCenter"
                                                                trigger={["click"]}
                                                            >
                                                                <Button
                                                                    className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                                                    onClick={(e) => e.preventDefault()}
                                                                >
                                                                    <img
                                                                        src={Images.black_dots_elipsis}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="col-12 p-0 radio-btn-custom">
                                                            <Radio
                                                                className="active"
                                                                onChange={() => this.handleUpdatePoc(i.id)}
                                                                value={i.id}
                                                            >
                                                                Point of Contact
                                                            </Radio>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-12">
                                        <div className="row">
                                            <div className="col-12 position-relative">
                                                <Form.Item
                                                    name="sales_person"
                                                    label={"Salespeople"}
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: "",
                                                        },
                                                    ]}
                                                    className="search-overlap"
                                                >
                                                    <Select
                                                        dropdownClassName={"option-design-fix"}
                                                        // mode="multiple"
                                                        placeholder="Search"
                                                        notFoundContent={
                                                            this.state.fetching ? <Spin size="small" /> : null
                                                        }
                                                        showSearch={true}
                                                        filterOption={false}
                                                        onChange={(e) =>
                                                            this.handleSelect(e, "salesPerson")
                                                        }
                                                        onFocus={() => this.fetchUser("salesPerson")}
                                                        onSearch={(e) =>
                                                            this.fetchUser("salesPerson", { search: e })
                                                        }
                                                        className="custom-search-select"
                                                    >
                                                        {this.state.salesPerson.map((d) => (
                                                            <Option key={d.id} value={d.id}>
                                                                <div
                                                                    className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                                                    <div className="common-select-option-row">
                                                                        <div
                                                                            className="select-option-details d-flex align-items-center">
                                                                            <div className={"select-option-icon"}>
                                                                                <span className="text-uppercase user-name-tg">
                                                                                    {getShortName(
                                                                                        d.first_name,
                                                                                        d.last_name
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <h6 className="mb-0">{`${d.first_name} ${d.last_name}`}</h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-green-tag select-text-tier">
                                                                        Salesperson
                                                                    </div>
                                                                </div>
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Button
                                                    className="search-icon bg-transparent border-0 p-0 position-absolute">
                                                    <img
                                                        src={Images.search_small_icon}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                </Button>
                                                {/* <Button
                                                // onClick={() => this.showSalesManager(true)}
                                                className="create-btn-main position-absolute">
                                                <span>+ Create</span>
                                            </Button> */}
                                            </div>
                                            {this.state.salesPersonSelected?.length === 0 && (
                                                <div className="col-12">
                                                    <div
                                                        className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                                        <div className="col-12 text-center">
                                                            <img
                                                                alt={""}
                                                                className="img-fluid"
                                                                src={Images.teams_labor_no_data_icon}
                                                            />
                                                            <h6 className="mb-0">No Salespeople</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {this.state.salesPersonSelected?.map((i) => (
                                                <div key={i.id} className="col-6">
                                                    <div
                                                        className={`row mx-0 mb-3 pb-0 opportunity-info-div-main align-items-center user-info-div-main position-relative ${this.props.proposal.point_proposal === i.id &&
                                                            "active"
                                                            }`}
                                                    >
                                                        <div className="col-12 contact-col-12">
                                                            <div className="user-icons-div">
                                                                <span
                                                                    className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                                                    {getShortName(i.first_name, i.last_name)}
                                                                </span>
                                                            </div>
                                                            <div className="user-info-div">
                                                                <h6>{`${i.first_name} ${i.last_name}`}</h6>
                                                                <p className="mb-0">Salesperson</p>
                                                            </div>
                                                            <Dropdown
                                                                overlayClassName="add-remove-dropdown-main"
                                                                overlay={() => this.menu(i, "salesPerson")}
                                                                placement="bottomCenter"
                                                                trigger={["click"]}
                                                            >
                                                                <Button
                                                                    className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                                                    onClick={(e) => e.preventDefault()}
                                                                >
                                                                    <img
                                                                        src={Images.black_dots_elipsis}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="col-12 p-0 radio-btn-custom">
                                                            <Radio
                                                                className="active"
                                                                onChange={() => this.handleUpdatePoc(i.id)}
                                                                value={i.id}
                                                            >
                                                                Point of Contact
                                                            </Radio>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-12">
                                        <div className="row">
                                            <div className="col-12">
                                                <Form.Item
                                                    name="sales_assistant"
                                                    label={"Sales Assistants"}
                                                    rules={[
                                                        {
                                                            required: false,
                                                            message: "",
                                                        },
                                                    ]}
                                                    className="position-relative search-overlap"
                                                >
                                                    <Select
                                                        dropdownClassName={"option-design-fix"}
                                                        // mode="multiple"
                                                        placeholder="Search"
                                                        notFoundContent={
                                                            this.state.fetching ? <Spin size="small" /> : null
                                                        }
                                                        showSearch={true}
                                                        filterOption={false}
                                                        onChange={(e) =>
                                                            this.handleSelect(e, "salesAssistant")
                                                        }
                                                        onFocus={() => this.fetchUser("salesAssistant")}
                                                        onSearch={(e) =>
                                                            this.fetchUser("salesAssistant", { search: e })
                                                        }
                                                        className="custom-search-select"
                                                    >
                                                        {this.state.salesAssistant?.map((d) => (
                                                            <Option key={d.id} value={d.id}>
                                                                <div
                                                                    className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                                                    <div className="common-select-option-row">
                                                                        <div
                                                                            className="select-option-details d-flex align-items-center">
                                                                            <div className={"select-option-icon"}>
                                                                                <span className="text-uppercase user-name-tg">
                                                                                    {getShortName(
                                                                                        d.first_name,
                                                                                        d.last_name
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <h6 className="mb-0">{`${d.first_name} ${d.last_name}`}</h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-green-tag select-text-tier">
                                                                        Sales Assistant
                                                                    </div>
                                                                </div>
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Button
                                                    className="search-icon bg-transparent border-0 p-0 position-absolute">
                                                    <img
                                                        src={Images.search_small_icon}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                </Button>
                                                {/* <Button
                                                // onClick={() => this.showSalesManager(true)}
                                                className="create-btn-main position-absolute">
                                                <span>+ Create</span>
                                            </Button> */}
                                            </div>
                                            {this.state.salesAssistantSelected?.length === 0 && (
                                                <div className="col-12">
                                                    <div
                                                        className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                                        <div className="col-12 text-center">
                                                            <img
                                                                alt={""}
                                                                className="img-fluid"
                                                                src={Images.teams_labor_no_data_icon}
                                                            />
                                                            <h6 className="mb-0">No Sales Assistants</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {this.state.salesAssistantSelected?.map((i) => (
                                                <div key={i.id} className="col-6">
                                                    <div
                                                        className={`row mx-0 mb-3 pb-0 opportunity-info-div-main align-items-center user-info-div-main position-relative ${this.props.proposal.point_proposal === i.id &&
                                                            "active"
                                                            }`}
                                                    >
                                                        <div className="col-12 contact-col-12">
                                                            <div className="user-icons-div">
                                                                <span
                                                                    className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                                                    {getShortName(i.first_name, i.last_name)}
                                                                </span>
                                                            </div>
                                                            <div className="user-info-div">
                                                                <h6>{`${i.first_name} ${i.last_name}`}</h6>
                                                                <p className="mb-0">Sales Assistant</p>
                                                            </div>
                                                            <Dropdown
                                                                overlayClassName="add-remove-dropdown-main"
                                                                overlay={() => this.menu(i, "salesAssistant")}
                                                                placement="bottomCenter"
                                                                trigger={["click"]}
                                                            >
                                                                <Button
                                                                    className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                                                    onClick={(e) => e.preventDefault()}
                                                                >
                                                                    <img
                                                                        src={Images.black_dots_elipsis}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                        <div className="col-12 p-0 radio-btn-custom">
                                                            <Radio
                                                                className="active"
                                                                onChange={() => this.handleUpdatePoc(i.id)}
                                                                value={i.id}
                                                            >
                                                                Point of Contact
                                                            </Radio>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-12 validate-div-col text-md-right">
                                        <Form.Item>
                                            <Button
                                                loading={this.state.buttonLoading}
                                                htmlType={"submit"}
                                                className="validate-btn-main"
                                            >
                                                Save and Continue
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </div>
                            </Radio.Group>
                        </Form>
                    </div>
                </div>
                <CommonWarningModal
                    visible={this.state.visible}
                    onClose={() => this.showWarningModal(false)}
                    heading={"Are you sure you want to remove this Team Member?"}
                    subHeadingUOM={
                        "If you choose to remove this Team Member, this might cause issues."
                    }
                    common
                    commonFunc={() => {
                        this.removeUsers();
                        this.showWarningModal(false);
                    }}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(ProposalTeamsCreate);
