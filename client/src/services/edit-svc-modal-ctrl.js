(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .controller('EditSvcModalCtrl', EditSvcModalCtrl);

    function EditSvcModalCtrl(apiSvc, dateSvc, originalAccount, $uibModalInstance) {

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
            if (vm.account.dueDate) {
                vm.account.dueDate = dateSvc.convertToLocal(vm.account.dueDate);
            }
        }

        function convertForTransport(accountInput) {
            var transport = _.merge({}, accountInput);
            transport.balance = parseFloat(transport.balance);
            transport.dueAmount = parseFloat(transport.dueAmount);
            transport.dueDate = convertDateToUTC(transport.dueDate);
            transport.overDueAmount = parseFloat(transport.overDueAmount);
            transport.priority = parseInt(transport.priority, 10);
            return transport;
        }

        function convertDateToUTC(date) {
            if (!date) {
                return null;
            }
            return dateSvc.convertToUTC(date);
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
