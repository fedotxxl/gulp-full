angular.module("app").
    factory("commonA", function() {
      return {
        do: function() {
          console.log("common.a")
        }
      }
    });