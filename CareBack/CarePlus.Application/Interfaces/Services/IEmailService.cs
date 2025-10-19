namespace CarePlus.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendAsync(
        string to,
        string subject,
        string htmlBody,
        string? from = null,
        CancellationToken cancellationToken = default);
}
