# Архитектура Swaim Browser

## Обзор

Swaim Browser — это desktop-приложение на базе NW.js/Electron, предназначенное для продуктивной работы. Приложение сочетает браузер с системой фокусировки и управления проектами.

## Структура проекта

```
/
├── index.html          # Главный файл приложения (UI + логика)
├── docs/               # Документация
│   ├── ARCHITECTURE.md # Этот файл
│   ├── DATA.md         # Формат данных и API store
│   ├── requirements.md # Функциональные требования
│   ├── DEV-CHECKLIST.md
│   ├── GLOSSARY.md
│   └── KNOWN-ISSUES.md
└── COMPETITOR_ANALYSIS.md
```

## Архитектурные слои

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Topbar  │  │  Browser │  │     Sidebar      │  │
│  │  (nav)   │  │ (webview)│  │ (tabs: Focus,    │  │
│  │          │  │          │  │  Projects,       │  │
│  │          │  │          │  │  Insights)       │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────┤
│                  Logic Layer                        │
│  ┌────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Navigation │  │  Focus Mode  │  │  Insights  │  │
│  │  Manager   │  │   Manager    │  │  Manager   │  │
│  └────────────┘  └──────────────┘  └────────────┘  │
├─────────────────────────────────────────────────────┤
│                  Data Layer                         │
│  ┌─────────────────────────────────────────────┐   │
│  │            electron-store                    │   │
│  │         (локальное хранилище)               │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## UI-компоненты

### 1. Topbar (`.topbar`)
Верхняя панель навигации, высота 52px.

| Элемент | ID/Class | Описание |
|---------|----------|----------|
| Logo | `.logo` | Логотип Swaim |
| URL Bar | `.urlbar`, `#urlInput` | Поле ввода URL/поиска |
| Back Button | `#backBtn` | Навигация назад |
| Forward Button | `#forwardBtn` | Навигация вперёд |
| Reload Button | `#reloadBtn` | Перезагрузка страницы |
| Focus Button | `#focusBtn` | Включение Focus Mode |
| Sidebar Button | `#sidebarBtn` | Открытие/закрытие сайдбара |

### 2. Browser (`.browser`)
Основная область просмотра веб-контента.

| Элемент | ID/Class | Описание |
|---------|----------|----------|
| Webview | `#webview` | Встроенный браузер (webview) |
| Focus Overlay | `#focusOverlay` | Оверлей режима фокусировки |

### 3. Sidebar (`.sidebar`)
Выдвижная панель справа, ширина 320px.

| Вкладка | Tab ID | Content ID | Описание |
|---------|--------|------------|----------|
| Focus | `data-tab="focus"` | `#focusTab` | Настройка сессий фокусировки |
| Projects | `data-tab="projects"` | `#projectsTab` | Управление проектами |
| Insights | `data-tab="insights"` | `#insightsTab` | Список инсайтов |

### 4. Focus Overlay (`.focus-overlay`)
Полноэкранный оверлей для режима фокусировки.

| Элемент | ID | Описание |
|---------|-----|----------|
| Timer | `#focusTimer` | Обратный отсчёт (25:00 по умолчанию) |
| Goal | `#focusGoal` | Текущая цель сессии |
| Blocked Sites | `#blockedSites` | Список заблокированных сайтов |
| End Button | `#endFocusBtn` | Завершение сессии |

## Модули логики

### Navigation Manager
Управление навигацией браузера.

```javascript
// Обработка URL
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    // Автодополнение протокола
    // Поиск Google для не-URL
  }
});

// Кнопки навигации
backBtn → webview.goBack()
forwardBtn → webview.goForward()
reloadBtn → webview.reload()
```

### Focus Mode Manager
Управление режимом фокусировки с блокировкой отвлекающих сайтов.

**Состояние:**
- `focusActive: boolean` — активен ли режим
- `focusTimer: interval` — таймер обратного отсчёта
- `focusTimeLeft: number` — секунды до конца
- `blockedDomains: string[]` — список блокируемых доменов

**Заблокированные домены по умолчанию:**
- youtube.com
- twitter.com
- reddit.com
- facebook.com
- instagram.com

**Функции:**
- `toggleFocusMode()` — переключение режима
- `startFocusMode()` — старт сессии
- `endFocusMode()` — завершение сессии
- `blockNavigation()` — блокировка запрещённых сайтов
- `updateTimerDisplay()` — обновление таймера на UI

### Insights Manager
Сохранение заметок и инсайтов с привязкой к URL.

**Функции:**
- `addInsight()` — добавление нового инсайта
- `loadInsights()` — загрузка и отображение инсайтов

## Горячие клавиши

| Комбинация | Действие |
|------------|----------|
| `Alt + P` | Добавить инсайт с текущей страницы |
| `Ctrl + Shift + F` | Переключить Focus Mode |

## Зависимости

| Пакет | Назначение |
|-------|------------|
| `nw.gui` | NW.js GUI API |
| `electron-store` | Локальное хранилище данных |

## CSS-переменные (тема)

```css
:root {
  --bg: #0a0b12;           /* Фон приложения */
  --panel: #11151f;        /* Фон панелей */
  --accent: #4f8cff;       /* Акцентный цвет */
  --text: #f5f7fa;         /* Основной текст */
  --text-muted: #8a94a6;   /* Приглушённый текст */
  --border: rgba(255,255,255,0.08); /* Границы */
}
```

## Data Flow

```
User Action → Event Handler → Logic Module → Store (persistence)
                                  ↓
                            UI Update
```

### Пример: Добавление инсайта
1. Пользователь нажимает `Alt + P`
2. `keydown` handler вызывает `addInsight()`
3. Открывается `prompt()` для ввода текста
4. Данные сохраняются в `store.set('insights', ...)`
5. `loadInsights()` обновляет UI

### Пример: Старт Focus Mode
1. Пользователь нажимает кнопку `#focusBtn`
2. `startFocusMode()` активирует оверлей
3. Запускается `setInterval` для таймера
4. Навешивается listener на webview для блокировки сайтов
5. При переходе на заблокированный сайт — показывается предупреждение
