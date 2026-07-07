# AGENTS.md

## Cursor Cloud specific instructions

Swaim Browser — десктопное Electron-приложение (React 18 + TypeScript + Vite, состояние на Zustand,
хранение через electron-store). Один продукт, без отдельного бэкенда. Стандартные команды описаны в
`README.md` и `package.json` (`scripts`).

### Запуск приложения в headless cloud VM

- Запускай dev-режим так: `LIBGL_ALWAYS_SOFTWARE=1 npm run dev`.
  Без `LIBGL_ALWAYS_SOFTWARE=1` GPU-процесс Electron падает с `FATAL ... GPU process isn't usable. Goodbye`,
  и так как `vite-plugin-electron` завершает Vite при выходе Electron, весь `npm run dev` умирает.
  Программная отрисовка Mesa (llvmpipe) через этот флаг позволяет процессам Electron жить.
- НЕ добавляй `app.disableHardwareAcceleration()` в `electron/main.ts` ради окружения — используй
  env-переменную выше, чтобы не менять код приложения.
- Логи `ERROR:bus.cc ... Failed to connect to the bus` и `Exiting GPU process due to errors during
  initialization` в headless-окружении безвредны.

### Отрисовка / проверка UI

- Нативное окно Electron в этом headless-VM отрисовывает **чёрный экран**: renderer/`<webview>` не
  композитятся при программном GL (это поведение упомянуто и в `README.md` про чёрный экран на части систем).
- Чтобы реально посмотреть и протестировать UI, открой в Chrome dev-сервер `http://localhost:5173/` —
  это тот же renderer-код, который грузит окно Electron. Боковые панели и оверлей Focus Mode рендерятся
  корректно; центральная область — встроенный браузер (`BrowserView`/`<webview>`), внешние сайты в нём
  тоже не отрисовываются в headless (та же причина).

### Lint / typecheck

- `npm run typecheck` (`tsc --noEmit`) работает и проходит — используй его для проверки типов.
- `npm run lint` **сломан на уровне репозитория**: пакет `eslint` отсутствует в `devDependencies`, и нет
  конфига ESLint. Команда падает с `eslint: not found`. Это не проблема окружения; не «чини» добавлением
  ESLint без явного запроса.

### Сборка

- `npm run build` / `npm run build:linux` запускают `electron-builder` (упаковка дистрибутива) и для обычной
  разработки не нужны. Для разработки используй dev-режим выше.
