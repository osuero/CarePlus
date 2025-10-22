namespace CarePlus.Application.Models;

public class EmailSettings
{
    public string From { get; set; } = "no-reply@careplus.local";
    public string DisplayName { get; set; } = "CarePlus";
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 25;
    public bool EnableSsl { get; set; }
    public bool UseDefaultCredentials { get; set; }
    public string? UserName { get; set; }
    public string? Password { get; set; }
}
