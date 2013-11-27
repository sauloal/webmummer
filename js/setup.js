var datafolder = 'data/';
/*
 * Folder where the databases resides
 */
var chartName  = 'chart1';
/*
 * Div where to draw graphs
 */
var scriptHolder = 'scriptholder';


var bdy = document.getElementsByTagName('body')[0];

var win = window,
    doc = document,
    del = doc.documentElement,
    bdy = doc.getElementsByTagName('body')[0],
    wid = win.innerWidth  || del.clientWidth  || bdy.clientWidth,
    hei = win.innerHeight || del.clientHeight || bdy.clientHeight;

var huid = '';

function hasStorage() {
    try {
        //var res = 'localStorage' in window && window['localStorage'] !== null;
        var res = windowhasOwnProperty('localStorage') && window.localStorage !== null;

        return res;
    } catch(e) {
        //alert('no storage');
        console.log('no storage');
        return false;
    }
}

var hasstorage = hasStorage();



/*
 * Available fields to be queried in the database
 * Used to create drop-down boxes
 */
var opts   = {
    'refName' : [ _refsNames , 'Select Reference'            ],
    'refChrom': [ _refsChroms, 'Select Reference Chromosome' ],
    'tgtName' : [ _tgtsNames , 'Select Target'               ],
    'tgtChrom': [ _tgtsChroms, 'Select Target Chromosome'    ],
    'status'  : [ _statuses  , 'Select Status'               ]
};


var sizes = {
        chartfull : 'Full'   ,
        chartpart : 'Half'   ,
        chartquart: 'Quarter'
    };


var csss = {
    '.chart' :  {
                    'background-color': {
                        'type'   : 'color',
                        'value'  : '#FFFFFF',
                        'alt'    : 'Chart\'s background color'
                    }
                },

    '.grid': {
                'font-size': {
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
                        'type'   : 'text',
                        'value'  : 'sans-serif',
                        'alt'    : 'Global font family'
                },

                'font-size': {
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
                        'type'   : 'color',
                        'value'  : '#EEEEEE',
                        'alt'    : 'Graphic background color'
                }
    },

    '.grid-line': {
                'stroke': {
                        'type'   : 'color',
                        'value'  : '#CCCCCC',
                        'alt'    : 'Grid line color'
                }
    },

    '.points': {
                'stroke-width': {
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
        //                'type'   : 'color',
        //                'value'  : '#0000FF',
        //                'alt'    : 'Forward line color'
        //        },
        'stroke': {
                        'type'   : 'color',
                        'value'  : '#0000FF',
                        'alt'    : 'Forward line color'
                }
    },

    '.points-r': {
        //'fill': {
        //                'type'   : 'color',
        //                'value'  : '#FF3300',
        //                'alt'    : ''
        //        },
        'stroke': {
                        'type'   : 'color',
                        'value'  : '#FF3300',
                        'alt'    : 'Reverse line color'
                }
    },

    '.scaf-square': {
        'fill': {
                        'type'   : 'color',
                        'value'  : '#33cc33',
                        'alt'    : 'Scaffold highligh box color'
                },
        'opacity': {
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
                        'type'   : 'color',
                        'value'  : '#0000FF',
                        'alt'    : 'Tooltip color'
                }
    }
};


var positions = {
    'xTicks'              : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  10,
                    'alt'    : 'Number of X ticks'
    },
    'yTicks'              : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  10,
                    'alt'    : 'Number of Y ticks'
    },
    'paddingTop'          : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  40,
                    'alt'    : 'Padding top'
    },
    'paddingRight'        : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  30,
                    'alt'    : 'Padding right'
    },
    'paddingBottom'       : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  60,
                    'alt'    : 'Padding bottom'
    },
    'paddingLeft'         : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  70,
                    'alt'    : 'Padding left'
    },
    'titleDy'             : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : 0.75,
                    'alt'    : 'Title vertical offset'
    },
    'xNumbersDy'          : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : 1,
                    'alt'    : 'X axis numbers vertical offset'
    },
    'yNumbersDy'          : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : 0.25,
                    'alt'    : 'Y axis numbers vertical offset'
    },
    'xlabelDx'            : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : 0,
                    'alt'    : 'X axis label horizontal offset'
    },
    'xlabelDy'            : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : 2.3,
                    'alt'    : 'X axis label vertical offset'
    },
    'ylabelX'             : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : 0,
                    'alt'    : 'Y axis label horizontal position'
    },
    'ylabelY'             : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : 0,
                    'alt'    : 'Y axis label vertical position'
    },
    'ylabelDx'            : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : 0,
                    'alt'    : 'Y axis label horizontal offset'
    },
    'ylabelDy'            : {
                    'type'   : 'range',
                    'min'    : -10,
                    'max'    :  10,
                    'step'   : 0.10,
                    'value'  : -2.3,
                    'alt'    : 'Y axis label vertical position'
    },
    'downloadIconMaxSize' : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  20,
                    'alt'    : 'Download icon max size'
    },
    'closeIconMaxSize'    : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  20,
                    'alt'    : 'Close icon max size'
    },
    'padlockIconMaxSize'  : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  20,
                    'alt'    : 'Padlock icon max size'
    },
    'compassMaxSize'      : {
                    'type'   : 'range',
                    'min'    :   0,
                    'max'    : 100,
                    'step'   :   1,
                    'value'  :  75,
                    'alt'    : 'Compass max size'
    },
    'compassMinSize'      : {
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
                'type'   : 'checkbox',
                'value'  :  true,
                'alt'    : 'Synchronize Movement'
    },
    'resizeX': {
                'type'   : 'checkbox',
                'value'  :  true,
                'alt'    : 'Resize X'
    },
    'resizeY': {
                'type'   : 'checkbox',
                'value'  :  false,
                'alt'    : 'Resize Y'
    },
    'horizontal': {
                'type'   : 'checkbox',
                'value'  :  false,
                'alt'    : 'Horizontal visualization'
    }
};










function start() {
    /*
     * Creates page elements
     */

    var sels    = document.createElement('span');
        sels.id = 'selectors';

    var bfc = bdy.firstChild;
    sels = bdy.insertBefore( sels, bfc );



    genSelectors(sels); // generate selectors based on "opts" variable



    var okb = document.createElement('button');   // add button and it's click action
        okb.onclick   = selclick;
        okb.innerHTML = 'view';
    sels.appendChild( okb );



    var clb = document.createElement('button');   // add button and it's click action
        clb.onclick   = clearPics;
        clb.innerHTML = 'clear';
    sels.appendChild(clb);



    var pos = document.createElement('label');
        pos.id = 'pos'; // creates position label
    sels.appendChild(pos);

    var tip = document.body.appendChild( document.createElement('div') );
        tip.id             = 'tipper';


    graphdb = new SyncSimpleGraph( {

        sync   : function () { return getOpt( 'sync'   , true  ); },
        resizeX: function () { return getOpt( 'resizeX', true  ); },
        resizeY: function () { return getOpt( 'resizeY', false ); }
    });
    //graphdb = new SyncSimpleGraph( true );


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

    okb.onclick();
};









function addPicker(el, id, cls, nfo, callback) {
    var trD1       = el  .appendChild( document.createElement('td'   ) );
    var trD2       = el  .appendChild( document.createElement('td'   ) );
    var trD3       = el  .appendChild( document.createElement('td'   ) );

    var sel        = trD2.appendChild( document.createElement('input') );


    for ( var opt in nfo ) {
        sel[opt] = nfo[opt];
    }

    sel.id        = id;

    var lbl1       = document.createElement('label');
    lbl1.htmlFor   = sel.id;
    lbl1.innerHTML = "<b>" + sel.id + "</b>";

    if (sel.alt) {
        lbl1.innerHTML = "<b>" + sel.alt + "</b>";
    }

    trD1.appendChild(lbl1);

    var unity = sel.unity;

    var lbl2       = document.createElement('label');
    lbl2.htmlFor   = sel.id;
    lbl2.id        = sel.id + '_label';
    lbl2.innerHTML = sel.value;

    if (unity) {
        lbl2.innerHTML = sel.value + unity;
    }

    trD3.appendChild(lbl2);

    if ( sel.type == 'checkbox' ) {
        sel.checked = nfo.value;
    }

    sel.onchange  = callback;
}


function createCsss(el) {
    var tbl       = el  .appendChild( document.createElement('table') );
    tbl.className = 'setuptable';

    var callback = function(e) {
        var id    = e.srcElement.id;
        var obj   = e.srcElement.obj;
        var prop  = e.srcElement.prop;
        var unity = e.srcElement.unity;
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
        var id  = e.srcElement.id;
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
        var tr    = tbl .appendChild( document.createElement('tr'   ) );

        var id    = posK[idN];
        var nfo   = positions[id];

        nfo.value = getOpt( id, nfo.value );

        addPicker(tr, id, 'positions', nfo, callback);
    }
};


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
    clsBtn.onclick   = function(e) { if (hasStorage) { localStorage.clear(); alert('cleaning all preferences'); location.reload(); } };
    clsBtn.innerHTML = 'Clear';

    divH.appendChild( clsBtn );
}


function createSyncs(el) {
    var span = el.appendChild( document.createElement('span') );
    span.style.display = "inline-block";


    var tbl       = el  .appendChild( document.createElement('table') );
    tbl.className = 'setuptable';

    var callback = function(e) {
        var id  = e.srcElement.id;
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






    var sizeTd          = tr.appendChild(  document.createElement("td") );

    var sizeLbl         = sizeTd.appendChild( document.createElement('label') );
    sizeLbl.innerHTML   = '<b>Graphic size</b>';

    var sizeSel         = sizeTd.appendChild(  document.createElement("select") );
        sizeSel.id      = 'size';
        sizeSel.alt     = 'Select Graphic Size';

    var val = getOpt('size', Object.keys( sizes )[0]);

    for ( var size in sizes ){
        var opf       = document.createElement("option");
        opf.value     = size;
        opf.innerHTML = sizes[size];

        if (val)
        {
            if (val == size) {
                opf.selected = true;
            }
        }

        sizeSel.appendChild( opf );
    }

    sizeSel.onchange  = function(e) { saveOpt( e.srcElement.id, getFieldValue( e.srcElement.id ) ); };
}


function genOpts(obj, refSel, dflt){
    /*
     * Generate drop-down lists options base on "opts"
     */
    for ( var o = 0; o < obj.length; o++ ){
        var opt = obj[ o ];

        var op           = document.createElement('option');
            op.value     = opt;
            op.innerHTML = opt;

        if (dflt)
        {
            if (dflt == opt) {
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
    //var statuses = ['Clean & Filtered Dot Plot. Only Inversions', 'Clean Dot Plot'];
    //var tgts     = ['solanum arcanum', 'solanum habrochaites', 'solanum lycopersicum heinz denovo', 'solanum pennellii'];
    //var refChrom   = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    //var refs     = ['solanum lycopersicum heinz'];
    //var filelist = {


    for ( var optName in opts ) {
        var opt      = opts[optName];
        var optVar   = opt[0];
        var optLabel = opt[1];

        if ( optVar.length == 1 ) {
            var refSel           = document.createElement("label");
                refSel.id        = optName;
                refSel.alt       = optLabel;
                refSel.value     = optVar[0];
                refSel.innerHTML = optVar[0];

            sels.appendChild(refSel);

        } else {
            var refOp           = document.createElement('option');
                refOp.value     = null;
                refOp.innerHTML = optLabel;

            var allOp           = document.createElement('option');
                allOp.value     = '*all*';
                allOp.innerHTML = 'All';

            var val = getOpt(optName, null);

            if (val)
            {
                if (val == '*all*') {
                    allOp.selected = true;
                }
            }

            var refSel          = document.createElement("select");
                refSel.id       = optName;
                refSel.alt      = optLabel;

                refSel.appendChild( refOp );
                genOpts( optVar, refSel, val );
                refSel.appendChild( allOp );

                refSel.onchange  = function(e) { saveOpt( e.srcElement.id, getFieldValue( e.srcElement.id ) ); };

            sels.appendChild(refSel);
        }
    }
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

    var filename = reg.filepath;
    var scriptId = reg.scriptid;
    var holder   = document.getElementById( scriptHolder );

    // Adding the script tag to the head as suggested before
    //var head     = document.getElementsByTagName('head')[0];
    var script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = filename;
    script.id     = scriptId;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    //script.onreadystatechange = callback;
    script.onload = function() { callback( reg ); };

    // Fire the loading
    //var holder = document.getElementById('scriptholder');
    //while (holder.firstChild) {
    //    holder.removeChild(holder.firstChild);
    //}

    holder.appendChild( script );
}


function mergeregs( regs ) {
    huid = huid.replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '');

    var hreg         = { };
    var yTicksLabels = [];

    for ( var r = 0; r < regs.length; r++ ) {
        var reg         = regs[r];
        yTicksLabels[r] = [];

        for ( var v in reg ) {
            if (!hreg[v]) {
                hreg[v] = [];
            }
            hreg[v].push( regs[r][v] );
        }
    }



    for ( var v in hreg ) {
        var vals = hreg[v];
        var uniqueArray = vals.filter(function(elem, pos) {
            return vals.indexOf(elem) == pos;
        });

        if (uniqueArray.length == 1) {
            hreg[v] = vals[0];
        } else {
            if (['tgtName', 'status'].indexOf(v) != -1) {
                console.log('MORE '+v);
                for ( var h = 0; h < hreg[v].length; h++) {
                    yTicksLabels[h].push( hreg[v][h] );
                }
            }
        }
    }

    for ( var r = 0; r < yTicksLabels.length; r++ ) {
        yTicksLabels[r] = yTicksLabels[r].join('+');
    }



    hreg.xmax   = Math.max.apply(null, hreg.xmax);
    hreg.ymax   = Math.max.apply(null, hreg.ymax);
    hreg.xmin   = Math.min.apply(null, hreg.xmin);
    hreg.ymin   = Math.min.apply(null, hreg.ymin);

    var tgts    = hreg.tgtName;
    var sts     = hreg.status;
    var ylabel  = hreg.ylabel;



    try {
        tgts    = '(' + hreg.tgtName.join('+') + ')';
    } catch (e) {
        //
    }

    try {
        sts     = '(' + hreg.status.join('+') + ')';
    } catch (e) {
        //
    }

    try {
        ylabel  = '(' + hreg.ylabel('+') + ')';
    } catch (e) {
        //
    }

    hreg.title        = hreg.refName + ' - chromosome ' + hreg.refChrom + ' vs ' + tgts  + ' - Status ' + sts;
    hreg.ylabel       = ylabel;
    hreg.yTicksLabels = yTicksLabels;

    hreg.uid          = huid;
    huid              = '';


    return hreg;
};


function loadGraph( regs ) {
    /*
     * Deletes the <script> tag to release the memory in the DOM.
     * Clears chart
     * Create event listener to add tipsy (tip creator)
     * Initialize SimpleGraph
     * Deletes from register
     */


    var horizontal = getOpt( 'horizontal', false );
    //var holder     = document.getElementById( scriptHolder );


    if (horizontal) {
        var hreg = mergeregs( regs );

        graphdb.add(chartName, hreg);
    } else {
        regs.map( function(reg) {
            console.log( reg );
            graphdb.add(chartName, reg);
        });
    }


    // clean up
//    for ( var r = 0; r < regs.length; r++ ) {
//        var reg = regs[r];
//
//        var script = document.getElementById( reg.scriptid );
//
//        if ( script ) {
//            holder.removeChild( script );
//        }
//
//        delete reg.points;
//        delete reg.scaffs;
//    }
};


syncLoadScript = function( regs, callback ) {
    var self          = this;
    this.regs         = regs;
    this.callback     = callback;
    this.size         = 0;
    this.received     = 0;
    this.receivedData = [];

    this.regs.map( function(reg) {
        var files  = reg.filename;
        if (files) {
            self.size += 1;
        }
    });


    if (this.size === 0) {
        console.log('nothing to plot');
        return;
    }

    var count = 0;
    regs.map( function(reg) {
        var files  = reg.filename;
        var func   = function(sregv) { loadScript( sregv, self.receive() ); };

        if (files) {
            console.log( 'sending ' + files );
            setTimeout( func(reg), (count * 1000));
            count += 1;
        }
    });
};


syncLoadScript.prototype.receive = function( ) {
    var self = this;

    return function( reg ) {
        self.received += 1;

        self.receivedData.push( reg );
        console.log( 'received #' + self.received + '/' + self.size + ' ' + reg.filename );

        if ( self.received == self.size) {
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
    var val   = null;

    if ( field.localName == 'select' ) {
        var sel = field.selectedIndex;
        var fio = field.options[ sel ];
        val     = fio.value;
    } else {
        if ( field.type == 'checkbox' ) {
            val = field.checked;
        } else {
            val = field.value;
        }
    }

    if (val == 'null') {
        val = null;
    }

    return val;
};


function getVals() {
    var vals = {};

    var uid  = '';

    for ( var optName in opts ) {
        var val      = getFieldValue( optName );

        if ( val === null ) {
            return null;
        }

        //console.log( 'appending '+optName+' = '+val );
        vals[ optName ] = val;
        uid += val;
    }

    return vals;
}


function getRegister( gvals ){
    var evals     = [];
    var refNames  = [];
    var refChroms = [];
    var tgtNames  = [];
    var tgtChroms = [];
    var statuses  = [];


    if (gvals.refName == '*all*') {
        opts.refName[0].map( function(refName) {
            refNames.push( refName );
        });
    } else {
        refNames.push( gvals.refName );
    }

    if (gvals.refChrom == '*all*') {
        opts.refChrom[0].map( function(refChrom) {
            refChroms.push( refChrom );
        });
    } else {
        refChroms.push( gvals.refChrom );
    }

    if (gvals.tgtName == '*all*') {
        opts.tgtName[0].map( function(tgtName) {
            tgtNames.push( tgtName );
        });
    } else {
        tgtNames.push( gvals.tgtName );
    }

    if (gvals.tgtChrom == '*all*') {
        opts.tgtChrom[0].map( function(tgtChrom) {
            tgtChroms.push( tgtChrom );
        });
    } else {
        tgtChroms.push( gvals.tgtChrom );
    }

    if (gvals.status == '*all*') {
        opts.status[0].map( function(status) {
            statuses.push( status );
        });
    } else {
        statuses.push( gvals.status );
    }



    var horizontal = getOpt( 'horizontal', false );

    if (horizontal) {
        huid = 'horiz_';
        for ( var k in gvals ) {
            huid += gvals[k];
        }

        if ( refNames.length != 1 ) {
            alert( 'more than one reference while using horizontal graph ' + refNames.length + ' ' + refNames );
            return null;
        }

        if ( refChroms.length != 1 ) {
            alert( 'more than one chromosome while using horizontal graph ' + refChroms.length + ' ' + refChroms);
            return null;
        }
    }


    refNames.map( function(refName) {
        refChroms.map( function(refChrom) {
            tgtNames.map( function(tgtName) {
                tgtChroms.map( function(tgtChrom) {
                    statuses.map( function(status) {
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


    var regs       = [];


    for ( var e = 0; e < evals.length; e++ ) {
        var vals = evals[e];
        var reg  = null;

        try {
            reg = _filelist[ vals.refName ][ vals.refChrom ][ vals.tgtName ][ vals.tgtChrom ][ vals.status ];
        }
        catch(err) {
            console.error('combination does not exists for:');
            console.error( vals );
            continue;
        }

        var uid = vals.ref + vals.refChrom + vals.tgtName + vals.tgtChrom + vals.status;
            uid = uid.replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '');

        reg.uid        = uid;
        reg.chartClass = getOpt('size', Object.keys( sizes )[0]);
        reg.tipId      = 'tipper';

        reg.filepath   = datafolder + reg.filename;
        reg.scriptid   = 'script_'  + reg.uid;
        reg.refName    = vals.refName;
        reg.refChrom   = vals.refChrom;
        reg.tgtName    = vals.tgtName;
        reg.tgtChrom   = vals.tgtChrom;
        reg.status     = vals.status;

        var posK = Object.keys( positions );
            posK.sort();

            for (var idN = 0; idN < posK.length; idN++ ) {
                var id    = posK[idN];
                var nfo   = positions[id];
                var dfl   = nfo.value;
                var curr  = getOpt( id, nfo.value );

                if ( dfl != curr ) {
                    console.log('option ' + id + ' default ' + dfl + ' current ' + curr + ' changing');
                    reg[id] = curr;
                } else {
                    if (reg[id]) {
                        delete reg[id];
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
        console.log('saving k "' + k + '" v "' + v + '"');
        localStorage[k] = JSON.stringify( v );
    }
};


function getOpt(k, d) {
    if ( hasstorage ) {
        //console.log('getting ' + k);
        try {
            var res = localStorage[k];
            //console.log('getting ' + k + ' val "' + res + '"');
            if ( res === undefined || res === null ) {
                //console.log('getting ' + k + ' val "' + res + '" returning default "' + d + '"');
                return d;
            } else {
                res = JSON.parse( res );
                //console.log('getting ' + k + ' val "' + res + '"');
                return res;
            }
        } catch (e) {
            return d;
        }
    } else {
        return d;
    }
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
