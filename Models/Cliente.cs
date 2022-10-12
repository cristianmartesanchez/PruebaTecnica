using System;
using System.ComponentModel.DataAnnotations;

namespace PruebaTecnica.Models
{
    public class Cliente
    {
        [Key]
        public int Id { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public DateTime FechaNacimiento{ get; set; }

    }
}
