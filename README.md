WebMummer
=========
Web Browser Mummer Plot Viewer
==============================

Conversion
------------
Given a set of .delta files, delta2js.py will convert those to javascript (under data/ folder) and create a list.js file.

Opening
-------
By opening index.html in a browser (preferably not IE), choose reference, chromosome, target species and status.

Navigation
-----------
The dot plot will be shown and can be browsed with either the keyboard or mouse.

Use arrow keys, +/-/0, drag with mouse, [shift] double-click, scroll-wheel or use the compass.

Screenshot
-------------
<img src="https://raw.github.com/sauloal/webmummer/master/Screenshot.png"/>

Saving
-------
On the top right corther there's a button to save the current view to a svg file.

Thanks
-------
* Mummer      - http://mummer.sourceforge.net/
* D3          - http://d3js.org/
* JQuery      - http://jquery.com/
* Tipsy       - http://onehackoranother.com/projects/jquery/tipsy/
* Stepheneb   - http://bl.ocks.org/stepheneb/1182434
* SVG Crowbar - http://nytimes.github.io/svg-crowbar/

Technical details
-------------------
### js/setup.js
agnostic of the project, gets all data from list.js, creates the drop-down lists and plots when requested.

### js/simple-graph.js
workhorse of the graphics library

### index.html
contains the relevant css for coloring the graph.

### delta2js.py
Delta files are parsed and converted to cartesian coordinates by delta2js.py.

It exports all values to java script files because that's the only type of file that can be loaded in a browser without a web server.

data/*.js contains minimum and maximum values, as well as an array with all coordinates.

It also exports a list (data/list.js) of all the available files and their sources (reference, chromosome, target and status). This file will be loaded automatically and will draw the options drop-down list.

In data/list.js, also list the x/y labels and graphic title.

deltajs.py MUST be modified to your own project file naming.

data/list.js can also be created manually.

#### Run
``` bash
cd data
rm ../../../out/*.js
../delta2js.py ../../../out/*.delta
cp -l ../../../out/*.js .
rm webmummer.tar.xz; tar --exclude .git -ahcvf webmummer.tar.xz .
```

#### Output
##### data/list.js
``` javascript
var statuses = ['Clean & Filtered Dot Plot. Only Inversions', 'Clean Dot Plot'];
var spps     = ['solanum arcanum', 'solanum habrochaites', 'solanum lycopersicum heinz denovo', 'solanum pennellii'];
var chroms   = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
var refs     = ['solanum lycopersicum heinz'];
var filelist = {
  'solanum lycopersicum heinz': {
    '00': {
      'solanum arcanum': {
        "Clean & Filtered Dot Plot. Only Inversions": {
          "filename": "solanum_lycopersicum_heinz_SL2.40ch00.fa_._solanum_arcanum_scaffold_final.assembly.fasta.delta.q.delta.filter.invertions.delta.js"
        },
        "Clean Dot Plot": {
          "filename": "solanum_lycopersicum_heinz_SL2.40ch00.fa_._solanum_arcanum_scaffold_final.assembly.fasta.delta.q.delta.js"
        },
      }
    }
  }
}
```

##### data/file.js
``` javascript
filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'title'  ] = 'solanum lycopersicum heinz vs solanum pennellii - Chromosome 12 - Clean Dot Plot';
filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'xlabel' ] = 'solanum lycopersicum heinz Chromosome 12';
filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'ylabel' ] = 'solanum pennellii';

filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'points' ] = [3159,3057,8585,8485,0,0,96.19];
filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'xmin' ]  =         3159;
filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'xmax' ]  =     65485119;

filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'ymin' ]  =         3057;
filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'ymax' ]  =     60818323;
filelist[ 'solanum lycopersicum heinz' ][ '12' ][ 'solanum pennellii' ][ 'Clean Dot Plot' ][ 'scafs']  = ['scaffold_2657'];
```

TODO
--------
### Priority
- [ ] allow for multiple plots
- [ ] better keyboard zoom
- [x] highlight same scaffold
- [ ] clean out-of-graph lines

### Optional
- [ ] use jquery-ui to drop-down lists
- [ ] allow enablig circles
- [x] replace all jquery selector for d3 selector in simple-graph.js
- [ ] disable auto load
