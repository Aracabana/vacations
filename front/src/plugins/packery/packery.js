import PackeryClass from 'packery';
import Draggabilly from 'draggabilly';

function Packery() {
  let _instance = {};


  this.init = function (el, options) {
    _instance = new PackeryClass(el, options);
  }

  this.destroy = function () {
    _instance.destroy();
  }

  this.instance = () => _instance;

}

Packery.prototype.updateGrid = function () {
  this.instance().layout();
}

Packery.prototype.addItem = function (el, draggable) {
  this.instance().addItems(el);
  setTimeout(() => {
    if (draggable) this.setDraggable(el);
    this.updateGrid();
  });
}

Packery.prototype.removeItem = function (el) {
  this.instance().remove(el);
  setTimeout(() => this.updateGrid());
}

Packery.prototype.setDraggable = function (el) {
  const drag = new Draggabilly(el);
  this.instance().bindDraggabillyEvents(drag);
}

export default Packery;
