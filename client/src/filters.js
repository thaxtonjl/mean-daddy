(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .filter('dueDate', dueDate)
        .filter('dueDays', dueDays)
        .filter('nullCurrency', nullCurrency);

    function dueDate($filter) {
        return function(input) {
            var date = '';
            var due;
            if (input) {
                due = getLocalDate(input);
                date = $filter('date')(due, 'MMM d');
            }
            return date;
        };
    }

    function dueDays() {
        return function(input) {
            var day = 24 * 60 * 60 * 1000;
            var days = '';
            var due, now;
            if (input) {
                due = getLocalDate(input);
                now = getLocalDate();
                days = Math.round((due - now) / day);
            }
            return days;
        };
    }

    function getLocalDate(input) {
        var date;
        if (input) {
            date = new Date(input);
            date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        } else {
            date = new Date();
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        return date;
    }

    function nullCurrency($filter) {
        return function(input) {
            return input ? $filter('currency')(input) : '';
        };
    }

}());
