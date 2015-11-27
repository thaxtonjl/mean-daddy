(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .factory('dateSvc', dateSvcFactory);

    function dateSvcFactory() {

        return {
            convertToUTC: convertToUTC,
            convertToLocal: convertToLocal,
            daysFromNow: daysFromNow
        };

        function convertToUTC(input) {
            return new Date(moment(input).format('YYYY-MM-DD') + 'T00:00:00.000Z');
        }

        function convertToLocal(input) {
            return new Date(moment(input).utc().format('MM/DD/YYYY'));
        }

        function daysFromNow(input) {
            var days = null;
            var now;
            if (input) {
                now = convertToUTC();
                days = Math.round(moment(input).diff(now, 'days', true));
            }
            return days;
        }

    }

}());
