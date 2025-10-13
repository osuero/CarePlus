using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Users;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using HotChocolate;
using HotChocolate.Types;

namespace CarePlus.Api.GraphQL;

[ExtendObjectType(OperationTypeNames.Query)]
public class UserQueries
{
    public async Task<UserCollectionPayload> GetUsersAsync(
        int page = 1,
        int pageSize = 20,
        string? search = null,
        [Service] ITenantProvider tenantProvider = default!,
        [Service] IUserQueryService userQueryService = default!,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var tenantId = tenantProvider.GetTenantId();
        var result = await userQueryService.SearchAsync(tenantId, page, pageSize, search, cancellationToken);

        return new UserCollectionPayload
        {
            Nodes = result.Items,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };
    }

    public async Task<UserResponse?> GetUserAsync(
        Guid? id,
        string? search,
        [Service] ITenantProvider tenantProvider = default!,
        [Service] IUserQueryService userQueryService = default!,
        CancellationToken cancellationToken = default)
    {
        var tenantId = tenantProvider.GetTenantId();

        if (id is not null && id != Guid.Empty)
        {
            return await userQueryService.GetByIdAsync(tenantId, id.Value, cancellationToken);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            return await userQueryService.FindAsync(tenantId, search, cancellationToken);
        }

        return null;
    }
}
