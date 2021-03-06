import Civilization from '../core-civilization/Civilization.js';

export class Polish extends Civilization {
  people = 'Polish';
  nation = 'Poland';
  colors = ['#63e367', '#2f7b00', '#fff'];
  leaders = [
    {
      name: 'Jedwiga',
      traits: {
        expansionist: false,
        civilized: true,
        militaristic: true,
      },
    },
  ];
  cityNames = [
    'Warsaw',
    'Kraków',
    'Łódź',
    'Wrocław',
    'Poznań',
    'Gdańsk',
    'Szczecin',
    'Bydgoszcz',
    'Lublin',
    'Białystok',
    'Katowice Silesian',
    'Gdynia',
    'Częstochowa',
    'Radom',
    'Sosnowiec',
    'Toruń',
    'Kielce',
    'Rzeszów',
    'Gliwice',
    'Zabrze',
    'Olsztyn',
    'Bielsko-Biała',
    'Bytom',
    'Zielona Góra',
    'Rybnik',
    'Ruda Śląska',
    'Tychy',
    'Gorzów Wielkopolski',
    'Dąbrowa Górnicza',
    'Płock',
    'Elbląg',
    'Opole',
    'Wałbrzych',
    'Włocławek',
    'Tarnów',
    'Chorzów',
    'Kalisz',
    'Koszalin',
    'Legnica',
    'Grudziądz',
    'Słupsk',
    'Jaworzno',
    'Jastrzębie Zdrój',
    'Jelenia Góra',
    'Nowy Sącz',
    'Konin',
    'Piotrków Trybunalski',
    'Siedlce',
    'Lubin',
    'Inowrocław',
    'Mysłowice',
    'Piła',
    'Ostrowiec Świętokrzyski',
    'Ostrów Wielkopolski',
    'Siemianowice Śląskie',
    'Stargard',
    'Pabianice',
    'Gniezno',
    'Suwałki',
    'Głogów',
    'Chełm',
    'Przemyśl',
    'Zamość',
    'Tomaszów Mazowiecki',
    'Stalowa Wola',
    'Kędzierzyn-Koźle',
    'Leszno',
    'Łomża',
    'Żory',
    'Bełchatów',
    'Mielec',
    'Tarnowskie Góry',
    'Tczew',
    'Świdnica',
    'Piekary Śląskie',
    'Będzin',
    'Zgierz',
    'Biała Podlaska',
    'Racibórz',
    'Ełk',
    'Pruszków',
    'Świętochłowice',
    'Ostrołęka',
    'Starachowice',
    'Zawiercie',
    'Legionowo',
    'Tarnobrzeg',
    'Puławy',
    'Wodzisław Śląski',
    'Radomsko',
  ];
  priorityTechnologies = [
    'bronze-working',
    'iron-working',
    'masonry',
  ];
}

export default Polish;
