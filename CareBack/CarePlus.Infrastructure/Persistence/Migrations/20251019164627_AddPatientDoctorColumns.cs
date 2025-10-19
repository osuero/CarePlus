using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarePlus.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientDoctorColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AssignedDoctorId",
                table: "Patients",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AssignedDoctorName",
                table: "Patients",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedDoctorId",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "AssignedDoctorName",
                table: "Patients");
        }
    }
}
