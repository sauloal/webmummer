var datafolder = 'data/';
/*
 * Folder where the databases resides
 */
var chartName  = 'chart1';
/*
 * Div where to draw graphs
 */
var scriptHolder = 'scriptholder';



function start() {
    /*
     * Creates page elements
     */
    //$('#chart1').html( 'please select' );

    var pos = document.createElement('label');
        pos.id = 'pos'; // creates position label

    var hlp = document.createElement('label');
        hlp.innerHTML = '<b>[+/ScrUp]</b> Zoom In <b>[-/ScrDw]</b> Zoom Out <b>[Arrow keys]</b> Move <b>[0]</b> Reset'; // creates help label

    var okb = document.createElement('button');   // add button and it's click action
        okb.onclick   = selclick;
        okb.innerHTML = 'view';

    var sel = genSelectors(); // generate selectors based on "opts" variable

    // append elements
    var bdy = document.getElementsByTagName('body')[0];
    var bfc = bdy.firstChild;

    bdy.insertBefore( pos, bfc );
    bfc = bdy.firstChild;
    bdy.insertBefore( hlp, bfc );
    bfc = bdy.firstChild;
    bdy.insertBefore( okb, bfc );
    bfc = bdy.firstChild;
    bdy.insertBefore( sel, bfc );



    graphdb = new SyncSimpleGraph( function () { return true; } );
    //graphdb = new SyncSimpleGraph( true );

    // automatically select the last option in all fields
    //for ( var o = 0; o < opts.length; o++ ) {
    //    var opt   = opts[o];
    //    var field = document.getElementById( opt[1] );
    //    if ( field.localName == 'select' ) {
    //        field.lastChild.selected = true;
    //    } else {
    //        //console.log('not select');
    //    }
    //}
    //
    //okb.onclick();
}

/*
 * Available fields to be queried in the database
 * Used to create drop-down boxes
 */
var opts   = [
    [ refs    , 'ref'   , 'Select Reference'  ],
    [ chroms  , 'chrom' , 'Select Chromosome' ],
    [ spps    , 'spp'   , 'Select Species'    ],
    [ statuses, 'status', 'Select Status'     ],
];





function genOpts(obj, refSel){
    /*
     * Generate drop-down lists options base on "opts"
     */
    for ( var o = 0; o < obj.length; o++ ){
        var opt = obj[ o ];

        var op           = document.createElement('option');
            op.value     = opt;
            op.innerHTML = opt;

        refSel.appendChild( op );
    }
}


function genSelectors(){
    /*
     * Generate "select" elements. Calls genOpts to read options
     * If only one option available, adds a label field, otherwise, adds a drop-down menu.
     */
    //var statuses = ['Clean & Filtered Dot Plot. Only Inversions', 'Clean Dot Plot'];
    //var spps     = ['solanum arcanum', 'solanum habrochaites', 'solanum lycopersicum heinz denovo', 'solanum pennellii'];
    //var chroms   = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    //var refs     = ['solanum lycopersicum heinz'];
    //var filelist = {

    var sels    = document.createElement('span');
        sels.id = 'selectors';

    for ( var o = 0; o < opts.length; o++ ) {
        var opt = opts[o];
        var optVar   = opt[0];
        var optName  = opt[1];
        var optLabel = opt[2];

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

            var refSel     = document.createElement("select");
                refSel.id  = optName;
                refSel.alt = optLabel;
                refSel.appendChild( refOp )
                genOpts( optVar, refSel );

            sels.appendChild(refSel);
        }
    }

    return sels;
}


function loadScript( reg ){
    /*
     * Adds a <script> tag to load the database
     * This is needed to circunvent the security measures which forbids
     * the browser to load any file other than images and javascript.
     *
     * Given the UID of the graph and the database register to be plotted
     * (both to be forwarded to "loadGraph"), creates the script and add
     * loadgraph as callback to its "onload".
     */

    var filename = reg[ 'filepath' ];
    var scriptId = reg[ 'scriptid' ];
    var holder   = document.getElementById( scriptHolder );


    // Adding the script tag to the head as suggested before
    var callback  = function() { loadGraph(reg) };

    //var head     = document.getElementsByTagName('head')[0];
    var script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = filename;
    script.id     = scriptId;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    //script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    //var holder = document.getElementById('scriptholder');
    //while (holder.firstChild) {
    //    holder.removeChild(holder.firstChild);
    //}

    holder.appendChild( script );
}


function loadGraph( reg ) {
    /*
     * Deletes the <script> tag to release the memory in the DOM.
     * Clears chart
     * Create event listener to add tipsy (tip creator)
     * Initialize SimpleGraph
     * Deletes from register
     */
    var uid    = reg[ 'uid'   ];

    var holder = document.getElementById( scriptHolder );
    var script = document.getElementById( reg.scriptid );


    holder.removeChild( script );

    //document.body.addEventListener('d3createdPath', addTipsy, false);

    graphdb.add(chartName, {
        "uid"     : uid,
        "xmin"    : reg.xmin,
        "xmax"    : reg.xmax,
        "ymin"    : reg.ymin,
        "ymax"    : reg.ymax,
        "xlabel"  : reg.xlabel,
        "ylabel"  : reg.ylabel,
        "title"   : reg.title,
        "points"  : reg.points,
        "scaffs"  : reg.scaffs,
        "xTicks"  : 5,
        "yTicks"  : 5,
        "padding" : { 'left': [120, 45] },
        "ylabelDy": "-3.3em",
        "labelId" : "pos"
    });

    delete reg.points;
    delete reg.scaffs;
}


function addTipsy( e ) {
    $(e.detail.el).tipsy({
            gravity: 'w',
            html   : true,
            title  : function() {
                var j   = this.getAttribute('j');
                var tip = e.detail.self.genTip( j );
                //console.log("tip "+tip);
                return tip;
            }
        });

    //$('svg circle').tipsy({
    //    gravity: 'w',
    //    html   : true,
    //    title  : function() {
    //        var j   = this.getAttribute('j');
    //        var res = genTip(self.points[j]);
    //        return res;
    //    }
    //});
}


function getVals(){
    var vals = {};

    var uid  = '';

    for ( var o = 0; o < opts.length; o++ ) {
        var opt   = opts[o];
        var field = document.getElementById(opt[1]);
        var val   = null;

        if ( field.localName == 'select' ) {
            val = field.options[field.selectedIndex].value;
        } else {
            val = field.value;
        }

        if (val=='null') {
            console.log( 'no ' + opt[1] + ' selected' );
            return;
        } else {
            console.log( opt[1] + ' selected ' + val );
        }

        //console.log( 'appending '+opt[1]+' = '+val );
        vals[opt[1]] = val;
        uid += val;
    }


    uid = uid.replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '');
    vals['uid'] = uid;

    return vals;
}


function getRegister( vals ){
    try {
        var reg = filelist[ vals['ref'] ][ vals['chrom'] ][ vals['spp'] ][ vals['status'] ];
        //console.log( reg );
        reg['uid'     ] = vals.uid;
        reg['filepath'] = datafolder + reg.filename;
        reg['scriptid'] = 'script_'  + reg.uid;
        return reg;
    }
    catch(err) {
        console.error('combination does not exists for:')
        console.error( vals );
        return;
    }
}


function obj2str(obj) {
    var res = "";
    for (var k in obj ) {
        res += '<b>' + k + "</b>: " + obj[k] + ", ";
    }
    return res;
}


function selclick(){
    var vals = getVals();
    if (!vals) {
        console.log('no vals');
        return;
    }

    //console.log( vals );

    var reg  = getRegister( vals );
    if (!reg) {
        console.log('no reg');
        return;
    }

    var file = reg[ 'filename' ];
    if (!file) {
        console.log('no filename');
        return;
    }

    loadScript( reg );
}


function basename(path) {
    return path.replace(/\\/g,'/').replace( /.*\//, '' );
}



//registerKeyboardHandler = function(callback) {
//  var callback = callback;
//  d3.select(window).on("keydown", callback);
//};


//http://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
document.addEventListener('DOMContentLoaded', start )



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
  options.split          || 30;
  options.padding        || {};
  options.padding.top    || [40, 20];
  options.padding.right  || [30, 30];
  options.padding.bottom || [60, 10];
  options.padding.left   || [70, 45];
  options.titleDx        || "-0.8em";
  options.xNumbersDy     || "1em";
  options.yNumbersDy     || "0.35em";
  options.xlabelDx       || "0em";
  options.xlabelDy       || "+2.3em";
  options.ylabelX        || 0;
  options.ylabelY        || 0;
  options.ylabelDx       || "0em";
  options.ylabelDy       || "-2.3em";
  options.downloadIconMaxSize ||  10;
  options.compassMaxSize      || 300;
  options.compassMinSize      || 100;

*/
