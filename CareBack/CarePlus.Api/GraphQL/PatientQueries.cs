using System;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Patients;
using CarePlus.Application.Interfaces;
using CarePlus.Application.Interfaces.Services;
using HotChocolate;
using HotChocolate.Types;

namespace CarePlus.Api.GraphQL;

[ExtendObjectType(OperationTypeNames.Query)]
public class PatientQueries
{
    public async Task<PatientCollectionPayload> GetPatientsAsync(
        int page = 1,
        int pageSize = 20,
        string? search = null,
        string? gender = null,
        string? country = null,
        [Service] ITenantProvider tenantProvider = default!,
        [Service] IPatientQueryService patientQueryService = default!,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var tenantId = tenantProvider.GetTenantId();
        var result = await patientQueryService.SearchAsync(
            tenantId,
            page,
            pageSize,
            search,
            gender,
            country,
            cancellationToken);

        return new PatientCollectionPayload
        {
            Nodes = result.Items,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };
    }

    public async Task<PatientResponse?> GetPatientAsync(
        Guid? id,
        string? search,
        [Service] ITenantProvider tenantProvider = default!,
        [Service] IPatientQueryService patientQueryService = default!,
        CancellationToken cancellationToken = default)
    {
        var tenantId = tenantProvider.GetTenantId();

        if (id is not null && id != Guid.Empty)
        {
            return await patientQueryService.GetByIdAsync(tenantId, id.Value, cancellationToken);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            return await patientQueryService.FindAsync(tenantId, search, cancellationToken);
        }

        return null;
    }
}
