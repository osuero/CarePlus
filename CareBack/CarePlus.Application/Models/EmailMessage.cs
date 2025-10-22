using System.Collections.Generic;

namespace CarePlus.Application.Models;

public class EmailMessage
{
    public required string Subject { get; init; }
    public required string Body { get; init; }
    public bool IsBodyHtml { get; init; } = true;
    public string? From { get; init; }
    public IReadOnlyCollection<string> To { get; init; } = new List<string>();
    public IReadOnlyCollection<string> Cc { get; init; } = new List<string>();
    public IReadOnlyCollection<string> Bcc { get; init; } = new List<string>();
}
