#!/usr/bin/python
import os, sys

config = sys.argv[1]
if not os.path.exists( config ):
    print "config does not exists"
    sys.exit(1)

genomes          = {}
notinsource      = []
notindestiny     = []
dosymetrical     = True
doreciprocal     = True
create_make_file = True
html2pdf         = None
pdf2img          = None
maxX             = -1
maxY             = -1


html2pdf         = "wkhtmltopdf --dpi 450 --no-background --page-size A0 %(in)s %(out)s" # --orientation <orientation>     Set orientation to Landscape
pdf2img          = "pdftocairo -png -r 300 -singlefile %(in)s %(out)s"
#html2pdf         = "html2ps %(in)s | ps2pdf - %(out)s"

compress_html    = True

execfile(config)

makefile         = []

def mapgenomes( org1, org2 ):
    #all against all one by one
    reportouter = ["<html>"]
    reportouter.append( """
        <head>
            <base target="_blank">
            <style type="text/css">
                img {
                    width:  250px;
                    heigth: 250px;
                }
                table {
                    border: none;
                    border-spacing: 0px;
                    border-collapse: collapse;
                    padding: 0px;
                }
            </style>
            <script type="text/javascript">
                //document.domain = "file:///";
                function openimage() {
                    console.log("CLICK");
                    var objSrc = this.getAttribute('src');
                    window.open(objSrc);
                }
                window.onload = function() {
                    var images = document.getElementsByTagName("img");
                    if ( images && images.length > 0 ) {
                        for ( var el = 0; el < images.length; el++ ) {
                            var iel = images[el];
                            //console.log("EL "+el+" "+bel);
                            iel.addEventListener('click', openimage);
                        }
                    }

                    var wHeight = document.body.scrollHeight;
                    var wWidth  = document.body.scrollWidth;
                    console.log("SOURCE SIZE " + [wHeight, wWidth])
                    window.parent.postMessage([wHeight, wWidth], '*');
                }
            </script>
        </head>
        <body>
    """)
    reportouter.append("\t\t<table>"      )
    reportouter.append("\t\t\t<tr>"       )
    reportouter.append("\t\t\t\t<td></td>")

    org1data   = genomes[ org1    ]
    org1name   = org1data['name'  ]
    org1folder = org1data['folder']
    org1prefix = org1data['prefix']
    org1begin  = org1data['begin' ]
    org1end    = org1data['end'   ]
    org1fmt    = org1data['fmt'   ]

    org2data   = genomes[ org2    ]
    org2name   = org2data['name'  ]
    org2folder = org2data['folder']
    org2prefix = org2data['prefix']
    org2begin  = org2data['begin' ]
    org2end    = org2data['end'   ]
    org2fmt    = org2data['fmt'   ]

    outfiles   = []

    outfolder  = "%s_%s" % ( org1, org2 )

    for org2num in range(org2begin, org2end+1):
        if maxY > 0 and org2num > maxY:
            break
        org2str = org2fmt % org2num
        reportouter.append("\t\t\t\t<td><i>%s</i> Chromosome %s</td>" % (org2name, org2str))

    reportouter.append("\t\t\t</tr>")

    if not os.path.exists( outfolder ):
        os.makedirs( outfolder )

    for org1num in reversed(range(org1begin, org1end+1)):
        if maxY > 0 and org1num > maxY:
            break
        org1str     = org1fmt      % org1num
        org1fasta   = "%s/%s%s.fa" % ( org1folder, org1prefix, org1str )
        org1short   = "%s%s"       % ( org1      , org1str             )
        org1seqname = ""
        with open(org1fasta, 'r') as fhd:
            for line in fhd:
                line = line.strip()
                if len(line) == 0: continue
                if line[0]   == '>':
                    org1seqname = line[1:]
                    try:
                        ind = org1seqname.index(" ")
                        org1seqname = org1seqname[:ind]
                    except:
                        pass
                    break


        reportouter.append("\t\t\t<tr>\n\t\t\t\t<td><i>%s</i> Chromosome %s</td>" % (org1name, org1str))

        for org2num in range(org2begin, org2end+1):
            if maxX > 0 and org2num > maxX:
                break
            org2str     = org2fmt % org2num
            org2fasta   = "%s/%s%s.fa" % ( org2folder, org2prefix, org2str )
            org2short   = "%s%s"       % ( org2      , org2str             )
            org2seqname = ""
            with open(org2fasta, 'r') as fhd:
                for line in fhd:
                    line = line.strip()
                    if len(line) == 0: continue
                    if line[0]   == '>':
                        org2seqname = line[1:]
                        try:
                            ind = org2seqname.index(" ")
                            org2seqname = org2seqname[:ind]
                        except:
                            pass
                        break

            outnamel  = "%s_%s"   % ( org1short, org2short )
            outname   = "%s/%s"   % ( outfolder, outnamel  )

            outdelta  = outname  + '.delta'
            outpngl   = outnamel + '.delta.png'
            outpng    = outname  + '.delta.png'
            outfilter = outdelta + '.filter'
            outaln    = outdelta + '.filter.aln'

            alt       = "%s chr %s vs %s chr %s" % ( org1name, org1str, org2name, org2str )
            reportouter.append('\t\t\t\t<td><img src="%s" title="%s"/></td>' % ( outpngl, alt ))

            cmd1      = "../nucmer -o -p %s %s %s" % ( outname, org2fasta, org1fasta )

            makefile.append(outdelta + ': ' + org1fasta + ' ' + org2fasta)
            makefile.append('\t%s\n' % cmd1)

            cmd2 = '../mummerplot -f -p %s --large --png %s' % ( outdelta, outdelta )
            makefile.append(outpng + ' ' + outfilter + ': ' + outdelta)
            #makefile.append('\tif [ $( shell cat %s | wc -l ) -gt 2 ]; then %s; else touch %s; touch %s; fi\n' % (outdelta, cmd2, outpng, outfilter))
            makefile.append('\t%s\n' % (cmd2))
            outfiles.append(outpng)

            cmd3 = '../show-aligns -r %s.filter "%s" "%s" > %s' % (outdelta, org2seqname, org1seqname, outaln)
            makefile.append(outaln + ': ' + outfilter)
            makefile.append('\t%s\n' % cmd3)
            outfiles.append(outaln)


        reportouter.append("\t\t\t</tr>")

    reportouter.append("\t\t</table>")

    reportouter.append("\t</body>")

    reportouter.append("\t<footer>")
    reportouter.append("\t\t<small>")
    reportouter.append("\t\t\t<p><b>Parameters:</b></p>\n")
    reportouter.append("""\
    <p>nucmer</p>
    <p>mummerplot -f -l</p>
    <p>delta-filter -q -1 -l 5000 -i 10 -u 10</p>
    <pre>
        #-q            Maps each position of each query to its best hit in
        #              the reference, allowing for reference overlaps
        #-1            1-to-1 alignment allowing for rearrangements
        #              (intersection of -r and -q alignments)
        #-l int        Set the minimum alignment length, default 0
        #-i float      Set the minimum alignment identity [0, 100], default 0
        #-u float      Set the minimum alignment uniqueness, i.e. percent of
        #              the alignment matching to unique reference AND query
        #              sequence [0, 100], default 0
    </pre>
    <p>mummerplot -f -p</p>
    <pre>
        #--filter        Only display .delta alignments which represent the "best"
        #                   hit to any particular spot on either sequence, i.e. a
        #                   one-to-one mapping of reference and query subsequences
    </pre>
    """)
    reportouter.append("\t\t</small>")
    reportouter.append("\t</footer>")

    reportouter.append("</html>")




    outhtml = outfolder + '/report.html'
    with open( outhtml, 'w' ) as fhd:
        report = "\n".join( reportouter )

        if compress_html:
            report = report.replace("\t"    , "" )

        fhd.write( report )



    outok = outfolder + '/run.ok'
    cmd5  = "echo '%s' > %s" % (" ".join(outfiles), outok)
    makefile.append( outok + ': ' + " ".join(outfiles))
    makefile.append('\t%s\n' % cmd5)
    outfiles.append(outok)

    resfiles = []

    if html2pdf is not None:
        outpdf = outhtml + '.pdf'
        cmd3   = html2pdf % { 'in': outhtml, 'out': outpdf }
        #print "converting report to pdf", cmd3
        outfiles.append(outhtml)
        makefile.append( outpdf + ': ' + " ".join(outfiles))
        makefile.append('\t%s\n' % cmd3)
        resfiles.append(outpdf)


        if pdf2img is not None:
            outimg = outhtml + '.png'
            cmd4   = pdf2img % { 'in': outpdf, 'out': outhtml }
            #print "converting report to pdf", cmd3
            outfiles.append(outpdf)
            makefile.append( outimg + ': ' + " ".join(outfiles))
            makefile.append('\t%s\n' % cmd4)
            resfiles.append(outimg)



    #whole chromosomes
    #../nucmer -o -p a_all_b_all arabidopsis_thaliana/Arabidopsis_thaliana.TAIR10.18.dna.toplevel.fa brassica_oleracea/Walking_Stick_Genome.fasta

    #rm ath_bol.tar.gz

    #tar czvf ath_bol.tar.gz a*_b* run.sh report.html

    return (outfolder, resfiles, outhtml)


def genHtml(divnames):
    report = ["<html>"]

    script = """\
    <head>
        <base target="_blank">
        <style type="text/css">
            table {
                border: none;
                border-spacing: 0px;
                border-collapse: collapse;
                padding: 0px;
            }
            #iwindow {
                //width: 100%!important;
                //height: 100%!important;
                margin: 0px;
                padding: 0px;
                border: none;
                display: block;
            }
        </style>

        <script type="text/javascript">
            //document.domain = "file:///";

            function showhide() {
                console.log("CLICK");
                var objId = this.getAttribute('tgt');
                var frame = document.getElementById("iwindow");
                frame.src = objId;
                //setTimeout(iResize, 100);
            }

            function iResize(size){
                console.log("got message ", size.data)
                var frame     = document.getElementById("iwindow");

                var newheight = size.data[0];
                var newwidth  = size.data[1];

                console.log('content height     '+newheight);
                console.log('content width      '+newwidth);

                console.log('frame height       '+frame.height);
                console.log('frame width        '+frame.width);

                console.log('frame style height '+frame.style.height);
                console.log('frame style width  '+frame.style.width);

                frame.height = (newheight+30) + "px";
                frame.width  = (newwidth +30) + "px";

                frame.style.height = (newheight+30) + "px";
                frame.style.width  = (newwidth +30) + "px";

                console.log('frame height       '+frame.height);
                console.log('frame width        '+frame.width);

                console.log('frame style height '+frame.style.height);
                console.log('frame style width  '+frame.style.width);
            }

            window.addEventListener("message", iResize, false);

            //http://toddmotto.com/creating-jquery-style-functions-in-javascript-hasclass-addclass-removeclass-toggleclass/
            function hasClass(elem, className) {
                return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
            }

            function addClass(elem, className) {
                if (!hasClass(elem, className)) {
                    elem.className += ' ' + className;
                }
            }

            function removeClass(elem, className) {
                var newClass = ' ' + elem.className.replace( /[\\t\\r\\n]/g, ' ') + ' ';
                if (hasClass(elem, className)) {
                    while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                        newClass = newClass.replace(' ' + className + ' ', ' ');
                    }
                    elem.className = newClass.replace(/^\s+|\s+$/g, '');
                }
            }

            function toggleClass(elem, className) {
                console.log("TOGGLING CLASS "+className+" FOR ELEMENT "+elem);
                if (hasClass(elem, className)) {
                    removeClass(elem, className);
                } else {
                    addClass(elem, className);
                }
            }

            window.onload = function() {
                var buttons = document.getElementsByClassName("swbutton");
                if ( buttons && buttons.length > 0 ) {
                    for ( var el = 0; el < buttons.length; el++ ) {
                        var bel = buttons[el];
                        //console.log("EL "+el+" "+bel);
                        bel.addEventListener('click', showhide);
                    }
                }
            }
        </script>
    </head>
    """

    links = "\t\t<table>\n\t\t\t<tr>\n"
    for divdata in divnames:
        btnname, outhtml = divdata
        links += '\t\t\t\t<td><button class="swbutton" tgt="%s">%s</button></td>\n' % ( outhtml, btnname )
    links += "\t\t\t</tr>\n\t\t</table>\n"
    links += '<iframe src="" id="iwindow" seamless="seamless" height="0px" width="0px"></iframe>'

    report.append(script)
    report.append("\t<body>")
    report.append(links)
    report.append("\t</body>\n</html>")


    with open('report.html', 'w') as fhd:
        reportstr = "\n".join( report )

        if compress_html:
            reportstr = reportstr.replace("\t"    , "" )

        fhd.write( reportstr )


def checkinput():
    print "checking"
    for org in sorted(genomes):
        data   = genomes[ org ]
        name   = data['name'  ]
        folder = data['folder']
        prefix = data['prefix']
        begin  = data['begin' ]
        end    = data['end'   ]
        fmt    = data['fmt'   ]
        print "  checking ", name,

        if not os.path.exists( folder ):
            print "FOLDER", folder, "DOES NOT EXISTS"
            sys.exit(1)
        if not os.path.isdir( folder ):
            print "FOLDER", folder, "IS NOT A FOLDER"
            sys.exit(1)

        for pos in xrange(begin, end+1):
            fn  = os.path.join(folder, prefix)
            fn += fmt % pos + '.fa'
            if not os.path.exists( fn ):
                print "FILE", fn, "DOES NOT EXISTS"
                sys.exit(1)
            if os.path.isdir( fn ):
                print "FILE", fn, "IS A FOLDER"
                sys.exit(1)

        print "OK"
    print "checking ok"


def main():
    checkinput()

    if os.path.exists('makefile'):
        os.remove('makefile')

    #report   = []
    allfiles = []
    divnames = []
    orgs     = sorted(genomes)

    print "ordering"

    pairs = []

    for org1pos in xrange(len(orgs)):
        org1     = orgs[org1pos]
        org1name = genomes[org1]['name']
        print "ordering", org1name
        if org1 in notinsource:
            print "  skipping"
            continue

        for org2pos in xrange(len(orgs)):
            org2 = orgs[org2pos]
            org2name = genomes[org2]['name']
            print "ordering", org1name, org2name
            if org2 in notindestiny:
                print "  forbidden. skipping"
                continue

            pair = sorted([org2pos, org1pos])
            if pair in pairs:
                if ( not dosymetrical ):
                    print "  symetrical. skipping"
                    continue
            else:
                pairs.append(pair)

            if ( org1pos == org2pos ):
                if ( not doreciprocal ):
                    print "  reciprocal. skipping"
                    continue

            outfolder, resfiles, outhtml = mapgenomes( org1, org2 )

            allfiles.extend( resfiles )

            #reportouter    = ["\t" + x for x in reportouter]
            #reportouterstr = "\n".join( reportouter )
            #reportouterstr = reportouterstr.replace('href="', 'href="%s/' % outfolder)
            #reportouterstr = reportouterstr.replace('src="' , 'src="%s/'  % outfolder)

            #divid   = org1 + org2
            divname = org1name + " X " + org2name
            #report.append( '\t\t<div id="%s" class="spp_table">\n\t\t\t<h1>%s</h1>\n%s\n\t\t</div>' % ( divid, divname, reportouterstr ) )
            divnames.append( [divname, outhtml] )

    print "ordering ok"



    print "creating html"
    genHtml(divnames)
    print "creating html ok"



    if create_make_file:
        print "creating makefile"
        html = 'report.html.tar.xz'
        makefile.append(html + ' : '+" ".join( allfiles ))
        makefile.append('\ttar --exclude=report.html.png -acvf %s *.html */*.html */*.png\n' % html)

        png = 'report.png.tar.xz'
        makefile.append(png + ' : '+" ".join( allfiles ))
        makefile.append('\ttar -acvf %s */report.html.png\n' % png)

        pdf = 'report.pdf.tar.xz'
        makefile.append(pdf + ' : '+" ".join( allfiles ))
        makefile.append('\ttar -acvf %s */report.html.pdf\n' % pdf)

        allf = 'report.all.tar.xz'
        makefile.append(allf + ' : '+" ".join( allfiles ))
        makefile.append('\ttar -acvf %s *.html */*.html */*.png */*.pdf\n' % allf)

        allr = 'report.raw.tar.xz'
        makefile.append(allr + ' : '+" ".join( allfiles ))
        makefile.append('\ttar -acvf %s */*.coords */*.delta */*.filter */*.aln */*.fplot  */*.rplot  */*.gp \n' % allr)

        allstr = 'all: ' + " ".join( [html, png, pdf, allf, allr] ) + "\n"
        makefile.insert(0, allstr)



        with open('makefile', 'w') as fhd:
            fhd.write("\n".join(makefile))
        print "creating makefile ok"

if __name__ == '__main__': main()
