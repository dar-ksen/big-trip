import { getPointsByFilter } from '../services/point-filtration';
import { FilterType } from '../const';
import { ArrayUtils } from '../utils/array';

class PointModel {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  removePoint(id) {
    const index = this._points.findIndex((point) => point.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [...this._points.slice(0, index), ...this._points.slice(index + 1)];

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updatePoint(id, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === id);

    if (index === -1) {
      return false;
    }

    this._points = ArrayUtils.replace(this._points, updatedPoint, index);
    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  addPoint(point) {
    this._points = [point, ...this._points];
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

export { PointModel as default };