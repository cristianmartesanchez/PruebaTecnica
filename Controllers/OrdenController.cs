using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PruebaTecnica.Data;
using PruebaTecnica.Models;

namespace PruebaTecnica.Controllers
{
    public class OrdenController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrdenController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Orden
        public async Task<IActionResult> Index()
        {
            var ordenes = await _context.Ordens
                                  .Include(o => o.Cliente)
                                  .Include(a => a.Detalles)
                                  .ThenInclude(a => a.Producto)
                                  .ToListAsync();

            ordenes.ForEach(o =>
            {

                o.Detalles = o.Detalles.Where(a => a.Activo == true).ToList();

            });

            return View(ordenes);
        }

        // GET: Orden/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var orden = await _context.Ordens
                      .Include(o => o.Cliente)
                      .Include(a => a.Detalles)
                      .ThenInclude(a => a.Producto)
                      .FirstOrDefaultAsync(m => m.Id == id );


            if (orden == null)
            {
                return NotFound();
            }

            orden.Detalles = orden.Detalles.Where(a => a.Activo == true).ToList();

            return View(orden);
        }

        void Dropdowns(int clienteId = 0, int productoId = 0)
        {
            var clientes = _context.Clientes.Select(a => new Cliente
            {
                Id = a.Id,
                Nombres = $"{a.Nombres} {a.Apellidos}"
            }).ToList();

            var productos = _context.Productos.ToList();
            clientes.Add(new Cliente { Id = 0, Nombres = "--Seleccione un cliente--" });

            ViewBag.ClienteId = new SelectList(clientes, "Id", "Nombres", clienteId);
            ViewBag.Productos = new SelectList(productos, "Id", "Nombres", productoId);
        }

        [HttpGet]
        public IActionResult Create()
        {
            Dropdowns();
            return PartialView("~/Views/Orden/partials/_create.cshtml");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Orden orden)
        {

            if (ModelState.IsValid)
            {
                var codigo = _context.Ordens.Count() + 1;
                orden.NumeroOrden = $"{codigo:00000}-OC";
                _context.Add(orden);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            Dropdowns(orden.ClienteId);
            return View(orden);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var orden = await _context.Ordens
                      .Include(o => o.Cliente)
                      .Include(a => a.Detalles)
                      .ThenInclude(a => a.Producto)
                      .FirstOrDefaultAsync(m => m.Id == id);

            if (orden == null)
            {
                return NotFound();
            }

            orden.Detalles = orden.Detalles.Where(a => a.Activo == true).ToList();

            Dropdowns(orden.ClienteId);
            return PartialView("~/Views/Orden/partials/_edit.cshtml",orden);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Orden orden)
        {
            if (id != orden.Id)
            {
                return NotFound();
            }

            //if (ModelState.IsValid)
            //{
                try
                {

                    var nuevosProductos = orden.Detalles.Where(a => a.Id == 0).ToList();
                    foreach (var item in nuevosProductos)
                    {
                        _context.Add(item);
                    }

                    var ProductosExistentes = orden.Detalles.Where(a => a.Id != 0).ToList();
                    foreach (var item in ProductosExistentes)
                    {
                        _context.Update(item);
                    }

                    _context.Update(orden);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrdenExists(orden.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }

                    Dropdowns(orden.ClienteId);
                    return View(orden);
                }
                return RedirectToAction(nameof(Index));
            //}

        }


        [HttpPost]
        public async Task<bool> BorrarProductoDetalle(int ordenId, int productoId)
        {

            if (!OrdenDetalleExists(ordenId, productoId))
            {
                return false;
            }

            var producto = await _context.OrdenDetalles.FirstOrDefaultAsync(a => a.OrdenId == ordenId && a.ProductoId == productoId);
            producto.Activo = false;
            _context.OrdenDetalles.Update(producto);
            int result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var orden = await _context.Ordens
                .Include(o => o.Cliente)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (orden == null)
            {
                return NotFound();
            }

            return View(orden);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var orden = await _context.Ordens.FindAsync(id);
            _context.Ordens.Remove(orden);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool OrdenExists(int id)
        {
            return _context.Ordens.Any(e => e.Id == id);
        }

        private bool OrdenDetalleExists(int ordenId, int productoId)
        {
            return _context.OrdenDetalles.Any(e => e.OrdenId == ordenId && e.ProductoId == productoId);
        }
    }
}
