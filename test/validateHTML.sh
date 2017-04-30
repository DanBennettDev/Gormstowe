
domain="localhost:8080"
workFolder="//media/dan/share/edu/msc/WebTech/Coursework/testing/testMirror"

cd $workFolder
rm -rf *

while read -r thisfile; 
do 
    curl --remote-name --fail --silent --show-error $domain/$thisfile
    java -jar ../vnu.jar --errors-only "$thisfile"
done <../checklist.txt

