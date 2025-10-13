using CarePlus.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace CarePlus.Api.Infrastructure.Tenancy;

public class HttpContextTenantProvider(IHttpContextAccessor httpContextAccessor) : ITenantProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public string GetTenantId()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            return "default";
        }

        if (httpContext.Request.Headers.TryGetValue("X-Tenant-Id", out var headerValue))
        {
            var candidate = headerValue.ToString().Trim();
            if (!string.IsNullOrWhiteSpace(candidate))
            {
                return candidate;
            }
        }

        return "default";
    }
}
