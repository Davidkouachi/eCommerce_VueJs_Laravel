$(document).ready(function () {

    window.showAlert = function (title, message, icon) {
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
        });
    }

    window.showAlert2 = function (id, icon, message, color, btn = '0') {
        const alertDiv = `
            <div class="alert alert-${color} text-bg-${color} alert-dismissible" role="alert">
                <i class="fa fa-${icon} fs-14 text-white"></i>
                <strong>${message}</strong>
                ${btn == '1' ? `` : `
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                `}
            </div>
        `;

        $(id).empty().append(alertDiv);
    };

});
