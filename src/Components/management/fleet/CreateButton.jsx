import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image as Images } from "../../Images";

class CreateButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: false,
      subtierName: "",
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ showInput: false, subtierName: "" });
    }
  };

  handleInput = () => {
    this.setState({ showInput: true });
  };

  addChild = () => {
    this.setState({ showInput: false, subtierName: "" });
    this.props.addChild(this.state.subtierName, this.props.parent);
  };

  render() {
    let { showInput, subtierName } = this.state;
    let { buttonName, root, parent } = this.props;

    return (
      <div ref={this.wrapperRef}>
        {!showInput ? (
          !root ? (
            <div
              onClick={this.handleInput}
              className="text-green-tag text-right-tree"
            >
              {buttonName}
            </div>
          ) : (
            <div className="row mx-0 add-sub-tier-main-row">
              <Button
                disabled={!parent}
                onClick={this.handleInput}
                className="add-sub-tier-btn bg-transparent border-0 rounded-0 shadow-none text-uppercase"
              >
                + ADD TIER/GROUP
              </Button>
            </div>
          )
        ) : (
          <div className="row mx-0 add-sub-tier-input-form">
            <Form className="position-relative">
              <Input
                autoFocus
                value={subtierName}
                onChange={(e) => this.setState({ subtierName: e.target.value })}
                name={"subtierName"}
                type={"text"}
              />
              <span className="img-tag-icon position-absolute">
                <img
                  alt={" "}
                  className="img-fluid"
                  src={Images.list_nested_icon_green}
                />
              </span>
              <Button
                onClick={this.addChild}
                className="create-sub-tier text-uppercase w-100 border-0"
              >
                Create Tier
              </Button>
            </Form>
          </div>
        )}
      </div>
    );
  }
}

export default CreateButton;
