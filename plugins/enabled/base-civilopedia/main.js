var Civilopedia = engine.Civilopedia = {
    categories: {},
    load: function() {
        Engine.Plugin.get('civilopedia').forEach(function(pack) {
            pack.contents.forEach(function(file) {
                var article = engine.loadJSON(file);

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

engine.on('start', function() {
    Civilopedia.load();
});
