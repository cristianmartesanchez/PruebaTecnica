using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PruebaTecnica.Models
{
    public class OrdenDetalle
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "La orden es obligatoria.")]
        [ForeignKey("Orden")]
        public int OrdenId { get; set; }
        [ForeignKey("Producto")]
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public double Precio { get; set; }
        public Orden Orden { get; set; }
        public Producto Producto { get; set; }
    }
}
