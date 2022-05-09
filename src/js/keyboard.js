import rows from './rows';
import langs from './langs';

export default class Keyboard {
  constructor() {
    this.isCtrl = false;
    this.isShift = false;
    this.isCaps = false;
    this.isAlt = false;
  }

  load() {
    this.rows = rows;
    this.langs = langs;
    this.langIndex = localStorage.getItem('lang') || 0;
    this.initKeyboard(this.rows, this.langs[this.langIndex]);
  }

  setLang() {
    this.langIndex = (+this.langIndex + 1) % this.langs.length;
    localStorage.setItem('lang', this.langIndex);
    this.onUpdateLang(this.langs[this.langIndex], this.isCaps);
  }
}
