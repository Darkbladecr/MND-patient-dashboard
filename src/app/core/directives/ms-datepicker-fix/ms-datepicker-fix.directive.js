import angular from 'angular';
import moment from 'moment';

function msDatepickerFixConfigProvider() {
	'ngInject';
    'use strict';

    var service = this;

    // Default configuration
    var defaultConfig = {
        // To view
        formatter: function(val) {
            if (!val) {
                return '';
            }

            return val === '' ? val : new Date(val);
        },
        // To model
        parser: function(val) {
            if (!val) {
                return '';
            }

            return moment(val).add(moment(val).utcOffset(), 'm').toDate();
        }
    };

    // Methods
    service.config = config;

    //////////

    /**
     * Extend default configuration with the given one
     *
     * @param configuration
     */
    function config(configuration) {
        defaultConfig = angular.extend({}, defaultConfig, configuration);
    }

    /**
     * Service
     */
    service.$get = function() {
        return defaultConfig;
    };
}

function msDatepickerFix(msDatepickerFixConfig) {
	'ngInject';
    'use strict';

    return {
        require: 'ngModel',
        priority: 1,
        link: function(scope, elem, attrs, ngModel) {
            ngModel.$formatters.push(msDatepickerFixConfig.formatter); // to view
            ngModel.$parsers.push(msDatepickerFixConfig.parser); // to model
        }
    };
}
export { msDatepickerFixConfigProvider, msDatepickerFix };
