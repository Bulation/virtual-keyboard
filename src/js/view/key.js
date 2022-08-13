import Component from '../common/component';

export default class Key extends Component {
  constructor(parent, tagName, className, data, model) {
    super(parent, tagName, className, data);
    this.data = data;
    this.model = model;
    if (data === ' ') {
      this.node.style.width = '400px';
    }
    this.node.onmousedown = (e) => this.handleDown(e);
    this.node.ontouchstart = (e) => {
      this.handleDown(e);
    };
    this.node.onmouseup = (e) => this.handleUp(e);
    this.node.onmouseleave = (e) => this.handleUp(e);
    this.node.ontouchend = (e) => {
      this.handleUp(e);
    };
  }

  handleDown(e) {
    e.preventDefault();
    this.node.classList.add('keyboard__key_active');
    if (this.data.match(/Caps/) && !e.repeat) {
      this.model.isCaps = !this.model.isCaps;
    }
    if (this.data.match(/Shift/) && !e.repeat) {
      this.model.isShift = !this.model.isShift;
    }
    if (!this.data.match(/Shift/) && !e.repeat && this.model.isShift) { // если был зажат шифт и нажата другая клавиша, то меняем состояние шифта
      this.model.isShift = !this.model.isShift;
    }
    if (this.data.match(/Alt/)) {
      this.model.isAlt = true;
    }
    if (this.data.match(/Ctrl/)) {
      this.model.isCtrl = true;
    }
    if (this.model.isShift && this.model.isAlt) {
      this.model.langIndex = (+this.model.langIndex + 1) % this.model.langs.length;
    }
    if (!this.model.isShift && this.data.match(/Shift/)) { // ремуваем классы, если нажали на зажатый шифт, капс
      this.node.classList.remove('keyboard__key_active');
    }
    if (!this.model.isCaps && this.data.match(/Caps/)) {
      this.node.classList.remove('keyboard__key_active');
    }
    this.model.update(this.data);
  }

  handleUp(e) {
    e.preventDefault();
    if (!this.data.match(/Caps|Shift/)) {
      this.node.classList.remove('keyboard__key_active');
    }
    this.model.isAlt = false;
    this.model.isCtrl = false;
  }

  setData(data) {
    this.data = data;
    this.node.innerHTML = data;
  }
}
