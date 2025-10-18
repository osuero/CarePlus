using System;

namespace CarePlus.Domain.Constants;

public static class RoleConstants
{
    public static readonly Guid AdministratorRoleId = Guid.Parse("7B65C5F7-8B06-4F97-92F1-9F81E1F66D26");
    public static readonly Guid DoctorRoleId = Guid.Parse("A2A4F51F-2A7C-4B8E-94E6-4E6E1B4B19D3");
    public static readonly Guid PatientRoleId = Guid.Parse("B13C7B8E-2E0F-4F6C-B2C5-6BC3E623EAF0");

    public static readonly Guid[] SeededRoleIds =
    {
        AdministratorRoleId,
        DoctorRoleId,
        PatientRoleId
    };
}
