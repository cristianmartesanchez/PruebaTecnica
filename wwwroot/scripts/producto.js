$(function () {

    $('#producto_table').DataTable();

    $('body').on('click','#btnProducto', function (e) {
        e.preventDefault();

        $('#frm_producto').submit();

    })


    $('body').on('click', '#borrarProducto', function (e) {
        e.preventDefault();

        let productoId = $(this).data('id');

        if (confirm("Seguro que quieres eliminar el producto?")) {

            $.ajax({
                type: 'POST',
                url: '/Producto/BorrarProducto/',
                data: { productoId },
                success: function (result) {

                    if (result) {

                        window.location.href = "/Producto/";
                    }

                },
                error: function (error) {
                    console.log(error);
                }
            });

        }

    })

})