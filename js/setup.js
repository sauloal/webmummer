var datafolder = 'data/';
/*
 * Folder where the databases resides
 */
var chartName  = 'chart1';
/*
 * Div where to draw graphs
 */
var scriptHolder = 'scriptholder';



var bdy    = document.getElementsByTagName('body')[0];

var win    = window,
    doc    = document,
    del    = doc.documentElement,
    bdy    = doc.getElementsByTagName('body')[0],
    wid    = win.innerWidth  || del.clientWidth  || bdy.clientWidth,
    hei    = win.innerHeight || del.clientHeight || bdy.clientHeight;





function hasStorage() {
    try {
        var res = 'localStorage' in window && window.localStorage !== null;
        //var res = windowhasOwnProperty('localStorage') && window.localStorage !== null;

        return res;
    } catch(e) {
        //alert('no storage');
        console.log('no storage');
        return false;
    }
}

var hasstorage = hasStorage();

initDb();

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



chartSizes = [
        ['chartfull' , 'Full Page'   ],
        ['chartpart' , 'Half Page'   ],
        ['chartquart', 'Quarter Page']
]


var sizes = {
    'size'                       : {
                        'tag'    : 'select',
                        'value'  : chartSizes[0][0],
                        'options': chartSizes,
                        'alt'    : 'Chart Size'
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










function start() {
    /*
    * Creates page elements
    */


    var sels = document.createElement('span');
    sels.id  = 'selectors';

    var bfc  = bdy.firstChild;
    sels     = bdy.insertBefore( sels, bfc );


    getQueryString();

    //setQueryString();

    genSelectors(sels); // generate selectors based on "opts" variable


    var pos = document.createElement('label');
        pos.id = 'pos'; // creates position label
    sels.appendChild(pos);

    var tip = document.body.appendChild( document.createElement('div') );
        tip.id             = 'tipper';


    graphdb = new SyncSimpleGraph( {

        sync   : function () { var val = getFieldValue( 'sync'    ); return  val === null ? true : val; },
        resizeX: function () { var val = getFieldValue( 'resizeX' ); return  val === null ? true : val; },
        resizeY: function () { var val = getFieldValue( 'resizeY' ); return  val === null ? true : val; }
    });
    //graphdb = new SyncSimpleGraph( true );

    
    document.body.addEventListener( 'd3SyncChanged' , updateQuery, false );


    createOptions();


    var chartDiv       = document.createElement('div');
    chartDiv.className = 'chart';
    chartDiv.id        = chartName;

    document.body.appendChild( chartDiv );


    if ( false ) {
        // automatically select the last option in all fields
        for ( var optName in opts ) {
            var field = document.getElementById( optName );
            if ( field.localName == 'select' ) {
                //console.log( field.lastChild.previousSibling );
                field.lastChild.previousSibling.selected = true;
            } else {
                //console.log('not select');
            }
        }
    }

    document.getElementById('okb').onclick();
};






function encodeStr ( json ) {
    return btoa( RawDeflate.deflate( json ) );
}


function decodeStr ( b64 ) {
    return RawDeflate.inflate( atob( b64 ) );
}


function encodeObj ( obj ) {
    return encodeStr( JSON.stringify( obj ) );
}


function decodeObj ( str ){
    return JSON.parse( decodeStr( str ) );
}


function getQueryString () {
    if ( hasstorage ) {
        if ( _db_domain ) {
            var parsed = parseUri(document.URL);
            var anchor = parsed.anchor;
            var dbnfo  = '|' + _db_domain + '|';


            if ( anchor.indexOf(dbnfo) != 0 ) {
                console.log( 'anchor ' + anchor + ' does not have db domain ' + dbnfo);
                //console.log( anchor.indexOf(dbnfo) );
                return null;
            } else {
                console.log( 'anchor ' + anchor + ' has db domain ' + dbnfo);
                anchor = anchor.substring(dbnfo.length, anchor.length);
                console.log( 'anchor ' + anchor);
            }


            if (anchor !== '') {
                //console.log('has anchor');
                var data64 = null;
                try {
                    data64 = decodeStr( anchor );
                } catch(e) {
                    console.log('invalid 64');
                    console.log(anchor      );
                    return null;
                }

                var data = null;
                try {
                    data   = JSON.parse( data64 );
                } catch(e) {
                    console.log('invalid JSON');
                    console.log(data64        );
                    return null;
                }

                console.log('replacing preferences with ' + data64);
                localStorage[_db_domain] = data64;

                //clearDb();

                //for (var k in data) {
                //    saveOpt(k, data[k]);
                //}
            }
        }
    }
}


function setQueryString () {
    if ( hasstorage ) {
        if ( _db_domain ) {
            var parsed = parseUri(document.URL);
            var anchor = parsed.anchor;

            if ( localStorage[_db_domain].length === 0 ) {
                console.log('nothing to save');
                return null;
            }

            console.log( localStorage[_db_domain] );

            var data64 = encodeStr( localStorage[_db_domain] );

            var dbnfo  = '|' + _db_domain + '|';
            var nurl   = dbnfo + data64;

            if ( anchor != nurl) {
                console.log( 'current url and current config differ');
                //console.log(anchor);
                //console.log(data64);
                //console.log(nurl);
                window.location.hash = nurl;
                //console.log(data64.length);
            } else {
                console.log( 'current url and current config are equal');
                //console.log(anchor.length);
            }
        }
    }
}








function addPicker(el, id, cls, nfo, callback, opts) {
    var addlbls = true;
    var addlbl1 = true;
    var addlbl2 = true;


    if (opts) {
        if ( opts.addlbls !== undefined ) { addlbls = opts.addlbls; }
        if ( opts.addlbl1 !== undefined ) { addlbl1 = opts.addlbl1; }
        if ( opts.addlbl2 !== undefined ) { addlbl2 = opts.addlbl2; }
    }



    if ( addlbls && addlbl1 ) {
        var trD1       = el  .appendChild( document.createElement('td'   ) );
        var lbl1       = document.createElement('label');
        lbl1.htmlFor   = id;
        lbl1.id        = id + '_labelB';
        lbl1.innerHTML = "<b>" + id + "</b>";

        if (nfo.alt) {
            lbl1.innerHTML = "<b>" + nfo.alt + "</b>";
        }

        trD1.appendChild(lbl1);
    }





    var trD2       = el  .appendChild( document.createElement('td'   ) );

    var sel        = trD2.appendChild( document.createElement(nfo.tag) );

    sel.id         = id;
    sel.onchange   = callback;


    for ( var opt in nfo ) {
        if (opt != 'tag') {
            if (nfo.tag == 'select' && (opt == 'value' || opt == 'options')) {
                continue;
            }

            sel[opt] = nfo[opt];
        }
    }


    if (nfo.tag == 'select') {
        genSelectorsOpts(nfo.options, sel, nfo.value);

    } else if ( sel.type == 'checkbox' ) {
        sel.checked = nfo.value;

    }





    if ( addlbls && addlbl1 ) {
        var trD3       = el  .appendChild( document.createElement('td'   ) );

        var lbl2       = document.createElement('label');
        lbl2.htmlFor   = id;
        lbl2.id        = id + '_labelA';
        lbl2.innerHTML = nfo.value;

        var unity      = nfo.unity;
        if (unity) {
            lbl2.innerHTML = nfo.value + unity;
        }

        trD3.appendChild(lbl2);
    }
}


function createCsss(el) {
    var tbl       = el  .appendChild( document.createElement('table') );
    tbl.className = 'setuptable';

    var callback = function(e) {
        var tgt = null
        try {
            tgt = e.srcElement;
        } catch(e) {
            tgt = e.target; //Firefox
        }

        if (!tgt) {
            return null;
        }

        var id    = tgt.id;
        var obj   = tgt.obj;
        var prop  = tgt.prop;
        var unity = tgt.unity;

        var val   = getFieldValue( id );

        console.log('changing obj ' + obj + ' property ' + prop + ' value ' + val);
        saveOpt( id, val );
        changecss(obj, prop, val);

        var lbl = document.getElementById( id + '_label' );
        if (lbl) {
            if (unity) {
                val += unity;
            }

            lbl.innerHTML = val;
        }
    };

    var csssKeys = Object.keys(csss);
    csssKeys.sort();

    for ( var objN = 0; objN < csssKeys.length; objN++ ) {
        var obj       = csssKeys[ objN ];
        var props     = csss[ obj ];
        var propsKeys = Object.keys( props );
        propsKeys.sort();

        for ( var propN = 0; propN < propsKeys.length; propN++ ) {
            var tr       = tbl .appendChild( document.createElement('tr'   ) );
            var prop     = propsKeys[ propN ];
            var nfo      = props[ prop ];
            var id       = obj + prop;
                id       = id.replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '');
            var valueDfl = nfo.value;

            nfo.obj      = obj;
            nfo.prop     = prop;
            nfo.value    = getOpt( id, nfo.value );

            if ( nfo.value !== valueDfl ) {
                var val   = nfo.value;
                var unity = nfo.unity;
                if (unity) {
                    val += unity;
                }
                changecss(obj, prop, val);
            }

            addPicker(tr, id, 'csss', nfo, callback);
        }
    }
};


function createPositions(el) {
    var tbl       = el  .appendChild( document.createElement('table') );
    tbl.className = 'setuptable';

    var callback = function(e) {
        var tgt = null
        try {
            tgt = e.srcElement;
        } catch(e) {
            tgt = e.target; //Firefox
        }

        if (!tgt) {
            return null;
        }

        var id  = tgt.id;

        var val = getFieldValue( id );

        console.log('changing property ' + id + ' value ' + val);

        saveOpt( id, val );

        var lbl = document.getElementById( id + '_label' );
        if (lbl) {
            lbl.innerHTML = val;
        }
    };

    var posK = Object.keys( positions );
    posK.sort();

    for (var idN = 0; idN < posK.length; idN++ ) {
        var tr     = tbl .appendChild( document.createElement('tr'   ) );
        var id     = posK[idN];
        var nfo    = copyKeys( positions[id] );
        nfo.value  = getOpt( id, nfo.value );
        addPicker(tr, id, 'positions', nfo, callback);
    }
};


function copyKeys( obj ) {
    var str = JSON.stringify( obj );
    var res = JSON.parse(     str )
    return res;
}


function createOptions(){
    var divH = bdy.appendChild( document.createElement('div') );
    divH.className   = 'htmlDiv';


    var hlp = document.createElement('label');
        hlp.innerHTML = '<b>Setup</b><br/><b>[+/ScrUp]</b> Zoom In <b>[-/ScrDw]</b> Zoom Out <b>[Arrow keys]</b> Move <b>[0]</b> Reset'; // creates help label

    divH.appendChild( hlp     );
    divH.appendChild( document.createElement('br') );

    createSyncs(divH);
    divH.appendChild( document.createElement('br') );



    var tbl          = divH.appendChild( document.createElement('table') );
    tbl.className    = 'setuptable';

    var th           = tbl .appendChild( document.createElement('tr'   ) );
    var thD11        = th  .appendChild( document.createElement('th'   ) );
    var thD12        = th  .appendChild( document.createElement('th'   ) );
    thD11.innerHTML  = 'Positions';
    thD12.innerHTML  = 'CSS';

    var tr           = tbl .appendChild( document.createElement('tr'   ) );
    var trD21        = tr  .appendChild( document.createElement('td'   ) );
    var trD22        = tr  .appendChild( document.createElement('td'   ) );

    createPositions(trD21);

    createCsss(trD22);

    var clsBtn       = document.createElement('button');
    clsBtn.onclick   = function(e) { if (hasStorage) { alert('cleaning all preferences'); clearDb(); location.reload(); } };
    clsBtn.innerHTML = 'Clear';

    divH.appendChild( clsBtn );
}


function createSyncs(el) {
    var span = el.appendChild( document.createElement('span') );
    span.style.display = "inline-block";


    var tbl       = el  .appendChild( document.createElement('table') );
    tbl.className = 'setuptable';

    var callback = function(e) {
        var tgt = null
        try {
            tgt = e.srcElement;
        } catch(e) {
            tgt = e.target; //Firefox
        }

        if (!tgt) {
            return null;
        }

        var id  = tgt.id;

        var val = getFieldValue( id );

        console.log('changing property ' + id + ' value ' + val);

        saveOpt( id, val );

        var lbl = document.getElementById( id + '_label' );
        if (lbl) {
            lbl.innerHTML = val;
        }
    };



    var posK = Object.keys( syncFields );
    posK.sort();
    var tr    = tbl .appendChild( document.createElement('tr'   ) );

    for (var idN = 0; idN < posK.length; idN++ ) {
        var id    = posK[idN];
        var nfo   = syncFields[id];
        nfo.value = getOpt( id, nfo.value );

        addPicker(tr, id, 'positions', nfo, callback);
    }



    var callback2 = function(e) {
            var tgt = null
            try {
                tgt = e.srcElement;
            } catch(e) {
                tgt = e.target; //Firefox
            }

            if (tgt) {
                var id = tgt.id;
                saveOpt( id, getFieldValue( id ) );
            }
        };

    addPicker( tr, 'size', 'sizes', sizes['size'], callback2);
}


function genSelectorsOpts(obj, refSel, dflt){
    /*
     * Generate drop-down lists options base on "opts"
     */

    for ( var o = 0; o < obj.length; o++ ){
        var opt = obj[ o ];

        var op           = document.createElement('option');
            op.value     = opt[0];
            op.innerHTML = opt[1];

        if (dflt)
        {
            if (dflt == opt[0]) {
                op.selected = true;
            }
        }

        refSel.appendChild( op );
    }
}


function genSelectors(sels){
    /*
     * Generate "select" elements. Calls genOpts to read options
     * If only one option available, adds a label field, otherwise, adds a drop-down menu.
     */

    var callback = function(e) {
            var tgt = null;

            try {
                tgt = e.srcElement;
            } catch(e) {
                tgt = e.target; //Firefox
            }

            if (tgt) {
                var id = tgt.id;
                saveOpt( id, getFieldValue( id ) );
            }
        };


    var tbl = sels.appendChild( document.createElement('table').appendChild( document.createElement('tr') ));

    for ( var optName in opts ) {
        var opt = opts[optName];

        var optVar = opt.options;

        if ( optVar.length == 1 ) {
            var refSel           = document.createElement("label");
                refSel.id        = optName;
                refSel.alt       = opt.alt;
                refSel.value     = optVar[0];
                refSel.innerHTML = optVar[0];

            tbl.appendChild(refSel);


        } else {
            var opt2 = {};

            for ( var k in opt ) {
                opt2[k] = opt[k];
            }

            var optVar2 = [
                ['null', opt.alt]
            ];

            for ( var o = 0; o < optVar.length; o++ ){
                var val = optVar[ o ];
                optVar2.push([ val , val]);
            }

            optVar2.push( [ '*all*', 'All' ] );

            opt2.options = optVar2;
            opt2.value   = getOpt( optName, opt2.value );

            addPicker(tbl, optName, 'selectors', opt2, callback, {addlbls: false} );
        }
    }

    var okb = document.createElement('button');   // add button and it's click action
        okb.id        = 'okb';
        okb.onclick   = selclick;
        okb.innerHTML = 'View';
    tbl.appendChild( document.createElement('td').appendChild( okb ) );



    var clb = document.createElement('button');   // add button and it's click action
        clb.id        = 'clb';
        clb.onclick   = clearPics;
        clb.innerHTML = 'Clear';
    tbl.appendChild( document.createElement('td').appendChild( clb ) );
    
    



    var upd = document.createElement('button');   // add button and it's click action
        upd.id        = 'upd';
        upd.onclick   = setQueryString;
        upd.innerHTML = 'Get URL';
    tbl.appendChild( document.createElement('td').appendChild( upd ) );
}







function loadScript( reg, callback ){
    /*
     * Adds a <script> tag to load the database
     * This is needed to circunvent the security measures which forbids
     * the browser to load any file other than images and javascript.
     *
     * Given the UID of the graph and the database register to be plotted
     * (both to be forwarded to "loadGraph"), creates the script and add
     * loadgraph as callback to its "onload".
     */

    var filepath  = reg.nfo.filepath;
    var scriptId  = reg.nfo.scriptid;

    // Adding the script tag to the head as suggested before
    //var head     = document.getElementsByTagName('head')[0];
    var script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = filepath + '?' + _db_version;
    script.id     = scriptId;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    //script.onreadystatechange = callback;
    script.onload = function() { callback( reg ); };

    document.getElementById( scriptHolder ).appendChild( script );
}


function mergeregs( regs ) {
    var hreg = {
        qry: {},
        res: {},
        nfo: {},
        cfg: {}
    };
    var yTicksLabels = [];


    //console.log(regs);


    for ( var r = 0; r < regs.length; r++ ) {
        var reg = regs[r];
        yTicksLabels[r] = [];
        for ( var cls in reg ) {
            for ( var k in reg[cls] ) {
                if (!hreg[cls][k]) {
                    hreg[cls][k] = [];
                }
                var val = reg[cls][k];
                hreg[cls][k].push( val );
            }
        }
    }


    //console.log(hreg);


    var sreg = simplifyReg( hreg );


    //console.log(sreg);


    for ( var v in sreg.res ) {
        var vals = sreg.res[v];
        var uniqueArray = vals.filter(function(elem, pos) {
            return vals.indexOf(elem) == pos;
        });

        if (uniqueArray.length == 1) {
            if (['tgts', 'points'].indexOf(v) == -1) {
                sreg.res[v] = vals[0];
            }
        }
    }


    for ( var v in sreg.cfg ) {
        var vals = sreg.cfg[v];
        var uniqueArray = vals.filter(function(elem, pos) {
            return vals.indexOf(elem) == pos;
        });

        if (uniqueArray.length == 1) {
            sreg.cfg[v] = vals[0];
        }
    }


    //console.log(sreg);


    for ( var v in sreg.qry ) {
        var vals = sreg.qry[v];
        var uniqueArray = vals.filter(function(elem, pos) {
            return vals.indexOf(elem) == pos;
        });
        //console.log(vals);
        //console.log(uniqueArray);

        if (uniqueArray.length != 1) {
            for ( var h = 0; h < sreg.qry[v].length; h++) {
                var val = sreg.qry[v][h];
                //console.log ( val );
                yTicksLabels[h].push( val );
            }
        }
    }


    //console.log(yTicksLabels);
    //console.log(sreg);


    for ( var r = 0; r < yTicksLabels.length; r++ ) {
        yTicksLabels[r] = joinVals( yTicksLabels[r] );
    }


    //console.log(yTicksLabels);
    //console.log(sreg);
    

    var rKeys = ['xmax', 'ymax', 'xmin', 'ymin'];
    for ( var r = 0; r < rKeys.length; r++ ) {
        var key = rKeys[r];
        var res = [];
        console.log( key );
        for ( var k = 0; k < sreg[ key ].length; k++ ) {
            res.push( sreg[ key ][ k ] );
        }
        sreg[ key ] = Math.max.apply(null, res);
    }


    //console.log(sreg);


    var refs    = joinVals( sreg.qry.refName  );
    var refsCr  = joinVals( sreg.qry.refChrom );
    var tgts    = joinVals( sreg.qry.tgtName  );
    var tgtsCr  = joinVals( sreg.qry.tgtChrom );
    var sts     = joinVals( sreg.qry.status   );
    var ylabel  = joinVals( sreg.ylabel       );
    var xlabel  = joinVals( sreg.xlabel       );


    sreg.title        = refs + ' #' + refsCr + ' vs ' + tgts  + ' #' + tgtsCr + ' - Status ' + sts;
    sreg.ylabel       = ylabel;
    sreg.xlabel       = xlabel;
    sreg.yTicksLabels = yTicksLabels;
    sreg.tipId        = sreg.tipId[0];
    sreg.chartClass   = sreg.chartClass[0];

    sreg.qid          = sreg.qid[0];
    
    var qry           = decodeObj( sreg.qid );
    
    sreg.uid          = Object.keys( qry ).map( function(d) { return qry[d] } ).join('').replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '')


    //console.log(sreg);

    return sreg;
};


function joinVals( vals ) {
    var res = []

    var res = vals.filter(function(elem, pos) {
        return vals.indexOf(elem) == pos;
    });

    if (res.length == 1) {
        return res.join('+');
    } else {
        return '(' + res.join('+') + ')';
    }
};


function simplifyReg( reg ) {
    var res  = [];
    var keys = ['res', 'nfo'];
    for ( var c in keys ) {
        var cls = keys[c];
        for ( var k in reg[cls] ) {
            res[k] = reg[cls][k];
        }
    }
    res.qry = reg.qry;
    res.cfg = reg.cfg;
    res.uid = reg.nfo.uid;
    return res;
}


function loadGraph( regs ) {
    /*
     * Deletes the <script> tag to release the memory in the DOM.
     * Clears chart
     * Create event listener to add tipsy (tip creator)
     * Initialize SimpleGraph
     * Deletes from register
     */

    //reg.qry.refName
    //reg.qry.refChrom
    //reg.qry.tgtName
    //reg.qry.tgtChrom
    //reg.qry.status
    //
    //reg.res.filename
    //reg.res.title
    //reg.res.xlabel
    //reg.res.ylabel
    //reg.res.points
    //reg.res.xmin
    //reg.res.xmax
    //reg.res.ymin
    //reg.res.ymax
    //reg.res.tgts
    //
    //reg.nfo.uid
    //reg.nfo.chartClass
    //reg.nfo.tipId
    //reg.nfo.filepath
    //reg.nfo.scriptid
    //
    //reg.cfg

    var horizontal = getFieldValue( 'horizontal' );

    if (horizontal) {
        var hreg      = mergeregs( regs );
        hreg.parallel = true;
        //console.log( hreg );
        graphdb.add(chartName, hreg);

    } else {
        regs.map( function(reg) {
            var sreg = simplifyReg( reg );
            graphdb.add(chartName, sreg);
        });
    }
    
    setQueryString();
    
    //console.log( getDb() );
};






syncLoadScript = function( regs, callback ) {
    var self          = this;
    this.regs         = regs;
    this.callback     = callback;
    this.size         = 0;
    this.received     = 0;
    this.sentData     = [];
    this.receivedData = [];

    this.regs.map( function(reg) {
        var file  = reg.res.filename;
        if (file) {
            self.size += 1;
        }
    });


    if (this.size === 0) {
        console.log('nothing to plot');
        console.log(regs);
        return;
    }

    var count = 0;
    var func  = function(sregv) { loadScript( sregv, self.receive() ); };

    regs.map( function(reg) {
        var file   = reg.res.filename;
        self.sentData.push( file );
        if (file) {
            console.log( 'sending ' + file );
            //setTimeout( func(reg), (count * 1000));
            func(reg);
            count += 1;
        }
    });
};


syncLoadScript.prototype.receive = function( ) {
    var self = this;

    return function( reg ) {
        self.received += 1;

        var dataPos = self.sentData.indexOf( reg.res.filename );

        console.log( 'received #' + self.received + '/' + self.size + ' ' + reg.res.filename + ' pos ' + dataPos );

        var res = _filelist[ reg.qry.refName ][ reg.qry.refChrom ][ reg.qry.tgtName ][ reg.qry.tgtChrom ][ reg.qry.status ];

        reg.res = JSON.parse(JSON.stringify(res));

        self.receivedData[ dataPos ] = reg;

        delete res.points;
        delete res.tgts;

        var script = document.getElementById( reg.nfo.scriptid );

        if ( script ) {
            document.getElementById( scriptHolder ).removeChild( script );
        }

        if ( self.received == self.size ) {
            //console.log( self.receivedData );
            self.callback( self.receivedData );
        }
    };
};







function selclick(){
    var vals = getVals();

    if (!vals) {
        console.log('no vals');
        return;
    }

    //console.log( vals );

    var regs  = getRegister( vals );
    if ( !regs ) {
        return;
    }
    if ( regs.length === 0 ) {
        console.log('no reg');
        return;
    }

    new syncLoadScript( regs, loadGraph );
}


function clearPics(){
    console.log('cleaning');
    //console.log(graphdb);
    graphdb.clear();
}


function getFieldValue(fieldId) {
    var field = document.getElementById( fieldId );

    //console.log('getting ' + fieldId);
    if (field) {
        var val   = null;

        if ( field.localName == 'select' ) {
            //console.log('getting ' + fieldId + ' select');
            var sel = field.selectedIndex;
            //console.log('getting ' + fieldId + ' select index ' + sel);
            if ( sel == -1 ) {
                sel = null;
            } else {
                var fio = field.options[ sel ];
                val     = fio.value;
            }
        } else {
            //console.log('getting ' + fieldId + ' !select');
            if ( field.type == 'checkbox' ) {
                //console.log('getting ' + fieldId + ' !select CHECKBOX');
                val = field.checked;
            } else {
                //console.log('getting ' + fieldId + ' !select !CHECKBOX');
                val = field.value;
            }
        }

        if (val == 'null') {
            val = null;
        }

        //console.log('getting ' + fieldId + ' VAL ' + val);
        return val;
    } else {
        //console.log('getting ' + fieldId + ' NO SUCH FIELD');
        return null;
    }
};


function getVals() {
    var vals = {};

    for ( var optName in opts ) {
        var val      = getFieldValue( optName );

        if ( val === null ) {
            console.log( 'value ' + optName + ' not defined' );
            return null;
        }

        //console.log( 'appending ' + optName + ' = '+ val );
        vals[ optName ] = val;
    }

    return vals;
}


function getRegister( gvals ){
    var dvals     = {};
    var evals     = [];


    for ( var key in opts ) {
        var val    = gvals[key];
        dvals[key] = [];
        
        if ( val == '*all*' ) {
            opts[key].options.map( function(oval) {
                dvals[key].push( oval );
            });
        } else {
            dvals[key].push( val );
        }
    }


    //console.log( dvals );


    var horizontal = getFieldValue( 'horizontal' );


    if (horizontal) {
        if ( dvals.refName.length != 1 ) {
            alert( 'more than one reference while using horizontal graph '  + dvals.refName.length  + ' ' + dvals.refName );
            return null;
        }

        if ( dvals.refChrom.length != 1 ) {
            alert( 'more than one chromosome while using horizontal graph ' + dvals.refChrom.length + ' ' + dvals.refChrom);
            return null;
        }
    }

    var qid = encodeObj(gvals);

    dvals.refName.map( function(refName) {
        dvals.refChrom.map( function(refChrom) {
            dvals.tgtName.map( function(tgtName) {
                dvals.tgtChrom.map( function(tgtChrom) {
                    dvals.status.map( function(status) {
                        //console.log(ref + ' ' + refChrom + ' ' + tgtName + ' ' + status);
                        var reg = {
                            refName  : refName,
                            refChrom : refChrom,
                            tgtName  : tgtName,
                            tgtChrom : tgtChrom,
                            status   : status
                        };
                        evals.push( reg );
                    });
                });
            });
        });
    });

    evals.qid = qid;

    return parseRegisters( evals );
}


function parseRegisters(evals) {
    var regs       = [];

    for ( var e = 0; e < evals.length; e++ ) {
        var vals = evals[e];
        var reg  = {
                qry: vals,
                res: {},
                nfo: {},
                cfg: {}
            };

        var regD = null;
        try {
            regD = _filelist[ vals.refName ][ vals.refChrom ][ vals.tgtName ][ vals.tgtChrom ][ vals.status ];
        }
        catch(err) {
            console.error('combination does not exists for:');
            console.error( vals );
            continue;
        }

        for ( var k in regD ) {
            reg.res[k] = regD[k];
        }

        var uid = Object.keys( vals ).map( function(d) { return vals[d] } ).join('').replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '');

        reg.nfo.uid        = uid;
        reg.nfo.qid        = evals.qid;
        reg.nfo.chartClass = getFieldValue( 'size' );
        reg.nfo.tipId      = 'tipper';
        reg.nfo.filepath   = datafolder + reg.res.filename;
        reg.nfo.scriptid   = 'script_'  + reg.nfo.uid;

        if ( reg.nfo.chartClass === null ) { reg.nfo.chartClass = Object.keys( sizes )[0]; };


        var posK = Object.keys( positions );
            posK.sort();

        for (var idN = 0; idN < posK.length; idN++ ) {
            var id    = posK[idN];
            var nfo   = positions[id];
            var dfl   = nfo.value;
            var curr  = getFieldValue( id );


            if ( dfl != curr ) {
                console.log('option ' + id + ' default ' + dfl + ' current ' + curr + ' changing');
                console.log( nfo );
                reg.cfg[id] = curr;
            } else {
                if (reg.cfg[id]) {
                    delete reg.cfg[id];
                }
            }
        }
        regs.push( reg );
    }


    if (regs.length === 0) {
        return null;
    }

    return regs;
}


function obj2str(obj) {
    var res = "";
    for (var k in obj ) {
        res += '<b>' + k + "</b>: " + obj[k] + ", ";
    }
    return res;
}


function saveOpt (k ,v) {
    if ( hasstorage ) {
        if ( _db_domain ) {
            if ( localStorage[_db_domain] ) {
                if ( v === null ) {
                    delete localStorage[_db_domain][k];
                } else {
                    //console.log('saving k "' + k + '" v "' + v + '"');
                    var jso = localStorage[_db_domain];
                    //console.log( jso );
                    var val = JSON.parse( jso );
                    //console.log( val );
                    val[k] = v;
                    
                    jso = JSON.stringify( val );
                    //console.log( jso );
                    localStorage[_db_domain] = jso;
                    
                    setQueryString();
                }
            }
        }
    }
};


function updateQuery (e) {
    console.log( 'getting queries ');

    console.log( e );
    var qries = e.detail.el;
    console.log( qries );
    
    saveOpt('_queries', qries);
}


function getOpt(k, d) {
    var val = d;

    if ( hasstorage ) {
        if ( _db_domain ) {
            if ( localStorage[_db_domain] ) {
                try {
                    //console.log('getting ' + k);
                    var jso = localStorage[_db_domain];
                    //console.log( jso );
                    var res = JSON.parse( jso );
                    //console.log( res );
                    val = res[k];
                    //console.log( val );
                } catch(e) {
                }
            }
        }
    }

    if (val === undefined) {
        val = d;
    }

    //console.log( 'returning ' + val );
    return val;
};


function clearDb () {
    if (_db_domain) {
        localStorage[_db_domain] = JSON.stringify( new Object() );
    }
};


function initDb () {
    if (_db_domain) {
        if ( !localStorage[_db_domain] ) {
            localStorage[_db_domain] = JSON.stringify( new Object() );
        }
    }
};


function getDb () {
    var res = null;
    
    if ( hasstorage ) {
        if ( _db_domain ) {
            if ( localStorage[_db_domain] ) {
                try {
                    //console.log('getting ' + k);
                    var jso = localStorage[_db_domain];
                    //console.log( jso );
                    res = JSON.parse( jso );
                } catch(e) {
                }
            }
        }
    }
    
    return res;
};


function getCurrQueries () {
    return graphdb.getQueries();
}

//function basename(path) {
//    return path.replace(/\\/g,'/').replace( /.*\//, '' );
//}



//registerKeyboardHandler = function(callback) {
//  var callback = callback;
//  d3.select(window).on("keydown", callback);
//};


//http://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
document.addEventListener('DOMContentLoaded', start );



/*
  options                || {};
  options.scaffs         || null;
  options.labelId        || null;
  options.uid            || 'uid'

  options.xlabel         || 'x';
  options.ylabel         || 'y';
  options.title          || 'no title';

  options.xmax           || 30;
  options.xmin           ||  0;
  options.ymax           || 10;
  options.ymin           ||  0;
                            //              from scaffs
                            //                   f/r
                            //  x1 y1 x2 y2 scaf 0/1 q
  options.points         ||  [ [0 ,0, 0, 0, 0,   0,  0.0] ];
  options.xTicks         || 10;
  options.yTicks         || 10;
  options.paddingTop     || 20;
  options.paddingRight   || 30;
  options.paddingBottom  || 10;
  options.paddingLeft    || 45;
  options.titleDy             || -0.8;
  options.xNumbersDy          || 1;
  options.yNumbersDy          || 0.35;
  options.xlabelDx            || 0;
  options.xlabelDy            || +2.3;
  options.ylabelX             || 0;
  options.ylabelY             || 0;
  options.ylabelDx            || 0;
  options.ylabelDy            || -2.3;
  options.downloadIconMaxSize ||  10;
  options.closeIconMaxSize    ||  30;
  options.padlockIconMaxSize  ||  30;
  options.compassMaxSize      || 300;
  options.compassMinSize      || 100;

*/




//function addTipsy( e ) {
//    $(e.detail.el).tipsy({
//            gravity: 'w',
//            html   : true,
//            title  : function() {
//                var j   = this.getAttribute('j');
//                var tip = e.detail.self.genTip( j );
//                //console.log("tip "+tip);
//                return tip;
//            }
//        });
//
//    //$('svg circle').tipsy({
//    //    gravity: 'w',
//    //    html   : true,
//    //    title  : function() {
//    //        var j   = this.getAttribute('j');
//    //        var res = genTip(self.points[j]);
//    //        return res;
//    //    }
//    //});
//}
