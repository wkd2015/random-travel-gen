## Random Travel Generator - Product & Execution Plan

### 1. Product Vision

**一句话：**  
用“扔飞镖选目的地”的轻量玩法，拉全球自然流量，承接到 AI 旅行规划和出行决策，形成订阅 + 联盟佣金的长期现金流。

**核心定位：**  
AI 驱动的随机旅行灵感 + 行程规划工具，面向全球用户，多语言、强分享属性，适合 TikTok / Reels / 小红书 等社媒传播。

---

### 2. Business Model Overview

**整体闭环：**  
免费随机目的地工具拉流量 → 引导用户生成/管理旅行行程（AI+协作）→ 行程页和目的地卡片上承接订阅和联盟跳转。

#### 2.1 免费层（Traffic + Top of Funnel）

- 免费功能：
  - 随机目的地生成（当前 MVP 已具备）
  - 按国家 / Vibe 过滤（city / beach / island / nature / culture 等）
  - 基础 Wiki 摘要 + 简短 AI 旅行建议（成本可控）
- 目标：
  - 覆盖多语言、多国家的长尾 SEO（programmatic SEO）
  - 变成“随机旅行”类梗图工具，方便用户截图 / 分享
  - 收集用户登录/邮箱，为后续订阅做铺垫

#### 2.2 订阅收入（主力：AI Travel Planner SaaS）

**定位：** AI 旅行规划 SaaS，服务“有一定预算、愿意为省时间/省心买单”的出行用户。

- **免费版：**
  - 每日 N 次随机目的地生成
  - 基础 Wiki / 简要 AI 预算提示

- **Pro / Plus 订阅（$5–15/月，待市场验证）：**
  - AI 行程规划器：
    - 一键生成 3 / 5 / 7 天行程（含景点顺序、交通方式、时间大致分配）
    - 支持用户编辑、保存、多版本历史
    - 导出 PDF / Notion / 分享链接
  - 预算 & 住宿建议：
    - 按“便宜 / 适中 / 昂贵”给出 rough budget
    - 拆分机票 / 住宿 / 吃喝/门票等
  - 多人协作行程板：
    - 分享链接给同行者，支持多人一起编辑 & 评论（Figma 式体验）
  - 收藏 & 历史：
    - 收藏喜欢的随机目的地
    - 生成 wish‑list / bucket list
  - 性能权益：
    - 更高调用额度
    - 更快响应 & 更好模型

**产品呈现：**

- 在结果卡片 & 行程页上显眼位置放：
  - 「Unlock full AI planner」
  - 「Generate 7‑day itinerary with AI」

#### 2.3 联盟佣金（线性收入，早期无须自建支付）

通过推荐机票、酒店、保险、eSIM 等获取联盟佣金，无需自建交易系统：

- 机票/酒店联盟：
  - Skyscanner, Booking, Agoda, Trip.com 等
  - 在目的地卡片 & 行程页中增加：
    - 「查机票」→ 跳转到带城巿和日期预填的搜索页（带 affiliate 标签）
    - 「查酒店」→ 跳转住宿搜索页
- 保险 / eSIM / City Pass：
  - WorldNomads / SafetyWing / Airalo / Klook 等
  - 在城市页/行程页底部增加「旅行必备」模块，统一曝光

**角色分工：**

- 工具：负责种草 & 帮用户做决策（去哪、玩什么、预算多少）
- 联盟平台：负责下单、履约和售后

#### 2.4 B2B / 高客单补充（后期）

当有一定流量和口碑后，可以探索高客单侧收入：

- 嵌入式小组件（Embed / White‑label）：
  - 提供「随机目的地生成器」小组件（iFrame / SDK）
  - 销售给旅游博客、OTA、青旅/背包客网站
- 定制线路 / 导游撮合（手动起步）：
  - 在热门城市增加「需要本地定制行程？」入口
  - 手动把需求转给当地旅行社/导游，收撮合服务费

---

### 3. Execution Roadmap（按优先级）

#### Phase 0（已完成）— Core MVP

- ✅ Supabase
  - countries / destinations 表
  - get_random_destination(target_country, target_level) 函数
  - 种子数据（US / CN / JP / FR / TH × 城市）
- ✅ Backend
  - `/api/random-destination` → 调 Supabase RPC，返回目的地
  - `/api/ai/insights` → OpenAI SDK，返回简短旅行建议
- ✅ Frontend
  - `RandomizerMap`（MapLibre + react-map-gl）：
    - 初始全球视角
    - 3 次随机飞行 + 最终飞到目标城市
    - 中心雷达/十字线效果
  - `DestinationResultCard`：
    - Header：城市（EN + 本地名）+ Unsplash 图
    - Wiki Tab：Rest API 拉 Wikipedia 摘要
    - AI Insights Tab：调用 `/api/ai/insights`
  - `HomeClient` / 首页：
    - Country / Vibe 选择
    - “Throw a dart 🎯” 按钮
    - 地图 + 结果卡片一体化体验

---

### 4. Phase 1 — SEO & i18n（优先级最高）

**目标：把现在的 MVP 变成一个可以持续吸流的 programmatic SEO 资产。**

#### 4.1 多语言路由结构

- 路由规范：
  - `/[lang]/generator/[country]`
    - `lang`：`en` / `zh` / `ja` / `fr` / `th` / `es` …（先从 2–3 个语言起）
    - `country`：`global` / `us` / `cn` / `jp` / `fr` / `th` …
- 行为：
  - 根据 `[country]` 预填国家选择
  - 根据 `[lang]` 切换：
    - UI 文案（最小可行：标题、副标题、多语言 metadata）
    - Wikipedia 语言源（`https://${lang}.wikipedia.org/...`）
    - AI 提示词语言

#### 4.2 每页动态 Metadata + JSON-LD

- 对每个 `/[lang]/generator/[country]`：
  - `export const metadata`：
    - title：包含“Random Travel”、“Generator”、“国家名”等关键词
    - description：简要描述玩法 & 国家
    - Open Graph / Twitter 卡片信息
  - JSON-LD：
    - 使用 `WebApplication` / `Article` / `Place` schema：
      - name：`${Country} Random Travel Generator`
      - description
      - url：当前页面 URL
      - inLanguage：`lang`

#### 4.3 sitemap.xml & robots.txt

- `app/sitemap.ts`：
  - 包含：
    - 主站 `/`
    - 各语言的 `/[lang]/generator/global`
    - 热门国家组合：`/[lang]/generator/{us,cn,jp,fr,th,...}`
  - 后期可以根据 Supabase 中 `countries` 动态生成。
- `app/robots.txt`：
  - 允许所有常见搜索引擎抓取
  - 指定 `Sitemap: https://domain.com/sitemap.xml`

**交付成果：**

- 新增 `src/app/[lang]/generator/[country]/page.tsx`
- 更新 `metadata` 逻辑 & sitemap/robots
- 原 `/` 可以做简单重定向到 `/en/generator/global` 或做 landing + CTA。

---

### 5. Phase 2 — UI & UX Polish（中优先级）

**目标：让工具视觉更“Instagrammable”，提升分享欲 & 转化率。**

#### 5.1 Shadcn 控件替换

- 用 Shadcn/UI 替换：
  - Country Picker → `Select` + Flag + Localized label
  - Vibe Picker → `Select` 或 `ToggleGroup`
  - 主 CTA 按钮 → `Button`（加渐变/光效）
  - 移动端过滤器 → `Sheet`/`Drawer`

#### 5.2 Toast & 错误反馈

- 引入 `sonner` 或类似库：
  - Supabase RPC 失败 → toast：“No destination found, try again.”
  - OpenAI 失败 → toast：“AI is overloaded, please retry in a few seconds.”
  - 网络错误 → toast：“Network issue, check your connection.”

#### 5.3 分享体验

- 结果卡片增加：
  - “Copy link” / “Share” 按钮（Web Share API）
  - 社媒分享 meta（配合 OG image，后期可以做 OG 图自动生成）

---

### 6. Phase 3 — AI Planner & Monetization Hooks（中高优先级）

**目标：从“好玩工具”进化成 “愿意付费的旅行助手”，并预埋盈利入口。**

#### 6.1 AI 行程规划 MVP

- 新增页面（例如）：`/[lang]/plan/[citySlug]`
  - 从结果卡片的 “Plan a trip to {city}” 进入
  - 调用 OpenAI 生成 3/5/7 天行程，结构化渲染（按天分卡片）
  - 支持用户简单编辑说明文字

- 逻辑：
  - 输入：出发地（可选）、预算层级、天数、偏好（城市/自然/美食等）
  - 输出：行程列表 + 简要预算描述

#### 6.2 订阅位预埋（不急着真收费）

- 在行程页 & 结果卡片显眼位置放：
  - 「Unlock full AI planner（Pro）」按钮
  - 文案说明：更多生成次数、更详细规划、多日行程、多端同步等
- 早期可以：
  - 仅做「加入候补名单（Waitlist）」→ 收集邮箱/意向
  - 后续再接 Supabase Auth + 付费集成（Lemon Squeezy）

#### 6.3 联盟按钮骨架

- 在结果卡片 & 行程页添加按钮占位：
  - 「Search flights to {city}」
  - 「Search hotels in {city}」
  - 「Travel essentials」区块（eSIM / 保险 / City Pass）
- 早期可以先跳到通用搜索页（无 affiliate），等申请通过后替换为联盟链接。

---

### 7. Phase 4 — Streaming AI & Advanced Features（后期优化）

#### 7.1 Streaming AI Insights

- 使用 Vercel AI SDK 或原生 `ReadableStream`：
  - `/api/ai/insights` 改为流式返回
  - 前端在卡片的 AI Tab 中「一字一字打字」式展示

#### 7.2 个性化推荐 & 数据闭环

- 根据用户历史：
  - 常选国家 / Vibe → 提前排序/推荐
  - 收藏与历史 → 生成「年度旅行报告」之类的 viral 内容

#### 7.3 多终端与导出

- 导出/同步：
  - Notion / Google Docs / PDF
  - 分享只读链接，适配手机端浏览

---

### 8. 推荐执行顺序（简表）

1. **Phase 1：SEO & i18n（优先级最高）**
   - 路由：`/[lang]/generator/[country]`
   - 动态 metadata + JSON-LD
   - sitemap.xml & robots.txt
2. **Phase 2：UI & UX Polish**
   - Shadcn UI 替换基础控件
   - sonner toast + 分享按钮
3. **Phase 3：AI Planner & 盈利入口**
   - 简单 AI 行程页
   - Pro 订阅位预埋（Waitlist）
   - 机票/酒店等联盟按钮骨架
4. **Phase 4：Streaming & 高级特性**
   - Streaming AI
   - 更细致的个性化和数据闭环


