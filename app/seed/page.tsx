"use client";

import { useEffect, useState } from "react";
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db, auth } from "@/utils/firebase";
import Link from "next/link";

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
const DEMO_USERS = [
  {
    email: "admin@metrosync.edu",
    password: "Admin@1234",
    name: "System Admin",
    role: "admin",
    department: "1",
    batch: "1",
    roll: "ADMIN-001",
    badge: "🛡️",
    color: "purple",
  },
  {
    email: "student@metrosync.edu",
    password: "Student@1234",
    name: "Rakibul Islam",
    role: "student",
    department: "1",
    batch: "1",
    roll: "CSE52-001",
    badge: "🎓",
    color: "blue",
  },
  {
    email: "teacher@metrosync.edu",
    password: "Teacher@1234",
    name: "Dr. Anisur Rahman",
    role: "teacher",
    department: "1",
    batch: "1",
    roll: "TCHR-001",
    badge: "👨‍🏫",
    color: "green",
  },
  {
    email: "hod@metrosync.edu",
    password: "Hod@12345",
    name: "Prof. Nusrat Jahan",
    role: "hod",
    department: "2",
    batch: "5",
    roll: "HOD-002",
    badge: "🏛️",
    color: "orange",
  },
  {
    email: "cr@metrosync.edu",
    password: "Cr@123456",
    name: "Sadia Sultana",
    role: "cr",
    department: "1",
    batch: "2",
    roll: "CSE51-002",
    badge: "⭐",
    color: "pink",
  },
];


// ─── SEED DATA ────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { id: 1, name: "Computer Science & Engineering", short_name: "CSE", description: "Algorithms, software engineering, AI, and computing systems." },
  { id: 2, name: "Electrical & Electronic Engineering", short_name: "EEE", description: "Circuits, power systems, signal processing, and embedded systems." },
  { id: 3, name: "Civil Engineering", short_name: "CE", description: "Design and construction of infrastructure and structures." },
  { id: 4, name: "Business Administration", short_name: "BBA", description: "Management, marketing, finance, and entrepreneurship." },
  { id: 5, name: "English", short_name: "ENG", description: "Language, literature, linguistics, and communication." },
];

const BATCHES = [
  { id: 1, name: "CSE 52", year: 2024, department: "CSE", department_id: 1, students: 60, created_at: "2024-01-10" },
  { id: 2, name: "CSE 51", year: 2023, department: "CSE", department_id: 1, students: 58, created_at: "2023-01-10" },
  { id: 3, name: "CSE 50", year: 2022, department: "CSE", department_id: 1, students: 62, created_at: "2022-01-10" },
  { id: 4, name: "CSE 49", year: 2021, department: "CSE", department_id: 1, students: 55, created_at: "2021-01-10" },
  { id: 5, name: "EEE 52", year: 2024, department: "EEE", department_id: 2, students: 50, created_at: "2024-01-10" },
  { id: 6, name: "EEE 51", year: 2023, department: "EEE", department_id: 2, students: 48, created_at: "2023-01-10" },
  { id: 7, name: "EEE 50", year: 2022, department: "EEE", department_id: 2, students: 44, created_at: "2022-01-10" },
  { id: 8, name: "CE 52",  year: 2024, department: "CE",  department_id: 3, students: 45, created_at: "2024-01-10" },
  { id: 9, name: "CE 51",  year: 2023, department: "CE",  department_id: 3, students: 42, created_at: "2023-01-10" },
  { id: 10, name: "BBA 52", year: 2024, department: "BBA", department_id: 4, students: 70, created_at: "2024-01-10" },
  { id: 11, name: "BBA 51", year: 2023, department: "BBA", department_id: 4, students: 68, created_at: "2023-01-10" },
  { id: 12, name: "ENG 52", year: 2024, department: "ENG", department_id: 5, students: 35, created_at: "2024-01-10" },
  { id: 13, name: "ENG 51", year: 2023, department: "ENG", department_id: 5, students: 32, created_at: "2023-01-10" },
];

const TEACHERS = [
  { id: 1, name: "Dr. Anisur Rahman",    email: "anisur@metrosync.edu",  department_id: 1, department: "CSE", courses: ["CSE401", "CSE301"], students: 120 },
  { id: 2, name: "Prof. Farhana Begum",  email: "farhana@metrosync.edu", department_id: 1, department: "CSE", courses: ["CSE201", "CSE101"], students: 115 },
  { id: 3, name: "Dr. Kamal Hossain",    email: "kamal@metrosync.edu",   department_id: 1, department: "CSE", courses: ["CSE302", "CSE402"], students: 100 },
  { id: 4, name: "Prof. Nusrat Jahan",   email: "nusrat@metrosync.edu",  department_id: 2, department: "EEE", courses: ["EEE301", "EEE201"], students: 95 },
  { id: 5, name: "Dr. Rezaul Islam",     email: "rezaul@metrosync.edu",  department_id: 2, department: "EEE", courses: ["EEE101", "EEE401"], students: 98 },
  { id: 6, name: "Prof. Sabrina Akter",  email: "sabrina@metrosync.edu", department_id: 3, department: "CE",  courses: ["CE201", "CE301"],  students: 87 },
  { id: 7, name: "Dr. Mahmudul Hasan",   email: "mahmud@metrosync.edu",  department_id: 4, department: "BBA", courses: ["BBA101", "BBA201"], students: 138 },
  { id: 8, name: "Prof. Tahmina Parvin", email: "tahmina@metrosync.edu", department_id: 5, department: "ENG", courses: ["ENG101", "ENG201"], students: 67 },
];

const COURSES = [
  // CSE
  { id: 1,  code: "CSE101", name: "Introduction to Programming",        credits: 3, teacher_id: 2, teacher_name: "Prof. Farhana Begum",  batch_id: 1, department_id: 1, department: "CSE", room: "CSE-201", description: "Fundamentals of programming using Python.",       student_count: 60, material_count: 5, task_count: 3, notice_count: 2, active_task_count: 1 },
  { id: 2,  code: "CSE201", name: "Data Structures & Algorithms",       credits: 3, teacher_id: 2, teacher_name: "Prof. Farhana Begum",  batch_id: 2, department_id: 1, department: "CSE", room: "CSE-301", description: "Arrays, linked lists, trees, graphs and algorithm analysis.", student_count: 58, material_count: 8, task_count: 4, notice_count: 3, active_task_count: 2 },
  { id: 3,  code: "CSE301", name: "Database Management Systems",        credits: 3, teacher_id: 1, teacher_name: "Dr. Anisur Rahman",   batch_id: 2, department_id: 1, department: "CSE", room: "CSE-Lab1", description: "Relational databases, SQL, and normalization.",  student_count: 58, material_count: 6, task_count: 3, notice_count: 2, active_task_count: 1 },
  { id: 4,  code: "CSE302", name: "Computer Networks",                  credits: 3, teacher_id: 3, teacher_name: "Dr. Kamal Hossain",   batch_id: 3, department_id: 1, department: "CSE", room: "CSE-402", description: "Network protocols, OSI model, TCP/IP, and security.", student_count: 62, material_count: 7, task_count: 4, notice_count: 3, active_task_count: 2 },
  { id: 5,  code: "CSE401", name: "Artificial Intelligence",            credits: 3, teacher_id: 1, teacher_name: "Dr. Anisur Rahman",   batch_id: 1, department_id: 1, department: "CSE", room: "CSE-Lab2", description: "Search, logic, ML basics, neural networks.",       student_count: 60, material_count: 9, task_count: 5, notice_count: 4, active_task_count: 3 },
  { id: 6,  code: "CSE402", name: "Software Engineering",               credits: 3, teacher_id: 3, teacher_name: "Dr. Kamal Hossain",   batch_id: 1, department_id: 1, department: "CSE", room: "CSE-501", description: "SDLC, agile, UML, testing, and project management.", student_count: 60, material_count: 4, task_count: 3, notice_count: 2, active_task_count: 1 },
  // EEE
  { id: 7,  code: "EEE101", name: "Circuit Analysis",                   credits: 3, teacher_id: 5, teacher_name: "Dr. Rezaul Islam",    batch_id: 5, department_id: 2, department: "EEE", room: "EEE-101", description: "Ohm's law, Kirchhoff's laws, AC/DC circuits.",    student_count: 50, material_count: 5, task_count: 3, notice_count: 2, active_task_count: 1 },
  { id: 8,  code: "EEE201", name: "Electronics I",                      credits: 3, teacher_id: 4, teacher_name: "Prof. Nusrat Jahan",  batch_id: 6, department_id: 2, department: "EEE", room: "EEE-Lab1", description: "Diodes, transistors, amplifiers, and op-amps.",   student_count: 48, material_count: 6, task_count: 4, notice_count: 3, active_task_count: 2 },
  { id: 9,  code: "EEE301", name: "Power Systems",                      credits: 3, teacher_id: 4, teacher_name: "Prof. Nusrat Jahan",  batch_id: 5, department_id: 2, department: "EEE", room: "EEE-301", description: "Generation, transmission, and distribution of power.", student_count: 50, material_count: 4, task_count: 2, notice_count: 2, active_task_count: 1 },
  { id: 10, code: "EEE401", name: "Microcontrollers & Embedded Systems",credits: 3, teacher_id: 5, teacher_name: "Dr. Rezaul Islam",    batch_id: 5, department_id: 2, department: "EEE", room: "EEE-Lab2", description: "Arduino, ARM Cortex, real-time programming.",       student_count: 50, material_count: 7, task_count: 4, notice_count: 3, active_task_count: 2 },
  // CE
  { id: 11, code: "CE201",  name: "Structural Analysis",                credits: 3, teacher_id: 6, teacher_name: "Prof. Sabrina Akter", batch_id: 8, department_id: 3, department: "CE",  room: "CE-101",  description: "Static and dynamic analysis of structures.",       student_count: 45, material_count: 5, task_count: 3, notice_count: 2, active_task_count: 1 },
  { id: 12, code: "CE301",  name: "Fluid Mechanics",                    credits: 3, teacher_id: 6, teacher_name: "Prof. Sabrina Akter", batch_id: 9, department_id: 3, department: "CE",  room: "CE-Lab1", description: "Properties of fluids, flow behaviour, and hydraulics.", student_count: 42, material_count: 4, task_count: 2, notice_count: 2, active_task_count: 1 },
  // BBA
  { id: 13, code: "BBA101", name: "Principles of Management",           credits: 3, teacher_id: 7, teacher_name: "Dr. Mahmudul Hasan",  batch_id: 10, department_id: 4, department: "BBA", room: "BBA-201", description: "Foundations of business management and organisation.", student_count: 70, material_count: 5, task_count: 3, notice_count: 3, active_task_count: 2 },
  { id: 14, code: "BBA201", name: "Financial Accounting",               credits: 3, teacher_id: 7, teacher_name: "Dr. Mahmudul Hasan",  batch_id: 11, department_id: 4, department: "BBA", room: "BBA-301", description: "Balance sheets, income statements, and financial reporting.", student_count: 68, material_count: 4, task_count: 3, notice_count: 2, active_task_count: 1 },
  // ENG
  { id: 15, code: "ENG101", name: "Academic Writing",                   credits: 3, teacher_id: 8, teacher_name: "Prof. Tahmina Parvin",batch_id: 12, department_id: 5, department: "ENG", room: "ENG-101", description: "Essay writing, research skills, and academic conventions.", student_count: 35, material_count: 4, task_count: 3, notice_count: 2, active_task_count: 1 },
  { id: 16, code: "ENG201", name: "British Literature",                 credits: 3, teacher_id: 8, teacher_name: "Prof. Tahmina Parvin",batch_id: 13, department_id: 5, department: "ENG", room: "ENG-201", description: "Survey of British literature from the Renaissance to the modern era.", student_count: 32, material_count: 5, task_count: 3, notice_count: 2, active_task_count: 1 },
];

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday"];
const SCHEDULES = [
  { id: 1,  course_id: 1,  course_name: "Introduction to Programming",        course_code: "CSE101", teacher_id: 2, teacher_name: "Prof. Farhana Begum",  batch_id: 1,  batch_name: "CSE 52", department_id: 1, department_name: "CSE", room: "CSE-201", day: "sunday",    start_time: "08:00", end_time: "09:30" },
  { id: 2,  course_id: 2,  course_name: "Data Structures & Algorithms",       course_code: "CSE201", teacher_id: 2, teacher_name: "Prof. Farhana Begum",  batch_id: 2,  batch_name: "CSE 51", department_id: 1, department_name: "CSE", room: "CSE-301", day: "sunday",    start_time: "10:00", end_time: "11:30" },
  { id: 3,  course_id: 3,  course_name: "Database Management Systems",        course_code: "CSE301", teacher_id: 1, teacher_name: "Dr. Anisur Rahman",   batch_id: 2,  batch_name: "CSE 51", department_id: 1, department_name: "CSE", room: "CSE-Lab1", day: "monday",    start_time: "08:00", end_time: "09:30" },
  { id: 4,  course_id: 4,  course_name: "Computer Networks",                  course_code: "CSE302", teacher_id: 3, teacher_name: "Dr. Kamal Hossain",   batch_id: 3,  batch_name: "CSE 50", department_id: 1, department_name: "CSE", room: "CSE-402", day: "monday",    start_time: "10:00", end_time: "11:30" },
  { id: 5,  course_id: 5,  course_name: "Artificial Intelligence",            course_code: "CSE401", teacher_id: 1, teacher_name: "Dr. Anisur Rahman",   batch_id: 1,  batch_name: "CSE 52", department_id: 1, department_name: "CSE", room: "CSE-Lab2", day: "tuesday",   start_time: "08:00", end_time: "09:30" },
  { id: 6,  course_id: 6,  course_name: "Software Engineering",               course_code: "CSE402", teacher_id: 3, teacher_name: "Dr. Kamal Hossain",   batch_id: 1,  batch_name: "CSE 52", department_id: 1, department_name: "CSE", room: "CSE-501", day: "tuesday",   start_time: "10:00", end_time: "11:30" },
  { id: 7,  course_id: 7,  course_name: "Circuit Analysis",                   course_code: "EEE101", teacher_id: 5, teacher_name: "Dr. Rezaul Islam",    batch_id: 5,  batch_name: "EEE 52", department_id: 2, department_name: "EEE", room: "EEE-101", day: "sunday",    start_time: "08:00", end_time: "09:30" },
  { id: 8,  course_id: 8,  course_name: "Electronics I",                      course_code: "EEE201", teacher_id: 4, teacher_name: "Prof. Nusrat Jahan",  batch_id: 6,  batch_name: "EEE 51", department_id: 2, department_name: "EEE", room: "EEE-Lab1", day: "monday",    start_time: "08:00", end_time: "09:30" },
  { id: 9,  course_id: 9,  course_name: "Power Systems",                      course_code: "EEE301", teacher_id: 4, teacher_name: "Prof. Nusrat Jahan",  batch_id: 5,  batch_name: "EEE 52", department_id: 2, department_name: "EEE", room: "EEE-301", day: "wednesday", start_time: "08:00", end_time: "09:30" },
  { id: 10, course_id: 10, course_name: "Microcontrollers & Embedded Systems",course_code: "EEE401", teacher_id: 5, teacher_name: "Dr. Rezaul Islam",    batch_id: 5,  batch_name: "EEE 52", department_id: 2, department_name: "EEE", room: "EEE-Lab2", day: "thursday",  start_time: "10:00", end_time: "11:30" },
  { id: 11, course_id: 11, course_name: "Structural Analysis",                course_code: "CE201",  teacher_id: 6, teacher_name: "Prof. Sabrina Akter", batch_id: 8,  batch_name: "CE 52",  department_id: 3, department_name: "CE",  room: "CE-101",  day: "sunday",    start_time: "10:00", end_time: "11:30" },
  { id: 12, course_id: 12, course_name: "Fluid Mechanics",                    course_code: "CE301",  teacher_id: 6, teacher_name: "Prof. Sabrina Akter", batch_id: 9,  batch_name: "CE 51",  department_id: 3, department_name: "CE",  room: "CE-Lab1", day: "tuesday",   start_time: "10:00", end_time: "11:30" },
  { id: 13, course_id: 13, course_name: "Principles of Management",           course_code: "BBA101", teacher_id: 7, teacher_name: "Dr. Mahmudul Hasan",  batch_id: 10, batch_name: "BBA 52", department_id: 4, department_name: "BBA", room: "BBA-201", day: "monday",    start_time: "10:00", end_time: "11:30" },
  { id: 14, course_id: 14, course_name: "Financial Accounting",               course_code: "BBA201", teacher_id: 7, teacher_name: "Dr. Mahmudul Hasan",  batch_id: 11, batch_name: "BBA 51", department_id: 4, department_name: "BBA", room: "BBA-301", day: "wednesday", start_time: "10:00", end_time: "11:30" },
  { id: 15, course_id: 15, course_name: "Academic Writing",                   course_code: "ENG101", teacher_id: 8, teacher_name: "Prof. Tahmina Parvin",batch_id: 12, batch_name: "ENG 52", department_id: 5, department_name: "ENG", room: "ENG-101", day: "thursday",  start_time: "08:00", end_time: "09:30" },
  { id: 16, course_id: 16, course_name: "British Literature",                 course_code: "ENG201", teacher_id: 8, teacher_name: "Prof. Tahmina Parvin",batch_id: 13, batch_name: "ENG 51", department_id: 5, department_name: "ENG", room: "ENG-201", day: "thursday",  start_time: "10:00", end_time: "11:30" },
];

// Notices (department-wide)
const NOTICES = [
  { id: 1,  title: "Mid-Term Exam Schedule Released",                    message: "Mid-term examinations will be held from April 15–22, 2026. Check the exam hall routine on the notice board.",     type: "important", course: "",       department_id: 1, date: "2026-03-25", author: "Dr. Anisur Rahman" },
  { id: 2,  title: "Lab Report Submission Deadline Extended",            message: "The deadline for Lab Report 3 (CSE Lab) has been extended to April 10, 2026 due to server issues.",              type: "info",      course: "CSE301", department_id: 1, date: "2026-03-28", author: "Dr. Anisur Rahman" },
  { id: 3,  title: "Guest Lecture: Industry Leaders in AI",             message: "Join us on April 5 for an exclusive talk from engineers at Google Brain. Venue: Auditorium, 2 PM.",               type: "info",      course: "",       department_id: 1, date: "2026-03-30", author: "Prof. Farhana Begum" },
  { id: 4,  title: "Project Submission Warning",                         message: "Students who have not submitted their semester project outlines will receive a zero grade.",                        type: "warning",   course: "CSE402", department_id: 1, date: "2026-04-01", author: "Dr. Kamal Hossain" },
  { id: 5,  title: "EEE Lab Safety Guidelines Updated",                  message: "New safety guidelines have been issued for all EEE labs. Students must read them before entering.",                type: "important", course: "",       department_id: 2, date: "2026-03-29", author: "Prof. Nusrat Jahan" },
  { id: 6,  title: "Power Electronics Workshop",                         message: "A two-day workshop on power electronics is scheduled for April 8–9. Registration is open.",                       type: "info",      course: "EEE401", department_id: 2, date: "2026-04-01", author: "Dr. Rezaul Islam" },
  { id: 7,  title: "Bridge Design Competition",                          message: "Civil Engineering Department invites students to the Annual Bridge Design Competition on April 20.",               type: "info",      course: "",       department_id: 3, date: "2026-03-31", author: "Prof. Sabrina Akter" },
  { id: 8,  title: "BBA Internship Fair 2026",                           message: "Top companies will visit campus on April 12. Bring your CVs! Open to 3rd and 4th year students.",                 type: "important", course: "",       department_id: 4, date: "2026-04-02", author: "Dr. Mahmudul Hasan" },
  { id: 9,  title: "English Literary Festival",                          message: "ENG Department is hosting the annual literary festival on April 18. All students are invited to participate.",     type: "info",      course: "",       department_id: 5, date: "2026-04-01", author: "Prof. Tahmina Parvin" },
  { id: 10, title: "Class Cancelled – April 5",                          message: "All classes on April 5 are cancelled due to the university's sports day event.",                                   type: "warning",   course: "",       department_id: 0, date: "2026-04-03", author: "Admin" },
];

// Course-specific notices
const COURSE_NOTICES = [
  { id: 1,  title: "Assignment 2 Posted",          message: "Assignment 2 on sorting algorithms is now available on the LMS. Due date: April 12, 2026.", author: "Prof. Farhana Begum",  date: "2026-03-30", course_id: 2 },
  { id: 2,  title: "Quiz Rescheduled",             message: "Quiz 3 has been moved to next Sunday (April 6). Chapters 4–6 are included in syllabus.",     author: "Dr. Anisur Rahman",   date: "2026-04-01", course_id: 3 },
  { id: 3,  title: "Lab Demo Session",             message: "There will be a live demo on SQL joins and triggers in CSE-Lab1 this Monday.",                author: "Dr. Anisur Rahman",   date: "2026-04-02", course_id: 3 },
  { id: 4,  title: "Project Group Formation",      message: "AI project groups (4 students each) must be finalized by April 8. Submit via form.",          author: "Dr. Anisur Rahman",   date: "2026-04-01", course_id: 5 },
  { id: 5,  title: "Extra Class on Saturday",      message: "An extra class has been arranged for Saturday April 6 to cover missed content (Networks).",   author: "Dr. Kamal Hossain",   date: "2026-04-02", course_id: 4 },
  { id: 6,  title: "Circuit Lab Report Due",       message: "Lab report for Experiment 5 is due on April 9. Follow the standard format provided.",         author: "Dr. Rezaul Islam",    date: "2026-03-31", course_id: 7 },
  { id: 7,  title: "Case Study Submission",        message: "BBA management case study (2000 words) is due on April 15. Upload to the portal.",            author: "Dr. Mahmudul Hasan",  date: "2026-04-01", course_id: 13 },
  { id: 8,  title: "Essay Feedback Posted",        message: "Feedback for Essay 1 has been posted on the student portal. Please review and revise.",       author: "Prof. Tahmina Parvin",date: "2026-04-02", course_id: 15 },
];

// Tasks (assignments, quizzes, projects)
const TASKS = [
  { id: 1,  title: "Lab Assignment 1: Python Basics",         type: "assignment", due_date: "2026-04-10", points: 20, description: "Write Python programs covering variables, loops, and functions. Submit .py files.", course_id: 1,  created_by: "Prof. Farhana Begum",  created_at: "2026-03-25" },
  { id: 2,  title: "Quiz 2: Sorting Algorithms",             type: "quiz",       due_date: "2026-04-06", points: 15, description: "20-minute in-class quiz on bubble sort, merge sort, and quicksort.",            course_id: 2,  created_by: "Prof. Farhana Begum",  created_at: "2026-03-28" },
  { id: 3,  title: "Mini Project: E-Commerce Database",      type: "project",    due_date: "2026-04-20", points: 40, description: "Design and implement a relational database for an e-commerce platform.",         course_id: 3,  created_by: "Dr. Anisur Rahman",   created_at: "2026-03-20" },
  { id: 4,  title: "Assignment 3: TCP/IP Analysis",          type: "assignment", due_date: "2026-04-12", points: 25, description: "Use Wireshark to capture and analyse TCP/IP packets. Write a report.",           course_id: 4,  created_by: "Dr. Kamal Hossain",   created_at: "2026-03-30" },
  { id: 5,  title: "AI Final Project: Image Classifier",     type: "project",    due_date: "2026-04-25", points: 50, description: "Build a CNN-based image classifier using TensorFlow. Group of 4.",               course_id: 5,  created_by: "Dr. Anisur Rahman",   created_at: "2026-03-18" },
  { id: 6,  title: "SRS Document Submission",                type: "assignment", due_date: "2026-04-11", points: 30, description: "Submit a complete Software Requirements Specification for your team project.",    course_id: 6,  created_by: "Dr. Kamal Hossain",   created_at: "2026-03-29" },
  { id: 7,  title: "Circuit Lab Report #5",                  type: "lab",        due_date: "2026-04-09", points: 20, description: "Document your findings from Experiment 5: RLC circuit frequency response.",       course_id: 7,  created_by: "Dr. Rezaul Islam",    created_at: "2026-03-31" },
  { id: 8,  title: "Quiz: Transistor Amplifiers",            type: "quiz",       due_date: "2026-04-07", points: 15, description: "15-minute quiz covering BJT and FET amplifier configurations.",                   course_id: 8,  created_by: "Prof. Nusrat Jahan",  created_at: "2026-03-30" },
  { id: 9,  title: "Power Grid Case Study",                  type: "assignment", due_date: "2026-04-15", points: 30, description: "Analyse the Bangladesh National Grid and identify issues and improvements.",      course_id: 9,  created_by: "Prof. Nusrat Jahan",  created_at: "2026-03-28" },
  { id: 10, title: "Embedded Systems Final Project",         type: "project",    due_date: "2026-04-28", points: 50, description: "Build a smart home prototype using an Arduino/ESP32. Group of 3.",               course_id: 10, created_by: "Dr. Rezaul Islam",    created_at: "2026-03-20" },
  { id: 11, title: "Truss Analysis Report",                  type: "assignment", due_date: "2026-04-14", points: 25, description: "Analyse the given truss structure using method of joints and method of sections.", course_id: 11, created_by: "Prof. Sabrina Akter", created_at: "2026-03-27" },
  { id: 12, title: "Management Case Study",                  type: "assignment", due_date: "2026-04-15", points: 30, description: "2000-word case study on leadership styles in a Bangladeshi company.",             course_id: 13, created_by: "Dr. Mahmudul Hasan",  created_at: "2026-04-01" },
  { id: 13, title: "Mid-term Essay",                         type: "assignment", due_date: "2026-04-13", points: 35, description: "1500-word analytical essay on a theme in 20th century British literature.",        course_id: 16, created_by: "Prof. Tahmina Parvin",created_at: "2026-03-29" },
];

// Materials (lecture notes, slides, books)
const MATERIALS = [
  { id: 1,  title: "Week 1 Lecture Slides: Intro to Python",        type: "slides",   link: "https://drive.google.com/file/d/abc1",  uploaded_by: "Prof. Farhana Begum",  date: "2026-01-20", course_id: 1 },
  { id: 2,  title: "Python Programming Textbook (PDF)",             type: "book",     link: "https://drive.google.com/file/d/abc2",  uploaded_by: "Prof. Farhana Begum",  date: "2026-01-15", course_id: 1 },
  { id: 3,  title: "DSA Lecture Notes: Arrays & Linked Lists",      type: "notes",    link: "https://drive.google.com/file/d/abc3",  uploaded_by: "Prof. Farhana Begum",  date: "2026-01-20", course_id: 2 },
  { id: 4,  title: "Introduction to Algorithms (CLRS) - Chapter 1", type: "book",     link: "https://drive.google.com/file/d/abc4",  uploaded_by: "Prof. Farhana Begum",  date: "2026-01-15", course_id: 2 },
  { id: 5,  title: "SQL Cheat Sheet",                               type: "notes",    link: "https://drive.google.com/file/d/abc5",  uploaded_by: "Dr. Anisur Rahman",   date: "2026-02-01", course_id: 3 },
  { id: 6,  title: "ER Diagram Slides",                             type: "slides",   link: "https://drive.google.com/file/d/abc6",  uploaded_by: "Dr. Anisur Rahman",   date: "2026-02-08", course_id: 3 },
  { id: 7,  title: "MySQL Sample Database",                         type: "resource", link: "https://drive.google.com/file/d/abc7",  uploaded_by: "Dr. Anisur Rahman",   date: "2026-02-15", course_id: 3 },
  { id: 8,  title: "Network Layers Explained",                      type: "video",    link: "https://www.youtube.com/watch?v=abc8",  uploaded_by: "Dr. Kamal Hossain",   date: "2026-02-05", course_id: 4 },
  { id: 9,  title: "AI Lecture 1: Agents and Environments",         type: "slides",   link: "https://drive.google.com/file/d/abc9",  uploaded_by: "Dr. Anisur Rahman",   date: "2026-01-18", course_id: 5 },
  { id: 10, title: "Russell & Norvig AIMA Textbook",               type: "book",     link: "https://drive.google.com/file/d/abc10", uploaded_by: "Dr. Anisur Rahman",   date: "2026-01-15", course_id: 5 },
  { id: 11, title: "Agile Manifesto & SCRUM Guide",                 type: "notes",    link: "https://drive.google.com/file/d/abc11", uploaded_by: "Dr. Kamal Hossain",   date: "2026-02-10", course_id: 6 },
  { id: 12, title: "Circuit Theory Formulae",                       type: "notes",    link: "https://drive.google.com/file/d/abc12", uploaded_by: "Dr. Rezaul Islam",    date: "2026-02-01", course_id: 7 },
  { id: 13, title: "Power Systems Textbook - Chapman",              type: "book",     link: "https://drive.google.com/file/d/abc13", uploaded_by: "Prof. Nusrat Jahan",  date: "2026-01-15", course_id: 9 },
  { id: 14, title: "Arduino Getting Started Guide",                 type: "resource", link: "https://www.arduino.cc/en/Guide",       uploaded_by: "Dr. Rezaul Islam",    date: "2026-02-20", course_id: 10 },
  { id: 15, title: "Management Textbook – Robbins",                 type: "book",     link: "https://drive.google.com/file/d/abc15", uploaded_by: "Dr. Mahmudul Hasan",  date: "2026-01-20", course_id: 13 },
  { id: 16, title: "Academic Writing Style Guide",                  type: "notes",    link: "https://drive.google.com/file/d/abc16", uploaded_by: "Prof. Tahmina Parvin",date: "2026-01-22", course_id: 15 },
];

// Class Representatives
const CRS = [
  { id: 1, name: "Rakibul Islam",   email: "rakibul@student.edu",   batch_id: 1,  batch: "CSE 52",  department_id: 1, roll: "CSE52-001", students: 60 },
  { id: 2, name: "Sadia Sultana",   email: "sadia@student.edu",     batch_id: 2,  batch: "CSE 51",  department_id: 1, roll: "CSE51-002", students: 58 },
  { id: 3, name: "Minhajul Haque",  email: "minhaj@student.edu",    batch_id: 5,  batch: "EEE 52",  department_id: 2, roll: "EEE52-001", students: 50 },
  { id: 4, name: "Fatema Khatun",   email: "fatema@student.edu",    batch_id: 8,  batch: "CE 52",   department_id: 3, roll: "CE52-001",  students: 45 },
  { id: 5, name: "Arif Hossain",    email: "arif@student.edu",      batch_id: 10, batch: "BBA 52",  department_id: 4, roll: "BBA52-001", students: 70 },
  { id: 6, name: "Nishat Tasneem",  email: "nishat@student.edu",    batch_id: 12, batch: "ENG 52",  department_id: 5, roll: "ENG52-001", students: 35 },
];

// HODs (Heads of Department)
const HODS = [
  { id: 1, name: "Dr. Anisur Rahman",    email: "anisur@metrosync.edu",  department_id: 1, department: "CSE", phone: "+8801711111111", office: "CSE-101" },
  { id: 2, name: "Prof. Nusrat Jahan",   email: "nusrat@metrosync.edu",  department_id: 2, department: "EEE", phone: "+8801722222222", office: "EEE-101" },
  { id: 3, name: "Prof. Sabrina Akter",  email: "sabrina@metrosync.edu", department_id: 3, department: "CE",  phone: "+8801733333333", office: "CE-101"  },
  { id: 4, name: "Dr. Mahmudul Hasan",   email: "mahmud@metrosync.edu",  department_id: 4, department: "BBA", phone: "+8801744444444", office: "BBA-101" },
  { id: 5, name: "Prof. Tahmina Parvin", email: "tahmina@metrosync.edu", department_id: 5, department: "ENG", phone: "+8801755555555", office: "ENG-101" },
];

// ─── COLLECTIONS CONFIG ───────────────────────────────────────────────────────
type CollectionConfig = { id: number; [key: string]: unknown };
const COLLECTIONS: { name: string; docId: (d: CollectionConfig) => string; data: CollectionConfig[] }[] = [
  { name: "departments",    docId: (d) => `dept_${d.id}`,          data: DEPARTMENTS    as CollectionConfig[] },
  { name: "batches",        docId: (d) => `batch_${d.id}`,         data: BATCHES        as CollectionConfig[] },
  { name: "teachers",       docId: (d) => `teacher_${d.id}`,       data: TEACHERS       as CollectionConfig[] },
  { name: "courses",        docId: (d) => `course_${d.id}`,        data: COURSES        as CollectionConfig[] },
  { name: "schedules",      docId: (d) => `schedule_${d.id}`,      data: SCHEDULES      as CollectionConfig[] },
  { name: "notices",        docId: (d) => `notice_${d.id}`,        data: NOTICES        as CollectionConfig[] },
  { name: "course_notices", docId: (d) => `cn_${d.id}`,            data: COURSE_NOTICES as CollectionConfig[] },
  { name: "tasks",          docId: (d) => `task_${d.id}`,          data: TASKS          as CollectionConfig[] },
  { name: "materials",      docId: (d) => `material_${d.id}`,      data: MATERIALS      as CollectionConfig[] },
  { name: "crs",            docId: (d) => `cr_${d.id}`,            data: CRS            as CollectionConfig[] },
  { name: "hods",           docId: (d) => `hod_${d.id}`,           data: HODS           as CollectionConfig[] },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
type StatusItem = { label: string; status: "pending" | "ok" | "skip" | "error"; detail?: string };
type UserStatus = { email: string; status: "pending" | "ok" | "skip" | "error"; detail?: string };

export default function SeedPage() {
  const [items, setItems] = useState<StatusItem[]>([]);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
  const [creatingUsers, setCreatingUsers] = useState(false);
  const [usersDone, setUsersDone] = useState(false);

  const updateUser = (email: string, status: UserStatus["status"], detail?: string) => {
    setUserStatuses((prev) => {
      const idx = prev.findIndex((u) => u.email === email);
      const entry: UserStatus = { email, status, detail };
      if (idx === -1) return [...prev, entry];
      const next = [...prev];
      next[idx] = entry;
      return next;
    });
  };

  const createDemoUsers = async () => {
    setCreatingUsers(true);
    setUserStatuses([]);
    setUsersDone(false);

    // Remember current user so we can restore session
    const previousUser = auth.currentUser;
    const previousEmail = previousUser?.email;

    for (const u of DEMO_USERS) {
      updateUser(u.email, "pending");
      try {
        // Check if Firestore profile already exists by trying to sign in
        let uid: string;
        try {
          const cred = await createUserWithEmailAndPassword(auth, u.email, u.password);
          uid = cred.user.uid;
        } catch (e: unknown) {
          // Account already exists — sign in to get uid
          if ((e as {code?: string}).code === "auth/email-already-in-use") {
            const cred = await signInWithEmailAndPassword(auth, u.email, u.password);
            uid = cred.user.uid;
            // Check if Firestore profile already set
            const existing = await getDoc(doc(db, "users", uid));
            if (existing.exists()) {
              await signOut(auth);
              updateUser(u.email, "skip", "already exists");
              continue;
            }
          } else {
            throw e;
          }
        }

        // Write Firestore profile
        await setDoc(doc(db, "users", uid), {
          uid,
          name: u.name,
          email: u.email,
          role: u.role,
          department: u.department,
          batch: u.batch,
          roll: u.roll,
          createdAt: new Date().toISOString(),
        });

        await signOut(auth);
        updateUser(u.email, "ok");
      } catch (e: unknown) {
        updateUser(u.email, "error", e instanceof Error ? e.message : "failed");
        try { await signOut(auth); } catch { /* ignore */ }
      }
    }

    // Restore previous session if there was one
    if (previousEmail) {
      const prev = DEMO_USERS.find(u => u.email === previousEmail);
      if (prev) {
        try { await signInWithEmailAndPassword(auth, prev.email, prev.password); } catch { /* ignore */ }
      }
    }

    setUsersDone(true);
    setCreatingUsers(false);
  };


  const update = (label: string, status: StatusItem["status"], detail?: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.label === label);
      const entry: StatusItem = { label, status, detail };
      if (idx === -1) return [...prev, entry];
      const next = [...prev];
      next[idx] = entry;
      return next;
    });
  };

  const runSeed = async () => {
    setRunning(true);
    setItems([]);
    setDone(false);

    for (const col of COLLECTIONS) {
      let existing: Set<string>;
      try {
        const snap = await getDocs(collection(db, col.name));
        existing = new Set(snap.docs.map((d) => d.id));
      } catch {
        existing = new Set();
      }

      for (const item of col.data) {
        const docId = col.docId(item);
        const label = `[${col.name}] ${docId}`;
        update(label, "pending");

        if (existing.has(docId)) {
          update(label, "skip", "already exists");
          continue;
        }

        try {
          await setDoc(doc(db, col.name, docId), item);
          update(label, "ok");
        } catch (e: unknown) {
          update(label, "error", e instanceof Error ? e.message : "write failed");
        }
      }
    }

    setDone(true);
    setRunning(false);
  };

  const clearAndReseed = async () => {
    setClearing(true);
    setItems([]);
    setDone(false);

    for (const col of COLLECTIONS) {
      try {
        const snap = await getDocs(collection(db, col.name));
        for (const d of snap.docs) {
          await deleteDoc(doc(db, col.name, d.id));
        }
        update(`Cleared: ${col.name}`, "ok");
      } catch (e: unknown) {
        update(`Cleared: ${col.name}`, "error", e instanceof Error ? e.message : "failed");
      }
    }

    setClearing(false);
    await runSeed();
  };

  useEffect(() => { runSeed(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statusIcon = (s: StatusItem["status"]) => {
    if (s === "pending") return "⏳";
    if (s === "ok")      return "✅";
    if (s === "skip")    return "⏭️";
    return "❌";
  };

  const hasErrors = items.some((i) => i.status === "error");
  const added = items.filter((i) => i.status === "ok").length;
  const skipped = items.filter((i) => i.status === "skip").length;
  const errors = items.filter((i) => i.status === "error").length;

  const totalExpected = COLLECTIONS.reduce((s, c) => s + c.data.length, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
            🔥
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Full Database Seed</h1>
          <p className="text-sm text-gray-500 mt-1">
            Populating <strong>{totalExpected}</strong> records across <strong>{COLLECTIONS.length}</strong> collections
          </p>
        </div>

        {/* Collection legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {COLLECTIONS.map((c) => (
            <span key={c.name} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
              {c.name} ({c.data.length})
            </span>
          ))}
        </div>

        {/* Progress list */}
        <div className="space-y-1 mb-5 max-h-80 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
          {items.length === 0 && running && (
            <p className="text-sm text-gray-400 text-center animate-pulse py-4">Connecting to Firestore…</p>
          )}
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-2 text-xs py-0.5">
              <span className="text-sm leading-tight mt-0.5 flex-shrink-0">{statusIcon(item.status)}</span>
              <span className={item.status === "error" ? "text-red-600 flex-1" : "text-gray-600 flex-1"}>
                {item.label}
                {item.detail && <span className="ml-1 text-gray-400">({item.detail})</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        {items.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg py-2">
              <div className="text-xl font-bold text-green-600">{added}</div>
              <div className="text-xs text-green-500">Added</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg py-2">
              <div className="text-xl font-bold text-yellow-600">{skipped}</div>
              <div className="text-xs text-yellow-500">Skipped</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg py-2">
              <div className="text-xl font-bold text-red-600">{errors}</div>
              <div className="text-xs text-red-500">Errors</div>
            </div>
          </div>
        )}

        {/* Result banner */}
        {done && (
          <div className={`rounded-lg p-3 mb-5 text-sm ${hasErrors ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
            {hasErrors
              ? `⚠️ ${errors} write(s) failed. Firestore rules may be blocking writes. Check the console.`
              : `🎉 Done! Added ${added} records. Skipped ${skipped} (already existed).`}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={runSeed} disabled={running || clearing}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {running ? "Seeding…" : "Seed (Skip Existing)"}
          </button>
          <button onClick={clearAndReseed} disabled={running || clearing}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-50 transition-colors">
            {clearing ? "Clearing…" : "Clear & Re-seed"}
          </button>
        </div>

        <div className="flex gap-3 mt-3">
          <Link href="/signup" className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium text-center hover:bg-gray-50 transition-colors">
            → Signup
          </Link>
          <Link href="/login" className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium text-center hover:bg-gray-50 transition-colors">
            → Login
          </Link>
          <Link href="/dashboard" className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium text-center hover:bg-gray-50 transition-colors">
            → Dashboard
          </Link>
        </div>

        {/* Demo User Credentials */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 text-sm">👤 Demo User Accounts</h2>
            <button
              onClick={createDemoUsers}
              disabled={creatingUsers || running}
              className="px-4 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {creatingUsers ? "Creating…" : "Create Demo Accounts"}
            </button>
          </div>

          <div className="grid gap-2">
            {DEMO_USERS.map((u) => {
              const us = userStatuses.find((s) => s.email === u.email);
              return (
                <div key={u.email} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="text-xl w-8 text-center flex-shrink-0">{u.badge}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">{u.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium capitalize">{u.role}</span>
                      {us && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          us.status === "ok" ? "bg-green-100 text-green-700" :
                          us.status === "skip" ? "bg-yellow-100 text-yellow-700" :
                          us.status === "error" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-500"
                        }`}>
                          {us.status === "ok" ? "✅ Created" : us.status === "skip" ? "⏭ Exists" : us.status === "error" ? `❌ ${us.detail}` : "⏳"}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-gray-500 font-mono">{u.email}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 font-mono font-semibold">{u.password}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {usersDone && (
            <p className="text-xs text-green-600 font-medium text-center mt-3">
              ✅ Accounts ready! Use the credentials above to log in.
            </p>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          For development only. Remove this page before production deployment.
        </p>
      </div>
    </div>
  );
}
