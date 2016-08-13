angular.module('timerApp', [])
    .directive('smsTimer', function ($timeout, $interval) {
        return {
            restrict: 'AE',
            scope: {
                showTimer: '=',
                callback: '&' //用于调用执行controller中的方法,请求接口发送短信。
            },
            link: function (scope, element, attrs) {
                scope.timer = false;
                scope.timeout = 60000; //短信倒计时时间
                scope.timerCount = scope.timeout / 1000;
                scope.text = "获取验证码";

                scope.onClick = function () {
                    if (!scope.timer) {
                        scope.callback();
                    }
                    scope.showTimer = true;
                    scope.timer = true;
                    scope.text = "秒后重新获取";
                    var counter = $interval(function () {
                        scope.timerCount = scope.timerCount - 1;
                    }, 1000);

                    $timeout(function () {
                        scope.text = "获取验证码";
                        scope.timer = false;
                        $interval.cancel(counter);
                        scope.showTimer = false;
                        scope.timerCount = scope.timeout / 1000;
                    }, scope.timeout);
                }
            },
            template: '<a ng-click="onClick()" class="btn btn-primary btn-radius" ng-disabled="timer"><span ng-if="showTimer">{{ timerCount }}</span>{{text}}</a>'
        };
    })
    .controller('SmsTimerController', function ($scope) {
        $scope.callback = function () {
            cosole.log('callback');
        }
    })
;