import { Component, OnInit, ViewChild } from '@angular/core';
import { ContainerComponent, DraggableComponent, DropResult } from 'ngx-smooth-dnd';
import { applyDrag, generateItems } from '../../services/utility.service';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const columnNames = ['Todo', 'In Progress', 'Done'];

const cardColors = ['azure', 'beige', 'bisque', 'blanchedalmond', 'burlywood', 'cornsilk', 'gainsboro', 'ghostwhite', 'ivory', 'khaki'];
const pickColor = () => {
  const rand = Math.floor((Math.random() * 10));
  return cardColors[rand];
};

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  items = generateItems(10, i => ({ data: 'Draggable ' + i }));
  items1 = generateItems(15, (i) => ({ id: '1' + i, data: `Draggable 1 - ${i}` }));
  items2 = generateItems(15, (i) => ({ id: '2' + i, data: `Draggable 2 - ${i}` }));
  items3 = generateItems(15, (i) => ({ id: '3' + i, data: `Draggable 3 - ${i}` }));
  // items4 = generateItems(15, (i) => ({ id: '4' + i, data: `Draggable 4 - ${i}` }));

  constructor() {
    this.getChildPayload1 = this.getChildPayload1.bind(this);
    this.getChildPayload2 = this.getChildPayload2.bind(this);
    this.getChildPayload3 = this.getChildPayload3.bind(this);
    // this.getChildPayload4 = this.getChildPayload4.bind(this);
  }


  ngOnInit(): void {
  }

  onDrop(dropResult: DropResult) {
    // update item list according to the @dropResult
    this.items = applyDrag(this.items, dropResult);
  }

  onDropCollection(collection, dropResult) {
    this[collection] = applyDrag(this[collection], dropResult);
  }

  getChildPayload1(index) {
    return this.items1[index];
  }
  getChildPayload2(index) {
    return this.items2[index];

  }
  getChildPayload3(index) {
    return this.items3[index];

  }
/*  getChildPayload4(index) {
    return this.items4[index];
  }*/


  scene = {
    type: 'container',
    props: {
      orientation: 'horizontal'
    },
    children: generateItems(3, (i) => ({
      id: `column${i}`,
      type: 'container',
      name: columnNames[i],
      props: {
        orientation: 'vertical',
        className: 'card-container'
      },
      children: generateItems(+(Math.random() * 10).toFixed() + 5, (j) => ({
        type: 'draggable',
        id: `${i}${j}`,
        props: {
          className: 'card mb-1',
          // style: { backgroundColor: pickColor() }
        },
        data: lorem.slice(0, Math.floor(Math.random() * 150) + 30)
      }))
    }))
  }

  // items = generateItems(50, i => ({ data: 'Draggable ' + i }))

  onColumnDrop(dropResult) {
    const scene = Object.assign({}, this.scene);
    scene.children = applyDrag(scene.children, dropResult);
    this.scene = scene;
  }

  onCardDrop(columnId, dropResult) {
    // console.log('onCardDrop, columnId: ', columnId);
    // console.log('onCardDrop, dropResult.payload: ', dropResult.payload);
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      const scene = Object.assign({}, this.scene);
      const column = scene.children.filter(p => p.id === columnId)[0];
      const columnIndex = scene.children.indexOf(column);

      const newColumn = Object.assign({}, column);
      newColumn.children = applyDrag(newColumn.children, dropResult);
      scene.children.splice(columnIndex, 1, newColumn);

      this.scene = scene;
    }
  }

  getCardPayload(columnId) {
    return (index) => {
      return this.scene.children.filter(p => p.id === columnId)[0].children[index];
    }
  }

  dragStart(event){
    console.log('dragStart event: ', event);
  }

  log(...params) {
    // console.log(...params);
  }

}
