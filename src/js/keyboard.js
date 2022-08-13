import langs from './langs';

export default class Keyboard {
  constructor() {
    this.isCtrl = false;
    this.isShift = false;
    this.isCaps = false;
    this.isAlt = false;
  }

  load() {
    this.langs = langs;
    this.langIndex = localStorage.getItem('lang') || 0;
  }

  save() {
    localStorage.setItem('lang', this.langIndex);
  }
}
