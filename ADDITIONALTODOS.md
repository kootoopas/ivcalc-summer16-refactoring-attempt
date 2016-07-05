primary
-------

refactor utils
Make objects out of group of co-related existing functions and global variables
Make whole thing popular browser 2016 compliant
$(): cache id selected elements

secondary
---------

use json for pokemon/nature/etc data and provide them through data provider module.
add scoped styles to improve embedding
prefix ids and classes to avoid collision with other existing ones upon embedding
reduce dropdown focus to one click (two required currently)
maybe find a more accessible way to display end message? i.e have ranges of allowed stat values near input fields.
Resolve ie8 issues (probably reserved words are being used as variable names?)

figure out how compression works
move compressed and decompressed data to files

add dist tasks: which allow embedding (all source dumped into one html file like the original)
`c += $('med0-0').value+','; ----> c = $('med0-0').value + ',' +`


There is not need to check for/omit white space in a cookie, since no browser adds whitespace by itself. https://stackoverflow.com/questions/1969232/allowed-characters-in-cookies

Questions for original author
-----------------------------
What did you use and how did you compress the data?
