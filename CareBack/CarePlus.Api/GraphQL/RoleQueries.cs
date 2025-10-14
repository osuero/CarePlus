using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Roles;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using HotChocolate;
using HotChocolate.Types;

namespace CarePlus.Api.GraphQL;

[ExtendObjectType(OperationTypeNames.Query)]
public class RoleQueries
{
    [GraphQLName("getRoles")]
    public async Task<RoleCollectionPayload> GetRolesAsync(
        int page = 1,
        int pageSize = 20,
        string? search = null,
        bool includeGlobal = true,
        [Service] ITenantProvider tenantProvider = default!,
        [Service] IRoleQueryService roleQueryService = default!,
        CancellationToken cancellationToken = default)
    {
        var tenantId = tenantProvider.GetTenantId();
        var result = await roleQueryService.SearchAsync(tenantId, page, pageSize, search, includeGlobal, cancellationToken);

        return new RoleCollectionPayload
        {
            Nodes = result.Items,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };
    }

    [GraphQLName("getRole")]
    public async Task<RoleResponse?> GetRoleAsync(
        Guid id,
        bool includeGlobal = true,
        [Service] ITenantProvider tenantProvider = default!,
        [Service] IRoleQueryService roleQueryService = default!,
        CancellationToken cancellationToken = default)
    {
        var tenantId = tenantProvider.GetTenantId();
        return await roleQueryService.GetByIdAsync(tenantId, id, includeGlobal, cancellationToken);
    }
}
