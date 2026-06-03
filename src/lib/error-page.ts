export function renderErrorPage(error?: any): string {
  const message = error instanceof Error ? error.message : String(error || "Unknown SSR Error");
  const stack = error instanceof Error && error.stack ? error.stack : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Application Error</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #080B14; color: #f8fafc; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 48rem; width: 100%; padding: 2.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); }
      h1 { font-size: 1.5rem; margin: 0 0 0.5rem; color: #ef4444; font-weight: 700; }
      p { color: #94a3b8; margin: 0 0 1.5rem; }
      .error-details { background: #020617; border: 1px solid #334155; padding: 1rem; border-radius: 0.5rem; text-align: left; overflow-x: auto; margin-bottom: 1.5rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; color: #f1f5f9; max-height: 24rem; }
      .error-title { color: #f87171; font-weight: bold; margin-bottom: 0.5rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.625rem 1.25rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; font-weight: 600; }
      .primary { background: #ef4444; color: #fff; }
      .primary:hover { background: #dc2626; }
      .secondary { background: #1e293b; color: #cbd5e1; border-color: #334155; }
      .secondary:hover { background: #334155; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Application Render Error (500)</h1>
      <p>LanceConnect encountered a critical error while rendering this page on the server. Detailed diagnostics are below:</p>
      
      <div class="error-details">
        <div class="error-title">Error: ${message}</div>
        ${stack ? `<pre style="margin: 0; white-space: pre-wrap;">${stack}</pre>` : '<span style="color: #64748b;">No stack trace available.</span>'}
      </div>

      <div class="actions">
        <button class="primary" onclick="location.reload()">Refresh Page</button>
        <a class="secondary" href="/">Go Home</a>
      </div>
    </div>
  </body>
</html>`;
}
