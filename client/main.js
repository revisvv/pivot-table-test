import angular from 'angular';
import angularMeteor from 'angular-meteor';

export const app = angular.module('pivotTableApp', [
  angularMeteor
]);

app.controller("MainCtrl", function ($scope) {
    $scope.settings = {
      rows: ["year", "department"],
      cols: ["brand", "model"],
      valueFunc: function(values) {
        console.log(values);
        return values.length;
      }
    }
  });
