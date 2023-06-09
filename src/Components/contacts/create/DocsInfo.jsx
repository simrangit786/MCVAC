import React, {Component} from "react";
import {Button, Form, message, Table, Upload} from "antd";
import {withRouter} from "react-router-dom";
import {Image as Images} from "../../Images";
import {formatFileSize} from "../../../Controller/utils";
import {createContactDocument, getContactDocument,} from "../../../Controller/api/contactsServices";

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24},
};

class DocsInfo extends Component {
    state = {
        files: [],
    };
    columns = [
        {
            title: "name",
            dataIndex: "name",
            sorter: true,
            render: (data) => (
                <div>
                    <img src={Images.docs_file_icon} alt="" className="img-fluid"/>
                    <span className="ml-2">{data}</span>
                </div>
            ),
        },
        {
            title: "Size",
            dataIndex: "size",
            sorter: true,
            render: (data) => <div>{formatFileSize(data)}</div>,
        },
        {
            title: "FILE Format",
            dataIndex: "format",
            sorter: true,
        },
    ];
    uploadFile = (data) => {
        let file = data.file;
        let form_data = new FormData();
        form_data.append("contact", this.props.contact.id);
        form_data.append("document", file);
        createContactDocument(form_data)
            .then((res) => {
                this.fetchFiles();
            })
            .catch((err) => {
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
            });
    };

    fetchFiles = () => {
        getContactDocument({contact: this.props.contact.id})
            .then((res) => {
                this.setState({files: res.data.results});
            })
            .catch((err) => {
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
            });
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            this.fetchFiles();
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="row common-form-card-row">
                    <div className="col-12">
                        <Form {...layout} className="main-inner-form">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row info-gray-div align-items-center">
                                        <h6 className="mb-0">
                                            Please upload all related documents here.
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 p-0">
                                    <Form.Item
                                        name="Documents"
                                        label={"Documents"}
                                        rules={[
                                            {
                                                required: true,
                                                message: "this field is required",
                                            },
                                        ]}
                                    >
                                        <Upload
                                            multiple
                                            showUploadList={false}
                                            customRequest={this.uploadFile}
                                        >
                                            <Button
                                                className="upload-file-btn w-100 d-flex align-items-center justify-content-center">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <img
                                                            src={Images.cloud_upload_24}
                                                            alt="cloud icon"
                                                            className="img-fluid"
                                                        />
                                                    </div>
                                                    <div className="col-12 mt-1">
                                                        Drag & Drop or <span className="ml-1">Browse</span>
                                                    </div>
                                                </div>
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                </div>
                                <div className="col-12 px-0 table-responsive main-table-div">
                                    {this.state.files.length === 0 ? (
                                        ""
                                    ) : (
                                        <Table
                                            pagination={false}
                                            className="main-table-all border-0 carpet-cleaning-table"
                                            columns={this.columns}
                                            dataSource={this.state.files}
                                            size="middle"
                                            locale={{emptyText: " "}}
                                        />
                                    )}
                                </div>
                                <div className="col-12 validate-div-col text-md-right">
                                    <Button className="validate-btn-main">
                                        Save and Continue
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(DocsInfo);
