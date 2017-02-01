import { app } from '/client/main';

app.service('dataService', function($http) {
  this.getData = () => {
    return $http({
      method: 'GET',
      url: '/api/data.json'
    });
  }

  this.composeData = (cols, rows, valueFunc, data) => {
    let colsValues = {}, tableValues = {}, toReturn = {};

    colsValues[cols[0]] = { colValues: [] };
    colsValues[cols[1]] = { colValues: [] };

    const primaryCols = _.uniq(_.pluck(data, cols[0])).map((primaryCol) => {
      const query = {};
      query[`${cols[0]}`] = primaryCol;
      const secondaryCols = _.uniq(_.pluck(_.where(data, query), cols[1]));

      secondaryCols.forEach((value) => {
        colsValues[cols[1]].colValues.push({ value });
      });

      return {
        secondaryColCount: secondaryCols.length,
        value: primaryCol
      }
    });

    colsValues[cols[0]] = { colValues: primaryCols };

    tableValues = _.uniq(_.pluck(data, rows[0])).map((primaryRow) => {
      const secondaryRowQuery = {};
      secondaryRowQuery[`${rows[0]}`] = primaryRow;

      const secondaryRows = _.uniq(_.pluck(_.where(data, secondaryRowQuery), rows[1])).map((secondaryRow) => {
        const rowValues = [];
        _.uniq(_.pluck(data, cols[0])).forEach((primaryCol) => {
          const secondaryColQuery = {};
          secondaryColQuery[`${cols[0]}`] = primaryCol;
          const secondaryCols = _.uniq(_.pluck(_.where(data, secondaryColQuery), cols[1]));

          secondaryCols.forEach((secondaryCol) => {
            const query = {};
            query[`${rows[0]}`] = primaryRow;
            query[`${rows[1]}`] = secondaryRow;
            query[`${cols[0]}`] = primaryCol;
            query[`${cols[1]}`] = secondaryCol;

            rowValues.push(valueFunc(_.where(data, query)));
          });
        });

        return { secondaryRowName:secondaryRow, rowValues };
      });

      return {
        secondaryRowsCount: secondaryRows.length,
        primaryValue: primaryRow,
        secondaryRowsValues: secondaryRows
      }
    });

    return toReturn = { colsValues, tableValues };
  }

  return this;
});
