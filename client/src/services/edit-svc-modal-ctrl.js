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
