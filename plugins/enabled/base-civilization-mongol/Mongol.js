import Civilization from '../core-civilization/Civilization.js';

export class Mongol extends Civilization {
  people = 'Mongol';
  nation = 'Mongolia';
  colors = ['#fd5dfc', '#832317', '#fff'];
  leaders = [
    {
      name: 'Genghis Khan',
      traits: {
        expansionist: true,
        civilized: false,
        militaristic: true,
      },
    },
  ];
  cityNames = [
    'Ulaanbaatar',
    'Erdenet',
    'Darkhan',
    'Choibalsan',
    'Mörön',
    'Nalaikh',
    'Bayankhongor',
    'Ölgii',
    'Khovd',
    'Arvaikheer',
    'Ulaangom',
    'Baganuur',
    'Sainshand',
    'Tsetserleg',
    'Sükhbaatar',
    'Öndörkhaan',
    'Dalanzadgad',
    'Züünkharaa',
    'Uliastai',
    'Altai',
    'Baruun-Urt',
    'Mandalgovi',
    'Zuunmod',
    'Zamyn-Üüd',
    'Bulgan',
    'Kharkhorin',
    'Choir',
    'Bor-Öndör',
    'Sharyngo',
  ];
  priorityTechnologies = [
    'bronzeworking',
    'ironworking',
    'horseback-riding',
  ];
}

export default Mongol;

