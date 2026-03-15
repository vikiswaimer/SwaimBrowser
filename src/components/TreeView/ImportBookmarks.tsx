import { useState, useCallback, useRef } from 'react';
import { useProjectsStore } from '@store';
import { IMPORT_SOURCES } from '@shared';
import type { ImportedBookmark, BookmarkImportSource } from '@shared';
import styles from './ImportBookmarks.module.css';

interface ImportBookmarksProps {
  onClose: () => void;
}

interface ChromeBookmark {
  name: string;
  url?: string;
  children?: ChromeBookmark[];
}

interface NotionExport {
  title?: string;
  url?: string;
  children?: NotionExport[];
  type?: string;
}

function parseHTMLBookmarks(html: string): ImportedBookmark[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const bookmarks: ImportedBookmark[] = [];

  function parseNode(element: Element): ImportedBookmark | null {
    if (element.tagName === 'A') {
      return {
        title: element.textContent?.trim() || 'Untitled',
        url: element.getAttribute('href') || undefined,
      };
    }

    if (element.tagName === 'DT') {
      const anchor = element.querySelector(':scope > a');
      if (anchor) {
        return {
          title: anchor.textContent?.trim() || 'Untitled',
          url: anchor.getAttribute('href') || undefined,
        };
      }

      const folder = element.querySelector(':scope > h3');
      if (folder) {
        const children: ImportedBookmark[] = [];
        const dl = element.querySelector(':scope > dl');
        if (dl) {
          dl.querySelectorAll(':scope > dt').forEach(dt => {
            const parsed = parseNode(dt);
            if (parsed) children.push(parsed);
          });
        }
        return {
          title: folder.textContent?.trim() || 'Folder',
          children: children.length > 0 ? children : undefined,
        };
      }
    }

    return null;
  }

  const rootDL = doc.querySelector('dl');
  if (rootDL) {
    rootDL.querySelectorAll(':scope > dt').forEach(dt => {
      const parsed = parseNode(dt);
      if (parsed) bookmarks.push(parsed);
    });
  }

  return bookmarks;
}

function parseChromeJSON(json: string): ImportedBookmark[] {
  try {
    const data = JSON.parse(json);
    
    function convertNode(node: ChromeBookmark): ImportedBookmark {
      return {
        title: node.name || 'Untitled',
        url: node.url,
        children: node.children?.map(convertNode),
      };
    }

    if (data.roots) {
      const bookmarks: ImportedBookmark[] = [];
      if (data.roots.bookmark_bar) {
        bookmarks.push({
          title: 'Bookmarks Bar',
          children: data.roots.bookmark_bar.children?.map(convertNode),
        });
      }
      if (data.roots.other) {
        bookmarks.push({
          title: 'Other Bookmarks',
          children: data.roots.other.children?.map(convertNode),
        });
      }
      return bookmarks;
    }

    if (Array.isArray(data)) {
      return data.map(convertNode);
    }

    return [convertNode(data)];
  } catch {
    console.error('Failed to parse Chrome JSON');
    return [];
  }
}

function parseNotionExport(json: string): ImportedBookmark[] {
  try {
    const data = JSON.parse(json);
    
    function convertNode(node: NotionExport): ImportedBookmark {
      const hasUrl = Boolean(node.url);
      return {
        title: node.title || 'Untitled',
        url: hasUrl ? node.url : undefined,
        children: node.children?.map(convertNode),
      };
    }

    if (Array.isArray(data)) {
      return data.map(convertNode);
    }

    if (data.results && Array.isArray(data.results)) {
      return data.results.map((item: NotionExport) => ({
        title: item.title || (item as { properties?: { Name?: { title?: Array<{ plain_text?: string }> } } }).properties?.Name?.title?.[0]?.plain_text || 'Untitled',
        url: item.url,
        children: item.children?.map(convertNode),
      }));
    }

    return [convertNode(data)];
  } catch {
    console.error('Failed to parse Notion export');
    return [];
  }
}

function parseGenericJSON(json: string): ImportedBookmark[] {
  try {
    const data = JSON.parse(json);
    
    function convertNode(node: Record<string, unknown>): ImportedBookmark {
      const title = (node.title || node.name || node.label || 'Untitled') as string;
      const url = (node.url || node.href || node.link) as string | undefined;
      const children = (node.children || node.items || node.bookmarks) as Array<Record<string, unknown>> | undefined;
      
      return {
        title,
        url,
        children: children?.map(convertNode),
      };
    }

    if (Array.isArray(data)) {
      return data.map(convertNode);
    }

    return [convertNode(data)];
  } catch {
    console.error('Failed to parse JSON');
    return [];
  }
}

export function ImportBookmarks({ onClose }: ImportBookmarksProps) {
  const [selectedSource, setSelectedSource] = useState<BookmarkImportSource['type'] | null>(null);
  const [preview, setPreview] = useState<ImportedBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importBookmarks } = useProjectsStore();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      let parsed: ImportedBookmark[] = [];

      if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        parsed = parseHTMLBookmarks(text);
      } else if (file.name.endsWith('.json')) {
        if (selectedSource === 'chrome') {
          parsed = parseChromeJSON(text);
        } else if (selectedSource === 'notion') {
          parsed = parseNotionExport(text);
        } else {
          parsed = parseGenericJSON(text);
        }
      } else {
        setError('Unsupported file format. Please use HTML or JSON.');
        return;
      }

      if (parsed.length === 0) {
        setError('No bookmarks found in the file.');
        return;
      }

      setPreview(parsed);
    } catch {
      setError('Failed to read file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSource]);

  const handleImport = useCallback(() => {
    if (preview.length === 0) return;

    importBookmarks(preview);
    onClose();
  }, [preview, importBookmarks, onClose]);

  const countBookmarks = useCallback((items: ImportedBookmark[]): number => {
    return items.reduce((count, item) => {
      const childCount = item.children ? countBookmarks(item.children) : 0;
      return count + 1 + childCount;
    }, 0);
  }, []);

  const getAcceptedFormats = (source: BookmarkImportSource['type'] | null): string => {
    switch (source) {
      case 'chrome':
      case 'firefox':
      case 'safari':
      case 'edge':
        return '.html,.htm,.json';
      case 'notion':
      case 'json':
        return '.json';
      default:
        return '.html,.htm,.json';
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>Import Bookmarks</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </header>

        <div className={styles.content}>
          {!selectedSource && (
            <div className={styles.sources}>
              <p className={styles.instruction}>Select import source:</p>
              {IMPORT_SOURCES.map((source) => (
                <button
                  key={source.type}
                  className={styles.sourceBtn}
                  onClick={() => setSelectedSource(source.type)}
                >
                  <span className={styles.sourceIcon}>
                    {getSourceIcon(source.type)}
                  </span>
                  <span className={styles.sourceName}>{source.name}</span>
                </button>
              ))}
            </div>
          )}

          {selectedSource && preview.length === 0 && (
            <div className={styles.upload}>
              <button
                className={styles.backBtn}
                onClick={() => {
                  setSelectedSource(null);
                  setError(null);
                }}
              >
                ← Back to sources
              </button>

              <div className={styles.instructions}>
                {getInstructions(selectedSource)}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptedFormats(selectedSource)}
                onChange={handleFileSelect}
                className={styles.fileInput}
              />

              <button
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Select File'}
              </button>

              {error && <p className={styles.error}>{error}</p>}
            </div>
          )}

          {preview.length > 0 && (
            <div className={styles.preview}>
              <p className={styles.previewInfo}>
                Found {countBookmarks(preview)} items to import:
              </p>
              <div className={styles.previewTree}>
                {renderPreviewTree(preview)}
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setPreview([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Cancel
                </button>
                <button className={styles.importBtn} onClick={handleImport}>
                  Import All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getSourceIcon(type: BookmarkImportSource['type']): JSX.Element {
  const iconPaths: Record<string, JSX.Element> = {
    chrome: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="var(--accent-primary)" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" fill="var(--accent-primary)" />
      </svg>
    ),
    firefox: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="var(--warning)" strokeWidth="1.5" />
        <path d="M7 10C7 8.34315 8.34315 7 10 7" stroke="var(--warning)" strokeWidth="1.5" />
      </svg>
    ),
    safari: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="var(--info)" strokeWidth="1.5" />
        <path d="M10 4V7M10 13V16M4 10H7M13 10H16" stroke="var(--info)" strokeWidth="1" />
      </svg>
    ),
    edge: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18" stroke="var(--success)" strokeWidth="1.5" />
        <path d="M10 18C5.58172 18 2 14.4183 2 10C2 7 4 4 7 3" stroke="var(--success)" strokeWidth="1.5" />
      </svg>
    ),
    notion: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="var(--text-secondary)" strokeWidth="1.5" />
        <path d="M6 7H14M6 10H11M6 13H9" stroke="var(--text-secondary)" strokeWidth="1" />
      </svg>
    ),
    json: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6 4C4.89543 4 4 4.89543 4 6V8C4 9.10457 3.10457 10 2 10C3.10457 10 4 10.8954 4 12V14C4 15.1046 4.89543 16 6 16" stroke="var(--accent-secondary)" strokeWidth="1.5" />
        <path d="M14 4C15.1046 4 16 4.89543 16 6V8C16 9.10457 16.8954 10 18 10C16.8954 10 16 10.8954 16 12V14C16 15.1046 15.1046 16 14 16" stroke="var(--accent-secondary)" strokeWidth="1.5" />
      </svg>
    ),
  };
  return iconPaths[type] || iconPaths.json;
}

function getInstructions(type: BookmarkImportSource['type']): JSX.Element {
  const instructions: Record<string, JSX.Element> = {
    chrome: (
      <div>
        <p><strong>Google Chrome:</strong></p>
        <ol>
          <li>Open Chrome and go to <code>chrome://bookmarks</code></li>
          <li>Click the ⋮ menu → Export bookmarks</li>
          <li>Save the HTML file and upload it here</li>
        </ol>
      </div>
    ),
    firefox: (
      <div>
        <p><strong>Mozilla Firefox:</strong></p>
        <ol>
          <li>Open Firefox and press Ctrl+Shift+B</li>
          <li>Click Import and Backup → Export Bookmarks to HTML</li>
          <li>Save the file and upload it here</li>
        </ol>
      </div>
    ),
    safari: (
      <div>
        <p><strong>Safari:</strong></p>
        <ol>
          <li>Open Safari and go to File → Export Bookmarks</li>
          <li>Save the HTML file and upload it here</li>
        </ol>
      </div>
    ),
    edge: (
      <div>
        <p><strong>Microsoft Edge:</strong></p>
        <ol>
          <li>Open Edge and go to <code>edge://favorites</code></li>
          <li>Click ⋮ → Export favorites</li>
          <li>Save the HTML file and upload it here</li>
        </ol>
      </div>
    ),
    notion: (
      <div>
        <p><strong>Notion:</strong></p>
        <ol>
          <li>Open your Notion workspace</li>
          <li>Go to Settings → Export → Export all workspace content</li>
          <li>Choose JSON format and upload the file here</li>
        </ol>
      </div>
    ),
    json: (
      <div>
        <p><strong>JSON File:</strong></p>
        <p>Upload a JSON file with bookmarks in the following format:</p>
        <pre className={styles.codeBlock}>{`[
  {
    "title": "Folder Name",
    "children": [
      { "title": "Bookmark", "url": "..." }
    ]
  }
]`}</pre>
      </div>
    ),
  };
  return instructions[type] || instructions.json;
}

function renderPreviewTree(items: ImportedBookmark[], depth: number = 0): JSX.Element[] {
  const MAX_PREVIEW_DEPTH = 3;
  const MAX_ITEMS_PER_LEVEL = 10;

  return items.slice(0, MAX_ITEMS_PER_LEVEL).map((item, index) => (
    <div key={index} className={styles.previewItem} style={{ paddingLeft: `${depth * 16}px` }}>
      <span className={styles.previewIcon}>
        {item.children ? '📁' : '🔖'}
      </span>
      <span className={styles.previewTitle}>{item.title}</span>
      {item.children && depth < MAX_PREVIEW_DEPTH && (
        <div className={styles.previewChildren}>
          {renderPreviewTree(item.children, depth + 1)}
          {item.children.length > MAX_ITEMS_PER_LEVEL && (
            <span className={styles.previewMore}>
              +{item.children.length - MAX_ITEMS_PER_LEVEL} more...
            </span>
          )}
        </div>
      )}
    </div>
  ));
}
