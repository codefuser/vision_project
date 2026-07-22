export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <title>Vision Projector â€” Error</title>
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

const KNOWN_ROUTE_PREFIXES = [
  "/",
  "/library",
  "/file-manager",
  "/songs",
  "/bible",
  "/media",
  "/history",
  "/playlists",
  "/project",
  "/service",
  "/settings",
  "/shortcuts",
  "/contact",
  "/roadmap",
  "/developer-hub",
  "/assets",
  "/_build",
  "/_tanstack",
  "/favicon",
];

export function isNotFoundRequest(pathname: string): boolean {
  if (pathname === "/") return false;
  // Ignore static assets & file extensions
  if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|json|woff|woff2|ttf|eot)$/i.test(pathname)) {
    return false;
  }
  return !KNOWN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

export function renderNotFoundPage(): string {
  return `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <title>Vision Projector — 404</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        background: #080a12;
        color: #f1f5f9;
        display: grid;
        place-items: center;
        min-height: 100vh;
        overflow: hidden;
        position: relative;
      }
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        background:
          radial-gradient(ellipse 600px 400px at 30% 20%, rgba(99,102,241,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 500px 500px at 70% 80%, rgba(139,92,246,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 300px 300px at 50% 50%, rgba(129,140,248,0.04) 0%, transparent 50%);
        pointer-events: none;
      }
      body::after {
        content: '';
        position: fixed;
        inset: 0;
        background: radial-gradient(ellipse 100% 60% at 50% 100%, rgba(0,0,0,0.4) 0%, transparent 70%);
        pointer-events: none;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      @keyframes breathe {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(1.02); }
      }
      @keyframes digit-sep {
        0% { letter-spacing: 0px; opacity: 0.3; }
        100% { letter-spacing: 6px; opacity: 1; }
      }
      @keyframes glow-pulse {
        0%, 100% { opacity: 0.15; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(1.15); }
      }
      @keyframes particle-float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 0.06; }
        90% { opacity: 0.03; }
        100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
      }
      @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      .particle {
        position: fixed;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: #818cf8;
        pointer-events: none;
        animation: particle-float linear infinite;
      }

      .card {
        position: relative;
        z-index: 1;
        max-width: 420px;
        width: 100%;
        background: rgba(12,14,24,0.65);
        backdrop-filter: blur(40px);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 28px;
        padding: 3rem 2rem 2rem;
        text-align: center;
        box-shadow:
          0 0 0 1px rgba(99,102,241,0.06),
          0 0 40px rgba(99,102,241,0.04),
          0 25px 80px -12px rgba(0,0,0,0.6);
        animation: fade-in-up 0.5s ease-out both;
      }
      .card-glow {
        position: absolute;
        inset: -1px;
        border-radius: 28px;
        background: linear-gradient(135deg, rgba(99,102,241,0.06), transparent 40%, rgba(139,92,246,0.04) 70%, transparent);
        pointer-events: none;
      }

      .digit-group {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        margin-bottom: 1.5rem;
        height: 72px;
      }
      .digit {
        font-size: 72px;
        font-weight: 800;
        line-height: 1;
        background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: digit-sep 0.8s ease-out 0.2s both, breathe 4s ease-in-out 1.2s infinite;
        letter-spacing: 0px;
      }
      .digit:nth-child(2) { animation-delay: 0.35s, 1.35s; }
      .digit:nth-child(3) { animation-delay: 0.5s, 1.5s; }

      .digit-glow {
        position: absolute;
        width: 180px;
        height: 40px;
        border-radius: 50%;
        background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%);
        animation: glow-pulse 3s ease-in-out infinite;
        pointer-events: none;
        margin-top: -8px;
      }

      h1 {
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.75rem;
        color: rgba(255,255,255,0.7);
        letter-spacing: 0.02em;
      }
      p {
        color: rgba(255,255,255,0.4);
        font-size: 0.8125rem;
        line-height: 1.7;
        margin: 0 auto 1.5rem;
        max-width: 30ch;
      }

      .code-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.2rem 0.8rem;
        border-radius: 999px;
        background: rgba(99,102,241,0.08);
        font-size: 0.6875rem;
        font-family: monospace;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: #818cf8;
        margin-bottom: 1.5rem;
      }

      .actions {
        display: flex;
        gap: 0.625rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 1.25rem;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        border-radius: 12px;
        font-size: 0.8125rem;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        border: none;
        transition: all 0.15s ease;
        background: rgba(255,255,255,0.04);
        color: rgba(255,255,255,0.6);
        border: 1px solid rgba(255,255,255,0.06);
      }
      .btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); }
      .btn-primary {
        background: rgba(99,102,241,0.12);
        color: #a5b4fc;
        border-color: rgba(99,102,241,0.2);
      }
      .btn-primary:hover { background: rgba(99,102,241,0.2); }

      .divider {
        height: 1px;
        background: rgba(255,255,255,0.04);
        margin: 0.75rem 0;
      }

      .tech-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        padding: 0.5rem;
        width: 100%;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.75rem;
        color: rgba(255,255,255,0.25);
        transition: color 0.15s;
      }
      .tech-toggle:hover { color: rgba(255,255,255,0.5); }
      .tech-toggle .arrow { transition: transform 0.2s; }
      .tech-toggle.open .arrow { transform: rotate(180deg); }

      .tech-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      .tech-content.open { max-height: 300px; }

      .tech-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.375rem 0.75rem;
        font-size: 0.6875rem;
      }
      .tech-label {
        color: rgba(255,255,255,0.2);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        min-width: 5rem;
        text-align: right;
      }
      .tech-value {
        color: rgba(255,255,255,0.35);
        font-family: monospace;
        word-break: break-all;
      }

      .bottom-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
      }
      .bottom-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.6875rem;
        color: rgba(255,255,255,0.2);
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        transition: color 0.15s;
      }
      .bottom-btn:hover { color: rgba(255,255,255,0.5); }

      .toast {
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(12px);
        font-size: 0.75rem;
        color: rgba(255,255,255,0.7);
        opacity: 0;
        transition: opacity 0.25s;
        pointer-events: none;
      }
      .toast.show { opacity: 1; }
    </style>
  </head>
  <body>
    <div id="toast" class="toast"></div>

    <div class="card">
      <div class="card-glow"></div>

      <div class="digit-group">
        <span class="digit">4</span>
        <span class="digit">0</span>
        <span class="digit">4</span>
      </div>
      <div class="digit-glow" style="margin: -48px auto 0; position:relative; top:-8px;"></div>

      <h1>Page Not Found</h1>
      <p>The page you're trying to open doesn't exist or may have been removed.<br/>Please verify the address or return to the Home screen.</p>

      <span class="code-badge">VP-404</span>

      <div class="actions">
        <a href="/library" class="btn btn-primary">Go Home</a>
        <button class="btn" onclick="history.back()">Go Back</button>
        <button class="btn" onclick="location.reload()">Retry</button>
      </div>

      <div class="divider"></div>

      <button class="tech-toggle" onclick="toggleTech()">
        <span>Technical Details</span>
        <span class="arrow">&#8964;</span>
      </button>
      <div id="tech" class="tech-content">
        <div class="tech-row">
          <span class="tech-label">URL</span>
          <span class="tech-value" id="tech-url"></span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Time</span>
          <span class="tech-value" id="tech-ts"></span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Version</span>
          <span class="tech-value">1.0.0</span>
        </div>
        <div class="tech-row">
          <span class="tech-label">Code</span>
          <span class="tech-value">VP-404</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="bottom-actions">
        <button class="bottom-btn" onclick="copyError()">Copy Error</button>
        <button class="bottom-btn" onclick="saveScreenshot()">Save Screenshot</button>
      </div>
    </div>

    <script>
      var ts = new Date();
      var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      var pad = function(n){ return String(n).padStart(2,"0"); };
      var tsStr = days[ts.getDay()] + ", " + months[ts.getMonth()] + " " + ts.getDate() + ", " + ts.getFullYear() + " at " + pad(ts.getHours()) + ":" + pad(ts.getMinutes()) + ":" + pad(ts.getSeconds());
      document.getElementById("tech-url").textContent = window.location.href;
      document.getElementById("tech-ts").textContent = tsStr;

      function toggleTech(){
        var t = document.getElementById("tech");
        var b = document.querySelector(".tech-toggle");
        t.classList.toggle("open");
        b.classList.toggle("open");
      }

      function showToast(msg){
        var t = document.getElementById("toast");
        t.textContent = msg;
        t.classList.add("show");
        setTimeout(function(){ t.classList.remove("show"); }, 2000);
      }

      function copyError(){
        var report = [
          "= Vision Projector - 404 Report =",
          "",
          "Error Code:    VP-404",
          "Title:         Page Not Found",
          "",
          "URL:           " + window.location.href,
          "Timestamp:     " + tsStr,
          "Version:       1.0.0",
          "",
          "= End of Report ="
        ].join("\\n");
        navigator.clipboard.writeText(report).then(function(){
          showToast("Report copied");
        }).catch(function(){
          showToast("Could not copy");
        });
      }

      function saveScreenshot(){
        var c = document.createElement("canvas");
        var w = 640, h = 540;
        c.width = w * 2;
        c.height = h * 2;
        var ctx = c.getContext("2d");
        if(!ctx){ showToast("Could not save"); return; }
        ctx.scale(2, 2);

        var grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#080a12");
        grad.addColorStop(1, "#0c0e18");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        var cw = 560, ch = 480;
        var cx0 = (w - cw)/2, cy0 = (h - ch)/2;

        ctx.fillStyle = "rgba(12,14,24,0.85)";
        roundRect(ctx, cx0, cy0, cw, ch, 28);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        roundRect(ctx, cx0, cy0, cw, ch, 28);
        ctx.stroke();

        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "bold 60px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("404", w/2, cy0 + 80);

        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("Page Not Found", w/2, cy0 + 125);

        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "13px sans-serif";
        ctx.fillText("The page you requested does not exist", w/2, cy0 + 160);
        ctx.fillText("or may have been moved.", w/2, cy0 + 180);

        ctx.fillStyle = "#818cf8";
        ctx.font = "bold 11px monospace";
        ctx.fillText("VP-404", w/2, cy0 + 215);

        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx0 + 32, cy0 + 240);
        ctx.lineTo(cx0 + cw - 32, cy0 + 240);
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = "11px sans-serif";
        var u = window.location.href;
        ctx.fillText("URL: " + (u.length > 45 ? u.slice(0,45)+"..." : u), cx0 + 32, cy0 + 275);
        ctx.fillText("Time: " + tsStr, cx0 + 32, cy0 + 298);
        ctx.fillText("Version: 1.0.0", cx0 + 32, cy0 + 321);

        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.font = "10px sans-serif";
        ctx.fillText("Vision Projector - 404 Report", w/2, cy0 + ch - 16);

        c.toBlob(function(blob){
          if(!blob){ showToast("Could not save"); return; }
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "vision-projector-404-" + Date.now() + ".png";
          a.click();
          URL.revokeObjectURL(url);
          showToast("Screenshot saved");
        }, "image/png");
      }

      function roundRect(ctx, x, y, w, h, r){
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r);
        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h);
        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
      }
    </script>
  </body>
</html>`;
}
