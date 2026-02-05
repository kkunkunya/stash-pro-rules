# 从 Mihomo/Clash 迁移到 Stash 指南

本文档帮助你将现有的 Mihomo/Clash 配置迁移到 Stash。

## 兼容性对照表

| 功能 | Mihomo/Clash | Stash | 迁移方案 |
|------|--------------|-------|----------|
| `dialer-proxy` | ✅ 支持 | ❌ 不支持 | 改用 `relay` 策略组 |
| `load-balance` | ✅ 支持 | ✅ 支持 | 直接兼容 |
| `url-test` | ✅ 支持 | ✅ 支持 | 直接兼容 |
| `GEOSITE` | ✅ 支持 | ✅ 支持 | 直接兼容 |
| `GEOIP` | ✅ 支持 | ✅ 支持 | 直接兼容 |
| `geodata-mode: true` | ✅ 支持 | ❌ 不支持 | 删除该字段 |
| `geox-url` | ✅ 支持 | ❌ 不支持 | 删除该字段 |
| `enhanced-mode: fake-ip` | ✅ 支持 | ✅ 支持 | 字段名改为 `dns.mode` |
| JavaScript 覆写 | ✅ 支持 | ❌ 不支持 | 转换为静态 YAML |

## 链式代理迁移

### Mihomo 方式（dialer-proxy）

```yaml
proxies:
  - name: "🔗 链式代理"
    type: socks5
    server: 落地机IP
    port: 443
    dialer-proxy: "🇺🇸 美国节点"  # 关键：通过美国节点连接
```

### Stash 方式（relay）

```yaml
proxy-groups:
  - name: "🔗 链式代理"
    type: relay
    proxies:
      - "🇺🇸 美国节点"   # 第一跳
      - "🏠 落地机"       # 第二跳

proxies:
  - name: "🏠 落地机"
    type: socks5
    server: 落地机IP
    port: 443
```

## rule-providers 迁移

### Mihomo 格式

```yaml
rule-providers:
  proxy-domain:
    type: http
    behavior: domain
    path: ruleset/proxy.yaml
    url: https://example.com/proxy.yaml
    interval: 86400
```

### Stash 格式

```yaml
rule-providers:
  proxy-domain:
    behavior: domain
    format: yaml           # Stash 需要明确指定 format
    url: https://example.com/proxy.yaml
    interval: 86400
    # 注意：Stash 不需要 type 和 path 字段
```

## DNS 配置迁移

### Mihomo 格式

```yaml
dns:
  enable: true
  enhanced-mode: fake-ip
  fake-ip-filter:
    - "+.lan"
```

### Stash 格式

```yaml
dns:
  fake-ip-filter:
    - "+.lan"
  # 注意：Stash 的 fake-ip 模式通过其他方式配置
```

## 常见问题

### Q: 迁移后某些规则不生效？

检查是否使用了 Stash 不支持的规则类型。Stash 支持的规则类型：
- DOMAIN / DOMAIN-SUFFIX / DOMAIN-KEYWORD / DOMAIN-WILDCARD / DOMAIN-REGEX
- GEOIP / IP-ASN / IP-CIDR / IP-CIDR6
- GEOSITE
- RULE-SET
- PROCESS-NAME / PROCESS-PATH（仅 macOS）
- AND / OR / NOT（逻辑规则）
- MATCH

### Q: geodata-mode 相关报错？

删除 `geodata-mode` 和 `geox-url` 字段。Stash 使用内置的 GeoIP 数据库。

### Q: 如何测试迁移是否成功？

1. 在 Stash 中导入配置
2. 检查策略组是否正常显示
3. 测试几个典型网站：
   - chat.openai.com → 应走 ChatGPT 策略组
   - google.com → 应走谷歌服务策略组
   - baidu.com → 应直连
