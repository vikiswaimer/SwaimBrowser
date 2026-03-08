# Глоссарий терминов Swaim Browser

Единая терминология для разработки и документации.

> **Скоуп v0.1:** см. [PRD.md](./PRD.md) — что делаем и что НЕ делаем

---

## Ключевые концепции

| Термин | Определение |
|--------|-------------|
| **Deep Work** | Состояние глубокой концентрации на когнитивно сложной задаче без отвлечений |
| **Focus Session** | Ограниченный по времени период работы (25/50/90 мин) с блокировкой отвлекающих сайтов |
| **Insight** | Ценная информация или идея, извлечённая из веб-страницы и сохранённая в системе |
| **Product Framework** | Встроенная система управления продуктовыми задачами в боковой панели браузера |
| **Blocked Domains** | Список сайтов, доступ к которым ограничивается во время Focus Session |

---

## Технологический стек

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| **Electron** | v28 | Desktop runtime, main/renderer процессы |
| **React** | v18 | UI framework |
| **TypeScript** | v5 | Типизация |
| **Zustand** | — | State management |
| **Vite** | — | Build tool и dev server |
| **electron-store** | — | Персистентное хранение данных |
| **electron-builder** | — | Сборка и упаковка приложения |

---

## Архитектурные слои

| Слой | Описание | Папка |
|------|----------|-------|
| **Presentation Layer** | React-компоненты UI | `src/components/` |
| **State Layer** | Zustand stores | `src/store/` |
| **Service Layer** | Storage, platform adapters | `src/lib/` |
| **Shared Layer** | Кроссплатформенный код (types, utils, constants) | `src/shared/` |
| **Electron Layer** | Main process, preload, IPC | `electron/` |

---

## Electron Process Model

| Термин | Описание | Файл |
|--------|----------|------|
| **Main Process** | Главный процесс Node.js: окна, IPC handlers, electron-store | `electron/main.ts` |
| **Renderer Process** | React приложение в BrowserWindow | `src/` |
| **Preload Script** | Безопасный мост main↔renderer через contextBridge | `electron/preload.ts` |
| **IPC** | Inter-Process Communication для store, window controls | `ipcMain`, `ipcRenderer` |
| **ElectronAPI** | Типизированный интерфейс `window.electron` | `electron/preload.ts` |

---

## UI-компоненты

| Компонент | Описание | Папка |
|-----------|----------|-------|
| **TopBar** | Верхняя панель: лого, навигация, URL bar, кнопки Focus/Sidebar | `src/components/TopBar/` |
| **Sidebar** | Боковая панель с вкладками Focus/Projects/Insights | `src/components/Sidebar/` |
| **BrowserView** | Обёртка над `<webview>` для отображения веб-страниц | `src/components/BrowserView/` |
| **FocusOverlay** | Полноэкранный оверлей с таймером во время Focus Session | `src/components/FocusOverlay/` |

---

## Zustand Stores

### useBrowserStore

| Поле | Тип | Описание |
|------|-----|----------|
| `currentUrl` | `string` | Текущий URL в webview |
| `inputValue` | `string` | Значение в URL bar |
| `isLoading` | `boolean` | Индикатор загрузки страницы |
| `canGoBack` | `boolean` | Доступна ли навигация назад |
| `canGoForward` | `boolean` | Доступна ли навигация вперёд |
| `pageTitle` | `string` | Заголовок страницы |

### useFocusStore

| Поле | Тип | Описание |
|------|-----|----------|
| `isActive` | `boolean` | Активна ли Focus Session |
| `remainingSeconds` | `number` | Оставшееся время в секундах |
| `currentGoal` | `string` | Цель текущей сессии |
| `selectedDuration` | `FocusDuration` | Выбранная длительность (25/50/90) |
| `currentSession` | `FocusSession \| null` | Текущая активная сессия |
| `sessions` | `FocusSession[]` | История сессий |
| `timerDisplay` | `string` | Отформатированное время "MM:SS" |

### useInsightsStore

| Поле | Тип | Описание |
|------|-----|----------|
| `insights` | `Insight[]` | Все инсайты |
| `recentInsights` | `Insight[]` | Последние N инсайтов |

### useSidebarStore

| Поле | Тип | Описание |
|------|-----|----------|
| `isOpen` | `boolean` | Открыт ли sidebar |
| `activeTab` | `SidebarTab` | Активная вкладка |

---

## Типы данных (src/shared/types.ts)

### Insight

```typescript
{
  id: string;          // Уникальный ID
  url: string;         // URL страницы источника
  text: string;        // Текст инсайта
  timestamp: string;   // ISO 8601 datetime
  tags: string[];      // Теги для категоризации
  projectId?: string;  // Связь с проектом (опционально)
}
```

### FocusSession

```typescript
{
  id: string;
  startTime: string;           // ISO 8601
  endTime?: string;            // ISO 8601 (после завершения)
  durationMinutes: number;     // 25 | 50 | 90
  goal: string;                // Цель сессии
  completed: boolean;          // Завершена ли полностью
  blockedAttempts: BlockedAttempt[]; // Попытки перейти на заблокированные сайты
}
```

### BlockedAttempt

```typescript
{
  domain: string;      // Домен, на который пытались перейти
  timestamp: string;   // Время попытки
}
```

### Project

```typescript
{
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```

### UserSettings

```typescript
{
  theme: 'dark' | 'light' | 'system';
  defaultFocusDuration: number;
  customBlockedDomains: string[];
  showBlockedNotifications: boolean;
  autoStartBreak: boolean;
  soundEnabled: boolean;
}
```

### Служебные типы

| Тип | Значения | Описание |
|-----|----------|----------|
| `SidebarTab` | `'focus' \| 'projects' \| 'insights'` | Вкладки sidebar |
| `FocusDuration` | `25 \| 50 \| 90` | Доступные длительности сессий |
| `Platform` | `'desktop' \| 'mobile' \| 'web'` | Целевая платформа |

---

## Конфигурация (src/shared/constants.ts)

### APP_CONFIG

| Константа | Значение | Описание |
|-----------|----------|----------|
| `NAME` | `'Swaim Browser'` | Название приложения |
| `VERSION` | `'0.2.0'` | Текущая версия |

### FOCUS_CONFIG

| Константа | Значение | Описание |
|-----------|----------|----------|
| `DEFAULT_DURATION_MINUTES` | `25` | Длительность по умолчанию |
| `TIMER_INTERVAL_MS` | `1000` | Интервал обновления таймера |
| `SECONDS_PER_MINUTE` | `60` | Секунд в минуте |
| `SESSION_DURATIONS` | `[25, 50, 90]` | Доступные длительности |

### BROWSER_CONFIG

| Константа | Значение | Описание |
|-----------|----------|----------|
| `DEFAULT_SEARCH_ENGINE` | `'https://www.google.com/search?q='` | Поисковик |
| `DEFAULT_PROTOCOL` | `'https://'` | Протокол по умолчанию |
| `DEFAULT_HOME_URL` | `'https://swaimapp.com'` | Домашняя страница |

### UI_CONFIG

| Константа | Значение | Описание |
|-----------|----------|----------|
| `SIDEBAR_WIDTH` | `320` | Ширина sidebar в px |
| `TOPBAR_HEIGHT` | `52` | Высота topbar в px |
| `RECENT_INSIGHTS_COUNT` | `5` | Кол-во недавних инсайтов |
| `RECENT_SESSIONS_COUNT` | `10` | Кол-во недавних сессий |

### STORAGE_KEYS

| Ключ | Значение | Описание |
|------|----------|----------|
| `INSIGHTS` | `'insights'` | Ключ для хранения инсайтов |
| `SESSIONS` | `'sessions'` | Ключ для хранения сессий |
| `SETTINGS` | `'settings'` | Ключ для настроек |
| `PROJECTS` | `'projects'` | Ключ для проектов |

### BLOCKED_DOMAINS

Заблокированные домены по умолчанию:
- `youtube.com`
- `twitter.com`
- `x.com`
- `reddit.com`
- `facebook.com`
- `instagram.com`
- `tiktok.com`

---

## Утилиты (src/shared/utils.ts)

| Функция | Сигнатура | Описание |
|---------|-----------|----------|
| `generateId` | `() => string` | Генерация уникального ID |
| `formatTimeDisplay` | `(seconds: number) => string` | Форматирование "MM:SS" |
| `normalizeUrl` | `(input: string) => string \| null` | Нормализация URL или поискового запроса |
| `extractDomainFromUrl` | `(url: string) => string` | Извлечение домена из URL |
| `isBlockedDomain` | `(url: string, custom?: string[]) => boolean` | Проверка на заблокированный домен |
| `minutesToSeconds` | `(minutes: number) => number` | Конвертация минут в секунды |
| `formatDate` | `(isoString: string) => string` | Форматирование даты на русском |
| `debounce` | `(fn, wait) => fn` | Debounce функции |
| `throttle` | `(fn, limit) => fn` | Throttle функции |

---

## Platform Abstraction (src/shared/platform.ts)

### Интерфейсы адаптеров

| Адаптер | Методы | Описание |
|---------|--------|----------|
| `StorageAdapter` | `get`, `set`, `delete`, `clear` | Абстракция хранилища |
| `NotificationAdapter` | `show`, `requestPermission` | Абстракция уведомлений |
| `HapticsAdapter` | `impact`, `notification` | Абстракция вибрации (mobile) |

### PlatformCapabilities

| Capability | Desktop | Mobile | Web |
|------------|---------|--------|-----|
| `hasNotifications` | ✅ | ✅ | ✅ |
| `hasHaptics` | ❌ | ✅ | ❌ |
| `hasWebView` | ✅ | ✅ | ❌ |
| `hasNativeMenu` | ✅ | ❌ | ❌ |
| `hasSystemTray` | ✅ | ❌ | ❌ |
| `hasBiometrics` | ❌ | ✅ | ❌ |

### detectPlatform()

Определяет платформу по наличию:
- `window.electron` → `'desktop'`
- `window.ReactNativeWebView` → `'mobile'`
- иначе → `'web'`

---

## Storage Service (src/lib/storage.ts)

| Класс | Платформа | Backend |
|-------|-----------|---------|
| `ElectronStorageAdapter` | Desktop | electron-store через IPC |
| `WebStorageAdapter` | Web/Mobile | localStorage |

Экспортируемые функции:
- `storage` — инстанс адаптера
- `saveToStorage(key, value)` — сохранение
- `loadFromStorage(key, defaultValue)` — загрузка

---

## Горячие клавиши (HOTKEYS)

| Комбинация | Действие | Константа |
|------------|----------|-----------|
| `Alt + P` | Добавить инсайт с текущей страницы | `HOTKEYS.ADD_INSIGHT` |
| `Ctrl + Shift + F` | Включить/выключить Focus Mode | `HOTKEYS.TOGGLE_FOCUS` |
| `Cmd + B` | Открыть/закрыть Sidebar | `HOTKEYS.TOGGLE_SIDEBAR` |
| `Enter` (в URL bar) | Навигация по URL или поиск | — |

---

## Навигация

| Элемент | ID/Компонент | Описание |
|---------|--------------|----------|
| **Back** | TopBar | Назад по истории браузера |
| **Forward** | TopBar | Вперёд по истории |
| **Reload** | TopBar | Перезагрузить страницу |
| **URL Input** | TopBar | Поле ввода URL/поискового запроса |
| **Home** | TopBar | Переход на домашнюю страницу |

---

## CSS Architecture

### CSS Variables (Theme)

```css
:root {
  --bg-primary: #0a0b12;       /* Фон приложения */
  --bg-secondary: #11151f;     /* Фон панелей */
  --accent-primary: #4f8cff;   /* Акцентный цвет */
  --text-primary: #f5f7fa;     /* Основной текст */
  --text-secondary: #a1a8b8;   /* Приглушённый текст */
  --border-primary: rgba(255,255,255,0.08); /* Границы */
}
```

### CSS Modules

Каждый компонент имеет свой `.module.css` файл для изоляции стилей:
- `TopBar.module.css`
- `Sidebar.module.css`
- `BrowserView.module.css`
- `FocusOverlay.module.css`

---

## Структура проекта

```
swaim-browser/
├── electron/               # Electron main process
│   ├── main.ts            # Главный процесс, IPC handlers
│   └── preload.ts         # Preload скрипт, ElectronAPI
├── src/                   # React приложение (Renderer)
│   ├── components/        # UI компоненты
│   │   ├── TopBar/
│   │   ├── Sidebar/
│   │   ├── BrowserView/
│   │   └── FocusOverlay/
│   ├── store/             # Zustand stores
│   │   ├── browserStore.ts
│   │   ├── focusStore.ts
│   │   ├── insightsStore.ts
│   │   └── sidebarStore.ts
│   ├── shared/            # Кроссплатформенный код
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── platform.ts
│   ├── hooks/             # React хуки
│   │   ├── useStorage.ts
│   │   └── usePlatform.ts
│   ├── lib/               # Сервисы
│   │   └── storage.ts
│   └── styles/            # Глобальные стили
│       └── theme.css
├── docs/                  # Документация
└── index.html             # Entry point
```

---

## Data Flow

```
User Action → React Component → Zustand Store → State Update
                                      │
                                      ▼ (если персистентность)
                              storage.set() → IPC → electron-store
```

---

*См. также:*
- *[ARCHITECTURE.md](./ARCHITECTURE.md) — детальная архитектура*
- *[DATA.md](./DATA.md) — форматы данных и API Store*
- *[PRD.md](./PRD.md) — скоуп и приоритеты v0.1*
- *[DEV-CHECKLIST.md](./DEV-CHECKLIST.md) — чеклист перед коммитом*
- *[KNOWN-ISSUES.md](./KNOWN-ISSUES.md) — известные ограничения*
