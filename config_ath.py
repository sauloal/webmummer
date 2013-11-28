project_id = 'ath_bra_bol'

dry_run    = False

compulsory = ['.filter', '.delta']
"""
compulsory extension of files
"""

forbidden  = ['.invertions.delta.q.delta', '.invertions.delta.q.delta.coords', '.fasta.delta', '.fasta.delta.coords']
"""
forbidden extension of files
"""

def fmtN(v):
    return "%02d" % int(v)

labelFields = {
    'refName' : [r'(\S{3})\d+_\S{3}\d+'   , None, None],
    'refChrom': [r'\S{3}(\d+)_\S{3}\d+'   , None, fmtN],
    'tgtName' : [r'\S{3}\d+_(\S{3})\d+'   , None, None],
    'tgtChrom': [r'\S{3}\d+_\S{3}(\d+)'   , None, fmtN],
    'status'  : [r'\S{3}\d+_\S{3}\d+(\S+)', None, None]
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
