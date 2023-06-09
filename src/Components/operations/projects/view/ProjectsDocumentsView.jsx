import React, { Component } from 'react';
import { Button, message, Table, Upload } from "antd";
import { Image as Images } from "../../../Images";
import { formatFileSize } from '../../../../Controller/utils';
import { getProjectDocuments, createProjectDocument } from '../../../../Controller/api/projectServices';
import { handleError } from '../../../../Controller/Global';
import { withRouter } from 'react-router-dom';

class ProjectsDocumentsView extends Component {
    state = {
        files: [],
    };
    docsColumns = [
        {
            title: "name",
            dataIndex: "name",
            sorter: true,
            render: (data) => (
                <div>
                    <img src={Images.docs_file_icon} alt="" className="img-fluid" />
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

    componentDidMount() {
        this.fetchFiles()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.project?.documents?.length !== this.props.project?.documents?.length) {
            this.fetchFiles()
        }
    }

    fetchFiles = (params = {}) => {
        params.project = this.props.match.params.id;
        getProjectDocuments(params)
            .then((res) => {
                this.setState({ files: res.data.results });
            })
            .catch((err) => {
                handleError(err);
            });
    };

    uploadFile = (data) => {
        let file = data.file;
        let form_data = new FormData();
        form_data.append("project", this.props.match.params.id);
        form_data.append("document", file);
        createProjectDocument(form_data)
            .then((res) => {
                this.fetchFiles();
            })
            .catch((err) => {
               handleError(err)
            });
    };
    render() {
        const { files } = this.state;
        return (<React.Fragment>
            <div className={`row mx-0 ${!this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""}`}
            >
                <div className="col-12">
                    <div className={`row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${!this.props.hideTitle ? "border-1" : ""}`}>
                        <div className="search-bar-div d-flex align-items-center">
                          
                            <Upload 
                              multiple
                              showUploadList={false}
                              customRequest={this.uploadFile}
                            >
                                <Button className="add-btn-collapse ml-2 text-capitalize">
                                    + Upload
                                </Button>
                            </Upload>
                        </div>
                        {this.props.hideTitle && (
                            <Button
                                onClick={() => this.props.onTabChange("6")}
                                className="view-all-btn text-uppercase"
                            >
                                VIEW ALL{" "}
                            </Button>
                        )}
                    </div>
                </div>
                <div className="col-12 table-responsive main-table-div">
                    {files.length > 0 ? (
                        <Table pagination={false}
                            
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        window.open(record.document, "_blank");
                                    },
                                };
                            }}
                            className="main-table-all carpet-cleaning-table border-0"
                            columns={this.docsColumns}
                            dataSource={files}
                            size="middle"
                        />
                    ) : (
                        <div className="documents-upload-height d-flex align-items-center justify-content-center w-100">
                            <Upload
                                multiple
                                showUploadList={false}
                                customRequest={this.uploadFile}
                            >
                                <Button className="bg-transparent border-0 p-0 shadow-none h-auto">
                                    <img
                                        src={Images.cloud_upload_24}
                                        alt={"cloud icon"}
                                        className="img-fluid"
                                    />
                                    <p style={{ textAlign: "center", color: "#38BC94" }}>
                                        {" "}
                                        Upload Document{" "}
                                    </p>
                                </Button>
                            </Upload>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>);
    }
}

export default withRouter(ProjectsDocumentsView);