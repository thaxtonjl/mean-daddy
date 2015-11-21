(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .factory('apiSvc', apiSvc);

    function apiSvc($http, $q) {

        var API_BASE = '/api';

        return {
            addToCollection: addToCollection,
            doAction: doAction,
            fetchCollection: fetchCollection
        };

        function addToCollection(collectionName, newItem) {
            if (!collectionName || typeof collectionName !== 'string') {
                return $q.reject('Invalid collectionName: ' + JSON.stringify(collectionName));
            }
            if (!newItem || typeof newItem !== 'object') {
                return $q.reject('Invalid newItem: ' + JSON.stringify(newItem));
            }
            return $http
                .post(API_BASE + '/' + collectionName, newItem)
                .then(function (response) {
                    return response && response.data;
                });
        }

        function doAction(actionName) {
            var promise;
            if (actionName && typeof actionName === 'string') {
                promise = $http
                    .post(API_BASE + '/actions', {
                        name: actionName
                    });
            } else {
                promise = $q.reject('Invalid actionName: "' + actionName + '"');
            }
            return promise;
        }

        function fetchCollection(collectionName, sortByAll) {
            var promise;
            if (collectionName && typeof collectionName === 'string') {
                promise = $http
                    .get(API_BASE + '/' + collectionName)
                    .then(function (response) {
                        var list = response && response.data || [];
                        if (_.isArray(sortByAll)) {
                            list = _.sortByAll(list, sortByAll);
                        }
                        return list;
                    });
            } else {
                promise = $q.reject('Invalid collectionName: "' + collectionName + '"');
            }
            return promise;
        }

    }

}());
