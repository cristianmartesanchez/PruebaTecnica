$(function () {

    $('#cliente_table').DataTable();

    $('body').on('click','#btnCrearCliente', function (e) {
        e.preventDefault();

        $('#frm_cliente').submit();

    });

    $('body').on('click', '#borrarCliente', function (e) {
        e.preventDefault();

        let clienteId = $(this).data('id');

        if (confirm("Seguro que quieres eliminar el cliente?")) {

            $.ajax({
                type: 'POST',
                url: '/Cliente/BorrarCliente/',
                data: { clienteId },
                success: function (result) {

                    if (result) {

                        window.location.href = "/Cliente/";
                    }

                },
                error: function (error) {
                    console.log(error);
                }
            });

        }

    })

})