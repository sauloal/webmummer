compulsory = ['.delta', '.delta.coords']
"""
compulsory extension of files
"""

forbidden  = ['.invertions.delta.q.delta', '.invertions.delta.q.delta.coords', '.fasta.delta', '.fasta.delta.coords']
"""
forbidden extension of files
"""

labelFields = {
    'refName'    : ['(\S+?)_SL2.40ch\d+'                       , os.path.basename],
    'chromNumber': ['SL2.40ch(\d+)'                            , None            ],
    'spp'        : ['_\._(\S+)_scaffold_final\.assembly\.fasta', None            ],
    'status'     : ['\.fasta(\S+)'                             , None            ]
}
"""
Regular expression to extract information from filenames
"""


titleFmt  = '%(refName)s vs %(spp)s - Chromosome %(chromNumber)s - %(status)s'
xlabelFmt = '%(refName)s Chromosome %(chromNumber)s'
ylabelFmt = '%(spp)s'
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

