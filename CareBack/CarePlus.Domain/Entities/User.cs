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

    public int Age => CalculateAge(DateOfBirth, DateTime.UtcNow.Date);

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
