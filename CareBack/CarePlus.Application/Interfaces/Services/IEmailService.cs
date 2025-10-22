using CarePlus.Application.Models;

namespace CarePlus.Application.Interfaces.Services;

public interface IEmailService
{
    Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default);
}
