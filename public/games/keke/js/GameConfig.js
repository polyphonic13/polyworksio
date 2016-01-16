// Game Config Global
var GameConfig = {

    LOG_LEVEL: 4,   // NONE = 0
                    // ERROR = 1
                    // WARNING = 2
                    // INFO = 3
                    // VERBOSE = 4

    GAME_ID: 'kekeandthegreyexpanse',
    TITLE: 'keke and T H E  G R E Y  E X P A N S E',
    VERSION: '1.0.0',

    ORIENTATION: 'landscape',   // portrait|landscape
                                // Portrait orientation games will use a canvas size of width = 640px and height = 832px
                                // Landscape orientation games will use a canvas size of width = 960px and height = 536px

    CONSTRUCTOR: 'EmptyGame',
    SOURCE: [
	    "js/game/keke2.min.js",
		"http://sdk.tresensa.com/plugins/phaser/tgshelper.min.js"
    ],

    CSS: [
		"css/keke.css"
    ],

    RESOURCES: [
		""
    ],

	TGL: {
		VERSION: '1.0'
	},

    TGS: {
        ENABLED: true,
        VERSION: '0.3'
    },

    TGE: {
        ENABLED: false,
        FONT_LOADER: false,
        VERSION: '1.0'
    },

    GoogleAnalytics: {
        QA_ID:     'UA-50665683-2',      // Provide a Google Analytics Account ID to be used during game development
        PROD_ID:   'UA-50665683-2',      // Provide a Google Analytics Account ID to be used once the game is provided to TreSensa for distribution
        LABEL: 'keke and the grey expanse'
    }
};