import Civilization from '../core-civilization/Civilization.js';

export class Egyptian extends Civilization {
  people = 'Egyptian';
  nation = 'Egypt';
  colors = ['#63e367', '#2f7b00', '#fff'];
  leaders = [
    {
      name: 'Ramesses II',
      traits: {
        expansionist: false,
        civilized: true,
        militaristic: false,
      },
    },
  ];
  cityNames = [
    'Cairo',
    'Alexandria',
    'Gizeh',
    'Shubra El-Kheima',
    'Port Said',
    'Suez',
    'Luxor',
    'al-Mansura',
    'El-Mahalla El-Kubra',
    'Tanta',
    'Asyut',
    'Ismailia',
    'Fayyum',
    'Zagazig',
    'Aswan',
    'Damietta',
    'Damanhur',
    'al-Minya',
    'Beni Suef',
    'Qena',
    'Sohag',
    'Hurghada',
    '6th of October City',
    'Shibin El Kom',
    'Banha',
    'Kafr el-Sheikh',
    'Arish',
    'Mallawi',
    '10th of Ramadan City',
    'Bilbais',
    'Marsa Matruh',
    'Idfu',
    'Mit Ghamr',
    'Al-Hamidiyya',
    'Desouk',
    'Qalyub',
    'Abu Kabir',
    'Kafr el-Dawwar',
    'Girga',
    'Akhmim',
    'Matarey',
  ];
  priorityTechnologies = [
    'alphabet',
    'masonry',
    'pottery',
  ];
}

export default Egyptian;