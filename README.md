## 安装

* `$ bower install ng-rap`

## 使用

```
angular.module('myApp', ['ngRap']).config(['httpProvider', 'ngRapProvider', function(httpProvider, ngRapProvider) {
	ngRapProvider.script = 'http://rap.alibaba-inc.com/rap.plugin.js?projectId=nnn'; // replce nnn with your project id
	ngRapProvider.enable({
		mode: 3
	});
	httpProvider.interceptors.push('rapMockInterceptor');
}]);
```
