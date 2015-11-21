(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .controller('EditSvcModalCtrl', EditSvcModalCtrl);

    function EditSvcModalCtrl(apiSvc, $uibModalInstance) {

        var vm = this;

        // Properties
        vm.errorMessage = '';

        // Methods
        vm.submit = submit;

        function submit(account) {
            account.balance = parseInt(account.balance, 10);
            account.dueAmount = parseInt(account.dueAmount, 10);
            account.overDueAmount = parseInt(account.overDueAmount, 10);
            account.priority = parseInt(account.priority, 10);
            apiSvc
                .addToCollection('accounts', account)
                .then(function (newAccountObject) {
                    $uibModalInstance.close(newAccountObject);
                })
                .catch(function (response) {
                    vm.errorMessage = _.get(response, 'data.error');
                });
        }

    }

}());
