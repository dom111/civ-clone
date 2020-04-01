import Civilization from '../core-civilization/Civilization.js';

export class Japanese extends Civilization {
  people = 'Japanese';
  nation = 'Japan';
  colors = ['#fd5dfc', '#832317', '#fff'];
  leaders = [
    {
      name: 'Oda Nobunaga',
      traits: {
        expansionist: true,
        civilized: true,
        militaristic: true,
      },
    },
    {
      name: 'Tokugawa Ieyasu',
      traits: {
        expansionist: true,
        civilized: true,
        militaristic: true,
      },
    },
  ];
  cityNames = [
    'Tokyo',
    'Kanagawa',
    'Osaka',
    'Aichi',
    'Hokkaidō',
    'Fukuoka',
    'Hyōgo',
    'Kyoto',
    'Saitama',
    'Hiroshima',
    'Miyagi',
    'Chiba',
    'Niigata',
    'Shizuoka',
    'Okayama',
    'Kumamoto',
    'Kagoshima',
    'Ehime',
    'Tochigi',
    'Ōita',
    'Ishikawa',
    'Nagasaki',
    'Toyama',
    'Kagawa',
    'Gifu',
    'Nagano',
    'Wakayama',
    'Miyazaki',
    'Nara',
    'Fukushima',
    'Kōchi',
    'Gunma',
    'Akita',
    'Shiga',
    'Okinawa',
    'Mie',
    'Aomori',
    'Iwate',
    'Yamaguchi',
    'Fukui',
    'Tokushima',
    'Ibaraki',
    'Yamagata',
    'Saga',
    'Tottori',
    'Yamanashi',
    'Shimane',
  ];
  priorityTechnologies = [
    'alphabet',
    'mapmaking',
    'horseback-riding',
  ];
}

export default Japanese;

