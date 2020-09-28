import Civilization from '../core-civilization/Civilization.js';

export class Aztec extends Civilization {
  people = 'Aztec';
  nation = 'Aztec';
  colors = ['#63e367', '#2f7b00', '#fff'];
  leaders = [
    {
      name: 'Montezuma',
      traits: {
        expansionist: true,
        civilized: true,
        militaristic: true,
      },
    },
  ];
  cityNames = [
    'Tenochtitlan',
    'Teotihuacan',
    'Tlatelolco',
    'Texcoco',
    'Tlaxcala',
    'Calixtlahuaca',
    'Xochicalco',
    'Tlacopan',
    'Atzcapotzalco',
    'Tzintzuntzan',
    'Malinalco',
    'Tula',
    'Tamuin',
    'Teayo',
    'Cempoala',
    'Chalco',
    'Tlalmanalco',
    'Ixtapaluca',
    'Huexotla',
    'Tepexpan',
    'Tepetlaoxtoc',
    'Chiconautla',
    'Zitlaltepec',
    'Coyotepec',
    'Tequixquiac',
    'Jilotzingo',
    'Tlapanaloya',
    'Tultitan',
    'Ecatepec',
    'Coatepec',
    'Chalchiuites',
    'Chiauhita',
    'Chapultepec',
    'Itzapalapa',
    'Ayotzinco',
    'Iztapam',
  ];
  priorityTechnologies = [
    'pottery',
    'bronze-working',
    'ceremonial-burial',
  ];
}

export default Aztec;
