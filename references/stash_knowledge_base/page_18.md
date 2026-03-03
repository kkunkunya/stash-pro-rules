# 服务提供商订阅 - Stash 配置指南 | Stash

**URL**: https://stashws.org/features/service-provider-subscription.html

服务提供商订阅
​
Stash 支持由服务提供商管理的配置订阅，可以自动定时更新配置文件，并在应用首页清晰显示服务剩余流量、过期时间等关键信息。
定时更新配置
​
通过简单的配置注释，即可让 Stash 自动从服务提供商获取最新的配置更新。
配置方法
​
在配置文件的
首行
添加如下注释，Stash 会自动识别为服务提供商管理的配置，并定期从指定 URL 获取更新：
yaml
#SUBSCRIBED https://proxy.service/stash/config
更新频率
​
默认检查间隔
：12 小时
自定义设置
：用户可在设置页面中调整更新频率
展示服务信息
​
服务提供商可以通过 HTTP 响应头返回订阅状态信息，Stash 会自动解析并在应用首页展示。
信息格式
​
服务提供商应在 HTTP Response Header 中返回以下格式的信息：
Subscription-Userinfo: upload=%f; download=%f; total=%f; expire=%f
参数说明
：
upload
：已使用上行流量
download
：已使用下行流量
total
：流量总量
expire
：服务过期时间（Unix 时间戳）
信息显示
​
解析后的服务信息会在 Stash App 首页清晰展示，方便用户随时了解订阅状态。
配置优先级
​
Stash 按以下顺序获取服务信息：
优先
：定时更新配置的 URL
备选
：配置文件中的
proxy-providers
的
url
字段（可在可视化编辑页面设置）
优化提示
为降低流量消耗，Stash 会优先使用
HEAD 方法
获取服务信息，仅在必要时使用 GET 方法。
