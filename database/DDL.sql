
-- Table: teachers
-- Purpose: Stores all teachers
-- Note: Each teacher is uniquely identified by email; using UUID as id
-- Supports: Many-to-many relationship with Students, Classes and Subjects via TeacherStudentClassSubject
CREATE TABLE IF NOT EXISTS teachers (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Table: students
-- Purpose: Stores all students
-- Note: Each student is uniquely identified by email; using UUID as id
-- Supports: Many-to-many relationship with Teachers, Classes and Subjects via TeacherStudentClassSubject
CREATE TABLE IF NOT EXISTS students (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Table: classes
-- Purpose: Stores all classes
-- Note: Each class is uniquely identified by code; using UUID as id
-- Supports: Many-to-many relationship with Teachers, Students and Subjects via TeacherStudentClassSubject
CREATE TABLE IF NOT EXISTS classes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Table: subjects
-- Purpose: Stores all subjects
-- Note: Each subject is uniquely identified by code; using UUID as id
-- Supports: Many-to-many relationship with Teachers, Students and Classes via TeacherStudentClassSubject
CREATE TABLE IF NOT EXISTS subjects (
  id CHAR(36) NOT NULL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Junction Table: teachers_students_classes_subjects
-- Purpose: Stores the association between Teachers, Students, Classes and Subjects
-- Note: Using UNIQUE constraint to prevent duplicate teacher-student-class-subject entries
CREATE TABLE IF NOT EXISTS teachers_students_classes_subjects (
  id CHAR(36) NOT NULL PRIMARY KEY,
  teacherId CHAR(36) NOT NULL,
  studentId CHAR(36) NOT NULL,
  classId CHAR(36) NOT NULL,
  subjectId CHAR(36) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_teacher FOREIGN KEY (teacherId) REFERENCES teachers(id) ON DELETE CASCADE,
  CONSTRAINT fk_student FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_class FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_subject FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_teacher_student_class_subject (teacherId, studentId, classId, subjectId)
);
