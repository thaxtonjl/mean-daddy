(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .controller('UpcomingTransactionsPanelCtrl', UpcomingTransactionsPanelCtrl);

    function UpcomingTransactionsPanelCtrl(dateSvc) {

        var vm = this;

        // Properties
        vm.payGroups = getPayGroups();

        // Methods
        vm.isOverdue = isOverdue;

        init();

        function init() {
            var total = 0;
            _.each(vm.payGroups, function (group) {
                _.each(group.transactions, function (transaction) {
                    total += transaction.amount;
                });
                group.subTotal = total;
            });
        }

        function getPayGroups() {
            return [
                {
                    days: 0,
                    transactions: [
                        {
                            name: 'Checking',
                            amount: 43.44
                        },
                        {
                            name: 'Available Credit',
                            amount: 178
                        }
                    ]
                },
                {
                    days: 4,
                    transactions: [
                        //{
                        //    name: 'AAA',
                        //    amount: -179.5,
                        //    date: '2015-10-31T00:00:00.000Z'
                        //},
                        {
                            name: 'Verizon Wireless',
                            amount: -187.61,
                            date: '2015-11-11T00:00:00.000Z'
                        },
                        {
                            name: 'Natural Gas',
                            amount: -148.06,
                            date: '2015-11-29T00:00:00.000Z'
                        }
                    ]
                },
                {
                    days: 19,
                    transactions: [
                        {
                            name: 'Fusion Alliance',
                            amount: 2259.34,
                            date: '2015-11-30T00:00:00.000Z'
                        },
                        {
                            name: 'Rent',
                            amount: -950,
                            date: '2015-12-01T00:00:00.000Z'
                        },
                        {
                            name: 'Ballet/Tap Costumes',
                            amount: -132,
                            date: '2015-12-08T00:00:00.000Z'
                        },
                        {
                            name: 'Electricity',
                            amount: -116.15,
                            date: '2015-12-14T00:00:00.000Z'
                        }
                    ]
                }
            ];
        }

        function isOverdue(input) {
            if (!input) {
                return false;
            }
            var days = dateSvc.daysFromNow(input);
            return days < 0;
        }

    }

}());
