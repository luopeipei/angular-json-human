/* global _, angular */

'use strict';

angular.module('yaru22.directives.jsonHuman', [
  'yaru22.directives.jsonHuman.tmpls'
]).factory('RecursionHelper', ['$compile', function ($compile) {
  var RecursionHelper = {
    compile: function (element) {
      var contents = element.contents().remove();
      var compiledContents;
      return function(scope, element) {
        if (!compiledContents) {
          compiledContents = $compile(contents);
        }
        compiledContents(scope, function (clone) {
          element.append(clone);
        });
        var json = scope.json;
        scope.isBoolean = _.isBoolean(json);
        scope.isNumber = _.isNumber(json);
        scope.isString = _.isString(json);
        scope.isPrimitive = scope.isBoolean || scope.isNumber || scope.isString;
        scope.isObject = _.isPlainObject(json);
        scope.isArray = _.isArray(json);
        scope.isEmpty = _.isEmpty(json);
      };
    }
  };
  return RecursionHelper;
}]).directive('jsonHuman', function () {
  return {
    restrict: 'A',
    templateUrl: 'template/angular-json-human-root.tmpl',
    link: function (scope, elem, attrs) {
      var json = null;
      scope.$watch(attrs.jsonHuman, function() {
        try {
          json = JSON.parse(scope.$eval(attrs.jsonHuman));
        } catch (e) {
        }
        scope.json = json;
      });
      scope.isObject = _.isPlainObject(json);
      scope.isArray = _.isArray(json);
    }
  };
}).directive('jsonHumanHelper', function (RecursionHelper) {
  return {
    restrict: 'A',
    scope: {
      json: '=jsonHumanHelper'
    },
    templateUrl: 'template/angular-json-human.tmpl',
    compile: function(tElem) {
      return RecursionHelper.compile(tElem);
    }
  };
});
