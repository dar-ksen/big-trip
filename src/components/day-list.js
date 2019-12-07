import { createElement } from '../utils';

const getCardContainerTemplate = () => {
  return (`
    <ul class="trip-days js-trip-days"></ul>
  `);
};

export default class DayList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getCardContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
