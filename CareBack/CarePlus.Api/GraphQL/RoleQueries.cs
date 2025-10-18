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
        try
        {
            var tenantId = tenantProvider.GetTenantId();
            var result = await roleQueryService.SearchAsync(tenantId, page, pageSize, search, includeGlobal, cancellationToken);

            if (result.Items.Count == 0)
            {
                throw CreateGraphQLError(
                    "role.notFound",
                    $"No se encontraron roles configurados para el tenant '{tenantId}'.");
            }

            return new RoleCollectionPayload
            {
                Nodes = result.Items,
                TotalCount = result.TotalCount,
                Page = result.Page,
                PageSize = result.PageSize
            };
        }
        catch (GraphQLException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw CreateGraphQLError("role.fetchFailed", ex.Message);
        }
    }

    [GraphQLName("getRole")]
    public async Task<RoleResponse?> GetRoleAsync(
        Guid id,
        bool includeGlobal = true,
        [Service] ITenantProvider tenantProvider = default!,
        [Service] IRoleQueryService roleQueryService = default!,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var tenantId = tenantProvider.GetTenantId();
            var role = await roleQueryService.GetByIdAsync(tenantId, id, includeGlobal, cancellationToken);
            if (role is null)
            {
                throw CreateGraphQLError("role.notFound", $"El rol solicitado no existe para el tenant '{tenantId}'.");
            }

            return role;
        }
        catch (GraphQLException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw CreateGraphQLError("role.fetchFailed", ex.Message);
        }
    }

    private static GraphQLException CreateGraphQLError(string? code, string? message)
    {
        return new GraphQLException(ErrorBuilder.New()
            .SetMessage(message ?? "Ocurrio un error al consultar los roles.")
            .SetCode(code ?? "role.error")
            .Build());
    }
}
