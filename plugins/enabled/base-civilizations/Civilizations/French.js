import Civilization from '../../core-civilization/Civilization.js';

export class French extends Civilization {
  people = 'French';
  nation = 'France';
  colors = ['#63e367', '#2f7b00', '#fff'];
  leaders = [
    {
      name: 'Napoleon',
      traits: {
        expansionist: true,
        civilized: true,
        militaristic: false,
      },
    },
  ];
  cityNames = [
    'Paris',
    'Marseille',
    'Lyon',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille',
    'Rennes',
    'Reims',
    'Le Havre',
    'Saint-Étienne',
    'Toulon',
    'Grenoble',
    'Dijon',
    'Nîmes',
    'Angers',
    'Villeurbanne',
    'Le Mans',
    'Saint-Denis',
    'Aix-en-Provence',
    'Clermont-Ferrand',
    'Brest',
    'Limoges',
    'Tours',
    'Amiens',
    'Perpignan',
    'Metz',
    'Besançon',
    'Boulogne-Billancourt',
    'Orléans',
    'Mulhouse',
    'Rouen',
    'Saint-Denis',
    'Caen',
    'Argenteuil',
    'Saint-Paul',
    'Montreuil',
    'Nancy',
    'Roubaix',
    'Tourcoing',
    'Nanterre',
    'Avignon',
    'Vitry-sur-Seine',
    'Créteil',
    'Dunkirk',
    'Poitiers',
    'Asnières-sur-Seine',
    'Courbevoie',
    'Versailles',
    'Colombes',
    'Fort-de-France',
    'Aulnay-sous-Bois',
    'Saint-Pierre',
    'Rueil-Malmaison',
    'Pau',
    'Aubervilliers',
    'Le Tampon',
    'Champigny-sur-Marne',
    'Antibes',
    'Béziers',
    'La Rochelle',
    'Saint-Maur-des-Fossés',
    'Cannes',
    'Calais',
    'Saint-Nazaire',
    'Mérignac',
    'Drancy',
    'Colmar',
    'Ajaccio',
    'Bourges',
    'Issy-les-Moulineaux',
    'Levallois-Perret',
    'La Seyne-sur-Mer',
    'Quimper',
    'Noisy-le-Grand',
    'Villeneuve-d\'Ascq',
    'Neuilly-sur-Seine',
    'Valence',
    'Antony',
    'Cergy',
    'Vénissieux',
    'Pessac',
    'Troyes',
    'Clichy',
    'Ivry-sur-Seine',
    'Chambéry',
    'Lorient',
    'Les Abymes',
    'Montauban',
    'Sarcelles',
    'Niort',
    'Villejuif',
    'Saint-André',
    'Hyères',
    'Saint-Quentin',
    'Beauvais',
    'Épinay-sur-Seine',
    'Cayenne',
    'Maisons-Alfort',
    'Cholet',
    'Meaux',
    'Chelles',
    'Pantin',
    'Évry',
    'Fontenay-sous-Bois',
    'Fréjus',
    'Vannes',
    'Bondy',
    'Le Blanc-Mesnil',
    'La Roche-sur-Yon',
    'Saint-Louis',
    'Arles',
    'Clamart',
    'Narbonne',
    'Annecy',
    'Sartrouville',
    'Grasse',
    'Laval',
    'Belfort',
    'Bobigny',
    'Évreux',
    'Vincennes',
    'Montrouge',
    'Sevran',
    'Albi',
    'Charleville-Mézières',
    'Suresnes',
    'Martigues',
    'Corbeil-Essonnes',
    'Saint-Ouen',
    'Bayonne',
    'Cagnes-sur-Mer',
    'Brive-la-Gaillarde',
    'Carcassonne',
    'Massy',
    'Blois',
    'Aubagne',
    'Saint-Brieuc',
    'Châteauroux',
    'Chalon-sur-Saône',
    'Mantes-la-Jolie',
    'Meudon',
    'Saint-Malo',
    'Châlons-en-Champagne',
    'Alfortville',
    'Sète',
    'Salon-de-Provence',
    'Vaulx-en-Velin',
    'Puteaux',
    'Rosny-sous-Bois',
    'Saint-Herblain',
    'Gennevilliers',
    'Le Cannet',
    'Livry-Gargan',
    'Saint-Priest',
    'Istres',
    'Valenciennes',
    'Choisy-le-Roi',
    'Caluire-et-Cuire',
    'Boulogne-sur-Mer',
    'Bastia',
    'Angoulême',
    'Garges-lès-Gonesse',
    'Castres',
    'Thionville',
    'Wattrelos',
    'Talence',
    'Saint-Laurent-du-Maroni',
    'Douai',
    'Noisy-le-Sec',
    'Tarbes',
    'Arras',
    'Alès',
    'La Courneuve',
    'Bourg-en-Bresse',
    'Compiègne',
    'Gap',
    'Melun',
    'Le Lamentin',
    'Rezé',
    'Saint-Germain-en-Laye',
    'Marcq-en-Barœul',
    'Gagny',
    'Anglet',
    'Draguignan',
    'Chartres',
    'Bron',
    'Bagneux',
    'Colomiers',
    'Saint-Martin-d\'Hères',
    'Pontault-Combault',
    'Montluçon',
    'Joué-lès-Tours',
    'Saint-Joseph',
    'Poissy',
    'Savigny-sur-Orge',
    'Cherbourg-Octeville',
    'Montélimar',
    'Villefranche-sur-Saône',
    'Stains',
    'Saint-Benoît',
    'Bagnolet',
    'Châtillon',
    'Le Port',
    'Sainte-Geneviève-des-Bois',
    'Échirolles',
    'Roanne',
    'Villepinte',
    'Saint-Chamond',
    'Conflans-Sainte-Honorine',
    'Auxerre',
    'Nevers',
    'Neuilly-sur-Marne',
    'La Ciotat',
    'Tremblay-en-France',
    'Thonon-les-Bains',
    'Vitrolles',
    'Haguenau',
    'Six-Fours-les-Plages',
    'Agen',
    'Creil',
    'Annemasse',
    'Saint-Raphaël',
    'Marignane',
    'Romans-sur-Isère',
    'Montigny-le-Bretonneux',
    'Le Perreux-sur-Marne',
    'Franconville',
    'Mâcon',
    'Saint-Leu',
    'Cambrai',
    'Châtenay-Malabry',
    'Sainte-Marie',
    'Villeneuve-Saint-Georges',
    'Houilles',
    'Épinal',
    'Lens',
    'Liévin',
    'Les Mureaux',
    'Schiltigheim',
    'La Possession',
    'Meyzieu',
    'Dreux',
    'Nogent-sur-Marne',
    'Plaisir',
    'Mont-de-Marsan',
    'Palaiseau',
    'Châtellerault',
    'Goussainville',
    'L\'Haÿ-les-Roses',
    'Viry-Châtillon',
    'Vigneux-sur-Seine',
    'Chatou',
    'Trappes',
    'Clichy-sous-Bois',
    'Rillieux-la-Pape',
    'Villenave-\'Ornon',
    'Maubeuge',
    'Charenton-le-Pont',
    'Malakoff',
    'Matoury',
    'Dieppe',
    'Athis-Mons',
    'Savigny-le-Temple',
    'Périgueux',
    'Baie-Mahault',
    'Vandoeuvre-lès-Nancy',
    'Pontoise',
    'Aix-les-Bains',
    'Cachan',
    'Vienne',
    'Thiais',
    'Orange',
    'Saint-Médard-en-Jalles',
    'Villemomble',
    'Saint-Cloud',
    'Saint-Laurent-du-Var',
    'Yerres',
    'Saint-Étienne-du-Rouvray',
    'Sotteville-lès-Rouen',
    'Draveil',
    'Le Chesnay',
    'Bois-Colombes',
    'Le Plessis-Robinson',
    'La Garenne-Colombes',
    'Lambersart',
    'Soissons',
    'Pierrefitte-sur-Seine',
    'Carpentras',
    'Villiers-sur-Marne',
    'Vanves',
    'Menton',
    'Bergerac',
    'Ermont',
    'Bezons',
    'Grigny',
    'Guyancourt',
    'Saumur',
    'Herblay',
    'Ris-Orangis',
    'Villiers-le-Bel',
    'Bourgoin-Jallieu',
    'Vierzon',
    'Le Gosier',
    'Décines-Charpieu',
    'Hénin-Beaumont',
    'Fresnes',
    'Aurillac',
    'Sannois',
    'Vallauris',
    'Illkirch-Graffenstaden',
    'Alençon',
    'Élancourt',
    'Tournefeuille',
    'Bègles',
    'Gonesse',
    'Oullins',
    'Brunoy',
    'Taverny',
    'Armentières',
    'Montfermeil',
    'Rambouillet',
    'Villeparisis',
    'Le Kremlin-Bicêtre',
    'Sucy-en-Brie',
    'Kourou',
    'Montbéliard',
    'Romainville',
    'Cavaillon',
    'Saint-Dizier',
    'Brétigny-sur-Orge',
    'Saint-Sébastien-sur-Loire',
    'Saintes',
    'La Teste-de-Buch',
    'Villeneuve-la-Garenne',
    'Béthune',
    'Bussy-Saint-Georges',
    'Vichy',
    'La Garde',
    'Agde',
    'Laon',
    'Sens',
    'Lunel',
    'Miramas',
    'Biarritz',
    'Le Grand-Quevilly',
    'Orvault',
    'Les Ulis',
    'Champs-sur-Marne',
    'Rochefort',
    'Muret',
    'Sainte-Anne',
    'Eaubonne',
    'Étampes',
    'Gradignan',
    'Vernon',
    'Petit-Bourg',
    'Libourne',
    'Abbeville',
    'Rodez',
    'Saint-Ouen-l\'Aumône',
    'Torcy',
    'Maisons-Laffitte',
    'Montgeron',
    'Villeneuve-sur-Lot',
    'Cormeilles-en-Parisis',
    'Épernay',
    'Sèvres',
    'Dole',
    'Le Robert',
    'Le Bouscat',
    'Blagnac',
    'Frontignan',
    'Cenon',
    'Mandelieu-la-Napoule',
    'Vertou',
    'Les Lilas',
    'Bruay-la-Buissière',
    'Les Pavillons-sous-Bois',
    'Chaumont',
    'Roissy-en-Brie',
    'Le Moule',
    'Le Petit-Quevilly',
    'Manosque',
    'Saint-Mandé',
    'Fontenay-aux-Roses',
    'Orly',
    'Le Creusot',
    'Oyonnax',
    'La Madeleine',
    'Sainte-Suzanne',
    'Millau',
    'Combs-la-Ville',
    'Fontaine',
    'Deuil-la-Barre',
    'Coudekerque-Branche',
    'Auch',
    'Lanester',
    'Beaune',
    'Montigny-lès-Metz',
    'Hazebrouck',
    'Longjumeau',
    'Sainte-Foy-lès-Lyon',
    'Forbach',
    'Sarreguemines',
    'Mons-en-Barœul',
    'La Valette-du-Var',
    'Hérouville-Saint-Clair',
    'Morsang-sur-Orge',
    'Grande-Synthe',
    'La Celle-Saint-Cloud',
    'Lisieux',
    'Croix',
    'Dammarie-les-Lys',
    'Vélizy-Villacoublay',
    'Wasquehal',
    'Saint-Gratien',
    'Halluin',
    'Neuilly-Plaisance',
    'Montmorency',
    'Dax',
    'Lagny-sur-Marne',
    'Le Mée-sur-Seine',
    'Saint-Genis-Laval',
    'Fleury-les-Aubrais',
    'Loos',
    'Gif-sur-Yvette',
    'Denain',
    'Saint-Dié-des-Vosges',
    'Sainte-Rose',
    'Saint-Michel-sur-Orge',
  ];
  priorityTechnologies = [
    'alphabet',
    'writing',
    'code-of-laws',
  ];
}

export default French;
