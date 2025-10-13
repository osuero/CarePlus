using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Roles;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;

namespace CarePlus.Api.GraphQL;

[ExtendObjectType(OperationTypeNames.Mutation)]
public class RoleMutations
{
    public async Task<RoleResponse> CreateRoleAsync(
        CreateRoleInput input,
        [Service] ITenantProvider tenantProvider,
        [Service] IRoleService roleService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var request = new CreateRoleRequest
        {
            Name = input.Name,
            Description = input.Description,
            IsGlobal = input.IsGlobal
        };

        var result = await roleService.CreateAsync(tenantId, request, cancellationToken);
        if (!result.IsSuccess)
        {
            throw CreateGraphQLError(result.ErrorCode, result.ErrorMessage);
        }

        return result.Value!;
    }

    public async Task<RoleResponse> UpdateRoleAsync(
        Guid id,
        UpdateRoleInput input,
        [Service] ITenantProvider tenantProvider,
        [Service] IRoleService roleService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var request = new UpdateRoleRequest
        {
            Name = input.Name,
            Description = input.Description,
            IsGlobal = input.IsGlobal
        };

        var result = await roleService.UpdateAsync(tenantId, id, request, cancellationToken);
        if (!result.IsSuccess)
        {
            throw CreateGraphQLError(result.ErrorCode, result.ErrorMessage);
        }

        return result.Value!;
    }

    public async Task<bool> DeleteRoleAsync(
        Guid id,
        [Service] ITenantProvider tenantProvider,
        [Service] IRoleService roleService,
        CancellationToken cancellationToken)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await roleService.DeleteAsync(tenantId, id, cancellationToken);
        if (!result.IsSuccess)
        {
            throw CreateGraphQLError(result.ErrorCode, result.ErrorMessage);
        }

        return true;
    }

    private static GraphQLException CreateGraphQLError(string? code, string? message)
    {
        return new GraphQLException(ErrorBuilder.New()
            .SetMessage(message ?? "Ocurrio un error al procesar la solicitud del rol.")
            .SetCode(code ?? "role.error")
            .Build());
    }
}

public record CreateRoleInput(string Name, string? Description, bool IsGlobal);
public record UpdateRoleInput(string Name, string? Description, bool IsGlobal);
