import Textarea from './textarea';
import Keyboard from './keyboard';
import KeyboardView from './keyboardview';
import rows from './rows';

export default class Application {
  constructor(node) {
    this.node = node;
    this.output = new Textarea(this.node, 'textarea', 'textarea', '', 5, 50, false, 'off');
    const model = new Keyboard();
    model.load();
    this.keyboardView = new KeyboardView(this.node, 'div', 'keyboard', '', rows, model);
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
