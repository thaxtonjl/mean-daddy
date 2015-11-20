(function () {
    'use strict';

    angular
        .module('meanDaddyApp', [])
        .controller('MeanDaddyCtrl', MeanDaddyCtrl);

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

}());
