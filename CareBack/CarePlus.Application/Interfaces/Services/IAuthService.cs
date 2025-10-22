using CarePlus.Application.DTOs.Auth;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IAuthService
{
    Task<Result<LoginResponse>> LoginAsync(string tenantId, LoginRequest request, CancellationToken cancellationToken = default);
    Task<Result> CompletePasswordSetupAsync(CompletePasswordSetupRequest request, CancellationToken cancellationToken = default);
}
