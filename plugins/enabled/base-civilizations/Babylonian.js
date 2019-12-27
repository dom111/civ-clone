import Civilization from 'core-civilization/Civilization.js';

export class Babylonian extends Civilization {
  name = 'babylonian';
  people = 'Babylonian';
  nation = 'Babylon';
  colors = ['#63e367', '#2f7b00', '#fff'];
  leaders = [
    {
      name: 'Hammurabi',
      images: [
        'civilizations/images/babylon-hammurabi.jpg'
      ],
      traits: {
        expansionist: true,
        civilized: true,
        militaristic: false
      }
    }
  ];
  cityNames = [
    'Babilim',
    'Eshnunna',
    'Diniktum',
    'Tutub',
    'Der',
    'Sippar',
    'Kutha',
    'Jemdet Nasr',
    'Kish',
    'Borsippa',
    'Mashkan-shapir',
    'Dilbat',
    'Nippur',
    'Marad',
    'Adab',
    'Isin',
    'Kisurra',
    'Shuruppak',
    'Bad-tibira',
    'Zabalam',
    'Umma',
    'Girsu',
    'Lagash',
    'Urum',
    'Uruk',
    'Larsa',
    'Ur',
    'Kuara',
    'Eridu',
    'Akshak',
    'Akkad'
  ];
  priorityTechnologies = [
    'alphabet',
    'writing',
    'code-of-laws'
  ];
}

export default Babylonian;