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
        'enter': 13,
        'numpad0': 96,
        'numpad1': 97,
        'numpad2': 98,
        'numpad3': 99,
        'numpad4': 100,
        'numpad5': 101,
        'numpad6': 102,
        'numpad7': 103,
        'numpad8': 104,
        'numpad9': 105
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
        else if (key.match(/[A-Z]/i)) {
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

engine.on('bind-key', function(namespace, key, method) {
    keys.push({
        namespace: namespace,
        keyData: _processKey(key),
        method: method
    });
});

engine.on('unbind-key', function(namespace, key) {
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

engine.on('start', function(unit) {
    engine.Plugin.get('keybinds', 'unit').forEach(function(component) {
        component.contents.forEach(function(assetPath) {
            engine.loadJSON(assetPath).forEach(function(keyBind) {
                keybind.keys.forEach(function(key) {
                    engine.emit('bind-key', 'unit', key, function() {
                        var unit = engine.currentPlayer.activeUnit,
                        call = true;

                        if (unit) {
                            if (keybind.include) {
                                call = keybind.include.includes(unit.name);
                            }
                            else if (keybind.exclude) {
                                call = !keybind.exclude.includes(unit.name);
                            }
                            // TODO: more advanced filtering, perhaps move to unit logic?

                            if (call) {
                                unit[keybind.action].apply(unit, keybind.args);
                            }
                        }
                    });
                });
            });
        });
    });
    // [
    //     ['up', 'n'],
    //     ['pageup', 'ne'],
    //     ['right', 'e'],
    //     ['pagedown', 'se'],
    //     ['down', 's'],
    //     ['end', 'sw'],
    //     ['left', 'w'],
    //     ['home', 'nw'],
    //     ['8', 'n'],
    //     ['9', 'ne'],
    //     ['6', 'e'],
    //     ['3', 'se'],
    //     ['2', 's'],
    //     ['1', 'sw'],
    //     ['4', 'w'],
    //     ['7', 'nw']
    // ].forEach(function(bind) {
    //     engine.emit('bind-key', 'unit', bind[0], function() {
    //         // TODO
    //         var unit = engine.currentPlayer.activeUnit;

    //         if (unit) {
    //             unit.move(bind[1]);
    //         }
    //     });
    // });

    // TODO: include in each unit's definition file
    Object.keys(Unit.availableActions).forEach(function(actionName) {
        var action = Unit.availableActions[actionName];

        engine.emit('bind-key', 'unit', action.key, function() {
            // TODO
            var unit = engine.currentPlayer.activeUnit;

            if (unit) {
                unit.action(action.name);
            }
        });
    });

    // TODO: move game-wide shortcuts to config file
    engine.emit('bind-key', 'game', 'enter', function() {
        if (engine.isTurnEnd) {
            engine.emit('turn-end');
        }
        else {
            console.log(engine.currentPlayer.actionsLeft + ' action(s) left to perform.');
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
