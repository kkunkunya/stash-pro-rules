# Apple Intelligence 分流规则调研发现

## 调研时间
2026-02-06

## 数据来源
1. blackmatrix7/ios_rule_script - GitHub 最全面的 iOS 分流规则仓库
2. enriquephl/QuantumultX_config - Apple Intelligence 解锁配置
3. SukkaLab/ruleset.skk.moe - iCloud Private Relay 规则
4. Lumia Security AppleStorm 研究 - Apple AI 隐私分析
5. Surge/Stash/Clash 社区讨论

---

## 🔥 关键发现

### 1. Apple Intelligence 架构（来自 Lumia Security 研究）

Apple Intelligence 依赖四个主要服务组件：

| 组件 | 域名 | 说明 |
|------|------|------|
| **Private Cloud Compute** | `apple-relay.*.com` | Apple AI 云端处理核心 |
| **Siri Dictation** | `guzzoni.apple.com` | Siri 语音转文字 |
| **Siri Search** | `*.smoot.apple.com` | Siri 搜索服务 |
| **AI Extensions (ChatGPT)** | `apple-relay.apple.com` | 第三方 AI 集成 |

### 2. Apple Intelligence 核心域名（必须代理）

```yaml
# Private Cloud Compute (PCC) - Apple AI 云端处理
- DOMAIN,apple-relay.apple.com
- DOMAIN,apple-relay.cloudflare.com
- DOMAIN,apple-relay.fastly-edge.com
- DOMAIN,cp4.cloudflare.com
- DOMAIN,cp10.cloudflare.com

# Siri 语音处理（会发送语音数据到 Apple 服务器）
- DOMAIN,guzzoni.apple.com

# Siri 搜索服务（会发送设备信息和位置）
- DOMAIN-SUFFIX,smoot.apple.com
```

### 3. iCloud Private Relay 域名（影响隐私中继）

```yaml
- DOMAIN,mask.apple-dns.net
- DOMAIN,canary.mask.apple-dns.net
- DOMAIN,mask-canary.icloud.com
- DOMAIN,mask-api.icloud.com
- DOMAIN,mask-h2.icloud.com
- DOMAIN,mask.icloud.com
```

### 4. 社区总结的分流策略

| 服务 | 策略 | 节点建议 | 原因 |
|------|------|---------|------|
| **Apple Intelligence** | 🔗 链式代理/美国 | 美国家宽 | 需要美区 Apple ID + 支持地区 |
| **Siri + ChatGPT** | 🔗 链式代理/美国 | 美国节点 | ChatGPT 需要支持地区 |
| **iCloud Private Relay** | 代理 | 任意非中国 | 隐私中继功能 |
| **TestFlight** | 代理 | 任意 | 部分测试版需要 |
| **Apple News** | 代理 | 美国 | 仅美区可用 |
| **Apple TV+** | 可选代理 | 按需 | 内容因地区而异 |
| **Apple Developer** | 代理 | 任意 | 开发者资源 |
| **App Store** | 直连 | - | 国区直连更快 |
| **iCloud Drive** | 直连 | - | 云上贵州直连稳定 |
| **Apple Music** | 直连 | - | 国区直连即可 |
| **Apple Maps** | 直连 | - | 国区高德数据 |

---

## 📦 完整规则汇总

### Apple Intelligence 专用规则（高优先级）

```yaml
# ==========================================
# Apple Intelligence / Private Cloud Compute
# ==========================================
- DOMAIN,apple-relay.apple.com
- DOMAIN,apple-relay.cloudflare.com
- DOMAIN,apple-relay.fastly-edge.com
- DOMAIN,cp4.cloudflare.com
- DOMAIN,cp10.cloudflare.com

# ==========================================
# Siri 后端服务
# ==========================================
- DOMAIN,guzzoni.apple.com
- DOMAIN-SUFFIX,smoot.apple.com

# ==========================================
# iCloud Private Relay
# ==========================================
- DOMAIN,mask.apple-dns.net
- DOMAIN,canary.mask.apple-dns.net
- DOMAIN,mask-canary.icloud.com
- DOMAIN,mask-api.icloud.com
- DOMAIN,mask-h2.icloud.com
- DOMAIN,mask.icloud.com
```

### blackmatrix7 AppleProxy 规则（需要代理的 Apple 服务）

```yaml
- DOMAIN,api-glb-sea.smoot.apple.com
- DOMAIN,apple.comscoreresearch.com
- DOMAIN,books.itunes.apple.com
- DOMAIN,cdn.apple-cloudkit.com
- DOMAIN,cvws.icloud-content.com
- DOMAIN,developer.apple.com
- DOMAIN,devimages-cdn.apple.com
- DOMAIN,devstreaming-cdn.apple.com
- DOMAIN,docs-assets.developer.apple.com
- DOMAIN,gspe1-ssl.ls.apple.com
- DOMAIN,hls-svod.itunes.apple.com
- DOMAIN,itunes.apple.com
- DOMAIN,js-cdn.music.apple.com
- DOMAIN,lookup-api.apple.com
- DOMAIN,news-assets.apple.com
- DOMAIN,news-client.apple.com
- DOMAIN,news-edge.apple.com
- DOMAIN,news-events.apple.com
- DOMAIN,np-edge.itunes.apple.com
- DOMAIN,play-edge.itunes.apple.com
- DOMAIN,sandbox.itunes.apple.com
- DOMAIN,testflight.apple.com
- DOMAIN,tv.applemusic.com
- DOMAIN,uts-api.itunes.apple.com
- DOMAIN-SUFFIX,apple-dns.net
- DOMAIN-SUFFIX,apple.news
- DOMAIN-SUFFIX,apps.apple.com
- DOMAIN-SUFFIX,appsto.re
- DOMAIN-SUFFIX,audio-ssl.itunes.apple.com
- DOMAIN-SUFFIX,blobstore.apple.com
- DOMAIN-SUFFIX,cdn-apple.com
- DOMAIN-SUFFIX,digicert.com
- DOMAIN-SUFFIX,hls-amt.itunes.apple.com
- DOMAIN-SUFFIX,hls.itunes.apple.com
- DOMAIN-SUFFIX,ocsp.apple.com
- DOMAIN-SUFFIX,tv.apple.com
```

---

## ⚠️ 重要注意事项

### 1. Apple Intelligence 地区限制

要使用 Apple Intelligence，需要满足：
- **设备**：iPhone 15 Pro 及以上 / M 系列 Mac / iPad
- **系统**：iOS 18.1+ / macOS 15.1+
- **Apple ID**：美国/英国/澳大利亚等支持地区
- **设备语言**：English (US/UK/AU)
- **Siri 语言**：English

### 2. 节点选择建议

- **Apple Intelligence + ChatGPT**：建议使用美国家宽 IP（链式代理）
- **Apple News**：必须使用美国节点
- **iCloud Private Relay**：任意非中国节点

### 3. OpenClash 嗅探问题

从嗅探跳过列表中移除 apple 相关域名，否则 Apple Intelligence 流量无法正确分流。

---

## 参考链接

1. [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
2. [enriquephl/QuantumultX_config](https://github.com/enriquephl/QuantumultX_config)
3. [SukkaLab/ruleset.skk.moe](https://github.com/SukkaW/Surge)
4. [AppleStorm: Unmasking Privacy Risks](https://lumia.security/blog/applestorm)
5. [Apple Private Cloud Compute](https://security.apple.com/blog/private-cloud-compute/)
