import Civilization from '../../core-civilization/Civilization.js';

export class German extends Civilization {
  people = 'German';
  nation = 'Germany';
  colors = ['#7b8fff', '#334fb3', '#fff'];
  leaders = [
    {
      name: 'Frederik',
      traits: {
        expansionist: false,
        civilized: true,
        militaristic: true,
      },
    },
  ];
  cityNames = [
    'Berlin',
    'Hamburg',
    'Munich',
    'Cologne',
    'Frankfurt',
    'Stuttgart',
    'Düsseldorf',
    'Dortmund',
    'Essen',
    'Leipzig',
    'Bremen',
    'Dresden',
    'Hanover',
    'Nuremberg',
    'Duisburg',
    'Bochum',
    'Wuppertal',
    'Bielefeld',
    'Bonn',
    'Münster',
    'Karlsruhe',
    'Mannheim',
    'Augsburg',
    'Wiesbaden',
    'Gelsenkirchen',
    'Mönchengladbach',
    'Braunschweig',
    'Chemnitz',
    'Kiel',
    'Aachen',
    'Halle',
    'Magdeburg',
    'Freiburg',
    'Krefeld',
    'Lübeck',
    'Oberhausen',
    'Erfurt',
    'Mainz',
    'Rostock',
    'Kassel',
    'Hagen',
    'Hamm',
    'Saarbrücken',
    'Mülheim an der Ruhr',
    'Potsdam',
    'Ludwigshafen am Rhein',
    'Oldenburg',
    'Leverkusen',
    'Osnabrück',
    'Solingen',
  ];
  priorityTechnologies = [
    'bronze-working',
    'iron-working',
    'masonry',
  ];
}

export default German;