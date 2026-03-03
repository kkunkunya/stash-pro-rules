---
name: clash-override-script
description: |
  Clash/Mihomo 覆写脚本开发指南，包含代理组配置、分流规则、链式代理实现。
  触发场景：用户提到 "Clash 配置"、"Mihomo 覆写"、"代理分流"、"链式代理"、"dialer-proxy"、
  "proxy-groups"、"rule-providers"、"代理规则"、"机场配置"、"节点分组" 等关键词。
  支持：(1) JavaScript 覆写脚本编写；(2) 代理组类型配置（select/url-test/load-balance/fallback）；
  (3) 链式代理实现（dialer-proxy 方式）；(4) 分流规则设计；(5) DNS 配置优化。

  **双版本输出**：修改配置文件时，自动生成两个版本：
  - `{filename}.js` - 带完整注释版本（便于维护和理解）
  - `{filename}-no-comments.js` - 无注释版本（精简部署）
---

# Clash/Mihomo 覆写脚本开发指南

## 覆写脚本基础结构

```javascript
function main(config) {
  config = config || {};
  const proxies = Array.isArray(config.proxies) ? config.proxies : [];
  const allNodeNames = proxies.map((p) => p?.name).filter(Boolean);
  // ... 配置逻辑 ...
  return config;
}
```

## 代理组类型

| 类型 | 用途 | 关键参数 |
|------|------|----------|
| `select` | 手动选择 | `proxies: []` |
| `url-test` | 自动测速选最快 | `url`, `interval`, `tolerance` |
| `load-balance` | 负载均衡 | `strategy: "round-robin"` |
| `fallback` | 故障转移 | `url`, `interval` |

### 地区节点分组示例

```javascript
const REGION_PATTERNS = {
  "🇺🇸 美国节点": /(美|US|United\s*States|洛杉矶|硅谷)/i,
  "🇭🇰 香港节点": /(港|HK|Hong\s*Kong)/i,
  "🇯🇵 日本节点": /(日本|JP|Japan|东京|大阪)/i,
};

const buildUrlTest = (name, list) => ({
  name, type: "url-test",
  url: "https://www.gstatic.com/generate_204",
  interval: 300, tolerance: 50, proxies: list,
});
```

## 链式代理（重点）

### 原理
```
设备 → 第一跳(出国节点) → 第二跳(落地机) → 目标网站
```
**用途**：通过家宽 IP 访问 AI 服务，避免数据中心 IP 被封。

### 实现：dialer-proxy（Mihomo 推荐）

> ⚠️ `relay` 类型已被移除，必须使用 `dialer-proxy`

```javascript
// 链式代理节点
const CHAIN_PROXY_NODE = {
  name: "🔗 链式代理",
  type: "socks5",
  server: "落地机IP",
  port: 443,
  username: "用户名",
  password: "密码",
  "dialer-proxy": "🇺🇸 美国节点",  // 关键：指定第一跳
};
config.proxies.push(CHAIN_PROXY_NODE);
```

### dialer-proxy 选择
| 落地机位置 | 推荐 dialer-proxy | 原因 |
|------------|-------------------|------|
| 美国 | 🇺🇸 美国节点 | 同区域延迟低 |
| 日本 | 🇯🇵 日本节点 | 避免跨区检测 |

### 功能组添加链式代理选项

```javascript
const FEATURE_GROUPS = [
  { name: "🤖 ChatGPT", useChain: true, forbidDirect: true },
  { name: "🇬 谷歌服务", useChain: true },
];

const featureGroups = FEATURE_GROUPS.map(
  ({ name, useChain = false, forbidDirect = false }) => ({
    name, type: "select",
    proxies: [
      ...(useChain ? ["🔗 链式代理"] : []),
      ...REGION_GROUP_NAMES, MAIN_PROXY,
      ...(forbidDirect ? [] : ["🎯 全球直连"]),
    ],
  })
);
```

## 分流规则优先级

1. 私有网络直连
2. AI 服务（高优先级）
3. 谷歌服务
4. GFW 列表
5. 中国直连
6. 兜底规则

```javascript
const R = [];
R.push("GEOSITE,private,🎯 全球直连");
R.push("DOMAIN-SUFFIX,openai.com,🤖 ChatGPT");
R.push("GEOSITE,google,🇬 谷歌服务");
R.push("GEOSITE,gfw,🚀 主力代理");
R.push("GEOSITE,cn,🎯 全球直连");
R.push("MATCH,🐟 漏网之鱼");
config.rules = R;
```

## 常见问题

**Q: relay 类型报错？**
A: Mihomo 已移除 relay，改用 `dialer-proxy` 属性。

**Q: AI 服务提示不支持的地区？**
A: 检查 dialer-proxy 指向的节点是否在支持地区（如美国）。

## 参考

完整模板见 [references/template.js](references/template.js)

## 双版本输出规范

修改 Clash 覆写脚本时，**必须同时生成两个版本**：

### 文件命名
| 版本 | 文件名 | 用途 |
|------|--------|------|
| 带注释版 | `{原文件名}.js` | 开发维护，便于理解配置逻辑 |
| 无注释版 | `{原文件名}-no-comments.js` | 精简部署，减少文件体积 |

### 注释移除规则
无注释版本需移除：
1. 单行注释 `// ...`
2. 多行注释 `/* ... */` 和 `/** ... */`
3. 行内注释（代码后的 `// ...`）
4. 分隔线注释（如 `// ========`）

### 保留内容
- 所有代码逻辑
- 字符串中的内容（不是注释）
- 空行结构（保持代码可读性）

### 工作流程
```
1. 用户请求修改配置
2. 修改带注释版本 {filename}.js
3. 自动生成无注释版本 {filename}-no-comments.js
4. 告知用户两个文件的路径
```

### 示例
```
修改完成，已生成两个版本：
- 带注释版：/path/to/config.js（632 行）
- 无注释版：/path/to/config-no-comments.js（380 行）
```
