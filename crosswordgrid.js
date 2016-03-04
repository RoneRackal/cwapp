(function () {

    function GridSpot() {
        this.open = false;
        this.number = 0;
        this.letter = "";
    }

    var app = angular.module("app.crosswordgrid", ["services.dictionary"]);

    app.component("crosswordGrid", {
        templateUrl: "crosswordgrid.html",
        replace: true,
        controllerAs: "crosswordGridCtrl",
        controller: ["DictionaryService", function (DictionaryService) {
            this.width = 15;
            this.height = 15;
            this.symmetrical = true;
            this.autosym = true;
            this.acrossClues = [];
            this.downClues = [];
            this.possibleList = [];

            this.CreateGrid = function (height, width) {
                this.griddata = CreateMatrix(this.height, this.width, new GridSpot());

                for (var j = 0; j < this.height; j++) {
                    for (var i = 0; i < this.width; i++) {
                        this.griddata[j][i].x = i;
                        this.griddata[j][i].y = j;
                    }
                }
            }

            //             this.ChangeSize = function (width, height) {
            //                 this.width = width;
            //                 this.height = height;
            // 
            //                 this.griddata = CreateMatrix(this.height, this.width, new GridSpot());
            //             }
            
            this.InputLetter = function (tile) {
                this.ConstructClues(tile);
            }
            
            this.CreatePossibleList = function (text) {
                this.possibleList = DictionaryService.LookUpList(text.replace(/ /g, ""));
            }

            this.Flip = function (item) {
                item.open = !item.open;

                if (this.autosym) {
                    this.griddata[this.height - 1 - item.y][this.width - 1 - item.x].open = item.open;
                }

                this.RecalculateGridNumbers();
                this.ConstructClues();
                this.CheckSymmetry();
            }

            this.ConstructClues = function (tile) {
                
                // Do a full recalculation
                if (!tile) {
                    // Reset clues
                    this.acrossClues.empty();
                    this.downClues.empty();
                    
                    // Find slots that have a number assigned, this means they are part of a word
                    for (var j = 0; j < this.height; j++) {
                        for (var i = 0; i < this.width; i++) {
                            if (this.griddata[j][i].number == 0) {
                                continue;
                            }
                            
                            // If it has a number, it has the be the start of a word
                            
                            var acrossWord = (this.GridSpotIsOpen(i + 1, j) && !this.GridSpotIsOpen(i - 1, j));
                            var downWord = (this.GridSpotIsOpen(i, j + 1) && !this.GridSpotIsOpen(i, j - 1));

                            var wordText = "";
                            var k = 0;
                            var possibles = 0;

                            if (acrossWord) {
                                while (this.GridSpotIsOpen(i + k, j)) {
                                    if (!this.griddata[j][i + k].letter || this.griddata[j][i + k].letter == " ") {
                                        wordText += "_ ";
                                    }
                                    else {
                                        wordText += this.griddata[j][i + k].letter;
                                    }
                                    k++;
                                }

                                possibles = DictionaryService.LookUpCount(wordText.replace(/ /g, ""));

                                this.acrossClues.push({ number: this.griddata[j][i].number, text: wordText, possibles: possibles });
                            }

                            if (downWord) {
                                wordText = "";
                                k = 0;
                                while (this.GridSpotIsOpen(i, j + k)) {
                                    if (!this.griddata[j + k][i].letter || this.griddata[j + k][i].letter == " ") {
                                        wordText += "_ ";
                                    }
                                    else {
                                        wordText += this.griddata[j + k][i].letter;
                                    }
                                    k++;
                                }

                                possibles = DictionaryService.LookUpCount(wordText.replace(/ /g, ""));

                                this.downClues.push({ number: this.griddata[j][i].number, text: wordText, possibles: possibles });
                            }
                        }
                    }
                }
                else { // Do a partial recalculation
                    
                    // Search backwards until we find the start of a word
                    var n = tile.x;
                    while (this.GridSpotIsOpen(n - 1, tile.y)) {
                        n--;
                    }
                    if (this.GridSpotIsOpen(n + 1, tile.y) && !this.GridSpotIsOpen(n - 1, tile.y)) { // If there is an across word
                        var acrossNumber = this.griddata[tile.y][n].number;

                        var wordText = "";
                        var k = 0;
                        var possibles = 0;

                        while (this.GridSpotIsOpen(n + k, tile.y)) { // Move forward through word gathering letters
                            if (!this.griddata[tile.y][n + k].letter || this.griddata[tile.y][n + k].letter == " ") {
                                wordText += "_ ";
                            }
                            else {
                                wordText += this.griddata[tile.y][n + k].letter;
                            }
                            k++;
                        }

                        possibles = DictionaryService.LookUpCount(wordText.replace(/ /g, ""));

                        for (var k = 0; k < this.acrossClues.length; k++) {
                            if (this.acrossClues[k].number == acrossNumber) {
                                this.acrossClues[k].text = wordText;
                                this.acrossClues[k].possibles = possibles;
                                break;
                            }
                        }
                    }
                    
                    // Search backwards until we find the start of a word
                    n = tile.y;
                    while (this.GridSpotIsOpen(tile.x, n - 1)) {
                        n--;
                    }
                    if (this.GridSpotIsOpen(tile.x, n + 1) && !this.GridSpotIsOpen(tile.x, n - 1)) { // If there is an across word
                        var downNumber = this.griddata[n][tile.x].number;

                        var wordText = "";
                        var k = 0;
                        var possibles = 0;

                        while (this.GridSpotIsOpen(tile.x, n + k)) { // Move forward through word gathering letters
                            if (!this.griddata[n + k][tile.x].letter || this.griddata[n + k][tile.x].letter == " ") {
                                wordText += "_ ";
                            }
                            else {
                                wordText += this.griddata[n + k][tile.x].letter;
                            }
                            k++;
                        }

                        possibles = DictionaryService.LookUpCount(wordText.replace(/ /g, ""));

                        for (var k = 0; k < this.downClues.length; k++) {
                            if (this.downClues[k].number == downNumber) {
                                this.downClues[k].text = wordText;
                                this.downClues[k].possibles = possibles;
                                break;
                            }
                        }
                    }
                }
            }

            this.RecalculateGridNumbers = function () {
 
                // Reset clues
                this.acrossClues.empty();
                this.downClues.empty();

                var nextNumber = 1;

                for (var j = 0; j < this.height; j++) {
                    for (var i = 0; i < this.width; i++) {
                        /* It is a number spot if :
                           (It is an open slot AND It has an open slot to the right of it AND a closed spot to the left) OR
                           (It is an open slot AND It has an open slot below it and a closed spot above it) */

                        if (!this.GridSpotIsOpen(i, j)) {
                            this.griddata[j][i].number = 0;
                            continue;
                        }

                        var acrossWord = (this.GridSpotIsOpen(i + 1, j) && !this.GridSpotIsOpen(i - 1, j));
                        var downWord = (this.GridSpotIsOpen(i, j + 1) && !this.GridSpotIsOpen(i, j - 1));
                        
                        // Assign number and increment
                        if (acrossWord || downWord) {
                            this.griddata[j][i].number = nextNumber; // Assign number to this square
                            nextNumber++;
                        }
                        else {
                            this.griddata[j][i].number = 0;
                        }
                    }
                }
            }

            this.CheckSymmetry = function () {
                
                // Cycle through first grid half, and compare it to backwards of second grid half
                
                var sym = true;

                for (var j = 0; j < (this.height / 2); j++) {
                    for (var i = 0; i < this.width; i++) {
                        if (this.griddata[j][i].open !== this.griddata[this.height - j - 1][this.width - i - 1].open) {
                            sym = false;
                            break;
                        }
                    }
                    if (sym === false)
                        break;
                }

                this.symmetrical = sym;
            }

            this.Keydown = function (e, tile) {
                //debugger;
                var newX = -1;
                var newY = -1;
                if (e.keyCode === 40) {
                    newX = tile.x;
                    newY = tile.y + 1;
                }
                if (e.keyCode === 38) {
                    newX = tile.x;
                    newY = tile.y - 1;
                }
                if (e.keyCode === 37) {
                    newX = tile.x - 1
                    newY = tile.y;
                }
                if (e.keyCode === 39) {
                    newX = tile.x + 1;
                    newY = tile.y;
                }

                if (newX < 0 || newX >= this.width || newY < 0 || newY >= this.height) {
                    return;
                }

                angular.element(".cw-grid .cw-grid-row:nth-child(" + ++newY + ") > .cw-grid-column:nth-child(" + ++newX + ") input").trigger("focus");
            }
            
            // Utilities
            this.GridSpotIsOpen = function (x, y) {
                if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                    return false;
                }

                return this.griddata[y][x].open;
            }


            this.CreateGrid();
        }]
    });

})();
