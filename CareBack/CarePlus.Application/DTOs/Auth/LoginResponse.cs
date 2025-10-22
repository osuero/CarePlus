using CarePlus.Application.DTOs.Users;
using System;

namespace CarePlus.Application.DTOs.Auth;

public class LoginResponse
{
    public required UserResponse User { get; init; }
    public required string AccessToken { get; init; }
    public DateTime ExpiresAtUtc { get; init; }
    public string? RefreshToken { get; init; }
}
