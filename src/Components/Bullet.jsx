import React, { Component } from "react";

class Bullet extends Component {
  ulRef = React.createRef();

  componentDidMount() {
    if (this.props.value) {
      if (this.props.value.length === 0) {
        this.ulRef.current.innerHTML = "<li></li>";
      } else {
        let list = this.ulRef.current;
        let li = "";
        this.props.value.forEach((item) => {
          li = li + "<li>" + item + "</li>";
        });
        list.innerHTML = li;
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.value) {
      this.ulRef.current.innerHTML = "<li></li>";
    }
    if(this.props.value ) {
    if (this.props.value.length === 0) {
      this.ulRef.current.innerHTML = "<li></li>";
    }
    else {
      let list = this.ulRef.current;
      let li = "";
      this.props.value.forEach((item) => {
        li = li + "<li>" + item + "</li>";
      });
      list.innerHTML = li;
    }
  }
  }

  handleListChange = (e) => {
    let selectedElem = document.getElementById(this.props.id);
    if(selectedElem?.childNodes?.length === 0) {
    selectedElem.innerHTML = "<li></li>";
    }
    // let arr = [];
    // if (
    //   e.target.innerHTML === "<li></li><li><br></li>" ||
    //   e.target.childNodes.length === 0
    // ) {
    //   this.ulRef.current.innerHTML = "<li></li>";
    // }
    //  else {
    //   e.target.childNodes.forEach((node) => {
    //     arr.push(node.innerHTML);
    //   });
    // }
    // arr = arr.filter((item) => {
    //   return item !== "<br>" && item;
    // });
    // this.props.onChange(arr);
  };

  render() {
    return (
      <>
        <div className="editable-list">
          <ul
            id={this.props.id}
            ref={this.ulRef}
            onInput={this.handleListChange}
            contentEditable="true"
          >
            <li />
          </ul>
        </div>
      </>
    );
  }
}

export default Bullet;
