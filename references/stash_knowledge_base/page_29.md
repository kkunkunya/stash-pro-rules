# Stash 协议类型完整指南 | Stash

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
