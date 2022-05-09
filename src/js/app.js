import Component from './component';
import Key from './key';
import Textarea from './textarea';
import Keyboard from './keyboard';

export default class Application {
  constructor(node) {
    this.node = node;
    this.keys = [];
    const output = new Textarea(this.node, 'textarea', 'textarea', '', 'Клавиатура создана в Windows, языки переключаются с помощью комбинации клавиш Shift + Alt, Shift и Caps залипают, так что переключить языки и нажимать на служебные клавиши на цифрах можно и с помощью мышки', 5, 50, false, 'off');
    const keyboardView = new Component(this.node, 'div', 'keyboard', '');
    const model = new Keyboard();
    model.initKeyboard = (rows, lang) => {
      rows.forEach((arr) => {
        const keyboardRow = new Component(keyboardView.node, 'div', 'keyboard__row', '');
        arr.forEach((code) => {
          const keyObj = lang.find((el) => el.code === code);
          const key = new Key(keyboardRow.node, 'kbd', 'keyboard__key', keyObj);
          this.keys.push(key);
          key.handleDown = (e) => {
            e.preventDefault();
            key.node.classList.add('keyboard__key_active');
            if (!model.isCtrl) {
              output.printToOutput(key);
            }
            output.node.focus();
            if (key.code.match(/Caps/) && !e.repeat) {
              model.setCaps();
            }
            if (key.code.match(/Shift/) && !e.repeat) {
              model.setShift();
            }
            if (key.code.match(/Alt/)) {
              model.isAlt = true;
            }
            if (key.code.match(/Control/)) {
              model.isCtrl = true;
            }
            if (model.isShift && model.isAlt) {
              model.setLang();
              model.setShift();
            }
            if (model.isCtrl && key.code === 'KeyA') {
              output.node.select();
            }
          };
          key.handleUp = (e) => {
            e.preventDefault();
            if (!key.code.match(/Caps|Shift/)) {
              key.node.classList.remove('keyboard__key_active');
            }
            model.isAlt = false;
            model.isCtrl = false;
          };
        });
      });
    };
    model.onUpdateLang = (lang, caps) => {
      this.keys.forEach((key) => {
        const keyObj = lang.find((el) => el.code === key.code);
        key.updateLang(keyObj, caps);
      });
    };
    model.onUpdateCaps = (caps, shift) => {
      this.keys.forEach((el) => {
        if ((caps && shift) || (!caps && !shift)) {
          el.updateUpperCase(false);
        } else {
          el.updateUpperCase(true);
        }
        if (!caps && el.code.match(/Caps/)) {
          el.node.classList.remove('keyboard__key_active');
        }
      });
    };
    model.onUpdateShift = (caps, shift) => {
      this.keys.forEach((el) => {
        if ((caps && shift) || (!caps && !shift)) {
          el.updateUpperCase(false);
        } else {
          el.updateUpperCase(true);
        }
        el.updateNonLetters(shift);
        if (!shift && el.code.match(/Shift/)) {
          el.node.classList.remove('keyboard__key_active');
        }
      });
    };
    model.load();
    document.onkeydown = (e) => {
      e.preventDefault();
      const key = this.keys.find((keyObj) => keyObj.code === e.code);
      if (key) {
        key.handleDown(e);
      }
    };
    document.onkeyup = (e) => {
      e.preventDefault();
      const key = this.keys.find((keyObj) => keyObj.code === e.code);
      if (key) {
        key.handleUp(e);
      }
    };
  }
}
