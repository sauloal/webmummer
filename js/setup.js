var bdy          = document.getElementsByTagName('body')[0];

var win          = window,
    doc          = document,
    del          = doc.documentElement,
    bdy          = doc.getElementsByTagName('body')[0],
    wid          = win.innerWidth  || del.clientWidth  || bdy.clientWidth,
    hei          = win.innerHeight || del.clientHeight || bdy.clientHeight;





function hasStorage ( ) {
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




function start () {
    /*
    * Creates page elements
    */
    console.group('start');
    console.timeStamp('begin start');
    console.time('start');

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




    graphdb = new SyncSimpleGraph( {
        sync   : function () { var val = getFieldValue( 'sync'    ); return  val === null ? true : val; },
        resizeX: function () { var val = getFieldValue( 'resizeX' ); return  val === null ? true : val; },
        resizeY: function () { var val = getFieldValue( 'resizeY' ); return  val === null ? true : val; }
    });
    //graphdb = new SyncSimpleGraph( true );


    document.body.addEventListener( 'd3SyncChanged' , updateQuery, false );


    //getQueryString();


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

    //document.getElementById('okb').onclick();
    console.timeStamp('end start');
    console.timeEnd('start');
    console.groupEnd('start');
};





/*
 *
 * PAGE CREATOR
 *
 */
function addPicker ( el, id, cls, nfo, callback, opts ) {
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


function createCsss ( el ) {
    console.group('createCsss %o', el);
    console.timeStamp('begin createCsss');
    console.time('createCsss');
    console.log('begin createCsss %o', el);

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
        localDb.saveOpt( 'css', id, val );
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

    console.log('end createCsss %o', el);
    console.timeStamp('end createCsss');
    console.timeEnd('createCsss');
    console.groupEnd('createCsss %o', el);
};


function createPositions ( el ) {
    console.group('createPositions %o', el);
    console.timeStamp('begin createPositions');
    console.time('createPositions');
    console.log('begin createPositions %o', el);

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

        localDb.saveOpt( 'positions', id, val );

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
        nfo.value  = localDb.getOpt( 'positions', id, nfo.value );
        addPicker(tr, id, 'positions', nfo, callback);
    }
    

    console.log('end createPositions %o', el);
    console.timeStamp('end createPositions');
    console.timeEnd('createPositions');
    console.groupEnd('createPositions %o', el);
};


function createOptions ( ) {
    console.group('createOptions');
    console.timeStamp('begin createOptions');
    console.time('createOptions');

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
    console.timeEnd('createOptions');
    console.groupEnd('createOptions');
}


function createSyncs ( el ) {
    console.group('createSyncs %o', el);
    console.timeStamp('begin createSyncs');
    console.time('createSyncs');
    console.log('begin createSyncs %o', el);

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

        localDb.saveOpt( 'syncs', id, val );

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
        nfo.value = localDb.getOpt( 'syncs', id, nfo.value );

        addPicker(tr, id, 'syncs', nfo, callback);
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
                localDb.saveOpt( 'syncs', id, getFieldValue( id ) );
            }
        };

    addPicker( tr, 'size', 'sizes', sizes['size'], callback2);

    console.log('end createSyncs %o', el);
    console.timeStamp('end createSyncs');
    console.timeEnd('createSyncs');
    console.groupEnd('createSyncs %o', el);
};


function genSelectorsOpts ( obj, refSel, dflt ) {
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


function genSelectors ( sels ) {
    /*
     * Generate "select" elements. Calls genOpts to read options
     * If only one option available, adds a label field, otherwise, adds a drop-down menu.
     */

    console.group('genSelectors %o', sels);
    console.timeStamp('begin genSelectors');
    console.time('genSelectors');
    console.log('begin genSelectors %o', sels);


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

    console.log('end genSelectors %o', sels);
    console.timeStamp('end genSelectors');
    console.timeEnd('genSelectors');
    console.groupEnd('genSelectors %o', sels);
};




/*
 *
 *PROCESSING FUNCTIONS
 *
 */
processVals = function ( vals, cfg ){
    console.group('processVals %o', vals);
    console.timeStamp('begin processVals');
    console.time('processVals');
    console.log('begin processVals %o', vals);

    var self           = this;
    self.vals          = vals;
    self.cfg           = cfg;

    
    self.horizontal    = getFieldValue( 'horizontal' );
    self.size          = getFieldValue( 'size' );
    self.tipId         = 'tipper';

    
    self.getRegister();
    
    if ( !self.regs ) {
        return;
    }
    if ( self.regs.length === 0 ) {
        console.log('no reg');
        return;
    }

    console.log('end processVals %o', self.vals);
    console.timeStamp('end processVals');
    console.timeEnd('processVals');
    console.groupEnd('processVals %o', self.vals);
};


processVals.prototype.getRegister = function ( ) {
    var self = this;
    console.group('processVals.getRegister %o', self.vals);
    console.timeStamp('begin processVals.getRegister');
    console.time('processVals.getRegister');
    console.log('begin processVals.getRegister %o', self.vals);

    var self           = this;
    self.dvals         = {};
    self.evals         = [];

    for ( var key in opts ) {
        var val         = self.vals[key];
        self.dvals[key] = [];
        
        if ( val == '*all*' ) {
            opts[key].options.map( function(oval) {
                self.dvals[key].push( oval );
            });
        } else {
            self.dvals[key].push( val );
        }
    }

    //console.log( dvals );




    if (self.horizontal) {
        if ( self.dvals.refName.length != 1 ) {
            alert( 'more than one reference while using horizontal graph '  + self.dvals.refName.length  + ' ' + self.dvals.refName );
            return null;
        }

        if ( self.dvals.refChrom.length != 1 ) {
            alert( 'more than one chromosome while using horizontal graph ' + self.dvals.refChrom.length + ' ' + self.dvals.refChrom);
            return null;
        }
    }

    var qid = encodeObj(self.vals);

    self.dvals.refName.map( function(refName) {
        self.dvals.refChrom.map( function(refChrom) {
            self.dvals.tgtName.map( function(tgtName) {
                self.dvals.tgtChrom.map( function(tgtChrom) {
                    self.dvals.status.map( function(status) {
                        //console.log(ref + ' ' + refChrom + ' ' + tgtName + ' ' + status);
                        var reg = {
                            refName  : refName,
                            refChrom : refChrom,
                            tgtName  : tgtName,
                            tgtChrom : tgtChrom,
                            status   : status
                        };
                        self.evals.push( reg );
                    });
                });
            });
        });
    });

    self.evals.qid = qid;

    console.log('end processVals.getRegister %o >> %o', self.vals, self.evals);
    console.timeStamp('end processVals.getRegister');
    console.timeEnd('processVals.getRegister');
    console.groupEnd('processVals.getRegister %o', self.vals);

    self.parseRegisters( );
};


processVals.prototype.parseRegisters = function ( ) {
    var self           = this;

    console.group('processVals.parseRegisters %o', self.evals);
    console.timeStamp('begin processVals.parseRegisters');
    console.time('processVals.parseRegisters');
    console.log('begin processVals.parseRegisters %o', self.evals);
    
    self.regs          = [];

    for ( var e = 0; e < self.evals.length; e++ ) {
        var vals = self.evals[e];
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

        
        var uid            = Object.keys( vals ).map( function(d) { return vals[d] } ).join('').replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '');
        reg.nfo.uid        = uid;
        reg.nfo.qid        = self.evals.qid;
        reg.nfo.chartClass = self.size;
        reg.nfo.tipId      = self.tipId;
        reg.nfo.filepath   = datafolder + reg.res.filename;
        reg.nfo.scriptid   = 'script_'  + reg.nfo.uid;

        if ( reg.nfo.chartClass === null ) { reg.nfo.chartClass = Object.keys( sizes )[0]; };

        self.regs.push( reg );
    }


    if (self.regs.length === 0) {
        return null;
    }

    console.log('end processVals.parseRegisters %o >> %o', self.evals, self.regs);
    console.timeStamp('end processVals.parseRegisters');
    console.timeEnd('processVals.parseRegisters');
    console.groupEnd('processVals.parseRegisters %o', self.evals);

    self.send();
};


processVals.prototype.send = function ( ) {
    var self          = this;

    console.group('processVals.send %o', self.regs);
    console.timeStamp('begin processVals.send');
    console.time('processVals.send');
    console.log('begin processVals.send %o', self.regs);

    self.size         = 0;
    self.received     = 0;
    self.sentData     = [];
    self.receivedData = [];

    self.regs.map( function(reg) {
        var file  = reg.res.filename;
        if (file) {
            self.size += 1;
        }
    });


    if (self.size === 0) {
        console.log('nothing to plot');
        console.log(self.regs);
        return;
    }

    var count = 0;
    var func  = function(sregv) { loadScript( sregv, self.receive() ); };

    self.regs.map( function(reg) {
        var file   = reg.res.filename;
        self.sentData.push( file );
        if (file) {
            console.log( 'sending ' + file );
            //setTimeout( func(reg), (count * 1000));
            func(reg);
            count += 1;
        }
    });

    console.log('end processVals.send %o', self.regs);
    console.timeStamp('end processVals.send');
    console.timeEnd('processVals.send');
    console.groupEnd('processVals.send %o', self.regs);
};


processVals.prototype.receive = function ( ) {
    var self = this;

    return function( reg ) {
        console.group('processVals.receive %o', reg);
        console.timeStamp('begin processVals.receive');
        console.time('processVals.receive');
        console.log('begin processVals.receive %o', reg);

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
            self.loadGraph();
        }

        console.log('end processVals.receive %o >> %o', reg, self.receivedData);
        console.timeStamp('end processVals.receive');
        console.timeEnd('processVals.receive');
        console.groupEnd('processVals.receive %o', reg);
    };
};


processVals.prototype.loadGraph = function ( ) {
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
    var self = this;

    console.group('processVals.loadGraph %o', self.receivedData);
    console.timeStamp('begin processVals.loadGraph');
    console.time('processVals.loadGraph');
    console.log('begin processVals.loadGraph %o', self.receivedData);


    if (self.horizontal) {
        self.mergeregs( self.receivedData );
        self.hreg.parallel      = true;
        //self.hreg.cfg.initState = getInitState( self.hreg.qid );

        console.log( self.hreg );
        graphdb.add(chartName, self.hreg);

    } else {
        self.receivedData.map( function(reg) {
            var sreg           = self.simplifyReg( reg );
            //sreg.cfg.initState = getInitState( sreg.qid );
            console.log( sreg );
            graphdb.add(chartName, sreg);
        });
    }
    
    
    setQueryString();

    console.log('end processVals.loadGraph %o', self.receivedData);
    console.timeStamp('end processVals.loadGraph');
    console.timeEnd('processVals.loadGraph');
    console.groupEnd('processVals.loadGraph %o', self.receivedData);
};


processVals.prototype.mergeregs = function ( ) {
    var self = this;
    console.group('processVals.mergeregs %o', self.receivedData);
    console.timeStamp('begin processVals.mergeregs');
    console.time('processVals.mergeregs');
    console.timeStamp('begin processVals.mergeregs %o', self.receivedData);


    self.hreg = {
        qry: {},
        res: {},
        nfo: {},
        cfg: {}
    };
    
    var yTicksLabels = [];


    //console.log(regs);


    for ( var r = 0; r < self.receivedData.length; r++ ) {
        var reg = self.receivedData[r];
        yTicksLabels[r] = [];
        
        for ( var cls in reg ) {
            for ( var k in reg[cls] ) {
                if (!self.hreg[cls][k]) {
                    self.hreg[cls][k] = [];
                }
                var val = reg[cls][k];
                self.hreg[cls][k].push( val );
            }
        }
    }


    //console.log(hreg);


    var sreg = self.simplifyReg( hreg );


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
        var vals        = sreg.qry[v];
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
        //console.log( key );
        
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


    console.log('end processVals.mergeregs %o >> %o', regs, sreg);
    console.timeStamp('end processVals.mergeregs');
    console.timeEnd('processVals.mergeregs');
    console.groupEnd('processVals.mergeregs %o', regs);

    return sreg;
};


processVals.prototype.simplifyReg = function ( reg ) {
    var self = this;
    console.group('processVals.simplifyReg %o', reg);
    console.timeStamp('begin processVals.simplifyReg');
    console.time('processVals.simplifyReg');
    console.log('begin processVals.simplifyReg %o', reg);

    
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
    

    console.log('end processVals.simplifyReg %o >> %o', reg, res);
    console.timeStamp('end processVals.simplifyReg');
    console.timeEnd('processVals.simplifyReg');
    console.groupEnd('processVals.simplifyReg %o', reg);

    return res;
}




/*
 *
 *ACTIONS
 *
 */
function selclick ( ) {
    console.group('selclick');
    console.timeStamp('begin selclick');
    console.time('selclick');

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
    
    new processVals( vals, cfg );

    console.timeStamp('end selclick');
    console.timeEnd('selclick');
    console.groupEnd('selclick');
};


function getVals ( ) {
    console.group('getVals');
    console.timeStamp('begin getVals');
    console.time('getVals');

    var vals = {};

    for ( var optName in opts ) {
        var val      = getFieldValue( optName );

        if ( val === null ) {
            console.log( 'value ' + optName + ' not defined' );
            vals = null;
            break;
        } else {
            //console.log( 'appending ' + optName + ' = '+ val );
            vals[ optName ] = val;
        }
    }

    console.log('end getVals >> %o', vals);
    console.timeStamp('end getVals');
    console.timeEnd('getVals');
    console.groupEnd('getVals');

    return vals;
}


function getCfg ( ) {
    console.group('getCfg');
    console.timeStamp('begin getCfg');
    console.time('getCfg');

    var posK = Object.keys( positions );
        posK.sort();

    var cfg   = {};
    
    for (var idN = 0; idN < posK.length; idN++ ) {
        var id    = posK[idN];
        var nfo   = positions[id];
        var dfl   = nfo.value;
        var curr  = getFieldValue( id );

        if ( dfl != curr ) {
            console.log('option ' + id + ' default ' + dfl + ' current ' + curr + ' changing');
            console.log( nfo );
            cfg[id] = curr;
            
        } else {
            if (cfg[id]) {
                delete cfg[id];
            }
        }
    }

    console.log('end getCfg >> %o', cfg);
    console.timeStamp('end getCfg');
    console.timeEnd('getCfg');
    console.groupEnd('getCfg');

    return cfg;
}




/*
 *
 *TOOLS
 *
 */
function clearPics ( ) {
    console.log('cleaning');
    //console.log(graphdb);
    graphdb.clear();
}


function getFieldValue ( fieldId ) {
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


function obj2str ( obj ) {
    var res = "";
    for (var k in obj ) {
        res += '<b>' + k + "</b>: " + obj[k] + ", ";
    }
    return res;
}


function copyKeys ( obj ) {
    var str = JSON.stringify( obj );
    var res = JSON.parse(     str );
    return res;
}


function joinVals ( vals ) {
    var res = vals.filter(function(elem, pos) {
        return vals.indexOf(elem) == pos;
    });

    if (res.length == 1) {
        return res.join('+');
    } else {
        return '(' + res.join('+') + ')';
    }
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


function decodeObj ( str ) {
    return JSON.parse( decodeStr( str ) );
}


function loadScript ( reg, callback ) {
    /*
     * Adds a <script> tag to load the database
     * This is needed to circunvent the security measures which forbids
     * the browser to load any file other than images and javascript.
     *
     * Given the UID of the graph and the database register to be plotted
     * (both to be forwarded to "loadGraph"), creates the script and add
     * loadgraph as callback to its "onload".
     */
    console.group('loadScript %o', reg);
    console.timeStamp('begin loadScript');
    console.time('loadScript');
    console.log('begin loadScript %o', reg);

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

    console.log('end loadScript %o', reg);
    console.timeStamp('end loadScript');
    console.timeEnd('loadScript');
    console.groupEnd('loadScript %o', reg);
};




/*
 *
 *DB FUNCTIONS
 *
 */
LocalStorageDb = function ( prog_domain, db_domain) {
    this.progDomain = prog_domain;
    this.dbDomain   = db_domain;
};


LocalStorageDb.prototype.saveOpt = function (data_domain, key ,value) {
    var self = this;

    console.group('LocalStorageDb.saveOpt data_domain "%s" key "%s" value %o', data_domain, key, value);
    console.timeStamp('begin LocalStorageDb.saveOpt');
    console.time('LocalStorageDb.saveOpt');
    console.log('begin LocalStorageDb.saveOpt "%s" key "%s" value %o', data_domain, key, value);
    
    var data_db = self.getDataDb( data_domain );

    if (data_db) {
        if ( value === null ) {
            if ( data_db[key] ) {
                delete data_db[key];
            }
        } else {
            console.log('saving domain "' +data_domain+ '" k "' + key + '" v "' + value + '"');
            data_db[key] = value;
        }
        
        self.saveDataDb(data_domain, data_db);
        
        setQueryString();
    }

    console.log('end LocalStorageDb.saveOpt "%s" key "%s" value %o', data_domain, key, value);
    console.timeStamp('end LocalStorageDb.saveOpt');
    console.timeEnd('LocalStorageDb.saveOpt');
    console.groupEnd('LocalStorageDb.saveOpt "%s" key "%s" value %o', data_domain, key, value);
};


LocalStorageDb.prototype.getOpt = function (data_domain, key, dflt) {
    var self = this;

    console.group('LocalStorageDb.getOpt data_domain "%s" key "%s" default %o', data_domain, key, data_domain);
    console.timeStamp('begin LocalStorageDb.getOpt');
    console.time('LocalStorageDb.getOpt');
    console.log('begin LocalStorageDb.getOpt "%s" key "%s" default %o', data_domain, key, data_domain);

    var val     = dflt;
    var data_db = self.getDataDb( data_domain );

    if ( data_db ) {
        var res = data_db[key];
        if ( res !== null && res !== undefined ) {
            val = res;
        }
    }

    //console.log( 'returning ' + val );

    console.log('end LocalStorageDb.getOpt "%s" key "%s" default %o >> %o', data_domain, key, data_domain, val);
    console.timeStamp('end LocalStorageDb.getOpt');
    console.timeEnd('LocalStorageDb.getOpt');
    console.groupEnd('LocalStorageDb.getOpt "%s" key "%s" default %o', data_domain, key, data_domain);
    
    return val;
};


LocalStorageDb.prototype.getDataDb = function ( data_domain ){
    var self = this;

    console.group('LocalStorageDb.getDataDb data_domain "%s"', data_domain);
    console.timeStamp('begin LocalStorageDb.getDataDb');
    console.time('LocalStorageDb.getDataDb');
    console.log('begin LocalStorageDb.getDataDb data_domain "%s"', data_domain);

    var data_db = {};
    if ( hasstorage ) {
        if ( self.progDomain ) {
            if ( self.dbDomain ) {
                var db_key  = self.progDomain + self.dbDomain + data_domain;
                var data    = localStorage[ db_key ];
                if ( data ) {
                    try {
                        data_db = JSON.parse( data );
                    } catch(e) {
                    }
                }
            }
        }
    }
    
    console.log('end LocalStorageDb.getDataDb data_domain "%s" >> %o', data_domain, data_db);
    console.timeStamp('end LocalStorageDb.getDataDb');
    console.timeEnd('LocalStorageDb.getDataDb');
    console.groupEnd('LocalStorageDb.getDataDb data_domain "%s"', data_domain);
    return data_db;
};


LocalStorageDb.prototype.saveDataDb = function (data_domain, data_db) {
    var self = this;

    console.group('LocalStorageDb.saveDataDb data_domain "%s" data_db %o', data_domain, data_db);
    console.timeStamp('begin LocalStorageDb.saveDataDb');
    console.time('LocalStorageDb.saveDataDb');
    console.log('begin LocalStorageDb.saveDataDb data_domain "%s" data_db %o', data_domain, data_db);

    if ( hasstorage ) {
        if ( self.progDomain ) {
            if ( self.dbDomain ) {
                var db_key  = self.progDomain + self.dbDomain + data_domain;
                var data    = {};
                if (data_db !== null) {
                    data = data_db;
                }
                
                var jso     = JSON.stringify( data );
                localStorage[db_key] = jso;
            }
        }
    }
    
    console.log('end LocalStorageDb.saveDataDb data_domain "%s" data_db %o', data_domain, data_db);
    console.timeStamp('end LocalStorageDb.saveDataDb');
    console.timeEnd('LocalStorageDb.saveDataDb');
    console.groupEnd('LocalStorageDb.saveDataDb data_domain "%s" data_db %o', data_domain, data_db);
};


LocalStorageDb.prototype.clearDb = function (data_domain) {
    var self = this;

    self.saveDataDb(data_domain, null);
    
    setQueryString();
};


LocalStorageDb.prototype.getDb = function () {
    var self = this;
    
    console.group('LocalStorageDb.getDb');
    console.timeStamp('begin LocalStorageDb.getDb');
    console.time('LocalStorageDb.getDb');
    console.log('begin LocalStorageDb.getDb');

    var res = null;
    
    if ( hasstorage ) {
        if ( self.dbDomain ) {
            var data = localStorage[ self.dbDomain ];
            
            if ( data ) {
                try {
                    //console.log('getting ' + k);
                    res = JSON.parse( data );
                } catch(e) {
                }
            }
        }
    }

    console.log('end LocalStorageDb.getDb >> %o', res);
    console.timeStamp('end LocalStorageDb.getDb');
    console.timeEnd('LocalStorageDb.getDb');
    console.groupEnd('LocalStorageDb.getDb');
    
    return res;
};








function updateQuery (e) {
    var self = this;
    console.group('updateQuery %o', e);
    console.timeStamp('begin updateQuery');
    console.time('updateQuery');
    console.log('begin updateQuery %o', e);

    //console.log( new Error().stack );
    //console.log( e );
    var qries = e.detail.el;
    //console.log( qries );
    
    localDb.saveOpt('_queries', '_queries', qries);

    console.log('end updateQuery %o', e);
    console.timeStamp('end updateQuery');
    console.timeEnd('updateQuery');
    console.groupEnd('updateQuery %o', e);
}


function getCurrQueries ( ) {
    console.group('getCurrQueries');
    console.timeStamp('begin getCurrQueries');
    console.time('getCurrQueries');
    console.log('begin getCurrQueries');

    var q = graphdb.getQueries();

    console.log('end getCurrQueries >> %o', q);
    console.timeStamp('end getCurrQueries');
    console.timeEnd('getCurrQueries');
    console.groupEnd('getCurrQueries');

    return q;
};




/*
 *
 *URL FUNCTIONS
 *
 */
function getQueryString ( ) {
    console.group('getQueryString');
    console.timeStamp('begin getQueryString');
    console.time('getQueryString');

    
    var parsed = parseUri(document.URL);
    var anchor = parsed.anchor;
    var dbnfo  = '|' + _db_domain + '|';

    
    if ( anchor.indexOf(dbnfo) !== 0 ) {
        //console.log( 'anchor ' + anchor + ' does not have db domain ' + dbnfo);
        //console.log( anchor.indexOf(dbnfo) );
        return null;
    } else {
        //console.log( 'anchor ' + anchor + ' has db domain ' + dbnfo);
        anchor = anchor.substring(dbnfo.length, anchor.length);
        //console.log( 'anchor ' + anchor);
    }


    if (anchor !== '') {
        //console.log('has anchor');
        var data64 = null;
        try {
            data64 = decodeObj( anchor );
        } catch(e) {
            console.log('invalid 64');
            console.log(anchor      );
            return null;
        }

        console.log('replacing preferences with %o', data64);
        //localDb.saveDataDb('_queries_redo', data64);

        redoQueries(data64);
    }

    console.timeStamp('end getQueryString');
    console.timeEnd('getQueryString');
    console.groupEnd('getQueryString');
};


function setQueryString ( ) {
    console.group('setQueryString');
    console.timeStamp('begin setQueryString');
    console.time('setQueryString');

    var data_db = localDb.getDataDb('_queries');
    
    var parsed = parseUri(document.URL);
    var anchor = parsed.anchor;

    if ( data_db.length === 0 ) {
        console.log('nothing to save');
        return null;
    }

    var data64 = encodeObj( data_db );

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

    console.timeStamp('end setQueryString');
    console.timeEnd('setQueryString');
    console.groupEnd('setQueryString');
};


function redoQueries ( qries ) {
    console.group('redoQueries %o', qries);
    console.timeStamp('begin redoQueries');
    console.time('redoQueries');

    console.log( qries );
    // TURN OFF PREFERENCES

    if (qries) {
        for ( var d = 0; d < qries.length; d++ ) {
            var data = qries[d];
            var qid  = data[ 0 ];
            var cfg  = data[ 1 ];
            var vals = decodeObj( qid );
            console.log( 'qid  %s', qid  );
            console.log( 'cfg  %s', cfg  );
            console.log( 'vals %o', vals );
            processVals( vals, cfg );
        }
    }
    // TURN PREFERENCES BACK ON

    console.timeStamp('end redoQueries');
    console.timeEnd('redoQueries');
    console.groupEnd('redoQueries');
};


function getInitState ( qid ) {
    console.group('getInitState qid "%s"', qid);
    console.timeStamp('begin getInitState');
    console.time('getInitState');
    console.log('begin getInitState qid "%s"', qid);

    var res   = null;
    var qries = localDb.getOpt( '_queries', '_queries', null );
    
    //console.log('getting init state '+qid);
    //console.log(qries);
    
    if (qries) {
        //console.log('there are initial states');
        for ( var q = 0; q < qries.length; q++ ) {
            var data = qries[ q ];
            var vqid = data[0];
            var vval = data[1];
            //console.log( 'db qid ' + vqid + ' val ' + vval);
            if ( vqid == qid ) {
                res = vval;
                //console.log( 'qid ' + qid + ' has initial value: ' + JSON.stringify( vval ) );
                break;
            }
        }
    } else {
        //console.log( 'no init state')
    }

    console.log('end getInitState qid "%s" >> %o', qid, res);
    console.timeStamp('getInitState');
    console.timeEnd('getInitState');
    console.groupEnd('getInitState qid "%s"', qid);
    
    return res;
}



//function basename(path) {
//    return path.replace(/\\/g,'/').replace( /.*\//, '' );
//}



//registerKeyboardHandler = function(callback) {
//  var callback = callback;
//  d3.select(window).on("keydown", callback);
//};


//http://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
//document.addEventListener('DOMContentLoaded', start );



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
