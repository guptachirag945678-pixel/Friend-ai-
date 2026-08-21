# Friend AI — phone-friendly app

This is a small web app with your Express/OpenAI backend and a mobile-friendly chat UI.

## Run
1. Install Node.js.
2. Copy `.env.example` to `.env`.
3. Put your API key in `.env`.
4. Make sure `OPENAI_MODEL` is a model available to your API account.
5. Run:
   npm install
   npm start
6. Open `http://localhost:3000`.

## Important
Keep the API key only in `.env` on the server. Do not put it inside `public/index.html`.

For an actual Android APK, this web app can later be wrapped with Capacitor or another Android wrapper.
