import Civilization from '../../core-civilization/Civilization.js';

export class English extends Civilization {
  people = 'English';
  nation = 'England';
  colors = ['#fd5dfc', '#832317', '#fff'];
  leaders = [
    {
      name: 'Elizabeth',
      traits: {
        expansionist: true,
        civilized: true,
        militaristic: true,
      },
    },
    {
      name: 'Victoria',
      traits: {
        expansionist: true,
        civilized: true,
        militaristic: true,
      },
    },
    {
      name: 'Winston Churchill',
      traits: {
        expansionist: false,
        civilized: false,
        militaristic: true,
      },
    },
  ];
  cityNames = [
    'London',
    'Birmingham',
    'Liverpool',
    'Leeds',
    'Sheffield',
    'Bristol',
    'Manchester',
    'Leicester',
    'Coventry',
    'Kingston upon Hull',
    'Stoke-on-Trent',
    'Wolverhampton',
    'Nottingham',
    'Plymouth',
    'Southampton',
    'Reading',
    'Derby',
    'Dudley',
    'Newcastle upon Tyne',
    'Northampton',
    'Portsmouth',
    'Luton',
    'Preston',
    'Sunderland',
    'Norwich',
    'Walsall',
    'Bournemouth',
    'Southend-on-Sea',
    'Swindon',
    'Huddersfield',
    'Poole',
    'Oxford',
    'Middlesbrough',
    'Blackpool',
    'Oldbury',
    'Boldon',
    'Ipswich',
    'York',
    'West Bromwich',
    'Peterborough',
    'Stockport',
    'Brighton',
    'Slough',
    'Gloucester',
    'Rotherham',
    'Cambridge',
    'Exeter',
    'Eastbourne',
    'Sutton Coldfield',
    'Blackburn',
    'Colchester',
    'Oldham',
    'St Helens',
    'Woking',
    'Chesterfield',
    'Crawley',
  ];
  priorityTechnologies = [
    'alphabet',
    'mapmaking',
    'bronze-working',
    'the-wheel',
  ];
}

export default English;