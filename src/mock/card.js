const COUNT_PICTURE = 5;

const Types = [
  {
    id: `taxi`,
    title: `Taxi`,
    placeholder: `to`
  },
  {
    id: `bus`,
    title: `Bus`,
    placeholder: `to`
  },
  {
    id: `train`,
    title: `Train`,
    placeholder: `to`
  },
  {
    id: `ship`,
    title: `Ship`,
    placeholder: `to`
  },
  {
    id: `transport`,
    title: `Transport`,
    placeholder: `to`
  },
  {
    id: `drive`,
    title: `Drive`,
    placeholder: `to`
  },
  {
    id: `flight`,
    title: `Flight`,
    placeholder: `to`
  },
  {
    id: `check-in`,
    title: `Check`,
    placeholder: `into`
  },
  {
    id: `sightseeing`,
    title: `Sightseeing`,
    placeholder: `at`
  },
  {
    id: `restaurant`,
    title: `Restaurant`,
    placeholder: `at`
  },
];

const Cities = [
  `Amsterdam`,
  `Geneva`,
  `Barcelona`,
  `Dresden`,
  `Praha`
];

const DescriptionsItems = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const Offers = [
  {
    title: `Add luggage`,
    price: 30,
  },
  {
    title: `Switch to comfort class`,
    price: 100,
  },
  {
    title: `Add meal`,
    price: 15,
  },
  {
    title: `Choose seats`,
    price: 5,
  },
  {
    title: `Travel by train`,
    price: 40,
  }
];

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const generateOffers = (offers) => {
  return offers
    .filter(() => Math.random() > 0.5)
    .slice(0, 2);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomDescription = () => {
  const descriptionLength = getRandomIntegerNumber(1, 3);
  const description = new Set();
  for (let i = 0; i < descriptionLength; i++) {
    description.add(getRandomArrayItem(DescriptionsItems));
  }
  return Array.from(description).join(` `);
};

const getRandomDate = () => {
  const targetDate = new Date();
  const diffValue = getRandomIntegerNumber(0, 6);

  targetDate.setHours(targetDate.getHours() + diffValue);

  return targetDate;
};

const generateCard = () => {
  const startTime = getRandomDate();
  const duration = getRandomIntegerNumber(30, 120) * 60 * 1000;
  const endTime = new Date(startTime.valueOf() + duration);

  return {
    type: getRandomArrayItem(Types),
    city: getRandomArrayItem(Cities),
    pictures: new Array(COUNT_PICTURE).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`),
    description: getRandomDescription(),
    startTime,
    endTime,
    price: getRandomIntegerNumber(50, 100),
    offers: new Set(generateOffers(Offers))
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard).sort((a, b) => a.startTime < b.startTime);
};

export {generateCard, generateCards};
