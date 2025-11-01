namespace CarePlus.Infrastructure.Options;

public sealed class ResendOptions
{
    public string ApiKey { get; set; } = string.Empty;

    public string DefaultFrom { get; set; } = string.Empty;
}
