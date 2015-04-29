angular.module('ngRap', [])
.provider('ngRap', [function() {
	var provider = this;

	this.enable = function() {
		this.enabled = true;
	};

	this.$get = ['$q', function(q) {
		function init() {
			var deferred = q.defer();
			var script = document.createElement('script');
			script.src = provider.script;
			script.onload = script.onreadystatechange = function(_, isAbort) {
				if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
					script.onload = script.onreadystatechange = null;
					script = undefined;
					if (!isAbort) {
						deferred.resolve();
					}
				}
			};
			document.body.appendChild(script);
			return deferred.promise;
		}

		var ngRap = {
			intercept: function(config) {
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
            },
            loaded: provider.enabled && init().then(function() {
				var mockParam = window.location.search.match(/mock=?(\d)?/);
				var mode = mockParam ? +mockParam[1] : 0;
				if (window.RAP) {
					RAP.setMode(mode);
				}
			})
		};

		return ngRap;
    }];
}])
.config(['$httpProvider', function(httpProvider) {
	httpProvider.interceptors.unshift('rapMockInterceptor');
}])
.factory('rapMockInterceptor', ['ngRap', function(ngRap) {
	return {
		request: function(config) {
			if (ngRap.loaded) {
				return ngRap.loaded.then(function() {
					return ngRap.intercept(config);
				});
			} else {
				return config;
			}
		}
	};
}]);
