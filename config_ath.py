dry_run    = False

compulsory = ['.filter', '.delta']
"""
compulsory extension of files
"""

forbidden  = ['.invertions.delta.q.delta', '.invertions.delta.q.delta.coords', '.fasta.delta', '.fasta.delta.coords']
"""
forbidden extension of files
"""

labelFields = {
    'refName' : ['(\S{3})\d+_\S{3}\d+'   , None],
    'refChrom': ['\S{3}(\d+)_\S{3}\d+'   , None],
    'tgtName' : ['\S{3}\d+_(\S{3})\d+'   , None],
    'tgtChrom': ['\S{3}\d+_\S{3}(\d+)'   , None],
    'status'  : ['\S{3}\d+_\S{3}\d+(\S+)', None]
}
"""
Regular expression to extract information from filenames
"""




titleFmt  = '%(refName)s Chromosome %(refChrom)s vs %(tgtName)s Chromosome %(tgtChrom)s - %(status)s'
xlabelFmt = '%(refName)s Chromosome %(refChrom)s'
ylabelFmt = '%(tgtName)s Chromosome %(tgtChrom)s'
"""
output format for title, xlabel and ylabel using the information extracted from file name
"""







statusMatch  = {
    '.delta'                                       : 'Raw Dot Plot',
    '.coords'                                      : 'Raw Dot Plot',
    '.delta.coords'                                : 'Raw Dot Plot',
    '.delta.filter'                                : 'Clean Dot Plot',
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
