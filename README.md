# CodeAlpha Job Board Platform

A comprehensive job board backend service built with Node.js, Express.js, MongoDB, and JWT authentication. This platform connects employers with candidates, providing job posting, application tracking, and resume management features.

## Features

- **Employer Features**:
  - Company registration and authentication
  - Post and manage job listings
  - View and manage job applications
  - Update application status
  - Add notes to applications
  - Track application statistics

- **Candidate Features**:
  - Candidate registration and authentication
  - Search and filter jobs
  - Apply for jobs
  - Upload and manage resumes
  - Track application status
  - Update profile with skills and experience

- **Advanced Features**:
  - Job search with filters (location, job type, category, experience level, salary)
  - Full-text search for job keywords
  - Application status tracking
  - Resume upload with file validation
  - Job view tracking
  - Duplicate application prevention

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **express-validator** - Input validation
- **dotenv** - Environment variable management

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd CodeAlpha_JobBoardPlatform
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the root directory
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`
```
PORT=5003
MONGODB_URI=mongodb://localhost:27017/job-board
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Create uploads directory for resume storage
```bash
mkdir -p uploads/resumes
```

6. Start MongoDB server (if running locally)

7. Run the application
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### 1. Register Employer
**POST** `/api/auth/employer/register`

Request Body:
```json
{
  "companyName": "Tech Company Inc",
  "email": "employer@company.com",
  "password": "password123",
  "industry": "Technology",
  "companySize": "51-200",
  "website": "https://company.com",
  "location": "San Francisco, CA",
  "description": "Leading tech company"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userType": "employer",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k",
    "companyName": "Tech Company Inc",
    "email": "employer@company.com",
    "industry": "Technology"
  }
}
```

#### 2. Register Candidate
**POST** `/api/auth/candidate/register`

Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "location": "New York, NY",
  "skills": ["JavaScript", "Node.js", "React"],
  "experience": 5
}
```

#### 3. Login Employer
**POST** `/api/auth/employer/login`

Request Body:
```json
{
  "email": "employer@company.com",
  "password": "password123"
}
```

#### 4. Login Candidate
**POST** `/api/auth/candidate/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 5. Get Current User
**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer <token>
```

### Jobs

#### 6. Get All Jobs (with filters)
**GET** `/api/jobs`

Query Parameters:
- `keyword` - Search by keyword (title, description, skills)
- `location` - Filter by location
- `jobType` - Filter by job type (full-time, part-time, contract, internship, remote)
- `category` - Filter by category
- `experienceLevel` - Filter by experience level (entry, mid, senior, lead, executive)
- `salaryMin` - Minimum salary
- `salaryMax` - Maximum salary

Example:
```
GET /api/jobs?keyword=developer&location=San Francisco&jobType=full-time&salaryMin=50000
```

#### 7. Get Job by ID
**GET** `/api/jobs/:id`

#### 8. Create Job (Employer)
**POST** `/api/jobs`

Headers:
```
Authorization: Bearer <employer_token>
```

Request Body:
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for a senior software engineer...",
  "requirements": "5+ years of experience in software development...",
  "responsibilities": "Design and implement software solutions...",
  "location": "San Francisco, CA",
  "jobType": "full-time",
  "category": "Engineering",
  "experienceLevel": "senior",
  "skills": ["JavaScript", "Node.js", "React", "MongoDB"],
  "salary": {
    "min": 100000,
    "max": 150000,
    "currency": "USD",
    "isNegotiable": false
  },
  "applicationDeadline": "2024-03-31T23:59:59.000Z"
}
```

#### 9. Update Job (Employer)
**PUT** `/api/jobs/:id`

#### 10. Delete Job (Employer)
**DELETE** `/api/jobs/:id`

#### 11. Get Employer's Jobs (Employer)
**GET** `/api/jobs/employer/my-jobs`

### Applications

#### 12. Apply for Job (Candidate)
**POST** `/api/applications`

Headers:
```
Authorization: Bearer <candidate_token>
```

Request Body:
```json
{
  "jobId": "65a1b2c3d4e5f6g7h8i9j0k",
  "coverLetter": "I am very interested in this position...",
  "expectedSalary": 120000,
  "resume": "path/to/resume.pdf"
}
```

#### 13. Get Candidate's Applications (Candidate)
**GET** `/api/applications/candidate/my-applications`

#### 14. Get Employer's Received Applications (Employer)
**GET** `/api/applications/employer/received`

Query Parameters:
- `status` - Filter by status (pending, reviewed, interview, offered, rejected, withdrawn)
- `jobId` - Filter by job ID

#### 15. Get Application by ID
**GET** `/api/applications/:id`

#### 16. Update Application Status (Employer)
**PUT** `/api/applications/:id/status`

Request Body:
```json
{
  "status": "interview"
}
```

#### 17. Add Note to Application (Employer)
**POST** `/api/applications/:id/notes`

Request Body:
```json
{
  "note": "Candidate showed strong technical skills"
}
```

#### 18. Withdraw Application (Candidate)
**DELETE** `/api/applications/:id`

### Resumes & Profile

#### 19. Upload Resume (Candidate)
**POST** `/api/resumes/upload`

Headers:
```
Authorization: Bearer <candidate_token>
Content-Type: multipart/form-data
```

Body (form-data):
- `resume` - File (PDF, DOC, DOCX, max 5MB)

#### 20. Update Candidate Profile (Candidate)
**PUT** `/api/resumes/profile`

Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "location": "New York, NY",
  "skills": ["JavaScript", "Node.js", "React", "Python"],
  "experience": 5,
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "year": "2018"
    }
  ],
  "linkedin": "https://linkedin.com/in/johndoe",
  "github": "https://github.com/johndoe",
  "portfolio": "https://johndoe.dev",
  "bio": "Full-stack developer with 5 years of experience"
}
```

#### 21. Get Candidate Profile (Candidate)
**GET** `/api/resumes/profile`

## Project Structure

```
JobBoardPlatform/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── jobController.js         # Job management logic
│   │   ├── applicationController.js # Application logic
│   │   └── resumeController.js      # Resume & profile logic
│   ├── models/
│   │   ├── Employer.js              # Employer schema
│   │   ├── Candidate.js             # Candidate schema
│   │   ├── Job.js                   # Job schema
│   │   └── Application.js           # Application schema
│   ├── routes/
│   │   ├── authRoutes.js            # Authentication routes
│   │   ├── jobRoutes.js             # Job routes
│   │   ├── applicationRoutes.js     # Application routes
│   │   └── resumeRoutes.js          # Resume & profile routes
│   ├── middleware/
│   │   ├── auth.js                  # Authentication middleware
│   │   └── errorHandler.js          # Error handling
│   └── server.js                    # App entry point
├── uploads/
│   └── resumes/                     # Resume file storage
├── .env.example                     # Environment variables template
├── package.json                     # Dependencies
└── README.md                        # Documentation
```

## Database Schema

### Employer Model
```javascript
{
  companyName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  industry: String (required),
  companySize: String (enum: ['1-10', '11-50', '51-200', '201-500', '500+']),
  website: String,
  location: String (required),
  description: String,
  logo: String,
  isVerified: Boolean (default: false),
  createdAt: Date
}
```

### Candidate Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  location: String (required),
  skills: [String],
  experience: Number (default: 0),
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  resume: String,
  linkedin: String,
  github: String,
  portfolio: String,
  bio: String,
  createdAt: Date
}
```

### Job Model
```javascript
{
  title: String (required),
  description: String (required),
  requirements: String (required),
  responsibilities: String (required),
  employer: ObjectId (ref: Employer, required),
  location: String (required),
  jobType: String (enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']),
  salary: {
    min: Number,
    max: Number,
    currency: String (default: 'USD'),
    isNegotiable: Boolean
  },
  experienceLevel: String (enum: ['entry', 'mid', 'senior', 'lead', 'executive']),
  skills: [String],
  category: String (required),
  applicationDeadline: Date,
  isActive: Boolean (default: true),
  applicationCount: Number (default: 0),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```javascript
{
  job: ObjectId (ref: Job, required),
  candidate: ObjectId (ref: Candidate, required),
  employer: ObjectId (ref: Employer, required),
  status: String (enum: ['pending', 'reviewed', 'interview', 'offered', 'rejected', 'withdrawn']),
  coverLetter: String,
  resume: String (required),
  expectedSalary: Number,
  notes: [{
    addedBy: ObjectId (ref: Employer),
    note: String,
    createdAt: Date
  }],
  appliedAt: Date,
  updatedAt: Date
}
```

## Key Features

### Job Search & Filtering
The platform provides advanced job search capabilities:
- Full-text search across job title, description, and skills
- Filter by location, job type, category, and experience level
- Salary range filtering
- Text indexes for fast search performance

### Application Management
- Candidates can track all their applications in one place
- Employers can view all applications for their posted jobs
- Application status workflow: pending → reviewed → interview → offered/rejected
- Employers can add private notes to applications
- Candidates can withdraw applications

### Resume Upload
- Secure file upload with validation
- Supports PDF, DOC, and DOCX formats
- 5MB file size limit
- Automatic file naming with timestamps
- File stored in `uploads/resumes/` directory

### Duplicate Prevention
- One candidate can only apply once per job
- Unique index on job + candidate combination
- Error message returned for duplicate applications

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

The system supports two user types:
- **Employer**: Can post jobs and manage applications
- **Candidate**: Can search jobs, apply, and manage their profile

Role-based access control ensures users can only access appropriate endpoints.

## Testing with Postman

Import the provided Postman collection to test all endpoints:

1. Open Postman
2. Click Import
3. Select the `JobBoardPlatform.postman_collection.json` file
4. Update the `baseUrl` variable to match your server
5. Test each endpoint

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- Resource not found errors
- File upload errors
- Duplicate application errors

All errors return a JSON response with:
```json
{
  "success": false,
  "error": "Error message"
}
```

## File Upload Requirements

- **Supported formats**: PDF, DOC, DOCX
- **Maximum file size**: 5MB
- **Storage location**: `uploads/resumes/`
- **Automatic validation**: File type and size checked before upload

## License

ISC

## Author

CodeAlpha Intern

## Acknowledgments

This project was developed as part of the CodeAlpha Backend Development Internship program.
