using System;
using CarePlus.Application.DTOs.Users;
using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IUserService
{
    Task<Result<UserResponse>> RegisterAsync(string tenantId, RegisterUserRequest request, CancellationToken cancellationToken = default);
    Task<Result<UserResponse>> UpdateAsync(string tenantId, Guid id, UpdateUserRequest request, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(string tenantId, Guid id, CancellationToken cancellationToken = default);
}
