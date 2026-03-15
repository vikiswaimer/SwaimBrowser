# 💡 Банк идей Swaim Browser

> **Версия:** 1.0  
> **Дата создания:** 2026-03-15  
> **Цель:** 100 гипотез развития продукта с учётом анализа конкурентов и вдохновения из Cursor, Notion, Linear

---

## Содержание

1. [UI/UX (Вдохновение: Cursor, Notion, Linear)](#1-uiux-вдохновение-cursor-notion-linear)
2. [Focus & Productivity](#2-focus--productivity)
3. [Insights & Knowledge Management](#3-insights--knowledge-management)
4. [AI-функции](#4-ai-функции)
5. [Интеграции](#5-интеграции)
6. [Геймификация](#6-геймификация)
7. [Командная работа](#7-командная-работа)
8. [Мобильность & Синхронизация](#8-мобильность--синхронизация)
9. [Браузерные функции](#9-браузерные-функции)
10. [Персонализация & Настройки](#10-персонализация--настройки)
11. [Аналитика & Отчёты](#11-аналитика--отчёты)
12. [Безопасность & Приватность](#12-безопасность--приватность)

---

## 1. UI/UX (Вдохновение: Cursor, Notion, Linear)

### Command Palette (стиль Cursor/Linear)

| # | Гипотеза | Описание | Вдохновение |
|---|----------|----------|-------------|
| 1 | **Command Palette (⌘K)** | Глобальный поиск и действия через ⌘K/Ctrl+K — навигация, команды, инсайты, проекты | Cursor, Linear |
| 2 | **Fuzzy Search** | Нечёткий поиск по всем сущностям: URL, инсайты, команды, настройки | Cursor |
| 3 | **Quick Actions** | Контекстные действия через ⌘J: "Save insight", "Start focus", "Block site" | Linear |
| 4 | **Slash Commands** | В любом поле ввода / для вызова команд: /focus, /insight, /search | Notion |
| 5 | **Keyboard-First Navigation** | Полное управление без мыши через vim-style биндинги | Linear |

### Minimal UI (стиль Linear)

| # | Гипотеза | Описание | Вдохновение |
|---|----------|----------|-------------|
| 6 | **Zen Mode** | Скрытие всего UI кроме контента — максимальный минимализм | Cursor |
| 7 | **Auto-Hide Sidebar** | Автоматическое скрытие sidebar при отсутствии взаимодействия | Linear |
| 8 | **Compact Mode** | Уменьшенный UI для маленьких экранов / больше пространства для контента | Linear |
| 9 | **Focus Spotlight** | При Focus Mode затемнять все элементы UI кроме активной зоны | Cursor |
| 10 | **Transparent Overlays** | Полупрозрачные панели поверх контента вместо solid блоков | Arc |

### Typography & Design System

| # | Гипотеза | Описание | Вдохновение |
|---|----------|----------|-------------|
| 11 | **Notion-style Blocks** | Инсайты как drag-and-drop блоки разных типов | Notion |
| 12 | **Multi-Column Layout** | Kanban-view для инсайтов по проектам/статусам | Notion, Linear |
| 13 | **Smooth Animations** | Микроанимации для всех переходов (60fps) | Linear |
| 14 | **Dark/Light Themes** | Переключение тем с автоопределением системной | All |
| 15 | **Custom Accent Colors** | Выбор акцентного цвета для персонализации | Linear |

### Navigation

| # | Гипотеза | Описание | Вдохновление |
|---|----------|----------|-------------|
| 16 | **Breadcrumbs** | Хлебные крошки для навигации: Project > Research > Insight | Notion |
| 17 | **Quick Switcher** | ⌘+Tab для переключения между недавними страницами/проектами | Arc |
| 18 | **Split View** | Два сайта рядом для сравнения | Arc, Vivaldi |
| 19 | **Picture-in-Picture** | Плавающее окно для видео во время работы | Browser API |
| 20 | **Hover Previews** | Предпросмотр ссылок при наведении | Notion |

---

## 2. Focus & Productivity

### Таймер & Сессии

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| 21 | **Custom Durations** | Пользовательские длительности сессий (не только 25/50/90) | P1 |
| 22 | **Breaks Configuration** | Настройка коротких/длинных перерывов между сессиями | P1 |
| 23 | **Auto-Start Next Session** | Автоматический старт следующей сессии после перерыва | P2 |
| 24 | **Scheduled Focus** | Запланированные сессии по расписанию | P2 |
| 25 | **Focus Music Integration** | Встроенные ambient/focus звуки или интеграция со Spotify | P3 |

### Блокировка сайтов

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| 26 | **Friction Mode** | Не блокировать, но добавить 30-сек задержку с вопросом "Зачем?" | P1 |
| 27 | **Allowlist per Project** | Разные списки разрешённых сайтов для разных проектов | P1 |
| 28 | **Time Limits** | Лимит времени на отвлекающие сайты (5 мин Reddit в день) | P2 |
| 29 | **Nuclear Mode** | Невозможно отключить блокировку до конца сессии | P2 |
| 30 | **Pattern Detection** | AI детектирует паттерны прокрастинации и предупреждает | P3 |

### Цели & Задачи

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| 31 | **Session Goals** | Обязательная формулировка цели перед сессией | P0 |
| 32 | **Goal Templates** | Шаблоны целей: "Research X", "Write draft of Y" | P2 |
| 33 | **Task Breakdown** | Разбивка большой цели на мини-задачи внутри сессии | P2 |
| 34 | **End-of-Session Review** | Форма рефлексии: что удалось, что мешало | P1 |
| 35 | **Goal Completion Tracking** | Статистика % выполненных целей | P2 |

---

## 3. Insights & Knowledge Management

### Capture

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| 36 | **Selection Capture** | Выделить текст → сохранить как инсайт с контекстом | P0 |
| 37 | **Screenshot Capture** | Скриншот области с аннотациями | P1 |
| 38 | **Voice Notes** | Голосовые заметки с автотранскрипцией | P2 |
| 39 | **Quick Tags** | Теги через # прямо в тексте инсайта | P1 |
| 40 | **Floating Widget** | Плавающая кнопка capture на любой странице | P1 |

### Organization

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| 41 | **Folders/Collections** | Организация инсайтов в папки и коллекции | P1 |
| 42 | **Bi-directional Links** | Связи между инсайтами [[link]] стиль | P2 |
| 43 | **Knowledge Graph** | Визуализация связей между инсайтами | P3 |
| 44 | **Timeline View** | Хронологический вид исследования | P2 |
| 45 | **Table/Database View** | Notion-style database для инсайтов с фильтрами | P2 |

### Search & Discovery

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| 46 | **Full-Text Search** | Поиск по содержимому всех инсайтов | P0 |
| 47 | **Filter by Date/Tag/Project** | Комбинированные фильтры | P1 |
| 48 | **Similar Insights** | "Похожие инсайты" на основе контента | P2 |
| 49 | **Saved Searches** | Сохранённые поисковые запросы | P2 |
| 50 | **Recent Activity** | Лента недавних добавлений/изменений | P1 |

---

## 4. AI-функции

### Content Processing

| # | Гипотеза | Описание | Модель |
|---|----------|----------|--------|
| 51 | **Auto-Summary** | Автоматическое резюме страницы при сохранении | Claude/GPT |
| 52 | **Key Points Extraction** | Выделение ключевых тезисов из статьи | Claude/GPT |
| 53 | **Auto-Tagging** | AI предлагает теги на основе контента | Local NLP |
| 54 | **Sentiment Analysis** | Определение тональности (для исследования конкурентов) | Local NLP |
| 55 | **Language Translation** | Перевод инсайтов на другие языки | API |

### Research Assistant

| # | Гипотеза | Описание | Модель |
|---|----------|----------|--------|
| 56 | **Ask Questions** | Задать вопрос по собранным инсайтам | RAG + Claude |
| 57 | **Find Contradictions** | AI находит противоречия между инсайтами | Claude |
| 58 | **Generate Hypotheses** | На основе инсайтов генерирует гипотезы для проверки | Claude |
| 59 | **Competitive Analysis** | Автоматический анализ страниц конкурентов | Claude |
| 60 | **Writing Assistant** | Помощь в формулировке на основе инсайтов | Claude |

### Automation

| # | Гипотеза | Описание | Модель |
|---|----------|----------|--------|
| 61 | **Smart Categorization** | Автоматическая раскладка по проектам | ML |
| 62 | **Duplicate Detection** | Предупреждение о похожих инсайтах | Embeddings |
| 63 | **Weekly Digest** | AI-generated дайджест за неделю | Claude |
| 64 | **Action Items** | Извлечение action items из инсайтов | Claude |
| 65 | **Meeting Notes** | Структурирование заметок со встреч | Claude |

---

## 5. Интеграции

### Task Management

| # | Гипотеза | Описание | Сервис |
|---|----------|----------|--------|
| 66 | **Linear Sync** | Двусторонняя синхронизация с Linear issues | Linear API |
| 67 | **Jira Integration** | Создание задач в Jira из инсайтов | Jira API |
| 68 | **Todoist Sync** | Синхронизация целей сессий с Todoist | Todoist API |
| 69 | **Asana Integration** | Интеграция с Asana проектами | Asana API |
| 70 | **GitHub Issues** | Превращение инсайтов в GitHub issues | GitHub API |

### Knowledge Base

| # | Гипотеза | Описание | Сервис |
|---|----------|----------|--------|
| 71 | **Notion Export** | Экспорт инсайтов в Notion pages | Notion API |
| 72 | **Obsidian Sync** | Синхронизация с Obsidian vault | Local files |
| 73 | **Confluence Push** | Публикация исследований в Confluence | Confluence API |
| 74 | **Google Docs Export** | Экспорт в Google Docs | Google API |
| 75 | **Markdown Export** | Экспорт в .md файлы | Local |

### Communication

| # | Гипотеза | Описание | Сервис |
|---|----------|----------|--------|
| 76 | **Slack Sharing** | Шеринг инсайтов в Slack каналы | Slack API |
| 77 | **Slack Status** | Автоматический статус "In Focus Mode" | Slack API |
| 78 | **Calendar Integration** | Блокировка времени в календаре для focus | Google/Outlook |
| 79 | **Email Digest** | Еженедельный email с прогрессом | SMTP |
| 80 | **Webhook API** | Custom webhooks для автоматизаций | REST |

---

## 6. Геймификация

### Progress & Achievements

| # | Гипотеза | Описание | Механика |
|---|----------|----------|----------|
| 81 | **Daily Streaks** | Последовательные дни с focus сессиями | Counter |
| 82 | **Badges System** | Достижения: "10 hours focused", "100 insights" | Achievements |
| 83 | **Weekly Goals** | Цели на неделю с прогресс-баром | Progress |
| 84 | **Levels & XP** | Система уровней за активность | XP Points |
| 85 | **Leaderboards** | Рейтинг среди друзей/команды (опционально) | Social |

### Motivation

| # | Гипотеза | Описание | Механика |
|---|----------|----------|----------|
| 86 | **Daily Challenges** | Ежедневные мини-челленджи | Quests |
| 87 | **Focus Score** | Оценка качества сессии (без отвлечений) | Score |
| 88 | **Rewards System** | Разблокировка тем/функций за достижения | Unlocks |
| 89 | **Accountability Partner** | Сопряжение с другом для взаимного контроля | Social |
| 90 | **Real-World Impact** | Посадка деревьев за focus время (как Forest) | Charity |

---

## 7. Командная работа

### Shared Workspaces

| # | Гипотеза | Описание | Tier |
|---|----------|----------|------|
| 91 | **Team Workspaces** | Общие рабочие пространства для команды | Team |
| 92 | **Shared Projects** | Совместные проекты с инсайтами | Team |
| 93 | **Comments & Threads** | Комментарии к инсайтам коллег | Team |
| 94 | **@Mentions** | Упоминания коллег в инсайтах | Team |
| 95 | **Activity Feed** | Лента активности команды | Team |

### Administration

| # | Гипотеза | Описание | Tier |
|---|----------|----------|------|
| 96 | **Roles & Permissions** | Admin, Editor, Viewer роли | Enterprise |
| 97 | **Team Analytics** | Статистика продуктивности команды | Enterprise |
| 98 | **SSO Integration** | Single Sign-On (Okta, Azure AD) | Enterprise |
| 99 | **Audit Logs** | Журнал действий для compliance | Enterprise |
| 100 | **Custom Onboarding** | Персонализированный онбординг для новых членов | Enterprise |

---

## 8. Мобильность & Синхронизация

### Mobile Experience

| # | Гипотеза | Описание | Platform |
|---|----------|----------|----------|
| — | **iOS Companion App** | Просмотр и добавление инсайтов на iOS | iOS |
| — | **Android App** | Версия для Android | Android |
| — | **Share Extension** | Сохранение из любого приложения | iOS/Android |
| — | **Widget** | Виджет с focus статусом и quick capture | iOS/Android |
| — | **Offline Mode** | Работа без интернета с синхронизацией | All |

### Sync

| # | Гипотеза | Описание | Backend |
|---|----------|----------|---------|
| — | **Real-Time Sync** | Мгновенная синхронизация между устройствами | WebSocket |
| — | **Conflict Resolution** | Умное разрешение конфликтов редактирования | CRDT |
| — | **Version History** | История изменений инсайтов | Backend |
| — | **Selective Sync** | Выбор проектов для синхронизации | Backend |
| — | **End-to-End Encryption** | Шифрование данных | Security |

---

## 9. Браузерные функции

### Tab Management

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| — | **Tabs Support** | Множественные вкладки браузера | P0 (v0.2) |
| — | **Tab Groups** | Группировка вкладок по проектам | P1 |
| — | **Tab Sleep** | Усыпление неактивных вкладок для экономии памяти | P2 |
| — | **Session Restore** | Восстановление сессии после перезапуска | P1 |
| — | **Tab Search** | Поиск по открытым вкладкам | P1 |

### Browsing

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| — | **Reading Mode** | Очистка страницы от лишнего для чтения | P1 |
| — | **Bookmarks** | Система закладок с папками | P1 |
| — | **History Search** | Полнотекстовый поиск по истории | P2 |
| — | **Downloads Manager** | Управление загрузками | P2 |
| — | **PDF Viewer** | Встроенный просмотр PDF с аннотациями | P2 |

---

## 10. Персонализация & Настройки

### Customization

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| — | **Custom Themes** | Создание собственных тем оформления | P2 |
| — | **Keyboard Shortcuts** | Настройка горячих клавиш | P1 |
| — | **Sidebar Layout** | Drag-and-drop для перестановки секций sidebar | P2 |
| — | **Default Home Page** | Настройка стартовой страницы | P1 |
| — | **Language Support** | Мультиязычность интерфейса | P1 |

### Preferences

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| — | **Notification Settings** | Гранулярные настройки уведомлений | P1 |
| — | **Sound Settings** | Выбор звуков для разных событий | P2 |
| — | **Data Export** | Экспорт всех данных в JSON/CSV | P1 |
| — | **Import from Other Apps** | Импорт из Raindrop, Pocket, etc. | P2 |
| — | **Backup & Restore** | Резервное копирование настроек | P1 |

---

## 11. Аналитика & Отчёты

### Personal Analytics

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| — | **Focus Time Charts** | Графики времени в focus режиме | P1 |
| — | **Productivity Trends** | Тренды продуктивности за период | P1 |
| — | **Site Usage Stats** | Статистика посещённых сайтов | P2 |
| — | **Distraction Reports** | Отчёт о попытках зайти на заблокированные сайты | P1 |
| — | **Goal Completion Rate** | Процент выполненных целей сессий | P1 |

### Reports

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| — | **Weekly Summary** | Автоматический недельный отчёт | P1 |
| — | **Monthly Deep Dive** | Детальный месячный анализ | P2 |
| — | **Project Reports** | Отчёты по проектам | P2 |
| — | **Export Reports** | PDF/PNG экспорт отчётов | P2 |
| — | **Custom Dashboards** | Создание своих дашбордов | P3 |

---

## 12. Безопасность & Приватность

### Data Protection

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| — | **Local-First Storage** | Все данные хранятся локально по умолчанию | P0 |
| — | **Optional Cloud Sync** | Опциональная синхронизация в облако | P1 |
| — | **Zero-Knowledge Encryption** | Шифрование, недоступное даже нам | P2 |
| — | **Data Deletion** | Полное удаление данных по запросу | P0 |
| — | **Privacy Mode** | Режим без сбора аналитики | P1 |

### Security

| # | Гипотеза | Описание | Приоритет |
|---|----------|----------|-----------|
| — | **App Lock** | Защита приложения PIN/биометрией | P2 |
| — | **Auto-Lock** | Автоблокировка при неактивности | P2 |
| — | **Secure Notes** | Зашифрованные инсайты для чувствительных данных | P3 |
| — | **Two-Factor Auth** | 2FA для облачного аккаунта | P1 |
| — | **Session Management** | Управление активными сессиями | P2 |

---

## 📊 Приоритизация: Top-20 для v0.2-v0.3

На основе ICE Score (Impact × Confidence × Ease):

| # | Гипотеза | ICE | Версия |
|---|----------|-----|--------|
| 1 | Command Palette (⌘K) | 27 | v0.2 |
| 36 | Selection Capture | 27 | v0.2 |
| 46 | Full-Text Search | 26 | v0.2 |
| 26 | Friction Mode | 25 | v0.2 |
| 31 | Session Goals (улучшение) | 25 | v0.2 |
| 81 | Daily Streaks | 24 | v0.2 |
| 21 | Custom Durations | 24 | v0.2 |
| 39 | Quick Tags | 23 | v0.2 |
| 51 | Auto-Summary | 22 | v0.3 |
| 34 | End-of-Session Review | 22 | v0.2 |
| 14 | Dark/Light Themes | 21 | v0.2 |
| 41 | Folders/Collections | 21 | v0.2 |
| 71 | Notion Export | 20 | v0.3 |
| 66 | Linear Sync | 20 | v0.3 |
| 82 | Badges System | 19 | v0.2 |
| 6 | Zen Mode | 19 | v0.2 |
| 53 | Auto-Tagging | 18 | v0.3 |
| 45 | Table/Database View | 18 | v0.3 |
| 77 | Slack Status | 17 | v0.3 |
| 56 | Ask Questions (RAG) | 17 | v0.4 |

---

## 🔗 Интеграции: Основание для архитектуры

### Integration Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Swaim Browser Core                       │
├─────────────────────────────────────────────────────────────┤
│                   Integration Layer                         │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│  │ Task APIs   │ Knowledge   │ Communication│ Analytics  │  │
│  │             │ Base APIs   │ APIs         │ APIs       │  │
│  │ • Linear    │ • Notion    │ • Slack      │ • Mixpanel │  │
│  │ • Jira      │ • Obsidian  │ • Email      │ • Amplitude│  │
│  │ • Todoist   │ • Confluence│ • Calendar   │ • PostHog  │  │
│  │ • Asana     │ • Roam      │ • Webhooks   │            │  │
│  │ • GitHub    │             │              │            │  │
│  └─────────────┴─────────────┴─────────────┴─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Sync Engine                             │
│  • Real-time sync (WebSocket)                               │
│  • Conflict resolution (CRDT)                               │
│  • Offline queue                                            │
│  • Rate limiting & retry                                    │
└─────────────────────────────────────────────────────────────┘
```

### Integration Interface (TypeScript)

```typescript
interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  
  // Auth
  connect(): Promise<AuthResult>;
  disconnect(): Promise<void>;
  
  // Capabilities
  capabilities: {
    export: boolean;
    import: boolean;
    sync: boolean;
    realtime: boolean;
  };
  
  // Operations
  exportInsight(insight: Insight): Promise<ExternalRef>;
  importItems?(): Promise<Insight[]>;
  sync?(): Promise<SyncResult>;
}
```

### Priority Integrations Roadmap

| Версия | Интеграции | Тип |
|--------|------------|-----|
| v0.2 | Markdown Export, JSON Export | Local |
| v0.3 | Notion, Linear | API |
| v0.4 | Slack, Calendar | API |
| v0.5 | Jira, Confluence, Asana | API |
| v1.0 | Webhook API, Public API | Developer |

---

## 🎨 UI Inspiration Board

### От Cursor

- **AI-first interface** — AI не скрыт, а является центральным элементом
- **Command Palette** — ⌘K для всего
- **Minimal Chrome** — максимум пространства для контента
- **Inline Actions** — действия появляются в контексте
- **Dark Theme Default** — профессиональный вид

### От Notion

- **Block-based content** — всё является блоком
- **Database Views** — таблицы, kanban, календарь, галерея
- **Slash Commands** — /команды в любом поле
- **Toggles & Callouts** — структурирование контента
- **Templates** — шаблоны для повторяющихся структур

### От Linear

- **Speed** — мгновенный отклик, оптимистичные обновления
- **Keyboard-first** — всё доступно с клавиатуры
- **Clean Typography** — читаемость превыше всего
- **Subtle Animations** — плавность без излишеств
- **Status-driven UI** — цветовое кодирование состояний

### UI Component Library Goals

```
Components to Build:
├── CommandPalette (⌘K)
├── QuickActions (⌘J)
├── ToastNotifications
├── ContextMenus
├── Modal Dialogs (Non-blocking)
├── Inline Editors
├── Progress Indicators
├── Tag Chips
├── Avatar Stacks
├── Timeline Components
└── Chart Components
```

---

## 📝 Следующие шаги

1. **Валидация гипотез** — провести user interviews по топ-20 идеям
2. **Прототипирование** — создать Figma прототипы для UI идей
3. **Technical Spike** — исследовать integration layer архитектуру
4. **Roadmap Update** — обновить PRD.md с учётом приоритизации
5. **Community Feedback** — собрать обратную связь от beta users

---

*Этот документ — живой банк идей. Обновляйте приоритеты и статусы по мере развития продукта.*

*См. также:*
- *[COMPETITOR_ANALYSIS.md](./COMPETITOR_ANALYSIS.md) — детальный анализ конкурентов*
- *[docs/PRD.md](./docs/PRD.md) — Product Requirements Document*
- *[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — техническая архитектура*
