import { formatTime } from '../utils';
import { Offers } from '../const';

const getDuration = (start, end) => {
  const duration = Math.floor((end - start) / (60 * 1000));
  let minutes = duration % 60;
  let hours = Math.floor(duration / 60) % 60;
  let days = Math.floor(duration / 3600) % 24;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  hours = (hours < 10) ? `0${hours}` : hours;
  days = (days < 10) ? `0${days}` : days;
  return {
    minutes,
    hours,
    days
  };
};

const getDurationMarkup = (duration) => {
  return (
    `${duration.days !== `00` ? `${duration.days}D` : ``}
    ${duration.hours !== `00` ? `${duration.hours}H` : ``}
    ${duration.minutes !== `00` ? `${duration.minutes}M` : ``}`
  );
};

const getOfferMarkup = (offers) => {
  return Object.keys(offers).map((offer)=>{
    return (offers[offer] ? `<li class="event__offer">
    <span class="event__offer-title">${Offers[offer].title}</span>
     &plus;
    &euro;&nbsp;<span class="event__offer-price">${Offers[offer].price}</span>
   </li>` : ``);
  }).join(`\n`);
};

export const getCardTemplate = ({ type, city, startTime, endTime, price, offers }) => {
  const offerMarkup = getOfferMarkup(offers);
  const duration = getDuration(startTime, endTime);
  const durationMarkup = getDurationMarkup(duration);

  return (`
  <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.id}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type.title} ${type.placeholder} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startTime.toISOString()}">${formatTime(startTime)}</time>
          &mdash;
          <time class="event__end-time" datetime="${endTime.toISOString()}">${formatTime(endTime)}</time>
        </p>
        <p class="event__duration">${durationMarkup}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offerMarkup}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `);
};
