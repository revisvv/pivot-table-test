import { app } from '/client/main';

app.directive('pivotTable', function(dataService) {
    return {
      scope: {
        pivotTableSettings: '='
      },
      templateUrl: 'client/directives/pivot-table/pivot-table.html',
      link: function (scope, element) {
        scope.settings = scope.pivotTableSettings || {};

        scope.settings = {
          cols: scope.settings.cols || ["brand", "type"],
          rows: scope.settings.rows || ["year", "department"],
          valueFunc: scope.settings.valueFunc || function(values) {
            let sum = 0;
            values.forEach((value) => {
              sum += parseInt(value.price);
            });
            return sum;
          }
        }

        dataService.getData().then(function successCallback(response) {
          scope.data = dataService.composeData(scope.settings.cols, scope.settings.rows, scope.settings.valueFunc, response.data);
          scope.settings.cols = scope.data['colsValues'];
          scope.tableValues = scope.data['tableValues'];
        });
      }
    };
  });
