var datafolder = 'data/';
var chartName  = 'chart1';


$( document ).ready(function() {
    $('#chart1').html( 'please select' );

    var sel = genSelectors();
    var okb = $('<button>')
                .click( selclick )
                .html( 'view' );

    var pos = $('<label>').attr('id', 'pos');
    var hlp = $('<label>').html( '<b>[+/ScrUp]</b> Zoom In <b>[-/ScrDw]</b> Zoom Out <b>[Arrow keys]</b> Move <b>[0]</b> Reset - ');

    $('body').prepend( pos );
    $('body').prepend( hlp );
    $('body').prepend( okb );
    $('body').prepend( sel );

    for ( var o = 0; o < opts.length; o++ ) {
        var opt = opts[o];
        var val = $('#'+opt[1]).children().last().attr('selected', 'selected');
    }

    okb.trigger('click');
});


var opts   = [
    [ refs    , 'ref'   , 'Select Reference'  ],
    [ chroms  , 'chrom' , 'Select Chromosome' ],
    [ spps    , 'spp'   , 'Select Species'    ],
    [ statuses, 'status', 'Select Status'     ],
];


function genOpts(obj){
    var opts = [];
    for ( var o = 0; o < obj.length; o++ ){
        var opt = obj[ o ];

        var op  = $('<option>')
            .attr('value', opt)
            .html( opt );

        opts[ opts.length ] = op;
    }

    return opts;
}


function genSelectors(){
    //var statuses = ['Clean & Filtered Dot Plot. Only Inversions', 'Clean Dot Plot'];
    //var spps     = ['solanum arcanum', 'solanum habrochaites', 'solanum lycopersicum heinz denovo', 'solanum pennellii'];
    //var chroms   = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    //var refs     = ['solanum lycopersicum heinz'];
    //var filelist = {

    var sels   = [];

    for ( var o = 0; o < opts.length; o++ ) {
        var opt = opts[o];
        var $refOp = $('<option>')
            .attr('value', null)
            .html( opt[2] );

        var $refSel = $("<select>")
            .attr('id', opt[1] )
            .append( $refOp )
            .append( genOpts(opt[0]) );

        sels[ sels.length ] = $refSel;
    }

    return sels;
}


function loadScript(url){
    // Adding the script tag to the head as suggested before
    var callback = loadGraph;
    //var head     = document.getElementsByTagName('head')[0];
    var script   = document.createElement('script');
    script.type  = 'text/javascript';
    script.src   = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload             = callback;

    // Fire the loading
    var holder = document.getElementById('scriptholder');
    while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
    }

    delete points;
    delete spps;

    holder.appendChild( script );
}


function loadGraph() {
    var holder = document.getElementById('scriptholder');
    while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
    }

    $('#'+chartName).html('loaded');

    $('#'+chartName).html('');

    graph  = new SimpleGraph(chartName, {
        "xmin"    : xmin,
        "xmax"    : xmax,
        "ymin"    : ymin,
        "ymax"    : ymax,
        "xlabel"  : xlabel,
        "ylabel"  : ylabel,
        "title"   : title,
        "points"  : points,
        "xTicks"  : 5,
        "yTicks"  : 5,
        "padding" : { 'left': [120, 45] },
        "ylabelDy": "-3.3em",
        "labelId" : "pos"
    });
}


function getVals(){
    var vals = {};

    for ( var o = 0; o < opts.length; o++ ) {
        var opt = opts[o];
        var val = $('#'+opt[1]+' option:selected').first().attr( 'value' );
        if (!val) {
            console.log( 'no ' + opt[1] + ' selected' );
            return;
        }
        vals[opt[1]] = val;
    }

    return vals;
}

function getRegister( vals ){
    try {
        var file = filelist[ vals['ref'] ][ vals['chrom'] ][ vals['spp'] ][ vals['status'] ];
        console.log( file );
        return file;
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
        return;
    }

    console.log( vals );

    var file = getRegister( vals );
    if (!file) {
        return;
    }

    var filename = datafolder + file;

    $('#'+chartName).html('loading ' + obj2str(vals) );
    $('#'+chartName).attr("tabindex", -1).focus();

    loadScript( filename );
}

function basename(path) {
    return path.replace(/\\/g,'/').replace( /.*\//, '' );
}



/*
  options                || {};
  options.labelId        || null;
  options.xmax           || 30;
  options.xmin           ||  0;
  options.ymax           || 10;
  options.ymin           ||  0;
                            //              from spps
                            //                  f/r
                            //  x1 y1 x2 y2 spp 0/1 q
  options.points         ||  [ [0 ,0, 0, 0, 0,  0,  0.0] ];
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
*/
