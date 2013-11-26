compulsory = ['.delta', '.delta.coords']
"""
compulsory extension of files
"""

forbidden  = ['.invertions.delta.q.delta', '.invertions.delta.q.delta.coords', '.fasta.delta', '.fasta.delta.coords']
forbidden  = ['.invertions.delta.q.delta', '.invertions.delta.q.delta.coords', '.fasta.delta.coords']
"""
forbidden extension of files
"""

def retAll(l):
    return 'all scaffolds'

labelFields = {
    'refName' : [r'(\S+?)_SL2.40ch\d+'                       , os.path.basename, None            ],
    'refChrom': [r'SL2.40ch(\d+)'                            , None            , None            ],
    'tgtName' : [r'_\._(\S+)_scaffold_final\.assembly\.fasta', None            , None            ],
    'tgtChrom': [r'(.)'                                      , None            , retAll          ],
    'status'  : [r'\.fasta(\S+)'                             , None            , None            ]
}
"""
Regular expression to extract information from filenames
"""


titleFmt  = '%(refName)s vs %(tgtChrom)s - Chromosome %(refChrom)s - %(status)s'
xlabelFmt = '%(refName)s Chromosome %(refChrom)s'
ylabelFmt = '%(tgtName)s'
"""
output format for title, xlabel and ylabel using the information extracted from file name
"""


statusMatch  = {
    '.delta'                                       : 'Raw Dot Plot',
    '.delta.coords'                                : 'Raw Dot Plot',
    '.delta.q.delta'                               : 'Clean Dot Plot',
    '.delta.q.delta.coords'                        : 'Clean Dot Plot',
    '.delta.q.delta.filter'                        : 'Clean & Filtered Dot Plot',
    '.delta.q.delta.filter.coords'                 : 'Clean & Filtered Dot Plot',
    '.delta.q.delta.filter.invertions.delta'       : 'Clean & Filtered Dot Plot. Only Inversions',
    '.delta.q.delta.filter.invertions.delta.coords': 'Clean & Filtered Dot Plot. Only Inversions',
}
"""
mapping from extension to stage of processing of file
"""
