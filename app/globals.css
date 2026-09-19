:root {
  --bg: #050505; --card: #0c0e08; --ink: #eef1e6; --muted: #9aa090; --line: #2a3300;
  --lime: #c8f000; --lime-dim: #4e6b00; --pos: #8be04e; --neg: #ff6b5e;
  --pixel: "Silkscreen", ui-monospace, "SF Mono", Menlo, monospace;
  --sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI", Roboto, system-ui, sans-serif;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; scroll-padding-top: 64px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } * { animation: none !important; transition: none !important; } }
body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.55 var(--sans); font-variant-numeric: tabular-nums; }
a { color: var(--lime); }
.wrap { max-width: 720px; margin: 0 auto; padding: 0 16px 48px; }

/* nav */
.nav { position: sticky; top: 0; z-index: 10; background: #050505; border-bottom: 1px solid var(--line); }
.nav-in { max-width: 720px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.logo { font-weight: 800; font-style: italic; letter-spacing: -0.02em; color: var(--lime); font-size: 19px; text-decoration: none; }
.nav-links { display: none; gap: 16px; font-size: 13px; }
.nav-links a { color: var(--muted); text-decoration: none; }
@media (min-width: 560px) { .nav-links { display: flex; } }
.pill-tag { font-family: var(--pixel); font-size: 11px; border: 1px solid var(--lime-dim); color: var(--lime); padding: 3px 9px; border-radius: 999px; }
.pill-tag.off { color: var(--muted); border-color: var(--line); }

/* hero */
.hero { padding: 16px 0 8px; }
.frame { border: 1px solid var(--lime-dim); }
.frame-label { font-family: var(--pixel); color: var(--lime); font-size: 13px; padding: 12px 14px; border-bottom: 1px solid var(--lime-dim); line-height: 1.4; }
.hero-body { position: relative; min-height: 460px; display: grid; place-items: center; padding: 28px 14px; overflow: hidden; }
.matrix { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .55; }
.hero-content { position: relative; text-align: center; background: rgba(5,5,5,.88); border: 1px solid var(--line); padding: 26px 18px; width: 100%; max-width: 440px; }
.wordmark { margin: 0; font-size: 46px; line-height: 1.05; font-weight: 800; font-style: italic; letter-spacing: -0.03em; color: var(--lime); }
.tagline { margin: 12px 0 22px; color: var(--ink); font-size: 19px; }
.pills { display: grid; gap: 10px; }
.pill { font-family: var(--pixel); font-size: 14px; letter-spacing: .02em; border: 1px solid var(--lime-dim); background: var(--lime-dim); color: #fff; padding: 12px 18px; border-radius: 999px; text-decoration: none; text-align: center; cursor: pointer; }
.pill.ghost { background: transparent; color: var(--lime); }
.pill[disabled] { opacity: .5; cursor: not-allowed; background: transparent; color: var(--muted); border-color: var(--line); }
.pill:focus-visible, button:focus-visible, input:focus-visible, a:focus-visible { outline: 2px solid var(--lime); outline-offset: 2px; }
@media (min-width: 600px) { .pills { grid-template-columns: repeat(3, auto); justify-content: center; } }

/* sections */
.sec { padding-top: 34px; }
.sec-label { font-family: var(--pixel); color: var(--lime); font-size: 12px; margin-bottom: 6px; }
h2 { margin: 0 0 14px; font-size: 22px; letter-spacing: -0.02em; }
.card { background: var(--card); border: 1px solid var(--line); padding: 20px; margin-bottom: 14px; }
.name { font-size: 17px; font-weight: 650; }
.price { font-size: 46px; font-weight: 650; letter-spacing: -0.035em; line-height: 1.12; margin: 10px 0 4px; }
.muted-lg { font-size: 20px; color: var(--muted); font-weight: 500; letter-spacing: 0; }
.status { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--muted); flex-wrap: wrap; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--lime); flex: none; }
.dot.demo { background: #e0a030; }
.badge { font-size: 11.5px; padding: 2px 7px; border: 1px solid #6b4b00; color: #e0a030; }
.notice { border: 1px solid #5a1f19; background: #1a0b09; color: var(--neg); padding: 12px 14px; font-size: 14px; margin-top: 12px; }
label.big { display: block; font-weight: 650; margin-bottom: 8px; }
.field { display: flex; align-items: center; border: 1px solid var(--lime-dim); padding: 0 14px; background: #000; }
.field:focus-within { border-color: var(--lime); }
.field span { font-size: 24px; color: var(--muted); margin-right: 6px; }
.field input { border: 0; outline: 0; font: inherit; font-size: 26px; font-weight: 600; letter-spacing: -0.02em; width: 100%; padding: 12px 0; background: transparent; color: var(--ink); min-width: 0; }
.field.sm input { font-size: 20px; padding: 9px 0; }
.field.sm span { font-size: 19px; }
.quick { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
button { font: inherit; cursor: pointer; }
.q, .retry { border: 1px solid var(--lime-dim); background: transparent; color: var(--lime); padding: 7px 14px; font-size: 14px; border-radius: 999px; }
.retry { border-radius: 0; margin-top: 8px; }
.err-text { color: var(--neg); font-size: 13.5px; margin-top: 8px; }
.hint { color: var(--muted); font-size: 13px; }
.big-num { font-size: 30px; font-weight: 650; letter-spacing: -0.025em; }
.rows { margin-top: 12px; border-top: 1px solid var(--line); }
.rows div { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--line); font-size: 14px; gap: 12px; }
.rows div span:first-child { color: var(--muted); }
.rows div span:last-child { text-align: right; word-break: break-all; }
.formula { font-size: 12.5px; color: var(--muted); margin-top: 10px; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
th { font-weight: 500; color: var(--muted); text-align: right; padding: 6px 4px; font-size: 12px; }
th:first-child, td:first-child { text-align: left; }
td { text-align: right; padding: 9px 4px; border-top: 1px solid var(--line); white-space: nowrap; }
.pos { color: var(--pos); } .neg { color: var(--neg); }
.pnl { font-weight: 600; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
.two .k { font-size: 12.5px; color: var(--muted); }
.two .v { font-size: 19px; font-weight: 650; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.chip { border: 1px solid var(--line); color: var(--muted); padding: 5px 10px; font-size: 13px; text-decoration: none; }
.chip.on { border-color: var(--lime); color: var(--lime); }
.linkbtn { background: none; border: 0; color: var(--lime); text-decoration: underline; padding: 0; font-size: 14px; margin-top: 12px; }
.check { margin: 0; padding-left: 20px; }
.check li { margin: 8px 0; }
.analyst { border-top: 1px solid var(--line); padding: 14px 0; }
.analyst:first-of-type { border-top: 0; }
.analyst .org { font-weight: 650; }
.warn-box { border: 1px dashed var(--lime-dim); padding: 14px; color: var(--muted); font-size: 14px; }
footer { margin-top: 30px; padding-top: 16px; border-top: 1px solid var(--line); color: var(--muted); font-size: 13px; display: grid; gap: 4px; }
footer b { color: var(--lime); }
@media (max-width: 380px) { .price { font-size: 38px; } .wordmark { font-size: 38px; } th, td { font-size: 12px; } }
