angular.module("app").
    factory("commonA", function () {
        return {
            get: function () {
                return "commonA"
            },
            do: function () {
                console.log("common.a")
            }
        }
    });