# Deployment

This project can run anywhere that supports Node.js 22+ or Docker.

## Docker

Build and run it with environment variables supplied at runtime:

```bash
docker build -t sri-lanka-sms-sender .
docker run --rm -p 3000:3000 \
  -e ANTRYK_ACCESS_KEY='your-access-key' \
  -e ANTRYK_SECRET_KEY='your-secret-key' \
  -e ANTRYK_SMS_SERVICE_ID='your-service-uuid' \
  -e APPROVED_SENDER_ID='YOURCOMPANY' \
  sri-lanka-sms-sender
```

Do not put secrets into the Dockerfile or commit them into the repository.

## Node hosting

Use Node.js 22 or newer:

```bash
npm ci --omit=dev
npm start
```

Set the same four environment variables in the host dashboard. The application listens on `PORT` when supplied and defaults to `3000`.

## Before sending live SMS

1. Create or select a **Transactional SMS Service** in Antryk.
2. Configure and obtain approval for the company sender ID according to your provider/carrier requirements.
3. Set `APPROVED_SENDER_ID` to exactly that approved value.
4. Set `ANTRYK_SMS_SERVICE_ID` to the configured service UUID.
5. Test with an authorized recipient before broader use.
