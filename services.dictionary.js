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

        this.ConvertPhraseToRegexString = function (phrase) {
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

            return new RegExp(reg);
        }

        this.LookUpCount = function (phrase) {

            console.time("LookUpCount: " + phrase);

            var regex = this.ConvertPhraseToRegexString(phrase);

            // Test against dictionary
            var found = 0;
            var l = phrase.length;

            for (var i = 0; i < this.dictionary[l].length; i++) {
                if (regex.test(this.dictionary[l][i]))
                    found++;
            }

            console.timeEnd("LookUpCount: " + phrase);

            return found;
        }

        this.LookUpList = function (phrase) {

            console.time("LookUpList: " + phrase);

            var regex = this.ConvertPhraseToRegex(phrase);

            // Test against dictionary
            var results = [];
            var l = phrase.length;

            for (var i = 0; i < this.dictionary[l].length; i++) {
                if (regex.test(this.dictionary[l][i])) {
                    results.push(this.dictionary[l][i]);
                }
            }

            console.timeEnd("LookUpList: " + phrase);

            return results;
        }

        this.LoadDictionary();
    });

})();
