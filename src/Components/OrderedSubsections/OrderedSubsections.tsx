import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button, TextField, LinearProgress, Select, MenuItem, Typography, IconButton } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { OrderedSubsectionsProps } from "../../Types/props";
import { Delete } from "@mui/icons-material";
import './OrderedSubsections.scss';

interface DraggableItem {
  id: string;
  text: string;
}

const OrderedSubsections = ({allSubsections, initialChosenOptions, onChange}: OrderedSubsectionsProps) => {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const [insertIndex, setInsertIndex] = useState<number>(0);

  useEffect(()=> {
    let tempItems: DraggableItem[] = [];
    initialChosenOptions.forEach((option) => {
      tempItems.push({id: uuidv4(), text: option})
    })
    setItems(tempItems);
  }, [initialChosenOptions])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);
    setItems(newItems);
    onChange(newItems.map((item) => item.text));
  };

  const handleAddItem = () => {
    if (newItem.trim() === "") return;
    const newItems = [...items];
    newItems.splice(insertIndex, 0, { id: uuidv4(), text: newItem });
    setItems(newItems);
    onChange(newItems.map((item) => item.text));
    setNewItem("");
  };

  const handleRemoveItem = (deleteIndex: number) => {
    const newItems = [...items];
    newItems.splice(deleteIndex, 1);
    setItems(newItems);
    onChange(newItems.map((item) => item.text));
  }

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-list">
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps} style={{ padding: 0, listStyle: "none" }}>
                {items.length === 0 ?
                  <li className="subsection-card">
                    None chosen
                  </li>
                : items.map((item, index) => (
                  <Draggable key={item.id} index={index} draggableId={item.id} >
                    {(provided) => (
                      <li
                        className="subsection-card grabbable"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div className="card-content">
                          <Typography variant="body2" >
                            {item.text}
                          </Typography>
                          {/* <div style={{flexGrow: 1}}/> */}
                          <IconButton onClick={() => handleRemoveItem(index)}>
                            <Delete />
                          </IconButton>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
      </DragDropContext>

      <div className="ops-bar">
        <div className="large-element">
          <Typography variant="body2">Add subsection...</Typography>
          <Select
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            fullWidth
          >
            {allSubsections?.map((sub) => 
              <MenuItem value={sub.subsectionName}>{sub.subsectionName}</MenuItem>
            )}
          </Select>
        </div>
        <div className="small-element">
          <Typography variant="body2">At index:</Typography>
          <TextField
            value={insertIndex}
            onChange={(e) => setInsertIndex(Math.min(Math.max(0, Number(e.target.value)), items.length))}
            variant="outlined"
            size="small"
            type="number"
            style={{ width: "80px", marginLeft: "8px" }}
          />
        </div>
        <Button onClick={handleAddItem} variant="contained" color="primary" className="small-element button" disableRipple>
          Add
        </Button>
      </div>
    </div>
  );
};

export default OrderedSubsections;
