import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, message, Table, Upload } from "antd";
import { Image as Images } from "../../../Images";
import {
  createDocument,
  getOpportunityDocuments,
} from "../../../../Controller/api/opportunityServices";
import { formatFileSize } from "../../../../Controller/utils";
import { handleError } from "../../../../Controller/Global";

const Documents = props => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1,
    pageSize: 15})

  const docsColumns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render: (name) => (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">{name}</div>
        </div>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      sorter: true,
      render: (size) => (
        <div className="name-id-details">{formatFileSize(size)} </div>
      ),
    },
    {
      title: <div className="position-relative">FORMAT</div>,
      dataIndex: "format",
      sorter: true,
      render: (format) => <div className="name-id-details">.{format}</div>,
    },
  ];

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = (params = {}) => {
    setLoading(true)
    const opportunity = props.opportunity;
    params.opportunity = opportunity.id;
    getOpportunityDocuments(params)
      .then((response) => {
        setData(response.data.results)
        setLoading(false);
        setPagination(prevState => {
          return {...prevState, current: params.page || 1,
            total: response.data.count, }
        })
      })
      .catch((err) => {
        handleError(err)
        setLoading(false)
      });
  };
  const uploadFile = (data) => {
    let file = data.file;
    let form_data = new FormData();
    form_data.append("opportunity", props.opportunity.id);
    form_data.append("document", file);
    createDocument(form_data)
      .then((res) => {
        fetchData();
      })
      .catch((err) => {
        handleError(err)
      });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    fetchData({
      // sortField: sorter.field,
      // sortOrder: sorter.order,
      page: pagination.current,
      // ...filters,
    });
  };
    return (
      <div
        className={`col-12 ${
          !props.hideTitle ? "no-data-card-row-new" : ""
        }`}
      >
        <div
          className={`row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
            !props.hideTitle ? "border-1" : ""
          }`}
        >
          <div className="d-flex align-items-center">
            {/* <div className="search-bar-div">
                            <Form className="position-relative">
                                <Input placeholder="Search"/>
                                <Button
                                    className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                    <img src={Images.search_icon_gray} className="img-fluid"
                                         alt="search icon"/>
                                </Button>
                            </Form>
                        </div> */}
            <Upload multiple showUploadList={false} customRequest={uploadFile}>
              <Button className="add-btn-collapse">
                + Upload
              </Button>
            </Upload>
          </div>
          {props.hideTitle && (
            <Button
              className="view-all-btn text-uppercase"
              onClick={() => props.onTabChange("5")}
            >
              VIEW ALL{" "}
            </Button>
          )}
        </div>
        {/*{docsData.length > 0 ?*/}
        <div className="row summary-collapse-inner-row-main px-0 pb-0">
          <div className="col-12 table-responsive main-table-div documents-table-main">
            {data.length > 0 ? (
              <Table
                pagination={pagination}
                loading={loading}
                className="main-table-all carpet-cleaning-table border-0"
                columns={docsColumns}
                onRow={(record) => {
                  return {
                    onClick: (event) => {
                      window.open(record.document, "_blank");
                    },
                  };
                }}
                dataSource={data}
                size="middle"
              />
            ) : (
              <div className="documents-upload-height d-flex align-items-center justify-content-center w-100">
                <Upload showUploadList={false} customRequest={uploadFile}>
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
      </div>
    );
  }

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(Documents);
