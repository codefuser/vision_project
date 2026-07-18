export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <title>Vision Projector — Error</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        background: linear-gradient(135deg, #0f1117 0%, #1a1b2e 100%);
        color: #f1f5f9;
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
      }
      .card {
        max-width: 28rem;
        width: 100%;
        background: rgba(30, 32, 48, 0.75);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 1rem;
        padding: 2.5rem 2rem;
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }
      .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        margin-bottom: 1.25rem;
        font-size: 24px;
        color: #ef4444;
      }
      h1 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; color: #f1f5f9; }
      p { color: #94a3b8; font-size: 0.875rem; line-height: 1.6; margin: 0 0 1.5rem; }
      .code {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: rgba(239, 68, 68, 0.1);
        font-size: 0.75rem;
        font-family: monospace;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: #ef4444;
        margin-bottom: 1.5rem;
      }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.8125rem;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.15s ease;
      }
      .primary {
        background: rgba(255, 255, 255, 0.08);
        color: #f1f5f9;
        border-color: rgba(99, 102, 241, 0.3);
      }
      .primary:hover { background: rgba(99, 102, 241, 0.15); }
      .secondary {
        background: transparent;
        color: #94a3b8;
        border-color: rgba(255, 255, 255, 0.08);
      }
      .secondary:hover { background: rgba(255, 255, 255, 0.05); color: #f1f5f9; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon">!</div>
      <h1>Something Went Wrong</h1>
      <p>The application encountered an unexpected issue and could not load this page. You can try refreshing or head back home.</p>
      <div class="code">VP-500</div>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Retry</button>
        <a class="secondary" href="/">Home</a>
      </div>
    </div>
  </body>
</html>`;
}
