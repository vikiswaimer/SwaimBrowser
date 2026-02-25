# Формат данных и API Store

## Обзор

Swaim Browser использует `electron-store` для персистентного хранения данных. Данные сохраняются в JSON-формате на локальном диске пользователя.

## Инициализация Store

```javascript
const Store = require('electron-store');
const store = new Store();
```

По умолчанию `electron-store` создаёт файл:
- **Windows:** `%APPDATA%/swaim-browser/config.json`
- **macOS:** `~/Library/Application Support/swaim-browser/config.json`
- **Linux:** `~/.config/swaim-browser/config.json`

## Структура данных

### Полная схема config.json

```json
{
  "insights": [
    {
      "url": "string",
      "text": "string",
      "timestamp": "ISO 8601 string",
      "tags": ["string"]
    }
  ],
  "focusSessions": [
    {
      "startTime": "ISO 8601 string",
      "endTime": "ISO 8601 string",
      "duration": "number (minutes)",
      "goal": "string",
      "completed": "boolean"
    }
  ],
  "projects": [
    {
      "id": "string (UUID)",
      "name": "string",
      "description": "string",
      "createdAt": "ISO 8601 string",
      "insights": ["string (insight references)"]
    }
  ],
  "settings": {
    "blockedDomains": ["string"],
    "defaultFocusDuration": "number (minutes)",
    "theme": "string"
  }
}
```

## API Store

### Чтение данных

```javascript
// Получить все инсайты (с default value)
const insights = store.get('insights', []);

// Получить конкретную настройку
const duration = store.get('settings.defaultFocusDuration', 25);
```

### Запись данных

```javascript
// Добавить новый инсайт
store.set('insights', store.get('insights', []).concat({
  url: webview.src,
  text: "Пользователи жалуются на медленную загрузку",
  timestamp: new Date().toISOString(),
  tags: []
}));

// Обновить настройки
store.set('settings.defaultFocusDuration', 50);
```

### Удаление данных

```javascript
// Удалить ключ
store.delete('insights');

// Очистить всё хранилище
store.clear();
```

## Модели данных

### Insight (Инсайт)

Заметка, привязанная к веб-странице.

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `url` | string | ✅ | URL страницы, с которой создан инсайт |
| `text` | string | ✅ | Текст инсайта |
| `timestamp` | string (ISO 8601) | ✅ | Время создания |
| `tags` | string[] | ❌ | Теги для категоризации |

**Пример:**
```json
{
  "url": "https://example.com/pricing",
  "text": "Конкурент не показывает цены на сайте - pain point для B2B",
  "timestamp": "2024-01-15T14:30:00.000Z",
  "tags": ["competitor", "pricing", "pain"]
}
```

### FocusSession (Сессия фокусировки)

Запись о завершённой сессии фокусировки.

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `startTime` | string (ISO 8601) | ✅ | Время начала |
| `endTime` | string (ISO 8601) | ✅ | Время окончания |
| `duration` | number | ✅ | Длительность в минутах |
| `goal` | string | ❌ | Цель сессии |
| `completed` | boolean | ✅ | Завершена ли сессия полностью |

**Пример:**
```json
{
  "startTime": "2024-01-15T09:00:00.000Z",
  "endTime": "2024-01-15T09:25:00.000Z",
  "duration": 25,
  "goal": "Анализ конкурентов",
  "completed": true
}
```

### Project (Проект)

Группировка работы и инсайтов.

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `id` | string (UUID) | ✅ | Уникальный идентификатор |
| `name` | string | ✅ | Название проекта |
| `description` | string | ❌ | Описание |
| `createdAt` | string (ISO 8601) | ✅ | Дата создания |
| `insights` | string[] | ❌ | Связанные инсайты |

**Пример:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Customer Discovery Q1",
  "description": "Исследование потребностей целевой аудитории",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "insights": []
}
```

### Settings (Настройки)

Пользовательские настройки приложения.

| Поле | Тип | Default | Описание |
|------|-----|---------|----------|
| `blockedDomains` | string[] | см. ниже | Домены для блокировки в Focus Mode |
| `defaultFocusDuration` | number | 25 | Длительность сессии по умолчанию (мин) |
| `theme` | string | "dark" | Тема оформления |

**Домены по умолчанию для блокировки:**
```json
["youtube.com", "twitter.com", "reddit.com", "facebook.com", "instagram.com"]
```

## Валидация данных

### Проверка перед записью

```javascript
function validateInsight(insight) {
  if (!insight.url || typeof insight.url !== 'string') {
    throw new Error('Invalid url');
  }
  if (!insight.text || typeof insight.text !== 'string') {
    throw new Error('Invalid text');
  }
  if (!insight.timestamp || isNaN(Date.parse(insight.timestamp))) {
    throw new Error('Invalid timestamp');
  }
  if (insight.tags && !Array.isArray(insight.tags)) {
    throw new Error('Invalid tags');
  }
  return true;
}
```

## Миграции данных

При изменении схемы данных следует использовать версионирование:

```javascript
const store = new Store({
  migrations: {
    '1.0.0': store => {
      // Миграция с версии 0.x
    },
    '2.0.0': store => {
      // Миграция с версии 1.x
    }
  }
});
```

## Бэкап и восстановление

### Экспорт данных

```javascript
const data = store.store; // Получить всё содержимое
const json = JSON.stringify(data, null, 2);
// Сохранить в файл
```

### Импорт данных

```javascript
const data = JSON.parse(jsonString);
store.store = data; // Заменить всё содержимое
```

## Частые ошибки

### 1. Перезапись вместо добавления

❌ **Неправильно:**
```javascript
store.set('insights', [newInsight]); // Удалит все старые!
```

✅ **Правильно:**
```javascript
store.set('insights', store.get('insights', []).concat(newInsight));
```

### 2. Отсутствие default value

❌ **Неправильно:**
```javascript
const insights = store.get('insights');
insights.forEach(...); // TypeError если insights === undefined
```

✅ **Правильно:**
```javascript
const insights = store.get('insights', []);
insights.forEach(...);
```

### 3. Невалидный timestamp

❌ **Неправильно:**
```javascript
timestamp: Date.now() // число, не ISO string
```

✅ **Правильно:**
```javascript
timestamp: new Date().toISOString() // "2024-01-15T14:30:00.000Z"
```
