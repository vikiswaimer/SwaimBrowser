# Swaim Browser

Браузер для фаундеров: **Deep Work** + **Product Discovery Framework**.

Swaim помогает основателям сфокусироваться на работе и системно собирать инсайты во время исследования рынка.

---

## Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd swaim-browser

# 2. Установить зависимости
npm install

# 3. Запустить приложение (режим разработки)
npm run dev
```

Команда `npm run dev` поднимает Vite и открывает окно Electron; приложение грузится с dev-сервера (http://localhost:5173), интерфейс отображается корректно.

Для сборки и запуска из собранных файлов: `npm run electron:dev` (на части систем при загрузке из file:// возможен чёрный экран — в таком случае используйте `npm run dev`).

**Требования:** Node.js >= 18, npm

---

## Горячие клавиши

| Комбинация | Действие |
|------------|----------|
| `Ctrl+Shift+F` | Включить/выключить Focus Mode |
| `Alt+P` | Добавить инсайт с текущей страницы |
| `Cmd+B` / `Ctrl+B` | Открыть/закрыть Sidebar |
| `Enter` (в URL-строке) | Перейти по URL или выполнить поиск |

---

## Функции

### Deep Work (Focus Mode)
- Таймер сессий фокусировки (25 / 50 / 90 минут)
- Блокировка отвлекающих сайтов (YouTube, Twitter, Reddit, Facebook, Instagram, TikTok)
- Установка цели на сессию
- Полноэкранный оверлей с таймером

### Insights (Инсайты)
- Быстрое сохранение мыслей/болей/идей с текущей страницы (`Alt+P`)
- Автоматическая привязка к URL источника
- Локальное хранение данных

### Product Framework (Sidebar)
- Вкладка **Focus** — настройка сессий фокусировки
- Вкладка **Projects** — управление проектами (в разработке)
- Вкладка **Insights** — список последних инсайтов

---

## Сборка

```bash
npm run build         # Все платформы
npm run build:linux   # Linux
npm run build:mac     # macOS
npm run build:win     # Windows
```

После сборки релизы в папке `release/`.

---

## Структура проекта

```
swaim-browser/
├── electron/               # Electron main process
│   ├── main.ts            # Main процесс Electron
│   ├── preload.ts         # Preload (TypeScript, для типов)
│   └── preload.cjs        # Preload (CommonJS, используется в runtime)
├── src/                   # React приложение (renderer)
│   ├── components/        # React компоненты
│   │   ├── TopBar/        # Верхняя панель навигации
│   │   ├── Sidebar/       # Боковая панель
│   │   ├── BrowserView/   # Webview контейнер
│   │   └── FocusOverlay/  # Оверлей режима фокусировки
│   ├── store/             # Zustand stores
│   │   ├── focusStore.ts  # Состояние Focus Mode
│   │   ├── browserStore.ts # Состояние браузера
│   │   ├── sidebarStore.ts # Состояние сайдбара
│   │   └── insightsStore.ts # Состояние инсайтов
│   ├── shared/            # Shared код (для мобильной версии)
│   │   ├── constants.ts   # Константы приложения
│   │   ├── types.ts       # TypeScript типы
│   │   ├── utils.ts       # Утилиты
│   │   └── platform.ts    # Абстракция платформы
│   ├── hooks/             # React хуки
│   ├── lib/               # Сервисы
│   ├── styles/            # CSS стили
│   ├── App.tsx            # Корневой компонент
│   └── main.tsx           # Entry point
├── index.html             # HTML шаблон
├── package.json           # Зависимости и скрипты
├── tsconfig.json          # TypeScript конфигурация
├── vite.config.ts         # Vite конфигурация
└── docs/                  # Документация
```

---

## Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                        Electron                              │
│  ┌─────────────────┐              ┌─────────────────────┐   │
│  │   Main Process  │◄── IPC ────►│   Renderer Process  │   │
│  │   (electron/)   │              │   (React App)       │   │
│  └─────────────────┘              └─────────────────────┘   │
│         │                                    │              │
│         ▼                                    ▼              │
│  electron-store                    Zustand State           │
│  (persistence)                     (UI state)               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Shared Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Constants   │  │    Types     │  │    Utils     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                         │                                    │
│                         ▼                                    │
│              Переиспользуется в Mobile                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Технологии

| Компонент | Технология |
|-----------|------------|
| Desktop Runtime | **Electron** |
| UI Framework | **React 18** + **TypeScript** |
| State Management | **Zustand** |
| Build Tool | **Vite** |
| Packaging | **electron-builder** |
| Storage | **electron-store** |
| Styling | CSS Modules + CSS Variables |

### Почему Electron?

- Лучшая поддержка webview для браузера
- Огромная экосистема и документация
- AI-агенты отлично знают Electron
- Используется в VS Code, Discord, Notion, Arc Browser

---

## Подготовка к мобильной версии

Проект структурирован для будущей мобильной версии:

- **`src/shared/`** — платформо-независимый код (константы, типы, утилиты)
- **`src/shared/platform.ts`** — абстракция платформы (Desktop/Mobile/Web)
- **`src/store/`** — Zustand stores работают на любой платформе
- **`src/hooks/`** — хуки с поддержкой разных платформ

При разработке мобильной версии (React Native):
1. Переиспользуем `src/shared/` целиком
2. Переиспользуем `src/store/` с минимальными изменениями
3. Создаём новые компоненты для мобильного UI

---

## Документация

| Документ | Описание |
|----------|----------|
| [PRD.md](docs/PRD.md) | Скоуп v0.1: что делаем и что НЕ делаем |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Архитектура и компоненты |
| [TECH_STACK_REVIEW.md](TECH_STACK_REVIEW.md) | Обзор и выбор технологий |
| [COMPETITOR_ANALYSIS.md](COMPETITOR_ANALYSIS.md) | Анализ конкурентов |

---

## Дизайн

Минималистичный дизайн в стиле Cursor IDE / Linear:
- Тёмная тема по умолчанию
- Акцентный цвет: `#4f8cff`
- Blur-эффекты для панелей
- Плавные переходы

---

## Лицензия

MIT
