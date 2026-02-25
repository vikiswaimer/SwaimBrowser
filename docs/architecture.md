# Архитектура Swaim Browser

## Обзор

Swaim Browser — десктоп-браузер на основе NW.js, ориентированный на продуктивность и product discovery для фаундеров.

## Технический стек

| Компонент | Технология |
|-----------|------------|
| Runtime | NW.js (Chromium + Node.js) |
| UI | HTML/CSS (Vanilla) |
| Логика | JavaScript (ES6+) |
| Хранение данных | electron-store (JSON) |
| Сборка | nw-builder |

## Структура приложения

```
┌─────────────────────────────────────────────────────────┐
│                      Top Bar                            │
│  [Logo] [URL Bar                    ] [← → ⟳ ⚡ 📋]    │
├─────────────────────────────────────────┬───────────────┤
│                                         │   Sidebar     │
│              Webview                    │  ┌─────────┐  │
│           (Браузер)                     │  │ Focus   │  │
│                                         │  │Projects │  │
│                                         │  │Insights │  │
│                                         │  └─────────┘  │
├─────────────────────────────────────────┴───────────────┤
│              Focus Overlay (когда активен)              │
│                    [25:00]                              │
│                   [Goal text]                           │
└─────────────────────────────────────────────────────────┘
```

## Основные модули

### 1. Browser Core
- Webview для отображения веб-страниц
- Навигация (назад, вперед, перезагрузка)
- Адресная строка с поиском

### 2. Focus Mode
- Таймер с countdown
- Блокировка доменов (hardcoded список)
- Overlay поверх контента
- Состояние: `focusActive`, `focusTimer`, `focusTimeLeft`

### 3. Sidebar / Product Framework
- Три вкладки: Focus, Projects, Insights
- Анимированное открытие/закрытие
- Управление сессиями и проектами

### 4. Insights Storage
- Сохранение через `electron-store`
- Структура инсайта:
  ```js
  {
    url: string,
    text: string,
    timestamp: ISO string,
    tags: string[]
  }
  ```

## Горячие клавиши

Обработка в `document.addEventListener('keydown', ...)`:

- `Ctrl+Shift+F` — Toggle Focus Mode
- `Alt+P` — Add Insight

## Хранение данных

Данные сохраняются в JSON через `electron-store`:

| Ключ | Описание |
|------|----------|
| `insights` | Массив объектов инсайтов |
| `sessions` | История focus-сессий (TODO) |
| `projects` | Список проектов (TODO) |

## Блокируемые сайты (Focus Mode)

По умолчанию блокируются:
- youtube.com
- twitter.com
- reddit.com
- facebook.com
- instagram.com

## Планы развития

- [ ] Настраиваемый список блокируемых сайтов
- [ ] Статистика времени фокусировки
- [ ] Экспорт инсайтов в Markdown/Notion
- [ ] Интеграция с task managers
- [ ] Автоматическое извлечение цитат со страниц
