using System;

namespace CarePlus.Application.DTOs.Auth;

public class PasswordSetupInfoResponse
{
    public Guid UserId { get; init; }
    public string Email { get; init; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public bool IsPasswordConfirmed { get; init; }
}
