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
        public DateTime FechaNacimiento { get; set; }
        [DataType(DataType.EmailAddress, ErrorMessage = "Correo no valido.")]
        public string Correo { get; set; }
        [DataType(DataType.PhoneNumber, ErrorMessage = "Telefono no valido.")]
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public bool Activo { get; set; } = true;
    }
}
