import React from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

// fake data generator
const getItems = (count) => Array.from({length: count}, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

class DemoDragDrop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: getItems(10),
            items2: getItems(10).reverse()
        }
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragEnd2 = this.onDragEnd2.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items,
        });
    }

    onDragEnd2(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items2 = reorder(
            this.state.items2,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items2,
        });
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <div className="d-flex">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable1">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}
                            >
                                {this.state.items.map((item, index) => (
                                    <Draggable
                                        key={`${item.id}_1`}
                                        draggableId={`${item.id}_1`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div>
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    style={getItemStyle(
                                                        provided.draggableProps.style,
                                                        snapshot.isDragging
                                                    )}
                                                >
                                                    {item.content}
                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="droppable2">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}
                            >
                                {this.state.items2.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div>
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    style={getItemStyle(
                                                        provided.draggableProps.style,
                                                        snapshot.isDragging
                                                    )}
                                                >
                                                    {item.content}
                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

// Put the thing into the DOM!
export default DemoDragDrop;


