//http://bl.ocks.org/stepheneb/1182434
function toFixed(value, precision) {
    //http://stackoverflow.com/questions/2221167/javascript-formatting-a-rounded-number-to-n-decimals/2909252#2909252
    var precision = precision || 0,
    neg = value < 0,
    power = Math.pow(10, precision),
    value = Math.round(value * power),
    integral = String((neg ? Math.ceil : Math.floor)(value / power)),
    fraction = String((neg ? -value : value) % power),
    padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

    return precision ? integral + '.' +  padding + fraction : integral;
}




registerKeyboardHandler = function(callback) {
  var callback = callback;
  d3.select(window).on("keydown", callback);
};




SimpleGraph = function(elemid, options) {
  var self                    = this;
  this.chart                  = document.getElementById( elemid);
  this.cx                     = this.chart.clientWidth;
  this.cy                     = this.chart.clientHeight;
  this.elemid                 = elemid;
  this.options                = options                || {};
  this.options.labelId        = options.labelId        || null;

  this.options.xlabel         = options.xlabel         || 'x';
  this.options.ylabel         = options.ylabel         || 'y';
  this.options.title          = options.title          || 'no title';

  this.options.xmax           = options.xmax           || 30;
  this.options.xmin           = options.xmin           ||  0;
  this.options.ymax           = options.ymax           || 10;
  this.options.ymin           = options.ymin           ||  0;
                                                        //              from spps
                                                        //                  f/r
                                                        //  x1 y1 x2 y2 spp 0/1 q
  this.points                 = options.points         ||  [0 ,0, 0, 0, 0,  0,  0.0];
  this.options.xTicks         = options.xTicks         || 10;
  this.options.yTicks         = options.yTicks         || 10;
  this.options.split          = options.split          || 30;
  this.options.padding        = options.padding        || {};
  this.options.padding.top    = options.padding.top    || [40, 20];
  this.options.padding.right  = options.padding.right  || [30, 30];
  this.options.padding.bottom = options.padding.bottom || [60, 10];
  this.options.padding.left   = options.padding.left   || [70, 45];
  this.options.titleDx        = options.titleDx        || "-0.8em";
  this.options.xNumbersDy     = options.xNumbersDy     || "1em";
  this.options.yNumbersDy     = options.yNumbersDy     || "0.35em";
  this.options.xlabelDx       = options.xlabelDx       || "0em";
  this.options.xlabelDy       = options.xlabelDy       || "+2.3em";
  this.options.ylabelX        = options.ylabelX        || 0;
  this.options.ylabelY        = options.ylabelY        || 0;
  this.options.ylabelDx       = options.ylabelDx       || "0em";
  this.options.ylabelDy       = options.ylabelDy       || "-2.3em";
  //this.options.radius         = options.radius         || 5.0;

  this.regSize = 7;
  this.numRegs = (this.points.length / this.regSize);
  console.log("num vals "+this.points.length);
  console.log("num regs "+self.numRegs);


  this.padding = {
     "top"   : this.options.title  ? this.options.padding.top   [0] : this.options.padding.top   [1],
     "right" :                       this.options.padding.right [0],
     "bottom": this.options.xlabel ? this.options.padding.bottom[0] : this.options.padding.bottom[1],
     "left"  : this.options.ylabel ? this.options.padding.left  [0] : this.options.padding.left  [1],
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
      .attr("width"    , this.cx)
      .attr("height"   , this.cy);


  this.vis = this.svg.append("g"               )
        .attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")");


  this.plot = this.vis.append("rect")
      .attr( "class"          , 'matrix'        )
      .attr( "width"          , this.size.width )
      .attr( "height"         , this.size.height)
      .attr( "pointer-events" , "all"           )
      .on(   "mousedown.drag" , self.plot_drag())
      .on(   "touchstart.drag", self.plot_drag());

  this.zoom  = d3.behavior.zoom();
  this.plot.call(this.zoom.x(this.x).y(this.y).on("zoom", this.redraw()));


  this.vis.append("svg")
      .attr("top"    , 0               )
      .attr("left"   , 0               )
      .attr("width"  , this.size.width )
      .attr("height" , this.size.height)
      .attr("viewBox", "0 0 "+this.size.width+" "+this.size.height)
      .attr("class"  , "line"          );



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
    this.vis.append("g").append("text")
        .attr("class"       , "axis ylabel"         )
        .attr("x"           , this.options.ylabelX  )
        .attr("y"           , this.options.ylabelY  )
        .attr("dy"          , this.options.ylabelDy )
        .attr("dx"          , this.options.ylabelDx )
        .style("text-anchor","middle"               )
        .attr("transform"   ,"translate(" + -40 + " " + this.size.height/2+") rotate(-90)")
        .text(this.options.ylabel                   );
  }


  d3.select(this.chart)
      .on("mousemove.drag", self.mousemove())
      .on("touchmove.drag", self.mousemove())
      .on("mouseup.drag",   self.mouseup()  )
      .on("touchend.drag",  self.mouseup()  )

  d3.select('body')
    .on("keydown"        ,  self.keymove()  );

  this.addCompass();

  this.addDownload();

  this.redraw()();
};






//
// SimpleGraph methods
//
SimpleGraph.prototype.update = function() {
  var self   = this;
  var coords = [];
  this.vis.selectAll(".points").remove();
  //this.vis.selectAll("circle").remove();

  for (var j = 0; j < this.numRegs; j++) {
    var vars  = this.parsepoint( j );

    var sense =      vars.sense;
    var stVal = { x: vars.x1, y: vars.y1, j: j, s: sense};
    var ndVal = { x: vars.x2, y: vars.y2, j: j, s: sense};

    var line  = this.line( [ stVal, ndVal ] );

    var senseclass = sense ? 'points-r' : 'points-f';

    this.vis
        .append("path")
            .attr("class"    , "points " + senseclass )
            .attr("d"        , line                   )
            .attr("j"        , j                      )
            .attr("scaf"     , vars.nameNum           )
            .on(  "mouseover", function(d) { self.highlight( vars.nameNum );        })
            .on(  "mouseout" , function(d) { d3.selectAll('.scaf-highlight').remove(); });
        //coords[ coords.length ] = stVal;
        //coords[ coords.length ] = ndVal;
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
    //$('svg circle').tipsy({
    //    gravity: 'w',
    //    html   : true,
    //    title  : function() {
    //        var j   = this.getAttribute('j');
    //        var res = genTip(self.points[j]);
    //        return res;
    //    }
    //});


    // TODO: REPLACE BY D3 SELECTOR
    $('svg path.points').tipsy({
        gravity: 'w',
        html   : true,
        title  : function() {
            var j   = this.getAttribute('j');
            return self.genTip( j );
        }
    });


  if (d3.event && d3.event.keyCode) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}




SimpleGraph.prototype.highlight = function( nameNum ) {
    //.scaf-highlight
    var scafLines = d3.selectAll(".points[scaf='"+nameNum+"']");

    var minX = Number.MAX_VALUE;
    var maxX = 0;
    var minY = Number.MAX_VALUE;
    var maxY = 0;

    for ( var s = 0; s < scafLines[0].length; s++ ) {
        var scaf = scafLines[0][s];
        var j    = scaf.getAttribute('j');
        var vars = this.parsepoint( j );

        minX = vars.x1 < minX ? vars.x1 : minX;
        minX = vars.x2 < minX ? vars.x2 : minX;
        minY = vars.y1 < minY ? vars.y1 : minY;
        minY = vars.y2 < minY ? vars.y2 : minY;

        maxX = vars.x1 > maxX ? vars.x1 : maxX;
        maxX = vars.x2 > maxX ? vars.x2 : maxX;
        maxY = vars.y1 > maxY ? vars.y1 : maxY;
        maxY = vars.y2 > maxY ? vars.y2 : maxY;
    };

    console.log("X min " + minX + ' max ' + maxX);
    console.log("Y min " + minY + ' max ' + maxY);

    minX = this.x(minX);
    maxX = this.x(maxX);
    minY = this.y(minY);
    maxY = this.y(maxY);

    console.log("X min " + minX + ' max ' + maxX);
    console.log("Y min " + minY + ' max ' + maxY);

    var lenX = maxX - minX;
    var lenY = minY - maxY;

    console.log("len X " + lenX + ' Y ' + lenY);


    this.vis.append("rect")
      .attr( "class"  , 'scaf-highlight')
      .attr( "cx"     , this.x(minX)    )
      .attr( "cy"     , this.y(minY)    )
      .attr( "width"  , lenX            )
      .attr( "height" , lenY            );
}




SimpleGraph.prototype.getSppName = function(k){
    return spps[ k ];
}




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
        senseStr:       point[5] == 0 ? 'fwd' : 'rev',
        qual    :       point[6],
    }

    return res;
}




SimpleGraph.prototype.genTip = function (j) {
    var vars  = this.parsepoint( j );
    var res   = 'Scaf: ' + vars.name + ' Sense: ' + vars.senseStr + ' Ref Pos: ' + vars.x1 + '-' + vars.x2 + ' Scaf Pos: ' + vars.y1 + '-' + vars.y2 + ' Qual: ' + vars.qual;
    return res;
}




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

    self.redraw()();
    self.update();
}




SimpleGraph.prototype.plot_drag = function() {
  var self = this;
  return function() {
    //registerKeyboardHandler(self.keydown());

    d3.select('body').style("cursor", "move");

    if (d3.event.altKey) {
      var p        = d3.mouse(self.vis.node());
      var newpoint = {};
      newpoint.x   = self.x.invert(Math.max(0, Math.min(self.size.width,  p[0])));
      newpoint.y   = self.y.invert(Math.max(0, Math.min(self.size.height, p[1])));
      self.points.push(newpoint);
      self.points.sort(function(a, b) {
        if (a.x < b.x) { return -1 };
        if (a.x > b.x) { return  1 };
        return 0
      });
      self.selected = newpoint;
      self.update();
      d3.event.preventDefault();
      d3.event.stopPropagation();
    }
  }
};




SimpleGraph.prototype.keymove = function() {
  var self = this;
  return function() {
    registerKeyboardHandler(self.keydown());

    //d3.select('body').style("cursor", "move");

    var keyPressed = d3.event.keyCode;
    //console.log( 'key pressed ' + keyPressed );

    var valPressed = null;
    switch (keyPressed) {
      case  37: {  // left
        valPressed = 'l'; break;
      };
      case  108: { // left (Numkey)
        valPressed = 'l'; break;
      };
      case  38: { // top
        valPressed = 't'; break;
      };
      case  104: { // top (Numkey)
        valPressed = 't'; break;
      };
      case  39: { // right
        valPressed = 'r'; break;
      };
      case  102: { // right (Numkey)
        valPressed = 'r'; break;
      };
      case  40: { // bottom
        valPressed = 'b'; break;
      };
      case  98: { // bottom (Numkey)
        valPressed = 'b'; break;
      };
      case  187: { // plus
        valPressed = '+'; break;
      };
      case  107: { // plus (Numkey)
        valPressed = '+'; break;
      };
      case  189: { // minus
        valPressed = '-'; break;
      };
      case  109: { // minus (Numkey)
        valPressed = '-'; break;
      };
      case  48: { // zero
        valPressed = '0'; break;
      };
      case  96: { // zero (Numkey)
        valPressed = '0'; break;
      };
      case  82: { // zero (r)
        valPressed = '0'; break;
      };
    }

    //console.log('val pressed ',valPressed);
    //console.log('key ' + valPressed+ ' val ',valPressed);

    self.mover( valPressed );
  }
}




SimpleGraph.prototype.mover = function(valPressed) {
    var self = this;

    var blockY = Math.floor(self.size.height / 5);
    var blockX = Math.floor(self.size.width  / 5);

    switch(valPressed) {
      case  'l': {  // left
        self.panIt( blockX,   0); break;
      };
      case  'r': {  // right
        self.panIt(-blockX,   0); break;
      };
      case  't': {  // top
        self.panIt(0,  blockY); break;
      };
      case  'b': {  // bottom
        self.panIt(0, -blockY); break;
      };
      case  '+': {  // plus
        self.zoomIt(1.25); break;
      };
      case  '-': {  // -
        self.zoomIt(0.75); break;
      };
      case  '0': {  // zero
        self.reset(); break;
      };
    }
};




SimpleGraph.prototype.updatePos = function(){
    if (this.options.labelId){
        var cTrans = this.zoom.translate();
        var cScale = this.zoom.scale();

        //console.log(cScale);

        var rx     = cTrans[0];
        var ry     = cTrans[1];

        //var text  = '<b>Zoom:</b> ' + toFixed(cScale,1) + 'X - ';
        var text = '<b>Pos:</b> '  + Math.floor(this.x.invert(rx)) + ' x ' + Math.floor(this.y.invert(ry));

        //d3.select('#'+this.options.labelId).html( text );
    }
}




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

    self.plot.call( self.zoom.translate([ rx, ry ]) );
    self.redraw()();
    self.update();

    //cTrans = self.zoom.translate();
    //console.log( 'cTrans A ' + cTrans );
}




SimpleGraph.prototype.zoomIt = function(z){
    var self = this;
        console.log( 'zoom. z ' + z )
        var cScale   = self.zoom.scale();
        var dstScale = cScale * z;

        //console.log( 'c scale ' + cScale + ' dst scale ' + dstScale );

        self.plot.call( self.zoom.scale( dstScale ) );

        self.redraw()();
        self.update();
}




SimpleGraph.prototype.datapoint_drag = function() {
  var self = this;
  return function(d) {
    registerKeyboardHandler(self.keydown());
    document.onselectstart = function() { return false; };
    self.selected          = self.dragged = d;
    self.update();
  }
};




SimpleGraph.prototype.mousemove = function() {
  var self = this;
  return function() {
    var p = d3.mouse(self.vis[0][0]),
        t = d3.event.changedTouches;

    if (self.dragged) {
      self.dragged.y = self.y.invert(Math.max(0, Math.min(self.size.height, p[1])));
      self.update();
    };


    if (!isNaN(self.downx)) {
      d3.select('body').style("cursor", "ew-resize");
      var rupx   = self.x.invert(p[0]),
          xaxis1 = self.x.domain()[0],
          xaxis2 = self.x.domain()[1],
          xextent = xaxis2 - xaxis1;

      if (rupx != 0) {
        var changex, new_domain;
        changex    = self.downx / rupx;
        new_domain = [xaxis1, xaxis1 + (xextent * changex)];
        self.x.domain(new_domain);
        self.redraw()();
      }
      d3.event.preventDefault();
      d3.event.stopPropagation();
    };

    if (!isNaN(self.downy)) {
      d3.select('body').style("cursor", "ns-resize");
      var rupy   = self.y.invert(p[1]),
          yaxis1 = self.y.domain()[1],
          yaxis2 = self.y.domain()[0],
          yextent = yaxis2 - yaxis1;

      if (rupy != 0) {
        var changey, new_domain;
        changey    = self.downy / rupy;
        new_domain = [yaxis1 + (yextent * changey), yaxis1];
        self.y.domain(new_domain);
        self.redraw()();
      }
      d3.event.preventDefault();
      d3.event.stopPropagation();
    }
  }
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
    };

    if (!isNaN(self.downy)) {
      self.redraw()();
      self.downy = Math.NaN;
      d3.event.preventDefault();
      d3.event.stopPropagation();
    }

    if (self.dragged) {
      self.dragged = null
    }
  }
}




SimpleGraph.prototype.keydown = function() {
  var self = this;
  return function() {
    if (!self.selected) return;
    switch (d3.event.keyCode) {
      case  8: // backspace
      case 46: { // delete
        var i = self.points.indexOf(self.selected);
        self.points.splice(i, 1);
        self.selected = self.points.length ? self.points[i > 0 ? i - 1 : 0] : null;
        self.update();
        break;
      }
    }
  }
};




SimpleGraph.prototype.redraw = function() {
  var self = this;
  return function() {

    var tx = function(d) {
      return "translate(" + self.x(d) + ",0)";
    },

    ty = function(d) {
      return "translate(0," + self.y(d) + ")";
    },


    fx = self.x.tickFormat(10),
    fy = self.y.tickFormat(10);

    // Regenerate x-ticks…
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





    // Regenerate y-ticks…
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

    self.updatePos( );

    self.plot.call( self.zoom.x(self.x).y(self.y).on("zoom", self.redraw()) );
    self.update();
  }
}




SimpleGraph.prototype.xaxis_drag = function() {
  var self = this;
  return function(d) {
    document.onselectstart = function() { return false; };
    var p      = d3.mouse(self.vis[0][0]);
    self.downx = self.x.invert(p[0]);
  }
};




SimpleGraph.prototype.yaxis_drag = function(d) {
  var self = this;
  return function(d) {
    document.onselectstart = function() { return false; };
    var p      = d3.mouse(self.vis[0][0]);
    self.downy = self.y.invert(p[1]);
  }
};




SimpleGraph.prototype.download = function() {
    var self = this;
    var doctype = '<?xml version="1.0" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
    var svg     = self.svg;

    svg.selectAll(".download-icon").remove();
    svg.selectAll(".compass-g"    ).remove();

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
        class            : svg.attr("class"),
        id               : svg.attr("id"),
        childElementCount: svg.node().childElementCount,
        source           : [doctype + source]
    };

    var filename = 'image.csv';

    if (svgInfo.id) {
        filename = svgInfo.id;
    } else if (svgInfo.class) {
        filename = svgInfo.class;
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

    this.addDownload();
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
}




SimpleGraph.prototype.addDownload = function() {
    //.attr("transform", "matrix(1,0,0,-1,113.89831,1293.0169)")
    //.attr("transform", "scale(0.05)")

    var self = this;

    var gW   = 512;
    var sW   = this.size.width > this.size.height ? this.size.height : this.size.width;
    var sW10 = sW * .025;
    var wP   = sW10 / gW;
        sW10 = gW * wP;
    var xPos = this.size.width - sW10 + this.padding.right;
    var yPos = 0;

    //console.log("cx "+this.size.width+" cy "+this.size.height+" gw "+gW+" sw "+sW+" sw10 "+sW10+" wp "+wP+" xpos "+xPos+" ypos "+yPos);

    var g  = this.vis
        .append("g"                            )
            .attr("class"    , 'download-icon')
            .attr("transform", "translate("+xPos+","+yPos+") rotate(180) scale("+wP+")")
            .on(  'click'    , function() { self.download() } )
        .append("path")
            .attr("d", "m 1120,608 q 0,-12 -10,-24 L 791,265 q -9,-9 -23,-9 -14,0 -23,9 L 425,585 q -9,9 -9,23 0,13 9.5,22.5 9.5,9.5 22.5,9.5 h 192 v 352 q 0,13 9.5,22.5 9.5,9.5 22.5,9.5 h 192 q 13,0 22.5,-9.5 Q 896,1005 896,992 V 640 h 192 q 14,0 23,-9 9,-9 9,-23 z m 160,32 q 0,104 -40.5,198.5 Q 1199,933 1130,1002 1061,1071 966.5,1111.5 872,1152 768,1152 664,1152 569.5,1111.5 475,1071 406,1002 337,933 296.5,838.5 256,744 256,640 256,536 296.5,441.5 337,347 406,278 475,209 569.5,168.5 664,128 768,128 872,128 966.5,168.5 1061,209 1130,278 1199,347 1239.5,441.5 1280,536 1280,640 z m 256,0 Q 1536,431 1433,254.5 1330,78 1153.5,-25 977,-128 768,-128 559,-128 382.5,-25 206,78 103,254.5 0,431 0,640 0,849 103,1025.5 206,1202 382.5,1305 559,1408 768,1408 977,1408 1153.5,1305 1330,1202 1433,1025.5 1536,849 1536,640 z")
    ;

}




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
    var sW10   = sW * .1;
    var wP     = sW10 / gW;

    var self   = this;

    //console.log("gw "+gW+" sw "+sW+" sw10 "+sW10+" wp "+wP);



    var g = this.vis
        .append("g"                            )
            .attr("class"    , 'compass-g compass-opaque')
            .attr("transform", "translate(0,0) scale("+wP+")")
            .on(  "mouseover", function(d) { d3.select(this).classed( "compass-opaque", false ) })
            .on(  "mouseout" , function(d) { d3.select(this).classed( "compass-opaque", true  ) });

    g.append("circle")
        .attr("class"  , 'compass-bg')
        .attr("cx"     , startX      )
        .attr("cy"     , startY      )
        .attr("r"      , gW          )
        .attr("fill"   , "white"     )
        .attr("opacity", 0.75        );

    g.append('path')
        .attr('class', 'compass-button'                   )
        .attr('d'    , "M50 10 l12 20 a40,70 0 0,0 -24,0z")
        .on('click'  ,  function() { console.log('1'); self.mover('t') }    ); //t

    g.append('path')
        .attr('class', 'compass-button'                    )
        .attr('d'    , "M90 50 l-20 -12 a70,40 0 0,1 0,24z")
        .on('click'  ,  function() { console.log('4'); self.mover('r') }     ); // r

    g.append('path')
        .attr('class', 'compass-button'                    )
        .attr('d'    , "M50 90 l12 -20 a40,70 0 0,1 -24,0z")
        .on('click'  ,  function() { console.log('3'); self.mover('b') }     ); // b

    g.append('path')
        .attr('class', 'compass-button'                   )
        .attr('d'    , "M10 50 l20 -12 a70,40 0 0,0 0,24z")
        .on('click'  ,  function() { console.log('2'); self.mover('l') }    ); // l



    g.append('circle')
        .attr('class', 'compass')
        .attr("cx"   , startX   )
        .attr("cy"   , startY   )
        .attr("r"    , r        );



    g.append('circle')
        .attr('class', 'compass-button')
        .attr("cx"   , mX              )
        .attr("cy"   , mY              )
        .attr("r"    , rb              )
        .on('click'  , function() { self.mover('-') } );

    g.append('circle')
        .attr('class', 'compass-button')
        .attr("cx"   , pX              )
        .attr("cy"   , pY              )
        .attr("r"    , rb              )
        .on('click'  ,  function() { self.mover('+') } );


    g.append('circle')
        .attr('class', 'compass-button')
        .attr("cx"   , zX              )
        .attr("cy"   , zY              )
        .attr("r"    , rb              )
        .on('click'  ,  function() { self.mover('0') } );


    g.append('circle')
        .attr('class', 'compass-plus-minus')
        .attr("cx"   , zX                  )
        .attr("cy"   , zY                  )
        .attr("r"    , rb/3*2              );


    g.append('circle')
        .attr('class', 'compass-button')
        .attr("cx"   , zX              )
        .attr("cy"   , zY              )
        .attr("r"    , rb/3            );



    // minus signal
    g.append('rect')
        .attr('class' , 'compass-plus-minus')
        .attr('x'     , msX                 )
        .attr('y'     , msY                 )
        .attr('width' , rb                  )
        .attr('height', rb/3                );



    // plus signal
    g.append('rect')
        .attr('class' , 'compass-plus-minus')
        .attr('x'     , ps1X                )
        .attr('y'     , ps1Y                )
        .attr('width' , rb                  )
        .attr('height', rb/3                );

    g.append('rect')
        .attr('class' , 'compass-plus-minus')
        .attr('x'     , ps2X                )
        .attr('y'     , ps2Y                )
        .attr('width' , rb/3                )
        .attr('height', rb                  );

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
}
