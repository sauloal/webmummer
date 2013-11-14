#!/usr/bin/env python
import sys, os
import subprocess
import re


labelFields = {
    'refName'    : ['(\S+?)_SL2.40ch\d+'                       , os.path.basename],
    'chromNumber': ['SL2.40ch(\d+)'                            , None],
    'spp'        : ['_\._(\S+)_scaffold_final\.assembly\.fasta', None],
    'status'     : ['\.fasta(\S+)'                             , None]
}

titleFmt  = '%(refName)s vs %(spp)s - Chromosome %(chromNumber)s - %(status)s'
xlabelFmt = '%(refName)s Chromosome %(chromNumber)s'
ylabelFmt = '%(spp)s'



for k in labelFields:
    labelFields[k][0] = re.compile( labelFields[k][0] )

statusMatch  = {
    '.delta'               : 'Raw Dot Plot',
    '.delta.q.delta'       : 'Clean Dot Plot',
    '.delta.q.delta.filter': 'Clean & Filtered Dot Plot',
    '.delta.q.delta.filter.invertions.delta': 'Clean & Filtered Dot Plot. Only Inversions',
}

def statusMatcher( status ):
    try:
        return statusMatch[ status ]
    except:
        print "status %s does not have a name" % status
        sys.exit(1)

labelFields['status'][1]= statusMatcher

pointFmt = "[{x:%d,y:%d},{x:%d,y:%d},{n:%d,s:%d,q:%.2f}],"
pointFmt = "[%d,%d,%d,%d,%d,%d,%.2f],"


#solanum_lycopersicum_heinz_SL2.40ch12.fa_._solanum_pennellii_scaffold_final.assembly.fasta.delta.q.delta.fplot
#solanum_lycopersicum_heinz_SL2.40ch12.fa_._solanum_pennellii_scaffold_final.assembly.fasta.delta.q.delta.rplot

#-- reverse hits sorted by %sim
#0 0 0
#0 0 0


#18542978 36303894 83.8077999012671
#18549032 36297865 83.8077999012671


class exp(object):
    def __init__(self, outfile, title="title", xlabel="xlabel", ylabel="ylabel"):
        self.title  = title
        self.xlabel = xlabel
        self.ylabel = ylabel
        self.outf   = outfile

        self.minX   = sys.maxint
        self.maxX   = 0

        self.minY   = sys.maxint
        self.maxY   = 0

        self.spps   = {}

        self.fhd    = open(outfile, 'w')

        self.fhd.write("""\
var title  = '%s';
var xlabel = '%s';
var ylabel = '%s';

var points = [
""" % (self.title, self.xlabel, self.ylabel))

    def append(self, x1, y1, x2, y2, name, sense, q):
        if name not in self.spps:
            self.spps[name] = len(self.spps)

        name  = self.spps[name]

        sense = 0 if sense == 'fwd' else 1

        line  = pointFmt % ( x1, y1, x2, y2, name, sense, q )

        self.fhd.write( line )

        if x1 > self.maxX: self.maxX = x1
        if x2 > self.maxX: self.maxX = x2

        if x1 < self.minX: self.minX = x1
        if x2 < self.minX: self.minX = x2

        if y1 > self.maxY: self.maxY = y1
        if y2 > self.maxY: self.maxY = y2

        if y1 < self.minY: self.minY = y1
        if y2 < self.minY: self.minY = y2


    def add(self, sense, reg):
        #print "adding", reg
        refStart, refEnd, tgtStart, tgtEnd, targetStart, targetEnd, refLen, tgtLen, refSub, tgtSub, idd, refName, tgtName = reg

        self.append( refStart, targetStart, refEnd, targetEnd, tgtName, sense, idd )

    def addOld(self, sense, reg):
        #print "SENSE ", sense, " REG ", reg
        x1   = int(   reg[0][0] )
        y1   = int(   reg[0][1] )
        x2   = int(   reg[1][0] )
        y2   = int(   reg[1][1] )
        q    = float( reg[0][2] )

        self.append( x1, y1, x2, y2, '', sense, q)


    def close(self):
        line = """\
];

var xmin   = %12d;
var xmax   = %12d;

var ymin   = %12d;
var ymax   = %12d;
var spps   = [\
""" % ( self.minX, self.maxX, self.minY, self.maxY )

        for spp in sorted(self.spps, key=lambda p: self.spps[p]):
            #print "spp %s p %d" % (spp, self.spps[spp])
            line += "'%s'," % spp

        line += '];'

        self.fhd.write( line )

        self.fhd.close()


#var points = [
#    [{x:  0,   y:   1}, {x:   1,   y:   2}, {n: 'first'  , s: 'f'}],
#    [{x:  2,   y:   3}, {x:   3,   y:   5}, {n: 'second' , s: 'f'}],
#    [{x:  4,   y:  13}, {x:   5,   y:   8}, {n: 'third'  , s: 'r'}],
#    [{x:  6,   y:  21}, {x:   7,   y:  34}, {n: 'fourth' , s: 'f'}],
#    [{x:  8,   y:  55}, {x:   9,   y:  89}, {n: 'fifth'  , s: 'f'}],
#    [{x: 10,   y: 144}, {x:  11,   y:1033}, {n: 'sixth'  , s: 'f'}],
#];
#
#var xmin   =    0;
#var xmax   =   30;
#
#var ymin   =    0;
#var ymax   = 1100;
#
#var xlabel = 'xlabel';
#var ylabel = 'ylabel';
#
#var title  = 'title';
#


def parseDelta(delta):
    show_coords = "../show-coords -l -r -T %s" % (delta)
    print show_coords
    coords      = subprocess.Popen(show_coords, stdout=subprocess.PIPE, shell=True).communicate()[0]
    scafOrder   = []
    scafLens    = {}
    lineCount   = 0

    for line in coords.split("\n"):
        lineCount += 1
        line       = line.strip()
        #print line

        if len(line) == 0  : continue
        if lineCount < 5   : continue

        cols = line.split("\t")
        #print cols
        refStart    , refEnd    , tgtStart, tgtEnd, refLen, tgtLen = [ int(  x)  for x in cols[ 0: 6] ]
        idd                                                        =   float(cols[6])
        referenceLen, targetLen                                    = [ int(  x)  for x in cols[ 7: 9] ]
        refName     , tgtName                                      = [ x.strip() for x in cols[ 9:11] ]

        refSub = refEnd - refStart
        tgtSub = tgtEnd - tgtStart

        #print "tgt name  %-15s start %9d end %9d len %9d size %9d sub %9d" % ( tgtName, tgtStart, tgtEnd, tgtLen, targetLen   , tgtSub )
        #print "ref name  %-15s start %9d end %9d len %9d size %9d sub %9d" % ( refName, refStart, refEnd, refLen, referenceLen, refSub )
        #print "identity  %.2f"                                             % ( idd                                                     )
        #print

        refMin = min( refStart, refEnd )
        refMax = max( refStart, refEnd )
        tgtMin = min( tgtStart, tgtEnd )
        tgtMax = max( tgtStart, tgtEnd )
        d      = [refStart, refEnd, tgtStart, tgtEnd, refLen, tgtLen, refSub, tgtSub, idd, refName, tgtName]
        #print d

        if tgtName in scafLens:
            prevRefStart = scafLens[tgtName][0]
            prevRefEnd   = scafLens[tgtName][1]

            if refMin < prevRefStart:
                scafLens[tgtName][0] = refMin

            if refMax > prevRefEnd:
                scafLens[tgtName][1] = refMax


            prevTgtStart = scafLens[tgtName][3]
            prevTgtEnd   = scafLens[tgtName][4]

            if tgtMin < prevTgtStart:
                scafLens[tgtName][3] = tgtMin

            if tgtMax > prevTgtEnd:
                scafLens[tgtName][4] = tgtMax

            scafLens[tgtName][6].append(d)

        else:
            #                    0       1       2             3       4       5          6
            scafLens[tgtName] = [refMin, refMax, referenceLen, tgtMin, tgtMax, targetLen, [d]]

    scafOrder = sorted(scafLens.keys(), key=lambda s: scafLens[s][0])
    #print scafOrder


    return ( scafOrder, scafLens )




def genCoords(exporter, scafOrder, scafLens):
    targetPos = 1
    for tgtName in scafOrder:
        #print tgtName
        refMin, refMax, referenceLen, tgtMin, tgtMax, targetLen, coordsData = scafLens[tgtName]
        #refSize = refMax - refMin

        tgtSize = tgtMax - tgtMin

        if tgtSize > targetLen:
            print "error"

        alignmentEnd = targetPos + targetLen

        for line in coordsData:
            refStart, refEnd, tgtStart, tgtEnd, refLen, tgtLen, refSub, tgtSub, idd, refName, tgtName = line
            #print line
            targetStart = targetPos + tgtStart
            targetEnd   = targetPos + tgtEnd

            plotStr    = """%d %d %.2f\n%d %d %.2f\n\n\n""" %   (
                    targetStart, refStart, idd,
                    targetEnd  , refEnd  , idd,
                )

            #print targetEnd, targetStart, alignmentEnd

            if targetEnd   > alignmentEnd:
                print " error"

            if targetStart > alignmentEnd:
                print " error"

            if abs(tgtSub) > abs(refSub * 1.1):
                #print " target size %d > ref size %d"  % (tgtSub, refSub)
                pass

            if (abs(tgtSub) > targetLen) or (abs(refSub) > (targetLen*1.1)):
                print "incongruency"
                print "tgt name  %-15s start %9d end %9d len %9d size %9d sub %9d" % ( tgtName, tgtStart, tgtEnd, tgtLen, targetLen   , tgtSub )
                print "ref name  %-15s start %9d end %9d len %9d size %9d sub %9d" % ( refName, refStart, refEnd, refLen, referenceLen, refSub )
                print "identity  %.2f"                                             % ( idd                                                     )
                print "tgtSub", abs(tgtSub), "targetLen   ", targetLen
                print "refSub", abs(refSub), "referenceLen", referenceLen
                print plotStr
                print
                sys.exit(1)


            #print "tgt name  %-15s start %9d end %9d len %9d size %9d sub %9d" % ( tgtName, tgtStart, tgtEnd, tgtLen, targetLen   , tgtSub )
            #print "ref name  %-15s start %9d end %9d len %9d size %9d sub %9d" % ( refName, refStart, refEnd, refLen, referenceLen, refSub )
            #print "identity  %.2f"                                             % ( idd                                                     )
            #print "tgtSub", abs(tgtSub), "targetLen   ", targetLen
            #print "refSub", abs(refSub), "referenceLen", referenceLen
            #print plotStr

            reg = ( refStart, refEnd, tgtStart, tgtEnd, targetStart, targetEnd, refLen, tgtLen, refSub, tgtSub, idd, refName, tgtName )

            if tgtSub > 0: # fwd
                exporter.add('fwd', reg )

            else: # rev
                exporter.add('rev', reg )

        targetPos += targetLen + 1

    print "last pos", targetPos



def parseFN(infile):
    bn = os.path.basename( infile )
    #solanum_lycopersicum_heinz_SL2.40ch00.fa_._solanum_arcanum_scaffold_final.assembly.fasta.delta

    print "parsing %s" % infile

    res = {}

    for label in sorted( labelFields ):
        fmt = labelFields[label][0]
        fun = labelFields[label][1]
        try:
            val = fmt.search(infile).group(1)

            val = val.replace('_', ' ')

            if fun is not None:
                val = fun( val )

            print '%s = "%s"' % ( label, val )

            res[label] = val
        except:
            print "error parsing %s in file name: %s using format %s" % (label, infile, fmt.pattern)
            sys.exit(1)

    return res

def main():
    for infile in sys.argv[1:]:
        if not infile.endswith( '.delta' ):
            continue

        if     infile.endswith( '.invertions.delta.q.delta' ):
            continue


        outfile  = infile + '.js'
        print "INFILE : %s" % infile
        print "OUTFILE: %s" % outfile

        labels = parseFN( infile )

        title  = titleFmt  % labels
        xlabel = xlabelFmt % labels
        ylabel = ylabelFmt % labels

        print "parsing delta"
        scafOrder, scafLens = parseDelta(infile)


        print "parsing coords"
        exporter = exp(outfile, title=title, xlabel=xlabel, ylabel=ylabel)
        genCoords(exporter, scafOrder, scafLens)
        exporter.close()

    print "done"

if __name__ == '__main__': main()
