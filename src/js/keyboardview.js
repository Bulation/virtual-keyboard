import Component from './component';
import Key from './key';

export default class KeyboardView extends Component {
  constructor(parent, tagName, className, data, rows, model) {
    super(parent, tagName, className, data);
    this.keyMap = {};
    this.model = model;
    rows.forEach((arr) => {
      const keyboardRow = new Component(this.node, 'div', 'keyboard__row', '');
      arr.forEach((code) => {
        const key = new Key(keyboardRow.node, 'kbd', 'keyboard__key', model.langs[model.langIndex].base[code], model);
        this.keyMap[code] = key;
      });
    });
  }

  setLanguage(boardConfig) {
    Object.keys(boardConfig).forEach((keyCode) => {
      this.keyMap[keyCode].setData(boardConfig[keyCode]);
    });
  }

  handleDown(e) {
    const currentKey = this.keyMap[e.code];
    if (currentKey) {
      currentKey.handleDown(e);
    }
  }

  handleUp(e) {
    const currentKey = this.keyMap[e.code];
    if (currentKey) {
      currentKey.handleUp(e);
    }
  }
}
