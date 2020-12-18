var indicatorSearch = function () {
    var urlParams = new URLSearchParams(window.location.search);
    var searchTerms = urlParams.get('q');
    if (searchTerms !== null) {
        document.getElementById('search-bar-on-page').value = searchTerms;
        document.getElementById('search-term').innerHTML = searchTerms;

        var searchTermsToUse = searchTerms;
        // This is to allow for searching by indicator with dashes.
        if (searchTerms.split('-').length == 3 && searchTerms.length < 15) {
            // Just a best-guess check to see if the user intended to search for an
            // indicator ID.
            searchTermsToUse = searchTerms.replace(/-/g, '.');
        }

        var results = [];
        var alternativeSearchTerms = [];

        // Engish-specific tweak for words separated only by commas.
        if (opensdg.language == 'en') {
            lunr.tokenizer.separator = /[\s\-,]+/
        }

        var searchIndex = lunr(function () {
            this.use(lunr.es);

            this.ref('url');
            // Index the expected fields.
            this.field('title', getSearchFieldOptions('title'));
            this.field('content', getSearchFieldOptions('content'));
            this.field('id', getSearchFieldOptions('id'));
            // Index any extra fields.
            var i;
            for (i = 0; i < opensdg.searchIndexExtraFields.length; i++) {
                var extraField = opensdg.searchIndexExtraFields[i];
                this.field(extraField, getSearchFieldOptions(extraField));
            }
            // Index all the documents.
            var itemsToSearch = _.pick(opensdg.searchItems, (value) => opensdg.completedIndicators.includes(value['id']));
            
            for (var ref in itemsToSearch) {
                this.add(itemsToSearch[ref]);
            };
        });

        // Perform the search.
        var results = searchIndex.search(searchTermsToUse);

        // If we didn't find anything, get progressively "fuzzier" to look for
        // alternative search term options.
        if (!results.length > 0) {
            for (var fuzziness = 1; fuzziness < 5; fuzziness++) {
                var fuzzierQuery = getFuzzierQuery(searchTermsToUse, fuzziness);
                var alternativeResults = searchIndex.search(fuzzierQuery);
                if (alternativeResults.length > 0) {
                    var matchedTerms = getMatchedTerms(alternativeResults);
                    if (matchedTerms) {
                        alternativeSearchTerms = matchedTerms;
                    }
                    break;
                }
            }
        }

        var resultItems = [];

        results.forEach(function (result) {
            var doc = opensdg.searchItems[result.ref]
            // Truncate the contents.
            if (doc.content.length > 400) {
                doc.content = doc.content.substring(0, 400) + '...';
            }
            // Indicate the matches.
            doc.content = doc.content.replace(new RegExp('(' + escapeRegExp(searchTerms) + ')', 'gi'), '<span class="match">$1</span>');
            doc.title = doc.title.replace(new RegExp('(' + escapeRegExp(searchTerms) + ')', 'gi'), '<span class="match">$1</span>');
            resultItems.push(doc);
        });

        $('.loader').hide();

        // Print the results using a template.
        var template = _.template(
            $("script.results-template").html()
        );
        $('div.results').html(template({
            searchResults: resultItems,
            resultsCount: resultItems.length,
            didYouMean: (alternativeSearchTerms.length > 0) ? alternativeSearchTerms : false,
        }));
    }

    // Helper function to make a search query "fuzzier", using the ~ syntax.
    // See https://lunrjs.com/guides/searching.html#fuzzy-matches.
    function getFuzzierQuery(query, amountOfFuzziness) {
        return query
            .split(' ')
            .map(function (x) {
                return x + '~' + amountOfFuzziness;
            })
            .join(' ');
    }

    // Helper function to get the matched words from a result set.
    function getMatchedTerms(results) {
        var matchedTerms = {};
        results.forEach(function (result) {
            Object.keys(result.matchData.metadata).forEach(function (matchedTerm) {
                matchedTerms[matchedTerm] = true;
            })
        });
        return Object.keys(matchedTerms);
    }

    // Helper function to get a boost score, if any.
    function getSearchFieldOptions(field) {
        var opts = {}
        // @deprecated start
        if (opensdg.searchIndexBoost && !Array.isArray(opensdg.searchIndexBoost)) {
            if (opensdg.searchIndexBoost[field]) {
                opts['boost'] = parseInt(opensdg.searchIndexBoost[field])
            }
            return opts;
        }
        // @deprecated end
        var fieldBoost = opensdg.searchIndexBoost.find(function (boost) {
            return boost.field === field;
        });
        if (fieldBoost) {
            opts['boost'] = parseInt(fieldBoost.boost)
        }
        return opts
    }

    // Used to highlight search term matches on the screen.
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/gi, "\\$&");
    };
};

$(function () {
    var $el = $('#indicator_search');
    $('#jump-to-search').show();
    $('#jump-to-search a').click(function () {
        if ($el.is(':hidden')) {
            $('.navbar span[data-target="search"]').click();
        }
        $el.focus();
    });
    indicatorSearch();
});
