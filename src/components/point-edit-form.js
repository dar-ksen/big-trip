import flatpickr from "flatpickr";
import AbstractSmartComponent from './abstract-smart-component';
import { transferTypes, activityTypes, TYPE_ATTRIBUTES } from '../const';

import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const getTypeListTemplate = (typeList, activeType) => typeList.map((type) => {
  const checkedType = activeType === type ? `checked` : ``;
  return `<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedType}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${TYPE_ATTRIBUTES[type].title}</label>
          </div>`;
}).join(`\n`);

const getCitiesTemplate = (cities) => cities.map((city) => `<option value="${city}"></option>`).join(`\n`);

const getPicturesTemplate = (pictures) => pictures
  .map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}"></img>`)
  .join(`\n`);

const getOfferTemplate = (offersType, offers) => {
  const isChecked = (offer) => offers
    .map(({ title }) => title)
    .indexOf(offer.title) !== -1 ? `checked` : ``;

  return offersType.map((offer, index) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden"
          id="event-offer-${index}"
          type="checkbox" name="event-offer-${index}"
          ${isChecked(offer)}>
        <label class="event__offer-label" for="event-offer-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
  `).join(`\n`);

};

const editPointTemplate = (point, options = {}) => {
  const { pictures, description, price, offers, isFavored, isNew = false } = point;
  const { city, type, destinations, offersType } = options;

  const typeOfTransferListTemplate = getTypeListTemplate(transferTypes, type);
  const typeOfActivityListTemplate = getTypeListTemplate(activityTypes, type);

  const picturesTemplate = getPicturesTemplate(pictures);
  const offerTemplate = getOfferTemplate(offersType, offers);
  const citiesTemplate = getCitiesTemplate(Object.keys(destinations));

  return (`
  <li class="trip-events__item">
    <form class="event  event--edit js-event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list js-event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${typeOfTransferListTemplate}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${typeOfActivityListTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${TYPE_ATTRIBUTES[type].title} ${TYPE_ATTRIBUTES[type].placeholder}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${citiesTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn js-event__reset-btn" type="reset">${isNew ? `Cancel` : `Delete` }</button>

        ${isNew ? `` : `
        <input id="event-favorite-1" class="event__favorite-checkbox js-event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavored && `checked`}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn js-event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>

     <section class="event__details ${!city ? `visually-hidden` : ``}">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offerTemplate}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesTemplate}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>
  `);
};

class PointEditForm extends AbstractSmartComponent {
  constructor(point, destinationsModel, offersModel) {
    super();

    this._point = point;
    this._type = point.type;
    this._city = point.city;
    this._destinationsModel = destinationsModel;
    this._destinations = destinationsModel.getObject();
    this._offersModel = offersModel;

    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._closeButtonClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    const offersType = this._offersModel.getObject()[this._type];
    return editPointTemplate(this._point, {
      type: this._type,
      city: this._city,
      destinations: this._destinations,
      offersType });
  }

  removeElement() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    super.removeElement();
  }

  setSubmitHandler(handler) {
    this.getElement()
      .querySelector(`.js-event--edit`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setInputFavoriteChangeHandler(handler) {
    if (!this._point.isNew) {
      this.getElement()
        .querySelector(`.js-event__favorite-checkbox`)
          .addEventListener(`change`, handler);
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.js-event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    if (!this._point.isNew) {
      this.getElement().querySelector(`.js-event__rollup-btn`)
        .addEventListener(`click`, handler);
      this._closeButtonClickHandler = handler;
    }

  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;
    this._type = point.type;

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.js-event--edit`);
    const formData = new FormData(form);
    return formData;
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const $type = this.getElement().querySelector(`.js-event__type-list`);
    const $city = this.getElement().querySelector(`.event__input--destination`);
    const $cityDescription = this.getElement().querySelector(`.event__destination-description`);
    const $cityPhotos = this.getElement().querySelector(`.event__photos-tape`);

    // TODO fix it
    $type.addEventListener(`change`, () => {
      const value = $type
        .querySelector(`input:checked`)
        .value;
      this._type = value;
      this.rerender();
    });

    $city.addEventListener(`change`, () => {
      this._city = $city.value;
      if (this._point.isNew) {
        this.rerender();
      } else {
        $cityDescription.textContent = this._destinations[$city.value].description;
        $cityPhotos.innerHTML = getPicturesTemplate(this._destinations[$city.value].pictures);
      }
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }

    const startTimeInput = this.getElement().querySelector(`#event-start-time-1`);
    const endTimeInput = this.getElement().querySelector(`#event-end-time-1`);
    const flatpickrOptions = {
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      allowInput: true
    };


    this._flatpickrStartDate = flatpickr(
        startTimeInput,
        {
          ...flatpickrOptions,
          defaultDate: this._point.startTime,
          maxDate: this._point.endTime,
        }
    );

    this._flatpickrEndDate = flatpickr(
        endTimeInput,
        {
          ...flatpickrOptions,
          defaultDate: this._point.endTime,
          minDate: new Date(),
        }
    );

  }

}

export { PointEditForm as default };
