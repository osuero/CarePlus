using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Countries;
using CarePlus.Application.Interfaces.Services;

namespace CarePlus.Infrastructure.Services;

internal sealed class CountryService : ICountryService
{
    private static readonly Lazy<IReadOnlyList<CountryResponse>> Countries = new(LoadCountries);

    public Task<IReadOnlyList<CountryResponse>> SearchAsync(string? query, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var data = Countries.Value;

        if (string.IsNullOrWhiteSpace(query))
        {
            return Task.FromResult(data);
        }

        var term = query.Trim();

        var results = data
            .Where(country =>
                country.Name.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                country.Code.Contains(term, StringComparison.OrdinalIgnoreCase))
            .ToList()
            .AsReadOnly();

        return Task.FromResult<IReadOnlyList<CountryResponse>>(results);
    }

    private static IReadOnlyList<CountryResponse> LoadCountries()
    {
        var countries = CultureInfo
            .GetCultures(CultureTypes.SpecificCultures)
            .Select(culture =>
            {
                try
                {
                    return new RegionInfo(culture.Name);
                }
                catch (CultureNotFoundException)
                {
                    return null;
                }
            })
            .Where(region => region is not null && !string.IsNullOrWhiteSpace(region.TwoLetterISORegionName))
            .GroupBy(region => region!.TwoLetterISORegionName, StringComparer.OrdinalIgnoreCase)
            .Select(group => new CountryResponse
            {
                Code = group.Key,
                Name = group
                    .Select(region => region!.EnglishName)
                    .OrderBy(name => name, StringComparer.OrdinalIgnoreCase)
                    .First()
            })
            .OrderBy(country => country.Name, StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (countries.Count == 0)
        {
            throw new InvalidOperationException("No se pudieron cargar los paises usando las culturas disponibles.");
        }

        return countries.AsReadOnly();
    }
}
