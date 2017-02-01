var Civilopedia = game.civilopedia = {
    categories: {},
    load: function() {
        Plugin.get('civilopedia-articles').forEach(function(pack) {
            pack.contents.forEach(function(file) {
                var article = game.loadJSON(file);

                if (!('category' in article)) {
                    article.category = {
                        name: 'miscellaneous'
                    }
                }

                article.category.name = article.category.name || 'miscellaneous';

                if (!(article.category in Civilopedia.categories)) {
                    Civilopedia.categories[article.category.name] = {
                        articles: []
                    };
                }

                Civilopedia.categories[article.category.name].articles.push(article);
            });
        });
    },
    open: function() {

    }
};

game.on('start', function() {
    Civilopedia.load();
});
