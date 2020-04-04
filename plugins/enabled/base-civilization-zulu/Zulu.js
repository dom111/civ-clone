import Civilization from '../core-civilization/Civilization.js';

export class Zulu extends Civilization {
  people = 'Zulu';
  nation = 'Zulus';
  colors = ['#fff', '#ccc', '#000'];
  leaders = [
    {
      name: 'Shaka',
      traits: {
        expansionist: true,
        civilized: false,
        militaristic: true,
      },
    },
  ];
  cityNames = [
    'uMgungundlovu',
    'Nobamba',
    'Bulawayo',
    'KwaDukuza',
    'Nongoma',
    'oNdini',
    'Nodwengu',
    'Ndondakusuka',
    'Babanango',
    'Khangela',
    'Kwahlomendlini',
    'Hlobane',
    'eThekwini',
    'Mlambongwenya',
    'Eziqwaqweni',
    'Isiphezi',
    'Masotsheni',
    'Mtunzini',
    'Nyakamubi',
    'Hlatikulu',
    'Mthonjaneni',
    'Empangeni',
    'Pongola',
    'Tungela',
    'Kwamashu',
    'Ingwavuma',
    'Hluhluwe',
    'Mtubatuba',
    'Mhlahlandlela',
    'Mthatha',
    'Maseru',
    'Lobamba',
    'Qunu',
  ];
  priorityTechnologies = [
    'pottery',
    'masonry',
    'currency',
  ];
}

export default Zulu;