# ProfileManagement.API

ASP.NET Core 10 Web API backend for the Profile Management System.

---

## Tech Stack

- ASP.NET Core 10
- Entity Framework Core 10 + SQL Server
- ASP.NET Core Identity
- JWT Bearer Authentication
- AutoMapper
- FluentValidation
- Swagger / Swashbuckle

---

## Architecture

```
Controller → Service → Repository → DbContext
```

- Repository Pattern with Unit of Work
- Interface-driven
- DTOs only — entities never exposed
- Soft delete via global EF Core query filters
- JWT userId extracted from `ClaimTypes.NameIdentifier`

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server (local or remote)
- Visual Studio 2022 / VS Code / Rider

---

## Setup

**1. Clone the repo**
```bash
git clone https://github.com/mhrjnrahul/ProfileManagementSystem.git
cd ProfileManagementSystem/ProfileManagement.API
```

**2. Create `appsettings.Development.json`**

Create this file in the `ProfileManagement.API` folder — it is gitignored and must be created manually:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=ProfileManagementApiDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-min-32-characters-long",
    "Issuer": "ProfileManagement.API",
    "Audience": "ProfileManagement.Client",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  }
}
```

Replace `YOUR_SERVER` with your SQL Server instance name.

**3. Apply migrations**
```bash
dotnet ef database update
```

**4. Run the API**
```bash
dotnet run --launch-profile http
```

API runs on `http://localhost:5016`. Swagger available at `http://localhost:5016/swagger`.

---

## Seeded Data

On first run the following are seeded automatically:

| | |
|---|---|
| Roles | `Admin`, `User` |
| Admin user | `admin@profile.com` / `Admin@1234` |

---

## API Endpoints

| Module | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Profile | `GET /api/profile`, `GET /api/profile/me`, `PUT /api/profile/me`, `GET /api/profile/{userId}`, `PUT /api/profile/{userId}/deactivate`, `GET /api/profile/search` |
| Education | `GET /api/education`, `POST /api/education`, `PUT /api/education/{id}`, `DELETE /api/education/{id}`, `GET /api/education/public/{userId}` |
| WorkExperience | `GET /api/workexperience`, `POST /api/workexperience`, `PUT /api/workexperience/{id}`, `DELETE /api/workexperience/{id}`, `GET /api/workexperience/public/{userId}` |
| Skill | `GET /api/skill`, `POST /api/skill`, `PUT /api/skill/{id}`, `DELETE /api/skill/{id}`, `GET /api/skill/public/{userId}` |
| Project | `GET /api/project`, `POST /api/project`, `PUT /api/project/{id}`, `DELETE /api/project/{id}`, `GET /api/project/public/{userId}` |
| SocialLink | `GET /api/sociallink`, `POST /api/sociallink`, `PUT /api/sociallink/{id}`, `DELETE /api/sociallink/{id}`, `GET /api/sociallink/public/{userId}` |