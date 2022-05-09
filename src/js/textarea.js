import Component from './component';

export default class Textarea extends Component {
  constructor(
    parent,
    tagName,
    className,
    content,
    placeholder,
    rows,
    cols,
    spellcheck,
    autocorrect,
  ) {
    super(parent, tagName, className, content);
    this.node.placeholder = placeholder;
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
      Letter: (left, right, letter) => {
        this.node.value = `${left}${letter || ''}${right}`;
        this.cursorPos += 1;
      },
    };
  }

  printToOutput(key) {
    this.cursorPos = this.node.selectionStart;
    const left = this.node.value.slice(0, this.cursorPos);
    const right = this.node.value.slice(this.node.selectionEnd);
    if (this.textHandlers[key.code]) {
      this.textHandlers[key.code](left, right);
    } else if (!key.isFnKey) {
      this.textHandlers.Letter(left, right, key.activeLetter);
    }
    this.node.setSelectionRange(this.cursorPos, this.cursorPos);
    this.cursorPos = this.node.selectionStart;
  }
}
