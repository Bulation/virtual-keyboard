export default class Component {
  constructor(parent, tagName, className, content) {
    this.parent = parent;
    this.node = document.createElement(tagName);
    this.node.className = className;
    this.node.innerHTML = content;
    parent.append(this.node);
  }

  destroy() {
    this.node.remove();
  }
}
