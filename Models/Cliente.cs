using System;
using System.ComponentModel.DataAnnotations;

namespace PruebaTecnica.Models
{
    public class Cliente
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "El Codigo del cliente es obligatorio.")]
        public string Codigo { get; set; }
        [Required(ErrorMessage = "El Nombre del cliente es obligatorio.")]
        public string Nombres { get; set; }
        [Required(ErrorMessage = "El Apellido del cliente es obligatorio.")]
        public string Apellidos { get; set; }

        public DateTime FechaNacimiento{ get; set; }

    }
}
