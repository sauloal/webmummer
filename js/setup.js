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
    wid = win.innerWidth || del.clientWidth || bdy.clientWidth,
    hei = win.innerHeight|| del.clientHeight|| bdy.clientHeight;


function hasStorage() {
    try {
		var res = 'localStorage' in window && window['localStorage'] !== null;
		console.log(res);
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
    'ref'   : [ refs    , 'Select Reference'  ],
    'chrom' : [ chroms  , 'Select Chromosome' ],
    'spp'   : [ spps    , 'Select Species'    ],
    'status': [ statuses, 'Select Status'     ],
};


var sizes = {
        chartfull : 'Full'   ,
        chartpart : 'Half'   ,
        chartquart: 'Quarter',
    };




function start() {
    /*
     * Creates page elements
     */
    //$('#chart1').html( 'please select' );

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
        sync   : function () { return document.getElementById('sync'   ).checked; },
        resizeX: function () { return document.getElementById('resizeX').checked; },
        resizeY: function () { return document.getElementById('resizeY').checked; }
    });
    //graphdb = new SyncSimpleGraph( true );


    createOptions();

	
	var chartDiv = document.createElement('div');
	chartDiv.className = 'chart';
	chartDiv.id        = 'chart1';
	
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

        okb.onclick();
    }
};


function createOptions(){
    var divH = bdy.appendChild( document.createElement('div') );
    divH.className   = 'htmlDiv htmlDivHide';
    divH.onmouseover = function(e) { divH.className = 'htmlDiv htmlDivShow'; };
    divH.onmouseout  = function(e) { divH.className = 'htmlDiv htmlDivHide'; };


    var hlp = document.createElement('label');
        hlp.innerHTML = '<b>Help</b><br/><b>[+/ScrUp]</b> Zoom In <b>[-/ScrDw]</b> Zoom Out <b>[Arrow keys]</b> Move <b>[0]</b> Reset'; // creates help label

    divH.appendChild( hlp     );
    divH.appendChild( document.createElement('br') );

    var syncs             = createSyncs(divH);
    divH.appendChild( document.createElement('br') );

    var sizeSel           = createSize(divH);
    divH.appendChild( document.createElement('br') );
}


function createSyncs(div) {
    var span = div.appendChild( document.createElement('span') );
    span.style.display = "inline-block";



    var lblS  = document.createElement('label');
    lblS.innerHTML = '<b>Synchronize</b> ';
    span.appendChild( lblS );

    var chkS = span.appendChild(document.createElement('input'));
    chkS.id      = 'sync'   ;
    chkS.alt     = 'Synchronize Movement';
    chkS.type    = 'checkbox';
    chkS.onclick = function(e) { console.log('saving'); saveOpt('sync'   , chkS.checked); };
    chkS.checked = getOpt('sync'   , 'true') == 'true';




    var lblX  = document.createElement('label');
    lblX.innerHTML = '<b>Resize X</b> ';
    span.appendChild( lblX );

    var chkX     = span.appendChild( document.createElement('input') );
    chkX.id      = 'resizeX';
    chkX.alt     = 'Resize X'            ;
    chkX.type    = 'checkbox';
    chkX.onclick = function(e) { saveOpt('resizeX', chkX.checked) };
    chkX.checked = getOpt('resizeX', 'true') == 'true';




    var lblY  = document.createElement('label');
    lblY.innerHTML = '<b>Resize Y</b> ';
    span.appendChild( lblY );

    var chkY     = span.appendChild( document.createElement('input') );
    chkY.id      = 'resizeY';
    chkY.alt     = 'Resize Y'            ;
    chkY.type    = 'checkbox';
    chkY.onclick = function(e) { saveOpt('resizeY', chkY.checked) };
    chkY.checked = getOpt('resizeY', 'true') == 'true';

}


function saveOpt (k ,v) {
    if ( hasstorage ) {
		console.log('saving k "' + k + '" v "' + v + '"');
        localStorage[k] = v;
    }
}


function getOpt(k, d) {
    if ( hasstorage ) {
		//console.log('getting ' + k);
        try {
            var res = localStorage[k];
			//console.log('getting ' + k + ' val "' + res + '"');
			if ( res === undefined || res === null ) {
				console.log('getting ' + k + ' val "' + res + '" returning default "' + d + '"');
				return d;
			} else {
				console.log('getting ' + k + ' val "' + res + '"');
				return res;
			}
        } catch (e) {
            return d;
        }
    } else {
        return d;
    }
}


function createSize(div) {
    var sizeSel         = div.appendChild(  document.createElement("select") );
        sizeSel.id      = 'size';
        sizeSel.alt     = 'Select Graphic Size';

    var val = getOpt('size', null);

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


function clearPics(){
	console.log('cleaning');
	console.log(graphdb);
	graphdb.clear();
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
    //var spps     = ['solanum arcanum', 'solanum habrochaites', 'solanum lycopersicum heinz denovo', 'solanum pennellii'];
    //var chroms   = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
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
        "uid"       : uid,
		"chartClass": reg.size,
		//"chartClass": 'chartpart',
        "xmin"      : reg.xmin,
        "xmax"      : reg.xmax,
        "ymin"      : reg.ymin,
        "ymax"      : reg.ymax,
        "xlabel"    : reg.xlabel,
        "ylabel"    : reg.ylabel,
        "title"     : reg.title,
        "points"    : reg.points,
        "scaffs"    : reg.scaffs,
        "xTicks"    : 5,
        "yTicks"    : 5,
        "padding"   : { 'left': [120, 45] },
        "ylabelDy"  : "-3.3em",
        //"labelId"   : "pos"
		'tipId'     : "tipper"
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


function getFieldValue(fieldId) {
	var field = document.getElementById( fieldId );
    var val   = null;

    if ( field.localName == 'select' ) {
        val = field.options[ field.selectedIndex ].value;
    } else {
        val = field.value;
    }

    if (val=='null') {
        val = null;
    }

    return val;
}


function getVals(){
    var vals = {};

    var uid  = '';

    for ( var optName in opts ) {
		var opt      = opts[optName];
        var optVar   = opt[0];
        var optLabel = opt[1];

        var val      = getFieldValue( optName );

        if ( val === null ) {
            return;
        }

        //console.log( 'appending '+optName+' = '+val );
        vals[ optName ] = val;
        uid += val;
    }

    return vals;
}


function getRegister( gvals ){
	var evals    = new Array();
	var refs     = new Array();
	var chroms   = new Array();
	var spps     = new Array();
	var statuses = new Array();

	if (gvals.ref == '*all*') {
		opts.ref[0].map( function(ref) {
			refs.push( ref );
		});
	} else {
		refs.push( gvals.ref );
	}

	if (gvals.chrom == '*all*') {
		opts.chrom[0].map( function(chrom) {
			chroms.push( chrom );
		});
	} else {
		chroms.push( gvals.chrom );
	}

	if (gvals.spp == '*all*') {
		opts.spp[0].map( function(spp) {
			spps.push( spp );
		});
	} else {
		spps.push( gvals.spp );
	}

	if (gvals.status == '*all*') {
		opts.status[0].map( function(status) {
			statuses.push( status );
		});
	} else {
		statuses.push( gvals.status );
	}


	refs.map( function(ref) {
		chroms.map( function(chrom) {
			spps.map( function(spp) {
				statuses.map( function(status) {
					//console.log(ref + ' ' + chrom + ' ' + spp + ' ' + status);
					var reg = {
						ref   : ref,
						chrom : chrom,
						spp   : spp,
						status: status
					};
					evals.push( reg );
				});
			});
		});
	});

	//console.log( evals );

	var regs = [];

	evals.map( function(vals) {
		try {
			var reg = filelist[ vals.ref ][ vals.chrom ][ vals.spp ][ vals.status ];
			//console.log( reg );

			var uid = vals.ref + vals.chrom + vals.spp + vals.status;
				uid = uid.replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '');

			reg['uid'     ] = uid;
			reg['filepath'] = datafolder + reg.filename;
			reg['scriptid'] = 'script_'  + reg.uid;
            reg['ref'     ] = vals.ref;
            reg['chrom'   ] = vals.chrom;
            reg['spp'     ] = vals.spp;
            reg['status'  ] = vals.status;
            reg['size'    ] = getFieldValue('size');
			regs.push( reg );
		}
		catch(err) {
			console.error('combination does not exists for:')
			console.error( vals );
			//return;
		}
	});

	return regs;
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

    var regs  = getRegister( vals );
    if ( regs.length == 0 ) {
        console.log('no reg');
        return;
    }

	var count = 0;
	regs.map( function(reg) {
		var file = reg[ 'filename' ];
		if (!file) {
			console.log('no filename');
		} else {
			setTimeout( function() { loadScript( reg ); }, (Math.pow(1.5, count) * 100));
			count += 1;
		}
	});
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
  options.closeIconMaxSize    ||  30;
  options.padlockIconMaxSize  ||  30;
  options.compassMaxSize      || 300;
  options.compassMinSize      || 100;

*/
