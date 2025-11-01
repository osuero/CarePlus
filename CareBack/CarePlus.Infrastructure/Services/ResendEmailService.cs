using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.Interfaces.Services;
using ApplicationEmailMessage = CarePlus.Application.Models.EmailMessage;
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

    public async Task SendAsync(ApplicationEmailMessage message, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(message);

        var sender = string.IsNullOrWhiteSpace(message.From) ? _options.DefaultFrom : message.From;
        if (string.IsNullOrWhiteSpace(sender))
        {
            throw new InvalidOperationException("El remitente predeterminado de Resend no esta configurado.");
        }

        var to = message.To?.Where(address => !string.IsNullOrWhiteSpace(address)).ToArray();
        if (to is null || to.Length == 0)
        {
            throw new InvalidOperationException("El mensaje de correo debe contener al menos un destinatario.");
        }

        var cc = message.Cc?.Where(address => !string.IsNullOrWhiteSpace(address)).ToArray();
        var bcc = message.Bcc?.Where(address => !string.IsNullOrWhiteSpace(address)).ToArray();

        var resendMessage = new Resend.EmailMessage
        {
            From = sender!,
            To = to,
            Subject = string.IsNullOrWhiteSpace(message.Subject) ? "(sin asunto)" : message.Subject!,
            HtmlBody = message.IsBodyHtml ? message.Body : null,
            TextBody = message.IsBodyHtml ? null : message.Body,
            Cc = cc is { Length: > 0 } ? cc : Array.Empty<string>(),
            Bcc = bcc is { Length: > 0 } ? bcc : Array.Empty<string>()
        };

        await _client.EmailSendAsync(resendMessage, cancellationToken).ConfigureAwait(false);
    }
}
