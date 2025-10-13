using CarePlus.Application.DTOs.Users;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Mappers;

internal static class UserMapper
{
    public static UserResponse ToResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            TenantId = user.TenantId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Identification = user.Identification,
            Country = user.Country,
            Gender = user.Gender.ToString(),
            DateOfBirth = user.DateOfBirth,
            Age = user.Age,
            CreatedAtUtc = user.CreatedAtUtc,
            UpdatedAtUtc = user.UpdatedAtUtc,
            RoleId = user.RoleId,
            RoleName = user.Role?.Name
        };
    }
}
