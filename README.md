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

# 3. Запустить приложение
npm start
```

**Требования:** Node.js >= 18, npm

---

## Горячие клавиши

| Комбинация | Действие |
|------------|----------|
| `Ctrl+Shift+F` | Включить/выключить Focus Mode |
| `Alt+P` | Добавить инсайт с текущей страницы |
| `Esc` | Выйти из Focus Mode |
| `Enter` (в URL-строке) | Перейти по URL или выполнить поиск |

---

## Функции

### Deep Work (Focus Mode)
- Таймер сессий фокусировки (25 / 50 / 90 минут)
- Блокировка отвлекающих сайтов (YouTube, Twitter, Reddit, Facebook, Instagram)
- Установка цели на сессию
- Полноэкранный оверлей с таймером

### Insights (Инсайты)
- Быстрое сохранение мыслей/болей/идей с текущей страницы (`Alt+P`)
- Автоматическая привязка к URL источника
- Локальное хранение данных

### Product Framework (Sidebar)
- Вкладка **Focus** — настройка сессий фокусировки
- Вкладка **Projects** — управление проектами (в разработке)
- Вкладка **Insights** — список последних 5 инсайтов

---

## Сборка

```bash
npm run build         # Все платформы (Linux, macOS, Windows)
npm run build:linux   # Linux (x64)
npm run build:mac     # macOS (x64)
npm run build:win     # Windows (x64)
```

После сборки бинарники в папке `dist/`.

---

## Структура проекта

```
swaim-browser/
├── index.html              # Основное приложение (UI + логика)
├── package.json            # Конфигурация NW.js и зависимости
├── README.md               # Этот файл
├── docs/                   # Документация проекта
│   ├── PRD.md              # Требования продукта, скоуп v0.1
│   ├── ARCHITECTURE.md     # Архитектура и компоненты
│   ├── DATA.md             # Формат данных и API Store
│   ├── requirements.md     # Функциональные требования
│   ├── DEV-CHECKLIST.md    # Чеклист перед коммитом
│   ├── GLOSSARY.md         # Глоссарий терминов
│   └── KNOWN-ISSUES.md     # Известные ограничения и техдолг
├── COMPETITOR_ANALYSIS.md  # Анализ конкурентов
└── TECH_STACK_REVIEW.md    # Обзор технологий
```

---

## Документация

### Для быстрого входа в проект

| Документ | Описание |
|----------|----------|
| [PRD.md](docs/PRD.md) | Скоуп v0.1: что делаем и что НЕ делаем |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Архитектура, UI-компоненты, модули логики |
| [GLOSSARY.md](docs/GLOSSARY.md) | Терминология проекта |

### Для разработки

| Документ | Описание |
|----------|----------|
| [DEV-CHECKLIST.md](docs/DEV-CHECKLIST.md) | Обязательные проверки перед коммитом |
| [DATA.md](docs/DATA.md) | Формат данных, API electron-store |
| [requirements.md](docs/requirements.md) | Функциональные требования с матрицей трассировки |
| [KNOWN-ISSUES.md](docs/KNOWN-ISSUES.md) | Известные ограничения и технический долг |

### Дополнительно

| Документ | Описание |
|----------|----------|
| [COMPETITOR_ANALYSIS.md](COMPETITOR_ANALYSIS.md) | Анализ конкурентов |
| [TECH_STACK_REVIEW.md](TECH_STACK_REVIEW.md) | Обзор и выбор технологий |

---

## Технологии

- **NW.js** — движок для десктоп-приложения на веб-технологиях
- **electron-store** — локальное хранение данных (insights, sessions)
- **Vanilla JS** — без фреймворков, минимальный bundle

---

## Лицензия

MIT
