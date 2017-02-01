engine.on('start', function() {
    // TODO: controlled by options
    engine.turn = 0;
    engine.year = -4000;
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

engine.on('turn-end', function() {
    engine.turn++;

    engine.year += ranges.filter(function(range) {
        return ('year' in range) ? engine.year < range.year : true;
    })[0].increment;
});

engine.on('turn-start', function() {
    engine.Notifications.add({
        name: 'date',
        year: engine.year
    });
});