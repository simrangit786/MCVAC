import React, {Component} from 'react';
import {Button, Form, Input, message} from "antd";
import {Image as Images} from "../../../Images";
import WOPostAll from "./post-all/WOPostAll";
import {getWorkOrderPost, updateWorkOrderPost} from '../../../../Controller/api/workOrderServices';
import CreateWorkOrderPost from '../../../drawers/CreateWorkOrderPost';
import {handleError} from '../../../../Controller/Global';

class WOPosts extends Component {
    state = {
        posts: null, visible: false, activeKey: "1"
    }

    showPost = (visible, data = null) => {
        this.setState({
            visible: visible, selectedData: data,
        });
    };

    componentDidMount() {
        this.getPosts();
    }

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


    getPosts = (params = {}) => {
        this.setState({loading: true});
        getWorkOrderPost({workorder: this.props.workOrder?.id, ...params})
            .then((res) => {
                this.setState({
                    posts: res.data.results, loading: false,
                });
            })
            .catch((err) => {
                handleError(err)
            });
    };

    changePostStatus = (data, completed) => {
        const {posts} = this.state;
        updateWorkOrderPost(data.id, {completed}).then((response) => {
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

    render() {
        // const { posts, drawerData } = this.state;
        const {viewAll} = this.props;
        return (<div className={`col-12 ${!viewAll ? "mt-30 no-data-card-row-new" : ""}`}>
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
                        onClick={() => this.showPost(true)}
                        className="add-btn-collapse ml-2 text-capitalize"
                    >
                        + Create
                    </Button>
                </div>
                {viewAll && (<Button
                    onClick={() => this.props.onTabChange("2")}
                    className="view-all-btn text-uppercase"
                >
                    VIEW ALL{" "}
                </Button>)}
            </div>
            <div className="row">
                <div className="post-custom-tab">
                    {/*<Tabs type="card" onChange={this.onTabChange}>*/}
                    {/*    <TabPane tab="All" key="1">*/}
                    <WOPostAll
                        showPost={this.showPost}
                        getPosts={this.getPosts}
                        posts={this.state?.posts}
                        activeKey={this.state.activeKey}
                        changePostStatus={this.changePostStatus}
                    />
                    {/*</TabPane>*/}
                    {/*<TabPane tab="Notes" key="2">
                                <WOPostsNote
                                    getPosts={this.getPosts}
                                    posts={this.state?.posts}
                                    showPost={this.showPost}
                                    changePostStatus={this.changePostStatus}
                                />
                            </TabPane>
                            <TabPane tab="Tasks" key="3">
                                <WOPostTasks
                                    getPosts={this.getPosts}
                                    posts={this.state?.posts}
                                    showPost={this.showPost}
                                    changePostStatus={this.changePostStatus}
                                />
                            </TabPane>
                            <TabPane tab="Call Logs" key="4">
                                <WOPostCallLogs
                                    getPosts={this.getPosts}
                                    posts={this.state?.posts}
                                    showPost={this.showPost}
                                    changePostStatus={this.changePostStatus}
                                />
                            </TabPane>
                            <TabPane tab="Emails" key="5">
                                <WOPostEmails
                                    getPosts={this.getPosts}
                                    posts={this.state?.posts}
                                    showPost={this.showPost}
                                    changePostStatus={this.changePostStatus}
                                />
                            </TabPane>
                            <TabPane tab="Events" key="6">
                                <WOPostEvents
                                    getPosts={this.getPosts}
                                    posts={this.state?.posts}
                                    showPost={this.showPost}
                                    changePostStatus={this.changePostStatus}
                                />
                            </TabPane>*/}
                    {/*</Tabs>*/}
                </div>
            </div>
            <CreateWorkOrderPost
                data={this.state.selectedData}
                onSuccess={async () => {
                    await this.showPost(false);
                    await this.getPosts();
                }}
                visible={this.state.visible}
                onClose={() => this.showPost(false)}
            />
        </div>);
    }
}

export default WOPosts;