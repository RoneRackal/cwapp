(function () {

    var app = angular.module("services.dictionary", []);

    app.service('DictionaryService', function ($http) {

        this.dictionary = [];

        this.LoadDictionary = function () {
            var ds = this;
            console.time("LoadDict");

            $http({
                method: 'GET',
                url: '/dictionary.json'
            }).then(function (data) {

                for (var i = 0; i < data.data.length; i++) {
                    if (!(ds.dictionary[data.data[i].length] instanceof Array)) {
                        ds.dictionary[data.data[i].length] = [];
                    }
                    ds.dictionary[data.data[i].length].push(data.data[i]);
                }
                console.timeEnd("LoadDict");
            });

        }

        this.LookUp = function (phrase) {

            console.time("Lookup: " + phrase);

            // Build regex string
            var reg = "^";
            for (var k = 0; k < phrase.length; k++) {
                if (phrase[k] == "_") {
                    reg += "\\w";
                }
                else {
                    reg += phrase[k].toLowerCase();
                }
            }
            reg += "$";
            var regex = new RegExp(reg);

            // Test against dictionary
            var found = 0;
            var l = phrase.length;

            for (var i = 0; i < this.dictionary[l].length; i++) {
                if (regex.test(this.dictionary[l][i]))
                    found++;
            }
            console.log("Lookup: " + phrase + " - " + found + " matches.")

            console.timeEnd("Lookup: " + phrase);
        }

        this.LoadDictionary();
    });

})();
