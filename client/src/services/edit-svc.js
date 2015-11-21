(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .factory('editSvc', editSvc);

    function editSvc(apiSvc, $uibModal) {

        return {
            create: create
        };

        function create() {
            return $uibModal
                .open({
                    templateUrl: '/services/edit-svc-modal.html'
                })
                .result
                .then(function (account) {
                     return apiSvc.addToCollection('accounts', account);
                });
        }

    }

}());
