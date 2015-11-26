(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .directive('upcomingTransactionsPanel', upcomingTransactionsPanel);

    function upcomingTransactionsPanel() {
        return {
            controller: 'UpcomingTransactionsPanelCtrl',
            controllerAs: 'upcomingTransactionsPanel',
            restrict: 'A',
            templateUrl: '/directives/upcoming-transactions-panel.html'
        };
    }

}());
