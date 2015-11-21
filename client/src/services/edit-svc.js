(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .factory('editSvc', editSvc);

    function editSvc($uibModal) {

        return {
            create: create
        };

        function create() {
            return $uibModal
                .open({
                    controller: 'EditSvcModalCtrl',
                    controllerAs: 'editSvcModal',
                    templateUrl: '/services/edit-svc-modal.html'
                })
                .result;
        }

    }

}());
