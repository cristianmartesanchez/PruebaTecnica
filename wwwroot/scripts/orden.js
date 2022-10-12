
$(document).ready(function () {

    var orden_Producto;
    var list_productos = [];
       
    $('#orden_table').DataTable();
       
        
    $("body").on("click", "#openModalOrden", function (e) {
        e.preventDefault();

        $.ajax({
            type: 'GET',
            dataType: 'html',
            url: '/Orden/Create/',
            success: function (result) {

                if (result.length > 0) {

                    $('#ordenModalBody').html("");
                    $('#ordenModalBody').html(result);
                    $('#ordenModal').modal('show');
                }

            },
            error: function (error) {
                console.log(error);
            }
        });
        
        
    })


    $('#ordenModal').on('shown.bs.modal', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/Producto/GetProductos/',
            success: function (result) {
                list_productos = result;
            },
            error: function (error) {
                console.log(error);
            }
        });
        
        orden_Producto = $('#ordenProducto_table').DataTable();
    });


    $('body').on('click', '#agregarProducto', function (e) {
        e.preventDefault();

        let row = `<select size="1" id="select_Productos" name="select_Productos" class="form-control" >
                    <option value="0" selected="selected">
                        --Seleccionar el producto--
                    </option>
                    ${ list_productos.map(item => {
                        return ` <option value="${item.id}" >
                        ${item.nombre}
                    </option>`;
                    }) }
                </select>`;

        var random = Math.floor((Math.random() * 100000) + 1);

        let index = `<input type="hidden" name="Detalles.index" value="${random}"/>
<input type="hidden" id="Detalles_${random}_ProductoId" name="Detalles[${random}].ProductoId" />
<input type="hidden" id="Detalles_${random}_Cantidad" name="Detalles[${random}].Cantidad" />
<input type="hidden" id="Detalles_${random}_Precio" name="Detalles[${random}].Precio" />
<input type="text" readOnly=true class="form-control" id="codigo">`;

        let campos = [index,
            row, `<input type="number" min=0 class="form-control" id="cantidad">`,
            `<input type="number" readOnly=true min=0 class="form-control" id="precio">`,
            `<button type="button" id="btnEliminarRow" class="btn btn-danger">x</button>`]

        orden_Producto.row.add(campos).draw(false);

    });

    $("body").on("click", "#btnEliminarRow", function (e) {
        e.preventDefault();

        const fila = $(this)[0].parentElement.parentElement;        
        orden_Producto.row(fila).remove().draw(false);
    })


    $("body").on("change", "#select_Productos", function (e) {
        e.preventDefault();

        //Id del producto seleccionado
        let productoId = $(this).val();

        //Buscamo el producto seleccionado en el arreglo de Productos
        let seleccionado = list_productos.find(producto => producto.id == productoId);

        //Fila que se esta modificando.
        const fila = $(this)[0].parentElement.parentElement;

        //Columnas de la fila que se esta modificando.
        const columnas = fila.children;

        //Completando los campos hidden para mapear con la propiedad de navegacion.
        $(columnas[0].children[1]).val(productoId);//productoId
        $(columnas[0].children[3]).val(seleccionado.precio);//Precio

        //Completando los campos Codigo y precio.
        $(columnas[0].lastChild).val(seleccionado.codigo);
        $(columnas[3].firstChild).val(seleccionado.precio);

    });

    $("body").on("keyup", "#cantidad", function (e) {
        e.preventDefault();
        let cantidad = $(this).val();

        //Fila que se esta modificando.
        const fila = $(this)[0].parentElement.parentElement;

        //Columnas de la fila que se esta modificando.
        const columnas = fila.children;

        //Completando los campos hidden para mapear con la propiedad de navegacion.
        $(columnas[0].children[2]).val(cantidad);//cantidad
        console.log(columnas[0].children[2])

    });

    $("body").on("click", "#guardarOrden", function (e) {

        $("#formOrden").submit();

    });

})