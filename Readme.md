# Profile Management System

A full-stack profile and portfolio management platform built with **ASP.NET Core 10** and **React + TypeScript**.

Users can create accounts, build their professional portfolio (education, work experience, skills, projects, social links), and share it publicly. Admins can manage and search users.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 10 Web API |
| Frontend | React + TypeScript (Vite) |
| Database | SQL Server + Entity Framework Core |
| Auth | ASP.NET Core Identity + JWT |
| UI | Tailwind CSS v4 + shadcn/ui |

---

## Project Structure

```
ProfileManagementSystem/
├── ProfileManagement.API/       — ASP.NET Core 10 Web API
├── ProfileManagementFrontend/   — React + TypeScript frontend
└── ProfileManagementSystem.sln  — Visual Studio solution file
```

For setup and run instructions, see the README in each project folder:

- [Backend Setup](./ProfileManagement.API/README.md)
- [Frontend Setup](./ProfileManagementFrontend/README.md)

---

## Features

- JWT authentication with role-based access (Admin / User)
- Profile management — bio, city, country, date of birth, profile picture
- Portfolio modules — Education, Work Experience, Skills, Projects, Social Links
- Public portfolio pages — shareable, no login required
- Admin dashboard — search, filter, and deactivate users
- Soft delete across all entities

---

## Author

**Rahul Maharjan** — [@mhrjnrahul](https://github.com/mhrjnrahul)