
$(function () {

    
    var orden_Producto;
    var list_productos = [];
       
    $('#orden_table').DataTable({});


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

    $("body").on("click", "#editarOrden", function (e) {
        e.preventDefault();

        let id = $(this).data('id');

        $.ajax({
            type: 'GET',
            dataType: 'html',
            url: `/Orden/Edit/${id}`,
            success: function (result) {

                if (result.length > 0) {

                    $('#ordenModalBody').html("");
                    $('#ordenModalBody').html(result);
                    productos();
                    cargarProductos(id);

                    $('#ordenModal').modal('show');
                }

            },
            error: function (error) {
                console.log(error);
            }
        });


    })

    function cargarProductos(ordenId) {

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: `/Producto/GetProductosByOrdenId/`,
            data: { ordenId },
            success: function (result) {

                
                $('#ordenProducto_table tbody').html("");
                if (result.length > 0) {

                    let html = '';
                    result.forEach(fila => {

                        let random = Math.floor((Math.random() * 100000) + 1);

                        let index = `<input type="hidden" name="Detalles.index" value="${random}"/>
                                <input type="hidden" id="Detalles_${random}_Id" name="Detalles[${random}].Id" value="${fila.id}" />
                                <input type="hidden" id="Detalles_${random}_OrdenId" name="Detalles[${random}].OrdenId" value="${fila.ordenId}" />
                                <input type="hidden" id="Detalles_${random}_ProductoId" name="Detalles[${random}].ProductoId" value="${fila.productoId}" />
                                <input type="hidden" id="Detalles_${random}_Cantidad" name="Detalles[${random}].Cantidad" value="${fila.cantidad}" />
                                <input type="hidden" id="Detalles_${random}_Precio" name="Detalles[${random}].Precio" value="${fila.precio}" />
                                <input type="text" readOnly=true class="form-control" id="codigo" value="${fila.producto.codigo}" >`;

                        html = `<tr><td>${index}</td>
                            <td>${

                            `<select size="1" value="${fila.productoId}" id="select_Productos" name="select_Productos" class="form-control" >
                                <option value="0" >
                                    --Seleccionar el producto--
                                </option>
                                    ${
                        list_productos.map(item => {
                           
                            return `<option value="${item.id}" ${item.id == fila.productoId ? 'selected="selected"':""} > ${item.nombre} </option>`;
                                        })
                                     }
                            </select>`


                            }</td>


                            <td><input type="number" min=1 placeholder="0" class="form-control" id="cantidad" value="${fila.cantidad}" /></td>
                            <td><input type="number" readOnly=true min=0 class="form-control" id="precio" value="${fila.precio}" /> </td>
                            <td><input type="number" readOnly=true  class="form-control" id="importe" value="${fila.cantidad * fila.precio}" /> </td>
                            <td><button type="button" data-ordenId="${fila.ordenId}" data-productoId="${fila.productoId}" id="btnEliminarProducto" class="btn btn-success">x</button></tr>`;
                        console.log(fila.cantidad)
                        $('#ordenProducto_table tbody').append(html);

                    });

                   
                }
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    $("body").on("click", "#btnEliminarProducto", function (e) {
        e.preventDefault();

        if (confirm("Seguro que quieres eliminar el producto?")) {

            const fila = $(this)[0].parentElement.parentElement;
            let ordenId = $(this).data('ordenid');
            let productoId = $(this).data('productoid');

            $.ajax({
                type: 'POST',
                url: '/Orden/BorrarProductoDetalle/',
                data: { ordenId, productoId },
                success: function (result) {

                    if (result) {

                        
                        orden_Producto.row(fila).remove().draw(false);
                        
                    }

                },
                error: function (error) {
                    console.log(error);
                }
            });

        }
    })

    function productos() {
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
    }

    $('#ordenModal').on('shown.bs.modal', function (e) {
        e.preventDefault();

        productos();

        orden_Producto = $('#ordenProducto_table').DataTable();
    });


    $("body").on("click", "#btnCliente", function (e) {
        e.preventDefault();

        $.ajax({
            type: 'GET',
            dataType: 'Json',
            url: '/Cliente/GetClientes/',
            success: function (result) {
                
                $('#clienteTable_body').html("");
                if (result.length > 0) {
     
                    let html = '';
                    result.forEach(cliente => {
                        html += ` <tr> <td><input type="radio" data-cliente="${cliente.nombres} ${cliente.apellidos}" id="clienteId" name="clienteId" value="${cliente.id}" ></td>
                                <td>${cliente.codigo}</td> <td>${cliente.nombres} ${cliente.apellidos}</td> </tr>`;
                    })

                    $('#clienteTable_body').append(html);
                    $('#clienteModal').modal('show');

                    if (!$.fn.dataTable.isDataTable("#cliente_table")) {
                        $('#cliente_table').DataTable();
                    }

                    
                }

            },
            error: function (error) {
                console.log(error);
            }
        });


    });

    $('body').on('click', '#btnSeleccionarCliente', function (e) {
        e.preventDefault();

        var cliente = $("#clienteTable_body input[name=clienteId]:checked")[0];

        let clienteId = $(cliente).val();
        let clienteNombre = $(cliente).data('cliente');

        $('#ClienteId').val(clienteId);
        $('#clienteNombre').val(clienteNombre);

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
<input type="hidden" id="Detalles_${random}_Id" name="Detalles[${random}].Id" />
<input type="hidden" id="Detalles_${random}_OrdenId" name="Detalles[${random}].OrdenId" />
<input type="hidden" id="Detalles_${random}_ProductoId" name="Detalles[${random}].ProductoId" />
<input type="hidden" id="Detalles_${random}_Cantidad" name="Detalles[${random}].Cantidad" />
<input type="hidden" id="Detalles_${random}_Precio" name="Detalles[${random}].Precio" />
<input type="text" readOnly=true class="form-control" id="codigo">`;

        let campos = [index,
            row, `<input type="number" min=1 placeholder="0" class="form-control" id="cantidad">`,
            `<input type="number" readOnly=true min=0 class="form-control" id="precio">`,
            `<input type="number" readOnly=true  class="form-control" id="importe">`,
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

        const ordenId = $('#Id').val();

        //Completando los campos hidden para mapear con la propiedad de navegacion.
        if (ordenId)
            $(columnas[0].children[2]).val(ordenId);//OrdenId

        $(columnas[0].children[3]).val(productoId);//productoId
        $(columnas[0].children[4]).val(1);//cantidad
        $(columnas[0].children[5]).val(seleccionado.precio);//Precio

        //Completando los campos Codigo y precio.
        $(columnas[0].lastChild).val(seleccionado.codigo);//codigo
        $(columnas[2].firstChild).val(1);//cantidad
        $(columnas[3].firstChild).val(seleccionado.precio);//precio
        $(columnas[4].firstChild).val(seleccionado.precio);//importe

    });

    $("body").on("change", "#cantidad", function (e) {
        e.preventDefault();
        let cantidad = $(this).val();

        //Fila que se esta modificando.
        const fila = $(this)[0].parentElement.parentElement;

        //Columnas de la fila que se esta modificando.
        const columnas = fila.children;
        console.log(cantidad)
        //Completando los campos hidden para mapear con la propiedad de navegacion.
        $(columnas[0].children[4]).val(cantidad);//cantidad
        let precio = Number.parseFloat($(columnas[3].firstChild).val());
        $(columnas[4].firstChild).val(precio * cantidad);//importe

    });

    $("body").on("click", "#guardarOrden", function (e) {
        e.preventDefault();

        $("#formOrden").submit();

    });

})