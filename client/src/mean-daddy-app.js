(function () {
    'use strict';

    angular
        .module('meanDaddyApp', [])
        .filter('nullCurrency', nullCurrency)
        .filter('dueDate', dueDate)
        .controller('MeanDaddyCtrl', MeanDaddyCtrl);

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

    function MeanDaddyCtrl(apiSvc, $scope) {

        var vm = this;

        // Properties
        vm.accounts         = [];
        vm.totals           = {};

        // Methods
        vm.backupDatabse    = backupDatabse;

        init();

        function init() {
            apiSvc
                .fetchCollection('accounts', ['priority', 'name'])
                .then(function (accounts) {
                    vm.accounts = accounts;
                });
            $scope.$watch(getAccountsArray, setAccountsTotals);
        }

        function backupDatabse() {
            var failure = _.partial(alert, 'Failure');
            var success = _.partial(alert, 'Success');
            apiSvc
                .doAction('backupDatabase')
                .then(success, failure);
        }

        function getAccountsArray() {
            return vm.accounts;
        }

        function setAccountsTotals(accountsArray, oldAccountsArray) {
            if (accountsArray && accountsArray !== oldAccountsArray) {
                vm.totals = {
                    balance: 0,
                    dueAmount: 0,
                    overDueAmount: 0
                };
                _.each(accountsArray, function (account) {
                    vm.totals.balance += account.balance;
                    vm.totals.dueAmount += account.dueAmount;
                    vm.totals.overDueAmount += account.overDueAmount;
                });
            }
        }

    }

    function nullCurrency($filter) {
        return function(input) {
            return input ? $filter('currency')(input) : '';
        };
    }

}());
