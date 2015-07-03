angular.module("app").
    controller("IndexController", function (commonA, commonB) {
        commonA.do();
        commonB.do();
    });