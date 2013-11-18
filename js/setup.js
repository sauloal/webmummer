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


function loadScript( uid, reg ){
    var file     = reg[ 'filename' ];
    var filename = datafolder + file;

    // Adding the script tag to the head as suggested before
    var callback = function() { loadGraph(uid, reg) };
    //var head     = document.getElementsByTagName('head')[0];
    var script   = document.createElement('script');
    script.type  = 'text/javascript';
    script.src   = filename;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload             = callback;

    // Fire the loading
    var holder = document.getElementById('scriptholder');
    while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
    }

    holder.appendChild( script );
}


function loadGraph( uid, reg ) {
    var holder = document.getElementById('scriptholder');

    while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
    }

    document.getElementById(chartName).innerHTML = '';

    document.body.addEventListener('d3createdPath', addTipsy, false);

    var graph  = new SimpleGraph(chartName, {
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

    reg['graph'] = graph;

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

    var uid = '';
    for ( var o = 0; o < opts.length; o++ ) {
        var opt = opts[o];
        var val = $('#'+opt[1]+' option:selected').first().attr( 'value' );
        if (!val) {
            console.log( 'no ' + opt[1] + ' selected' );
            return;
        }
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
        return;
    }

    //console.log( vals );

    var reg  = getRegister( vals );
    if (!reg) {
        return;
    }

    var file = reg[ 'filename' ];
    if (!file) {
        return;
    }

    var uid = vals.uid;
    $('#'+chartName).html('loading ' + obj2str(vals) );
    $('#'+chartName).attr("tabindex", -1).focus();

    loadScript( uid, reg );
}


function basename(path) {
    return path.replace(/\\/g,'/').replace( /.*\//, '' );
}



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
*/
