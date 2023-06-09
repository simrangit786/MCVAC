import React, {Component} from 'react';
import {Button, Form, Input, message} from "antd";
import {Image as Images} from "../../../Images";
import ProjectsPostAll from "./post-all/ProjectsPostAll";
import {handleError} from '../../../../Controller/Global';
import {getProjectPost, updateProjectPost} from '../../../../Controller/api/projectServices';
import CreateProjectPost from '../../../drawers/project/CreateProjectPost';


class ProjectsPost extends Component {
    state = {
        posts: [],
        drawerData: null,
        loading: false,
        pagination: {
            current: 1,
            pageSize: 15,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }
    };

    handleActiveKey = () => {
        const {activeKey} = this.state;
        if (activeKey === "1") {
            this.getPosts()
        } else if (activeKey === "2") {
            this.getPosts({type: "NOTE"})
        } else if (activeKey === "3") {
            this.getPosts({type: "TASK"})
        } else if (activeKey === "4") {
            this.getPosts({type: "CALL_LOG"})
        } else if (activeKey === "5") {
            this.getPosts({type: "EMAIL"})
        } else {
            this.getPosts({type: "EVENT"})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {activeKey} = this.state;
        if (prevState.activeKey !== this.state.activeKey) {
            this.handleActiveKey()
        }
    }

    changePostStatus = (data, completed) => {
        const {posts} = this.state;
        updateProjectPost(data.id, {completed}).then((response) => {
            const postIndex = posts.findIndex((i) => i.id === data.id);
            posts[postIndex].completed = completed;
            this.setState({posts});
            message.success("Updated post status");
        }).catch(err => {
            handleError(err)
        })
    };

    onTabChange = (key) => {
        this.setState({activeKey: key})
    }


    getPosts = (params = {}) => {
        this.setState({loading: true})
        params.project = this.props.match.params.id;
        getProjectPost({...params})
            .then((res) => {
                this.setState({
                    posts: res.data.results,
                    loading: false,
                    pagination: {
                        ...this.state.pagination,
                        current: params.page || 1,
                        total: this.props.viewAll ? 10 : res.data.count
                    }
                });
            })
            .catch((err) => {
                handleError(err);
            });
    };


    showPostDrawer = (visible, data = null) => {
        this.setState({
            visibleDrawer: visible,
            drawerData: data,
        });
    };


    componentDidMount() {
        this.getPosts();
    }

    onSearch = (e) => {
        this.getPosts({search: e.target.value});
    };
    handleChange = (pagination) => {
        this.getPosts({page: pagination.current})

    }

    render() {
        const {viewAll} = this.props;
        const {posts, drawerData} = this.state;
        console.log(posts, "posts")
        return (
            <div className={`col-12 ${!viewAll ? "mt-30 no-data-card-row-new" : ""}`}>
                {/* <div className={`col-12`}> */}
                <div
                    className={`row new-opportunity-header-row position-relative summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header border-1 ${!this.props.viewAll ? "border-1" : ""}`}>
                    <div style={{
                        zIndex: '2'
                    }} className="search-bar-div d-flex align-items-center">
                        <Form className="position-relative">
                            <Input placeholder="Search" onChange={this.onSearch}/>
                            <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                <img
                                    src={Images.search_icon_gray}
                                    className="img-fluid"
                                    alt="search icon"
                                />
                            </Button>
                        </Form>
                        <Button
                            onClick={() => this.showPostDrawer(true)}
                            className="add-btn-collapse ml-2 text-capitalize"
                        >
                            + Create
                        </Button>
                    </div>
                    {viewAll && (
                        <Button
                            onClick={() => this.props.onTabChange("7")}
                            className="view-all-btn text-uppercase"
                        >
                            VIEW ALL{" "}
                        </Button>
                    )}
                </div>
                <div className="row">
                    <div className="post-custom-tab">
                        {/*<Tabs type="card" onChange={this.onTabChange}>*/}
                        {/*    <TabPane tab="All" key="1">*/}
                        <ProjectsPostAll
                            showPostDrawer={this.showPostDrawer}
                            getPosts={this.getPosts}
                            posts={this.state?.posts}
                            activeKey={this.state.activeKey}
                            changePostStatus={this.changePostStatus}
                        />
                        {/*</TabPane>*/}
                        {/*<TabPane tab="Notes" key="2">*/}
                        {/*    <ProjectsPostsNote*/}
                        {/*        showPostDrawer={this.showPostDrawer}*/}
                        {/*        getPosts={this.getPosts}*/}
                        {/*        posts={this.state?.posts}*/}
                        {/*        activeKey={this.state.activeKey}*/}
                        {/*        changePostStatus={this.changePostStatus}*/}
                        {/*    />*/}
                        {/*</TabPane>*/}
                        {/*<TabPane tab="Tasks" key="3">*/}
                        {/*    <ProjectsPostTasks*/}
                        {/*        showPostDrawer={this.showPostDrawer}*/}
                        {/*        getPosts={this.getPosts}*/}
                        {/*        posts={this.state?.posts}*/}
                        {/*        activeKey={this.state.activeKey}*/}
                        {/*        changePostStatus={this.changePostStatus}*/}
                        {/*    />*/}
                        {/*</TabPane>*/}
                        {/*<TabPane tab="Call Logs" key="4">*/}
                        {/*    <ProjectsPostCallLogs*/}
                        {/*        showPostDrawer={this.showPostDrawer}*/}
                        {/*        getPosts={this.getPosts}*/}
                        {/*        posts={this.state?.posts}*/}
                        {/*        activeKey={this.state.activeKey}*/}
                        {/*        changePostStatus={this.changePostStatus}*/}
                        {/*    />*/}
                        {/*</TabPane>*/}
                        {/*<TabPane tab="Emails" key="5">*/}
                        {/*    <ProjectsPostEmails*/}
                        {/*        showPostDrawer={this.showPostDrawer}*/}
                        {/*        getPosts={this.getPosts}*/}
                        {/*        posts={this.state?.posts}*/}
                        {/*        activeKey={this.state.activeKey}*/}
                        {/*        changePostStatus={this.changePostStatus}*/}
                        {/*    />*/}
                        {/*</TabPane>*/}
                        {/*<TabPane tab="Events" key="6">*/}
                        {/*    <ProjectsPostEvents*/}
                        {/*        showPostDrawer={this.showPostDrawer}*/}
                        {/*        getPosts={this.getPosts}*/}
                        {/*        posts={this.state?.posts}*/}
                        {/*        activeKey={this.state.activeKey}*/}
                        {/*        changePostStatus={this.changePostStatus}*/}
                        {/*    />*/}
                        {/*</TabPane>*/}
                        {/*</Tabs>*/}
                    </div>
                </div>
                <CreateProjectPost
                    data={drawerData}
                    visible={this.state.visibleDrawer}
                    onSuccess={async () => {
                        await this.showPostDrawer(false);
                        await this.getPosts();
                    }}
                    onClose={() => this.showPostDrawer(false)}
                />
            </div>);
    }
}

export default ProjectsPost;