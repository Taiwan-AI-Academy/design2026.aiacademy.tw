# AIA Design Workshop 2026 — Web Design Guideline

> Taiwan AI Academy · 2026 Workshop Series · Design System v1.0

---

## 01 · 色彩系統 Color System

### 主色盤

| 名稱 | Hex | 用途 |
|------|-----|------|
| Primary Yellow | `#F5E400` | 主背景色 |
| Green | `#5EC223` | 輔助一 |
| Blue | `#00A1F2` | 輔助二 |
| Pink | `#FF70A2` | 暖橘輔色 |
| Text Primary | `#333333` | 主文字 |
| Text Secondary | `#666666` | 輔文字 |
| Background Light | `#FAFAF5` | 頁面底色 |

### 輔色疊加規則

三個輔色疊加在黃色背景上時，一律用 `opacity: 0.5`（或 `rgba` alpha 0.5），讓瀏覽器即時合成，不使用預先計算的色碼。

```css
/* Green 疊黃底 */
background: #5EC223;
opacity: 0.5;          /* 或 rgba(94, 194, 35, 0.5) */

/* Blue 疊黃底 */
background: #00A1F2;
opacity: 0.5;          /* 或 rgba(0, 161, 242, 0.5) */

/* Pink 疊黃底 */
background: #FF70A2;
opacity: 0.5;          /* 或 rgba(255, 112, 162, 0.5) */
```

**規範：**
1. 主背景固定為 `#F5E400`
2. 三個輔色以 `rgba + alpha 0.5` 疊加於黃底上呈現，不使用計算後的色碼
3. 文字一律使用 `#333` / `#666`，不使用彩色文字

---

## 02 · 字型系統 Typography

**Google Fonts 載入：** `Noto Sans TC` (400, 700, 900) + `Space Grotesk` (400, 700)

| 層級 | 字型 | 大小 | 用途 |
|------|------|------|------|
| Display / 主標題 | Noto Sans TC 900 或 Source Han Sans Heavy | 56–80px | 頁面主標題 |
| DESIGN 裝飾字 | Space Grotesk Black | 100–140px, letter-spacing: 4px | 視覺裝飾大字 |
| 日期標題 | Space Grotesk 700 | 28–36px | 活動日期 |
| 活動名稱 | Noto Sans TC 700 | 16–18px | 含綠色底線裝飾 |
| Body / 說明文字 | Noto Sans TC 400 | 14–15px, line-height: 1.8 | 一般說明 |
| Year Tag / 側標 | Space Grotesk 900 | 24px, vertical, letter-spacing: 6px | 右側年份標籤，背景 Pink #FF70A2 |

---

## 03 · 版面結構 Layout Structure

### 頁面區塊順序

1. **Hero Section** — Logo + 主標題 + 副標題
2. **裝飾 DESIGN 大字**（scroll reveal）
3. **活動列表**（雙欄 grid，含圓形圖示）
4. **主辦單位 / Footer**

### 網格系統

| 屬性 | 值 |
|------|----|
| max-width | `1200px` |
| columns | `12` |
| gutter | `24px` |
| padding | `0 32px` |

### 活動卡片

- Desktop：2 欄
- Mobile：1 欄
- gap：`16px`

### 右側年份標籤

```css
position: fixed;
right: 0;
writing-mode: vertical-rl;
```

---

## 04 · UI 元件規範 Components

### 活動卡片 Event Card

結構：**圓形圖示 + 日期標籤 + 地點 + 活動名稱 + 副標題**

```
[ 圓形圖示 ] [ 5/06 ] 南臺科大
              影視動畫
              AI 影像生成實戰營
```

- 圓形圖示：直徑 80px，2px 綠色邊框，白底，容納 AI 生成圖像
- 日期標籤：`background: #333333; color: #F5E400; border-radius: 6px`

### 綠色分隔條 Green Divider

```css
height: 3–4px;
background: #5EC223;
border-radius: 2px;
```

### CTA 按鈕

| 類型 | 樣式 |
|------|------|
| 主要 CTA | `background: #FF70A2; color: white` |
| 次要按鈕 | `background: #333333; color: #F5E400` |

```css
padding: 10px 20px;
border-radius: 8px;
font-weight: 700;
font-size: 13px;
```

### 活動分類標籤

```css
border-radius: 4px;
padding: 4px 12px;
font-size: 12px;
font-weight: 700;
```

| 類別 | 背景色 | 文字色 |
|------|--------|--------|
| 影視動畫 | `#333333` | `#F5E400` |
| 設計方法 | `#5EC223` | `white` |
| 產品設計 | `#00A1F2` | `white` |
| 室內設計 | `#FF70A2` | `white` |

---

## 05 · 視覺識別細節 Visual Signature Elements

### DESIGN 裝飾大字

```css
opacity: 0.12–0.18;
font-size: 100–140px;
font-weight: 900;
letter-spacing: 4px;
border-style: dashed;
border-color: rgba(0,0,0,0.15);
border-radius: 8px;
color: rgba(0,0,0,0.12);
```

搭配 scroll-trigger 動畫讓文字從下方 fade-slide in。

### 年份側欄標籤

```css
background: #FF70A2;
color: white;
width: 28px;
position: fixed; /* 或 sticky */
right: 0;
writing-mode: vertical-rl;
letter-spacing: 6px;
font-weight: 900;
```

---

## 06 · 動態設計 Motion & Animation

| 動畫名稱 | 規格 |
|----------|------|
| Hero 進場 | 標題由下 fade-in，stagger 0.1s；`translateY(24px)→0`，duration: 0.6s，easing: ease-out |
| DESIGN 大字 | Scroll trigger，進入視窗後 `scale(0.9)→1` + opacity；duration: 0.8s |
| 活動卡片 | Intersection Observer 依序 stagger 進場；stagger: 0.08s，`translateY(16px)→0` |
| 圓形圖示 Hover | `scale(1.05)` + 邊框加粗 + 輕微陰影；duration: 0.2s，ease-in-out |
| CTA 按鈕 Hover | `translateY(-2px)` + background darken；duration: 0.15s |

---

## 07 · 活動場次 Event Schedule

| 日期 | 地點 | 活動名稱 |
|------|------|---------|
| 5/06 | 南臺科大 | 影視動畫：AI 影像生成實戰營 |
| 5/09 | 元智大學 | 設計方法：AI 設計工作系統 |
| 5/27 | 南臺科大 | 商業視覺：AI 傳達設計工作坊 |
| 6/05 | 逢甲大學 | 產品設計：3D 邏輯建模視覺化工作坊 |
| 6/13 | 元智大學 | 產品空間：Rhino X AI 渲染工作流 |
| 6/15 | 逢甲大學 | 室內設計：用 AI 加速空間提案工作坊 |
| 7/16 | 宜蘭大學 | 概念提案：AI 設計實務工作坊 |

**共同主辦：** 財團法人台灣人工智慧學校基金會、南臺科技大學、國立宜蘭大學、元智大學、逢甲大學

---

## 08 · 技術建議 Tech Recommendations

| 項目 | 技術 |
|------|------|
| 字型載入 | Google Fonts：`Noto Sans TC`、`Space Grotesk`；weights: 400, 700, 900 |
| 動畫框架 | GSAP ScrollTrigger、Intersection Observer API |
| 圖示處理 | `object-fit: cover`、`border-radius: 50%` |
| RWD 斷點 | mobile: `<768px`、desktop: `≥1024px` |

---

## CSS 變數快速參考

```css
:root {
  --yellow:         #F5E400;
  --green:          #5EC223;
  --blue:           #00A1F2;
  --pink:           #FF70A2;
  --text-primary:   #333333;
  --text-secondary: #666666;
  --white:          #FFFFFF;
  --gray-light:     #FAFAF5;
}

/* 輔色疊黃底時使用 rgba，不用預算色碼 */
/* rgba(94, 194, 35, 0.5)  — green @ 0.5 */
/* rgba(0, 161, 242, 0.5)  — blue  @ 0.5 */
/* rgba(255, 112, 162, 0.5) — pink  @ 0.5 */
```
