import React, {Component} from "react";
import {Button, Drawer, Form, Input, message,} from "antd";
import {withRouter} from "react-router-dom";
import { createContactPosition } from "../../../Controller/api/contactsServices";
import { handleError } from "../../../Controller/Global";

const layout = {
    labelCol: {span: 24}, wrapperCol: {span: 24},
};

class CreatePositionDrawer extends Component {
    formRef = React.createRef();

    handleCreatePosition = () => {
        createContactPosition({name: this.formRef.current.getFieldValue('position')}).then(res =>{
            message.success('Position created successfully!');
            this.props.onClose();
        }).catch(Err =>{
            handleError(Err)
        })
    }
    render() {
        return (<React.Fragment>
            <Drawer
                centered
                destroyOnClose={true}
                closable={true}
                title="Create Position"
                visible={this.props.visible}
                onClose={() =>
                    this.props.onClose()
                    // this.state.unsavedExit ? this.setState({drawerVisible: true}) : this.handleClose();
                }
                onCancel={() =>
                    this.props.onClose()
                    // this.state.unsavedExit ? this.setState({drawerVisible: true}) : this.props.onClose();
                }
                className="main-all-form-modal main-drawer-div drawer-update"
                width={"500px"}
                placement={"right"}
                maskClosable={false}
                footer={<div
                    style={{
                        textAlign: "right",
                    }}
                >
                    <Button
                        onCancel={() => this.props.onClose()}
                        style={{marginRight: 8}}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => this.formRef.current.submit()}
                        type="primary"
                    >
                        Create
                    </Button>
                </div>}
            >
                <div className="row mx-0 inner-modal-main-row">
                    <div className="col-12">
                        <div className="row mx-0">
                            <Form
                                ref={this.formRef}
                                onFinish={this.handleCreatePosition}
                                {...layout}
                                hideRequiredMark={true}
                                className="main-inner-form w-100"
                            >
                                <div className="col-12">
                                    <Form.Item
                                        name="position"
                                        label={"Position *"}
                                        rules={[{
                                            required: true, message: "this field is required",
                                        },]}
                                    >
                                        <Input placeholder="Position"/>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </Drawer>
            {/*<CommonConfirmationModal
                    heading={"You’ve successfully created this Contact!"}
                    subHeading={
                        <p className="mb-0">To view this Contact, select View Contact</p>
                    }
                    okTitle={"View Contact"}
                    okAction={() => {
                        this.showConfirmModal(false);
                        this.props.onClose();
                    }}
                    visible={this.state.visibleConfirm}
                    onClose={() => {
                        this.showConfirmModal(false);
                        this.props.onClose();
                    }}
                />*/}
            {/*<CommonWarningModal
                    newCommonModal
                    // wageInfoDelete
                    removeConFunc={() => {
                        this.handleRemove(this.state.item, this.state.type);
                        this.setState({
                            item: null,
                            type: null,
                            visible: false
                        });
                    }}
                    heading={`Are you sure you want to remove this ${this.state.type === "email" ? 'email' : 'phone number'}?`}
                    subHeadingUOM={" "}
                    visible={this.state.visible}
                    // commonFunc={() => }
                    onClose={() => this.handleDeleteModal(false)}
                />*/}
        </React.Fragment>);
    }
}

export default withRouter(CreatePositionDrawer);