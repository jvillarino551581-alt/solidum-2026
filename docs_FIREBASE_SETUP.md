# SOLIDUM 2026 — Firebase Firestore Setup

## 1. Create a Firebase Project
1. Go to https://console.firebase.google.com -> **Add project** -> name it `solidum-2026`
2. (Google Analytics optional — can skip)

## 2. Enable Firestore
1. Left menu -> **Build** -> **Firestore Database**
2. **Create database** -> choose production mode (or test mode if you want open during dev, then lock down) -> pick a region (e.g. `asia-southeast1`, `us-central1`)

## 3. Create the collections
Firestore is auto-schema, but you can create empty containers for clarity:
1. **Collections** -> add collection `rsvps`
2. **Collections** -> add collection `attendance`

Documents are created by the app:
- `rsvps` doc id = **UUID**, fields: `timestamp, uuid, name, yearLevel, email, idNumber, allergens, qrToken, emailSent, createdAt`
- `attendance` doc id = **UUID**, fields: `uuid, idNumber, name, yearLevel, checkInTime, scannedBy, status`

## 4. Service Account (Admin SDK key)
1. Project settings (gear) -> **Service accounts** tab
2. **Generate new private key** -> downloads a JSON file
3. From that JSON:
   - `project_id` -> `FIREBASE_PROJECT_ID`
   - `client_email` -> `FIREBASE_CLIENT_EMAIL`
   - `private_key` -> `FIREBASE_PRIVATE_KEY` (wrap the whole value in quotes, keep the literal `\n` newlines)
4. Admin SDK needs the **Firestore** permission — the default `Firebase Admin SDK` service account has full access. No sharing step needed (unlike Sheets).

## 5. Security Rules (important!)
Rules -> Firestore Database -> Rules. Lock down to no client access (server-admin bypasses rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
This allows **only the Admin SDK server** (our API routes) to read/write. Users never touch Firestore directly.

## 6. Gmail App Password
1. Google Account -> Security -> 2-Step Verification -> App Passwords
2. Create app e.g. `SOLIDUM Mail` -> copy 16-char password -> `GMAIL_APP_PASSWORD`
3. `GMAIL_USER` is the Gmail address used to send the QR emails

## 7. Env
Create `.env.local` locally (copy from `.env.example`), and set the same in **Vercel -> Settings -> Environment Variables**:
```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
ADMIN_PASSWORD=...
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## 8. Test
- `npm run dev` -> `/rsvp` -> submit -> check Firestore `rsvps` for the new doc
- `/login` with `ADMIN_PASSWORD` -> `/scan` -> scan -> check `attendance`
- `/admin` shows totals + export CSV

## 9. Attendance Flow (Day-of)
- Staff logs in at `/login` (shared password)
- Opens `/scan` on a phone, allows camera
- Scans participant QR -> green = checked in, yellow = already in, red = invalid
- Monitor live at `/admin`