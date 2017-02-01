Game.on('player-added', (player) => {
    player.treasury = (this.options.difficulty == 0 ? 50 : 0)
});

// City.prototype
City.prototype.__defineGetter__('gold', () => {
    return Math.ceil(Game.taxRate * this.trade);
});

Game.on('city-created', (city) => {
    city.on('turn-end', (e) => {
        city.player.treasury += city.gold;
        console.log('turn end @ city');
    });
});
