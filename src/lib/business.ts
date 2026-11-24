export const business = {
  name: 'En-cas 2 faim',
  streetAddress: '8 rue nationale',
  postalCode: '56250',
  city: 'Elven',
  phoneDisplay: '02 97 53 55 62',
  phoneHref: '+33297535562',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=8+rue+nationale+56250+Elven',
};

export const openingHours = [
  { days: 'Lundi à jeudi', ranges: '11h30 à 14h · 18h à 22h' },
  { days: 'Vendredi', ranges: '11h30 à 14h · 18h à 22h30' },
  { days: 'Samedi et dimanche', ranges: '18h à 22h30' },
];

export const openingHoursSpecification = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '11:30',
    closes: '14:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '18:00',
    closes: '22:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'Friday',
    opens: '11:30',
    closes: '14:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'Friday',
    opens: '18:00',
    closes: '22:30',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday', 'Sunday'],
    opens: '18:00',
    closes: '22:30',
  },
];
