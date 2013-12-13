/*
 * Available fields to be queried in the database
 * Used to create drop-down boxes
 */
var opts   = {
    'refName' : {
        'tag'     : 'select',
        'options' : _refsNames,
        'alt'     : 'Select Reference',
        'multiple': true
    },
    'refChrom': {
        'tag'     : 'select',
        'options' : _refsChroms,
        'alt'     : 'Select Reference Chromosome',
        'multiple': true
    },
    'tgtName' : {
        'tag'     : 'select',
        'options' : _tgtsNames ,
        'alt'     : 'Select Target',
        'multiple': true
    },
    'tgtChrom': {
        'tag'     : 'select',
        'options' : _tgtsChroms,
        'alt'     : 'Select Target Chromosome',
        'multiple': true
    },
    'status'  : {
        'tag'     : 'select',
        'options' : _statuses  ,
        'alt'     : 'Select Status',
        'multiple': true
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












function draw() {
    var sels = document.createElement('span');
    sels.id  = 'selectors';

    var bfc  = bdy.firstChild;
    sels     = bdy.insertBefore( sels, bfc );


    genSelectors(sels); // generate selectors based on "opts" variable


    var pos = document.createElement('label');
        pos.id = 'pos'; // creates position label
    sels.appendChild(pos);

    var tip = document.body.appendChild( document.createElement('div') );
        tip.id             = 'tipper';



    createOptions();


    var chartDiv       = document.createElement('div');
    chartDiv.className = 'chart';
    chartDiv.id        = chartName;

    document.body.appendChild( chartDiv );
    
    updateSelects();
}


function updateSelects() {
    var sels = document.getElementsByTagName('select');

    var upd   = function() { updateSel(this.sid, this.o           , this.checked); };
    var seall = function() { selSelAll(this.parentNode.parentNode , this.checked); };

    for ( var s = 0; s < sels.length; s++ ) {
        var sel = sels[s];
        //console.log( sel );
        if ( sel.multiple ) {
            var par  = sel.parentNode;
            var opts = sel.getElementsByTagName('option');
            var sid  = sel.id;
            var bcr  = sel.getBoundingClientRect();
            
            var div           = document.createElement('div');
            div.className     = 'selectDiv';
            div.style.width   = bcr.width + 'px';
            div.style.display = 'block';
            //div.style.top     = bcr.top;
            //div.style.left    = bcr.left;
            
            
            for ( var o = 0; o < opts.length; o++ ) {
                var opt         = opts[ o ];
                
                var inp         = document.createElement( 'input' );
                    inp.type    = 'checkbox';
                    inp.sid     = sid;
                    inp.o       = o;
                    inp.value   = opt.value;
                    
                    if (opt.value === '*all*') {
                        inp.onclick = seall;
                    } else 
                    if (opt.value === 'null') {
                    } else {
                        inp.onclick = upd;
                    }
                
                if ( opt.selected ) {
                    inp.checked = true;
                }
                
                var spa1        = document.createElement( 'span'  );
                    spa1.style.height = '1.5em';
                
                var spa2     = document.createElement( 'span'  );
                    spa2.innerHTML    = opt.innerHTML;
                    spa2.style.height = '1.5em';
                
                var br       = document.createElement( 'br'    );
                
                if (opt.value === 'null') {
                    inp.style.visibility = 'hidden';
                }
                
                spa1.appendChild( inp  );
                spa1.appendChild( spa2 );
                spa2.appendChild( br   );
                div.appendChild(  spa1 );
            }
            
            par.appendChild( div );

            sel.style.visibility = 'hidden';
            sel.style.display    = 'none';
        }
    }
}


function updateSel(sid, o, checked) {
    var sel      = document.getElementById( sid );
    var opts     = sel.getElementsByTagName('option');
    var opt      = opts[o];
    opt.selected = checked;
}


function selSelAll(parentNode, checked) {
    var inps     = parentNode.getElementsByTagName('input');
    console.log( inps );
    for ( var i = 0; i < inps.length; i++ ) {
        var inp      = inps[i];
        if ( inp.value !== '*all*') {
            inp.checked = !checked;
            inp.click();
        }
    }
}






/*
 *
 * PAGE CREATOR
 *
 */
function addPicker ( el, id, cls, nfo, callback, opts ) {
    var addlbls = true;
    var addlblA = true;
    var addlblB = true;


    if (opts) {
        if ( opts.addlbls !== undefined ) { addlbls = opts.addlbls; }
        if ( opts.addlblA !== undefined ) { addlblA = opts.addlblA; }
        if ( opts.addlblB !== undefined ) { addlblB = opts.addlblB; }
    }



    if ( addlbls && addlblB ) {
        console.log( 'adding label B');
        var trD1       = el  .appendChild( document.createElement('td'   ) );
        trD1.className = 'labelB';

        var lbl1       = document.createElement('label');
        lbl1.htmlFor   = id;
        lbl1.id        = id + '_labelB';
        lbl1.innerHTML = "<b>" + id + "</b>";

        if (nfo.alt) {
            lbl1.innerHTML = "<b>" + nfo.alt + "</b>";
        }

        trD1.appendChild(lbl1);
    }





    var trD2       = el  .appendChild( document.createElement( 'td'    ) );
    trD2.className = 'setupField';

    var sel        = trD2.appendChild( document.createElement( nfo.tag ) );
    sel.className  = 'setupEl';
    sel.id         = id;
    sel.onchange   = callback;



    for ( var opt in nfo ) {
        if (opt == 'tag') {
            continue;
        }
        
        if (nfo.tag == 'select' && (opt == 'value' || opt == 'options')) {
            continue;
        }

        sel[opt] = nfo[opt];
    }



    if (nfo.tag == 'select') {
        genSelectorsOpts(nfo.options, sel, nfo.value);

    } else if ( sel.type == 'checkbox' ) {
        sel.checked = nfo.value;

    }



    if ( addlbls && addlblA ) {
        console.log( 'adding label A');
        var trD3       = el  .appendChild( document.createElement('td'   ) );
        trD3.className = 'labelA';

        var lbl2       = document.createElement('label');
        lbl2.htmlFor   = id;
        lbl2.id        = id + '_labelA';

        if ( nfo.value !== null && nfo.value !== undefined ) {
            lbl2.innerHTML = nfo.value;

            var unity      = nfo.unity;
            if (unity) {
                lbl2.innerHTML = nfo.value + unity;
            }
        }

        trD3.appendChild(lbl2);
    }
}


function genSelectorsOpts ( obj, refSel, dflt, multiple ) {
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
};


function createCsss ( el ) {
    console.groupCollapsed('createCsss %o', el);
    console.timeStamp(     'begin createCsss');
    console.time(          'createCsss');
    console.log(           'begin createCsss %o', el);

    var tbl       = el  .appendChild( document.createElement('table') );
    tbl.className = 'setuptable';

    var callback = function(e) {
        console.log( 'CSSS CALLBACK' );
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
        localDb.saveOpt( 'css', id, val );
        changecss(obj, prop, val);

        var lbl = document.getElementById( id + '_labelA' );
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
            nfo.value    = localDb.getOpt( 'css', id, nfo.value );

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

    console.log(      'end createCsss %o', el);
    console.timeStamp('end createCsss');
    console.timeEnd(  'createCsss');
    console.groupEnd( 'createCsss %o', el);
};


function createPositions ( el ) {
    console.groupCollapsed('createPositions %o', el);
    console.timeStamp(     'begin createPositions');
    console.time(          'createPositions');
    console.log(           'begin createPositions %o', el);

    var tbl       = el  .appendChild( document.createElement('table') );
    tbl.className = 'setuptable';

    var callback = function(e) {
        console.log( 'POSITION CALLBACK' );
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

        localDb.saveOpt( 'positions', id, val );

        var lbl = document.getElementById( id + '_labelA' );
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
        nfo.value  = localDb.getOpt( 'positions', id, nfo.value );
        addPicker(tr, id, 'positions', nfo, callback);
    }


    console.log(      'end createPositions %o', el);
    console.timeStamp('end createPositions');
    console.timeEnd(  'createPositions');
    console.groupEnd( 'createPositions %o', el);
};


function createOptions ( ) {
    console.groupCollapsed('createOptions');
    console.timeStamp(     'begin createOptions');
    console.time(          'createOptions');

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

    var clsBtnS       = document.createElement('button');
    clsBtnS.onclick   = function(e) { if (hasStorage) { alert('Cleaning Sync preferences'); localDb.clearDb('syncs'); location.reload(); } };
    clsBtnS.innerHTML = 'Clear Syncs';

    divH.appendChild( clsBtnS );

    var clsBtnP       = document.createElement('button');
    clsBtnP.onclick   = function(e) { if (hasStorage) { alert('Cleaning Positions preferences'); localDb.clearDb('positions'); location.reload(); } };
    clsBtnP.innerHTML = 'Clear Positions';

    divH.appendChild( clsBtnP );


    var clsBtnC       = document.createElement('button');
    clsBtnC.onclick   = function(e) { if (hasStorage) { alert('Cleaning CSS preferences'); localDb.clearDb('css'); location.reload(); } };
    clsBtnC.innerHTML = 'Clear CSS';

    divH.appendChild( clsBtnC );


    var clsBtnA       = document.createElement('button');
    clsBtnA.onclick   = function(e) { if (hasStorage) { alert('Cleaning ALL preferences'); localDb.clearDb('syncs'); localDb.clearDb('positions'); localDb.clearDb('css'); location.reload(); } };
    clsBtnA.innerHTML = 'Clear ALL';

    divH.appendChild( clsBtnA );


    console.timeStamp('end createOptions');
    console.timeEnd(  'createOptions');
    console.groupEnd( 'createOptions');
}


function createSyncs ( el ) {
    console.groupCollapsed('createSyncs %o', el);
    console.timeStamp(     'begin createSyncs');
    console.time(          'createSyncs');
    console.log(           'begin createSyncs %o', el);

    var span = el.appendChild( document.createElement('span') );
    span.style.display = "inline-block";


    var tbl       = el  .appendChild( document.createElement('table') );
    tbl.className = 'setuptable';

    var callback = function(e) {
        console.log('SYNC CALLBACK');
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

        localDb.saveOpt( 'syncs', id, val );

        var lbl = document.getElementById( id + '_labelA' );
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

        nfo.value = localDb.getOpt( 'syncs', id, nfo.value );

        if ( idN > 0 && idN % 4 == 0 ) {
            tr = tbl .appendChild( document.createElement('tr'   ) );
        }

        addPicker(tr, id, 'syncs', nfo, callback, {addlblA: false});
    }



    //var callback2 = function(e) {
    //        var tgt = null
    //        try {
    //            tgt = e.srcElement;
    //        } catch(e) {
    //            tgt = e.target; //Firefox
    //        }
    //
    //        if (tgt) {
    //            var id = tgt.id;
    //            localDb.saveOpt( 'syncs', id, getFieldValue( id ) );
    //        }
    //    };
    //
    //addPicker( tr, 'size', 'sizes', sizes.size, callback2, {addlblA: false});

    console.log(      'end createSyncs %o', el);
    console.timeStamp('end createSyncs');
    console.timeEnd(  'createSyncs');
    console.groupEnd( 'createSyncs %o', el);
};


function genSelectors ( sels ) {
    /*
     * Generate "select" elements. Calls genOpts to read options
     * If only one option available, adds a label field, otherwise, adds a drop-down menu.
     */

    console.groupCollapsed('genSelectors %o', sels);
    console.timeStamp(     'begin genSelectors');
    console.time(          'genSelectors');
    console.log(           'begin genSelectors %o', sels);


    var callback = function(e) {
            var tgt = null;

            try {
                tgt = e.srcElement;
            } catch(e) {
                tgt = e.target; //Firefox
            }

            if (tgt) {
                var id = tgt.id;
                localDb.saveOpt( 'selectors', id, getFieldValue( id ) );
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
            opt2.value   = localDb.getOpt( 'selectors', optName, opt2.value );

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

    console.log(      'end genSelectors %o', sels);
    console.timeStamp('end genSelectors');
    console.timeEnd(  'genSelectors');
    console.groupEnd( 'genSelectors %o', sels);
};





/*
 *
 *ACTIONS
 *
 */
function selclick ( ) {
    console.groupCollapsed('selclick');
    console.timeStamp(     'begin selclick');
    console.time(          'selclick');

    var vals = getVals();

    if (!vals) {
        console.log('no vals');
        return;
    }

    //console.log( vals );
    var cfg = getCfg();

    if (!cfg) {
        return;
    }

    cfg.tipId      = 'tipper';
    cfg.labelId    = null;

    new processVals( vals, cfg );

    console.timeStamp('end selclick');
    console.timeEnd(  'selclick');
    console.groupEnd( 'selclick');
};


function getVals ( ) {
    console.groupCollapsed('getVals');
    console.timeStamp(     'begin getVals');
    console.time(          'getVals');

    var vals = {};

    for ( var optName in opts ) {
        var val      = getFieldValue( optName );

        if ( val === null ) {
            console.log( 'value ' + optName + ' not defined' );
            vals = null;
            break;
        } else {
            //console.log( 'appending ' + optName + ' = '+ val );
            vals[ optName ] = val.split('|');
        }
    }

    console.log(      'end getVals >> %o', vals);
    console.timeStamp('end getVals');
    console.timeEnd(  'getVals');
    console.groupEnd( 'getVals');

    return vals;
}


function getCfg ( ) {
    console.groupCollapsed('getCfg');
    console.timeStamp(     'begin getCfg');
    console.time(          'getCfg');

    var optdbs = {
        'positions' : [positions , false],
        'syncFields': [syncFields, true ]
    };

    for ( optName in optdbs ) {
        console.log('checking '+ optName);
        var optdb = optdbs[ optName ][0];
        var compu = optdbs[ optName ][1];

        var posK  = Object.keys( optdb );
            posK.sort();

        var cfg   = {};

        for (var idN = 0; idN < posK.length; idN++ ) {
            var id    = posK[idN];
            var nfo   = optdb[id];
            var dfl   = nfo.value;
            var tpy   = nfo.type;
            var curr  = getFieldValue( id );

            console.log('checking '+ optName + ' option ' + id + ' default ' + dfl + ' current ' + curr);


            if ( ( compu ) || ( dfl === null ) || ( tpy == 'checkbox' ) || ( dfl != curr ) ) {
                console.log('  changing');
                console.log( nfo );
                cfg[id] = curr;

            } else {
                console.log('  keeping');
                if (cfg[id]) {
                    delete cfg[id];
                }
            }
        }
    }

    console.log(      'end getCfg >> %o', cfg);
    console.timeStamp('end getCfg');
    console.timeEnd(  'getCfg');
    console.groupEnd( 'getCfg');

    return cfg;
}







