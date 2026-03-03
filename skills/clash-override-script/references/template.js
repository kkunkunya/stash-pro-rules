/**
 * Clash/Mihomo 覆写脚本完整模板
 *
 * 功能：
 * - 地区节点自动分组（正则匹配）
 * - 链式代理支持（dialer-proxy 方式）
 * - AI/谷歌服务分流
 * - DNS 优化配置
 */

function main(config) {
  config = config || {};
  const proxies = Array.isArray(config.proxies) ? config.proxies : [];

  // ========================================
  // 基础配置
  // ========================================

  const MAIN_PROXY = "🚀 主力代理";
  const TEST_URL = "https://www.gstatic.com/generate_204";
  const TEST_INTERVAL = 300;
  const TEST_TOLERANCE = 50;

  const allNodeNames = proxies.map((p) => p?.name).filter(Boolean);

  // ========================================
  // 链式代理节点配置
  // ========================================

  // 落地机节点（直连，用于测试）
  const RESIDENTIAL_NODE = {
    name: "🏠 落地机",
    type: "socks5",
    server: "YOUR_SERVER_IP",      // 替换为落地机 IP
    port: 443,                      // 替换为落地机端口
    username: "YOUR_USERNAME",      // 替换为用户名
    password: "YOUR_PASSWORD",      // 替换为密码
    tls: false,
    "skip-cert-verify": true,
  };

  // 链式代理节点（通过指定代理组连接落地机）
  const CHAIN_PROXY_NODE = {
    name: "🔗 链式代理",
    type: "socks5",
    server: "YOUR_SERVER_IP",
    port: 443,
    username: "YOUR_USERNAME",
    password: "YOUR_PASSWORD",
    tls: false,
    "skip-cert-verify": true,
    "dialer-proxy": "🇺🇸 美国节点",  // 关键：指定第一跳代理组
  };

  config.proxies = config.proxies || [];
  config.proxies.push(RESIDENTIAL_NODE);
  config.proxies.push(CHAIN_PROXY_NODE);

  const CHAIN_PROXY_NAME = "🔗 链式代理";

  // ========================================
  // 地区节点分组
  // ========================================

  const REGION_PATTERNS = {
    "🇭🇰 香港节点": /(港|HK|Hong\s*Kong|HongKong|hongkong|深港)/i,
    "🇺🇸 美国节点": /(美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|\bUS\b|United\s*States)/i,
    "🇯🇵 日本节点": /(日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\bJP\b|Japan)/i,
    "🇸🇬 新加坡节点": /(新加坡|坡|狮城|\bSG\b|Singapore)/i,
    "🇼🇸 台湾节点": /(台|新北|彰化|\bTW\b|Taiwan|台灣|臺灣)/i,
    "🇰🇷 韩国节点": /(KR|Korea|KOR|首尔|韩|韓)/i,
  };

  // 构建代理组函数
  const buildUrlTest = (name, list) => ({
    name,
    type: "url-test",
    url: TEST_URL,
    interval: TEST_INTERVAL,
    tolerance: TEST_TOLERANCE,
    proxies: list,
  });

  const buildLoadBalance = (name, list) => ({
    name,
    type: "load-balance",
    strategy: "round-robin",
    url: TEST_URL,
    interval: TEST_INTERVAL,
    proxies: list,
  });

  const buildSelect = (name, list) => ({
    name,
    type: "select",
    proxies: list,
  });

  // 生成地区分组
  const regionGroups = [];
  Object.entries(REGION_PATTERNS).forEach(([baseName, re]) => {
    const matched = allNodeNames.filter((n) => re.test(n));
    if (matched.length > 0) {
      // 美国节点用 url-test，其他用 load-balance
      const group = baseName === "🇺🇸 美国节点"
        ? buildUrlTest(baseName, matched)
        : buildLoadBalance(baseName, matched);
      regionGroups.push(group);
    }
  });

  const REGION_GROUP_NAMES = regionGroups.map((g) => g.name);

  // ========================================
  // 功能策略组
  // ========================================

  // 自动选择组
  const autoSelectGroup = allNodeNames.length > 0
    ? buildUrlTest("♻️ 自动选择", allNodeNames)
    : buildSelect("♻️ 自动选择", ["DIRECT"]);

  // 主力代理组
  const manualSelectGroup = {
    name: MAIN_PROXY,
    type: "select",
    proxies: ["♻️ 自动选择", ...REGION_GROUP_NAMES, ...allNodeNames],
  };

  // 直连组
  const directGroup = {
    name: "🎯 全球直连",
    type: "select",
    proxies: ["DIRECT"],
  };

  // 功能组配置
  const FEATURE_GROUPS = [
    { name: "💬 即时通讯" },
    { name: "🌐 社交媒体" },
    { name: "🚀 GitHub", extra: ["🎯 全球直连"] },
    // AI 服务：链式代理优先，禁止直连
    { name: "🤖 ChatGPT", useChain: true, forbidDirect: true },
    { name: "🤖 Copilot", useChain: true, forbidDirect: true },
    { name: "🤖 AI服务", useChain: true, forbidDirect: true },
    { name: "📢 谷歌FCM", useChain: true, extra: ["🎯 全球直连"] },
    { name: "🇬 谷歌服务", useChain: true },
    { name: "📹 YouTube" },
    { name: "🎶 TikTok", extra: ["🎯 全球直连"] },
    { name: "🍎 苹果服务", extra: ["🎯 全球直连"] },
    { name: "Ⓜ️ 微软服务", extra: ["🎯 全球直连"] },
  ];

  const featureGroups = FEATURE_GROUPS.map(
    ({ name, extra = [], forbidDirect = false, useChain = false }) => {
      const baseList = [
        ...(useChain ? [CHAIN_PROXY_NAME] : []),
        ...REGION_GROUP_NAMES,
        MAIN_PROXY,
        "♻️ 自动选择",
        ...extra,
      ];
      const proxiesList = forbidDirect
        ? baseList
        : [...baseList, "🎯 全球直连"];
      return {
        name,
        type: "select",
        proxies: [...new Set(proxiesList)],
      };
    }
  );

  // 兜底组
  const fallbackGroup = {
    name: "🐟 漏网之鱼",
    type: "select",
    proxies: [MAIN_PROXY, "🎯 全球直连"],
  };

  // 汇总 proxy-groups
  config["proxy-groups"] = [
    manualSelectGroup,
    autoSelectGroup,
    ...featureGroups,
    ...regionGroups,
    directGroup,
    fallbackGroup,
  ];

  // ========================================
  // 分流规则
  // ========================================

  const R = [];

  // 私有网络直连
  R.push("GEOSITE,private,🎯 全球直连");
  R.push("GEOIP,private,🎯 全球直连,no-resolve");

  // AI 服务（高优先级）
  R.push("DOMAIN-SUFFIX,openai.com,🤖 ChatGPT");
  R.push("DOMAIN-SUFFIX,chatgpt.com,🤖 ChatGPT");
  R.push("GEOSITE,openai,🤖 ChatGPT");
  R.push("GEOSITE,bing,🤖 Copilot");
  R.push("DOMAIN-SUFFIX,gemini.google.com,🤖 AI服务");
  R.push("GEOSITE,category-ai-!cn,🤖 AI服务");

  // 谷歌服务
  R.push("DOMAIN-SUFFIX,google.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googleapis.com,🇬 谷歌服务");
  R.push("GEOSITE,google,🇬 谷歌服务");
  R.push("GEOSITE,youtube,🇬 谷歌服务");

  // 其他服务
  R.push("GEOSITE,github,🚀 GitHub");
  R.push("GEOSITE,tiktok,🎶 TikTok");
  R.push("GEOSITE,apple,🍎 苹果服务");
  R.push("GEOSITE,microsoft,Ⓜ️ 微软服务");

  // GFW 列表
  R.push("GEOSITE,gfw," + MAIN_PROXY);

  // 中国直连
  R.push("GEOSITE,cn,🎯 全球直连");
  R.push("GEOIP,cn,🎯 全球直连,no-resolve");

  // 兜底
  R.push("MATCH,🐟 漏网之鱼");

  config.rules = R;

  // ========================================
  // DNS 配置
  // ========================================

  config.dns = {
    enable: true,
    "enhanced-mode": "fake-ip",
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    nameserver: ["223.5.5.5", "119.29.29.29", "8.8.8.8"],
    fallback: [
      "https://dns.cloudflare.com/dns-query",
      "https://dns.google/dns-query",
    ],
    "fallback-filter": {
      geoip: true,
      "geoip-code": "CN",
      geosite: ["gfw", "geolocation-!cn"],
    },
    "fake-ip-filter": [
      "+.lan",
      "+.local",
      "time.*.com",
      "ntp.*.com",
      "+.market.xiaomi.com",
    ],
  };

  return config;
}
