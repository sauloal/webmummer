genomes = {
    'ath': {
        'name'  : 'Arabidopsis thaliana',
        'folder': 'arabidopsis_thaliana',
        'prefix': 'Arabidopsis_thaliana.TAIR10.18.dna.chromosome.',
        'begin' : 1,
        'end'   : 5,
        'fmt'   : '%d'
    },
    'bol': {
        'name'  : 'Brassica oleracea',
        'folder': 'brassica_oleracea',
        'prefix': '',
        'begin' : 1,
        'end'   : 9,
        'fmt'   : '%d'
    },
    'bra': {
        'name'  : 'Brassica rapa',
        'folder': 'brassica_rapa',
        'prefix': 'chrA',
        'begin' : 1,
        'end'   : 10,
        'fmt'   : '%02d'
    }
}


notinsource      = ['sarscf', 'shascf', 'spescf', 'slyscf']
notindestiny     = ['slyref']
dosymetrical     = False
doreciprocal     = True
create_make_file = True

#maxX             = 1
#maxY             = 2
