/**
 * Κλειδαριά πρόσβασης (Vercel Edge Middleware) — τρέχει ΠΡΙΝ σερβιριστεί
 * οτιδήποτε, σε όλα τα paths. Χωρίς σωστό κωδικό: σελίδα κλειδώματος (401).
 *
 * - Ο κωδικός: η σταθερά CODE παρακάτω. Άλλαξέ τον εδώ και κάνε push.
 * - Ο επισκέπτης που τον βάλει σωστά θυμάται για 30 ημέρες (cookie).
 * - Ξεκλείδωμα ΟΛΩΝ: σβήσε αυτό το αρχείο (ή μετονόμασέ το) και κάνε push.
 * - Τοπικά (npm run dev / astro preview) ΔΕΝ τρέχει — μόνο στο Vercel.
 */

const CODE = 'pisma2026';
const COOKIE = 'pisma_code';
const MAX_AGE_DAYS = 30;

export default function middleware(request: Request): Response | undefined {
  const cookies = request.headers.get('cookie') ?? '';
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]*)`));
  const given = match ? decodeURIComponent(match[1]) : null;

  if (given === CODE) return undefined; // σωστός κωδικός — συνέχισε κανονικά

  const wrong = given !== null && given !== '';
  return new Response(lockPage(wrong), {
    status: 401,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function lockPage(wrong: boolean): string {
  return `<!doctype html>
<html lang="el">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>PISMA — Ιδιωτική πρόσβαση</title>
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    min-height: 100svh; display: flex; align-items: center; justify-content: center;
    background:
      radial-gradient(58% 34% at 82% -4%, rgba(139, 92, 246, .16), transparent 62%),
      radial-gradient(46% 30% at 8% 0%, rgba(238, 79, 39, .10), transparent 60%),
      #0D0A14;
    color: #E6E1F0;
    font-family: 'Commissioner', system-ui, sans-serif;
    padding: 20px;
  }
  .box {
    width: min(100%, 380px); text-align: center;
    background: #171221; border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 18px; padding: 36px 28px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .35), 0 14px 40px rgba(0, 0, 0, .35);
  }
  .logo { font-weight: 800; font-size: 1.6rem; letter-spacing: .01em; color: #F5F2FB; }
  .logo span { color: #FF7A50; }
  .lock { font-size: 1.8rem; margin: 14px 0 6px; }
  p { color: #A79DBB; font-size: .95rem; line-height: 1.55; margin-bottom: 22px; }
  input {
    width: 100%; padding: 14px 16px; font: inherit; font-size: 1.05rem; text-align: center;
    background: #0D0A14; color: #F5F2FB; letter-spacing: .12em;
    border: 1px solid rgba(255, 255, 255, .16); border-radius: 12px; outline: none;
  }
  input:focus { border-color: #FF7A50; }
  button {
    width: 100%; margin-top: 12px; padding: 14px; font: inherit; font-weight: 700; font-size: 1rem;
    color: #fff; background: linear-gradient(92deg, #FF6A3D 0%, #EE4F27 55%, #D63E1B 100%);
    border: 0; border-radius: 12px; cursor: pointer;
  }
  button:active { transform: translateY(1px); }
  .err { color: #FF9B8A; font-size: .88rem; margin: 12px 0 0; display: ${wrong ? 'block' : 'none'}; }
</style>
</head>
<body>
  <form class="box" id="f">
    <div class="logo">PISMA<span>.</span></div>
    <div class="lock" aria-hidden="true">🔒</div>
    <p>Το site είναι προσωρινά κλειδωμένο.<br />Βάλτε τον κωδικό πρόσβασης για να συνεχίσετε.</p>
    <input id="c" type="password" inputmode="text" autocomplete="off" placeholder="Κωδικός" autofocus required />
    <button type="submit">Είσοδος</button>
    <p class="err">Λάθος κωδικός — δοκιμάστε ξανά.</p>
  </form>
  <script>
    document.getElementById('f').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = document.getElementById('c').value.trim();
      if (!v) return;
      document.cookie = '${COOKIE}=' + encodeURIComponent(v) +
        '; Max-Age=' + ${MAX_AGE_DAYS * 24 * 60 * 60} +
        '; Path=/; SameSite=Lax; Secure';
      location.reload();
    });
  </script>
</body>
</html>`;
}
