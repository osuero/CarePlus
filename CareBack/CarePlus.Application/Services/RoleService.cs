using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Roles;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Mappers;
using CarePlus.Application.Models;
using CarePlus.Domain.Constants;
using CarePlus.Domain.Entities;

namespace CarePlus.Application.Services;

public class RoleService(IRoleRepository roleRepository) : IRoleService
{
    private readonly IRoleRepository _roleRepository = roleRepository;

    public async Task<Result<RoleResponse>> CreateAsync(string tenantId, CreateRoleRequest request, CancellationToken cancellationToken = default)
    {
        var validation = Validate(request.Name);
        if (!validation.IsSuccess)
        {
            return Result<RoleResponse>.Failure(validation.ErrorCode!, validation.ErrorMessage!);
        }

        var normalizedName = NormalizeName(request.Name!);
        var targetTenantId = request.IsGlobal ? TenantConstants.GlobalTenantId : tenantId;

        var existing = await _roleRepository.GetByNameAsync(targetTenantId, normalizedName, cancellationToken);
        if (existing is not null)
        {
            return Result<RoleResponse>.Failure("role.exists", "Ya existe un rol con el nombre proporcionado.");
        }

        var role = new Role
        {
            TenantId = targetTenantId,
            Name = normalizedName,
            Description = NormalizeDescription(request.Description),
            IsGlobal = request.IsGlobal
        };

        role = await _roleRepository.AddAsync(role, cancellationToken);
        return Result<RoleResponse>.Success(RoleMapper.ToResponse(role));
    }

    public async Task<Result<RoleResponse>> UpdateAsync(string tenantId, Guid id, UpdateRoleRequest request, CancellationToken cancellationToken = default)
    {
        var validation = Validate(request.Name);
        if (!validation.IsSuccess)
        {
            return Result<RoleResponse>.Failure(validation.ErrorCode!, validation.ErrorMessage!);
        }

        var role = await _roleRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (role is null || (!role.IsGlobal && !string.Equals(role.TenantId, tenantId, StringComparison.OrdinalIgnoreCase)))
        {
            return Result<RoleResponse>.Failure("role.notFound", "El rol solicitado no existe.");
        }

        var normalizedName = NormalizeName(request.Name!);
        var targetTenantId = request.IsGlobal ? TenantConstants.GlobalTenantId : tenantId;

        var existing = await _roleRepository.GetByNameAsync(targetTenantId, normalizedName, cancellationToken);
        if (existing is not null && existing.Id != role.Id)
        {
            return Result<RoleResponse>.Failure("role.exists", "Ya existe un rol con el nombre proporcionado.");
        }

        role.Name = normalizedName;
        role.Description = NormalizeDescription(request.Description);
        role.IsGlobal = request.IsGlobal;
        role.TenantId = role.IsGlobal ? TenantConstants.GlobalTenantId : tenantId;
        role.Touch();

        var updated = await _roleRepository.UpdateAsync(role, cancellationToken);
        return Result<RoleResponse>.Success(RoleMapper.ToResponse(updated));
    }

    public async Task<Result> DeleteAsync(string tenantId, Guid id, CancellationToken cancellationToken = default)
    {
        var role = await _roleRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (role is null || (!role.IsGlobal && !string.Equals(role.TenantId, tenantId, StringComparison.OrdinalIgnoreCase)))
        {
            return Result.Failure("role.notFound", "El rol solicitado no existe.");
        }

        if (role.IsDeleted)
        {
            return Result.Success();
        }

        role.MarkDeleted();
        await _roleRepository.DeleteAsync(role, cancellationToken);
        return Result.Success();
    }

    private static Result Validate(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result.Failure("validation.name.required", "El nombre del rol es requerido.");
        }

        if (name.Length > 100)
        {
            return Result.Failure("validation.name.length", "El nombre del rol excede la longitud permitida.");
        }

        return Result.Success();
    }

    private static string NormalizeName(string name) => name.Trim();

    private static string? NormalizeDescription(string? description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            return null;
        }

        var trimmed = description.Trim();
        return trimmed.Length > 256 ? trimmed[..256] : trimmed;
    }
}
