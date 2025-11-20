using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarePlus.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MakePatientOptionalForAppointments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "PatientId",
                table: "Appointments",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<string>(
                name: "ProspectEmail",
                table: "Appointments",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProspectFirstName",
                table: "Appointments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProspectLastName",
                table: "Appointments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProspectPhoneNumber",
                table: "Appointments",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProspectEmail",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ProspectFirstName",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ProspectLastName",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ProspectPhoneNumber",
                table: "Appointments");

            migrationBuilder.AlterColumn<Guid>(
                name: "PatientId",
                table: "Appointments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
