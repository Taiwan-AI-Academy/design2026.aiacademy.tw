# 2026 AI 賦能空間設計產業論壇 — 網站改造規格

**做法**：直接複製 `index.html` 改造，沿用既有 DOM 結構、CSS class 與 JS 邏輯
**原則**：**主視覺不動**、不新增元件、不新增色碼、CSS 幾乎不改，只換內容
**目標**：距活動 30 天，最快速度完成可上線的報名轉換頁

---

## 一、不動的部分

以下**完全保留、一行不改**：

- `#hero` 整段 — Design-1~4.svg 四層視差、`D-Logo-1`/`D-Logo-2` 標題組、黃底
- Design Logo Parallax JS
- 右側年份側標 `.year-fixed`
- 所有既有 CSS（除下列少數新增規則）
- Scroll reveal IntersectionObserver
- Lightbox 的 `.lb-*` 樣式與開闔／上下則切換 JS

---

## 二、逐區塊改造規格

### ① `nav.topnav`（行 1286–1294）

| 項目 | 現況 | 改為 |
|------|------|------|
| 連結 | 工作坊 / 講師 / FAQ | 議程 / 講者 / 活動資訊 / FAQ |
| 新增 | — | 尾端加一顆報名按鈕（沿用 `.more-link` 樣式：粉底白字） |

```html
<li><a href="#agenda">議程</a></li>
<li><a href="#speakers">講者</a></li>
<li><a href="#info">活動資訊</a></li>
<li><a href="#faq">FAQ</a></li>
<li><a class="more-link" href="https://neti.cc/OPqybX2"
       target="_blank" rel="noopener">報名</a></li>
```

> `.more-link` 原本是 `<button>`，用在 `<a>` 上需補 `text-decoration:none; display:inline-block;`——這是唯一必要的新增 CSS。

---

### ② `#hero`（行 1297–1319）— **視覺不動，只加一塊資訊條**

`Design-*.svg` 視差層、`D-Logo-1`（主標）、`D-Logo-2`（副標）全部保留原樣，作為系列識別。

**唯一改動**：
1. `.hero-tag` 文字：`Taiwan AI Academy × 設計產業` → **`系列最終場 ・ 2026.09.11 FRI`**
2. 在 `.hero-sub` 之後、`</section>` 之前，插入一組資訊條 + CTA：

```html
<div class="hero-meta">
  <span>2026.09.11（五）09:30–16:30</span>
  <span>逢甲大學 學思樓第九國際會議廳</span>
</div>
<a class="hero-cta more-link" href="https://neti.cc/OPqybX2"
   target="_blank" rel="noopener">提交報名申請 →</a>
<div class="hero-note">審核制錄取・報名至 9/1</div>
```

新增 CSS（約 15 行，沿用既有變數）：`.hero-meta` 用 `--t` 文字、flex 橫排、`gap:1.5rem`、`font-weight:700`、手機轉直排；`.hero-cta` 放大 `.more-link` 的 padding；`.hero-note` 用 `--ts` 小字。全部 `position:relative; z-index:1`（因為 Design 大字是絕對定位背景層）。

> **主標 SVG 的處理**：`D-Logo-1` 是「AI X 設計職人 產業實戰 工作坊」字樣。第一版直接沿用，因為 `.hero-tag` 已標明「系列最終場」、下方資訊條已寫明論壇日期地點，語意成立且**零素材成本**。若之後拿到論壇專屬標準字 SVG，替換 `src` 即可，不動結構。

---

### ③ `.integrated-hero-schools`（行 1322–1378）— 深色介紹區

**保留**：深色底、虛線圓形裝飾、`.hs-kicker` 綠線眉標、`.hs-grid` 左右分欄、`.schools-card` 黃卡外框與綠色投影。

| 元素 | 現況 | 改為 |
|------|------|------|
| `.hs-kicker` | Taiwan AI Academy × Design Industry | `SPACE DESIGN FORUM · 2026` |
| `.hs-title` | AI 正在改變<em>設計產業</em>，你準備好了嗎？ | AI 正在重新定義<em>空間設計</em>的整套流程 |
| `.hs-desc` | 工作坊系列介紹 | 從設計概念、建模渲染到跨團隊協作，AI 已進入空間設計的每一個環節。本場論壇為 AI X 設計職人產業實戰工作坊系列的最終場，集結產業與學界實踐者，分享可實際導入的工作方法與專案管理經驗。 |
| `.hs-stats` 三格 | 5 所合作大學 / 7 場工作坊 / 4 大城市巡迴 | **4** 場專題演講 / **3** 組實戰案例 / **7** 小時議程 |

**`.schools-card` 改為活動資訊卡**（結構全留，只換內部內容）：

- `::before` 標籤文字：CSS 裡 `content:'COLLABORATION'` → `content:'EVENT INFO'`
- `.schools-heading` h2：`合作學校` → `活動資訊`；小字：`跨校聯合・全台佈點` → `單日議程・審核錄取`
- **`.map-stage` 內的台灣地圖與 5 個 `.school-pin` 全部刪除**，改放資訊列表
- `.school-list-mobile` 改為主要資訊列表（拿掉 `@media` 限制，桌機也顯示），內容：

| 項目 | 值 |
|------|-----|
| 日期 | 2026/09/11（五） |
| 時間 | 09:30–16:30（09:00 報到） |
| 地點 | 逢甲大學 學思樓第九國際會議廳 |
| 地址 | 臺中市西屯區文華路 100 號 |
| 報名期間 | 2026/07/01 – 09/01 |
| 錄取方式 | 審核制 |
| 餐飲 | 大會提供午餐 |

> 這是全站唯一需要刪 DOM 的地方（地圖）。`.map-stage`/`.map-wrap`/`.school-pin`/`.pin-label` 的 CSS 可留著不管，不影響渲染。

---

### ④ `.courses` → `#agenda` 議程（行 1381–1568）

**這是改造量最大、但結構完全對得上的一區。**

**`.top-bar`**

| 元素 | 改為 |
|------|------|
| `.en-label` | `Forum Agenda · 2026.09.11` |
| `.main-title` | `論壇議程 <em>AGENDA</em>` |
| `.filters` | **整段刪除**（11 則議程不需篩選，同時省下 `f-btn` 相關 JS） |

**`.month-group` → 上午／下午兩組**（class 名不改，只換內容）

| 元素 | 上午組 | 下午組 |
|------|--------|--------|
| `.month-num` | `AM` | `PM` |
| `.month-tag` | `MORNING` | `AFTERNOON` |

> `.month-num` 是 Space Grotesk 900 / 80px / opacity .1，`AM`/`PM` 兩字寬度剛好，但需把 `width:80px` 放寬到 `auto`（或 `min-width:80px`）。

**`.card-grid` 改為單欄**：加 `single` class（`.card-grid.single { grid-template-columns:1fr }` 已存在）。

**每張 `.card` 的欄位對應**（結構一字不改，只換文字）：

| 現有元素 | 原用途 | 新用途 |
|---------|-------|--------|
| `.date-big` | `5/06` | `09:40` |
| `.date-dow` | `週三・台南` | `100 分鐘` |
| `.cat-badge` + `data-cat` | 影視動畫 | 議程類型 |
| `.card-title` | 課程名稱 | 講題 |
| `.card-meta .loc` | 學校 | 講者姓名 |
| `.card-meta` 次行 | 講師職稱 | 講者職稱 |
| `.region-pill` | 南部 | 時段（上午／下午） |
| `.more-link` | 了解更多 | 講者介紹（僅演講場次有；報到／用餐／賦歸移除此按鈕） |

**`data-cat` 沿用既有色彩對應，不新增 CSS**：

| 議程類型 | 借用 `data-cat` | 呈現色 |
|---------|----------------|-------|
| 專題演講 | `影視動畫` | `#333333` 底 / `#F5E400` 字 |
| 專題短講 | `商業視覺` | `#00A1F2` 底 / 白字 |
| 案例分享 | `室內設計` | `#FF70A2` 底 / 白字 |
| 致詞・交流 | `設計方法` | `#5EC223` 底 / 白字 |

> 只需把 `.cat-badge` 的**顯示文字**改掉，`data-cat` 屬性值保持既有字串即可命中現有 CSS 選擇器。零 CSS 改動。

**議程內容（11 則）**

上午｜MORNING

| 時間 | 時長 | 講題 | 講者 | 類型 |
|------|------|------|------|------|
| 09:00 | 30 分鐘 | 與會者報到 | — | 致詞・交流 |
| 09:30 | 10 分鐘 | 貴賓致詞與合照 | 數發部鍾佳蓉副組長、中經院連賢明院長、逢甲大學長官 | 致詞・交流 |
| 09:40 | 100 分鐘 | 打造你的 AI CASA — 室內與建築設計 AI 系統工作流 | 邵唯晏｜竹工凡木設計集團 創辦人 | 專題演講 |
| 11:20 | 50 分鐘 | 空間設計產業的 AI 專案管理實踐 | 曾思遠｜Nautilus AI 執行長 | 專題演講 |
| 12:10 | 50 分鐘 | 午餐交流（大會提供） | — | 致詞・交流 |

下午｜AFTERNOON

| 時間 | 時長 | 講題 | 講者 | 類型 |
|------|------|------|------|------|
| 13:00 | 10 分鐘 | 貴賓致詞與合照 | 台灣人工智慧學校 蔡明順校務長 | 致詞・交流 |
| 13:10 | 40 分鐘 | 用 AI 建模與渲染工作流 | 林楚卿｜元智大學藝術與設計學系 教授 | 專題短講 |
| 13:50 | 40 分鐘 | 用 AI 加速室內空間提案 | 李元榮｜逢甲大學建築專業學院 教授 | 專題短講 |
| 14:30 | 30 分鐘 | 午茶交流 | — | 致詞・交流 |
| 15:00 | 90 分鐘 | 工作坊案例分享<br>元智大學｜AI 建模與渲染<br>逢甲大學｜室內空間提案<br>南臺科技大學｜AI 與動畫 | 三組師生 | 案例分享 |
| 16:30 | — | 賦歸 | — | 致詞・交流 |

> 15:00 一則**只在議程卡內以文字列出三校主題**，不展開成獨立區塊（依指示留待下階段）。

---

### ⑤ `#speakers` 講者（行 1571–1628）

**刪除 marquee**：只有 4 位講者跑馬燈會顯得空。移除 `.spk-view-toggle`、整段 `.spk-view-marquee`，以及對應的 view 切換 JS 與 localStorage 邏輯。`.spk-view-grid` 內容直接上提。這同時省掉重複的 duplicate set B 卡片。

**`.sec-title` / `.sec-sub`**：`講師陣容` → `講者陣容`；副標 → `產業與學界的空間設計 AI 實踐者`

**`.spk-grid` 由 9 張改為 4 張**（`repeat(4,1fr)` 剛好一排）：

| 姓名 | `.spk-card-role` | tag class | 照片 |
|------|-----------------|-----------|------|
| 邵唯晏 | 竹工凡木設計集團 創辦人 | `cat-film` | ✅ 既有 |
| 曾思遠 | Nautilus AI 執行長 | `cat-visual` | ✅ `img/speakers/曾思遠_croped.png` |
| 林楚卿 | 元智大學藝術與設計學系 教授 | `cat-interior` | ✅ 既有 |
| 李元榮 | 逢甲大學建築專業學院 教授 | `cat-space` | ✅ 既有 |

- tag 文字改為講題關鍵詞（AI CASA／專案管理／建模渲染／空間提案），`href` 指向對應議程卡 `#agenda-3` 等
- 曾思遠使用已裁切照片：`img/speakers/曾思遠_croped.png`

**貴賓名條**：在 `.spk-grid` 下方加一行純文字（不做卡片，省時間）：

> 貴賓致詞｜數位發展部數位產業署 鍾佳蓉 副組長・財團法人中華經濟研究院 連賢明 院長・台灣人工智慧學校 蔡明順 校務長

---

### ⑥ Lightbox 與 `COURSES` 資料（行 1839 起）

`COURSES` 物件改為議程資料，**保留既有欄位名**以免動 render 邏輯：

| 欄位 | 新內容 |
|------|--------|
| `name` | 講題 |
| `dateDisplay` | `2026/09/11（五） 09:40–11:20` |
| `uni` | `逢甲大學 學思樓第九國際會議廳` |
| `venue` | `臺中市西屯區文華路 100 號` |
| `url` | `https://neti.cc/OPqybX2`（四則共用） |
| `deadline` / `deadlineDisplay` | `2026-09-01` / `9/1` |
| `tools` | 講題關鍵詞（沿用 tag 樣式） |
| `speakers` | 姓名／職稱／照片／簡介 |

- 只保留 **4 則**（四場演講），對應 `data-course="1"`–`"4"`
- 報到／用餐／交流／賦歸的卡片**不放 `.more-link`**，不進 `COURSES`
- `lb-reg-btn` 文字：`立即報名 →` → `提交報名申請 →`
- 上下則切換的 `COURSE_IDS` 由 `Object.keys(COURSES)` 自動推導，無需改 JS

---

### ⑦ `#faq`（行 1644–1670）

沿用 accordion 結構與 JS，5 題換成 8 題：

1. 報名後就一定能參加嗎？ → 本場採**審核制**，優先錄取與主題相關之從業者與有實務應用需求者，錄取結果將以 Email 通知。
2. 活動是否免費？ →〔待補〕
3. 需要具備 AI 或設計軟體使用經驗嗎？
4. 報名截止日與名額？ → 報名至 2026/09/01 23:59；名額〔待補〕
5. 是否提供午餐？ → 大會提供午餐與午茶交流。
6. 是否提供研習證明？ →〔待補〕
7. 是否會錄影或提供簡報？
8. 如何前往會場？是否提供停車？ →〔待補〕

---

### ⑧ `footer`（行 1673–1685）

`.ft-org` 改為四層單位：

```
指導單位　數位發展部數位產業署
委託單位　財團法人中華經濟研究院・財團法人資訊工業策進會
主辦單位　財團法人台灣人工智慧學校基金會
協辦單位　逢甲大學
```

`.ft-bottom` 加聯絡方式：`02-85123731 ／ hi@aiacademy.tw`

---

### ⑨ `<head>`

`<title>` → `2026 AI 賦能空間設計產業論壇 — Taiwan AI Academy`，並補 `<meta name="description">` 與 OG 標籤（原檔沒有，論壇需要社群分享卡）。

---

## 三、工作量估算

| 區塊 | 改動性質 | 風險 |
|------|---------|------|
| head / nav / footer | 純文字替換 | 低 |
| hero | 保留原樣 + 插入 3 個元素、新增約 15 行 CSS | 低 |
| 深色介紹區 | 文字替換 + 刪地圖 DOM | 低 |
| 議程區 | 7 張卡改寫成 11 則、刪 filter | **中**（改動量最大） |
| 講者區 | 9 張刪為 4 張、刪 marquee 與切換 JS | 低 |
| Lightbox 資料 | `COURSES` 改 4 則 | 低 |
| FAQ | 5 題改 8 題 | 低 |

**新增 CSS 總量：約 20 行**（hero 資訊條 + `.more-link` 用於 `<a>` + `.month-num` 寬度）。無新色碼、無新元件。

---

## 四、阻塞上線的待補資料

**P1**

1. **報名費用**（neticrm 頁面未標示）— FAQ 與資訊卡都要用
2. **名額上限**
3. ~~**曾思遠照片**~~（已補：`img/speakers/曾思遠_croped.png`）

**P2**

4. 交通與停車資訊
5. 是否核發研習時數／參加證明
6. 四場演講的講題摘要（lightbox 用；未到位前可先放講者簡介）

**可先不處理**：指導／委託／協辦單位 Logo（footer 先用文字列出即可）、工作坊成果分享區塊（下階段）。

---

## 五、參考來源

- 確認版文案：`forum-page-confirmed-copy.md`
- 主辦方核可網站主文案：活動時間、地點、報名短網址、論壇介紹、四場講題／講者、案例分享及主協辦單位
- 議程與單位：[空間設計論壇網站資料試算表](https://docs.google.com/spreadsheets/d/1jrmmrpA3_VSS_hSEFdJswpzeC8IXWrYjOhpOHFE-oW4/edit?gid=1841321652)
- 報名與錄取方式：https://sted.neticrm.tw/civicrm/event/info?reset=1&id=322
- 設計規範：`DESIGN.md`
