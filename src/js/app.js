import Textarea from './view/textarea';
import Keyboard from './keyboard';
import KeyboardView from './view/keyboardview';
import rows from './data/rows';
import Component from './common/component';

export default class Application {
  constructor(node) {
    this.node = node;
    this.pageContainer = new Component(this.node, 'div', 'page-container', '');
    this.outputContainer = new Component(this.pageContainer.node, 'div', 'output-container', '');
    this.title = new Component(this.outputContainer.node, 'h1', 'output-title', 'Virtual Keyboard');
    this.output = new Textarea(this.outputContainer.node, 'textarea', 'textarea', '', 5, 50, false, 'off');
    const model = new Keyboard();
    model.load();
    this.keyboardContainer = new Component(this.pageContainer.node, 'div', 'keyboard-container', '');
    this.keyboardView = new KeyboardView(this.keyboardContainer.node, 'div', 'keyboard', '', rows, model);
    model.update = (data) => {
      this.output.printToOutput(data);
      if (!model.isShift && !data.includes('Shift')) {
        this.keyboardView.keyMap.ShiftLeft.node.classList.remove('keyboard__key_active');
        this.keyboardView.keyMap.ShiftRight.node.classList.remove('keyboard__key_active');
      }
      const currentBoard = model.langs[model.langIndex];
      if (model.isShift) {
        this.keyboardView.setLanguage(currentBoard.shift);
      } else if (model.isCaps) {
        this.keyboardView.setLanguage(currentBoard.caps);
      } else {
        this.keyboardView.setLanguage(currentBoard.base);
      }
    };
    document.onkeydown = (e) => {
      this.keyboardView.handleDown(e);
    };
    document.onkeyup = (e) => {
      this.keyboardView.handleUp(e);
    };
    window.onbeforeunload = () => {
      model.save();
    };
  }
}
