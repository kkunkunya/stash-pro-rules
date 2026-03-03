function main(config) {
  config = config || {};
  const proxies = Array.isArray(config.proxies) ? config.proxies : [];

  const options = config.__options || {};
  const parseBool = (v) =>
    typeof v === "boolean"
      ? v
      : typeof v === "string"
      ? v.toLowerCase() === "true" || v === "1"
      : false;

  const LOAD_BALANCE = true;

  const IPV6 = parseBool(options.ipv6) || false;
  const FULL = parseBool(options.full) || false;
  const KEEPALIVE = parseBool(options.keepalive) || false;

  const FAKEIP = true;

  const MAIN_PROXY = "🚀 主力代理";

  const TEST_URL = "https://www.gstatic.com/generate_204";
  const TEST_INTERVAL = 250;
  const TEST_TOLERANCE = 50;

  const LB_TIMEOUT = 5000;
  const LB_MAX_FAILED_TIMES = 3;

  const allNodeNames = (proxies || []).map((p) => p?.name).filter(Boolean);

  const RESIDENTIAL_NODE = {
    name: "🏠 落地机",
    type: "socks5",
    server: "216.132.151.246",
    port: 443,
    username: "XXLSwBwOWqxJ",
    password: "yuy3xeYrc3",
    tls: false,
    "skip-cert-verify": true,
  };

  const CHAIN_PROXY_NODE = {
    name: "🔗 链式代理",
    type: "socks5",
    server: "216.132.151.246",
    port: 443,
    username: "XXLSwBwOWqxJ",
    password: "yuy3xeYrc3",
    tls: false,
    "skip-cert-verify": true,
    "dialer-proxy": "🇺🇸 美国节点",
  };

  config.proxies = config.proxies || [];
  config.proxies.push(RESIDENTIAL_NODE);
  config.proxies.push(CHAIN_PROXY_NODE);

  const REGION_PATTERNS = {
    "🇭🇰 香港节点": /(港|HK|Hong\s*Kong|HongKong|hongkong|深港)/i,
    "🇺🇸 美国节点":
      /(美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|\bUS\b|United\s*States|UnitedStates)/i,
    "🇯🇵 日本节点": /(日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\bJP\b|Japan|🇯🇵)/i,
    "🇸🇬 新加坡节点": /(新加坡|坡|狮城|\bSG\b|Singapore)/i,
    "🇼🇸 台湾节点": /(台|新北|彰化|\bTW\b|Taiwan|台灣|臺灣)/i,
    "🇰🇷 韩国节点": /(KR|Korea|KOR|首尔|韩|韓|Korea)/i,
    "🇨🇦 加拿大节点": /(加拿大|Canada|渥太华|温哥华|卡尔加里)/i,
    "🇬🇧 英国节点": /(英国|Britain|United\s*Kingdom|England|伦敦)/i,
    "🇫🇷 法国节点": /(法国|France|巴黎)/i,
    "🇩🇪 德国节点": /(德国|Germany|柏林|法兰克福)/i,
    "🇳🇱 荷兰节点": /(荷兰|Netherlands|阿姆斯特丹)/i,
    "🇹🇷 土耳其节点": /(土耳其|Turkey|Türkiye)/i,
    "🇷🇺 俄罗斯节点":
      /(俄罗斯|俄国|Russia|RU|莫斯科|圣彼得堡|西伯利亚|KHV|Rossiya|🇷🇺)/i,
    "🇮🇳 印度节点":
      /(印度|India|IND|孟买|Mumbai|新德里|New\s*Delhi|🇮🇳)/i,
    "🏠 家宽节点": /(家宽|家庭宽带|住宅)/i,
  };

  const REGION_KEYWORD_UNION = new RegExp(
    Object.values(REGION_PATTERNS)
      .map((re) => re.source)
      .join("|"),
    "i"
  );

  const buildUrlTest = (name, list) => {
    if (!list || !list.length) return null;
    return {
      name,
      type: "url-test",
      url: TEST_URL,
      interval: TEST_INTERVAL,
      tolerance: TEST_TOLERANCE,
      proxies: list,
    };
  };

  const buildLoadBalance = (name, list) => {
    if (!list || !list.length) return null;
    return {
      name,
      type: "load-balance",
      strategy: "round-robin",
      url: TEST_URL,
      interval: TEST_INTERVAL,
      timeout: LB_TIMEOUT,
      "max-failed-times": LB_MAX_FAILED_TIMES,
      proxies: list,
    };
  };

  const buildSelect = (name, list) => {
    if (!list || !list.length) return null;
    return {
      name,
      type: "select",
      proxies: list,
    };
  };

  const regionGroups = [];
  Object.entries(REGION_PATTERNS).forEach(([baseName, re]) => {
    const all = allNodeNames.filter((n) => re.test(n));
    if (!all.length) return;

    const group =
      baseName === "🇺🇸 美国节点"
        ? buildUrlTest(baseName, all)
        : LOAD_BALANCE
        ? buildLoadBalance(baseName, all)
        : buildUrlTest(baseName, all);

    if (group) regionGroups.push(group);
  });
  const REGION_GROUP_NAMES = regionGroups.map((g) => g.name);

  const HK_GROUP = "🇭🇰 香港节点";
  const hkGroupName = REGION_GROUP_NAMES.includes(HK_GROUP)
    ? HK_GROUP
    : MAIN_PROXY;
  const US_GROUP = "🇺🇸 美国节点";
  const usGroupName = REGION_GROUP_NAMES.includes(US_GROUP)
    ? US_GROUP
    : MAIN_PROXY;

  const othersAll = allNodeNames.filter((n) => !REGION_KEYWORD_UNION.test(n));
  const othersGroup = buildSelect("🌐 其他地区", othersAll);
  const OTHER_GROUP_NAMES = othersGroup ? [othersGroup.name] : [];

  const autoSelectGroup =
    allNodeNames.length > 0
      ? {
          name: "♻️ 自动选择",
          type: "url-test",
          url: TEST_URL,
          interval: TEST_INTERVAL,
          tolerance: TEST_TOLERANCE,
          proxies: allNodeNames,
        }
      : {
          name: "♻️ 自动选择",
          type: "select",
          proxies: ["DIRECT"],
        };

  const manualSelectGroup = {
    name: MAIN_PROXY,
    type: "select",
    proxies: [
      "♻️ 自动选择",
      ...REGION_GROUP_NAMES,
      ...OTHER_GROUP_NAMES,
      ...allNodeNames,
    ],
  };

  const directGroup = {
    name: "🎯 全球直连",
    type: "select",
    proxies: ["DIRECT"],
  };

  const CHAIN_PROXY_NAME = "🔗 链式代理";

  const FEATURE_GROUPS = [
    { name: "💬 即时通讯" },
    { name: "🌐 社交媒体" },
    { name: "🚀 GitHub", extra: ["🎯 全球直连"] },
    { name: "🤖 ChatGPT", useChain: true, forbidDirect: true },
    { name: "🤖 Copilot", useChain: true, forbidDirect: true },
    { name: "🤖 AI服务", useChain: true, forbidDirect: true },
    { name: "🎶 TikTok", extra: ["🎯 全球直连"] },
    { name: "📹 YouTube" },
    { name: "🏀 NBA" },
    { name: "🍎 Apple Intelligence", useChain: true, extra: ["🎯 全球直连"] },
    { name: "🍎 苹果服务", extra: ["🎯 全球直连"] },
    { name: "Ⓜ️ 微软服务", extra: ["🎯 全球直连"] },
    { name: "📢 谷歌FCM", useChain: true, extra: ["🎯 全球直连"] },
    { name: "🇬 谷歌服务", useChain: true },
    { name: "💾 OneDrive" },
    { name: "🎻 Spotify" },
    { name: "🎥 Emby" },
    { name: "🎮 Steam" },
    { name: "🎮 游戏平台" },
    { name: "🌎 国外媒体" },
    { name: "⏬ PT站点", extra: ["🎯 全球直连"] },
    { name: "💳 PayPal", extra: ["🎯 全球直连"] },
    { name: "🛒 国外电商" },
    { name: "🚀 测速工具", extra: ["🎯 全球直连"] },
  ];

  const featureGroups = FEATURE_GROUPS.map(
    ({ name, extra = [], forbidDirect = false, useChain = false }) => {
      const baseList = [
        ...(useChain ? [CHAIN_PROXY_NAME] : []),
        ...REGION_GROUP_NAMES,
        ...OTHER_GROUP_NAMES,
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

  const nonStdPortGroup = {
    name: "🔀 非标端口",
    type: "select",
    proxies: ["🎯 全球直连", MAIN_PROXY],
  };
  const fallbackGroup = {
    name: "🐟 漏网之鱼",
    type: "select",
    proxies: [MAIN_PROXY, "🎯 全球直连"],
  };

  config["proxy-groups"] = [
    manualSelectGroup,
    autoSelectGroup,
    ...featureGroups,
    ...regionGroups,
    ...(othersGroup ? [othersGroup] : []),
    directGroup,
    nonStdPortGroup,
    fallbackGroup,
  ];

  config["rule-providers"] = {
    Custom_Direct_Classical: {
      type: "http",
      behavior: "classical",
      path: "ruleset/Custom_Direct_Classical.yaml",
      url: "https://testingcf.jsdelivr.net/gh/Aethersailor/Custom_OpenClash_Rules@main/rule/Custom_Direct_Classical.yaml",
      interval: 28800,
    },
    Custom_Proxy_Classical: {
      type: "http",
      behavior: "classical",
      path: "ruleset/Custom_Proxy_Classical.yaml",
      url: "https://testingcf.jsdelivr.net/gh/Aethersailor/Custom_OpenClash_Rules@main/rule/Custom_Proxy_Classical.yaml",
      interval: 28800,
    },
    Steam_CDN_Classical: {
      type: "http",
      behavior: "classical",
      path: "ruleset/Steam_CDN_Classical.yaml",
      url: "https://testingcf.jsdelivr.net/gh/Aethersailor/Custom_OpenClash_Rules@main/rule/Steam_CDN_Classical.yaml",
      interval: 2880,
    },
    Custom_Port_Direct: {
      type: "http",
      behavior: "classical",
      path: "ruleset/Custom_Port_Direct.yaml",
      url: "https://testingcf.jsdelivr.net/gh/Aethersailor/Custom_OpenClash_Rules@main/rule/Custom_Port_Direct.yaml",
      interval: 28800,
    },
  };

  const R = [];

  R.push("GEOSITE,private,🎯 全球直连");
  R.push("GEOIP,private,🎯 全球直连,no-resolve");
  R.push("RULE-SET,Custom_Direct_Classical,🎯 全球直连");

  R.push("DOMAIN,ab.chatgpt.com,🤖 ChatGPT");
  R.push("DOMAIN,android.chat.openai.com,🤖 ChatGPT");
  R.push("DOMAIN,ios.chat.openai.com,🤖 ChatGPT");
  R.push("DOMAIN,chat.openai.com,🤖 ChatGPT");
  R.push("DOMAIN,api.openai.com,🤖 ChatGPT");
  R.push("DOMAIN,auth.openai.com,🤖 ChatGPT");
  R.push("DOMAIN,auth0.openai.com,🤖 ChatGPT");
  R.push("DOMAIN,cdn.oaistatic.com,🤖 ChatGPT");
  R.push("DOMAIN,chat.openai.com.cdn.cloudflare.net,🤖 ChatGPT");
  R.push("DOMAIN-SUFFIX,chatgpt.com,🤖 ChatGPT");
  R.push("DOMAIN-SUFFIX,openai.com,🤖 ChatGPT");
  R.push("DOMAIN-SUFFIX,oaistatic.com,🤖 ChatGPT");
  R.push("DOMAIN-SUFFIX,oaiusercontent.com,🤖 ChatGPT");
  R.push("DOMAIN-SUFFIX,openaiapi-site.azureedge.net,🤖 ChatGPT");

  R.push("DOMAIN,accounts.google.com,🤖 AI服务");
  R.push("DOMAIN,oauth2.googleapis.com,🤖 AI服务");

  R.push("DOMAIN,cloudcode-pa.googleapis.com,🤖 AI服务");
  R.push("DOMAIN,cloudaicompanion.googleapis.com,🤖 AI服务");
  R.push("DOMAIN,serviceusage.googleapis.com,🤖 AI服务");
  R.push("DOMAIN,cloudresourcemanager.googleapis.com,🤖 AI服务");
  R.push("DOMAIN,people.googleapis.com,🤖 AI服务");
  R.push("DOMAIN,firebaselogging-pa.googleapis.com,🤖 AI服务");

  R.push("DOMAIN,generativelanguage.googleapis.com,🤖 AI服务");

  R.push("DOMAIN,aiplatform.googleapis.com,🤖 AI服务");

  R.push("DOMAIN-SUFFIX,gemini.google.com,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,aistudio.google.com,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,makersuite.google.com,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,alkalimakersuite-pa.clients6.google.com,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,proactivebackend-pa.googleapis.com,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,bard.google.com,🤖 AI服务");

  R.push("DOMAIN-SUFFIX,geller-pa.googleapis.com,🤖 AI服务");
  R.push("DOMAIN,alkalicore-pa.clients6.google.com,🤖 AI服务");
  R.push("DOMAIN,ai.google.dev,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,generativeai.google,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,gemini.google,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,deepmind.com,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,deepmind.google,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,apis.google.com,🤖 AI服务");
  R.push("DOMAIN,play.googleapis.com,🤖 AI服务");

  R.push("DOMAIN-SUFFIX,manus.im,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,manus.ai,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,manus.com,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,manus.space,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,manuscdn.com,🤖 AI服务");
  R.push("DOMAIN-SUFFIX,butterfly-effect.dev,🤖 AI服务");
  R.push("DOMAIN-KEYWORD,manus,🤖 AI服务");

  R.push("GEOSITE,openai,🤖 ChatGPT");
  R.push("GEOSITE,bing,🤖 Copilot");
  R.push("GEOSITE,category-ai-!cn,🤖 AI服务");

  R.push("DOMAIN,mtalk.google.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,talk.google.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,xmpp.google.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,gcm.googleapis.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,fcm.googleapis.com,🇬 谷歌服务");

  R.push("DOMAIN-SUFFIX,google.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,google.com.hk,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,google.co.jp,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googleapis.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googlevideo.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googleusercontent.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,gstatic.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,ggpht.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,gvt1.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,gvt2.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,gvt3.com,🇬 谷歌服务");

  R.push("DOMAIN-SUFFIX,youtube.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,ytimg.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,youtu.be,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,yt.be,🇬 谷歌服务");

  R.push("DOMAIN-SUFFIX,googlesyndication.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googleadservices.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googletagmanager.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googletagservices.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,google-analytics.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,doubleclick.net,🇬 谷歌服务");

  R.push("DOMAIN-SUFFIX,withgoogle.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,appspot.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,android.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,chromium.org,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,chrome.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googlesource.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,googlecode.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,blogger.com,🇬 谷歌服务");
  R.push("DOMAIN-SUFFIX,blogspot.com,🇬 谷歌服务");

  R.push("GEOSITE,googlefcm,🇬 谷歌服务");
  R.push("GEOSITE,google,🇬 谷歌服务");
  R.push("GEOSITE,youtube,🇬 谷歌服务");
  R.push("DOMAIN-KEYWORD,google,🇬 谷歌服务");

  R.push("RULE-SET,Custom_Proxy_Classical," + MAIN_PROXY);

  R.push("GEOSITE,google-cn,🎯 全球直连");
  R.push("GEOSITE,category-games@cn,🎯 全球直连");
  R.push("RULE-SET,Steam_CDN_Classical,🎯 全球直连");
  R.push("GEOSITE,category-game-platforms-download,🎯 全球直连");
  R.push("GEOSITE,category-public-tracker,🎯 全球直连");

  R.push("GEOSITE,category-communication,💬 即时通讯");
  R.push("GEOSITE,category-social-media-!cn,🌐 社交媒体");

  R.push("GEOSITE,onedrive,💾 OneDrive");
  R.push("GEOSITE,github,🚀 GitHub");
  R.push("GEOSITE,category-speedtest,🚀 测速工具");
  R.push("GEOSITE,steam,🎮 Steam");

  R.push("DOMAIN,watch.nba.com,🏀 NBA");
  R.push("DOMAIN-SUFFIX,nba.com,🏀 NBA");
  R.push("DOMAIN-SUFFIX,18comic.vip," + hkGroupName);
  R.push("DOMAIN-SUFFIX,gamsgo.com," + usGroupName);
  R.push("DOMAIN-SUFFIX,gamsgo.net," + usGroupName);
  R.push("DOMAIN-SUFFIX,gamsgo2.com," + usGroupName);
  R.push("DOMAIN-SUFFIX,gamsgocdn.com," + usGroupName);

  // Apple Intelligence / Private Cloud Compute
  R.push("DOMAIN,apple-relay.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,apple-relay.cloudflare.com,🍎 Apple Intelligence");
  R.push("DOMAIN,apple-relay.fastly-edge.com,🍎 Apple Intelligence");
  R.push("DOMAIN,cp4.cloudflare.com,🍎 Apple Intelligence");
  R.push("DOMAIN,cp10.cloudflare.com,🍎 Apple Intelligence");

  // Siri 后端
  R.push("DOMAIN,guzzoni.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,api-glb-sea.smoot.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN-SUFFIX,smoot.apple.com,🍎 Apple Intelligence");

  // iCloud Private Relay
  R.push("DOMAIN,mask-api.fe.apple-dns.net,🍎 Apple Intelligence");
  R.push("DOMAIN,mask-api.icloud.com,🍎 Apple Intelligence");
  R.push("DOMAIN,mask-t.apple-dns.net,🍎 Apple Intelligence");
  R.push("DOMAIN,mask.apple-dns.net,🍎 Apple Intelligence");
  R.push("DOMAIN,canary.mask.apple-dns.net,🍎 Apple Intelligence");
  R.push("DOMAIN,mask-canary.icloud.com,🍎 Apple Intelligence");
  R.push("DOMAIN-SUFFIX,mask-h2.icloud.com,🍎 Apple Intelligence");
  R.push("DOMAIN-SUFFIX,mask.icloud.com,🍎 Apple Intelligence");

  // Apple News
  R.push("DOMAIN,news-assets.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,news-client.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,news-edge.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,news-events.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,news-client-search.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,gspe1-ssl.ls.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN-SUFFIX,apple.news,🍎 Apple Intelligence");

  // TestFlight / Apple Developer
  R.push("DOMAIN,testflight.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,developer.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,devimages-cdn.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,devstreaming-cdn.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,docs-assets.developer.apple.com,🍎 Apple Intelligence");

  // Apple TV+
  R.push("DOMAIN,tv.applemusic.com,🍎 Apple Intelligence");
  R.push("DOMAIN,hls-svod.itunes.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,np-edge.itunes.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,play-edge.itunes.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN,uts-api.itunes.apple.com,🍎 Apple Intelligence");
  R.push("DOMAIN-SUFFIX,tv.apple.com,🍎 Apple Intelligence");

  // Apple 通用（在 Intelligence 之后）
  R.push("GEOSITE,apple,🍎 苹果服务");
  R.push("GEOSITE,microsoft,Ⓜ️ 微软服务");
  R.push("GEOSITE,tiktok,🎶 TikTok");

  R.push("GEOSITE,category-emby,🎥 Emby");
  R.push("GEOSITE,spotify,🎻 Spotify");
  R.push("GEOSITE,category-games,🎮 游戏平台");
  R.push("GEOSITE,category-entertainment,🌎 国外媒体");
  R.push("GEOSITE,category-pt,⏬ PT站点");
  R.push("GEOSITE,paypal,💳 PayPal");
  R.push("GEOSITE,category-ecommerce,🛒 国外电商");

  R.push("GEOSITE,gfw," + MAIN_PROXY);

  R.push("GEOIP,telegram,💬 即时通讯,no-resolve");
  R.push("GEOIP,twitter,🌐 社交媒体,no-resolve");
  R.push("GEOIP,facebook,🌐 社交媒体,no-resolve");

  R.push("GEOSITE,cn,🎯 全球直连");
  R.push("GEOIP,cn,🎯 全球直连,no-resolve");
  R.push("RULE-SET,Custom_Port_Direct,🔀 非标端口");

  R.push("MATCH,🐟 漏网之鱼");
  config.rules = R;

  config.sniffer = {
    sniff: {
      TLS: { ports: [443, 8443] },
      HTTP: { ports: [80, 8080, 8880] },
      QUIC: { ports: [443, 8443] },
    },
    "override-destination": false,
    enable: true,
    "force-dns-mapping": true,
    "skip-domain": ["Mijia Cloud", "dlg.io.mi.com", "+.push.apple.com"],
  };

  const dnsBase = {
    enable: true,
    ipv6: IPV6,
    "prefer-h3": true,
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    nameserver: ["223.5.5.5", "119.29.29.29", "8.8.8.8"],
    fallback: [
      "https://dns.cloudflare.com/dns-query",
      "https://dns.google/dns-query",
    ],
    "proxy-server-nameserver": ["223.5.5.5", "119.29.29.29"],
    "fallback-filter": {
      geoip: true,
      "geoip-code": "CN",
      geosite: ["gfw", "geolocation-!cn"],
      domain: [
        "+.google.com",
        "+.googleapis.com",
        "+.gvt1.com",
        "+.ggpht.com",
        "+.googlevideo.com",
      ],
      ipcidr: ["240.0.0.0/4"],
    },
  };

  config.dns = FAKEIP
    ? {
        ...dnsBase,
        "enhanced-mode": "fake-ip",
        "fake-ip-filter": [
          "+.lan",
          "+.local",
          "time.*.com",
          "ntp.*.com",
          "+.market.xiaomi.com",
          "+.msftconnecttest.com",
          "+.msftncsi.com",
        ],
      }
    : { ...dnsBase, "enhanced-mode": "redir-host" };

  config["geodata-mode"] = true;
  config["geox-url"] = {
    geoip:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat",
    geosite:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    mmdb:
      "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.metadb",
    asn: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb",
  };

  if (FULL) {
    Object.assign(config, {
      "mixed-port": 7890,
      "redir-port": 7892,
      "tproxy-port": 7893,
      "routing-mark": 7894,
      "allow-lan": true,
      ipv6: IPV6,
      mode: "rule",
      "unified-delay": true,
      "tcp-concurrent": true,
      "find-process-mode": "off",
      "log-level": "info",
      "geodata-loader": "standard",
      "external-controller": ":9999",
      "disable-keep-alive": !KEEPALIVE,
      profile: { "store-selected": true },
    });
  }

  return config;
}
