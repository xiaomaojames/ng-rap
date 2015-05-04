angular.module('ngRap', [])
.provider('ngRap', [function() {
	var provider = this;

	this.enable = function(options) {
		this.enabled = true;
		this.mode = options.mode;
	};

	this.$get = ['$injector', '$q', function(injector, q) {
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
			check: function(url, data) {
				var http = injector.get('$http');
				http.get(url).success(function(result) {
					RAP.checkerHandler.call({
						data: data
					}, result);
				});
			},
			intercept: function(config) {
				var mode = RAP.getMode();
				var whiteList = RAP.getWhiteList();
				var blackList = RAP.getBlackList();
				var url = config.url;
				var mockHost = 'http://' + RAP.getHost() + '/mockjsdata/' + RAP.getProjectId();
				var mockUrl = mockHost + url;
				var http = injector.get('$http');

				if (config.url.indexOf(mockHost) != -1) {
					return config;
				}

                if (mode == 0) {
                	if (whiteList.indexOf(url) != -1) {
                		config.needCheck = mockUrl;
                	}
                	return config;
                } else if (mode == 1) {
                	config.mocked = true;
                	config.url = mockUrl;
                	return config;
                } else if (mode == 2) {
                	if (blackList.indexOf(url) == -1) {
                		config.mocked = true;
                		config.url = mockUrl;
                	}
                	return config;
                } else if (mode == 3) {
                	if (whiteList.indexOf(url) != -1) {
                		config.mocked = true;
                		config.url = mockUrl;
                	}
                	return config;
                }
            },
            loaded: provider.enabled && init().then(function() {
				if (window.RAP) {
					RAP.setMode(provider.mode);
				}
			})
		};

		return ngRap;
    }];
}])
.factory('rapMockInterceptor', ['$q', 'ngRap', function(q, ngRap) {
	return {
		request: function(config) {
			if (ngRap.loaded) {
				return ngRap.loaded.then(function() {
					return ngRap.intercept(config);
				});
			} else {
				return config;
			}
		},
		response: function(res) {
			var data = res.data;
			if (ngRap.loaded && !res.config.mocked) {
				ngRap.loaded.then(function() {
					if (res.config.needCheck) {
						ngRap.check(res.config.needCheck, data);
					}
				});
			}
			return res;
		}
	};
}]);
