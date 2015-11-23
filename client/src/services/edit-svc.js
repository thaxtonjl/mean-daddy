(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .factory('editSvc', editSvc);

    function editSvc($uibModal) {

        return {
            create: _.partial(edit, null),
            edit: edit
        };

        function edit(account) {
            return $uibModal
                .open({
                    controller: 'EditSvcModalCtrl',
                    controllerAs: 'editSvcModal',
                    templateUrl: '/services/edit-svc-modal.html',
                    resolve: {
                        originalAccount: function () {
                            return account;
                        }
                    }
                })
                .result;
        }

    }

}());
