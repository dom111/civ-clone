# civ-clone

Open source, plugin-based, clone of the original Civilization

## Classes

### Game

Includes the key components of the game, events this should be a class that extends the EventEmitter class so there can be global events that affect the game

### Menu

The various menus are handled in here, this might have to be made extensible using plugins, maybe the main menu is the only exception? Maybe this needs to be incorporated into the Game object and rendered using menu plugins? Game.menus

### Translation

Plugin based object to handle i18n, language definitions are JSON

### Util

Many game based utilities, maybe included in the Game object? Game.util...

### Settings

User settings, again, maybe this needs to be included in the Game object? Game.settings..?


### Info

Civilopedia, needs to be able to collate information from all plugins and core game data


### World

Include map loading, generating and status. This also needs to be an EventEmitter to listen to events and dispatch them on City/Unit objects.

### Terrain

Utilised by World for generating maps, needs to be initialised beforehand and made available contains base stats


### Improvement

Relates to Terrain objects, contains details on what terrain typezs in can be applied to

### City

City object, handles events binds for turn end etc

#### Events

grow

### Unit

Unit object, listens for events, reacts to keyboard controls

### Building

Building object, can apply benefits to cities etc

### Advance

Provides access to new units/buildings/improvements/other advances/governments/etc, each has prerequisites and are used together to generate a tech tree

### Civilization

Provide details of the leader, their traits, any unique abilities, etc

### Government

Details the effects of government types on the player and used to manage tax/science/luxury rates

