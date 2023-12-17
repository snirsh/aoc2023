/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.js,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ fro 'lodash
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ fro 'lodash
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 */
class PriorityQueue {
  constructor(comparator = (a, b) => a[0] - b[0]) {
    this._heap = [];
    this._comparator = comparator;
  }

  push(value) {
    this._heap.push(value);
    this._siftUp();
  }

  pop() {
    const poppedValue = this.peek();
    const bottomValue = this._heap.pop();
    if (this._heap.length > 0) {
      this._heap[0] = bottomValue;
      this._siftDown();
    }
    return poppedValue;
  }

  peek() {
    return this._heap[0];
  }

  get length() {
    return this._heap.length;
  }

  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]) > 0;
  }

  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }

  _siftUp() {
    let node = this._heap.length - 1;
    while (node > 0 && this._greater(node, Math.floor((node - 1) / 2))) {
      this._swap(node, Math.floor((node - 1) / 2));
      node = Math.floor((node - 1) / 2);
    }
  }

  _siftDown() {
    let node = 0;
    while (
      (2 * node + 1 < this._heap.length && this._greater(2 * node + 1, node)) ||
      (2 * node + 2 < this._heap.length && this._greater(2 * node + 2, node))
      ) {
      let maxChild = (2 * node + 2 < this._heap.length && this._greater(2 * node + 2, 2 * node + 1)) ? 2 * node + 2 : 2 * node + 1;
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

function isValidPosition(r, c, grid) {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
}

export { PriorityQueue, isValidPosition };
