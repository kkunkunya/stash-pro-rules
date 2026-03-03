# 项目进度记录（压缩版）

## 当前状态
- 2026-01-30：链式代理脚本能力已完成并可用。
- 2026-03-03：项目目录已按功能域完成归类，主交付入口保持不变。

## 里程碑 A：链式代理脚本
- 主要文件：`tools/override_script/19bf524c81b.js`
- 核心改动：
  - 增加 `🏠 落地机` 节点。
  - 增加 `🔗 链式代理` 节点（`dialer-proxy` 方式）。
  - 为 `🤖 ChatGPT / 🤖 Copilot / 🤖 AI服务 / 📢 谷歌FCM / 🇬 谷歌服务` 启用链式选项。
- 备注：敏感连接参数不在进度文档落盘，按运行环境注入。

## 里程碑 B：项目归类整理（2026-03-03）
- KEEP-RUN（主交付主链，保留根目录）：
  - `README.md` `LICENSE` `stash-rules.stoverride` `full-config.yaml`
  - `rules/` `docs/` `assets/`
- 参考资料归类：
  - `references/ios_rule_script_ref/`
  - `references/stash_knowledge_base/`
  - `references/apple_分流地址清单.md`
- 历史副本归档：
  - `archive/stash-rules-repo_20260206_snapshot/`
- 脚本归类：
  - `tools/override_script/19bf524c81b.js`
  - `tools/override_script/19bf524c81b-no-comments.js`
- 清理动作（可恢复）：
  - 所有 `.DS_Store` 已移入 `trash/`
  - 2026-03-03：用户确认后已执行 `trash/` 不可恢复清空（当前为空）
  - 2026-03-03：根目录 `LICENSE` 为删除状态，按用户指令保留删除不恢复
  - 2026-03-03：根目录 `full-config.yaml` 为删除状态，按用户指令保留删除不恢复

## 验证证据
- 命令：`ls -la`（根目录主链存在）
- 命令：`find references archive tools trash -maxdepth 3 -print | sort`（归类路径存在）
- 命令：`git status --short`（可追踪全部路径变更）
