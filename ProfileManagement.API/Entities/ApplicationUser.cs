using Microsoft.AspNetCore.Identity;

namespace ProfileManagement.API.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string? Bio { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; } 
        public string? ProfilePicture { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
