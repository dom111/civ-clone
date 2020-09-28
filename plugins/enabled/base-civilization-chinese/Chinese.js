import Civilization from '../core-civilization/Civilization.js';

export class Chinese extends Civilization {
  people = 'Chinese';
  nation = 'China';
  colors = ['#63e367', '#2f7b00', '#fff'];
  leaders = [
    {
      name: 'Mao Zedong',
      traits: {
        expansionist: true,
        civilized: true,
        militaristic: false,
      },
    },
  ];
  cityNames = [
    'Beijing',
    'Shanghai',
    'Chongqing',
    'Tianjin',
    'Guangzhou',
    'Shenzhen†',
    'Chengdu',
    'Nanjing',
    'Wuhan',
    'Xi\'an',
    'Hangzhou',
    'Dongguan',
    'Foshan',
    'Shenyang',
    'Harbin',
    'Qingdao',
    'Dalian',
    'Jinan',
    'Zhengzhou',
    'Changsha',
    'Kunming',
    'Changchun',
    'Ürümqi',
    'Shantou',
    'Hefei',
    'Shijiazhuang',
    'Ningbo',
    'Taiyuan',
    'Nanning',
    'Xiamen†',
    'Fuzhou',
    'Changzhou',
    'Wenzhou',
    'Nanchang',
    'Tangshan',
    'Guiyang',
    'Wuxi',
    'Lanzhou',
    'Zhongshan',
    'Handan',
    'Huai\'an',
    'Weifang',
    'Zibo',
    'Shaoxing',
    'Yantai',
    'Huizhou',
    'Luoyang',
    'Nantong',
    'Baotou',
    'Liuzhou',
  ];
  priorityTechnologies = [
    'alphabet',
    'writing',
    'pottery',
  ];
}

export default Chinese;