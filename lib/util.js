'use strict';

const Game = require('./game');
const fs = require('fs');
const mustache = require('mustache');

const viewPath = Game.basePath + 'views/';

module.exports = (function() {
    return {
        loadJSON: function(file) {
            try {
                fs.accessSync(Game.basePath + file);
                return JSON.parse(fs.readFileSync(Game.basePath + file, 'utf8'));
            }
            catch (e) {
                console.error(`Error loading '${file}': ${e}`);
            }
        },
        saveJSON: function(file, data) {
            return fs.writeFileSync(file, JSON.stringify(data), 'utf8');
        },
        template: function(template, callback) {
            try {
                fs.accessSync(viewPath + template);
                return fs.readFileSync(viewPath + template, 'utf8');
            }
            catch (e) {
                console.error(`Error loading '${viewPath + template}': ${e}`);
            }
        },
        createWindow: function(options) {
            options = options || {};
            // defaults if needed
            options.center = 'center' in options ? options.center : true;
            options.resizable = 'resizable' in options ? options.resizable : false;
            // electron.BrowserWindow defaults:
            // width: 800,
            // height: 600,
            // x: '',
            // y: '',
            // useContentSize: false,
            // center: true,
            // minWidth: 0,
            // minHeight: 0,
            // maxWidth: 'none',
            // maxHeight: 'none',
            // resizable: true,
            // movable: true,
            // minimizable: true,
            // maximizable: true,
            // closable: true,
            // alwaysOnTop: false,
            // fullscreen: false, // Whether the window should show in fullscreen. When explicity set to false the fullscreen button will be hidden or disabled on OS X, or the maximize button will be disabled on Windows
            // fullscreenable: true, // Whether the maximize/zoom button on OS X should toggle full screen mode or maximize window.
            // skipTaskbar: false,
            // kiosk: false,
            // title: 'Electron',
            // icon: new NativeImage({/* ... */}), // http://electron.atom.io/docs/v0.36.7/api/native-image/
            // show: true,
            // frame: true, // Specify false to create a Frameless Window <http://electron.atom.io/docs/v0.36.7/api/frameless-window>.
            // acceptFirstMouse: false, // Whether the web view accepts a single mouse-down event that simultaneously activates the window.
            // disableAutoHideCursor: false, // Whether to hide cursor when typing.
            // autoHideMenuBar: false, // Auto hide the menu bar unless the Alt key is pressed.
            // enableLargerThanScreen: false,
            // backgroundColor: ?, // Window’s background color as Hexadecimal value, like #66CD00 or #FFF or #80FFFFFF (alpha is supported). Default is #000 (black) for Linux and Windows, #FFF for Mac (or clear if transparent).
            // hasShadow: true, // OSX only
            // darkTheme: false, // Forces using dark theme for the window, only works on some GTK+3 desktop environments.
            // transparent: false,
            // type: ?,
                // On Linux, possible types are desktop, dock, toolbar, splash, notification.
                // On OS X, possible types are desktop, textured.
                // The textured type adds metal gradient appearance (NSTexturedBackgroundWindowMask).
                // The desktop type places the window at the desktop background window level (kCGDesktopWindowLevel - 1). Note that desktop window will not receive focus, keyboard or mouse events, but you can use globalShortcut to receive input sparingly.
            // titleBarStyle: ?,
                // The titleBarStyle option is only supported on OS X 10.10 Yosemite and newer. Possible values are:
                // default or not specified, results in the standard gray opaque Mac title bar.
                // hidden results in a hidden title bar and a full size content window, yet the title bar still has the standard window controls (“traffic lights”) in the top left.
                // hidden-inset results in a hidden title bar with an alternative look where the traffic light buttons are slightly more inset from the window edge.
            // webPreferences: ?
                // The webPreferences option is an object that can have following properties:

                // nodeIntegration Boolean - Whether node integration is enabled. Default is true.
                // preload String - Specifies a script that will be loaded before other scripts run in the page. This script will always have access to node APIs no matter whether node integration is turned on or off. The value should be the absolute file path to the script. When node integration is turned off, the preload script can reintroduce Node global symbols back to the global scope. See example here.
                // session Session - Sets the session used by the page. Instead of passing the Session object directly, you can also choose to use the partition option instead, which accepts a partition string. When both session and partition are provided, session would be preferred. Default is the default session.
                // partition String - Sets the session used by the page according to the session’s partition string. If partition starts with persist:, the page will use a persistent session available to all pages in the app with the same partition. if there is no persist: prefix, the page will use an in-memory session. By assigning the same partition, multiple pages can share the same session. Default is the default session.
                // zoomFactor Number - The default zoom factor of the page, 3.0 represents 300%. Default is 1.0.
                // javascript Boolean - Enables JavaScript support. Default is true.
                // webSecurity Boolean - When setting false, it will disable the same-origin policy (Usually using testing websites by people), and set allowDisplayingInsecureContent and allowRunningInsecureContent to true if these two options are not set by user. Default is true.
                // allowDisplayingInsecureContent Boolean - Allow an https page to display content like images from http URLs. Default is false.
                // allowRunningInsecureContent Boolean - Allow a https page to run JavaScript, CSS or plugins from http URLs. Default is false.
                // images Boolean - Enables image support. Default is true.
                // textAreasAreResizable Boolean - Make TextArea elements resizable. Default is true.
                // webgl Boolean - Enables WebGL support. Default is true.
                // webaudio Boolean - Enables WebAudio support. Default is true.
                // plugins Boolean - Whether plugins should be enabled. Default is false.
                // experimentalFeatures Boolean - Enables Chromium’s experimental features. Default is false.
                // experimentalCanvasFeatures Boolean - Enables Chromium’s experimental canvas features. Default is false.
                // directWrite Boolean - Enables DirectWrite font rendering system on Windows. Default is true.
                // blinkFeatures String - A list of feature strings separated by ,, like CSSVariables,KeyboardEventKey. The full list of supported feature strings can be found in the setFeatureEnabledFromString function.
                // defaultFontFamily Object - Sets the default font for the font-family.
                // standard String - Defaults to Times New Roman.
                // serif String - Defaults to Times New Roman.
                // sansSerif String - Defaults to Arial.
                // monospace String - Defaults to Courier New.
                // defaultFontSize Integer - Defaults to 16.
                // defaultMonospaceFontSize Integer - Defaults to 13.
                // minimumFontSize Integer - Defaults to 0.
                // defaultEncoding String - Defaults to ISO-8859-1.

            // Create the browser window.
            var win = new Game.window(options);

            // and load the index.html of the app.
            win.loadURL('path' in options ? `file://${viewPath + options.path}` : 'about:blank');

            win.webContents.openDevTools();

            return win;
        }
    }
})();
