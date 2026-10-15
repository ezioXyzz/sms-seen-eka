# Sri Lanka SMS Sender

A small, secure SMS console for sending transactional messages to Sri Lankan mobile numbers through [Antryk SMS Services](https://docs.antryk.com/communication/sms-services).

## What it does

- Accepts `0771234567`, `077 123 4567`, `+94771234567`, `00947771234567`, and `771234567`.
- Normalizes valid recipients to E.164 (`+94…`).
- Rejects non-Sri Lankan numbers, Sri Lankan landlines, and malformed numbers.
- Limits messages to 1,600 characters.
- Requires the entered sender ID/company name to exactly match `APPROVED_SENDER_ID`.
- Keeps Antryk access and secret keys on the server only.
- Uses the official `@antryk/sdk` package and its documented `/sms/send` flow.

> **Important:** The recipient sees the sender identity configured and approved on the Antryk SMS service. This app does not spoof arbitrary names or send a free-form `from` value. Configure/approve the company sender ID in Antryk first, then set the same value in `APPROVED_SENDER_ID`.

## Local setup

1. Install Node.js 18+.
2. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

3. Fill `.env` with the Antryk values from your account. Do not commit `.env`.
4. Install dependencies and run checks:

   ```bash
   npm install
   npm test
   npm run check
   npm start
   ```

5. Open <http://localhost:3000>.

The app reads these server-side values:

- `ANTRYK_ACCESS_KEY`
- `ANTRYK_SECRET_KEY`
- `ANTRYK_SMS_SERVICE_ID` (UUID of a configured transactional SMS service)
- `APPROVED_SENDER_ID` (the sender identity configured/approved for that service)
- `PORT` (optional, defaults to `3000`)

## GitHub

Create an empty GitHub repository, then run:

```bash
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

Never commit API keys. If a key is exposed, rotate it in Antryk immediately.

## API

`POST /api/sms/send`

```json
{
  "senderId": "ACME",
  "to": "0771234567",
  "message": "Your order is ready."
}
```

The server sends only `serviceId`, normalized `to`, and `body` to Antryk. The access and secret keys are sent through the SDK’s server-side headers.

## Sources

- [Antryk SMS Services](https://docs.antryk.com/communication/sms-services)
- [Antryk Send SMS API](https://docs.antryk.com/api-reference/services/sms/send-sms)
- [@antryk/sdk](https://www.npmjs.com/package/@antryk/sdk)
