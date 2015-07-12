angular.module("app").
    controller("OrderIndexController", function (commonA, commonB) {
      console.log("Order index");

      commonA.do();
      commonB.do();
    });