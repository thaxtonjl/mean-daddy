(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .filter('dueDate', dueDate)
        .filter('dueDays', dueDays)
        .filter('nullCurrency', nullCurrency);

    function dueDate() {
        return function(input) {
            var date = '';
            if (input) {
                date = moment(input).utc().format('MMM Do');
            }
            return date;
        };
    }

    function dueDays(dateSvc) {
        return function(input) {
            var days;
            if (input) {
                days = dateSvc.daysFromNow(input);
            }
            return typeof days === 'number' ? days : '';
        };
    }

    function nullCurrency($filter) {
        return function(input) {
            return input ? $filter('currency')(input) : '';
        };
    }

}());
