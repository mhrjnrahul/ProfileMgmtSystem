using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ProfileManagement.API.Data;
using ProfileManagement.API.Entities;
using ProfileManagement.API.Repositories.Implementations;
using ProfileManagement.API.Services.Implementations;
using ProfileManagement.API.Services.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers
//builder.Services.AddControllers();
builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = false;
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]!;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey))
    };
});

// Repositories and Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

//automapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

//service
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEducationService, EducationService>();
builder.Services.AddScoped<IWorkExperienceService, WorkExperienceService>();
builder.Services.AddScoped<ISkillService, SkillService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ISocialLinkService, SocialLinkService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Profile Management API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Enter: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Seed roles and admin
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole>>();

    foreach (var role in new[] { "Admin", "User" })
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    var userManager = scope.ServiceProvider
        .GetRequiredService<UserManager<ApplicationUser>>();

    var adminEmail = "admin@profile.com";
    if (await userManager.FindByEmailAsync(adminEmail) == null)
    {
        var admin = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "Admin",
            LastName = "User",
            IsActive = true
        };
        await userManager.CreateAsync(admin, "Admin@1234");
        await userManager.AddToRoleAsync(admin, "Admin");
    }
}

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Profile Management API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();