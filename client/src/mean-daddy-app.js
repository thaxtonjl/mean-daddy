angular
    .module('meanDaddyApp', [])
    .controller('MeanDaddyCtrl', MeanDaddyCtrl);

function MeanDaddyCtrl() {
    this.accounts = [{name: 'Rent', amount: 950}, {name: 'Electricity', amount: 88}];
}
