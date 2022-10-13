using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PruebaTecnica.Models
{
    public class Orden
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "El número de orden es obligatorio.", AllowEmptyStrings = true)]
        public string NumeroOrden { get; set; }
        [Required(ErrorMessage = "El cliente es obligatorio.")]
        [ForeignKey("Cliente")]
        public int ClienteId { get; set; }
        [Required(ErrorMessage = "La fecha es obligatoria.")]
        [DisplayFormat(DataFormatString = "{0:dd/MM/aaaa}", ApplyFormatInEditMode = true)]
        public DateTime Fecha { get; set; } 

        public Cliente Cliente { get; set; }
        [ForeignKey("OrdenId")]
        public IEnumerable<OrdenDetalle> Detalles { get; set; }
    }
}
