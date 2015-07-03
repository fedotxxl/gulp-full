angular.module("app").
    factory("commonB", function (commonA) {
        return {
            do: function () {
                console.log(commonA.get() + " + commonB")
            }
        }
    });