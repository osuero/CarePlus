using System.ComponentModel.DataAnnotations;

namespace CarePlus.Application.DTOs.Auth;

public class CompletePasswordSetupRequest
{
    [Required, MaxLength(256)]
    public string? Token { get; set; }

    [Required, MinLength(8), MaxLength(128)]
    public string? Password { get; set; }

    [Required, MinLength(8), MaxLength(128), Compare(nameof(Password), ErrorMessage = "Las contraseñas no coinciden.")]
    public string? ConfirmPassword { get; set; }
}
