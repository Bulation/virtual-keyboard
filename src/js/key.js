import Component from './component';
import letters from './letters';

export default class Key extends Component {
  constructor(parent, tagName, className, { small, shift, code }) {
    super(parent, tagName, className, small);
    this.activeLetter = small;
    this.code = code;
    this.small = small;
    this.shift = shift;
    this.isFnKey = Boolean(small.match(/Ctrl|Alt|Shift|Tab|Back|Del|Enter|Caps|Win/));
    this.isLetter = letters.includes(this.small);
    if (code.includes('Space')) {
      this.node.style.width = '400px';
    } else if (this.isFnKey) {
      this.node.style.width = '100px';
    }
    this.node.onmousedown = (e) => this.handleDown(e);
    this.node.onmouseup = (e) => this.handleUp(e);
    this.node.onmouseleave = (e) => this.handleUp(e);
  }

  updateLang(obj, caps) {
    this.code = obj.code;
    this.small = obj.small;
    this.shift = obj.shift;
    this.isLetter = letters.includes(this.small);
    if ((caps && !this.isFnKey && !this.isLetter) || (!caps && !this.isFnKey)) {
      // если зажат капс,то поднимаем в верхний регистр только цифры,если не зажат,то поднимаем все
      this.activeLetter = this.shift;
    } else {
      this.activeLetter = this.small;
    }
    this.node.innerHTML = this.activeLetter;
  }

  updateUpperCase(isTrue) {
    if (isTrue) {
      if (this.isLetter && !this.isFnKey) {
        this.activeLetter = this.shift;
      }
    } else if (this.isLetter && !this.isFnKey) {
      this.activeLetter = this.small;
    }
    this.node.innerHTML = this.activeLetter;
  }

  updateNonLetters(isTrue) {
    if (isTrue) {
      if (!this.isLetter && !this.isFnKey) {
        this.activeLetter = this.shift;
      }
    } else if (!this.isLetter && !this.isFnKey) {
      this.activeLetter = this.small;
    }
    this.node.innerHTML = this.activeLetter;
  }
}
