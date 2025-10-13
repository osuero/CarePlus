using System;
using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Users;

public class RegisterUserRequest
{
    [Required, MaxLength(100)]
    public string? FirstName { get; set; }

    [Required, MaxLength(100)]
    public string? LastName { get; set; }

    [Required, EmailAddress, MaxLength(256)]
    public string? Email { get; set; }

    [Phone, MaxLength(32)]
    public string? PhoneNumber { get; set; }

    [MaxLength(50)]
    public string? Identification { get; set; }

    [MaxLength(100)]
    public string? Country { get; set; }

    [Required, MaxLength(20)]
    public string? Gender { get; set; }

    [Required]
    public DateOnly? DateOfBirth { get; set; }
}
