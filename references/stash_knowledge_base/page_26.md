# Stash 延迟测试配置指南 | Stash

**URL**: https://stashws.org/proxy-protocols/proxy-benchmark.html

延迟测试
​
在 Stash 中，你可以为每个代理指定单独的延迟测试参数，包括：延迟测试目标 URL 和测试的超时时间。
延迟测试超时的代理会被标记为不健康。
基本配置
​
yaml
proxies
:
-
name
:
your-proxy
type
:
ss
server
:
server
port
:
443
benchmark-url
:
http://www.apple.com
# 建议只使用 HTTP 协议
benchmark-timeout
:
5
# 延迟测试超时时间，单位：秒
benchmark-disabled
:
false
# 设置为 `true` 时完全禁用延迟测试
共享测试结果
如果一个代理被多个策略组引用，多个策略组会共享这个代理的延迟测试结果。若希望一个代理在不同的策略组使用不同的延迟测试参数，请手动创建多个代理。
延迟测试方式
​
Stash 支持多种方式对代理进行延迟测试，包括：
UDP
：使用 UDP 报文进行延迟测试
TCP
：使用 TCP 握手进行延迟测试（对基于 UDP 的协议如 QUIC 无效）
HTTP HEAD
：默认方式，通过代理发送 HTTP HEAD 请求进行延迟测试
配置参数说明
​
benchmark-url
​
延迟测试使用的目标 URL。建议使用 HTTP 协议而非 HTTPS，因为 HTTPS 需要额外的 TLS 握手时间，可能影响延迟测试的准确性。
benchmark-timeout
​
延迟测试的超时时间，单位为秒。默认值为 5 秒。超过此时间的代理会被标记为不健康。
benchmark-disabled
​
设置为
true
时完全禁用该代理的延迟测试。适用于某些特殊场景，如转发链中的中间代理。
使用建议
​
选择合适的测试 URL
：建议选择稳定、响应快的 HTTP 网站进行测试
合理设置超时时间
：根据网络状况设置适当的超时时间，避免误判
避免频繁测试
：在策略组中合理设置测试间隔，避免过度消耗资源
特殊代理处理
：对于转发链中的代理，可考虑禁用延迟测试
