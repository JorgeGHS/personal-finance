# Patrimonio — dashboard personal

Next.js + Vercel KV + precios en vivo (CoinGecko para cripto, Twelve Data para acciones/ETFs).
Protegido con contraseña, datos sincronizados entre dispositivos.

## 1. Subir a GitHub

```bash
cd patrimonio-webapp
git init
git add .
git commit -m "Primera versión del dashboard"
```

Crea un repo nuevo (privado, recomendado — son tus datos financieros) en GitHub y súbelo:

```bash
git remote add origin https://github.com/TU_USUARIO/patrimonio.git
git branch -M main
git push -u origin main
```

## 2. Importar en Vercel

1. Entra en https://vercel.com (login con tu cuenta de GitHub).
2. "Add New…" → "Project" → importa el repo `patrimonio`.
3. Framework se detecta solo (Next.js). No hace falta tocar nada más aquí — **todavía no le des a Deploy**, primero el paso 3.

## 3. Añadir la base de datos (Upstash Redis, vía Marketplace)

Vercel retiró su producto "KV" nativo — ahora se hace a través de la integración de Upstash.

1. Dentro del proyecto en Vercel, ve a la pestaña **Storage**.
2. En "Marketplace Database Providers", click en **Upstash** (tiene una flecha `>`, abre un asistente).
3. Elige **Redis**, capa gratuita, y una región (idealmente Europa).
4. Conéctala al proyecto `personal-finance`. Vercel inyecta automáticamente las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN` (nombres heredados de la época del producto KV nativo, pero es Upstash por debajo) — no tienes que copiarlas a mano.

## 4. Variables de entorno

En **Settings → Environment Variables**, añade:

| Variable | Valor |
|---|---|
| `DASHBOARD_PASSWORD` | la contraseña que quieras usar para entrar |
| `SESSION_SECRET` | una cadena larga aleatoria, p. ej. genera una con `openssl rand -hex 32` |
| `TWELVE_DATA_API_KEY` | tu clave gratuita de https://twelvedata.com (regístrate gratis, plan free = 800 peticiones/día, de sobra) |

## 5. Desplegar

Dale a **Deploy**. Te dará una URL tipo `patrimonio-tuyo.vercel.app`. Puedes añadir un dominio propio luego en Settings → Domains.

La primera vez que entres te pedirá la contraseña; la sesión se guarda 30 días en ese navegador/dispositivo (tendrás que meterla en cada dispositivo la primera vez — móvil y ordenador por separado).

## Desarrollo local (opcional)

```bash
npm install
cp .env.local.example .env.local   # rellena las variables
npm run dev
```

Para probar `/api/holdings` en local sin tener Redis conectado, la app usa automáticamente los datos de partida (`lib/seedData.js`) si Redis falla — no rompe nada, simplemente no persiste hasta que tengas Upstash conectado en producción.

## Notas importantes

- **Símbolos de bolsa**: los ETFs europeos (VUAA, NQSE, IUSA) y SPCX pueden no resolver bien en Twelve Data sin especificar el "exchange" exacto (LSE, Xetra…). Si al pulsar "Actualizar precios" alguno no se actualiza, busca el símbolo correcto en https://twelvedata.com/symbolsearch y ajústalo en la columna "Ticker" de la tabla de posiciones — la app usa el ticker tal cual está escrito ahí.
- **Robeco (Sabadell) y Ledgy** no tienen API pública — esos precios se quedan manuales, edítalos directamente en la tabla cuando tengas el dato nuevo.
- **Seguridad**: la contraseña protege el acceso vía cookie de sesión (30 días). Es una protección razonable para uso personal, pero no es un sistema de autenticación bancario — no compartas la URL ni la contraseña.
- No he podido ejecutar `npm install` / `next build` en el entorno donde escribí este código (sin acceso a red), así que hay una pequeña posibilidad de que el primer build en Vercel saque algún error de sintaxis. Si pasa, pega aquí el log del build y lo arreglo al momento.
