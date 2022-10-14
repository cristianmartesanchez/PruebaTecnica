using Microsoft.EntityFrameworkCore.Migrations;

namespace PruebaTecnica.Data.Migrations
{
    public partial class campo_activoDetalle : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Activo",
                table: "OrdenDetalles",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Activo",
                table: "OrdenDetalles");
        }
    }
}
