using CarePlus.Application.Interfaces.Services;
using CarePlus.Infrastructure.Options;
using Microsoft.Extensions.Options;
using Resend;

namespace CarePlus.Infrastructure.Services;

public sealed class ResendEmailService : IEmailService
{
    private readonly IResend _client;
    private readonly ResendOptions _options;

    public ResendEmailService(IResend client, IOptions<ResendOptions> options)
    {
        _client = client;
        _options = options.Value;
    }

    public async Task SendAsync(
        string to,
        string subject,
        string htmlBody,
        string? from = null,
        CancellationToken cancellationToken = default)
    {
        var sender = string.IsNullOrWhiteSpace(from) ? _options.DefaultFrom : from;

        if (string.IsNullOrWhiteSpace(sender))
        {
            throw new InvalidOperationException("El remitente predeterminado de Resend no está configurado.");
        }

        var message = new EmailMessage
        {
            From = sender,
            To = to,
            Subject = subject,
            HtmlBody = htmlBody,
        };

        await _client.EmailSendAsync(message, cancellationToken).ConfigureAwait(false);
    }
}
