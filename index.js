angular.module('ngRap', ['opensearchConfig'])
.config(['$httpProvider', function(httpProvider) {
    if (window.RAP) {
        httpProvider.interceptors.push('mockInterceptor');
    }
}])
.factory('mockInterceptor', [function() {
    var mockParam = window.location.search.match(/mock=?(\d)?/);
    var mode = mockParam ? +mockParam[1] : 0;
    var preUrl = 'http://' + RAP.getHost() + '/mockjsdata/' + RAP.getProjectId();

    if (!mode) { //默认为 仅拦截白名单中的项
        mode = 3;
    }
    return {
        request: function(config) {
            var url = config.url;
            var whiteList = window.RAP ? RAP.getWhiteList() : [];
            var blackList = window.RAP ? RAP.getBlackList : [];

            if (mockParam) {
                switch (mode) {
                    case 0: //不拦截
                        break;
                    case 1: //拦截全部
                        config.mocked = 1;
                        config.url = preUrl + url;
                        break;
                    case 2: //黑名单中的项不拦截
                        if(blackList.indexOf(url) == -1){
                            config.mocked = 2;
                            config.url = preUrl + url;
                        }
                        break;
                    case 3: //仅拦截白名单中的项
                        if (whiteList.indexOf(url) != -1) {
                            config.mocked = 3;
                            config.url = preUrl + url;
                            console.log(config.url);
                        }
                        break;
                }
            }
            return config;
        }
    };
}]);
