using System.ComponentModel.DataAnnotations;

namespace ProfileManagement.API.DTOs.Profile
{
    public class UpdateProfileRequest
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
