//http://bl.ocks.org/stepheneb/1182434
function toFixed(value, precision) {
    //http://stackoverflow.com/questions/2221167/javascript-formatting-a-rounded-number-to-n-decimals/2909252#2909252
    var precision = precision || 0,
    neg      = value < 0,
    power    = Math.pow(10, precision),
    value    = Math.round(value * power),
    integral = String((neg ? Math.ceil : Math.floor)(value / power)),
    fraction = String((neg ? -value : value) % power),
    padding  = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

    return precision ? integral + '.' +  padding + fraction : integral;
};





//http://stackoverflow.com/questions/446892/how-to-find-event-listeners-on-a-dom-node/447106#447106
// keeps all event listeners attached to element
//function reportIn(e){
//    var a = this.lastListenerInfo[this.lastListenerInfo.length-1];
//    console.log(a)
//}
//
//
//  plot.realAddEventListener = plot.addEventListener;
//
//  plot.addEventListener = function(a,b,c){
//      //plot.realAddEventListener(a,reportIn,c);
//      plot.realAddEventListener(a,b,c);
//      if(!this.lastListenerInfo){  this.lastListenerInfo = {}};
//      this.lastListenerInfo[a] = [b,c];
//  };

//document.realAddEventListener = document.addEventListener;
//
//document.addEventListener = function(a,b,c){
//    document.realAddEventListener(a,reportIn,c);
//    document.realAddEventListener(a,b,c);
//    if(!this.lastListenerInfo){  this.lastListenerInfo = new Array()};
//    this.lastListenerInfo.push({a : a, b : b , c : c});
//};








// register keyboard events
registerKeyboardHandler = function(callback) {
  var callback = callback;
  d3.select(window).on("keydown", callback);
};


d3.selection.prototype.size = function(){
    var n = 0;
    this.each( function() { ++n; } );
    return n;
};







/////////////////////////////////////
// SyncSimpleGraph
/////////////////////////////////////
SyncSimpleGraph = function (sync) {
    var self   = this;
    this.sync  = sync;
    this.db    = {};
    this.props = {
        minX      : Number.MAX_VALUE,
        maxX      : 0,
        minY      : Number.MAX_VALUE,
        maxY      : 0,
    }

    document.body.addEventListener('d3zoom' , function(e) { self.d3zoomed( e ) }, false);
    document.body.addEventListener('d3close', function(e) { self.d3closed( e ) }, false);
};



//
// SimpleGraph methods
//
SyncSimpleGraph.prototype.shouldSync = function() {
    //console.log( typeof(this.sync) );

    if (typeof(this.sync) === 'function') {
        return this.sync();
    }
    else if (typeof(this.sync) === 'boolean') {
        this.shouldSync = function() { return true; };
        return true;
    }
};




SyncSimpleGraph.prototype.add = function(chartHolder, options) {
    var uid  = options.uid || 'uid_' + new Date();
    var self = this;

    this.props.minX = this.props.minX > options.xmin ? options.xmin : this.props.minX;
    this.props.minY = this.props.minY > options.ymin ? options.ymin : this.props.minY;
    this.props.maxX = this.props.maxX < options.xmax ? options.xmax : this.props.maxX;
    this.props.maxY = this.props.maxY < options.ymax ? options.ymax : this.props.maxY;

    options.xmin = this.props.minX;
    //options.ymin = this.props.minY;
    options.xmax = this.props.maxX;
    //options.ymax = this.props.maxY;

    console.log( 'creating ' + uid );

    this.deleteUid(uid);


    console.log( 'calling  ' + uid );


    if ( this.shouldSync() ) {
        console.log( 'syncing ' + uid );

        if ( Object.keys(this.db).length > 1 ) {
            for ( var dbuid in self.db ) {
                if (uid == dbuid) { continue; }
                var obj2 = self.db[dbuid];
                obj2.options.xmin = self.props.minX;
                //obj2.options.ymin = self.props.minY;
                obj2.options.xmax = self.props.maxX;
                //obj2.options.ymax = self.props.maxY;
                obj2.draw();
            }
        }
    }

    this.db[ uid ] = new SimpleGraph(chartHolder, options);
};




SyncSimpleGraph.prototype.d3zoomed = function (e) {
    var self = this;
    var obj  = e.detail.self;
    var el   = e.detail.el;
    var uid  = obj.uid;

    console.log(uid+' zoomed ');
    console.log(el);

    if ( Object.keys(this.db).length > 1 ) {
        console.log('more than one graph');
        for ( var dbuid in self.db ) {
            if (uid == dbuid) { continue; }

            console.log( 'syncing ' + dbuid + ' to ' + uid);

            //var data = {
            //        'currScale'       : self.currScale,
            //        'currTranslationX': self.currTranslationX,
            //        'currTranslationY': self.currTranslationY,
            //        'scale'           : scale,
            //        'translationX'    : translationX,
            //        'translationY'    : translationY,
            //        'reset'           : reset
            //    };

            var obj2        = this.db[dbuid];

            obj2.syncing = true;
            if ( el.reset ) {
                obj2.reset();
            } else {
                obj2.applyZoom( el.scale, el.translationX, el.translationY );
            }
            obj2.syncing = false;
        }
    } else {
        console.log('only one graph');
        console.log(Object.keys(this.db).length);
    }
};




SyncSimpleGraph.prototype.deleteUid = function (uid) {
    if (this.db[uid]) {
        console.log('has uid '+this.db.uid);
        var el = this.db[uid];
        el.close();
        delete this.db[uid];
        console.log(this.db);
    } else {
        console.log('uid '+uid+' not present');
    }
};




SyncSimpleGraph.prototype.d3closed = function (e) {
    var obj = e.detail.self;
    var uid = obj.uid;

    console.log( uid+' closed' );

    this.deleteUid( uid );
};








/////////////////////////////////////
// SimpleGraph
/////////////////////////////////////



SimpleGraph = function (chartHolder, options) {
    var self                         = this;
    this.uid                         = options.uid                 || 'uid_' + new Date();

    this.options                     = options                     || {};

    this.elemid                      = 'div_' + this.uid;

    console.log(' adding '+this.elemid+' to ' + chartHolder );

    this.chartHolder = document.getElementById( chartHolder );
    this.chart       = document.getElementById( this.elemid );

    if ( this.chart ) {
        var pa = this.chart.parentElement;
        pa.removeChild( this.chart );
    }

    this.chart                       = document.createElement('div');
    this.chart.id                    = this.elemid;
    this.chart.className             = 'chart chartpart';
    this.chart.tabindex              = -1;

    this.chartHolder.appendChild( this.chart );

    this.chart                       = document.getElementById( this.elemid );

    this.scaffs                      = options.scaffs              || null;
                                                                   //              from scaffs
                                                                   //                   f/r
                                                                   //  x1   y1 x2 y2 scaf 0/1 q
    this.points                      = options.points              ||  [0 , 0, 0, 0, 0,   0,  0.0];

    this.options.labelId             = options.labelId             || null;

    this.options.xlabel              = options.xlabel              || 'x';
    this.options.ylabel              = options.ylabel              || 'y';
    this.options.title               = options.title               || 'no title';

    this.options.xmax                = options.xmax                || 30;
    this.options.xmin                = options.xmin                ||  0;
    this.options.ymax                = options.ymax                || 10;
    this.options.ymin                = options.ymin                ||  0;
    this.options.xTicks              = options.xTicks              || 10;
    this.options.yTicks              = options.yTicks              || 10;
    this.options.split               = options.split               || 30;
    this.options.padding             = options.padding             || {};
    this.options.padding.top         = options.padding.top         || [40, 20];
    this.options.padding.right       = options.padding.right       || [30, 30];
    this.options.padding.bottom      = options.padding.bottom      || [60, 10];
    this.options.padding.left        = options.padding.left        || [70, 45];
    this.options.titleDx             = options.titleDx             || "-0.8em";
    this.options.xNumbersDy          = options.xNumbersDy          || "1em";
    this.options.yNumbersDy          = options.yNumbersDy          || "0.35em";
    this.options.xlabelDx            = options.xlabelDx            || "0em";
    this.options.xlabelDy            = options.xlabelDy            || "+2.3em";
    this.options.ylabelX             = options.ylabelX             || 0;
    this.options.ylabelY             = options.ylabelY             || 0;
    this.options.ylabelDx            = options.ylabelDx            || "0em";
    this.options.ylabelDy            = options.ylabelDy            || "-2.3em";
    this.options.downloadIconMaxSize = options.downloadIconMaxSize ||  30;
    this.options.closeIconMaxSize    = options.closeIconMaxSize    ||  30;
    this.options.compassMaxSize      = options.compassMaxSize      ||  75;
    this.options.compassMinSize      = options.compassMinSize      ||  20;
    //this.options.radius         = options.radius         || 5.0;

    this.syncing = false;

    this.regSize = 7;
    this.numRegs = (this.points.length / this.regSize);
    console.log("num vals " + this.points.length);
    console.log("num regs " + this.numRegs);

    this.draw();
};





//
// SimpleGraph methods
//
SimpleGraph.prototype.draw = function() {
    var self = this;
    this.cx  = this.chart.clientWidth;
    this.cy  = this.chart.clientHeight;

    this.chart.innerHTML = '';

    this.padding = {
        "top"   : this.options.title  ? this.options.padding.top   [0] : this.options.padding.top   [1],
        "right" :                       this.options.padding.right [0],
        "bottom": this.options.xlabel ? this.options.padding.bottom[0] : this.options.padding.bottom[1],
        "left"  : this.options.ylabel ? this.options.padding.left  [0] : this.options.padding.left  [1]
    };


    this.size = {
        "width" : this.cx - this.padding.left - this.padding.right,
        "height": this.cy - this.padding.top  - this.padding.bottom
    };


    // x-scale
    this.x = d3.scale.linear()
        .domain([this.options.xmin, this.options.xmax])
        .range( [0                , this.size.width  ]);


    // drag x-axis logic
    this.downx = Math.NaN;






  // y-scale (inverted domain)
    this.y     = d3.scale.linear()
        .domain([this.options.ymax, this.options.ymin])
        .nice()
        .range([0, this.size.height])
        .nice();

    // drag y-axis logic
    this.downy    = Math.NaN;


    this.dragged  = this.selected = null;


    this.line     = d3.svg.line()
        .x(function(d, i) { return this.x( d.x ) } )
        .y(function(d, i) { return this.y( d.y ) } );


    var xrange    = (this.options.xmax - this.options.xmin),
        yrange2   = (this.options.ymax - this.options.ymin) / 2,
        yrange4   = yrange2         /  2,
        datacount = this.size.width / this.options.split;


    this.svg = d3.select(this.chart).append("svg")
        .attr("width"    , this.cx         )
        .attr("height"   , this.cy         )
        .attr("class"    , "svgmain"       )
        .attr("uid"      , this.uid);


    this.vis = this.svg.append("g")
        .attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")")
        .attr("class"    , "gvis");


    this.plot = this.vis.append("rect")
        .attr( "class"          , 'matrix'          )
        .attr( 'id'             , 'rect_'+this.uid )
        .attr( "width"          , this.size.width   )
        .attr( "height"         , this.size.height  )
        .attr( "pointer-events" , "all"             )
        .on(   "mousedown.drag" , self.plot_drag()  )
        .on(   "touchstart.drag", self.plot_drag()  );

    this.zoom  = d3.behavior.zoom();


    this.plot.call(this.zoom.x(this.x).y(this.y).on("zoom", this.redraw()));


    // add Chart Title
    if (this.options.title) {
        this.vis.append("text")
            .attr("class", "axis title"        )
            .attr("x"    , this.size.width/2   )
            .attr("dy"   , this.options.titleDx)
            .style("text-anchor","middle"      )
            .text(this.options.title           );
    }


    // Add the x-axis label
    if (this.options.xlabel) {
        this.vis.append("text")
            .attr("class", "axis xlabel"     )
            .attr("x" , this.size.width/2    )
            .attr("y" , this.size.height     )
            .attr("dx", this.options.xlabelDx)
            .attr("dy", this.options.xlabelDy)
            .style("text-anchor","middle"    )
            .text(this.options.xlabel        );
    }


    // add y-axis label
    if (this.options.ylabel) {
        this.vis.append("text")
            .attr("class"       , "axis ylabel"         )
            .attr("x"           , this.options.ylabelX  )
            .attr("y"           , this.options.ylabelY  )
            .attr("dy"          , this.options.ylabelDy )
            .attr("dx"          , this.options.ylabelDx )
            .style("text-anchor","middle"               )
            .attr("transform"   ,"translate(" + -40 + " " + this.size.height/2+") rotate(-90)")
            .text(this.options.ylabel                   );
    }

    this.btns = this.svg.append("g")
        .attr('class', 'gbtns')
            //.attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")");
    ;

    this.lines = this.vis.append("g")
        .attr("class", 'glines');

    d3.select(this.chart)
        .on("mousemove.drag", self.mousemove())
        .on("touchmove.drag", self.mousemove())
        .on("mouseup.drag",   self.mouseup()  )
        .on("touchend.drag",  self.mouseup()  );

    this.currScale        = 1;
    this.currTranslationX = 0;
    this.currTranslationY = 0;

    this.addCompass();

    this.addDownloadIcon();

    this.addCloseIcon();

    this.redraw()();

    this.chart.focus();
};




SimpleGraph.prototype.update = function() {
    var self   = this;
    //var coords = [];

    var lines = this.vis.selectAll("svg[uid="+self.uid+"] .points");

    if ( lines.size() === 0 ) {
        for (var j = 0; j < self.numRegs; j++) {
            var vars       = self.parsepoint( j );

            var sense      =      vars.sense;
            var stVal      = { x: vars.x1, y: vars.y1, j: j, s: sense};
            var ndVal      = { x: vars.x2, y: vars.y2, j: j, s: sense};

            var line       = self.line( [ stVal, ndVal ] );

            var senseclass = sense ? 'points-r' : 'points-f';

            self.lines.append( "path" )
                        .attr("class"    , "points " + senseclass                          )
                        .attr("d"        , line                                            )
                        .attr("j"        , j                                               )
                        .attr("scaf"     , vars.nameNum                                    )
                        .on(  "mouseover", function(d) { self.highlight( this          ); })
                        .on(  "mouseout" , function(d) { self.downlight( this          ); })
                        ;

            //coords[ coords.length ] = stVal;
            //coords[ coords.length ] = ndVal;
        }


        self.vis.selectAll("svg[uid="+self.uid+"] .points").each( function(d, i){
            //var j    = this.getAttribute('j');
            var d3eventPath = new CustomEvent(
                "d3createdPath",
                {
                    detail: {
                        message: 'd3 has created an path element',
                        self   : self,
                        el     : this,
                        time   : new Date()
                    },
                    bubbles   : true,
                    cancelable: true
                }
            );
            this.dispatchEvent( d3eventPath );
        });

    } else {
        lines.each( function(d, i){
            var point      = this;
            var j          = point.getAttribute('j');
            var vars       = self.parsepoint( j );

            var stVal      = { x: vars.x1, y: vars.y1, j: j, s: sense};
            var ndVal      = { x: vars.x2, y: vars.y2, j: j, s: sense};

            var line       = self.line( [ stVal, ndVal ] );

            point.setAttribute('d', line);
        });
    }





    //return;

    //var circle = this.vis.select("svg").selectAll("circle")
    //    .data(coords,  function(d) { return d; });
    //
    //
    //circle
    //    .attr("class", function(d) { return d === self.selected ? "selected" : null; })
    //    .attr("cx",    function(d) { return self.x( d.x ); })
    //    .attr("cy",    function(d) { return self.y( d.y ); })
    //    .attr("j" ,    function(d) { return         d.j  ; })
    //    .attr("sense", function(d) { return         d.s  ; })
    //    ;
    //
    //
    //circle.enter().append("circle")
    //    .attr("class", function(d) { return d === self.selected ? "selected" : null; })
    //    .attr("cx",    function(d) { return self.x( d.x ); })
    //    .attr("cy",    function(d) { return self.y( d.y ); })
    //    .attr("j" ,    function(d) { return         d.j  ; })
    //    .attr("r", self.options.radius)
    //    //.on("mousedown.drag",  self.datapoint_drag())
    //    //.on("touchstart.drag", self.datapoint_drag())
    //    ;
        //.style("cursor", "ns-resize")
    //
    //
    //circle.exit().remove();
    //
    //

    if (d3.event && d3.event.keyCode) {
        d3.event.preventDefault();
        d3.event.stopPropagation();
    }

    self.updatePos( );
};




SimpleGraph.prototype.downlight = function( el ) {
    var self = this;
    d3.select(el).classed( "scaf-highlight", false );
    self.vis.selectAll('.scaf-square').remove();
};




SimpleGraph.prototype.highlight = function( el ) {
    var del = d3.select(el);
    del.classed( "scaf-highlight", true );

    var self      = this;
    var nameNum   = del.attr('scaf');
    var minX      = Number.MAX_VALUE;
    var maxX      = 0;
    var minY      = Number.MAX_VALUE;
    var maxY      = 0;
    var scafLines = self.vis.selectAll(".points[scaf='"+nameNum+"']");

    scafLines.each( function(d, i){
        var j    = this.getAttribute('j');
        var vars = self.parsepoint( j );
        var x1   = self.x( vars.x1 );
        var x2   = self.x( vars.x2 );
        var y1   = self.y( vars.y1 );
        var y2   = self.y( vars.y2 );

        minX = x1 < minX ? x1 : minX;
        minX = x2 < minX ? x2 : minX;
        minY = y1 < minY ? y1 : minY;
        minY = y2 < minY ? y2 : minY;

        maxX = x1 > maxX ? x1 : maxX;
        maxX = x2 > maxX ? x2 : maxX;
        maxY = y1 > maxY ? y1 : maxY;
        maxY = y2 > maxY ? y2 : maxY;
    });

    var lenX = maxX - minX;
    var lenY = maxY - minY;

    //var lenX = Math.round( ( maxX - minX )*1.1 );
    //var lenY = Math.round( ( maxY - minY )*1.1 );
    //minY = Math.round(minY * 0.95);
    //minX = Math.round(minX * 0.95);


    //console.log("");
    //console.log("X min " + minX + ' max ' + maxX);
    //console.log("Y min " + minY + ' max ' + maxY);
    //console.log("len X " + lenX + ' Y ' + lenY);
    //console.log("cx " + minX + " cy " + minY + ' width ' + lenX + ' heigth ' + lenY);

    this.vis.append("rect")
      .attr( "class"  , 'scaf-square')
      .attr( "x"      , minX         )
      .attr( "y"      , minY         )
      .attr( "width"  , lenX         )
      .attr( "height" , lenY         );
};




SimpleGraph.prototype.getSppName = function(k){
    if (this.scaffs) {
        return this.scaffs[ k ];
    }
    else {
        return 'NaN';
    }
};




SimpleGraph.prototype.parsepoint = function(j) {
    var startPos = j * this.regSize;
    var point    = this.points.slice( startPos, startPos+this.regSize );

    var res     = {
        x1      :       point[0],
        y1      :       point[1],
        x2      :       point[2],
        y2      :       point[3],
        nameNum :       point[4],
        name    : this.getSppName( point[4] ),
        sense   :       point[5],
        senseStr:       point[5] === 0 ? 'fwd' : 'rev',
        qual    :       point[6]
    };

    return res;
};




SimpleGraph.prototype.genTip = function (j) {
    var vars  = this.parsepoint( j );
    var res   = '<b>Scaf:</b> '         + vars.name     +
                '<br><b>Sense:</b> '    + vars.senseStr +
                '<br><b>Ref Pos:</b> '  + vars.x1       + '-' + vars.x2 +
                '<br><b>Scaf Pos:</b> ' + vars.y1       + '-' + vars.y2 +
                '<br><b>Qual:</b> '     + vars.qual;
    return res;
};




SimpleGraph.prototype.plot_drag = function() {
    var self = this;
    return function() {
        registerKeyboardHandler(self.keydown());

        d3.select('body').style("cursor", "move");

        if (d3.event.altKey) {
            var p        = d3.mouse(self.vis.node());
            var newpoint = {};
            newpoint.x   = self.x.invert(Math.max(0, Math.min(self.size.width,  p[0])));
            newpoint.y   = self.y.invert(Math.max(0, Math.min(self.size.height, p[1])));
            self.points.push(newpoint);
            self.points.sort(function(a, b) {
              if (a.x < b.x) { return -1; }
              if (a.x > b.x) { return  1; }
              return 0;
            });
            self.selected = newpoint;
            self.update();
            d3.event.preventDefault();
            d3.event.stopPropagation();
        }
    };
};




SimpleGraph.prototype.updatePos = function(){
    if (this.options.labelId){

        var text   = ' - <b>Zoom:</b> ' + toFixed(this.currScale,1) + 'X - ';
            text  += '<b>Pos:</b> <i>min X</i> '  + Math.floor(this.x.invert(this.currTranslationX)) + ' <i>max Y</i> ' + Math.floor(this.y.invert(this.currTranslationY));

        document.getElementById(this.options.labelId).innerHTML = text;
    }
};




SimpleGraph.prototype.datapoint_drag = function() {
    var self = this;
    return function(d) {
        registerKeyboardHandler(self.keydown());
        document.onselectstart = function() { return false; };
        self.selected          = self.dragged = d;
        self.update();
    };
};




SimpleGraph.prototype.mousemove = function() {
    var self = this;
    return function() {
        var p = d3.mouse(self.vis[0][0]),
            t = d3.event.changedTouches;

        if (self.dragged) {
            self.dragged.y = self.y.invert(Math.max(0, Math.min(self.size.height, p[1])));
            self.update();
        }


        if (!isNaN(self.downx)) {
            d3.select('body').style("cursor", "ew-resize");
            var rupx   = self.x.invert(p[0]),
                xaxis1 = self.x.domain()[0],
                xaxis2 = self.x.domain()[1],
                xextent = xaxis2 - xaxis1;

            if (rupx !== 0) {
              var changex, new_domain;
              changex    = self.downx / rupx;
              new_domain = [xaxis1, xaxis1 + (xextent * changex)];
              self.x.domain(new_domain);
              self.redraw()();
            }
            d3.event.preventDefault();
            d3.event.stopPropagation();
        }

        if (!isNaN(self.downy)) {
            d3.select('body').style("cursor", "ns-resize");
            var rupy    = self.y.invert(p[1]),
                yaxis1  = self.y.domain()[1],
                yaxis2  = self.y.domain()[0],
                yextent = yaxis2 - yaxis1;

            if (rupy !== 0) {
                var changey, new_domain;
                changey    = self.downy / rupy;
                new_domain = [yaxis1 + (yextent * changey), yaxis1];
                self.y.domain(new_domain);
                self.redraw()();
            }

            d3.event.preventDefault();
            d3.event.stopPropagation();
        }
    };
};




SimpleGraph.prototype.mouseup = function() {
    var self = this;
    return function() {
        document.onselectstart = function() { return true; };
        d3.select('body').style("cursor", "auto");
        d3.select('body').style("cursor", "auto");

        if (!isNaN(self.downx)) {
            self.redraw()();
            self.downx = Math.NaN;
            d3.event.preventDefault();
            d3.event.stopPropagation();
        }

        if (!isNaN(self.downy)) {
            self.redraw()();
            self.downy = Math.NaN;
            d3.event.preventDefault();
            d3.event.stopPropagation();
        }

        if (self.dragged) {
            self.dragged = null;
        }
    }
};




SimpleGraph.prototype.keydown = function() {
  var self = this;
  return function() {
    var keyPressed = d3.event.keyCode;
    if (self.selected) {
      switch (keyPressed) {
        case  8: // backspace
        case 46: // delete
          var i = self.points.indexOf(self.selected);
          self.points.splice(i, 1);
          self.selected = self.points.length ? self.points[i > 0 ? i - 1 : 0] : null;
          self.update();
          break;
      }
    } else { // nothing selected. global movement
      var valPressed = null;
      switch (keyPressed) {
        case  37:  // left
            valPressed = 'l'; break;
        case  108: // left (Numkey)
            valPressed = 'l'; break;
        case  38:  // top
            valPressed = 't'; break;
        case  104: // top (Numkey)
            valPressed = 't'; break;
        case  39:  // right
            valPressed = 'r'; break;
        case  102: // right (Numkey)
            valPressed = 'r'; break;
        case  40:  // bottom
            valPressed = 'b'; break;
        case  98:  // bottom (Numkey)
            valPressed = 'b'; break;
        case  187: // plus
            valPressed = '+'; break;
        case  107: // plus (Numkey)
            valPressed = '+'; break;
        case  189: // minus
            valPressed = '-'; break;
        case  109: // minus (Numkey)
            valPressed = '-'; break;
        case  48:  // zero
            valPressed = '0'; break;
        case  96:  // zero (Numkey)
            valPressed = '0'; break;
        case  82:  // zero (r)
            valPressed = '0'; break;
      }

      self.mover( valPressed );
    }
  };
};




SimpleGraph.prototype.mover = function(valPressed) {
    var self   = this;

    var blockY = Math.floor(self.size.height / 5);
    var blockX = Math.floor(self.size.width  / 5);

    switch(valPressed) {
        case  'l':   // left
            self.panIt( blockX,   0); break;
        case  'r':   // right
            self.panIt(-blockX,   0); break;
        case  't':   // top
            self.panIt(0,  blockY); break;
        case  'b':   // bottom
            self.panIt(0, -blockY); break;
        case  '+':   // plus
            self.zoomIt(1.25); break;
        case  '-':   // -
            self.zoomIt(0.75); break;
        case  '0':   // zero
            self.reset(); break;
    }
};




SimpleGraph.prototype.reset = function() {
    var self = this;
    console.log("reseting");

    self.x = d3.scale.linear()
        .domain([self.options.xmin, self.options.xmax])
        .range( [0                , self.size.width  ]);


    // y-scale (inverted domain)
    self.y     = d3.scale.linear()
        .domain([self.options.ymax, self.options.ymin])
        .nice()
        .range( [0, self.size.height])
        .nice();

    //this.currScale        = 1;
    //this.currTranslationX = 0;
    //this.currTranslationY = 0;

    self.updateCurrentZoom( 1, [0,0] );

    self.redraw()();
};




SimpleGraph.prototype.panIt = function(dx, dy){
    var self = this;
    //console.log('pan. self ' + self + ' dx ' + dx + ' dy ' + dy);
    var cTrans = self.zoom.translate();
    //console.log( 'cTrans B ' + cTrans );

    var cScale = self.zoom.scale();

    //console.log( 'dx ' + dx );
    //console.log( 'dy ' + dy );

    var px = cTrans[0];
    var py = cTrans[1];
    //console.log( 'px ' + px );
    //console.log( 'py ' + py );

    var ex = Math.floor(dx / cScale);
    var ey = Math.floor(dy / cScale);
    //console.log( 'ex ' + ex );
    //console.log( 'ey ' + ey );

    var rx = px + ex;
    var ry = py + ey;
    //console.log( 'rx ' + rx );
    //console.log( 'ry ' + ry );

    self.applyZoom( 1, rx, ry );

    //cTrans = self.zoom.translate();
    //console.log( 'cTrans A ' + cTrans );
};




SimpleGraph.prototype.zoomIt = function(z){
    //console.log( 'zoom. z ' + z )
    var self     = this;

    self.applyZoom( z, 0, 0 );
};




SimpleGraph.prototype.applyZoom = function(z, x, y){
    var self = this;
    console.log('applying zoom z: ' + z + ' x: ' + x + ' y: ' + y);

    self.plot.call( self.zoom.scale( z ).translate([ x, y ]) );

    self.redraw()();
};




SimpleGraph.prototype.redraw = function() {
  var self = this;

  return function() {
    //console.log( d3.event );

    var tx = function(d) {
      return "translate(" + self.x(d) + ",0)";
    },

    ty = function(d) {
      return "translate(0," + self.y(d) + ")";
    },


    fx = self.x.tickFormat(10),
    fy = self.y.tickFormat(10);

    // Regenerate x-ticks...
    var gx = self.vis.selectAll("g.x")
        .data(self.x.ticks(self.options.xTicks), String)
        .attr("transform", tx);

    gx.select("text")
        .text(fx);

    var gxe = gx.enter().insert("g", "a")
        .attr("class"    , "x")
        .attr("transform", tx );

    gxe.append("line")
        .attr("class" , 'grid'          )
        .attr("y1"    , 0               )
        .attr("y2"    , self.size.height);

    gxe.append("text")
        .attr("class"        , "axis x-num"           )
        .attr("y"            , self.size.height       )
        .attr("dy"           , self.options.xNumbersDy)
        .attr("text-anchor"  , "middle"               )
        .text(fx                                      )
        .style("cursor"      , "ew-resize"            )
        .on("mouseover"      , function(d) { d3.select(this).style("font-weight", "bold"  ); })
        .on("mouseout"       , function(d) { d3.select(this).style("font-weight", "normal"); })
        .on("mousedown.drag" , self.xaxis_drag())
        .on("touchstart.drag", self.xaxis_drag());

    gx.exit().remove();





    // Regenerate y-ticks...
    var gy = self.vis.selectAll("g.y")
        .data(self.y.ticks(self.options.yTicks), String)
        .attr("transform", ty);

    gy.select("text")
        .text(fy);

    var gye = gy.enter().insert("g", "a"  )
        .attr("class"          , "y"      )
        .attr("transform"      , ty       );

    gye.append("line")
        .attr("class"          , 'grid'         )
        .attr("x1"             , 0              )
        .attr("x2"             , self.size.width);

    //".35em"
    gye.append("text")
        .attr("class"          , "axis y-num"           )
        .attr("x"              , -3                     )
        .attr("dy"             , self.options.yNumbersDy)
        .attr("text-anchor"    , "end"                  )
        .text(fy                                        )
        .style("cursor"        , "ns-resize"            )
        .on("mouseover"        , function(d) { d3.select(this).style("font-weight", "bold"  );})
        .on("mouseout"         , function(d) { d3.select(this).style("font-weight", "normal");})
        .on("mousedown.drag"   , self.yaxis_drag())
        .on("touchstart.drag"  , self.yaxis_drag());

    gy.exit().remove();

    var d3e    = false;
    if ( d3.event ) {
        if (d3.event.type && d3.event.type=='zoom') {
            d3e    = true;

            var scale             = d3.event.scale;
            var translate         = d3.event.translate;

            self.updateCurrentZoom( scale, translate );
        }
    }

    if (!d3e) {
        var scale     = self.zoom.scale();
        var translate = self.zoom.translate();

        if ( (scale != 1) || (translate[0] != 0) || (translate[1] != 0) ) {
            self.updateCurrentZoom( scale, translate );
        }
    }

    self.plot.call( self.zoom.x(self.x).y(self.y).on("zoom", self.redraw()) );

    self.update();
  };
};




SimpleGraph.prototype.updateCurrentZoom = function(scale, translate) {
    var self              = this;

    var translationX      = translate[0];
    var translationY      = translate[1];

    var reset             = (scale === 1 && translationX === 0 &&  translationY === 0);

    //console.log('current scale ' + self.currScale + ' translation X ' + self.currTranslationX + ' translation Y ' + self.currTranslationY );
    //console.log('correct scale ' +          scale + ' translation X ' +          translationX + ' translation Y ' +          translationY + ' reset ' + reset);

    if ( reset ) {
        self.currScale        = 1;
        self.currTranslationX = 0;
        self.currTranslationY = 0;
    } else {
        self.currScale        = self.currScale        * scale;
        self.currTranslationX = self.currTranslationX + translationX;
        self.currTranslationY = self.currTranslationY + translationY;
    }

    //console.log('result  scale ' + self.currScale + ' translation X ' + self.currTranslationX + ' translation Y ' + self.currTranslationY );
    //console.log('\n');

    if (!self.syncing) {
        var data = {
            'currScale'       : self.currScale,
            'currTranslationX': self.currTranslationX,
            'currTranslationY': self.currTranslationY,
            'scale'           : scale,
            'translationX'    : translationX,
            'translationY'    : translationY,
            'reset'           : reset
        };

        var d3eventZoom = new CustomEvent(
            "d3zoom",
            {
                detail: {
                    message: 'd3 has zoom',
                    self   : self,
                    el     : data,
                    time   : new Date()
                },
                bubbles   : true,
                cancelable: true
            }
        );

        self.plot.each( function (d,i) { this.dispatchEvent( d3eventZoom ); } );
    }
};




SimpleGraph.prototype.xaxis_drag = function() {
  var self = this;
  return function(d) {
    document.onselectstart = function() { return false; };
    var p      = d3.mouse(self.vis[0][0]);
    self.downx = self.x.invert(p[0]);
  };
};




SimpleGraph.prototype.yaxis_drag = function(d) {
  var self = this;
  return function(d) {
    document.onselectstart = function() { return false; };
    var p      = d3.mouse(self.vis[0][0]);
    self.downy = self.y.invert(p[1]);
  };
};




SimpleGraph.prototype.download = function() {
    var self = this;
    var doctype = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
    var svg     = self.svg;

    svg.selectAll("svg[uid="+self.uid+"] .download-icon").remove();
    svg.selectAll("svg[uid="+self.uid+"] .compass-g"    ).remove();
    svg.selectAll("svg[uid="+self.uid+"] .close-icon"   ).remove();

    var styles  = self.getStyles();
    styles      = (styles === undefined) ? "" : styles;

    svg
        .attr("version", "1.1")
        .attr('id', this.options.title)
        .insert("defs", ":first-child")
            .attr("class", "svg-crowbar")
            .append("style")
                .attr("type", "text/css");

    // removing attributes so they aren't doubled up
    svg.node().removeAttribute("xmlns");
    svg.node().removeAttribute("xlink");

    // These are needed for the svg
    if (!svg.node().hasAttributeNS(d3.ns.prefix.xmlns, "xmlns")) {
        svg.node().setAttributeNS(d3.ns.prefix.xmlns, "xmlns", d3.ns.prefix.svg);
    }

    if (!svg.node().hasAttributeNS(d3.ns.prefix.xmlns, "xmlns:xlink")) {
        svg.node().setAttributeNS(d3.ns.prefix.xmlns, "xmlns:xlink", d3.ns.prefix.xlink);
    }

    var source  = (new XMLSerializer()).serializeToString(svg.node()).replace('</style>', '<![CDATA[' + styles + ']]></style>\n');
    var rect    = svg.node().getBoundingClientRect();
    var svgInfo = {
        top              : rect.top,
        left             : rect.left,
        width            : rect.width,
        height           : rect.height,
        'class'          : svg.attr("class"),
        id               : svg.attr("id"),
        childElementCount: svg.node().childElementCount,
        source           : [doctype + source]
    };

    var filename = 'image.csv';

    if (svgInfo.id) {
        filename = svgInfo.id;
    } else if (svgInfo['class']) {
        filename = svgInfo['class'];
    } else if (window.document.title) {
        filename = window.document.title.toLowerCase();
    }

    filename = filename.replace(/[^a-z0-9]/gi, '-');

    var url = window.URL.createObjectURL(new Blob(svgInfo.source, { "type" : "text\/xml" }));

    var a   = d3.select("body")
        .append('a')
            .attr( "class"   , "svg-crowbar")
            .attr( "download", filename + ".svg")
            .attr( "href"    , url)
            .style("display" , "none");

    a.node().click();

    setTimeout(function() {
        window.URL.revokeObjectURL(url);
    }, 10);

    a.remove();

    this.addCompass();

    this.addDownloadIcon();

    this.addCloseIcon();
};




SimpleGraph.prototype.getStyles = function() {
    var self        = this;
    var doc         = window.document;
    var styles      = "";
    var styleSheets = doc.styleSheets;

    if (styleSheets) {
        for (var i = 0; i < styleSheets.length; i++) {
            processStyleSheet(styleSheets[i]);
        }
    }

    function processStyleSheet(ss) {
        if (ss.cssRules) {
            for (var i = 0; i < ss.cssRules.length; i++) {
                var rule = ss.cssRules[i];
                if (rule.type === 3) {
                    // Import Rule
                    processStyleSheet(rule.styleSheet);
                } else {
                    // hack for illustrator crashing on descendent selectors
                    if (rule.selectorText) {
                        if (rule.selectorText.indexOf(">") === -1) {
                            styles += "\n" + rule.cssText;
                        }
                    }
                }
            }
        }
    }

    return styles;
};




SimpleGraph.prototype.close = function() {
    var el = document.getElementById( this.elemid );

    if ( el ) {
        console.log('has el');
        var pa = el.parentElement;

        var d3eventClose = new CustomEvent(
            "d3close",
            {
                detail: {
                    message: 'd3 has close',
                    self   : self,
                    el     : this,
                    time   : new Date()
                },
                bubbles   : true,
                cancelable: true
            }
        );

        console.log('removing child');
        pa.removeChild( el );
        console.log('dispatching event');
        pa.dispatchEvent( d3eventClose );
        console.log('leaving');
    }
};




SimpleGraph.prototype.addDownloadIcon = function() {
    //.attr("transform", "matrix(1,0,0,-1,113.89831,1293.0169)")
    //.attr("transform", "scale(0.05)")

    var self = this;

    var gW   = 300;
    var sW   = this.size.width > this.size.height ? this.size.height : this.size.width;
    var sW10 = sW * 0.025;
    if ( sW10 < this.options.downloadIconMaxSize ) {
        sW10 = this.options.downloadIconMaxSize;
    }

    var wP   = sW10 / gW;
        sW10 = gW * wP;
    var xPos = this.size.width - (3*sW10) + this.padding.right;
    var yPos = 0;

    //console.log("cx "+this.size.width+" cy "+this.size.height+" gw "+gW+" sw "+sW+" sw10 "+sW10+" wp "+wP+" xpos "+xPos+" ypos "+yPos);
    //console.log(this.options.downloadIconMaxSize);

    //var g  = this.btns
    //    .append("g"                            )
    //        .attr("class"    , 'download-icon compass-opaque')
    //        .attr("transform", "rotate(180) scale("+wP+")")
    //        //.attr("transform", "translate("+xPos+","+yPos+") rotate(180) scale("+wP+")")
    //        .on(  'click'    , function()  { self.download() } )
    //        .on(  "mouseover", function(d) { d3.select(this).classed( "compass-opaque", false ) })
    //        .on(  "mouseout" , function(d) { d3.select(this).classed( "compass-opaque", true  ) })
    //    .append("path")
    //        .attr("d", "m 1120,608 q 0,-12 -10,-24 L 791,265 q -9,-9 -23,-9 -14,0 -23,9 L 425,585 q -9,9 -9,23 0,13 9.5,22.5 9.5,9.5 22.5,9.5 h 192 v 352 q 0,13 9.5,22.5 9.5,9.5 22.5,9.5 h 192 q 13,0 22.5,-9.5 Q 896,1005 896,992 V 640 h 192 q 14,0 23,-9 9,-9 9,-23 z m 160,32 q 0,104 -40.5,198.5 Q 1199,933 1130,1002 1061,1071 966.5,1111.5 872,1152 768,1152 664,1152 569.5,1111.5 475,1071 406,1002 337,933 296.5,838.5 256,744 256,640 256,536 296.5,441.5 337,347 406,278 475,209 569.5,168.5 664,128 768,128 872,128 966.5,168.5 1061,209 1130,278 1199,347 1239.5,441.5 1280,536 1280,640 z m 256,0 Q 1536,431 1433,254.5 1330,78 1153.5,-25 977,-128 768,-128 559,-128 382.5,-25 206,78 103,254.5 0,431 0,640 0,849 103,1025.5 206,1202 382.5,1305 559,1408 768,1408 977,1408 1153.5,1305 1330,1202 1433,1025.5 1536,849 1536,640 z")
    //;



    var g1  = this.btns
            .append("g"                            )
                .attr("class"    , 'download-icon compass-opaque')
                .attr("transform", "translate("+sW10+","+(sW10/10)+") scale("+wP+")")
                .on(  'click'    , function( ) { self.download(); } )
                .on(  "mouseover", function(d) { d3.select(this).classed( "compass-opaque", false ); })
                .on(  "mouseout" , function(d) { d3.select(this).classed( "compass-opaque", true  ); });

    g1.append('path')
        .attr("style"       , "fill:#000000;fill-opacity:1;stroke:none")
        .attr("transform"   , "matrix(1.5535248,0,0,1.5535248,83.172743,0)")
        .attr("d"           , "m 139.90613,72.463142 a 96.722107,96.722107 0 1 1 -193.444216,0 96.722107,96.722107 0 1 1 193.444216,0 z");

    var g2 = g1.append('g');

    g2.append('path')
        .attr("style"       , "fill:#ffffff;fill-opacity:1;stroke:#fffffc;stroke-width:30;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none")
        .attr("transform"   , "matrix(0.92827428,0.00326311,-0.00213854,0.60836285,113.39003,55.97555)")
        .attr("d"           , "m -55.558393,104.53548 95.913655,-1.83769 95.913648,-1.83769 -46.365336,83.98251 -46.365337,83.9825 -49.5483166,-82.14482 z");

    g2.append('rect')
        .attr("style"       , "fill:#ffffff;fill-opacity:1;stroke:#fffffc;stroke-width:30;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none")
        .attr("width"       , "41.921329")
        .attr("height"      , "138.89598")
        .attr("x"           , "129.29953")
        .attr("y"           , "10.319729")
        .attr("d"           , "");

//<g
//     transform="translate(0,-752.36218)"
//     id="layer1">
//    <path
//       d="m 139.90613,72.463142 a 96.722107,96.722107 0 1 1 -193.444216,0 96.722107,96.722107 0 1 1 193.444216,0 z"
//       transform="matrix(1.5535248,0,0,1.5535248,83.172743,790.03378)"
//       id="path2985"
//       style="fill:#000000;fill-opacity:1;stroke:none" />
//  </g>
//  <g
//     id="layer2">
//    <path
//       d="m -55.558393,104.53548 95.913655,-1.83769 95.913648,-1.83769 -46.365336,83.98251 -46.365337,83.9825 -49.5483166,-82.14482 z"
//       transform="matrix(0.92827428,0.00326311,-0.00213854,0.60836285,113.39003,118.97555)"
//       id="path2990"
//       style="fill:#ffffff;fill-opacity:1;stroke:#fffffc;stroke-width:30;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none" />
//    <rect
//       width="41.921329"
//       height="138.89598"
//       x="129.29953"
//       y="29.319729"
//       id="rect3762"
//       style="fill:#ffffff;fill-opacity:1;stroke:#fffffc;stroke-width:30;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none" />
//  </g>
//

};




SimpleGraph.prototype.addCompass = function() {
        //.attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")")
    var gW     = 42;
    var startX = 50;
    var startY = 50;

    var r      = 20;
    var rb     = 8;

    var mX     = startX   -  8.5;  // 41.5
    var mY     = startY   -  5.0;  // 45
    var msX    = mX       -  4.5;  // 37
    var msY    = mY       -  2.0;  // 43

    var pX     = startX   +  9.5;  // 59.5
    var pY     = mY;               // 45
    var ps1X   = pX       -  4;    // 55.5
    var ps1Y   = pY       -  2;    // 43
    var ps2X   = ps1X     +  2.5;  // 58
    var ps2Y   = ps1Y     -  2.5;  // 40.5

    var zX     = startX   -  0.5;  // 49.5
    var zY     = startY   + 11.0;  // 61

    var sW     = this.cx > this.cy ? this.cy : this.cx;
    var sW10   = sW * 0.1;
    if (sW10 > this.options.compassMaxSize){
        sW10 = this.options.compassMaxSize;
    }
    if (sW10 < this.options.compassMinSize) {
        sW10 = this.options.compassMinSize;
    }


    var wP     = sW10 / gW;

    var self   = this;

    //console.log("gw "+gW+" sw "+sW+" sw10 "+sW10+" wp "+wP);

    var g = this.vis
        .append("g"                            )
            .attr("class"    , 'compass-g compass-opaque')
            .attr("transform", "translate(0,0) scale("+wP+")")
            .on(  "mouseover", function(d) { d3.select(this).classed( "compass-opaque", false ); })
            .on(  "mouseout" , function(d) { d3.select(this).classed( "compass-opaque", true  ); });

    // big circle
    g.append("circle")
        .attr("class"  , 'compass-bg')
        .attr("cx"     , startX      )
        .attr("cy"     , startY      )
        .attr("r"      , gW          )
        .attr("fill"   , "white"     )
        .attr("opacity", 0.75        );


    // arrows
    g.append('path')
        .attr('class', 'compass-button'                   )
        .attr('d'    , "M50 10 l12 20 a40,70 0 0,0 -24,0z")
        .on('click'  ,  function() { self.mover('t'); }    ); //t

    g.append('path')
        .attr('class', 'compass-button'                    )
        .attr('d'    , "M90 50 l-20 -12 a70,40 0 0,1 0,24z")
        .on('click'  ,  function() { self.mover('r'); }     ); // r

    g.append('path')
        .attr('class', 'compass-button'                    )
        .attr('d'    , "M50 90 l12 -20 a40,70 0 0,1 -24,0z")
        .on('click'  ,  function() { self.mover('b'); }     ); // b

    g.append('path')
        .attr('class', 'compass-button'                   )
        .attr('d'    , "M10 50 l20 -12 a70,40 0 0,0 0,24z")
        .on('click'  ,  function() { self.mover('l'); }    ); // l


    //white center
    g.append('circle')
        .attr('class', 'compass')
        .attr("cx"   , startX   )
        .attr("cy"   , startY   )
        .attr("r"    , r        );


    //zoom buttons
    //zoom buttons - minus
    var gm = g.append('g')
          .on('click'  , function() { self.mover('-'); } );

        gm.append('circle')
          .attr('class', 'compass-button')
          .attr("cx"   , mX              )
          .attr("cy"   , mY              )
          .attr("r"    , rb              );

        gm.append('rect')
          .attr('class' , 'compass-plus-minus')
          .attr('x'     , msX                 )
          .attr('y'     , msY                 )
          .attr('width' , rb                  )
          .attr('height', rb/3                );

    //zoom buttons - plus
    var gp = g.append('g')
          .on('click'  ,  function() { self.mover('+'); } );

        gp.append('circle')
          .attr('class', 'compass-button')
          .attr("cx"   , pX              )
          .attr("cy"   , pY              )
          .attr("r"    , rb              );

        // plus signal
        gp.append('rect')
          .attr('class' , 'compass-plus-minus')
          .attr('x'     , ps1X                )
          .attr('y'     , ps1Y                )
          .attr('width' , rb                  )
          .attr('height', rb/3                );

        gp.append('rect')
          .attr('class' , 'compass-plus-minus')
          .attr('x'     , ps2X                )
          .attr('y'     , ps2Y                )
          .attr('width' , rb/3                )
          .attr('height', rb                  );

    //zoom buttons - zero
    var gz = g.append('g')
          .on('click'  ,  function() { self.mover('0'); } );

        gz.append('circle')
          .attr('class', 'compass-button')
          .attr("cx"   , zX              )
          .attr("cy"   , zY              )
          .attr("r"    , rb              );

        gz.append('circle')
          .attr('class', 'compass-plus-minus')
          .attr("cx"   , zX                  )
          .attr("cy"   , zY                  )
          .attr("r"    , rb/1.5              );

        gz.append('circle')
          .attr('class', 'compass-button')
          .attr("cx"   , zX              )
          .attr("cy"   , zY              )
          .attr("r"    , rb/3            );


    //<svg>
    //    <circle cx="50" cy="50" r="42" fill="white" opacity="0.75"/>
    //    <path class="compass-button" onclick="pan(0,50)"  d="M50 10 l12 20 a40,70 0 0,0 -24,0z"  />
    //    <path class="compass-button" onclick="pan(50,0)"  d="M10 50 l20 -12 a70,40 0 0,0 0,24z"  />
    //    <path class="compass-button" onclick="pan(0,-50)" d="M50 90 l12 -20 a40,70 0 0,1 -24,0z" />
    //    <path class="compass-button" onclick="pan(-50,0)" d="M90 50 l-20 -12 a70,40 0 0,1 0,24z" />
    //    <circle class="compass"         cx="50" cy="50" r="20"/>
    //    <circle class="compass-button"  cx="50" cy="41" r="8" onclick="zoom(0.8)"/>
    //    <circle class="compass-button"  cx="50" cy="59" r="8" onclick="zoom(1.25)"/>
    //    <rect class="compass-plus-minus" x="46"   y="39.5" width="8" height="3"/>
    //    <rect class="compass-plus-minus" x="46"   y="57.5" width="8" height="3"/>
    //    <rect class="compass-plus-minus" x="48.5" y="55"   width="3" height="8"/>
    //</svg>
};




SimpleGraph.prototype.addCloseIcon = function() {
    var self   = this;

    var gW     = 300;
    var sW     = this.size.width > this.size.height ? this.size.height : this.size.width;
    var sW10   = sW * 0.025;
    if ( sW10 < this.options.closeIconMaxSize ) {
        sW10   = this.options.closeIconMaxSize;
    }

    var wP   = sW10 / gW;
        sW10 = gW * wP;
    var xPos = this.size.width - (2*sW10) + this.padding.right;
    var yPos = 0 - 35;

    //console.log("cx "+this.size.width+" cy "+this.size.height+" gw "+gW+" sw "+sW+" sw10 "+sW10+" wp "+wP+" xpos "+xPos+" ypos "+yPos);


    var g1 = this.btns
        .append("g"                                       )
            .attr("class"    , 'close-icon compass-opaque')
            //.attr("transform", "translate("+(-32 + (3*sW10))+","+-35+") scale("+wP+")")
            .attr("transform", "translate(0,0) scale("+wP+")")
            .on(  "mouseover", function(d) { d3.select(this).classed( "compass-opaque", false ); })
            .on(  "mouseout" , function(d) { d3.select(this).classed( "compass-opaque", true  ); })
            .on(  "click"    , function(d) { self.close(); }                                      );

    var g2 = g1.append('g')
        .attr('id', 'layer1');

    g2.append('path')
        .attr("style"       , "fill:#000000;fill-opacity:1;stroke:none")
        .attr("transform"   , "matrix(1.9082106,0,0,1.9082106,-22.026324,-128.37065)")
        .attr("d"           , "m 168.26579,145.95174 a 77.85714,78.571426 0 1 1 -155.714276,0 77.85714,78.571426 0 1 1 155.714276,0 z");

    var g3 = g1.append('g')
        .attr('id'       , 'layer2'                 )
        .attr('transform', "translate(0,-752.36218)")
        .attr('style'    , 'display:inline'         );

    g3.append('path')
        .attr("style"       , "fill:none;stroke:#ffffff;stroke-width:53.64802551;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none")
        .attr("d"           , "M 79.946368,993.62902 220.57402,811.08004");

    g3.append('path')
        .attr("style"       , "fill:none;stroke:#ffffff;stroke-width:53.64802551;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none")
        .attr("d"           , "M 220.57402,993.62902 79.946368,811.08004");

  //<g>
  //  <path
  //     d="m 168.26579,145.95174 a 77.85714,78.571426 0 1 1 -155.714276,0 77.85714,78.571426 0 1 1 155.714276,0 z"
  //     transform="matrix(1.9082106,0,0,1.9082106,-22.026324,-128.37065)"
  //     id="path3790"
  //     style="fill:#000000;fill-opacity:1;stroke:none" />
  //</g>
  //<g
  //   transform="translate(0,-752.36218)"
  //   id="layer1"
  //   style="display:inline">
  //  <path
  //     d="M 79.946368,993.62902 220.57402,811.08004"
  //     id="path3763"
  //     style="fill:none;stroke:#ffffff;stroke-width:53.64802551;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none" />
  //  <path
  //     d="M 220.57402,993.62902 79.946368,811.08004"
  //     id="path3765"
  //     style="fill:none;stroke:#ffffff;stroke-width:53.64802551;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none" />






//<svg viewBox="0 0 744.09 1052.4" version="1.1">
// <g id="layer1">
//  <path id="path2989" stroke-width="5" stroke="#000" transform="matrix(1.1048 0 0 1.1048 -179.21 -162.53)" d="m814.29 606.65a314.29 314.29 0 1 1 -628.57 0 314.29 314.29 0 1 1 628.57 0z"/>
//  <g id="g3763" transform="matrix(.91837 0 0 .91837 47.587 10.944)" stroke="#fff" stroke-linecap="round" stroke-width="133.87" fill="none">
//   <path id="path2991" d="m176.51 362.87 356.13 356.13"/>
//   <path id="path2993" d="m532.64 362.87-356.13 356.13"/>
//  </g>
// </g>
//</svg>

        //.attr("stroke-width", 5     )
        //.attr("stroke"      , "#000")
        //.attr("transform"   , "matrix(1.1048 0 0 1.1048 -179.21 -162.53)")
        //.attr("d"           , "m814.29 606.65a314.29 314.29 0 1 1 -628.57 0 314.29 314.29 0 1 1 628.57 0z");

    //var g2 = g1.append('g')
    //    .attr("transform"      , "matrix(.91837 0 0 .91837 47.587 10.944)")
    //    .attr("stroke"         , "#fff"  )
    //    .attr("stroke-linecap" , "round" )
    //    .attr("stroke-width"   , "133.87")
    //    .attr("fill"           , "none"  )
    //
    //g2.append('path')
    //    .attr('d', "m176.51 362.87 356.13 356.13");
    //
    //g2.append('path')
    //    .attr('d', "m532.64 362.87-356.13 356.13");

};
