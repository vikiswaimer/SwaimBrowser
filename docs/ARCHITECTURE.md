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

### CSS Variables (Theme)
```css
:root {
  --bg-primary: #0a0b12;
  --bg-secondary: #11151f;
  --accent-primary: #4f8cff;
  --text-primary: #f5f7fa;
  --text-secondary: #a1a8b8;
  --border-primary: rgba(255,255,255,0.08);
}
```

### CSS Modules
Каждый компонент имеет свой `.module.css` файл для изоляции стилей.

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
