# Stash 规则类型详解 | Stash

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
