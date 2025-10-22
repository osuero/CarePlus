using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.Interfaces.Services;
using CarePlus.Application.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CarePlus.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailSettings> settings, ILogger<EmailService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(message);

        if (message.To is null || !message.To.Any())
        {
            throw new InvalidOperationException("El mensaje de correo debe contener al menos un destinatario.");
        }

        using var smtpClient = new SmtpClient(_settings.Host, _settings.Port)
        {
            EnableSsl = _settings.EnableSsl,
            UseDefaultCredentials = _settings.UseDefaultCredentials
        };

        if (!string.IsNullOrWhiteSpace(_settings.UserName))
        {
            smtpClient.Credentials = new NetworkCredential(_settings.UserName, _settings.Password);
        }

        var fromAddress = new MailAddress(
            string.IsNullOrWhiteSpace(message.From) ? _settings.From : message.From!,
            _settings.DisplayName);

        using var mailMessage = new MailMessage
        {
            From = fromAddress,
            Subject = message.Subject,
            Body = message.Body,
            IsBodyHtml = message.IsBodyHtml
        };

        foreach (var recipient in message.To.Where(address => !string.IsNullOrWhiteSpace(address)))
        {
            mailMessage.To.Add(recipient);
        }

        if (message.Cc is not null)
        {
            foreach (var recipient in message.Cc.Where(address => !string.IsNullOrWhiteSpace(address)))
            {
                mailMessage.CC.Add(recipient);
            }
        }

        if (message.Bcc is not null)
        {
            foreach (var recipient in message.Bcc.Where(address => !string.IsNullOrWhiteSpace(address)))
            {
                mailMessage.Bcc.Add(recipient);
            }
        }

        try
        {
            using var cancellationRegistration = cancellationToken.Register(smtpClient.SendAsyncCancel);
            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("El envío de correo fue cancelado antes de completarse.");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar correo electrónico a {Recipients}", string.Join(", ", message.To));
            throw;
        }
    }
}
