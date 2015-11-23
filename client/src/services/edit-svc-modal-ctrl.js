(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .controller('EditSvcModalCtrl', EditSvcModalCtrl);

    function EditSvcModalCtrl(apiSvc, originalAccount, $uibModalInstance) {

        var vm = this;

        // Properties
        vm.account      = _.merge({}, originalAccount);
        vm.errorMessage = '';
        vm.heading      = originalAccount ? 'Edit Account' : 'New Account';
        vm.primaryLabel = originalAccount ? 'Save' : 'Add';

        // Methods
        vm.submit       = submit;

        init();

        function init() {
            var date;
            if (vm.account.dueDate) {
                date = new Date(vm.account.dueDate);
                vm.account.dueDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            }
        }

        function convertForTransport(accountInput) {
            var transport = _.merge({}, accountInput);
            transport.balance = parseFloat(transport.balance);
            transport.dueAmount = parseFloat(transport.dueAmount);
            transport.dueDate = convertToDateString(transport.dueDate);
            transport.overDueAmount = parseFloat(transport.overDueAmount);
            transport.priority = parseInt(transport.priority, 10);
            return transport;
        }

        function convertToDateString(date) {
            var month = date.getUTCMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            var d = date.getUTCDate();
            if (d < 10) {
                d = '0' + d;
            }
            return date.getUTCFullYear() + '-' + month + '-' + d;
        }

        function submit(account) {
            var transportAccount = convertForTransport(account);
            if (originalAccount) {
                apiSvc
                    .editInCollection('accounts', transportAccount)
                    .then(function (newAccountObject) {
                        _.merge(originalAccount, newAccountObject);
                        $uibModalInstance.close(originalAccount);
                    })
                    .catch(function (response) {
                        var data = _.get(response, 'data');
                        vm.errorMessage = _.get(data, 'error', data);
                    });
            } else {
                apiSvc
                    .addToCollection('accounts', transportAccount)
                    .then(function (newAccountObject) {
                        $uibModalInstance.close(newAccountObject);
                    })
                    .catch(function (response) {
                        var data = _.get(response, 'data');
                        vm.errorMessage = _.get(data, 'error', data);
                    });
            }
        }

    }

}());
