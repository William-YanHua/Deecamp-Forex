(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{1237:function(t,e,n){"use strict";var o,r=n(0),c=n.n(r),i=n(4),a=n(51),p=n(7),u=(n(69),n(83),n(42)),s=n.n(u),f=(n(99),n(25)),l=(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),d=function(t,e,n,o){var r,c=arguments.length,i=c<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(i=(c<3?r(i):c>3?r(e,n,i):r(e,n))||i);return c>3&&i&&Object.defineProperty(e,n,i),i},y=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},m=(s.a.Sider,function(t){function e(){return null!==t&&t.apply(this,arguments)||this}var n,o;return l(e,t),e.prototype.componentDidMount=function(){this.navStore.sidenavs=this.props.routes},e.prototype.componentWillUnmount=function(){this.navStore.sidenavs=null},e.prototype.render=function(){return this.props.children},d([i.Inject,y("design:type","function"==typeof(n=void 0!==a.a&&a.a)?n:Object)],e.prototype,"navStore",void 0),d([i.Inject,y("design:type","function"==typeof(o=void 0!==f.a&&f.a)?o:Object)],e.prototype,"routerStore",void 0),d([p.action,y("design:type",Function),y("design:paramtypes",[]),y("design:returntype",void 0)],e.prototype,"componentDidMount",null),d([p.action,y("design:type",Function),y("design:paramtypes",[]),y("design:returntype",void 0)],e.prototype,"componentWillUnmount",null),e}(c.a.Component));e.a=m},1691:function(t,e,n){"use strict";n.r(e);var o=n(0),r=n.n(o),c=n(36),i=n(70),a=n(147),p=n(1237),u=function(){return(u=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};function s(t){return t.split("/").filter(function(t){return!!t}).slice(1).join("/")}var f=Object(c.c)().userCenter,l=[{path:"",component:Promise.all([n.e(1),n.e(2),n.e(6),n.e(37),n.e(43)]).then(n.bind(null,1682)),match:function(t){return!s(t)},iconName:"user",textId:f.profile.title,exact:!0},{path:"investmentPreference",component:Promise.all([n.e(2),n.e(3),n.e(5),n.e(6),n.e(27)]).then(n.bind(null,1678)),textId:f.investmentPreference.title,match:function(t){return s(t).startsWith("investmentPreference")},iconName:"radar-chart"}],d=l.map(function(t){return{type:i.a.Async,path:t.path,exact:t.exact,component:t.component}}),y=l.map(function(t){return{path:Object(a.b)("user",t.path),textId:t.textId||f[t.path],iconName:t.iconName,match:t.match}}),m=Object(a.a)(d);e.default=function(t){return r.a.createElement(p.a,{routes:y},r.a.createElement(m,u({},t)))}}}]);