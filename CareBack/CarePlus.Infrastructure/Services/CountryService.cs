using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Countries;
using CarePlus.Application.Interfaces.Services;

namespace CarePlus.Infrastructure.Services;

internal sealed class CountryService : ICountryService
{
    private const string EmbeddedResourceName = "CarePlus.Infrastructure.Services.countries.json";

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
        var countries = LoadFromCultures();
        if (countries.Count > 0)
        {
            return countries;
        }

        countries = LoadFromEmbeddedResource();
        if (countries.Count > 0)
        {
            return countries;
        }

        throw new InvalidOperationException("No se pudieron cargar los paises desde las culturas disponibles ni desde el recurso embebido.");
    }

    private static IReadOnlyList<CountryResponse> LoadFromCultures()
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
            .Where(region =>
                region is not null &&
                !string.IsNullOrWhiteSpace(region.TwoLetterISORegionName) &&
                region.TwoLetterISORegionName.Length == 2)
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

        return countries.Count == 0
            ? Array.Empty<CountryResponse>()
            : countries.AsReadOnly();
    }

    private static IReadOnlyList<CountryResponse> LoadFromEmbeddedResource()
    {
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream(EmbeddedResourceName);
        if (stream is null)
        {
            return Array.Empty<CountryResponse>();
        }

        using var reader = new StreamReader(stream);
        var json = reader.ReadToEnd();
        if (string.IsNullOrWhiteSpace(json))
        {
            return Array.Empty<CountryResponse>();
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var countries = JsonSerializer.Deserialize<List<CountryResponse>>(json, options);
        if (countries is null || countries.Count == 0)
        {
            return Array.Empty<CountryResponse>();
        }

        return countries
            .Where(country =>
                !string.IsNullOrWhiteSpace(country.Code) &&
                !string.IsNullOrWhiteSpace(country.Name))
            .OrderBy(country => country.Name, StringComparer.OrdinalIgnoreCase)
            .Select(country => new CountryResponse
            {
                Code = country.Code.Trim(),
                Name = country.Name.Trim()
            })
            .DistinctBy(country => country.Code, StringComparer.OrdinalIgnoreCase)
            .ToList()
            .AsReadOnly();
    }
}
