namespace CarePlus.Application.Models;

public class JwtSettings
{
    public string Issuer { get; set; } = "CarePlus";
    public string Audience { get; set; } = "CarePlusClients";
    public string SigningKey { get; set; } = "CHANGE_ME_DEVELOPMENT_KEY";
    public int AccessTokenExpiryMinutes { get; set; } = 60;
}
