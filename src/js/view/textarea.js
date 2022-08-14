import Component from '../common/component';

const functionalKeys = ['CapsLock', 'Shift', 'Ctrl', 'Alt'];

export default class Textarea extends Component {
  constructor(
    parent,
    tagName,
    className,
    content,
    rows,
    cols,
    spellcheck,
    autocorrect,
  ) {
    super(parent, tagName, className, content);
    this.node.rows = rows;
    this.node.cols = cols;
    this.node.spellcheck = spellcheck;
    this.node.autocorrect = autocorrect;
    this.cursorPos = this.node.selectionStart;
    this.textHandlers = {
      Tab: (left, right) => {
        this.node.value = `${left}\t${right}`;
        this.cursorPos += 1;
      },
      Enter: (left, right) => {
        this.node.value = `${left}\n${right}`;
        this.cursorPos += 1;
      },
      Delete: (left, right) => {
        this.node.value = `${left}${right.slice(1)}`;
      },
      Backspace: (left, right) => {
        this.node.value = `${left.slice(0, -1)}${right}`;
        this.cursorPos -= 1;
      },
      Space: (left, right) => {
        this.node.value = `${left} ${right}`;
        this.cursorPos += 1;
      },
      '&larr;': () => {
        this.cursorPos = this.cursorPos - 1 >= 0 ? this.cursorPos - 1 : 0;
      },
      '&rarr;': () => {
        this.cursorPos += 1;
      },
      '&uarr;': () => {
        const positionFromLeft = this.node.value.slice(0, this.cursorPos).match(/(\n).*$(?!\1)/g) || [[1]];
        this.cursorPos -= positionFromLeft[0].length;
      },
      '&darr;': () => {
        const positionFromLeft = this.node.value.slice(this.cursorPos).match(/^.*(\n).*(?!\1)/) || [[1]];
        this.cursorPos += positionFromLeft[0].length;
      },
      Letter: (left, right, letter) => {
        this.node.value = `${left}${letter || ''}${right}`;
        this.cursorPos += 1;
      },
    };
  }

  printToOutput(key) {
    this.node.focus();
    this.cursorPos = this.node.selectionStart;
    const left = this.node.value.slice(0, this.cursorPos);
    const right = this.node.value.slice(this.node.selectionEnd);
    if (this.textHandlers[key]) {
      this.textHandlers[key](left, right);
    } else if (!functionalKeys.includes(key)) {
      this.textHandlers.Letter(left, right, key);
    }
    this.node.setSelectionRange(this.cursorPos, this.cursorPos);
    this.cursorPos = this.node.selectionStart;
  }
}
