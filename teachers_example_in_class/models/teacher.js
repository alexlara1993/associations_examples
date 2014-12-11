"use strict";

module.exports = function(sequelize, DataTypes) {
  var teacher = sequelize.define("teacher", {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return teacher;
};
