using System;
using CarePlus.Domain.Base;
using CarePlus.Domain.Enums;

namespace CarePlus.Domain.Entities;

public class User : TenantEntity
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Identification { get; set; }
    public string? Country { get; set; }
    public Gender Gender { get; set; } = Gender.Unknown;
    public DateOnly DateOfBirth { get; set; }
    public Guid? RoleId { get; set; }
    public Role? Role { get; set; }

    public string? PasswordHash { get; set; }
    public bool IsPasswordConfirmed { get; set; }
    public string? PasswordSetupToken { get; set; }
    public DateTime? PasswordSetupTokenExpiresAtUtc { get; set; }
    public DateTime? PasswordConfirmedAtUtc { get; set; }

    public int Age => CalculateAge(DateOfBirth, DateTime.UtcNow.Date);

    public void AssignPassword(string hashedPassword, bool confirmed = false)
    {
        PasswordHash = hashedPassword;
        IsPasswordConfirmed = confirmed;
        PasswordConfirmedAtUtc = confirmed ? DateTime.UtcNow : null;
        if (!confirmed)
        {
            PasswordConfirmedAtUtc = null;
        }
    }

    public void MarkPasswordSetup(string token, DateTime expiresAtUtc)
    {
        PasswordSetupToken = token;
        PasswordSetupTokenExpiresAtUtc = expiresAtUtc;
        Touch();
    }

    public void CompletePasswordSetup()
    {
        PasswordSetupToken = null;
        PasswordSetupTokenExpiresAtUtc = null;
        IsPasswordConfirmed = true;
        PasswordConfirmedAtUtc = DateTime.UtcNow;
        Touch();
    }

    private static int CalculateAge(DateOnly birthDate, DateTime today)
    {
        var age = today.Year - birthDate.Year;
        if (birthDate.ToDateTime(TimeOnly.MinValue) > today.AddYears(-age))
        {
            age--;
        }

        return age < 0 ? 0 : age;
    }
}
