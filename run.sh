 1861  ln -s /media/lidija/bigDisk/W05-SolEtu/00-genomes/ input
 1863  mkdir Solanum_tuberosum
 1864  cd Solanum_tuberosum/
 1865  fastaexplode ../input/SolTub-PGSC_DM_v4.03_pseudomolecules.fasta
 1868  cd ..
 1869  mkdir Solanum_lycopersicum
 1870  cd Solanum_lycopersicum/
 1871  fastaexplode ../input/SolLyc-genome-chromosomes.2.40.fa

python mummer_iterate.py config.py

make -f makefile

cd data

../delta2js.py ../config_ath.py ../sly_sly/*.delta ../sly_stu/*.delta ../stu_stu/*.delta

cp ../sly_sly/*.js sly_stu/*.js stu_stu/*.js

