(function () {

    function GridSpot() {
        this.open = false;
        this.number = 0;
        this.letter = "";
    }

    var app = angular.module("app.crosswordgrid", []);

    app.component("crosswordGrid", {
        templateUrl: "crosswordgrid.html",
        replace: true,
        controllerAs: "crosswordGridCtrl",
        controller: function () {
            this.width = 15;
            this.height = 15;
            this.symmetrical = true;
            this.griddata = CreateMatrix(this.height, this.width, new GridSpot());
            this.acrossClues = [];
            this.downClues = [];

            this.ChangeSize = function (width, height) {
                this.width = width;
                this.height = height;

                this.griddata = CreateMatrix(this.height, this.width, new GridSpot());
            }
            
            this.InputLetter = function () {
                this.RecalculateGridNumbers();
            }

            this.Flip = function (item) {
                item.open = !item.open;

                this.RecalculateGridNumbers();
                this.CheckSymmetry();
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
                            
                            var wordText = "";
                            var k = 0;
                                
                            if (acrossWord) {
                                wordText = "";
                                k = 0;
                                while (this.GridSpotIsOpen(i + k, j)) {
                                    if (!this.griddata[j][i + k].letter || this.griddata[j][i + k].letter == " ") {
                                        wordText += "_ ";
                                    }
                                    else {
                                        wordText += this.griddata[j][i + k].letter;
                                    }
                                    k++;
                                }

                                this.acrossClues.push({ number: nextNumber, text: wordText });
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
                                this.downClues.push({ number: nextNumber, text: wordText });
                            }

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
            
            // Utilities
            this.GridSpotIsOpen = function (x, y) {
                if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                    return false;
                }

                return this.griddata[y][x].open;
            }
        }
    });

})();