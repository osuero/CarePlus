namespace CarePlus.Application.Models;

public class AuthSettings
{
    public string PasswordSetupUrl { get; set; } = "http://localhost:4200/auth/setup-password";
    public int PasswordSetupTokenExpiryMinutes { get; set; } = 1440;
}
