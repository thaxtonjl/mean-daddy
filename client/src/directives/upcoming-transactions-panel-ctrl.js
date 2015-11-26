(function () {
    'use strict';

    angular
        .module('meanDaddyApp')
        .controller('UpcomingTransactionsPanelCtrl', UpcomingTransactionsPanelCtrl);

    function UpcomingTransactionsPanelCtrl() {

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

        function getLocalDate(input) {
            var date;
            if (input) {
                date = new Date(input);
                date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            } else {
                date = new Date();
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            }
            return date;
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
                            amount: 179
                        }
                    ]
                },
                {
                    days: 4,
                    transactions: [
                        //{
                        //    name: 'AAA',
                        //    amount: -179.5,
                        //    date: '2015-10-31'
                        //},
                        {
                            name: 'Verizon Wireless',
                            amount: -187.61,
                            date: '2015-11-11'
                        },
                        {
                            name: 'Natural Gas',
                            amount: -148.06,
                            date: '2015-11-29'
                        }
                    ]
                },
                {
                    days: 19,
                    transactions: [
                        {
                            name: 'Fusion Alliance',
                            amount: 2259.34,
                            date: '2015-11-30'
                        },
                        {
                            name: 'Rent',
                            amount: -950,
                            date: '2015-12-01'
                        },
                        {
                            name: 'Ballet/Tap Costumes',
                            amount: -132,
                            date: '2015-12-08'
                        },
                        {
                            name: 'Electricity',
                            amount: -116.15,
                            date: '2015-12-14'
                        }
                    ]
                }
            ];
        }

        function isOverdue(input) {
            if (!input) {
                return false;
            }
            var dueDate = getLocalDate(input);
            var now = getLocalDate();
            return now > dueDate;
        }

    }

}());
