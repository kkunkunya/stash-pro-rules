# Stash 完整教程知识库

爬取时间: 2026-02-05 05:42:30

共 36 个页面

---

## Stash 配置样例 | Stash

**URL**: https://stashws.org/configuration/example-config.html

配置样例
​
Stash 所有的配置文件均使用
YAML
格式。在 YAML 格式中，缩进影响了整个配置的结构，用户可以在
www.yamllint.com
检查配置是否符合 YAML 格式。
Stash 配置由单个配置文件和若干个
覆写文件
组成，配置文件是必须的，覆写文件是可选的。覆写的优先级高于配置文件，覆写文件中的字段会覆盖配置文件中的字段。用户可以通过配置和覆写的组合，打造符合自己需求的配置。
虽然配置文件是必须的，但其中每一个字段都有默认值，用户仅需要填写希望更改的字段即可。
yaml
# 规则模式：rule（规则） / global（全局代理）/ direct（全局直连）
mode
:
rule
# 5 个级别：silent / info / warning / error / debug。级别越高日志输出量越大，越倾向于调试，若需要请自行开启。
log-level
:
info
http
:
# 强制使用 HTTP 引擎处理 TCP 连接
# 捕获后的连接可以使用高级功能，例如重写和脚本
force-http-engine
:
-
'*:80'
# 以 PKCS #12 编码的 CA 证书
ca
:
''
# 证书密码
ca-passphrase
:
''
# 开启中间人攻击（MitM）功能的域名列表，需要确保上述 CA 证书已受系统信任
mitm
:
-
g.cn
-
'*.google.cn'
-
weather-data.apple.com
# 默认只对 443 端口开启
-
weather-data.apple.com:*
# 使用通配符对所有端口开启
-
'*.weather-data.apple.com'
# 域名中也可以使用通配符
-
'-exclude.weather-data.apple.com'
# 用-前缀排除域名
# HTTP(S) 重写，支持 header、302、307、reject 多种策略
url-rewrite
:
-
^http://g\.cn http://www.google.com header
# 重写请求头的域名
-
^https?://www\.google\.cn https://www.google.com 302
# 直接返回一个 302 重定向的响应
-
^https?://ad\.example - reject
# 拒绝请求
# 使用 JavaScript 脚本改写 HTTP(S) 请求
script
:
-
match
:
https://weather-data.apple.com/v2/weather/[\w-]+/-?[0-9]+\.[0-9]+/-?[0-9]+\.[0-9]+\?
name
:
weather-us-aqi
# 引用 script-providers 中的脚本
type
:
response
# 脚本类型：request / response
require-body
:
true
# 如果需要 request / response body，请设置为 true
timeout
:
10
# 脚本超时时间（秒，可选）
argument
:
''
# 脚本参数（可选）
debug
:
false
# 开发模式，每次执行前会从 provider 加载最新脚本
binary-mode
:
false
# 以二进制模式获取 body
max-size
:
1048576
# 1MB
# 定时任务
cron
:
# 定时执行 JavaScript 脚本
script
:
-
name
:
weather-us-aqi
# 引用 script-providers 中的脚本
cron
:
'* * * * *'
# cron 表达式，可以在 https://crontab.guru/ 获取更多介绍
timeout
:
10
# 脚本超时时间（秒，可选）
argument
:
''
# 脚本参数（可选）
debug
:
false
# 开发模式，每次执行前会从 provider 加载最新脚本
script-providers
:
weather-us-aqi
:
url
:
https://example.org/stash/script.js
interval
:
86400
script
:
shortcuts
:
# 使用表达式编写自定义规则
quic
:
network == 'udp' and (dst_port == 443 or dst_port == 4483 or dst_port == 9305)
# 可以在规则中引用
# 支持通配符域名（例如: *.clash.dev, *.foo.*.example.com）
# 不使用通配符的域名优先级高于使用通配符的域名（例如: foo.example.com > *.example.com > .example.com）
# 注意: +.foo.com 的效果等同于 .foo.com 和 foo.com
hosts
:
'*.clash.dev'
:
127.0.0.1
'.dev'
:
127.0.0.1
'alpha.clash.dev'
:
'::1'
# DNS 服务器配置
dns
:
# 以下填写的 DNS 服务器将会被用来解析 DNS 服务的域名
# 仅填写 DNS 服务器的 IP 地址
default-nameserver
:
-
223.5.5.5
-
114.114.114.114
-
system
# 使用 iOS 系统 DNS
# 支持 UDP / TCP / DoT / DoH 协议的 DNS 服务，可以指明具体的连接端口号。
# 所有 DNS 请求将会直接发送到服务器，不经过任何代理。
# Stash 会使用最先获得的解析记录回复 DNS 请求
nameserver
:
# 不建议配置超过 2 个 DNS 服务器，会增加系统功耗
-
https://doh.pub/dns-query
-
https://dns.alidns.com/dns-query
-
quic://dns.adguard.com:853
-
doq://test.dns.nextdns.io:853
-
system
# 使用系统 DNS
# 跳过证书验证，解决部分兼容性问题 https://help.nextdns.io/t/g9hdkjz
skip-cert-verify
:
true
# 对部分域名使用单独的 DNS 服务器
nameserver-policy
:
'www.baidu.com'
:
114.114.114.114
'+.internal.crop.com'
:
system
# 在以下列表的域名将不会被解析为 fake ip，这些域名相关的解析请求将会返回它们真实的 IP 地址
fake-ip-filter
:
-
'+.stun.*.*'
-
'+.stun.*.*.*'
-
'+.stun.*.*.*.*'
-
'+.stun.*.*.*.*.*'
# Google Voices
-
'lens.l.google.com'
# Nintendo Switch
-
'*.n.n.srv.nintendo.net'
# PlayStation
-
'+.stun.playstation.net'
# XBox
-
'xbox.*.*.microsoft.com'
-
'*.*.xboxlive.com'
# Microsoft
-
'*.msftncsi.com'
-
'*.msftconnecttest.com'
proxies
:
# shadowsocks
# 支持加密方式：
#   aes-128-gcm aes-192-gcm aes-256-gcm
#   aes-128-cfb aes-192-cfb aes-256-cfb
#   aes-128-ctr aes-192-ctr aes-256-ctr
#   rc4-md5 chacha20 chacha20-ietf xchacha20
#   chacha20-ietf-poly1305 xchacha20-ietf-poly1305
-
name
:
'ss1'
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
benchmark-timeout
:
5
cipher
:
chacha20-ietf-poly1305
password
:
'password'
-
name
:
'ss2'
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
benchmark-timeout
:
5
cipher
:
AEAD_CHACHA20_POLY1305
password
:
'password'
plugin
:
obfs
plugin-opts
:
mode
:
tls
# 混淆模式，可以选择 http 或 tls
host
:
bing.com
# 混淆域名，需要和服务器配置保持一致
-
name
:
'ss3'
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
benchmark-timeout
:
5
cipher
:
AEAD_CHACHA20_POLY1305
password
:
'password'
plugin
:
v2ray-plugin
plugin-opts
:
mode
:
websocket
# 暂时不支持 QUIC 协议
tls
:
true
# wss
skip-cert-verify
:
true
host
:
bing.com
path
:
'/'
headers
:
custom
:
value
# vmess
# 支持加密方式：auto / aes-128-gcm / chacha20-poly1305 / none
-
name
:
'vmess'
type
:
vmess
server
:
server
port
:
443
benchmark-url
:
http://www.apple.com
benchmark-timeout
:
5
uuid
:
d0529668-8835-11ec-a8a3-0242ac120002
alterId
:
32
cipher
:
auto
tls
:
true
skip-cert-verify
:
true
servername
:
example.com
# 优先级高于 wss host
network
:
ws
ws-opts
:
path
:
/path
headers
:
Host
:
v2ray.com
max-early-data
:
2048
early-data-header-name
:
Sec-WebSocket-Protocol
# socks5
-
name
:
'socks'
type
:
socks5
server
:
server
port
:
443
benchmark-url
:
http://www.apple.com
benchmark-timeout
:
5
username
:
username
password
:
password
tls
:
true
skip-cert-verify
:
true
# http
-
name
:
'http'
type
:
http
server
:
server
port
:
443
benchmark-url
:
http://www.apple.com
benchmark-timeout
:
5
username
:
username
password
:
password
tls
:
true
# https
skip-cert-verify
:
true
# snell
-
name
:
'snell'
type
:
snell
server
:
server
port
:
44046
benchmark-url
:
http://www.apple.com
benchmark-timeout
:
5
psk
:
yourpsk
version
:
3
obfs-opts
:
mode
:
http
# 或 tls
host
:
bing.com
# Trojan
-
name
:
'trojan'
type
:
trojan
server
:
server
port
:
443
benchmark-url
:
http://www.apple.com
benchmark-timeout
:
5
password
:
yourpsk
sni
:
example.com
# Server Name Indication，如果为空会使用 server 中的值
alpn
:
-
h2
-
http/1.1
skip-cert-verify
:
true
# hysteria https://github.com/HyNetwork/hysteria/wiki/%E9%AB%98%E7%BA%A7%E7%94%A8%E6%B3%95
-
name
:
'hysteria'
type
:
hysteria
server
:
server
port
:
443
benchmark-url
:
http://www.apple.com
benchmark-timeout
:
5
up-speed
:
100
# 上传带宽（单位：Mbps）
down-speed
:
100
# 下载带宽（单位：Mbps）
auth-str
:
your-password
# auth: aHR0cHM6Ly9oeXN0ZXJpYS5uZXR3b3JrL2RvY3MvYWR2YW5jZWQtdXNhZ2Uv # bytes encoded in base64
protocol
:
''
# udp / wechat-video
obfs
:
''
# obfs password
sni
:
example.com
# Server Name Indication，如果为空会使用 server 中的值
alpn
:
-
hysteria
skip-cert-verify
:
true
# ShadowsocksR
# 支持的加密方式: SS 中支持的所有流加密方式
# 支持的混淆方式:
#   plain http_simple http_post
#   random_head tls1.2_ticket_auth tls1.2_ticket_fastauth
# 支持的协议:
#   origin auth_sha1_v4 auth_aes128_md5
#   auth_aes128_sha1 auth_chain_a auth_chain_b
-
name
:
'ssr'
type
:
ssr
server
:
server
port
:
443
benchmark-url
:
http://www.apple.com
benchmark-timeout
:
5
cipher
:
chacha20-ietf
password
:
'password'
obfs
:
tls1.2_ticket_auth
protocol
:
auth_sha1_v4
obfs-param
:
domain.tld
protocol-param
:
'#'
-
name
:
'vless'
type
:
vless
server
:
server
port
:
443
benchmark-url
:
http://www.apple.com
benchmark-timeout
:
5
uuid
:
d0529668-8835-11ec-a8a3-0242ac120002
flow
:
xtls-rprx-direct
skip-cert-verify
:
true
network
:
h2
tls
:
true
ws-opts
:
path
:
/path
headers
:
Host
:
v2ray.com
grpc-opts
:
grpc-service-name
:
'example'
h2-opts
:
host
:
-
http.example.com
-
http-alt.example.com
path
:
/
proxy-groups
:
# 代理的转发链, 在 proxies 中不应该包含 relay. 不支持 UDP.
# 流量: clash <-> http <-> vmess <-> ss1 <-> ss2 <-> 互联网
-
name
:
'relay'
type
:
relay
icon
:
https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Direct.png
proxies
:
-
http
-
vmess
-
ss1
-
ss2
# url-test 可以自动选择延迟最短的服务器
-
name
:
'auto'
type
:
url-test
proxies
:
-
ss1
-
ss2
-
vmess
interval
:
300
# fallback 可以尽量按照用户书写的服务器顺序，在确保服务器可用的情况下，自动选择服务器
-
name
:
'fallback-auto'
type
:
fallback
proxies
:
-
ss1
-
ss2
-
vmess
interval
:
300
# load-balance 可以使相同 eTLD 请求在同一条代理线路上
-
name
:
'load-balance'
type
:
load-balance
proxies
:
-
ss1
-
ss2
-
vmess
interval
:
300
# select 用于允许用户手动选择代理服务器或服务器组
# 您也可以使用 RESTful API 去切换服务器，这种方式推荐在 GUI 中使用
-
name
:
Proxy
type
:
select
proxies
:
-
ss1
-
ss2
-
vmess
-
auto
# 基于 SSID 的策略，方便在特殊网络环境下使用特定的代理
-
name
:
ssid-group
type
:
select
# 类型必须为 select，兼容原版 clash 配置
proxies
:
-
ss1
-
ss2
-
DIRECT
ssid-policy
:
# 在 SSID 为 office 的 Wi-Fi 中自动切换为 ss1 策略
# 在 SSID 为 home 的 Wi-Fi 中自动切换为 ss2 策略
# 在蜂窝数据中自动切换为 ss3 策略
# 其他的 SSID 默认为 DIRECT
office
:
ss1
home
:
ss2
cellular
:
ss3
default
:
DIRECT
-
name
:
UseProvider
type
:
select
use
:
-
provider1
proxies
:
-
Proxy
-
DIRECT
proxy-providers
:
provider1
:
url
:
https://example.org/stash/config.yaml
interval
:
3600
rule-providers
:
proxy-domain
:
behavior
:
domain
# 使用 domain 类规则集，可以使匹配更高效
url
:
https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt
interval
:
86400
proxy-domain-text
:
behavior
:
domain-text
# 推荐使用 text 格式，解析更高效
url
:
https://cdn.jsdelivr.net/gh/Loyalsoldier/surge-rules@release/proxy.txt
interval
:
86400
lan-cidr
:
behavior
:
ipcidr
url
:
https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt
interval
:
86400
ip-cidr-text
:
behavior
:
ipcidr-text
url
:
https://cdn.jsdelivr.net/gh/17mon/china_ip_list@master/china_ip_list.txt
interval
:
86400
apple-direct
:
behavior
:
classical
# 不推荐使用 classical 类规则集
url
:
https://cdn.jsdelivr.net/gh/Hackl0us/SS-Rule-Snippet@master/Rulesets/Clash/Basic/Apple-direct.yaml
interval
:
3600
rules
:
-
SCRIPT,quic,REJECT,no-track
-
RULE-SET,proxy-domain,Proxy
-
RULE-SET,apple-direct,DIRECT
-
RULE-SET,lan-cidr,DIRECT
-
RULE-SET,ip-cidr-text,DIRECT
-
GEOIP,CN,DIRECT
-
MATCH,Proxy

---

## Stash 覆写配置（Override） | Stash

**URL**: https://stashws.org/configuration/override.html

覆写文件（Override）
​
覆写文件（Override）允许用户修改配置文件的部分字段，常用于修改托管、订阅的配置内容。Stash 支持同时启用多个覆写文件，配置将按照从上到下的顺序依次覆盖。
最佳实践建议：为便于单独控制开关和分享，建议按功能点划分覆写文件。
语法参考
​
覆写文件使用 YAML 格式，文件后缀为
.stoverride
通常使用
name
和
desc
字段作为覆写文件的名称和描述，这两个字段仅用于展示
覆写文件对配置文件的修改遵循以下规则：
对于简单类型（string、number、boolean）的同名键，直接覆盖原值
对于字典类型的同名键，采用递归键值合并
对于数组类型的同名键，覆写文件的数组会插入到原数组前面
对于字典类型和数组类型的键，若添加注释
#!replace
，则采用完全覆盖方式合并
⚠️ 当前版本暂不支持修改数组中的特定元素，后续版本将提供相关语法支持。
常见覆写示例
​
yaml
name
:
'📺 BiliBili: 🔀 Redirect'
desc
:
|-
哔哩哔哩：重定向
中国站CDN自定义
openUrl
:
'http://boxjs.com/#/app/BiliBili.Redirect'
author
:
|-
VirgilClyne[https://github.com/VirgilClyne]
homepage
:
'https://Redirect.BiliUniverse.io'
icon
:
'https://github.com/BiliUniverse/Redirect/raw/main/src/assets/icon_rounded.png'
category
:
'🪐 BiliUniverse'
date
:
'2024-12-10 07:13:21'
version
:
'0.2.12'
http
:
force-http-engine
:
-
'*.bilivideo.cn:80'
-
'*.bilivideo.com:80'
-
upos-hz-mirrorakam.akamaized.net:80
-
'*:4480'
-
'*:8000'
-
'*:8082'
-
'*.mcdn.bilivideo.cn:9102'
mitm
:
-
'*.bilivideo.cn:443'
-
'*.bilivideo.com:443'
-
'*.mcdn.bilivideo.com:4483'
-
'*.mcdn.bilivideo.cn:4483'
-
'*.mcdn.bilivideo.cn:8082'
-
'*.mcdn.bilivideo.com:8082'
-
'upos-*-mirrorakam.akamaized.net:443'
script
:
-
match
:
^https?:\/\/.+\.bilivideo\.com\/upgcxcode\/
name
:
'📺 BiliBili.Redirect.request'
type
:
request
-
match
:
^https?:\/\/(.+):(8000|8082)\/v1\/resource\/
name
:
'📺 BiliBili.Redirect.request'
type
:
request
argument
:
-
match
:
^https?:\/\/[xy0-9]+\.mcdn\.bilivideo\.(cn|com):(4483|9102)\/upgcxcode\/
name
:
'📺 BiliBili.Redirect.request'
type
:
request
argument
:
-
match
:
^https?:\/\/(.+):4480\/upgcxcode\/
name
:
'📺 BiliBili.Redirect.request'
type
:
request
argument
:
-
match
:
^https?:\/\/upos-(hz|bstar1)-mirrorakam\.akamaized\.net/upgcxcode\/
name
:
'📺 BiliBili.Redirect.request'
type
:
request
argument
:
script-providers
:
'📺 BiliBili.Redirect.request'
:
url
:
https://github.com/BiliUniverse/Redirect/releases/download/v0.2.12/request.bundle.js
interval
:
86400
使用
#!replace
语法的覆写示例
​
yaml
name
:
仅使用 CloudFlare DNS
dns
:
# 将完全覆盖原有 default-nameserver
default-nameserver
:
#!replace
-
system
-
223.5.5.5
-
1.0.0.1
# 将完全覆盖原有 nameserver
nameserver
:
#!replace
-
https://1.0.0.1/dns-query
# CF IPv4
-
https://[2606:4700:4700::1111]/dns-query
# CF IPv6
合并示例
​
原始配置文件
config.yaml
：
yaml
dict
:
k1
:
true
k2
:
1
k3
:
-
1
-
2
-
3
k4
:
-
1
-
2
-
3
覆写文件：
yaml
key
:
value
dict
:
k3
:
-
0
k4
:
#!replace
-
1
k5
:
null
合并后结果：
yaml
key
:
value
dict
:
k1
:
true
k2
:
1
k3
:
-
0
-
1
-
2
-
3
k4
:
-
1
k5
:
null

---

## Stash 策略组图标 | Stash

**URL**: https://stashws.org/configuration/proxy-group-icon.html

策略组图标
​
为了区分不同的策略组，您可以为每个策略组指定一个图标。在配置文件的
proxy-groups
章节中，为策略组添加
icon
字段，并输入图片的 URL，支持 JPG 和 PNG 格式的图片。
yaml
-
name
:
'auto'
type
:
url-test
icon
:
https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Direct.png
proxies
:
-
ss1
-
ss2
-
vmess
interval
:
300

---

## Stash 与其他 VPN 冲突 | Stash

**URL**: https://stashws.org/faq/conflict-with-vpn.html

Stash 与其他 VPN 的冲突解决方法
​
为避免 Stash 与其他 VPN 之间发生冲突，您可以通过绑定网卡的方式进行设置。请
参考此处
。

---

## 编写高效 Stash 配置 | Stash

**URL**: https://stashws.org/faq/effective-stash.html

编写高效的配置文件
​
由于 iOS Network Extension 在 iOS 14 限制使用 15 MB 内存，在 iOS 15+ 限制使用 50 MB 内存，不合理的配置文件可能会导致 Stash 被 iOS 关闭。以下是一些建议，帮助您编写高效的配置文件。
配置合理的 DNS 服务器
​
Stash 会同时向所有配置的 DNS 服务器发起查询，并通过 LRU 算法缓存 DNS 查询结果。在移动设备上，建议配置 1 到 2 个 DNS 服务器即可满足需求。
使用 DoH、DoT、DoQ 协议比传统基于 UDP 的查询更消耗系统资源，且延迟通常更高
Stash 会使用 Fake IP 来避免需要代理的请求进行本地 DNS 查询。对于中国用户，建议使用国内 DNS 服务器，配置 8.8.8.8 / 1.1.1.1 等国外 DNS 服务不会带来实际收益
使用规则集合
​
对于去广告、按 IP 地理信息分流等需要大量规则的场景，建议使用
domain
或
ipcidr
类型的
规则集合
，这能有效降低内存占用并提高匹配速度。
注意
不建议使用大量
classical
类型的规则集合。此类规则只能进行顺序匹配，会显著增加匹配耗时和 Stash 的内存占用。
通过代理转发时禁用 QUIC 协议
​
HTTP3/QUIC 协议基于 UDP，在某些代理协议中 UDP 转发效率较低。您可以通过
Script Shortcuts
来禁用 QUIC 协议：
yaml
script
:
shortcuts
:
quic
:
network == 'udp' and dst_port == 443
rules
:
-
GEOIP,CN,DIRECT
-
SCRIPT,quic,REJECT
-
MATCH,PROXY

---

## Stash IPv6 兼容性 | Stash

**URL**: https://stashws.org/faq/ipv6-compatible.html

IPv6 兼容性
​
在绝大多数情况下，您无需手动启用 IPv6。Stash 会根据 iOS / macOS 系统返回的 IPv4 / IPv6 状态，自动选择最佳的连接策略。当 IPv4 / IPv6 都可用时，Stash 会同时向 IPv4 / IPv6 发起 TCP 握手，并选择第一个成功握手的连接进行后续数据传输。
在代理服务器支持 IPv6 的情况下，由于 Stash 使用 Fake IP 机制，通常会尽可能地向代理服务器转发域名而不是 IP 请求。此时 IPv4 / IPv6 的选择取决于代理服务器。
由于 Fake IP 机制的存在，Stash Tunnel 的大部分情况下会接受 Fake IP 的路由，并由 Stash 将 Fake IP 反查域名，
Stash Tunnel 默认仅启用 IPv4
。对于大多数 HTTP(S) 请求，即使直接输入 IPv6 地址，由于存在 HTTP 代理，请求并不会经过 Stash Tunnel。在上述两种机制下，Stash 默认支持：
通过域名访问仅支持 IPv6 的服务器
直接通过 IP 访问仅支持 IPv6 的网站
对于直接通过 IPv6 访问且经由 Stash Tunnel 的情况（如 SSH、FTP 等），需要开启「网络设置 - 启用 Tunnel IPv6 路由」。
请注意，在网络环境不支持 IPv6 的情况下开启该功能，可能会导致兼容性问题。

---

## 越狱 iOS 修改内存限制 | Stash

**URL**: https://stashws.org/faq/jailbreak-ios-memory-limit.html

越狱 iOS 系统内存限制修改
​
Jetsam 在 iOS 中负责监控内存并进行 OOM kill。在系统默认配置中，不同类型的进程有不同的内存限制。在 iOS 14 及之前的系统中，Network Extension 的内存限制为 15 MB；而在 iOS 15 及以后，Network Extension 的内存限制增加到了 50 MB。
对于越狱用户，可以修改这个值以允许 Network Extension 使用更多内存。这个配置文件存放在
/System/Library/LaunchDaemons/com.apple.jetsamproperties.{Model}.plist
。
打开任意一个文件后搜索
com.apple.networkextension.packet-tunnel
这个键即可找到 Network Extension 的限制。建议将其修改为 50 到 100 之间的任意数值。
ActiveHardMemoryLimit
和
InactiveHardMemoryLimit
都需要修改。
xml
<
key
>com.apple.networkextension.packet-tunnel</
key
>
<
dict
>
<
key
>ActiveHardMemoryLimit</
key
>
<
integer
>50</
integer
>
<
key
>InactiveHardMemoryLimit</
key
>
<
integer
>50</
integer
>
<
key
>JetsamPriority</
key
>
<
integer
>14</
integer
>
</
dict
>
注意事项
​
在操作前务必备份数据
不同手机的 Model 可能各不相同，也可能存在多个类似文件，如果不确定本机匹配的 Model，可以尝试修改所有相关文件
修改后，需重启 iOS 系统才能生效
您可以在
github.com/eycorsican/jetsamproperties
项目中获取更多信息。

---

## Stash 授权与激活 | Stash

**URL**: https://stashws.org/faq/license-activation.html

授权与激活
​
为了防止商业化的账号共享等盗版行为，目前 Stash 对每个购买凭证 (License) 有设备使用数量限制。
安全提示
为保障您的账户信息安全，设备列表和反激活按钮仅限在已激活的设备上显示。
Stash on iOS
​
在 iOS App Store 销售的每个 Stash 授权限制最多可在 6 台设备上同时使用，包括 iOS、iPadOS、macOS (Apple silicon)。你可以在「工具 - 系统信息」(Stash V2) 或「设置 - 诊断」(Stash V1) 查看已激活设备，并反激活不再使用的设备。
不能通过 TestFlight 激活 Stash ？
​
由于 AppStore Receipt 购买凭证仅存于通过商店下载的 Stash 。如您在使用 TestFlight 过程中被其他设备反激活或者因长时间无法连接激活服务器，可能会出现此提示。
解决方案
： 您可以重新通过 AppStore 下载正式版的 Stash 覆盖安装，即可激活。激活成功后，如有需要可升级到 TestFlight 版本继续使用。
Stash on macOS
​
个人版 (Personal)
：最多可在 3 台设备上同时使用
家庭版和终身版 (Family & LifeTime)
：最多可在 6 台设备上同时使用
你可以在「控制面板 - 设置 - 授权」查看已激活设备，并反激活不再使用的设备。
Stash 已损坏？
​
部分杀毒软件或清理软件可能会导致 Stash 无法正常运行或激活，请确保没有使用这一类软件阻止或清理 Stash Mac 。如 Stash 被清理，可能会出现此提示。
解决方案
： 您可以
点击此处
重新下载 Stash Mac 覆盖安装以修复此问题。
重置激活数量
​
如果您遇到「激活服务器拒绝，已达到最大的设备数量」且确认激活设备数量没有超过限制，请发送电子邮件到
[email protected]
说明情况，我们会第一时间处理。

---

## 防止代理被检测 | Stash

**URL**: https://stashws.org/faq/proxy-detected.html

防止代理被检测
​
部分应用程序可能会检测系统是否使用代理软件，从而禁止用户在代理环境下使用。Stash 提供了「仅使用 Tunnel 代理」模式来防止应用程序检测代理程序，该选项将禁用 Stash Proxy，使得所有 HTTP(S) 请求亦会交由 Stash Tunnel 进行处理，以改善和某些应用的兼容性问题。
启用步骤
​
在 Stash 的设置页面，选择「网络设置」
打开「仅使用 Tunnel 代理」
注意事项
开启这个选项会使得 Stash HTTP Engine 失效，导致 HTTP 改写功能失效。避免该问题，请参考
Force HTTP Engine
。

---

## 无法安装 Stash Mac 帮助程序 | Stash

**URL**: https://stashws.org/faq/stash-mac-helper.html

无法安装 Stash Mac 帮助程序 (Helper)
​
部分用户可能会遇到反复提示需要安装帮助程序 (Helper) 的情况。Stash 需要使用管理员权限安装一个帮助程序，否则 Stash 将无法设置系统代理。
杀毒软件影响
部分杀毒软件或清理软件可能会导致 Stash Helper 无法正常运行，请确保没有使用这一类软件阻止或清理 Stash Mac。
macOS 13 Ventura
​
在 macOS 13 苹果引入了新的后台权限管理，如错误配置此项会引起 Stash Helper 无法正常运行。
在 Mac 的「系统设置」 - 「通用」 - 「登陆项」 - 「允许在后台」，请确保
Stash
或
Stash Networks Limited
等开关为启用状态
修复步骤
​
如执行上述操作后依然无法安装 Stash Helper，请尝试参照以下步骤修复：
打开终端 (Terminal)
运行以下命令移除 Helper（需输入系统密码并按回车键）
sh
sudo
rm
-rf
/Library/PrivilegedHelperTools/ws.stash.app.mac.daemon.helper
运行以下命令启用 Helper（需输入系统密码并按回车键）
sh
sudo
/bin/launchctl
load
-w
/Library/LaunchDaemons/ws.stash.app.mac.daemon.helper.plist
如提示
service already loaded
或
Operation already in progress
，无需理会。
重启电脑
打开 Stash，重新安装帮助程序（需输入系统密码）
至此，您的 Stash Helper 已修复。如果仍然不能正常工作，请与
[email protected]
联系。

---

## Stash TestFlight 相关问题 | Stash

**URL**: https://stashws.org/faq/testflight.html

TestFlight 相关问题
​
Stash 通过在 TestFlight 分发 Beta 版本进行灰度测试。所有购买用户均可申请参与 TestFlight 测试。在
App Store 安装的 Stash
内，您可以在「设置 - 更多设置」中输入邮箱，即可收到 TestFlight 发出的邀请。
重要提示
在安装 TestFlight 版本之前，请到「工具 - 系统信息」(Stash V2) 或「设置 - 诊断」(Stash V1) 确认当前设备授权的有效状态。由于 Apple 沙盒的限制，目前无法在 TestFlight 版本进行设备激活。
参与条件与限制
​
名额限制
：由于 Apple 的限制，TestFlight 最多允许 10000 个账号参与。Stash Network Ltd. 保留移除不活跃账号的权利
账号要求
：申请 TestFlight 的 Apple ID 可以与购买账号不同，但每个购买账号在同一时间只能拥有一个 TestFlight 名额。重复申请时，旧名额会被移除
区域限制
：由于 Stash 并没有在中国区上架，请不要使用中国区的 Apple ID 申请 TestFlight。使用中国区的 Apple ID 可能会遇到「所请求的 App 不可用或不存在」的问题
版本性质
：TestFlight 属于 Beta（测试）版本性质。在体验新功能的同时可能会存在 Bug 或者不稳定情况。请根据自己的实际情况切换至 App Store 商店版或 TestFlight 测试版

---

## Stash URL Schema | Stash

**URL**: https://stashws.org/faq/url-schema.html

URL Schema
​
Stash 支持使用 URL Schema
stash://
和
clash://
来控制 Stash，包含的 URL
需要 Encode
。
link.stash.ws
​
除了上述的 URL Schema 之外，Stash 还支持使用
https://link.stash.ws
标准 URL 来控制，格式为
https://link.stash.ws/command/url
，包含的 URL
不含 Schema 且无需 Encode
。
以一键安装 BoxJS 为例，
原 URL：
https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.stash.stoverride
一键安装 URL：
https://link.stash.ws/install-override/raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.stash.stoverride
URL 协议
默认的远程 URL Schema 为 HTTPS，如需使用 HTTP，请加上参数
?scheme=http
。
访问失败
如远程 URL 无法访问，链接将返回
404
。
导入配置文件
​
stash://install-config?url=${url-encoded}
clash://install-config?url=${url-encoded}
https://link.stash.ws/install-config/example.com/stash.yaml
导入远程覆写
​
stash://install-override?url=${url-encoded}
clash://install-override?url=${url-encoded}
https://link.stash.ws/install-override/example.com/stash.stoverride
导入图标集
​
stash://install-icon-set?url=${url-encoded}
clash://install-icon-set?url=${url-encoded}
https://link.stash.ws/install-icon-set/example.com/stash.json
开关 Stash
​
开启 Stash
​
stash://start
clash://start
https://link.stash.ws/start
关闭 Stash
​
stash://stop
clash://stop
https://link.stash.ws/stop
切换开关
​
stash://toggle
clash://toggle
https://link.stash.ws/toggle

---

## Stash 内置 DNS 服务配置指南 | Stash

**URL**: https://stashws.org/features/dns-server.html

内置 DNS 服务
​
自定义上游 DNS 服务器
​
Stash 支持同时配置多个 DNS 服务器。在进行查询时，Stash 会并发请求所有服务器，并采用最快响应的结果。Stash 支持以下 DNS 协议：
使用系统提供的 DNS：
system
DNS over UDP：
8.8.8.8
或
udp://8.8.8.8
DNS over TCP：
tcp://8.8.8.8
DNS over TLS
：
tls://8.8.8.8:853
或
dot://8.8.8.8:853
DNS over HTTPS
：
https://1.1.1.1/dns-query
或
doh://1.1.1.1/dns-query
DNS over HTTP/3：
http3://1.1.1.1/dns-query
或
doh3://1.1.1.1/dns-query
DNS over QUIC
：
quic://dns.adguard.com:853
或
doq://dns.adguard.com:853
default-nameserver
将用于解析 DNS 服务的域名，仅支持填写 DNS 服务器的 IP 地址。
yaml
dns
:
# 以下填写的 DNS 服务器将用于解析 DNS 服务的域名
# 仅填写 DNS 服务器的 IP 地址
default-nameserver
:
-
223.5.5.5
-
114.114.114.114
# 支持 UDP / TCP / DoT / DoH / DoQ 协议的 DNS 服务，可以指明具体的连接端口号。
# 所有 DNS 请求将直接发送到服务器，不经过任何代理。
# Stash 会使用最先获得的解析记录回复 DNS 请求
nameserver
:
# 不建议配置超过 2 个 DNS 服务器，会增加系统功耗
-
https://doh.pub/dns-query
-
https://dns.alidns.com/dns-query
-
quic://dns.adguard.com:853
-
doq://test.dns.nextdns.io:853
-
system
# 使用 iOS 系统 DNS
# 跳过证书验证，解决部分兼容性问题 https://help.nextdns.io/t/g9hdkjz
skip-cert-verify
:
true
# DNS 查询跟随代理规则
follow-rule
:
false
Stash 会对 DNS 查询使用 LRU 算法进行本地缓存。当本地缓存过期时，Stash 会继续沿用缓存结果，并在后台静默更新记录，这会有效降低 DNS 缓存过期引发的请求延迟。
基于域名的自定义 DNS 服务
​
nameserver-policy
可以对指定域名使用特定的 DNS 服务器。
yaml
dns
:
# 对部分域名使用单独的 DNS 服务器
nameserver-policy
:
'www.baidu.com'
:
114.114.114.114
'+.internal.crop.com'
:
system
自定义 Hosts
​
yaml
# 支持通配符域名 (例如: *.clash.dev, *.foo.*.example.com )
# 不使用通配符的域名优先级高于使用通配符的域名 (例如: foo.example.com > *.example.com > .example.com )
# 注意: +.foo.com 的效果等同于 .foo.com 和 foo.com
hosts
:
'*.clash.dev'
:
127.0.0.1
'.dev'
:
127.0.0.1
'alpha.clash.dev'
:
'::1'
DNS 查询跟随规则
​
默认情况下，Stash 发出的 DNS 查询均会直接出站，而不经由任何代理规则转发。开启
follow-rule
选项后，Stash 会根据代理规则进行 DNS 查询的转发。
⚠️ 绝大部分场景下，不需要开启此配置。DNS 查询由代理转发后，可能会破坏云服务商的 CDN 全球优化策略，导致静态资源加载缓慢。DNS 查询请求进入 Stash 网络引擎，也会导致轻微的延迟上升。
请仅在必要时开启此配置。
⚠️ 由于连接代理服务器可能需要进行 DNS 解析，DNS 查询由代理转发后，会存在递归查询的问题。开启此配置前请确保满足以下其中一项条件：
转发 DNS 请求的代理地址为 IP 地址，而不是域名
DNS 服务器地址为 IP 地址，而不是域名

---

## Stash 主机名映射配置指南 | Stash

**URL**: https://stashws.org/features/hosts.html

主机名映射
​
Stash 内置了主机名映射功能，允许用户将域名解析到指定的 IP 地址，或者是将 A 域名的解析映射为 B 域名的解析。
yaml
hosts
:
+.stash.dev
:
127.0.0.1
one.one.one.one
: [
1.0.0.1
,
1.1.1.1
]
manual.stash.ws
:
stash.wiki
proxy-hosts
:
api.twitter.com
:
2606:4700:4700::1001
主机名映射支持使用通配符域名，例如
+.stash.dev
等价于
*.stash.dev
与
stash.dev
，不使用通配符的域名优先级高于使用通配符的域名。
一个域名可以映射到多个 IP 地址，在实际使用中，Stash 会随机选择一个 IP 地址进行连接。
域名解析也可以指向另一个域名，效果等同于使用 CNAME 记录。Stash 会在解析时自动将其转换为 IP 地址。
hosts
在本地 DNS 解析，DIRECT 策略中生效；
proxy-hosts
仅在向代理服务器转发时生效。

---

## Stash 网络性能增强 | Stash

**URL**: https://stashws.org/features/network-performance-enhance.html

网络性能增强
​
Stash 在网络连接的每一层面进行了深度性能优化，致力于为用户提供低延迟、高吞吐的优质访问体验。
功能启用
部分增强功能需要在「网络设置」中手动启用，以获得最佳性能表现。
并发 DNS 查询
​
Stash 支持配置多个 DNS 服务器。在进行域名解析时，Stash 会
并发请求所有配置的 DNS 服务器
，并采用最快响应的结果，有效减少 DNS 查询延迟。
乐观 DNS 缓存（Optimistic DNS）
​
Stash 使用
LRU 算法
对 DNS 查询结果进行本地缓存。当缓存记录过期时：
继续使用缓存结果
：避免等待 DNS 查询
后台静默更新
：异步更新缓存记录
降低请求延迟
：有效应对 DNS 缓存过期问题
并发连接
​
当域名拥有多个 A / AAAA 记录时，Stash 会
并发向所有 IP 地址发起 TCP 连接
，并选择最快握手成功的结果。
优势
：
避免单节点失效
：提高连接成功率
优化 CDN 访问
：自动选择最优节点
提升响应速度
：减少连接建立时间
混合使用多个网络
​
在 Wi-Fi / 蜂窝网络（Cellular）/ 有线网络同时可用的情况下，Stash 会尝试
同时使用多个网络建立连接
，并选择最快握手成功的结果。
技术特点
：
与并发连接协同工作
：双重优化机制
弱网环境优化
：降低连接超时概率
网络切换平滑
：保持连接稳定性

---

## Stash 按需启动 | Stash

**URL**: https://stashws.org/features/on-demand.html

按需启动
​
保持 Stash 开启
​
启用此选项后，Stash 将保持持续运行状态，您只能通过 Stash App 内的停止按钮来关闭 Stash。
自动恢复
即使在系统重新启动后，Stash 也能自动开启，确保持续的代理服务。
按需连接
​
通过配置按需连接，您可以根据不同的网络环境智能控制 Stash 的启用状态。
使用场景
​
禁用蜂窝数据网络代理
：
关闭蜂窝数据按钮后
Stash 将不会在蜂窝数据网络下启用
排除特定 Wi-Fi 网络
：
在包含透明代理的路由器网络中
防止流量被重复代理
将 Wi-Fi 的 SSID 填入排除 SSIDs 列表
Stash 将不会在该 SSID 的网络下启用
配置方法
​
进入按需连接设置
根据需要关闭蜂窝数据选项
在排除 SSIDs 列表中添加不需要代理的 Wi-Fi 网络名称

---

## Stash 为局域网设备提供代理 | Stash

**URL**: https://stashws.org/features/provide-proxy-to-lan-device.html

为局域网设备提供代理
​
Stash iOS、Stash tvOS 与 Stash Mac 均支持为局域网设备提供代理服务，让您的网络设备轻松享受代理服务。
支持的功能概览
​
Stash iOS
：支持提供 HTTP 代理和 SOCKS 代理
Stash tvOS 和 Stash Mac
：支持提供 HTTP 代理、SOCKS 代理和透明代理（网关模式）
网关模式
网关模式可以为局域网内设备提供透明代理，也常称为
旁路由
或
增强模式
，无需在每个设备上单独配置代理。
HTTP 代理与 SOCKS 代理
​
Stash iOS 与 Stash Mac 默认在
7890 端口
提供 HTTP 代理与 SOCKS 代理服务。开启「允许局域网连接」后，局域网内的其他设备即可通过该端口访问 Stash 提供的代理服务。
配置示例
​
假设局域网内 IP 地址为
192.168.1.10
的设备运行着 Stash，可通过以下命令为 shell 配置代理：
bash
export
https_proxy
=
http://192.168.1.10:7890
export
http_proxy
=
http://192.168.1.10:7890
export
all_proxy
=
socks5h://192.168.1.10:7890
通过个人热点提供代理
​
在 iPhone/iPad 等设备开启个人热点后，运行 Stash 可为连接至个人热点的其他设备提供 HTTP 代理或 SOCKS 代理服务。
注意
：此功能同样需要开启「允许局域网连接」选项。
Stash tvOS & Stash Mac 网关模式
​
设备要求
​
Stash tvOS
：仅支持在
支持 Thread 的 Apple TV
上启用透明代理
Stash Mac
：启用透明代理需要开启「增强模式」
网关模式配置
​
假设局域网内 IP 地址为
192.168.1.10
的设备运行着 Stash，为其他局域网设备提供代理需进行如下设置：
将局域网内设备的
网关
配置为
192.168.1.10
DNS
设置为
198.18.0.2
保持
IP 地址
和
子网掩码
不变
功能特性
​
启用网关模式的 Stash 可代理：
TCP 流量
UDP 流量
简单响应
ICMP 的 Echo Reply
故障排除
若 Apple TV 休眠一段时间后旁路由无响应，请根据 Apple 官方指引排查 Apple TV 是否已设置为
家居中枢
。

---

## 服务提供商订阅 - Stash 配置指南 | Stash

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

---

## 机场推荐 | Stash

**URL**: https://stashws.org/feed.html

机场推荐
​
由网友收集和整理了值得推荐的机场，我们从中选择出一些靠谱机场推荐给大家。
推荐机场的标准
​
中国大陆可以访问
订阅套餐价格合理
按量、月、年等周期流量
节点相对满足需求
能解锁绝大部分网站、视频、流媒体等网络
靠谱机场
​
机场顺序部分排名不分先后，比如一元机场由于一些原因并没有在下面列表中，但不代表其人气或性价比就不靠谱。推荐使用
Clash Verge Rev
工具进行订阅。

---

## 快速上手 | Stash

**URL**: https://stashws.org/get-started.html

快速上手
​
要在你的 iOS 设备上启用 Stash，只需导入一份 Stash/Clash 格式的配置文件。Stash 需要配置文件来指定代理服务器和分流策略。你可以通过服务提供商的订阅 URL 下载配置，或导入存放在 iCloud/OneDrive 的本地文件使用。
导入远程配置
​
如果你的服务提供商提供了 Stash / Clash Premium / Clash 的订阅链接，导入远程配置是最快捷的方式：
打开
设置 → 配置文件
；
在配置列表中选择
从 URL 下载
；
在输入框粘贴订阅地址并点击
下载
；
选中你要使用的配置文件；
返回主页并点击
启动
。
现在，
Stash
已准备就绪，尽情使用吧！😉
使用本地配置
​
使用本地配置可以更灵活地自定义分流策略，并使用 Stash 的可视化编辑器进行细粒度调整：
通过 AirDrop、或在 iCloud/OneDrive 中打开配置文件，并选择用
Stash
打开；
在配置列表中选中目标配置文件；
返回主页并点击
启动
。
同样，配置完成后即可立即使用 Stash。😉

---

## Stash 强制 HTTP 引擎配置 | Stash

**URL**: https://stashws.org/http-engine/force-http-engine.html

Force HTTP Engine
​
默认地，所有经由 HTTP Proxy 的请求会由 HTTP 引擎处理，以使用改写、脚本等功能。若希望来自 Tunnel 的 TCP 连接经由 HTTP 引擎处理，需要配置
force-http-engine
。
yaml
http
:
# 强制使用 Stash 引擎以 HTTP 协议处理 TCP 连接
# 捕获后的连接可以使用高级功能，例如重写和脚本
force-http-engine
:
-
'*:80'
-
'*:4480'
# BiliBili CDN
-
'*:9102'
# BiliBili CDN
⚠️ 无法解析的请求会被 HTTP 引擎以 Bad Request 响应拒绝。

---

## Stash HTTP Engine 简介 | Stash

**URL**: https://stashws.org/http-engine/intro.html

Stash HTTP Engine
​
Stash 内置高效的 HTTP 引擎，允许用户对系统中的 HTTP 请求进行改写、拦截、抓取、重放，以及对 HTTPS 请求通过 MitM 方式进行解密。
入站逻辑
​
系统中并非所有连接都是 HTTP 请求，Stash 会按照以下策略控制连接是否进入 HTTP 引擎。
在「仅使用 Tunnel 代理」关闭的情况下，Stash 会向系统声明 HTTP Proxy。进入 HTTP Proxy 的 HTTP 请求会流入 HTTP 引擎处理。
对于从 Tunnel 进入，且命中
force-http-engine
列表的 TCP 连接，也会流入 HTTP 引擎处理。
对于命中 MitM 列表的 HTTPS 请求，也会流入 HTTP 引擎处理，并且 Stash 会根据 SNI 使用配置的根证书生成临时证书，完成 TLS 握手。
其他未命中请求会以 TCP 流转发，不进入 HTTP 引擎。
暂时不支持处理 HTTP/3 的请求，Stash 会当作普通 UDP 包转发，此时整体吞吐量一般不如基于 TCP 的 HTTP/1 与 HTTP/2 协议。
在遇到 HTTP 改写、脚本不生效时，可以核对上述规则排查。
协商与连接管理
​
Stash HTTP Engine 完整支持解析 HTTP/1.x 与 HTTP/2 协议。
对于 HTTP 请求，Stash HTTP Engine 仅支持 HTTP/1.x 协议，不支持 HTTP/2 Cleartext。
对于 HTTPS 请求且开启了 MitM，Stash 会尝试与 App 协商升级到 HTTP/2，也会与 Web Server 协商升级到 HTTP/2，L、R 两侧连接是
各自独立无影响
的。
Stash HTTP Engine 对于 L、R 两侧连接实行
分别管理
，对于 R 侧连接，Stash 会最大限度地复用 TCP 连接，以减少 TCP / TLS 握手的消耗。
实践与表现
​
在实践中，存在：
部分 App 不进行 HTTP/2 协商，但 Web Server 支持 HTTP/2 的情况。在 Stash HTTP Engine 通过 MitM 接管后， L 侧会使用 HTTP/1.1 协议，但 R 侧会协商至 HTTP/2。
部分 App 即使在 Web Server 支持 HTTP/2 的情况下，仍为每个 HTTPS 请求创建一个 TLS 连接的情况。在 Stash HTTP Engine 通过 MitM 接管后，实际只会创建单条 TCP 连接到 Web Server。
💡 在使用中遇到任何兼容性问题，请与我们联系。

---

## Stash MitM 配置指南 | Stash

**URL**: https://stashws.org/http-engine/mitm.html

MitM
​
如果想对 HTTPS 请求进行查看、改写、执行脚本，必须启用 MitM 功能。在启用 MitM 功能前，你的设备需要信任自行签发的 CA 证书，该 CA 证书可以由用户导入 Stash，或由 Stash 生成。
⚠️ 基于数据安全以及私隐的考虑，任何时候你不应该与他人共享证书，或使用互联网上提供的 CA 证书。
使用配置文件配置 MitM
​
配置 CA 证书
​
yaml
http
:
# 以 PKCS #12 编码的 CA 证书
ca
:
''
# 证书密码
ca-passphrase
:
''
# 开启 MitM 功能的域名列表，需要确保上述 CA 证书已受系统信任
配置 MitM 列表
​
yaml
http
:
# 开启 MitM 功能的域名列表，需要确保上述 CA 证书已受系统信任
mitm
:
-
g.cn
-
'*.google.cn'
-
weather-data.apple.com
# 默认只对 443 端口开启
-
weather-data.apple.com:*
# 使用通配符对所有端口开启
-
'*.weather-data.apple.com'
# 域名中也可以使用通配符
至此，MitM 配置完毕。
使用图形界面配置 MitM
​
如果无法在配置文件中添加 CA 证书，可以使用 Stash 的图形界面生成 CA 证书。
配置 CA 证书
​
1、在 Stash 首页，找到
MitM
，选择
[CA 证书]
；
2、点击
[Stash Generated CA]
生成新的证书；
3、点击
[安装 证书]
安装新证书；
4、 Stash 会自动跳转到
Safari
进行证书安装，点击
[允许]
安装新的证书；
5、出现 [已下载描述文件] ，则代表证书已成功安装；
配置 MitM 列表
​
1、在 Stash 首页，找到
MitM
，选择
[主机名]
；
2、输入您想添加的域名，如
*.google.cn
，域名中可以使用通配符，点击旁边的
[+ 号]，添加到 MitM 列表里；
系统信任证书
​

---

## Stash HTTP 重写功能详解 | Stash

**URL**: https://stashws.org/http-engine/rewrite.html

HTTP 重写
​
HTTP 重写允许用户通过正则表达式匹配 URL，拒绝或者重定向 HTTP(S) 请求，常用于去广告，避免隐私跟踪等目的。
配置格式：
yaml
http
:
# HTTP(S) 重写，支持header、302、307、reject多种策略
url-rewrite
:
-
^http://g\.cn https://www.google.com transparent
-
^https?://www\.google\.cn https://www.google.com 302
# 直接返回一个 302 重定向的响应
-
^https?://ad\.example - reject
# 拒绝请求
header-rewrite
:
-
^http://g\.cn request-add DNT 1
-
^http://g\.cn request-del DNT
-
^http://g\.cn request-replace DNT 1
-
^http://g\.cn request-replace-regex User-Agent Go-http-client curl
-
^http://g\.cn response-add DNT 1
-
^http://g\.cn response-del DNT
-
^http://g\.cn response-replace DNT 1
-
^http://g\.cn response-replace-regex User-Agent Go-http-client curl
mock
:
-
match
:
^https?://ad\.example
status-code
:
503
URL 重写
​
transparent
​
拦截并修改请求的 URL，效果类似透明代理，应用对此无感知，支持重定向 HTTP / HTTPS。
302
/
307
​
HTTP 引擎会返回一个 3xx 状态码，并且会自动设置 Location 字段，以达到重定向的目的。
reject
​
返回 404 响应，和空的响应 body。
reject-200
​
返回 200 响应，和空的响应 body。
reject-img
​
返回 200 响应，和 1px gif 的响应 body。
reject-dict
​
返回 200 响应，和内容为
{}
的响应 body。
reject-array
​
返回 200 响应，和内容为
[]
的响应 body。
HTTP header 重写
​
header 重写允许用户增加、删除、替换 HTTP 请求 / 响应的任意 header。
request-add
/
response-add
​
对 HTTP 请求 / 响应新增 header。
request-del
/
response-del
​
对 HTTP 请求 / 响应删除 header。
request-replace
/
response-replace
​
对 HTTP 请求 / 响应替换 header 的值。
request-replace-regex
/
response-replace-regex
​
对 HTTP 请求 / 响应通过正则表达式替换 header 的值。
Mock
​
Mock 功能直接返回静态响应。如果想动态返回响应，请尝试使用 JavaScript 引擎重写。
yaml
http
:
mock
:
-
match
:
^https?://example.stash\.ws/json
text
:
'{}'
status-code
:
200
headers
:
Content-Type
:
application/json
-
match
:
^https?://example.stash\.ws/base64
base64
:
'CgVUZXJyeRAeGHRlcnJ5QGV4YW1wbGUuY29t'
status-code
:
200
headers
:
Content-Type
:
application/x-protobuf
match
: 匹配的正则表达式。
status-code
: 返回的 HTTP 状态码，不填默认为 200。
headers
: 返回的 HTTP 响应头，不需要额外设置
Content-Length
，引擎会自动计算。
响应内容：
text
: 返回的文本内容，以 UTF-8 编码。
base64
: 返回的内容为二进制，以 Base64 编码。
使用 JavaScript 引擎重写
​
如果上述功能无法满足需求，请参考
使用 JavaScript 引擎重写 HTTP
。

---

## Stash 简介，Stash 下载，欢迎使用 Stash App | Stash

**URL**: https://stashws.org/intro.html

Stash 简介
​
欢迎使用 Stash App 👋
Stash
是 Clash Premium 内核在 Apple 设备上的最佳实现客户端，为 iOS、tvOS、macOS 与 visionOS 平台提供完整功能，并在此基础上提供额外特性：
核心特性
​
配置同步
：通过 iCloud 同步配置、规则和订阅，实现一次配置，多设备共享。
远程控制
：设备信息安全存储于 iCloud，同一账号设备可直接远程控制局域网内的 Stash，无需手动管理地址和密码。
快捷操作
：支持小组件、Today 视图、Widget 与 Siri 快捷指令，一键启动、停止或切换节点。
按需连接
：基于 Apple VPN On Demand，根据 Wi-Fi、域名或应用自动连接或断开 Stash。
增强网络引擎
：支持 MitM 功能，查看 HTTPS 流量，并通过 Apple WebKit 提供 JavaScript 改写能力。
深度优化与丰富协议
：支持 Hysteria、VLESS、TUIC、WireGuard 等多种代理协议，优化内核和运行时，降低内存、电量与网络消耗。
社交媒体
​
欢迎订阅
Telegram 频道
或关注
X (Twitter)
获取最新消息。
加入
Telegram 讨论组
，与数万名
Stash
用户在线交流。
咨询合作
​
如有咨询或合作事宜，请发送邮件至
[email protected]
。
Stash 下载
​
Stash on iOS
​
Stash 已上架 iOS App Store：
Stash on tvOS
​
Stash 已上架 tvOS App Store：
Stash on macOS
​
Stash Mac 版本专为 macOS 设计，了解更多详情请
点击这里
。
查看价格信息请访问
Stash Mac 定价
。

---

## Stash 延迟测试配置指南 | Stash

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

---

## Stash 策略组使用指南 | Stash

**URL**: https://stashws.org/proxy-protocols/proxy-groups.html

策略组
​
策略组（
proxy-groups
）是一系列代理（或策略组）的组合。策略组可以像单个代理一样被分流规则引用，并可以指定特殊的策略提高可用性。
基本概念
​
分流规则可以直接引用代理或策略组，但不能引用远程代理集
策略组可以包含多个代理，或者多个远程代理集
策略组可以包含另一个策略组
不包含任何代理的策略组，会被当作为
DIRECT
策略处理
支持
filter
字段，通过正则表达式过滤节点
可以通过
include-all: true
引用所有的代理和远程代理集
策略类型
​
排序方式
策略组内代理的排序方式默认为配置文件顺序，可以在「网络设置」页面改为按延迟测试结果排序。
url-test
​
url-test
可以定时对包含的代理执行连通性检查，自动选择延迟最短的服务器，不健康的代理会被跳过。
yaml
-
name
:
auto
type
:
url-test
proxies
:
-
ss1
-
ss2
-
vmess
interval
:
300
fallback
​
fallback
可以尽量按照用户书写的服务器顺序，在确保服务器可用的情况下，由上至下自动选择服务器，不健康的代理会被跳过。
yaml
-
name
:
fallback-auto
type
:
fallback
proxies
:
-
ss1
-
ss2
-
vmess
load-balance
​
load-balance
能充分利用多个代理的带宽，不健康的代理会被跳过。
yaml
-
name
:
load-balance
type
:
load-balance
strategy
:
# consistent-hashing / round-robin
proxies
:
-
ss1
-
ss2
-
vmess
一般建议将
strategy
设置为
consistent-hashing
，避免频繁改变 IP 触发服务端的安全策略。
select
​
select
用来允许用户手动选择。
yaml
-
name
:
select
type
:
select
proxies
:
-
ss1
-
ss2
-
vmess
-
auto
relay
​
代理的转发链，流量将通过一系列的代理转发到达目的地，仅支持转发 TCP 或使用 UDP over TCP 的协议。
relay
策略组并不受到内部代理延迟测试的结果影响，需要单独指定测试 URL。
yaml
-
name
:
relay
type
:
relay
benchmark-url
:
http://www.apple.com
# 建议只使用HTTP协议
benchmark-timeout
:
5
# 延迟测试超时，单位：秒
# 流量: stash <-> http <-> vmess <-> ss1 <-> ss2 <-> 互联网
proxies
:
-
http
-
vmess
-
ss1
-
ss2
延迟测试配置
如果
relay
策略组内的代理无法直接被访问，可以对这些代理配置
benchmark-disabled: true
禁用 Stash 对它发起单独的延迟测试。
额外功能
​
定时执行延迟测试
​
Stash 默认会每 600 秒为策略组内包含的代理进行延迟测试，如果策略组包含另外一个策略组，则会递归进行测试。
定时执行延迟测试支持修改下述配置：
interval
：单位秒，按一定间隔执行延迟测试，默认为 600 秒，设置为负数则不进行延迟测试。
lazy
：懒惰模式，如果设置为
true
，且策略组在过去一段时间没有被使用，Stash 会跳过自动延迟测试以节省资源。
yaml
proxy-groups
:
-
name
:
my-proxy-group
type
:
select
# ...
interval
:
300
# 每 300s 检查一次
lazy
:
true
# 在策略组没有被使用时候，不进行延迟测试
基于网络状态自动切换策略
​
select
类型的策略组可以根据设备的 SSID / 蜂窝数据自动切换策略。
default
和
cellular
是两个可选的保留策略：
当在 Wi-Fi 环境下，没有匹配到任何 SSID 时，会自动切换到
default
对应的代理；
在蜂窝数据下，会自动切换到
cellular
对应的代理；
当没有
default
或
cellular
时候，不会触发任何操作。
yaml
-
name
:
ssid-group
type
:
select
# 类型必须为 select，兼容原版 clash 配置
proxies
:
-
ss1
-
ss2
-
ss3
-
DIRECT
ssid-policy
:
# 在 SSID 为 office 的 Wi-Fi 中自动切换为 ss1 策略
# 在 SSID 为 home 的 Wi-Fi 中自动切换为 ss2 策略
# 在蜂窝数据中自动切换为 ss3 策略
# 其他的 SSID 默认为 DIRECT
office
:
ss1
home
:
ss2
cellular
:
ss3
default
:
DIRECT
灵活地组合代理
​
Stash 支持各种方式将多个代理组合成一个策略组。
可以通过
include-all: true
引用所有的代理和远程代理集
不包含任何代理的策略组，会被当作为
DIRECT
策略处理。
支持
filter
字段，通过正则表达式过滤节点
yaml
proxy-groups
:
-
name
:
my-hongkong-group
type
:
select
include-all
:
true
# 引用所有 proxies & proxy-providers
filter
:
'HK|香港'
# 筛选含有 HK 或香港关键字的代理

---

## Stash 远程代理集使用指南 | Stash

**URL**: https://stashws.org/proxy-protocols/proxy-providers.html

远程代理集
​
在配置文件直接声明的代理，无法在后台自动更新。我们更推荐使用远程代理集（proxy-provider），能在后台自动从 URL 更新策略组。
基本用法
​
要使用远程代理集，需要在
proxy-providers
下定义，并在
proxy-groups
中引用。
yaml
proxy-providers
:
provider-a
:
url
:
https://raw.githubusercontent.com/STASH-NETWORKS-LIMITED/stash-example/main/config.yaml
interval
:
3600
filter
:
'example'
provider-b
:
url
:
https://raw.githubusercontent.com/STASH-NETWORKS-LIMITED/stash-example/main/config.yaml
interval
:
3600
proxy-groups
:
-
name
:
auto
type
:
url-test
interval
:
300
use
:
-
provider-a
# reference to provider-a
-
provider-b
# reference to provider-b
远程代理集格式
​
一个合法的远程代理集必须包含
proxies
字段：
yaml
proxies
:
-
name
:
'ss1'
type
:
ss
server
:
server
port
:
443
cipher
:
AEAD_CHACHA20_POLY1305
password
:
'password'
-
name
:
'ss2'
type
:
ss
server
:
server
port
:
443
cipher
:
AEAD_CHACHA20_POLY1305
password
:
'password'
远程代理集支持通过
filter
字段，使用正则表达式过滤代理名。远程代理集为空时候，会以
DIRECT
替代。
快捷引用远程代理集
​
Stash 也支持通过
use-url
在策略组中快捷引用远程代理集，此时不可指定更新时间和名称。
yaml
proxy-groups
:
-
name
:
auto
type
:
url-test
interval
:
300
use-url
:
-
https://raw.githubusercontent.com/STASH-NETWORKS-LIMITED/stash-example/main/config.yaml
配置参数说明
​
url
​
远程代理集配置文件的 URL 地址，支持 HTTP/HTTPS 协议。
interval
​
更新间隔时间，单位为秒。建议设置为 3600（1小时）或更长，以避免频繁请求。
filter
​
可选参数，使用正则表达式过滤代理名称。只有名称匹配的代理才会被包含在代理集中。
使用优势
​
自动更新
：无需手动更新配置文件，Stash 会自动从远程 URL 获取最新代理列表
灵活管理
：可以同时引用多个远程代理集，实现代理的动态组合
过滤功能
：支持通过正则表达式筛选需要的代理节点
容错处理
：当远程代理集为空或无法访问时，会自动回退到
DIRECT
策略

---

## Stash 协议类型完整指南 | Stash

**URL**: https://stashws.org/proxy-protocols/proxy-types.html

协议类型
​
Stash 支持多种类型的代理协议，可以代理 TCP / UDP 协议。
基本代理参数
​
每个代理必须包含以下参数：
name
：代理名称，每个代理的名称是唯一的
type
：代理类型
server
：服务器地址，可以是域名或 IP 地址
port
：端口
通用可选参数
​
代理可能支持以下参数：
tls
：布尔值，是否基于 TLS 转发
skip-cert-verify
：布尔值，在 TLS 握手时是否忽略证书验证
server-cert-fingerprint
：字符串，在 TLS 握手时验证服务器证书的 SHA256 指纹，以 Hex 编码
sni
：字符串，在 TLS 握手时发送的
Server Name Indication
。若
sni
为空，默认为
server
字段
alpn
：字符串数组，TLS 握手时发送的
Application-Layer Protocol Negotiation (ALPN)
interface-name
：绑定网卡出口，仅在 macOS 支持
延迟测试参数
​
对于单个代理的延迟测试，支持修改以下参数：
benchmark-url
：延迟测试使用的 URL，默认为
http://www.apple.com/
benchmark-timeout
：延迟测试超时，单位为秒，默认为 5 秒
benchmark-disabled
：设置为
true
时完全禁用延迟测试
你可以访问
这里
找到更多关于测试代理延迟的信息。
QUIC 协议特殊参数
​
对于基于 QUIC 的协议，支持定期更改端口以应对 ISP 针对单个端口的限速，这一方法又称为端口跳跃。
ports
：字符串，支持多个端口或端口范围，以逗号分隔，例如
443,8443,5000-6000
hop-interval
：整数，端口跳跃间隔，单位为秒，默认为 30 秒
UDP 处理参数
​
在处理 UDP 时，为了最大程度地兼容各种协议的行为，只会向代理以 IP 地址的形式转发，而不会像 TCP 一样将域名解析交由代理处理。因此在发起 UDP 转发请求前，Stash 会尝试通过代理发起 DNS 查询，以获取正确的、符合 CDN 优化的 DNS 解析，再以此地址转发 UDP 包。
Stash 默认使用 1.0.0.1 进行 DNS 查询，你可以通过以下参数修改：
udp-nameserver
：数组，用于指定 DNS 服务器地址，仅支持 UDP 协议
例如：
yaml
name
:
proxy
type
:
ss
udp-nameserver
: [
'8.8.4.4'
,
'8.8.8.8:53'
]
# ...
Shadowsocks / Shadowsocks2022
​
yaml
name
:
ss1
type
:
ss
server
:
server
port
:
443
cipher
:
chacha20-ietf-poly1305
password
:
'password'
udp
:
true
plugin
:
null
plugin-opts
:
mode
:
host
:
支持的加密方式
​
aes-128-gcm
aes-192-gcm
aes-256-gcm
aes-128-cfb
aes-192-cfb
aes-256-cfb
aes-128-ctr
aes-192-ctr
aes-256-ctr
rc4-md5
chacha20
chacha20-ietf
xchacha20
chacha20-ietf-poly1305
xchacha20-ietf-poly1305
2022-blake3-aes-128-gcm
2022-blake3-aes-256-gcm
Shadowsocks 插件
​
obfs 插件
​
使用
simple-obfs
混淆 TCP 流量。
yaml
plugin
:
obfs
plugin-opts
:
mode
:
tls
# 混淆模式，可以选择 http 或 tls
host
:
bing.com
# 混淆域名，需要和服务器配置保持一致
v2ray-plugin 插件
​
使用
v2ray-plugin
将流量承载在 WebSocket 上。
yaml
plugin
:
v2ray-plugin
plugin-opts
:
mode
:
websocket
# 暂时不支持 QUIC 协议
tls
:
true
# wss
skip-cert-verify
:
true
# 不验证证书
host
:
bing.com
path
:
'/'
headers
:
# 自定义请求头
key
:
value
shadow-tls 插件
​
使用
shadow-tls
进行真实 TLS 握手。
版本支持
目前仅支持 Shadow TLS 的
v2
和
v3
版本。
yaml
plugin
:
shadow-tls
plugin-opts
:
password
:
singalongsong
host
:
weather-data.apple.com
skip-cert-verify
:
false
# 不验证证书
version
:
3
# 只支持 2 和 3
ShadowsocksR
​
yaml
name
:
ssr
type
:
ssr
server
:
server
port
:
443
cipher
:
chacha20-ietf
password
:
'password'
obfs
:
''
protocol
:
''
obfs-param
:
''
protocol-param
:
''
支持的加密方式与 Shadowsocks 相同。
支持的混淆方式
​
plain
http_simple
http_post
random_head
tls1.2_ticket_auth
tls1.2_ticket_fastauth
支持的协议
​
origin
auth_sha1_v4
auth_aes128_md5
auth_aes128_sha1
auth_chain_a auth_chain_b
SOCKS5
​
yaml
name
:
socks
type
:
socks5
server
:
server
port
:
443
# username: username
# password: password
# tls: true
# skip-cert-verify: true
# udp: true
HTTP
​
yaml
name
:
http
type
:
http
server
:
server
port
:
443
headers
:
key
:
value
tls
:
true
# https
skip-cert-verify
:
true
# username: username
# password: password
VMess
​
yaml
name
:
vmess
type
:
vmess
server
:
server
port
:
443
uuid
:
d0529668-8835-11ec-a8a3-0242ac120002
cipher
:
auto
alterId
:
64
network
:
支持的加密方式
​
auto
aes-128-gcm
chacha20-poly1305
none
支持的承载网络
​
ws
h2
http
grpc
WebSocket 配置
​
yaml
network
:
ws
ws-opts
:
path
:
/path
headers
:
Host
:
v2ray.com
max-early-data
:
2048
early-data-header-name
:
Sec-WebSocket-Protocol
HTTP/2 配置
​
yaml
network
:
h2
tls
:
true
h2-opts
:
host
:
-
http.example.com
-
http-alt.example.com
path
:
/
Snell
​
yaml
name
:
snell
type
:
snell
server
:
server
port
:
443
psk
:
yourpsk
udp
:
true
# 需要 v3 以上服务端
version
:
3
# obfs-opts:
# mode: http # 或 tls
# host: bing.com
Snell UDP 需要 v3 版本以上的服务端支持。
支持的混淆模式
​
http
tls
Trojan
​
yaml
name
:
trojan
type
:
trojan
server
:
server
port
:
443
password
:
yourpassword
# udp: true
# sni: example.com # Server Name Indication，如果空会使用 server 中的值
# alpn:
#   - h2
#   - http/1.1
# skip-cert-verify: true
支持的承载网络
​
ws
grpc
Hysteria
​
Hysteria 是一个功能丰富的，专为恶劣网络环境进行优化的网络工具（双边加速），比如卫星网络、拥挤的公共 Wi-Fi、在中国连接国外服务器等。基于修改版的 QUIC 协议。
Hysteria 服务端部署请
参考这里
。
yaml
name
:
'hysteria'
type
:
hysteria
server
:
server
port
:
443
up-speed
:
100
# 上传带宽（单位：Mbps）
down-speed
:
100
# 下载带宽（单位：Mbps）
auth-str
:
your-password
# auth: aHR0cHM6Ly9oeXN0ZXJpYS5uZXR3b3JrL2RvY3MvYWR2YW5jZWQtdXNhZ2Uv # bytes encoded in base64
protocol
:
''
# udp / wechat-video
obfs
:
''
# obfs password
sni
:
example.com
# Server Name Indication，如果空会使用 server 中的值
alpn
:
-
hysteria
skip-cert-verify
:
true
上传、下载带宽单位为 Mbps，请尽量正确填写，超出实际带宽会有反效果。
外部链接：
base64 在线编码工具
。
Hysteria2
​
兼容性说明
请注意，Hysteria 2 与 Hysteria 1.x 完全不兼容，两者差异请参考
官方说明
。
Hysteria2 服务端部署请
参考这里
。
yaml
name
:
'hysteria2'
type
:
hysteria2
server
:
server
port
:
443
auth
:
your-password
fast-open
:
true
sni
:
example.com
# Server Name Indication，如果空会使用 server 中的值
skip-cert-verify
:
true
up-speed
:
100
# 上传带宽（可选，单位：Mbps）
down-speed
:
100
# 下载带宽（可选，单位：Mbps）
VLESS
​
XTLS 协议在 TLS 环境下摆脱冗余加密，提供更优秀的转发性能。
yaml
name
:
vless
type
:
vless
server
:
server
port
:
443
uuid
:
d0529668-8835-11ec-a8a3-0242ac120002
# flow: xtls-rprx-direct
# skip-cert-verify: true
# network: h2
# tls: true
# client-fingerprint: chrome
# ws-opts:
#   path: /path
#   headers:
#     Host: v2ray.com
# grpc-opts:
#   grpc-service-name: "example"
# h2-opts:
#   host:
#     - http.example.com
#     - http-alt.example.com
#   path: /
# reality-opts:
#   public-key:
#   short-id:
支持的 XTLS 模式
​
xtls-rprx-origin
xtls-rprx-direct
xtls-rprx-splice
xtls-rprx-vision
TUIC
​
TUIC 是一个轻量的基于 QUIC 的代理协议，由 Rust 语言编写，目前支持 v4 和 v5 版本。你可以在
这里
找到更多信息。
TUIC v5 配置
​
yaml
name
:
tuic-v5
type
:
tuic
server
:
server
port
:
443
version
:
5
uuid
:
d0529668-8835-11ec-a8a3-0242ac120002
# for v5
password
:
your_password
# for v5
skip-cert-verify
:
true
sni
:
''
alpn
:
-
h3
TUIC v4 配置
​
yaml
name
:
tuic-v4
type
:
tuic
server
:
server
port
:
443
version
:
4
token
:
'your_token'
# for v4
skip-cert-verify
:
true
sni
:
''
alpn
:
-
h3
配置建议
需要注意的是，Stash 客户端不支持 ALPN 为空，默认的 ALPN 为 h3。请在 TUIC 服务端加上
--alpn h3
参数。
请在服务端选择适合的拥塞控制算法
--congestion-controller
参数以充分利用带宽。
Juicity
​
Juicity
是一个基于 QUIC 的代理协议，受到 TUIC 的启发。
yaml
name
:
juicity
type
:
juicity
server
:
server
port
:
443
uuid
:
d0529668-8835-11ec-a8a3-0242ac120002
password
:
your_password
skip-cert-verify
:
true
sni
:
''
alpn
:
-
h3
WireGuard
​
WireGuard
是一个高效的 Layer 3 的 VPN，Stash 支持将其作为 Layer 4 的代理使用，并支持通过其他协议转发 WireGuard 数据包。
yaml
name
:
wireguard
type
:
wireguard
server
:
server
# domain is supported
port
:
51820
ip
:
10.8.4.8
# ipv6: fe80::e6bf:faff:fea0:9fae # optional
private-key
:
0G6TTWwvgv8Gy5013/jv2GttkCLYYaNTArHV0NdNkGI=
# client private key
public-key
:
0ag+C+rINHBnvLJLUyJeYkMWvIAkBjQPPObicuBUn1U=
# peer public key
# preshared-key: # optional
dns
: [
1.0.0.1
,
223.6.6.6
]
# optional
# mtu: 1420 # optional
# reserved: [0, 0, 0] # optional
# keepalive: 45 # optional
# underlying-proxy: # optional
#   type: trojan
#   server: your-underlying-proxy
#   port: 443
#   password: your-password
性能说明
WireGuard 并非以高吞吐为设计目标的代理协议，Stash 需要在用户空间完成 Layer 3 与 Layer 4 的转换，其性能损耗会比常见代理协议大。在移动设备上，WireGuard 吞吐量一般会比 Layer 4 代理协议低。
底层代理要求
若使用
underlying-proxy
，其必须支持 UDP 中继，建议使用 UDP over TCP 的协议（如 Trojan、VLESS、VMess、Snell）。
SSH
​
通过
Secure Shell Protocol (SSH)
转发 TCP 流量，支持密码和密钥认证。
UDP 支持说明
由于 SSH 本身不支持转发 UDP 协议，Stash 无法通过 SSH 协议转发 UDP 流量。
yaml
name
:
ssh
type
:
ssh
server
:
server
# domain is supported
port
:
22
user
:
root
password
:
password
private-key
:
|
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0G6TTWwvgv8Gy5013/jv2GttkCLYYaNTArHV0NdNkGI=
...
-----END RSA PRIVATE KEY-----
private-key-passphrase
:
your-passphrase
# optional
DIRECT with Specified Interface
​
通过新建类型为
direct
的代理，并指定
interface-name
可以强制某些流量通过指定网卡，常用于解决 VPN 与 Stash 无法同时使用的情况。
例如，本机上的 OpenVPN 使用了
utun3
，并且希望
10.4.8.0/24
的流量都进入
utun3
而不是 macOS 的默认网卡。
yaml
name
:
my-corp-vpn
type
:
direct
interface-name
:
utun3
yaml
rules
:
-
IP-CIDR,10.4.8.0/24,my-corp-vpn
网卡查询
上述
utun3
请根据实际情况更改。
你可以使用
netstat -rn | grep utun3
查询
utun3
的静态路由表。

---

## Stash 规则集合使用指南 | Stash

**URL**: https://stashws.org/rules/rule-set.html

规则集合
​
规则集合功能可以在较低资源占用情况下引用大量规则，并支持后台静默更新而无需重新加载 Stash。
基本用法
​
要使用规则集合，您需要在
rule-providers
下完成声明，之后即可在
rules
下引用集合。
yaml
rule-providers
:
proxy-domain
:
behavior
:
domain
# 使用 domain 类规则集可提高匹配效率
format
:
yaml
# 使用 yaml 格式的规则集
url
:
https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt
interval
:
86400
cn-cidr
:
behavior
:
ipcidr
# 使用 ipcidr 类规则集可提高匹配效率
format
:
text
# 使用 text 格式的规则集
url
:
https://cdn.jsdelivr.net/gh/17mon/china_ip_list@master/china_ip_list.txt
interval
:
86400
rules
:
-
RULE-SET,proxy-domain,Proxy
-
RULE-SET,cn-cidr,DIRECT,no-resolve
# ipcidr 类规则集支持 no-resolve 参数
规则集合类型
​
Stash 支持多种规则集合格式，不同格式支持不同内容类型，并具有不同的资源占用表现：
行为（behavior）
格式
支持内容
示例
匹配性能
内存占用
domain
yaml
域名/域名通配符
链接
优秀
低
domain
text
域名/域名通配符
链接
优秀
低
ipcidr
yaml
IPv4/IPv6 集合，CIDR 格式
链接
优秀
低
ipcidr
text
IPv4/IPv6 集合，CIDR 格式
链接
优秀
低
classical
yaml
任意规则类型
链接
一般
一般
classical
text
任意规则类型
链接
一般
一般
使用建议
​
性能优化
domain(-text)
和
ipcidr(-text)
类型的规则集合针对大量数据进行了专门压缩优化，当规则条目较多时建议优先选用。
MRS 格式支持
Stash 也支持使用 MRS 格式的规则集合，目前支持
behavior
为
domain
和
ipcidr
的规则集合。
配置参数说明
​
behavior 参数
​
domain
: 专门用于域名匹配，性能最优
ipcidr
: 专门用于 IP CIDR 匹配，性能最优
classical
: 通用规则类型，支持所有规则格式
format 参数
​
yaml
: YAML 格式的规则文件
text
: 纯文本格式的规则文件
interval 参数
​
规则集合的更新间隔时间（秒），建议设置为 86400（24小时）以确保规则及时更新。
no-resolve 参数
​
在
ipcidr
类型的规则集合中可使用
no-resolve
参数避免触发 DNS 解析。

---

## Stash 规则类型详解 | Stash

**URL**: https://stashws.org/rules/rule-types.html

规则类型
​
通过编写规则，您可以指定不同连接的出站方式，例如通过某个代理转发或拦截。规则可以根据连接的 IP、域名、进程名或组合多个条件进行匹配。
规则匹配机制
​
对于每一条连接，系统会按照从上到下的顺序依次匹配规则。
规则可以分为以下几种类型（其中 IP 类型可能会触发 DNS 解析）：
基于域名
基于 IP 或端口
基于协议
逻辑规则
其他复合类型
使用技巧
​
URL 规则处理
如需针对 URL 编写规则，请参阅
HTTP 重写
章节。
隐藏连接记录
在规则末尾可添加
no-track
参数来隐藏匹配到此规则的连接，例如
SCRIPT,quic,REJECT,no-track
。这能有效避免大量 REJECT 记录充斥页面。
拦截连接
可使用
REJECT
和
REJECT-DROP
这两个内置代理来拦截连接。
REJECT
会立即返回错误，而
REJECT-DROP
会静默丢弃连接，以避免产生连接风暴。
域名匹配规则
​
DOMAIN
​
完全匹配域名，例如
DOMAIN,google.com
匹配
google.com
，但不匹配
www.google.com
。
DOMAIN-SUFFIX
​
匹配域名后缀，例如
DOMAIN-SUFFIX,google.com
匹配
google.com
和
www.google.com
。
DOMAIN-KEYWORD
​
关键词匹配域名，例如
DOMAIN-KEYWORD,google
匹配
google.com
和
google.jp
。
DOMAIN-WILDCARD
​
使用通配符匹配域名，支持
*
和
?
，例如
DOMAIN-WILDCARD,*.google.com
匹配
www.google.com
和
mail.google.com
。
*
匹配任意数量的字符
?
匹配一个字符
DOMAIN-REGEX
​
使用正则表达式匹配域名，例如
DOMAIN-REGEX,^.*\.google\.com$
匹配
www.google.com
和
mail.google.com
。
IP 和地理位置匹配
​
GEOIP
​
通过 MaxMind GeoIP 匹配国家代码，例如
GEOIP,CN
。可添加
no-resolve
以避免触发 DNS 解析。
自定义数据库
Stash 允许用户替换符合 MaxMind GeoIP 格式的数据库。用户可根据自身需求选择更适合的 MaxMind GeoIP 数据库。
IP-ASN
​
通过 IP 自治系统编号匹配，例如
IP-ASN,714
。可添加
no-resolve
以避免触发 DNS 解析。
IP-CIDR / IP-CIDR6
​
IP CIDR 范围匹配，例如
IP-CIDR,192.168.1.0/24
。可添加
no-resolve
以避免触发 DNS 解析。
协议和端口匹配
​
NETWORK
​
匹配网络类型，例如
tcp
匹配 TCP 协议，
udp
匹配 UDP 协议。
PROTOCOL
​
PROTOCOL 规则比 NETWORK 规则提供更细粒度的判断。支持的协议包括：
TCP
UDP
HTTP
TLS
QUIC
STUN
DST-PORT
​
目标端口匹配，例如
DST-PORT,80
。
高级规则类型
​
RULE-SET
​
引用大量规则时，请使用
规则集合
。
GEOSITE
​
使用
domain-list-community
域名列表进行匹配，例如
GEOSITE,twitter
匹配 Twitter 公司相关域名。
text
ads-twitter.com @ads
cms-twdigitalassets.com
periscope.tv
pscp.tv
t.co
tellapart.com
tweetdeck.com
twimg.com
twitpic.com
twitter.biz
twitter.com
twitter.jp
twitter.map.fastly.net
twittercommunity.com
twitterflightschool.com
twitterinc.com
twitteroauth.com
twitterstat.us
twtrdns.net
twttr.com
twttr.net
twvid.com
vine.co
x.com
数据加载
domain-list-community 数据不随 Stash 分发，Stash 会在首次使用时从 github.com 按需加载域名数据。首次使用请确保当前配置能正常访问 github.com。
PROCESS-NAME
​
进程名称匹配，例如
PROCESS-NAME,Telegram
。仅对本机进程有效。
iOS/tvOS 限制
由于 Network Extension 的限制，Stash iOS/tvOS（包括运行于 Apple silicon 设备上的 iOS 版）不支持 PROCESS-NAME 规则，配置中的进程相关规则将被忽略。
PROCESS-PATH
​
进程路径匹配，例如
PROCESS-PATH,/Applications/Telegram.app/Contents/MacOS/Telegram
。仅对本机进程有效。
iOS/tvOS 限制
由于 Network Extension 的限制，Stash iOS/tvOS（包括运行于 Apple silicon 设备上的 iOS 版）不支持 PROCESS-PATH 规则，配置中的进程相关规则将被忽略。
脚本规则
​
SCRIPT
​
通过 Python 表达式匹配请求。表达式必须返回 Boolean 值，执行错误的表达式会被忽略。
表达式可读取以下变量：
json
{
"network"
:
"string"
,
// 可以是 tcp 或 udp
"host"
:
"string"
,
// 可能为空
"dst_ip"
:
"string"
,
// 可能为空
"dst_port"
:
"number"
,
"src_ip"
:
"string"
,
// 仅在网关模式下有效
"src_port"
:
"number"
// 仅在网关模式下有效
}
表达式可调用以下函数：
python
def
resolve_ip
(host:
str
) ->
str
:
pass
def
in_cidr
(ip:
str
, cidr:
str
) ->
bool
:
pass
def
geoip
(ip:
str
) ->
str
:
pass
def
ipasn
(ip:
str
) ->
int
:
pass
def
match_provider
(name:
str
) ->
bool
:
pass
def
match_geosite
(name:
str
) ->
bool
:
pass
例如，需要拦截 QUIC 协议的请求，可以这样写：
yaml
rules
:
-
SCRIPT,quic,REJECT
-
SCRIPT,udp-cn,ProxyToCN
script
:
shortcuts
:
# 可在 rule 中引用
quic
:
network == 'udp' and dst_port == 443
# 匹配 QUIC 协议
udp-cn
:
network == 'udp' and geoip(dst_ip if dst_ip != '' else resolve_ip(host)) == 'CN'
# 匹配发往 CN 的 UDP
instagram-quic
:
network == 'udp' and dst_port == 443 and match_geosite('instagram')
# 匹配 Instagram 的 QUIC
逻辑规则
​
AND
​
当需要同时满足多个规则时，可以使用 AND 逻辑规则。
AND,((#Rule1), (#Rule2), (#Rule3)...),PROXY
子规则配置
在子规则中，也可以添加
no-resolve
参数来避免触发 DNS 解析。例如：
AND,((IP-CIDR,192.168.1.110,no-resolve), (DOMAIN-SUFFIX,example.com), (DOMAIN-KEYWORD, xxx)), DIRECT
OR
​
当需要满足其中一个规则时，可以使用 OR 逻辑规则。
OR,((#Rule1), (#Rule2), (#Rule3)...),PROXY
NOT
​
对规则取反。
NOT,((#Rule1)),PROXY
组合使用
逻辑规则可以组合使用，例如：
AND,((NOT,((SRC-IP,192.168.1.110))),(DOMAIN,example.com)),DIRECT
其他规则类型
​
USER-AGENT
​
通过 User-Agent 请求标头进行匹配。
USER-AGENT,AppleNews*,PROXY
URL-REGEX
​
使用正则表达式匹配链接。
URL-REGEX,^https?:\/\/www\.amazon\.com\/(Amazon-Video|gp\/video)\/,PROXY

---

## Stash JavaScript 改写 HTTP 请求和响应 | Stash

**URL**: https://stashws.org/script/rewrite-requests.html

改写 HTTP
​
用户可以通过 JavaScript 脚本修改流经 Stash 的 HTTP 请求、响应。
配置格式
​
yaml
http
:
script
:
-
match
:
url-you-want-to-match
name
:
your-fancy-script
type
:
response
# request / response
require-body
:
true
timeout
:
20
argument
:
''
binary-mode
:
false
max-size
:
1048576
# 1MB
script-providers
:
your-fancy-script
:
url
:
https://your-fancy-script.com/your-fancy-script.js
interval
:
86400
参数：
match
: 脚本匹配的 URL 正则表达式。
type
: 脚本类型，可选值为
request
或
response
。
require-body
: 是否需要请求体 / 响应体，在脚本中处理 body 需要消耗更多的内存空间，仅在必要时启用。
timeout
: 脚本执行超时时间，单位为秒。
argument
: 脚本执行时的参数，类型为
string
。
binary-mode
：二进制模式，
body
会以
Uint8Array
而不是
string
传递给脚本。
max-size
：单位为字节，body 超过这个大小的请求不会触发脚本。
💡 二进制模式仅在 Stash iOS 2.0.2 以及之后的版本支持。
Request Object
​
$request.url
：请求 URL
$request.method
：请求方法
$request.headers
：请求头
$request.body
：请求体，仅在
require-body: true
时有，根据是否开启二进制模式，可以为
string
或者
Uint8Array
Response Object
​
$request.url
：请求 URL
$request.method
：请求方法
$request.headers
：请求头
$response.status
：响应状态码
$response.headers
：响应头
$response.body
：响应体，仅在
require-body: true
时有，根据是否开启二进制模式，可以为
string
或者
Uint8Array
$done(value)
​
⚠️ 对于所有脚本，在结束时候必须调用
$done(value)
方法释放资源。
对于 request 类型的脚本，调用
$done(object)
可以改写 HTTP 请求，
object
可以包含下述字段：
url
：修改请求的 URL
headers
：修改请求的 headers
body
：修改请求的 body
response
：替换 HTTP 响应，不再实际发出 HTTP 请求
你可以调用
$done()
来打断请求，或者
$done({})
不修改请求的任何内容。
对于 response 类型的脚本，调用
$done(object)
可以改写 HTTP 响应，
object
可以包含下述字段：
status
：修改响应的状态码
headers
：修改响应的 headers
body
：修改响应的 body
你可以调用
$done()
来打断请求，或者
$done({})
不修改响应的任何内容。

---

## Stash 定时任务配置指南 | Stash

**URL**: https://stashws.org/script/scheduled-tasks.html

定时任务
​
Stash 可以在后台执行定时任务，目前仅支持执行 JavaScript 脚本，定时任务需要依赖 Network Extension（VPN）在已连接状态。
Script / 定时脚本
​
Stash 可以在后台定时执行 JavaScript 脚本，以实现自动化的任务，执行的结果可通过系统通知或记录到持久化存储。
JavaScript 脚本的语法和接口请参考
JavaScript 脚本
。
定时脚本通过 cron 表达式指定执行时间、间隔，cron 表达式的语法请参考
这里
。
yaml
cron
:
script
:
-
name
:
your-script-name
cron
:
'*/5 * * * *'
# at every 5th minute
argument
:
'{ "key": true }'
# optional
timeout
:
10
# optional
-
name
:
your-script-name
cron
:
'0 20 * * *'
# at 20:00
argument
:
'{ "key": false }'
# optional
timeout
:
15
# optional
script-providers
:
your-script-name
:
url
:
https://example.com/your-script.js
interval
:
86400
💡 你可以在多个场景引用同一个脚本，并通过环境变量判断事件来源（如 HTTP 改写、定时任务）。

---

## Stash JavaScript 脚本语法与接口 | Stash

**URL**: https://stashws.org/script/syntax-and-interface.html

语法与接口
​
基础方法
​
$script.name
：脚本名称
$script.type
：脚本类型，如
request
,
response
和
tile
$script.startTime
：脚本开始运行的时间
$environment["stash-build"]
：Stash Build 编号
$environment["stash-version"]
：Stash 版本号
$environment.language
：Stash 运行语言
$environment.system
：Stash 运行系统 (iOS / macOS)
$argument
：运行参数
$done(value)
：结束脚本运行，释放资源
$notification.post(title, subtitle, body)
：发送 iOS 通知
console.log(value)
：输出日志，脚本日志会输出到单独的文件
setTimeout(callback, delay)
：延迟执行回调函数
$done(value)
​
⚠️ 对于所有脚本，在结束时候必须调用
$done(value)
方法释放资源。
持久化存储
​
$persistentStore.write(value, key)
：写入持久化存储
$persistentStore.read(key)
：读取持久化存储
HTTP Client
​
$httpClient.get(url<String>, callback<Function>)
$httpClient.get(request<Object>, callback<Function>)
同样地，还有：
$httpClient.post()
$httpClient.put()
$httpClient.delete()
$httpClient.head()
$httpClient.options()
$httpClient.patch()
请求的超时为 5 秒，可以通过设置
X-Stash-Selected-Proxy
指定请求的使用的代理，或设置
binary-mode
开启二进制模式，例如：
javascript
$httpClient.
get
(
'http://httpbin.org/get'
, (
error
,
response
,
data
)
=>
{
if
(error) {
console.
log
(error)
}
else
{
console.
log
(data)
}
})
const
yourProxyName
=
'a fancy name with 😄'
$httpClient.
post
(
{
url:
'http://httpbin.org/post'
,
headers: {
'X-Header-Key'
:
'headerValue'
,
'X-Stash-Selected-Proxy'
:
encodeURIComponent
(yourProxyName),
},
body:
'{}'
,
// can be object or string
timeout:
5
,
insecure:
false
,
'binary-mode'
:
true
,
'auto-cookie'
:
true
,
'auto-redirect'
:
true
,
},
(
error
,
response
,
data
)
=>
{
if
(error) {
console.
log
(error)
}
else
{
console.
log
(data)
}
}
)

---

## Stash 面板（Tile）配置指南 | Stash

**URL**: https://stashws.org/script/tile.html

面板 (Tile)
​
用户可以通过 JavaScript 脚本自定义 Stash 首页的 Tile 面板。
配置格式
​
yaml
tiles
:
-
name
:
your-fancy-script
interval
:
600
title
:
'Awesome Tile'
content
:
'This is Super Cool'
icon
:
'theatermasks.circle.fill'
# 或 https://stash.ws/amazing.png
backgroundColor
:
'#663399'
script-providers
:
your-fancy-script
:
url
:
https://your-fancy-script.com/your-fancy-script.js
interval
:
86400
参数：
argument
: 可选，脚本执行时的参数，类型为
string
。
title
: 可选，脚本第一次运行前的标题默认值。
content
: 可选，脚本第一次运行前的内容默认值。
icon
: 可选，脚本第一次运行前的图标默认值。图标支持
SF Symbols
或以
http
开头的远程图片。
backgroundColor
: 可选，脚本第一次运行前的背景颜色默认值。
url
: 可选，脚本第一次运行前的跳转 URL 。
collapsed
: 可选，将面板折叠进第三方服务的面板，不在首页显示。
以上部分字段可被
$done(object)
覆盖更新。
⚠️ 更多关于
SF Symbols
详情请参考
Apple Developer
。
语法与接口
​
请参考
JavaScript 脚本语法与接口
。
例子
javascript
$httpClient.
get
(
'https://api.my-ip.io/ip'
,
function
(
error
,
response
,
data
) {
$done
({
title:
'当前 IP 地址'
,
content: data,
backgroundColor:
'#663399'
,
icon:
'network'
,
})
})
$done(value)
​
⚠️ 对于所有脚本，在结束时候必须调用
$done(value)
方法释放资源。
对于 Tile 类型的脚本，调用
$done(object)
可以更新 Tile 面板内容，
object
可以包含下述字段：
title
: 可选，新的 Tile 标题。
content
: 可选，新的 Tile 内容。
icon
: 可选，新的 Tile 图标。
backgroundColor
: 可选，新的 Tile 背景颜色。
url
: 可选，新的跳转 URL 。
以上字段如为空则不更新。你可以直接调用
$done({})
不修改任何内容。
Collapsed Tile
​
当
collapsed
设置为
true
时，脚本会被折叠进第三方服务的面板中。第三方服务的面板中显示的样式会与首页稍有不同，通常适用于指示当前网络环境对第三方服务的支持程度。
通过长按节点显示代理详情时，通过
$httpClient
发起的 HTTP 请求会通过该节点进行转发，因此可以通过 Collapsed Tile 来测试该节点对第三方服务的支持程度。

---

## Stash Mac | Stash

**URL**: https://stashws.org/stash-mac.html

Stash Mac
​
Stash Mac 包含 iOS 版本的所有功能。此外，由于专为 macOS 平台设计，Stash Mac 将支持比 iOS 版本更多的功能。
原生应用
​
Stash Mac 专为 macOS 平台设计，原生支持 Intel / Apple Silicon 两种架构的 Mac。此外，支持开机启动、菜单栏快捷操作、键盘快捷键等一系列 macOS 原生交互。
基于进程的规则
​
由于 macOS 的开放设计，Stash Mac 可以为进程指定独立的分流规则。在 Stash Dashboard 中，您可以查看每个本地 TCP / UDP 连接对应的进程信息，甚至可以利用 Stash 构建您个人的网络防火墙。
网关模式
​
在局域网中有多个设备？Stash Mac 支持网关模式，只需将局域网中设备的网关指向运行 Stash 增强模式的 macOS，即可提供无缝的透明代理体验。Stash Mac 已经为作为路由网关做好了充分准备，
点击这里了解更多
。
想要购买？点击这里了解 Stash Mac 的价格

---

