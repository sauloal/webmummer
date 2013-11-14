function loadScript(url)
{
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

    $('#chart1').html('loaded');
    
    $('#chart1').html('');

    graph  = new SimpleGraph("chart1", {
        "xmin"    : xmin,
        "xmax"    : xmax,
        "ymin"    : ymin,
        "ymax"    : ymax,
        "xlabel"  : xlabel,
        "ylabel"  : ylabel,
        "title"   : title,
        "points"  : points,
        "xTicks"  : 5,
        "padding" : { 'left': [120, 45] },
        "ylabelDy": "-3.3em"
    });
}

function selclick(){
    var sel = $('#selector option:selected').first();
    var val = $(sel).attr( 'value' );
    console.log( val );
    //loadScript("data2.js");
    $('#chart1').html('loading ' + val );
    loadScript( val );
}

function basename(path) {
    return path.replace(/\\/g,'/').replace( /.*\//, '' );
}

$( document ).ready(function() {
    $('#chart1').html( 'please select' );

    var sel = $("<select>")
        .attr('id', 'selector')
        .change( selclick );

    var op = $('<option>')
        .attr('value', null)
        .html( 'Please select:' )
        .appendTo( sel );

    for (var f = 0; f< filelist.length; f++) {
        var fn = filelist[f];
        var op = $('<option>')
            .attr('value', fn)
            .html( basename(fn) );
        sel.append(op);
    }

    $('body').prepend( sel );
});


/*
options.xmax           || 30;
options.xmin           ||  0;
options.ymax           || 10;
options.ymin           ||  0;
options.points         ||  [ [{x:  0,   y:   0}, {x:   0,   y:   0}, {n: 'n'  , s: 'f', q:0.0}] ];
options.xTicks         || 10;
options.yTicks         || 10;
options.split          || 30;
options.padding        || {};
options.padding.top    || [40, 20];
options.padding.right  || [30, 30];
options.padding.bottom || [60, 10];
options.padding.left   || [70, 45];
options.xlabelDx       || "0em";
options.xlabelDy       || "+2.3em";
options.ylabelX        || 0;
options.ylabelY        || 0;
options.ylabelDx       || "0em";
options.ylabelDy       || "-2.3em";
*/
