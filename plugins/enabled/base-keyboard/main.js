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
        // windows?
        // 'numpad0': 96,
        // 'numpad1': 97,
        // 'numpad2': 98,
        // 'numpad3': 99,
        // 'numpad4': 100,
        // 'numpad5': 101,
        // 'numpad6': 102,
        // 'numpad7': 103,
        // 'numpad8': 104,
        // 'numpad9': 105
        // mac.
        'numpad0': 48,
        'numpad1': 49,
        'numpad2': 50,
        'numpad3': 51,
        'numpad4': 52,
        'numpad5': 53,
        'numpad6': 54,
        'numpad7': 55,
        'numpad8': 56,
        'numpad9': 57
    },
    object = {};

    allKeys.forEach(function(key) {
        if (key.match(/ctrl|control/i)) {
            key = key.replace(/(ctrl|control)\+|\+(ctrl|control)/, '');
            object.ctrlKey = true;
        }
        if (key.match(/shift/i)) {
            key = key.replace(/shift\+|\+shift/, '');
            object.shiftKey = true;
        }
        if (key.match(/alt/i)) {
            key = key.replace(/shift\+|\+shift/, '');
            object.altKey = true;
        }
        if (key.match(/cmd|command|win/i)) {
            key = key.replace(/(cmd|command|win)\+|\+(cmd|command|win)/, '');
            object.metaKey = true;
        }

        if (key.match(/[A-Z]/)) {
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
    Engine.Plugin.get('keybinds', 'unit').forEach(function(component) {
        component.contents.forEach(function(assetPath) {
            engine.loadJSON(assetPath).forEach(function(keybind) {
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

    // TODO: include in each unit's definition file
    // Object.keys(engine.Unit.availableActions).forEach(function(actionName) {
    //     var action = engine.Unit.availableActions[actionName];

    //     engine.emit('bind-key', 'unit', action.key, function() {
    //         // TODO
    //         var unit = engine.currentPlayer.activeUnit;

    //         if (unit) {
    //             unit.action(action.name);
    //         }
    //     });
    // });

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
