using Microsoft.EntityFrameworkCore.Migrations;

namespace PruebaTecnica.Data.Migrations
{
    public partial class guradar_cambios : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ordens_Productos_ProductoId",
                table: "Ordens");

            migrationBuilder.DropIndex(
                name: "IX_Ordens_ProductoId",
                table: "Ordens");

            migrationBuilder.DropColumn(
                name: "ProductoId",
                table: "Ordens");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductoId",
                table: "Ordens",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ordens_ProductoId",
                table: "Ordens",
                column: "ProductoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ordens_Productos_ProductoId",
                table: "Ordens",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
