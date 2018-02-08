delete old data if needed (controllers/reindex) - add delete by query plugin to prod (react#115)
update headerline of the new csv - (to be like the current columns names : https://gitlab.linnovate.net/402/universal/wikis/data-structure)
convert xlsx to csv with https://stackoverflow.com/questions/10557360/convert-xlsx-to-csv-in-linux-command-line (ssconvert - ssconvert Book1.xlsx newfile.csv) 


remove blank headerlines
remove - from phone data (ctrl + h on phone column)


import data to new collection


mongoimport -d [new db name] -c newrecords --type csv --file [file path] --headerline


run mongo script to save categories as array (split by | )  -
node scripts/categories2array.js  (check if mongo connection url is correct)
run mapping to the new index (if needed) - (mapping from https://gitlab.linnovate.net/orit/402-scriptsNdata/blob/master/mapping1.sh - notice to change the index name)

reindex with reindex consumer (rabbitmq) the new collection to records index:
[host]/api/v1/crons/reindex?index=[indexname]&type=[typename]&collection=[the new mongo collection]  

(do not forget to add the token (consumers/crons.js))


copy the new collection to the main mongo records collection by mongodump & mongorestore:  


mongodump -d [db name] -c [collection name] --out [file path]

mongorestore -d [db name]  -c [collection name] [new bson file]


delete the newrecords collection (from mongo)
