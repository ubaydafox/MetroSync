export interface InputProps {
  id: string;
  name: string;
  label: string;
  value: InputProps["type"] extends "textarea" ? string : string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "textarea" | "number";
  rows?: number;
  minLength?: number;
}

// Tmp
export interface User {
  name: string;
  email: string;
  role?: string;
  department: string;
  batch?: string;
  roll?: string;
  password: string;
}

export interface Department {
  id: number;
  name: string;
  full_name: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  department_id: string;
  active?: boolean;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  is_lab: boolean;
  department_id: number;
}

export interface Batch {
  id: number;
  name: string;
  session: string;
  department_id: number;
  department_name?: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Room {
  id: number;
  number: number;
  building_name: string;
  floor_number: number;
  title?: string;
  room_type: string;
  capacity: number;
}

export interface Schedule {
  id: number;
  course_id: number;
  teacher_id: number;
  batch_id: number;
  department_id: number;
  room_id: number;
  day: days;
  start_time: string;
  end_time: string;
  is_lab?: boolean;
  reason?: string;
  section?: string;
}

export interface RoutineSchema {
  id: number;
  course_name: string;
  course_code: string;
  teacher_name: string;
  batch_name: string;
  department_name: string;
  room_number: number;
  day: days;
  start_time: string;
  end_time: string;
  is_lab: boolean;
  section?: string;
}

export type days = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday";