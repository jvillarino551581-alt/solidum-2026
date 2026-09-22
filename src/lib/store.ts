import {
  initializeApp,
  cert,
  getApps,
  getApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, FieldValue, type Firestore } from "firebase-admin/firestore";

let app: App | null = null;
let db: Firestore | null = null;

function getFirestoreClient() {
  if (db) return db;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY"
    );
  }

  if (!app) {
    app =
      getApps().length > 0
        ? getApp()
        : initializeApp({
            credential: cert({ projectId, clientEmail, privateKey }),
          });
  }
  db = getFirestore(app);
  return db;
}

export type RSVPRow = {
  timestamp: string;
  uuid: string;
  name: string;
  yearLevel: string;
  email: string;
  idNumber: string;
  allergens: string;
  qrToken: string;
  emailSent: string;
};

export type AttendanceRow = {
  uuid: string;
  idNumber: string;
  name: string;
  yearLevel: string;
  checkInTime: string;
  scannedBy: string;
  status: string;
};

const RSVP_COLLECTION = "rsvps";
const ATTENDANCE_COLLECTION = "attendance";

// RSVP ops
export async function appendRSVP(row: RSVPRow) {
  const db = getFirestoreClient();
  await db.collection(RSVP_COLLECTION).doc(row.uuid).set({
    ...row,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function getAllRSVPs(): Promise<RSVPRow[]> {
  const db = getFirestoreClient();
  const snap = await db
    .collection(RSVP_COLLECTION)
    .orderBy("createdAt", "asc")
    .get();
  return snap.docs.map(
    (d) =>
      ({
        timestamp: d.data().timestamp ?? "",
        uuid: d.data().uuid ?? d.id,
        name: d.data().name ?? "",
        yearLevel: d.data().yearLevel ?? "",
        email: d.data().email ?? "",
        idNumber: d.data().idNumber ?? "",
        allergens: d.data().allergens ?? "",
        qrToken: d.data().qrToken ?? "",
        emailSent: d.data().emailSent ?? "",
      }) as RSVPRow
  );
}

export async function findRSVPByUUID(uuid: string): Promise<RSVPRow | null> {
  const db = getFirestoreClient();
  const doc = await db.collection(RSVP_COLLECTION).doc(uuid).get();
  if (!doc.exists) return null;
  const data = doc.data() as Partial<RSVPRow>;
  return {
    timestamp: data.timestamp ?? "",
    uuid: data.uuid ?? doc.id,
    name: data.name ?? "",
    yearLevel: data.yearLevel ?? "",
    email: data.email ?? "",
    idNumber: data.idNumber ?? "",
    allergens: data.allergens ?? "",
    qrToken: data.qrToken ?? "",
    emailSent: data.emailSent ?? "",
  };
}

export async function findRSVPByIdNumber(idNumber: string): Promise<RSVPRow | null> {
  const db = getFirestoreClient();
  const snap = await db
    .collection(RSVP_COLLECTION)
    .where("idNumber", "==", idNumber)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data() as Partial<RSVPRow>;
  return {
    timestamp: data.timestamp ?? "",
    uuid: data.uuid ?? d.id,
    name: data.name ?? "",
    yearLevel: data.yearLevel ?? "",
    email: data.email ?? "",
    idNumber: data.idNumber ?? "",
    allergens: data.allergens ?? "",
    qrToken: data.qrToken ?? "",
    emailSent: data.emailSent ?? "",
  };
}

export async function findRSVPByEmail(email: string): Promise<RSVPRow | null> {
  const db = getFirestoreClient();
  const snap = await db
    .collection(RSVP_COLLECTION)
    .where("email", "==", email.toLowerCase())
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data() as Partial<RSVPRow>;
  return {
    timestamp: data.timestamp ?? "",
    uuid: data.uuid ?? d.id,
    name: data.name ?? "",
    yearLevel: data.yearLevel ?? "",
    email: data.email ?? "",
    idNumber: data.idNumber ?? "",
    allergens: data.allergens ?? "",
    qrToken: data.qrToken ?? "",
    emailSent: data.emailSent ?? "",
  };
}

// Attendance ops
export async function getAllAttendance(): Promise<AttendanceRow[]> {
  const db = getFirestoreClient();
  const snap = await db
    .collection(ATTENDANCE_COLLECTION)
    .orderBy("checkInTime", "asc")
    .get();
  return snap.docs.map(
    (d) =>
      ({
        uuid: d.data().uuid ?? d.id,
        idNumber: d.data().idNumber ?? "",
        name: d.data().name ?? "",
        yearLevel: d.data().yearLevel ?? "",
        checkInTime: d.data().checkInTime ?? "",
        scannedBy: d.data().scannedBy ?? "",
        status: d.data().status ?? "",
      }) as AttendanceRow
  );
}

export async function findAttendanceByUUID(uuid: string): Promise<AttendanceRow | null> {
  const db = getFirestoreClient();
  const doc = await db.collection(ATTENDANCE_COLLECTION).doc(uuid).get();
  if (!doc.exists) return null;
  const data = doc.data() as Partial<AttendanceRow>;
  return {
    uuid: data.uuid ?? doc.id,
    idNumber: data.idNumber ?? "",
    name: data.name ?? "",
    yearLevel: data.yearLevel ?? "",
    checkInTime: data.checkInTime ?? "",
    scannedBy: data.scannedBy ?? "",
    status: data.status ?? "",
  };
}

export async function appendAttendance(row: AttendanceRow) {
  const db = getFirestoreClient();
  await db.collection(ATTENDANCE_COLLECTION).doc(row.uuid).set(row);
}