# Stash 为局域网设备提供代理 | Stash

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
