/*
* Copyright (c) 2012 Travis Almand. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser: true */
/*global define, brackets, $ */

define(function (require, exports, module) {
    
    'use strict';

    var CommandManager = brackets.getModule("command/CommandManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
        Menus          = brackets.getModule("command/Menus"),
        nextUntitledFileIndex = 1;
    
    // load up modal content, don't forget text! at beginning of file name
    var modal = require("text!html/modal.html");
   
    
	/**    
	 * Creates a new File in memory
     *  
	 * @param {int} fileIndex Description    
	 * @param {string} extension (incl. dot: ".html") 
     *
     * Notice: There seems to be unfinished work in Brackets. As soon you add an extension to DocumentManager.createUntitledDocument()
     * an error from the ScopeManager is written to the console: "Error resolving /_brackets_<randomNo>/"
     * If you pass an empty string as extension (like [File->New] does in sourcecode of Brackets) no errors accures.
     * I chose to ignore the error and go for the extension because it's just working fine. Hoping it will be resolved in next Brackets sprint...
	 */
	function handleNewFile(fileIndex, extension) {
        
        var doc = DocumentManager.createUntitledDocument(fileIndex, extension);
            DocumentManager.setCurrentDocument(doc);
        return new $.Deferred().resolve(doc).promise();
        
    }
    
    function action() {
        
        // add our modal window to the body
        $("body").append(modal);
        
        // show new elements
        $('#templates_modalBackdrop').css('opacity', 0.5);
        $('#templates_modal').css({
            'position': 'absolute',
            'top': 'calc(50% - ' + ($('#templates_modal').height() / 2) + 'px)',
            'left': 'calc(50% - ' + ($('#templates_modal').width() / 2) + 'px)'
        });
        
        // pressing esc key closes modal and backdrop
        $(document).keyup(function (e) {
            if (e.keyCode === 27) {
                $("#templates_modal, #templates_modalBackdrop").remove();
            }
        });
        
        // clicking close button, x header button, or backdrop removes modal from body
        $("#templates_modalBtn, #templates_modalBackdrop, #templates_modal a.close").on("click", function (e) {
            e.preventDefault();
            $("#templates_modal, #templates_modalBackdrop").remove();
        });
    
        var editor = EditorManager.getCurrentFullEditor();
        
        // result of clicking a template choice
        // selector is very specific to avoid cross-extension contamination, just in case
        $('#templates_modal select#standard, #templates_modal select#frameworks').on('change', function () {
            // send the chosen template
            chosenTemplate($(this).val());            
        });
        
        var chosenTemplate = function (choice) {
            // grab the html to be inserted into file
            var template;
            switch (choice) {
                // standard
                case "html5":
                    template = require("text!html/html5.html");
                    break;
                case "html4loose":
                    template = require("text!html/html4loose.html");
                    break;
                case "html4strict":
                    template = require("text!html/html4strict.html");
                    break;
                case "xhtml1loose":
                    template = require("text!html/xhtml1loose.html");
                    break;
                case "xhtml1strict":
                    template = require("text!html/xhtml1strict.html");
                    break;
                case "xhtml11":
                    template = require("text!html/xhtml11.html");
                    break;
                // frameworks
                case "html5bp-4-3-0":
                    template = require("text!html/html5bp-4-3-0.html");
                    break;
                case "foundation-4-3-2":
                    template = require("text!html/foundation-4-3-2.html");
                    break;
                case "skeleton-1-2":
                    template = require("text!html/skeleton-1-2.html");
                    break;
                default:
                    template = "Something went wrong somewhere. Not horribly wrong, just wrong.";
            }
            
            var extension = ".html"
            
            
            //create an empty document and open it
            handleNewFile(nextUntitledFileIndex, extension)
				.done( function(doc) { 
					nextUntitledFileIndex++;
					// insert html into new file
					EditorManager.getCurrentFullEditor()._codeMirror.setValue(template);
					 // automatically close the modal window
					$("#templates_modalBtn").click();
			})
           
            
        };

    }
    
    // Register the commands and insert it in the File menu
    var COMMAND_ID = "template_ext",   // package-style naming to avoid collisions
        menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    
    CommandManager.register("New From...", COMMAND_ID, action);
    KeyBindingManager.addBinding(COMMAND_ID, "Ctrl-Shift-N");
    
    
    menu.addMenuItem(COMMAND_ID, null, Menus.FIRST);
    menu.addMenuDivider(Menus.AFTER, COMMAND_ID);
    
    
});
