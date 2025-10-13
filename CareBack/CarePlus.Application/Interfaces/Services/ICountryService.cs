using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Countries;

namespace CarePlus.Application.Interfaces.Services;

public interface ICountryService
{
    Task<IReadOnlyList<CountryResponse>> SearchAsync(string? query, CancellationToken cancellationToken = default);
}
