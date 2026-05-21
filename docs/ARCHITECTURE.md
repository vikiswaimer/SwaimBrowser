# Архитектура Swaim Browser

## Обзор

Swaim Browser — это desktop-приложение на базе **Electron** с **React** UI, предназначенное для продуктивной работы. Приложение сочетает браузер с системой фокусировки и управления проектами.

## Технологический стек

| Компонент | Технология |
|-----------|------------|
| Desktop Runtime | Electron 28 |
| UI Framework | React 18 + TypeScript |
| State Management | Zustand |
| Build Tool | Vite |
| Packaging | electron-builder |
| Storage | electron-store |

## Структура проекта

```
swaim-browser/
├── electron/               # Electron main process
│   ├── main.ts            # Главный процесс
│   └── preload.ts         # Preload скрипт (IPC)
├── src/                   # React приложение
│   ├── components/        # UI компоненты
│   │   ├── TopBar/        # Панель навигации
│   │   ├── Sidebar/       # Боковая панель
│   │   ├── BrowserView/   # Webview
│   │   └── FocusOverlay/  # Оверлей фокусировки
│   ├── store/             # Zustand stores
│   ├── shared/            # Shared код
│   ├── hooks/             # React хуки
│   ├── lib/               # Сервисы
│   └── styles/            # CSS
├── docs/                  # Документация
└── index.html             # Entry point
```

## Архитектурные слои

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐           │
│  │  TopBar  │  │ Browser  │  │     Sidebar      │           │
│  │          │  │  View    │  │  (Focus/Projects │           │
│  │          │  │          │  │   /Insights)     │           │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘           │
│       │             │                 │                     │
├───────┴─────────────┴─────────────────┴─────────────────────┤
│                      State Layer (Zustand)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ browserStore │  │  focusStore  │  │insightsStore │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
├─────────────────────────────────────────────────────────────┤
│                      Service Layer                          │
│  ┌─────────────────────────────────────────────────┐        │
│  │              Platform Abstraction               │        │
│  │   (storage, notifications, platform detection)  │        │
│  └─────────────────────────────────────────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    Electron IPC Bridge                      │
│  ┌─────────────┐                  ┌─────────────┐           │
│  │   Preload   │◄──────IPC──────► │    Main     │           │
│  │   Script    │                  │   Process   │           │
│  └─────────────┘                  └─────────────┘           │
│                                          │                  │
│                                          ▼                  │
│                                   electron-store            │
└─────────────────────────────────────────────────────────────┘
```

## Electron Process Model

### Main Process (`electron/main.ts`)
- Создание BrowserWindow
- IPC handlers для store, window controls
- Системные интеграции (трей, меню)

### Preload Script (`electron/preload.ts`)
- Безопасный мост между main и renderer
- Экспорт `window.electron` API:
  - `store.get/set/delete/clear`
  - `window.minimize/maximize/close`
  - `app.getVersion/getPlatform`

### Renderer Process (`src/`)
- React приложение
- Не имеет прямого доступа к Node.js
- Использует `window.electron` для системных операций

## UI-компоненты

### TopBar
| Элемент | Функция |
|---------|---------|
| Logo | Брендинг |
| Navigation Buttons | Back, Forward, Reload |
| URL Bar | Навигация и поиск |
| Focus Button | Переключение Focus Mode |
| Sidebar Button | Открытие/закрытие сайдбара |

### BrowserView
| Элемент | Функция |
|---------|---------|
| Webview | Отображение веб-контента |
| FocusOverlay | Полноэкранный таймер |

### Sidebar
| Вкладка | Контент |
|---------|---------|
| Focus | Настройка сессий, история |
| Projects | Управление проектами |
| Insights | Список инсайтов |

## State Management (Zustand)

### browserStore
```typescript
{
  currentUrl: string;
  inputValue: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}
```

### focusStore
```typescript
{
  isActive: boolean;
  remainingSeconds: number;
  currentGoal: string;
  selectedDuration: 25 | 50 | 90;
  sessions: FocusSession[];
}
```

### insightsStore
```typescript
{
  insights: Insight[];
  recentInsights: Insight[];
}
```

### sidebarStore
```typescript
{
  isOpen: boolean;
  activeTab: 'focus' | 'projects' | 'insights';
}
```

## Shared Layer

### Цель
Код в `src/shared/` предназначен для переиспользования между платформами (Desktop, Mobile, Web).

### Модули
| Модуль | Содержимое |
|--------|------------|
| `constants.ts` | APP_CONFIG, FOCUS_CONFIG, BLOCKED_DOMAINS |
| `types.ts` | Insight, FocusSession, Project, UserSettings |
| `utils.ts` | formatTimeDisplay, normalizeUrl, isBlockedDomain |
| `platform.ts` | PlatformAdapter, detectPlatform |

## Data Flow

```
User Action → React Component → Zustand Action → State Update
                                      │
                                      ▼
                              IPC (if persistence)
                                      │
                                      ▼
                              electron-store
```

### Пример: Добавление инсайта
1. Пользователь нажимает `Alt+P`
2. `App.tsx` перехватывает событие
3. `insightsStore.addInsight()` обновляет state
4. `storage.set()` сохраняет через IPC
5. UI обновляется реактивно

## CSS Architecture

### CSS Variables (Техно-минимализм Theme)
```css
:root {
  /* Background - Глубокий антрацит */
  --bg-primary: #0B0B0B;
  --bg-secondary: #111111;
  --bg-tertiary: #1A1A1A;
  --bg-elevated: rgba(255, 255, 255, 0.03);
  --bg-hover: rgba(255, 255, 255, 0.06);

  /* Glassmorphism */
  --glass-bg: rgba(17, 17, 17, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: blur(20px);

  /* Accent - Электрический синий */
  --accent-primary: #0066FF;
  --accent-secondary: #3385FF;
  --accent-muted: rgba(0, 102, 255, 0.15);
  --accent-glow: rgba(0, 102, 255, 0.4);

  /* Validation colors */
  --validated: #22C55E;
  --validated-muted: rgba(34, 197, 94, 0.15);
  --invalid: #EF4444;
  --invalid-muted: rgba(239, 68, 68, 0.15);

  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0A0;
  --text-muted: #606060;

  /* Borders - тонкие 1px */
  --border-primary: rgba(255, 255, 255, 0.1);
  --border-secondary: rgba(255, 255, 255, 0.05);

  /* Layout */
  --topbar-height: 48px;
  --left-panel-width: 280px;
  --right-panel-width: 280px;
}
```

### CSS Modules
Каждый компонент имеет свой `.module.css` файл для изоляции стилей:
- `TopBar.module.css`
- `LeftPanel.module.css`
- `RightPanel.module.css`
- `BrowserView.module.css`
- `FocusOverlay.module.css`

## Горячие клавиши

| Комбинация | Действие | Handler |
|------------|----------|---------|
| `Alt + P` | Добавить инсайт | App.tsx |
| `Ctrl + Shift + F` | Toggle Focus Mode | App.tsx |
| `Enter` (в URL bar) | Навигация | TopBar.tsx |

## Подготовка к Mobile

### Переиспользуемый код
- `src/shared/*` — 100% переиспользуется
- `src/store/*` — переиспользуется с минимальными изменениями
- `src/hooks/usePlatform.ts` — определяет платформу

### Платформо-специфичный код
- `src/components/*` — React Web компоненты
- `electron/*` — только для Electron

### React Native интеграция
```
swaim-browser/
├── src/
│   └── shared/          # ← Используется в RN
│   └── store/           # ← Используется в RN
└── mobile/              # React Native приложение (будущее)
    └── src/
        └── components/  # Нативные компоненты
```
