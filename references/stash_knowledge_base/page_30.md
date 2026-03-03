# Stash 规则集合使用指南 | Stash

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
