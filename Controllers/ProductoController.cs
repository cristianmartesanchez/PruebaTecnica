using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PruebaTecnica.Data;
using PruebaTecnica.Models;
using System.Linq;
using System.Threading.Tasks;

namespace PruebaTecnica.Controllers
{
    public class ProductoController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductoController(ApplicationDbContext context)
        {
            _context = context;
        }


        public async Task<IActionResult> Index()
        {
            var productos = await _context.Productos.Where(a => a.Activo == true).ToListAsync();
            return View(productos);
        }

        [HttpGet]
        public JsonResult GetProductos()
        {
            var productos =  _context.Productos.Where(a => a.Activo == true).ToList();
            return Json(productos);
        }

        [HttpGet]
        public JsonResult GetProductosByOrdenId(int ordenId)
        {
            var productos = _context.OrdenDetalles.Where(a => a.OrdenId == ordenId).Include(a => a.Producto).ToList();
            return Json(productos);
        }


        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var producto = await _context.Productos.FirstOrDefaultAsync(m => m.Id == id);
            if (producto == null)
            {
                return NotFound();
            }

            return View(producto);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Producto producto)
        {
            if (ModelState.IsValid)
            {
                var codigo = _context.Productos.Count() + 1;
                producto.Codigo = $"{codigo:00000}-PD";
                _context.Add(producto);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(producto);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }
            return View(producto);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Producto producto)
        {
            if (id != producto.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(producto);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProductExists(producto.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(producto);
        }


        public async Task<IActionResult> Detalle(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var producto = await _context.Productos
                .FirstOrDefaultAsync(m => m.Id == id);
            if (producto == null)
            {
                return NotFound();
            }
            else if (!producto.Activo)
            {
                return NotFound();
            }

            return View(producto);
        }

        [HttpPost]
        public async Task<bool> BorrarProducto(int productoId)
        {

            if (!ProductExists(productoId))
            {
                return false;
            }

            var producto = await _context.Productos.FindAsync(productoId);
            producto.Activo = false;
            _context.Productos.Update(producto);
            int result = await _context.SaveChangesAsync();
            return result > 0;
        }


        private bool ProductExists(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }
}
