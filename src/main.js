import InfoComponent from './components/info';
import MenuComponent from './components/menu';
import FilterComponent from './components/filter';

import SortComponent from './components/sort';
import DayListComponent from './components/day-list';
import DayComponent from './components/day';

import NoCardsMessageComponent from './components/no-cards-message';

import CardComponent from './components/card';
import CardEditComponent from './components/card-edit';


import { getDate, getUnique } from './utils/common';
import { renderComponent, RenderPosition } from './utils/render';

import { filterItem } from './mock/filter';
import { cards } from './mock/card';

const renderCard = (cardListElement, card) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      startCardEditing();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const startCardEditing = () => {
    cardListElement.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
  };

  const stopCardEditing = () => {
    cardListElement.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
  };

  const cardComponent = new CardComponent(card);
  cardComponent.setEditButtonClickHandler(() => {
    stopCardEditing();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const cardEditComponent = new CardEditComponent(card);

  cardEditComponent.setSubmitHandler(startCardEditing);

  renderComponent(cardListElement, cardComponent, RenderPosition.BEFORE_END);
};

const tripMainElement = document.querySelector(`.js-trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.js-trip-info`);
const tripConrolsElement = tripMainElement.querySelector(`.js-trip-controls`);
const tripControlsHeaderElements = tripConrolsElement.querySelectorAll(`.js-trip-controls-heading`);

renderComponent(tripControlsHeaderElements[0], new MenuComponent(), RenderPosition.AFTER);
renderComponent(tripControlsHeaderElements[1], new FilterComponent(filterItem), RenderPosition.AFTER);

const tripEventsElement = document.querySelector(`.js-trip-events`);

if (cards.length === 0) {
  const noCardsMessageComponent = new NoCardsMessageComponent();
  renderComponent(tripEventsElement, noCardsMessageComponent, RenderPosition.BEFORE_END);
} else {
  renderComponent(tripInfoElement, new InfoComponent(cards), RenderPosition.AFTER_BEGIN);
  renderComponent(tripEventsElement, new SortComponent(), RenderPosition.BEFORE_END);

  const dayListComponent = new DayListComponent();
  const dayListElement = dayListComponent.getElement();

  renderComponent(tripEventsElement, dayListComponent, RenderPosition.BEFORE_END);

  const days = getUnique(cards.map((card) => getDate(card.startTime)));

  days.forEach((day) => {
    const dayComponent = new DayComponent(day);
    renderComponent(dayListElement, dayComponent, RenderPosition.BEFORE_END);
    const eventList = dayComponent.getElement().querySelector(`.js-trip-events__list`);
    cards
      .filter((card) => getDate(card.startTime) === day)
      .forEach((card) => renderCard(eventList, card));
  });

  const cost = cards
                .map(({ price }) => price)
                .reduce((sum, price) => sum + price);

  const costPlace = document.querySelector(`.js-trip-info__cost-value`);

  costPlace.textContent = cost;
}
