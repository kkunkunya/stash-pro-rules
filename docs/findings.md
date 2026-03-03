# 关键发现（压缩版）

## 2026-02-06 Apple Intelligence 分流
- 核心服务面：Private Cloud Compute、Siri Dictation、Siri Search、AI Extensions。
- 必须代理的关键域名：
  - `apple-relay.apple.com`
  - `apple-relay.cloudflare.com`
  - `apple-relay.fastly-edge.com`
  - `cp4.cloudflare.com`
  - `cp10.cloudflare.com`
  - `guzzoni.apple.com`
  - `*.smoot.apple.com`
  - `mask.apple-dns.net`
  - `canary.mask.apple-dns.net`
  - `mask-canary.icloud.com`
  - `mask-api.icloud.com`
  - `mask-h2.icloud.com`
  - `mask.icloud.com`
- 策略结论：
  - Apple Intelligence / Siri + ChatGPT：优先 `🔗 链式代理`（美国家宽）。
  - iCloud Private Relay / TestFlight / Apple Developer：走代理。
  - App Store / iCloud Drive / Apple Music / Apple Maps：默认直连。
- 使用条件：
  - 设备：iPhone 15 Pro+ 或 M 系列设备。
  - 系统：iOS 18.1+ / macOS 15.1+。
  - 地区与语言：支持地区 Apple ID + English 语言组合。

## 2026-03-03 项目整理归类结论
- 主交付主链（KEEP-RUN）保持根目录不变：
  - `README.md` `LICENSE` `stash-rules.stoverride` `full-config.yaml` `rules/` `docs/` `assets/`
- 参考资料集中到 `references/`：
  - `references/ios_rule_script_ref/`
  - `references/stash_knowledge_base/`
  - `references/apple_分流地址清单.md`
- 历史副本归档到 `archive/`：
  - `archive/stash-rules-repo_20260206_snapshot/`
- 脚本与工具集中到 `tools/override_script/`：
  - `19bf524c81b.js`
  - `19bf524c81b-no-comments.js`
- 清理策略采用“可恢复”原则：
  - `.DS_Store` 先移动到 `trash/`，暂不做不可恢复删除。

## 2026-03-03 GitHub 同步可见性流程（固化）
- 目标仓库固定为：`https://github.com/kkunkunya/stash-pro-rules`
- 固化流程：
  - 第一步：先将仓库设为 `public`，用于手机端同步拉取。
  - 第二步：手机端确认同步完成后，再将仓库改回 `private`。
- 执行原则：需要我代执行时，默认按以上顺序操作，不再重复确认流程本身，仅确认执行时机。
