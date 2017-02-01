game.on('start', function() {
    // TODO: controlled by options
    game.turn = 0;
    game.year = -4000;
});

var ranges = [
    {
        year: 1000,
        increment: 20
    },
    {
        year: 1500,
        increment: 10
    },
    {
        year: 1750,
        increment: 5
    },
    {
        year: 1850,
        increment: 2
    },
    {
        increment: 1
    }
];

game.on('turn-end', function() {
    game.turn++;

    game.year += ranges.filter(function(range) {
        return ('year' in range) ? game.year < range.year : true;
    })[0].increment;
});

game.on('turn-start', function() {
    Notifications.add({
        name: 'date',
        year: game.year
    });
});