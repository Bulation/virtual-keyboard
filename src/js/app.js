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
            if (key.code.match(/Caps/) && !model.isCaps) {
              model.isCaps = true;
              this.keys.forEach((el) => {
                if (model.isShift) {
                  el.updateUpperCase(false);
                } else {
                  el.updateUpperCase(true);
                }
              });
            } else if (key.code.match(/Caps/) && model.isCaps && !e.repeat) {
              model.isCaps = false;
              this.keys.forEach((el) => {
                if (model.isShift) {
                  el.updateUpperCase(true);
                } else {
                  el.updateUpperCase(false);
                }
              });
              key.node.classList.remove('keyboard__key_active');
            }
            if (key.code.match(/Shift/) && !model.isShift) {
              model.isShift = true;
              this.keys.forEach((el) => {
                if (model.isCaps) {
                  el.updateUpperCase(false);
                } else {
                  el.updateUpperCase(true);
                }
                el.updateNonLetters(true);
              });
            } else if (key.code.match(/Shift/) && model.isShift && !e.repeat) {
              model.isShift = false;
              this.keys.forEach((el) => {
                if (model.isCaps) {
                  el.updateUpperCase(true);
                } else {
                  el.updateUpperCase(false);
                }
                el.updateNonLetters(false);
              });
              key.node.classList.remove('keyboard__key_active');
            }
            if (key.code.match(/Alt/)) {
              model.isAlt = true;
            }
            if (key.code.match(/Control/)) {
              model.isCtrl = true;
            }
            if (model.isShift && model.isAlt) {
              model.setLang();
              model.isShift = false;
              this.keys.forEach((el) => {
                if (model.isCaps) {
                  el.updateUpperCase(true);
                } else {
                  el.updateUpperCase(false);
                }
                el.updateNonLetters(false);
                if (el.code.match(/Shift/)) {
                  el.node.classList.remove('keyboard__key_active');
                }
              });
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
