import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../../../base-terrain/Terrains.js';
import {Land, Water} from '../../../core-terrain/Types.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'terrain:distribution:arctic',
    new Criterion((Terrain) => Terrain === Arctic),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .0,
        to: .02,
        coverage: 1,
        cluster: true,
      },
      {
        from: .02,
        to: .1,
      },
      {
        from: .90,
        to: .98,
      },
      {
        from: .98,
        to: 1,
        coverage: 1,
        cluster: true,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:desert',
    new Criterion((Terrain) => Terrain === Desert),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .4,
        to: .45,
      },
      {
        from: .45,
        to: .55,
        coverage: .25,
        cluster: true,
        clusterChance: .6,
      },
      {
        from: .55,
        to: .6,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:forest',
    new Criterion((Terrain) => Terrain === Forest),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .05,
        to: .2,
      },
      {
        from: .2,
        to: .4,
        cluster: true,
        clusterChance: .4,
        coverage: .4,
      },
      {
        from: .4,
        to: .6,
      },
      {
        from: .6,
        to: .8,
        cluster: true,
        clusterChance: .4,
        coverage: .4,
      },
      {
        from: .8,
        to: .95,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:grassland',
    new Criterion((Terrain) => Terrain === Grassland),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        fill: true,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:hills',
    new Criterion((Terrain) => Terrain === Hills),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .1,
        to: .9,
        path: true,
        pathChance: .5,
        coverage: .2,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:jungle',
    new Criterion((Terrain) => Terrain === Jungle),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .3,
        to: .45,
        cluster: true,
        clusterChance: .2,
        coverage: .4,
      },
      {
        from: .55,
        to: .7,
        cluster: true,
        clusterChance: .2,
        coverage: .4,
      },
    ])
  ),


  new Rule(
    'terrain:distribution:mountains',
    new Criterion((Terrain) => Terrain === Mountains),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .1,
        to: .9,
        cluster: true,
        path: true,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:ocean',
    new Criterion((Terrain) => Terrain === Ocean),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile.constructor === Water)),
    new Effect(() => [
      {
        fill: true,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:plains',
    new Criterion((Terrain) => Terrain === Plains),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .1,
        to: .2,
      },
      {
        from: .2,
        to: .4,
      },
      {
        from: .1,
        to: .4,
        path: true,
      },
      {
        from: .4,
        to: .6,
      },
      {
        from: .6,
        to: .8,
      },
      {
        from: .6,
        to: .9,
        path: true,
      },
      {
        from: .8,
        to: .9,
      },
    ])
  ),


  new Rule(
    'terrain:distribution:river',
    new Criterion((Terrain) => Terrain === River),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .1,
        to: .9,
        coverage: .2,
        path: true,
        pathChance: .75,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:river',
    new Criterion((Terrain) => Terrain === Swamp),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .2,
        to: .4,
        cluster: true,
      },
      {
        from: .6,
        to: .8,
        cluster: true,
      },
    ])
  ),

  new Rule(
    'terrain:distribution:river',
    new Criterion((Terrain) => Terrain === Tundra),

    new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
    new Effect(() => [
      {
        from: .02,
        to: .15,
        cluster: true,
      },
      {
        from: .85,
        to: .98,
        cluster: true,
      },
    ])
  ),
];

export default getRules;
