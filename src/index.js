angular.module('ngRap', ['opensearchConfig'])
.config(['$httpProvider', function(httpProvider) {
    var mockParam = window.location.search.match(/mock=?(\d)?/);
    var mode = mockParam ? +mockParam[1] : 0;
    if (window.RAP) {
        RAP.setMode(mode);
    }

    httpProvider.interceptors.unshift('rapMockInterceptor');
}])
.factory('rapMockInterceptor', [function() {
    return {
        request: function(config) {
            if (!window.RAP) return config;

            var mode = RAP.getMode();
            var whiteList = RAP.getWhiteList();
            var blackList = RAP.getBlackList();
            var url = config.url;
            var mockUrl = 'http://' + RAP.getHost() + '/mockjsdata/' + RAP.getProjectId() + url;

            switch (mode) {
                case 0: //不拦截
                    break;
                case 1: //拦截全部
                    config.mocked = true;
                    config.url = mockUrl;
                    break;
                case 2: //黑名单中的项不拦截
                    if (blackList.indexOf(url) == -1) {
                        config.mocked = true;
                        config.url = mockUrl;
                    }
                    break;
                case 3: //仅拦截白名单中的项
                    if (whiteList.indexOf(url) != -1) {
                        config.mocked = true;
                        config.url = mockUrl;
                    }
                    break;
            }
            return config;
        }
    };
}]);
