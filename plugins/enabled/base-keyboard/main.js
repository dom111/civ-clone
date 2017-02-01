// this is probably better a main module, or set of methods in game.js
// it's probably better to use something existing, but it'll do for now
var keys = [];

var _processKey = function(key) {
    var allKeys = key.split(/\+/),
    lookup = {
        'up': 38,
        'down': 40,
        'left': 37,
        'right': 39,
        'pageup': 33,
        'pagedown': 34,
        'home': 36,
        'end': 35,
        'enter': 13
    },
    object = {};

    allKeys.forEach(function(key) {
        if (key.match(/ctrl|control/i)) {
            object.ctrlKey = true;
        }
        else if (key.match(/shift/i)) {
            object.shiftKey = true;
        }
        else if (key.match(/alt/i)) {
            object.altKey = true;
        }
        else if (key.match(/cmd|command|win/i)) {
            object.metaKey = true;
        }
        else if (key.match(/[A-Z]/)) {
            object.shiftKey = true;
            object.keyCode = key.charCodeAt(0);
        }
        else if (key in lookup) {
            object.keyCode = lookup[key];
        }
        else {
            object.keyCode = key.toUpperCase().charCodeAt(0)
        }
    });

    return object;
};

var _compare = function(key, event) {
    var match = true;

    Object.keys(key.keyData).forEach(function(prop) {
        if (key.keyData[prop] !== event[prop]) {
            match = false;
        }
    });

    return match;
};

game.on('bind-key', function(namespace, key, method) {
    keys.push({
        namespace: namespace,
        keyData: _processKey(key),
        method: method
    });
});

game.on('unbind-key', function(namespace, key) {
    var keysCopy = keys.slice(0);
    keys = [];
    keysCopy.forEach(function(currentKey) {
        if (namespace !== currentKey.namespace) {
            keys.push(currentKey)
        }
        else {
            if (!key || !_compare(currentKey.keyData, _processKey(key))) {
                keys.push(currentKey)
            }
        }
    });
});

game.on('start', function(unit) {
    [
        ['up', 'n'],
        ['pageup', 'ne'],
        ['right', 'e'],
        ['pagedown', 'se'],
        ['down', 's'],
        ['end', 'sw'],
        ['left', 'w'],
        ['home', 'nw'],
        ['8', 'n'],
        ['9', 'ne'],
        ['6', 'e'],
        ['3', 'se'],
        ['2', 's'],
        ['1', 'sw'],
        ['4', 'w'],
        ['7', 'nw']
    ].forEach(function(bind) {
        game.emit('bind-key', 'unit', bind[0], function() {
            // TODO
            var unit = game.currentPlayer.activeUnit;

            if (unit) {
                unit.move(bind[1]);
            }
        });
    });

    Object.keys(Unit.availableActions).forEach(function(actionName) {
        var action = Unit.availableActions[actionName];

        game.emit('bind-key', 'unit', action.key, function() {
            // TODO
            var unit = game.currentPlayer.activeUnit;

            if (unit) {
                unit.action(action.name);
            }
        });
    });

    game.emit('bind-key', 'game', 'enter', function() {
        if (game.isTurnEnd) {
            game.emit('turn-end');
        }
        else {
            console.log(game.currentPlayer.actionsLeft + ' action(s) left to perform.');
        }
    });
});

addEventListener('keydown', function(event) {
    keys.forEach(function(key) {
        if (_compare(key, event)) {
            key.method();
        }
    });
});
