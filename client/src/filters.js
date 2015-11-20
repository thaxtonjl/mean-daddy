(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .filter('dueDate', dueDate)
        .filter('nullCurrency', nullCurrency);

    function dueDate($filter) {
        return function(input) {
            var due = '';
            var day = 24 * 60 * 60 * 1000;
            var days, now;
            if (input) {
                due = new Date(input);
                due = new Date(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate());
                now = new Date();
                now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
                days = Math.round((due - now) / day);
                due = $filter('date')(due, 'MMM d') + ' (' + days + ')';
            }
            return due;
        };
    }

    function nullCurrency($filter) {
        return function(input) {
            return input ? $filter('currency')(input) : '';
        };
    }

}());
