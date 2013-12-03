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


/*
 *
 * START function
 *
 */
function start () {
    /*
    * Creates page elements
    */


    if ( !webmummer_debug ) {
        function dumper () {};
        console.log            = dumper;
        console.timeStamp      = dumper;
        console.time           = dumper;
        console.groupCollapsed = dumper;
        console.timeEnd        = dumper;
        console.groupEnd       = dumper;
    };


    console.groupCollapsed('start');
    console.timeStamp(     'begin start');
    console.time(          'start');




    draw();




    graphdb = new SyncSimpleGraph( {
        sync   : function () { var val = getFieldValue( 'sync'    ); return  val === null ? true : val; },
        resizeX: function () { var val = getFieldValue( 'resizeX' ); return  val === null ? true : val; },
        resizeY: function () { var val = getFieldValue( 'resizeY' ); return  val === null ? true : val; }
    });
    //graphdb = new SyncSimpleGraph( true );


    document.body.addEventListener( 'd3SyncChanged' , updateQuery, false );


    getQueryString();


    //document.getElementById('okb').onclick();
    console.timeStamp('end start');
    console.timeEnd(  'start');
    console.groupEnd( 'start');
};







/*
 *
 *PROCESSING FUNCTIONS
 *
 */
processVals = function ( vals, cfg, initState ){
    console.groupCollapsed('processVals vals %o cfg %o init state %o', vals, cfg, initState);
    console.timeStamp(     'begin processVals');
    console.time(          'processVals');
    console.log(           'begin processVals %o cfg %o', vals, cfg);

    var self           = this;
    self.vals          = vals;
    self.cfg           = cfg;
    self.initState     = initState;
    self.qid           = encodeObj( { 'vals': self.vals, 'cfg': self.cfg } );

    self.getRegister();

    console.log(      'end processVals qid %s', self.qid);
    console.timeStamp('end processVals');
    console.timeEnd(  'processVals');
    console.groupEnd( 'processVals vals %o cfg %o init state %o', vals, cfg, initState);
};


processVals.prototype.getRegister = function ( ) {
    var self = this;

    console.groupCollapsed('processVals.getRegister %o', self.vals);
    console.timeStamp(     'begin processVals.getRegister');
    console.time(          'processVals.getRegister');
    console.log(           'begin processVals.getRegister %o', self.vals);

    var self           = this;
    self.dvals         = {};
    self.evals         = [];

    for ( var key in opts ) {
        var val         = self.vals[ key ];
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



    if (self.cfg.horizontal) {
        if ( self.dvals.refName.length != 1 ) {
            alert( 'more than one reference while using horizontal graph '  + self.dvals.refName.length  + ' ' + self.dvals.refName );
            return null;
        }

        if ( self.dvals.refChrom.length != 1 ) {
            alert( 'more than one chromosome while using horizontal graph ' + self.dvals.refChrom.length + ' ' + self.dvals.refChrom);
            return null;
        }
    }



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


    console.log(      'end processVals.getRegister %o >> %o', self.vals, self.evals);
    console.timeStamp('end processVals.getRegister');
    console.timeEnd(  'processVals.getRegister');
    console.groupEnd( 'processVals.getRegister %o', self.vals);


    self.regs          = [];

    for ( var e = 0; e < self.evals.length; e++ ) {
        var vals = self.evals[e];
        var reg  = {
                qry: vals,
                res: {},
                nfo: {},
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
        reg.nfo.qid        = self.qid;
        if ( self.cfg.horizontal) {
            reg.nfo.pid        = encodeObj( self.vals );
        } else {
            reg.nfo.pid        = encodeObj( vals );
        }
        reg.nfo.filepath   = datafolder + reg.res.filename;
        reg.nfo.scriptid   = 'script_'  + reg.nfo.uid;
        self.regs.push( reg );
    }


    if (self.regs.length === 0) {
        console.log('nore valid register');
        return null;
    }

    console.log(      'end processVals.parseRegisters %o >> %o', self.evals, self.regs);
    console.timeStamp('end processVals.parseRegisters');
    console.timeEnd(  'processVals.parseRegisters');
    console.groupEnd( 'processVals.parseRegisters %o', self.evals);



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
        return null;
    }

    var func  = function( sregv ) { loadScript( sregv, self.receive() ); };

    self.regs.map( function(reg) {
        var file   = reg.res.filename;

        self.sentData.push( file );

        if (file) {
            console.log( 'sending ' + file );
            func( reg );
        }
    });

    console.log(      'end processVals.send %o', self.regs);
    console.timeStamp('end processVals.send');
    console.timeEnd(  'processVals.send');
    console.groupEnd( 'processVals.send %o', self.regs);
};


processVals.prototype.receive = function ( ) {
    var self = this;

    return function( reg ) {
        console.groupCollapsed('processVals.receive %o', reg);
        console.timeStamp(     'begin processVals.receive');
        console.time(          'processVals.receive');
        console.log(           'begin processVals.receive %o', reg);

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

        console.log(      'end processVals.receive %o >> %o', reg, self.receivedData);
        console.timeStamp('end processVals.receive');
        console.timeEnd(  'processVals.receive');
        console.groupEnd( 'processVals.receive %o', reg);
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

    console.groupCollapsed('processVals.loadGraph %o', self.receivedData);
    console.timeStamp(     'begin processVals.loadGraph');
    console.time(          'processVals.loadGraph');
    console.log(           'begin processVals.loadGraph %o', self.receivedData);


    if (self.cfg.horizontal) {
        var hreg           = self.mergeregs( );

        hreg.cfg           = self.cfg;
        hreg.cfg.initState = self.initState;

        console.log( 'plotting register %o', hreg );

        graphdb.add(chartName, hreg);

    } else {
        self.receivedData.map( function( reg ) {
            var sreg = self.simplifyReg( reg );

            console.log( 'plotting register %o', sreg );

            sreg.cfg           = self.cfg;
            sreg.cfg.initState = self.initState;

            graphdb.add(chartName, sreg);

            return null;
        });
    }


    console.log(      'end processVals.loadGraph %o', self.receivedData);
    console.timeStamp('end processVals.loadGraph');
    console.timeEnd(  'processVals.loadGraph');
    console.groupEnd( 'processVals.loadGraph %o', self.receivedData);
};


processVals.prototype.mergeregs = function ( ) {
    var self = this;

    console.groupCollapsed('processVals.mergeregs %o', self.receivedData);
    console.timeStamp(     'begin processVals.mergeregs');
    console.time(          'processVals.mergeregs');
    console.timeStamp(     'begin processVals.mergeregs %o', self.receivedData);


    var hreg         = {};
    var yTicksLabels = [];


    //console.log(regs);


    for ( var r = 0; r < self.receivedData.length; r++ ) {
        var reg = self.receivedData[r];

        yTicksLabels[r] = [];

        for ( var cls in reg ) {
            if ( !hreg[cls] ) {
                hreg[cls] = {};
            }

            for ( var scls in reg[cls] ) {
                var val = reg[cls][scls];

                if ( !hreg[cls][scls] ) {
                    hreg[cls][scls] = [];
                }

                if ( hreg[cls][scls].indexOf( val ) == -1 ) {
                    hreg[cls][scls].push( val );
                }
            }
        }
    }


    //console.log(hreg);


    var sreg = self.simplifyReg( hreg );


    //console.log(sreg);


    for ( var cls in sreg ) {
        var vals = sreg[ cls ];

        if ( vals ) {

            if ( Object.prototype.toString.call( vals ) === '[object Array]' ) {
                var uniqueArray = vals.filter(function(elem, pos) {
                    return vals.indexOf(elem) == pos;
                });

                if (uniqueArray.length == 1) {
                    if (['tgts', 'points'].indexOf(v) == -1) {
                        sreg[ cls ] = vals[0];
                    }
                }
            }
        }
    }


    //console.log(sreg);


    sreg.uid = [];
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
                sreg.uid.push(val);
                yTicksLabels[h].push( val );
            }
        } else {
            sreg.uid.push(uniqueArray[0]);
        }
    }
    sreg.uid          = sreg.uid.join('').replace(/[^a-z0-9]/gi, '').replace(/[^a-z0-9]/gi, '')


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


    console.log(sreg);


    var refs          = joinVals( sreg.qry.refName  );
    var refsCr        = joinVals( sreg.qry.refChrom );
    var tgts          = joinVals( sreg.qry.tgtName  );
    var tgtsCr        = joinVals( sreg.qry.tgtChrom );
    var sts           = joinVals( sreg.qry.status   );
    var ylabel        = joinVals( sreg.ylabel       );
    var xlabel        = joinVals( sreg.xlabel       );

    sreg.cfg          = self.cfg;

    sreg.title        = refs + ' #' + refsCr + ' vs ' + tgts  + ' #' + tgtsCr + ' - Status ' + sts;
    sreg.ylabel       = ylabel;
    sreg.xlabel       = xlabel;
    sreg.yTicksLabels = yTicksLabels;


    //console.log(sreg);


    console.log(      'end processVals.mergeregs %o >> %o', self.receivedData, sreg);
    console.timeStamp('end processVals.mergeregs');
    console.timeEnd(  'processVals.mergeregs');
    console.groupEnd( 'processVals.mergeregs %o', self.receivedData);

    return sreg;
};


processVals.prototype.simplifyReg = function ( reg ) {
    var self = this;

    console.groupCollapsed('processVals.simplifyReg %o', reg);
    console.timeStamp(     'begin processVals.simplifyReg');
    console.time(          'processVals.simplifyReg');
    console.log(           'begin processVals.simplifyReg %o', reg);


    var res  = [];
    var keys = ['res', 'nfo'];
    for ( var c in keys ) {
        var cls = keys[ c ];
        for ( var k in reg[ cls ] ) {
            res[ k ] = reg[ cls ][ k ];
        }
    }

    res.qry = reg.qry;
    res.cfg = reg.cfg;

    console.log(      'end processVals.simplifyReg %o >> %o', reg, res);
    console.timeStamp('end processVals.simplifyReg');
    console.timeEnd(  'processVals.simplifyReg');
    console.groupEnd( 'processVals.simplifyReg %o', reg);

    return res;
};







/*
 *
 *DB FUNCTIONS
 *
 */
LocalStorageDb = function ( prog_domain, db_domain ) {
    this.progDomain = prog_domain;
    this.dbDomain   = db_domain;
};


LocalStorageDb.prototype.saveOpt = function ( data_domain, key , value ) {
    var self = this;

    console.groupCollapsed('LocalStorageDb.saveOpt data_domain "%s" key "%s" value %o', data_domain, key, value);
    console.timeStamp(     'begin LocalStorageDb.saveOpt');
    console.time(          'LocalStorageDb.saveOpt');
    console.log(           'begin LocalStorageDb.saveOpt "%s" key "%s" value %o', data_domain, key, value);

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
    }

    console.log(      'end LocalStorageDb.saveOpt "%s" key "%s" value %o', data_domain, key, value);
    console.timeStamp('end LocalStorageDb.saveOpt');
    console.timeEnd(  'LocalStorageDb.saveOpt');
    console.groupEnd( 'LocalStorageDb.saveOpt "%s" key "%s" value %o', data_domain, key, value);
};


LocalStorageDb.prototype.getOpt = function ( data_domain, key, dflt ) {
    var self = this;

    console.groupCollapsed('LocalStorageDb.getOpt data_domain "%s" key "%s" default %o', data_domain, key, data_domain);
    console.timeStamp(     'begin LocalStorageDb.getOpt');
    console.time(          'LocalStorageDb.getOpt');
    console.log(           'begin LocalStorageDb.getOpt "%s" key "%s" default %o', data_domain, key, data_domain);

    var val     = dflt;
    var data_db = self.getDataDb( data_domain );

    if ( data_db ) {
        var res = data_db[key];
        if ( res !== null && res !== undefined ) {
            val = res;
        }
    }

    //console.log( 'returning ' + val );

    console.log(      'end LocalStorageDb.getOpt "%s" key "%s" default %o >> %o', data_domain, key, data_domain, val);
    console.timeStamp('end LocalStorageDb.getOpt');
    console.timeEnd(  'LocalStorageDb.getOpt');
    console.groupEnd( 'LocalStorageDb.getOpt "%s" key "%s" default %o', data_domain, key, data_domain);

    return val;
};


LocalStorageDb.prototype.getDataDb = function ( data_domain ){
    var self = this;

    console.groupCollapsed('LocalStorageDb.getDataDb data_domain "%s"', data_domain);
    console.timeStamp(     'begin LocalStorageDb.getDataDb');
    console.time(          'LocalStorageDb.getDataDb');
    console.log(           'begin LocalStorageDb.getDataDb data_domain "%s"', data_domain);

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

    console.log(      'end LocalStorageDb.getDataDb data_domain "%s" >> %o', data_domain, data_db);
    console.timeStamp('end LocalStorageDb.getDataDb');
    console.timeEnd(  'LocalStorageDb.getDataDb');
    console.groupEnd( 'LocalStorageDb.getDataDb data_domain "%s"', data_domain);
    return data_db;
};


LocalStorageDb.prototype.saveDataDb = function ( data_domain, data_db ) {
    var self = this;

    console.groupCollapsed('LocalStorageDb.saveDataDb data_domain "%s" data_db %o', data_domain, data_db);
    console.timeStamp(     'begin LocalStorageDb.saveDataDb');
    console.time(          'LocalStorageDb.saveDataDb');
    console.log(           'begin LocalStorageDb.saveDataDb data_domain "%s" data_db %o', data_domain, data_db);

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

    console.log(      'end LocalStorageDb.saveDataDb data_domain "%s" data_db %o', data_domain, data_db);
    console.timeStamp('end LocalStorageDb.saveDataDb');
    console.timeEnd(  'LocalStorageDb.saveDataDb');
    console.groupEnd( 'LocalStorageDb.saveDataDb data_domain "%s" data_db %o', data_domain, data_db);
};


LocalStorageDb.prototype.clearDb = function ( data_domain ) {
    var self = this;

    self.saveDataDb(data_domain, null);
};


LocalStorageDb.prototype.getDb = function ( ) {
    var self = this;

    console.groupCollapsed('LocalStorageDb.getDb');
    console.timeStamp(     'begin LocalStorageDb.getDb');
    console.time(          'LocalStorageDb.getDb');
    console.log(           'begin LocalStorageDb.getDb');

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

    console.log(      'end LocalStorageDb.getDb >> %o', res);
    console.timeStamp('end LocalStorageDb.getDb');
    console.timeEnd(  'LocalStorageDb.getDb');
    console.groupEnd( 'LocalStorageDb.getDb');

    return res;
};


function updateQuery ( e ) {
    var self = this;

    console.groupCollapsed('updateQuery %o', e);
    console.timeStamp(     'begin updateQuery');
    console.time(          'updateQuery');
    console.log(           'begin updateQuery %o', e);

    //console.log( new Error().stack );
    //console.log( e );
    var qries = JSON.parse( JSON.stringify( e.detail.el ) );
    var src   = e.detail.src;
    console.log( 'queries %o', qries );

    var res   = [];
    for ( var qid in qries ) {
        var dqid  = decodeObj( qid );
        var subq  = qries[ qid ];
        console.log( 'qid %o\n\tdqid %o\n\tsubq %o', qid, dqid, subq );

        for ( var pid in subq ) {
            var dpid  = decodeObj( pid );
            var setup = subq[ pid ];

            console.log( 'pid %s \tdpid %o', pid, dpid );

            var outp  = {
                    'status' : setup.status,
                    'options': setup.options,
                    'vals'   : dpid
                };

            console.log( 'qid %s\n\tpid %s\n\tdqid %o\n\tdpid %o\n\tsetup %o\n\tout %o', qid, pid, dqid, dpid, setup, outp );
            res.push( outp );
        }
    }

    console.log( 'queries src "%s" %o', src, res );

    setQueryString ( res );

    console.log(      'end updateQuery %o', e);
    console.timeStamp('end updateQuery');
    console.timeEnd(  'updateQuery');
    console.groupEnd( 'updateQuery %o', e);
};












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
    if ( Object.prototype.toString.call( vals ) === '[object Array]' ) {
        var res = vals.filter(function(elem, pos) {
            return vals.indexOf(elem) == pos;
        });

        if (res.length == 1) {
            return res.join('+');
        } else {
            return '(' + res.join('+') + ')';
        }
    } else {
        return vals;
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
    console.groupCollapsed('loadScript %o', reg);
    console.timeStamp(     'begin loadScript');
    console.time(          'loadScript');
    console.log(           'begin loadScript %o', reg);

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

    console.log(      'end loadScript %o', reg);
    console.timeStamp('end loadScript');
    console.timeEnd(  'loadScript');
    console.groupEnd( 'loadScript %o', reg);
};









/*
 *
 *URL FUNCTIONS
 *
 */
function setQueryString ( data ) {
    console.groupCollapsed('setQueryString %o', data);
    console.timeStamp(     'begin setQueryString');
    console.time(          'setQueryString');


    var parsed  = parseUri( document.URL );
    var anchor  = parsed.anchor;

    var data64  = encodeObj( data );

    var dbnfo   = '|' + _db_domain + '|';
    var nurl    = dbnfo + data64;

    if ( anchor != nurl) {
        console.log( 'current url and current config differ');
        //console.log(anchor);
        //console.log(data64);
        //console.log(nurl);
        console.log( 'setting url %s', nurl);
        window.location.hash = nurl;
        //console.log(data64.length);
    } else {
        console.log( 'current url and current config are equal');
        //console.log(anchor.length);
    }

    console.timeStamp('end setQueryString');
    console.timeEnd(  'setQueryString');
    console.groupEnd( 'setQueryString');
};


function getQueryString ( ) {
    console.groupCollapsed('getQueryString');
    console.timeStamp(     'begin getQueryString');
    console.time(          'getQueryString');


    var parsed = parseUri(document.URL);
    var anchor = parsed.anchor;
    var dbnfo  = '|' + _db_domain + '|';


    if ( anchor.indexOf(dbnfo) !== 0 ) {
        console.log( 'anchor ' + anchor + ' does not have db domain ' + dbnfo);
        console.log( anchor.indexOf(dbnfo) );

        anchor = '';
    } else {
        console.log( 'anchor ' + anchor + ' has db domain ' + dbnfo);
        anchor = anchor.substring(dbnfo.length, anchor.length);
        console.log( 'anchor ' + anchor);
    }


    if (anchor !== '') {
        //console.log('has anchor');
        var data64 = null;

        try {
            data64 = decodeObj( anchor );

        } catch(e) {
            console.log('invalid 64');
            console.log(anchor      );
        }

        if ( data64 ) {
            console.log('replacing preferences with %o', data64);

            redoQueries( data64 );
        } else {
            console.log('empty data');
        }
    } else {
        console.log('empty anchor');
    }

    console.timeStamp('end getQueryString');
    console.timeEnd(  'getQueryString');
    console.groupEnd( 'getQueryString');
};


function redoQueries ( qries ) {
    console.groupCollapsed('redoQueries %o', qries);
    console.timeStamp(     'begin redoQueries');
    console.time(          'redoQueries');


    if (qries) {
        for ( var d = 0; d < qries.length; d++ ) {
            var data   = qries[d];
            var opts   = data[ 'options' ];
            var status = data[ 'status'  ];
            var vals   = data[ 'vals'    ];

            console.log( 'd %d opts   %o', d, opts   );
            console.log( 'd %d status %o', d, status );
            console.log( 'd %d vals   %o', d, vals   );

            new processVals( vals, opts, status );
        }
    }


    console.timeStamp('end redoQueries');
    console.timeEnd(  'redoQueries');
    console.groupEnd( 'redoQueries');
};





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
