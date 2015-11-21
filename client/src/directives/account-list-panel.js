(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .directive('accountListPanel', accountListPanel);

    function accountListPanel() {
        return {
            controller: 'AccountListPanelCtrl',
            controllerAs: 'accountListPanel',
            restrict: 'A',
            templateUrl: '/directives/account-list-panel.html'
        };
    }

}());
