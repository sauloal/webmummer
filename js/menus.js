/*
 * Available fields to be queried in the database
 * Used to create drop-down boxes
 */
var opts   = {
    'refName' : {
        'tag'    : 'select',
        'options': _refsNames,
        'alt'    : 'Select Reference'
    },
    'refChrom': {
        'tag'    : 'select',
        'options': _refsChroms,
        'alt'    : 'Select Reference Chromosome'
    },
    'tgtName' : {
        'tag'    : 'select',
        'options': _tgtsNames ,
        'alt'    : 'Select Target'
    },
    'tgtChrom': {
        'tag'    : 'select',
        'options': _tgtsChroms,
        'alt'    : 'Select Target Chromosome'
    },
    'status'  : {
        'tag'    : 'select',
        'options': _statuses  ,
        'alt'    : 'Select Status'
    }
};


var chartSizes = [
        ['chartfull' , 'Full Page'   ],
        ['chartpart' , 'Half Page'   ],
        ['chartquart', 'Quarter Page']
]


var positions = {
    'xTicks'                     : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  10,
                        'alt'    : 'Number of X ticks'
    },
    'yTicks'                     : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  10,
                        'alt'    : 'Number of Y ticks'
    },
    'paddingTop'                 : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  40,
                        'alt'    : 'Padding top'
    },
    'paddingRight'               : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  30,
                        'alt'    : 'Padding right'
    },
    'paddingBottom'              : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  60,
                        'alt'    : 'Padding bottom'
    },
    'paddingLeft'                : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  70,
                        'alt'    : 'Padding left'
    },
    'titleDy'                    : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : 0.70,
                        'alt'    : 'Title vertical offset'
    },
    'xNumbersDy'                 : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : 1,
                        'alt'    : 'X axis numbers vertical offset'
    },
    'yNumbersDy'                 : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : 0.20,
                        'alt'    : 'Y axis numbers vertical offset'
    },
    'xlabelDx'                   : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : 0,
                        'alt'    : 'X axis label horizontal offset'
    },
    'xlabelDy'                   : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : 2.3,
                        'alt'    : 'X axis label vertical offset'
    },
    'ylabelX'                    : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : 0,
                        'alt'    : 'Y axis label horizontal position'
    },
    'ylabelY'                    : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : 0,
                        'alt'    : 'Y axis label vertical position'
    },
    'ylabelDx'                   : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : 0,
                        'alt'    : 'Y axis label horizontal offset'
    },
    'ylabelDy'                   : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : -10,
                        'max'    :  10,
                        'step'   : 0.10,
                        'value'  : -2.3,
                        'alt'    : 'Y axis label vertical position'
    },
    'downloadIconMaxSize'        : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  20,
                        'alt'    : 'Download icon max size'
    },
    'closeIconMaxSize'           : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  20,
                        'alt'    : 'Close icon max size'
    },
    'padlockIconMaxSize'         : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  20,
                        'alt'    : 'Padlock icon max size'
    },
    'compassMaxSize'             : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  75,
                        'alt'    : 'Compass max size'
    },
    'compassMinSize'             : {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    :   0,
                        'max'    : 100,
                        'step'   :   1,
                        'value'  :  20,
                        'alt'    : 'Compass min size'
    }
};


var syncFields = {
    'chartClass': {
                        'tag'    : 'select',
                        //'value'  : chartSizes[0][0],
                        'options': chartSizes,
                        'alt'    : 'Chart Size'
    },
    'sync': {
                'tag'    : 'input',
                'type'   : 'checkbox',
                'value'  :  true,
                'alt'    : 'Synchronize Movement'
    },
    'resizeX': {
                'tag'    : 'input',
                'type'   : 'checkbox',
                'value'  :  true,
                'alt'    : 'Resize X'
    },
    'resizeY': {
                'tag'    : 'input',
                'type'   : 'checkbox',
                'value'  :  false,
                'alt'    : 'Resize Y'
    },
    'horizontal': {
                'tag'    : 'input',
                'type'   : 'checkbox',
                'value'  :  false,
                'alt'    : 'Horizontal visualization'
    },
    'crosshair': {
                'tag'    : 'input',
                'type'   : 'checkbox',
                'value'  :  false,
                'alt'    : 'Show crosshair'
    }
};






var csss = {
    '.chart' :  {
                    'background-color': {
                        'tag'    : 'input',
                        'type'   : 'color',
                        'value'  : '#FFFFFF',
                        'alt'    : 'Chart\'s background color'
                    }
                },

    '.grid': {
                'font-size': {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : 0,
                        'max'    : 100,
                        'step'   : 0.5,
                        'value'  : 1,
                        'unity'  : 'em',
                        'alt'    : 'Axis numbers font size'
                    }
    },

    'body': {
                'font-family': {
                        'tag'    : 'input',
                        'type'   : 'text',
                        'value'  : 'sans-serif',
                        'alt'    : 'Global font family'
                },

                'font-size': {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : 0,
                        'max'    : 100,
                        'step'   : 0.5,
                        'value'  : 13,
                        'unity'  : 'px',
                        'alt'    : 'Global font size'
                }
    },

    '.graph-background': {
                'fill': {
                        'tag'    : 'input',
                        'type'   : 'color',
                        'value'  : '#EEEEEE',
                        'alt'    : 'Graphic background color'
                }
    },

    '.grid-line': {
                'stroke': {
                        'tag'    : 'input',
                        'type'   : 'color',
                        'value'  : '#CCCCCC',
                        'alt'    : 'Grid line color'
                }
    },

    '.points': {
                'stroke-width': {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : 0,
                        'max'    : 100,
                        'step'   : 0.5,
                        'value'  : 5,
                        'unity'  : 'px',
                        'alt'    : 'Data line width'
                }
    },

    '.points-f': {
        //'fill': {
                        //'tag'    : 'input',
        //                'type'   : 'color',
        //                'value'  : '#0000FF',
        //                'alt'    : 'Forward line color'
        //        },
        'stroke': {
                        'tag'    : 'input',
                        'type'   : 'color',
                        'value'  : '#0000FF',
                        'alt'    : 'Forward line color'
                }
    },

    '.points-r': {
        //'fill': {
                        //'tag'    : 'input',
        //                'type'   : 'color',
        //                'value'  : '#FF3300',
        //                'alt'    : ''
        //        },
        'stroke': {
                        'tag'    : 'input',
                        'type'   : 'color',
                        'value'  : '#FF3300',
                        'alt'    : 'Reverse line color'
                }
    },

    '.scaf-square': {
        //'fill': {
                        //'tag'    : 'input',
        //                'type'   : 'color',
        //                'value'  : '#33cc33',
        //                'alt'    : 'Scaffold highligh box color'
        //        },
        'stroke': {
                        'tag'    : 'input',
                        'type'   : 'color',
                        'value'  : '#33cc33',
                        'alt'    : 'Scaffold highligh line color'
                },
        'opacity': {
                        'tag'    : 'input',
                        'type'   : 'range',
                        'min'    : 0,
                        'max'    : 1,
                        'step'   : 0.01,
                        'value'  : 0.4,
                        'alt'    : 'Scaffold highligh box opacity'
                }
    },

    '#tipper': {
        'fill': {
                        'tag'    : 'input',
                        'type'   : 'color',
                        'value'  : '#0000FF',
                        'alt'    : 'Tooltip background color'
                },
        'color': {
                        'tag'    : 'input',
                        'type'   : 'color',
                        'value'  : '#FFFFFF',
                        'alt'    : 'Tooltip text color'
                }
    }
};
