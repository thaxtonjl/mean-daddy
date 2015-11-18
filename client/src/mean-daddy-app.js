angular
    .module('meanDaddyApp', [])
    .controller('MeanDaddyCtrl', MeanDaddyCtrl);

function MeanDaddyCtrl($http) {

    var vm = this;

    vm.accounts = [];

    init();

    function init() {
        $http
            .get('/api/accounts')
            .then(function (response) {
                vm.accounts = response && response.data;
            });
    }

}
