angular.module("app").
    factory("commonB", function() {
      return {
        do: function() {
          console.log("common.b")
        }
      }
    });