## 寻找开发者

我的项目已经没有在使用rap了，这个插件我不会再维护，感兴趣的朋友可发消息给我，将项目转出，谢谢。

## 安装

* `$ bower install ng-rap`

## 使用

```
angular.module('myApp', ['ngRap']).config(['$httpProvider', 'ngRapProvider', function(httpProvider, ngRapProvider) {
	ngRapProvider.script = 'http://xxx.xxx.xxx/rap.plugin.js?projectId=nnn'; // replce your host and project id
	ngRapProvider.enable({
		mode: 3
	});
	httpProvider.interceptors.push('rapMockInterceptor');
}]);
```
