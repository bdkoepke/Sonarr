﻿define(['app', 'AddSeries/RootFolders/RootFolderCollection', 'AddSeries/New/SearchResultView', 'Shared/SpinnerView'], function (app, rootFolders) {

    NzbDrone.AddSeries.New.AddNewSeriesView = Backbone.Marionette.Layout.extend({
        template: 'AddSeries/New/AddNewSeriesTemplate',
        route: 'Series/add/new',

        ui: {
            seriesSearch: '.search input'
        },

        regions: {
            searchResult: '#search-result'
        },

        collection: new NzbDrone.AddSeries.SearchResultCollection(),

        onRender: function () {
            console.log('binding auto complete');
            var self = this;

            this.ui.seriesSearch
                .data('timeout', null)
                .keyup(function () {
                    window.clearTimeout(self.$el.data('timeout'));
                    self.$el.data('timeout', window.setTimeout(self.search, 500, self));
                });

            this.resultView = new NzbDrone.AddSeries.SearchResultView({ collection: this.collection });
        },

        search: function (context) {

            context.abortExistingRequest();

            var term = context.ui.seriesSearch.val();
            context.collection.reset();

            if (term !== '') {
                context.searchResult.show(new NzbDrone.Shared.SpinnerView());

                context.currentSearchRequest = context.collection.fetch({
                    data: { term: term },
                    success: function (model) {
                        context.searchResult.show(context.resultView);
                    }
                });

            } else {
                context.searchResult.close();
            }
        },

        abortExistingRequest: function () {
            if (this.currentSearchRequest && this.currentSearchRequest.readyState > 0 && this.currentSearchRequest.readyState < 4) {
                console.log('aborting previous pending search request.');
                this.currentSearchRequest.abort();
            }
        }
    });
});