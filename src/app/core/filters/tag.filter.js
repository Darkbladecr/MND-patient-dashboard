function filterByTags() {
	'ngInject';
    'use strict';

    return function(items, tags) {
        if (items.length === 0 || tags.length === 0) {
            return items;
        }

        var filtered = [];

        items.forEach(function(item) {
            var match = tags.every(function(tag) {
                var tagExists = false;

                item.tags.forEach(function(itemTag) {
                    if (itemTag.name === tag.name) {
                        tagExists = true;
                        return;
                    }
                });

                return tagExists;
            });

            if (match) {
                filtered.push(item);
            }
        });

        return filtered;
    };
}

function filterSingleByTags() {
	'ngInject';
    'use strict';

    return function(itemTags, tags) {
        if (itemTags.length === 0 || tags.length === 0) {
            return;
        }

        if (itemTags.length < tags.length) {
            return [];
        }

        var filtered = [];

        var match = tags.every(function(tag) {
            var tagExists = false;

            itemTags.forEach(function(itemTag) {
                if (itemTag.name === tag.name) {
                    tagExists = true;
                    return;
                }
            });

            return tagExists;
        });

        if (match) {
            filtered.push(itemTags);
        }

        return filtered;
    };
}

export { filterByTags, filterSingleByTags };
