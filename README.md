Brackets HTML templates extension
===
Brackets extension that will insert a chosen HTML template into the current file. Currently this will overwrite the current content of the file so it should be used on new, empty files. If there is a content a small warning is displayed.

Uses a modal window to display the options as sub-menus are yet to be implemented, which would be the preference. With sub-menus would still be located under the Edit menu since it's altering the current file.

To install this extension:
**As of Sprint 13**
In Brackets, under "Debug" select "Show Extensions Folder". Then inside the user folder create a folder named '''ta-htmlTemplates''' and place the extension files inside this folder. Reload Brackets.

**Older versions**
Create a folder named ```ta-htmlTemplates``` folder inside the ```brackets/src/extensions/user``` folder, place the files in this folder, and reload Brackets.

**Compatible with Brackets Sprint13**


Usage
=====
Create a new file. Select "HTML Templates" under the Edit Menu. A modal will appear presenting different HTML template options. Choosing one will insert that HTML into the current file.


Known issues
=====
This will overwrite the contents of the current file if any exists.