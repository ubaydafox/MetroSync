/**
 * Firestore Seed Script
 * ----------------------
 * Run this script ONCE to populate departments and batches in Firestore.
 *
 * Usage:
 *   node scripts/seedFirestore.mjs
 *
 * Requirements:
 *   - Install firebase-admin:   npm install -D firebase-admin
 *   - Download your Firebase service account key from:
 *     Firebase Console → Project Settings → Service Accounts → Generate new private key
 *   - Save it as:  scripts/serviceAccountKey.json  (DO NOT commit this file!)
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

// ── Seed Data ────────────────────────────────────────────────────────────────

const departments = [
  { id: 1, name: "Computer Science & Engineering", short_name: "CSE", description: "Computer Science and Engineering department" },
  { id: 2, name: "Electrical & Electronic Engineering", short_name: "EEE", description: "Electrical and Electronic Engineering department" },
  { id: 3, name: "Civil Engineering", short_name: "CE", description: "Civil Engineering department" },
  { id: 4, name: "Business Administration", short_name: "BBA", description: "Business Administration department" },
  { id: 5, name: "English", short_name: "ENG", description: "English Language and Literature department" },
];

const batches = [
  // CSE
  { id: 1, name: "CSE 52", year: 2024, department: "CSE", department_id: 1, students: 60, created_at: new Date().toISOString() },
  { id: 2, name: "CSE 51", year: 2023, department: "CSE", department_id: 1, students: 58, created_at: new Date().toISOString() },
  { id: 3, name: "CSE 50", year: 2022, department: "CSE", department_id: 1, students: 62, created_at: new Date().toISOString() },
  { id: 4, name: "CSE 49", year: 2021, department: "CSE", department_id: 1, students: 55, created_at: new Date().toISOString() },
  // EEE
  { id: 5, name: "EEE 52", year: 2024, department: "EEE", department_id: 2, students: 50, created_at: new Date().toISOString() },
  { id: 6, name: "EEE 51", year: 2023, department: "EEE", department_id: 2, students: 48, created_at: new Date().toISOString() },
  // CE
  { id: 7, name: "CE 52", year: 2024, department: "CE", department_id: 3, students: 45, created_at: new Date().toISOString() },
  { id: 8, name: "CE 51", year: 2023, department: "CE", department_id: 3, students: 42, created_at: new Date().toISOString() },
  // BBA
  { id: 9, name: "BBA 52", year: 2024, department: "BBA", department_id: 4, students: 70, created_at: new Date().toISOString() },
  { id: 10, name: "BBA 51", year: 2023, department: "BBA", department_id: 4, students: 68, created_at: new Date().toISOString() },
  // ENG
  { id: 11, name: "ENG 52", year: 2024, department: "ENG", department_id: 5, students: 35, created_at: new Date().toISOString() },
  { id: 12, name: "ENG 51", year: 2023, department: "ENG", department_id: 5, students: 32, created_at: new Date().toISOString() },
];

// ── Seeding ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding Firestore...\n");

  // Seed departments
  for (const dept of departments) {
    await db.collection("departments").doc(`dept_${dept.id}`).set(dept);
    console.log(`  ✅ Department: ${dept.name}`);
  }

  // Seed batches
  for (const batch of batches) {
    await db.collection("batches").doc(`batch_${batch.id}`).set(batch);
    console.log(`  ✅ Batch: ${batch.name} (dept_id: ${batch.department_id})`);
  }

  console.log("\n✨ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
