# 學員作品縮圖匯入

2026-09-24 以 Google Drive 連接器逐層列出五校資料夾，對每個作品資料夾使用 `list_folder(top_k=1000)`（最大資料夾實際回傳 117 筆，避免預設 100 筆截斷），包含逢甲第二場的「動畫」子資料夾。只收錄學員作品資料夾，未將根目錄海報、活動照片、成果報告或工作流混入。

| 學校 | 路徑 | 件數 |
| --- | --- | ---: |
| 南臺 | `public/img/workshops/nantai/portfolio/` | 14 |
| 元智 | `public/img/workshops/yzu/portfolio/` | 141 |
| 逢甲 | `public/img/workshops/fcu/portfolio/` | 99 |
| 臺東 | `public/img/workshops/ntc/portfolio/` | 11 |
| 宜蘭 | 尚未提供學員作品 | 0 |

共 265 件：248 張圖片、13 部影片、4 份 PDF。影片使用 Drive 預覽影格，PDF 使用封面縮圖；原作連結保留完整內容。檔案 ID 作為檔名避免不同場次重名；原檔名及場次保存在清單。

## 執行

需要 Node.js、專案 npm 依賴、curl，以及 Google Drive 網路連線：

```sh
node scripts/download-workshop-portfolios.mjs
```

- `scripts/workshop-portfolio-manifest.json`：來源清單，包含檔案 ID、學校、場次、MIME、更新時間及來源連結。此腳本只同步清單，不自動探索新的 Drive 檔案。
- 固定 4 個下載工作；每檔 60 秒上限，最多 4 次嘗試，指數退避加隨機延遲。
- 只抓 Drive 縮圖，經 sharp 解碼驗證，限制長邊 1200px、WebP 品質 82，不放大、不裁切，移除原圖 metadata。
- 每檔寫入暫存檔後原子更名。`.cache/workshop-portfolios/state.json` 記錄來源更新時間、轉檔版本、尺寸與容量；重跑會驗證已完成圖片並跳過。
- 失敗記錄於 `.cache/workshop-portfolios/failures.json`，程式非零退出；修復連線後重跑即可續傳。
- 只有全數成功才更新 `src/data/workshop-portfolios.json`，網站建置只使用本地檔案，無須連線 Drive。
- 鎖目錄防止同時執行兩次；若遭強制終止，確認没有 importer 執行後才手動移除 `.cache/workshop-portfolios/lock/` 再續跑。
- 若雲端新增作品，先以 Drive 連接器重新列出所有作品資料夾與子資料夾、確認未截斷並更新 manifest；不要手動編造檔案 ID。更新既有作品需同步 `modifiedTime`。刪除清單項目不會自動刪除本地圖片。

## 網頁

作品集沿用剪影的各校橫向輪播與點圖放大，縮圖高度填滿輪播列、每格寬度依圖片比例決定，完整呈現且不裁切，額外提供原作／影片／PDF 連結。縮圖依可視範圍預載，隱藏分類不強制整批載入。沒有作品的學校整列在作品集分類隱藏，切回剪影或工作流時恢復；日後加入作品會自動顯示。
