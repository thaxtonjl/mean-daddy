(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .controller('AccountListPanelCtrl', AccountListPanelCtrl);

    function AccountListPanelCtrl(apiSvc, editSvc, $scope) {

        var vm = this;

        // Properties
        vm.accounts         = [];
        vm.totals           = {};

        // Methods
        vm.addNewAccount    = addNewAccount;
        vm.backupDatabse    = backupDatabse;
        vm.editAccount      = editAccount;

        init();

        function init() {
            apiSvc
                .fetchCollection('accounts')
                .then(setAccountsArray);
            $scope.$watch(getAccountsArray, setAccountsTotals);
        }

        function addNewAccount() {
            editSvc
                .create()
                .then(pushToAccountsArray);
        }

        function backupDatabse() {
            var failure = _.partial(alert, 'Failure');
            var success = _.partial(alert, 'Success');
            apiSvc
                .doAction('backupDatabase')
                .then(success, failure);
        }

        function editAccount(account) {
            editSvc
                .edit(account)
                .then(sortAccountsArray);
        }

        function getAccountsArray() {
            return vm.accounts;
        }

        function pushToAccountsArray(account) {
            setAccountsArray(vm.accounts.concat(account));
        }

        function setAccountsArray(accounts) {
            vm.accounts = _.sortByAll(accounts || [], ['priority', 'name']);
        }

        function setAccountsTotals(accountsArray, oldAccountsArray) {
            if (accountsArray && accountsArray !== oldAccountsArray) {
                vm.totals = {
                    balance: 0,
                    dueAmount: 0,
                    overDueAmount: 0
                };
                _.each(accountsArray, function (account) {
                    if (account) {
                        vm.totals.balance += account.balance || 0;
                        vm.totals.dueAmount += account.dueAmount || 0;
                        vm.totals.overDueAmount += account.overDueAmount || 0;
                    }
                });
            }
        }

        function sortAccountsArray() {
            setAccountsArray(vm.accounts);
        }

    }

}());
