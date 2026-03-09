<!DOCTYPE html>

<html lang="en"> 

<head>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Meta Tags -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Sogamad Santé</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Dreams Technologies">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="base-url" content="{{ url('/') }}" id="url">
    
    <!-- Favicon -->
    <link rel="shortcut icon" href="{{ asset('assets/img/logo.png') }}">

    <!-- Apple Icon -->
    <link rel="apple-touch-icon" href="{{ asset('assets/img/apple-icon.png') }}">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/bootstrap.min.css') }}">

    <!-- Tabler Icon CSS -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/tabler-icons/tabler-icons.min.css') }}">

    <!-- Select2 CSS -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/select2/css/select2.min.css') }}">
    
    <!-- Choices CSS -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/choices.js/public/assets/styles/choices.min.css') }}">

    <!-- Datatable CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/dataTables.bootstrap5.min.css') }}">

    <!-- Simplebar CSS -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/simplebar/simplebar.min.css') }}">

    <!-- Fontawesome CSS -->
    <link rel="stylesheet" href="{{ asset('assets/plugins/fontawesome/css/fontawesome.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/fontawesome/css/all.min.css') }}">

    <!-- Main CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}" id="app-style">

    <!-- Sweetalert2 CSS -->
    {{-- <link rel="stylesheet" href="{{ asset('assets/plugins/sweetalert2/sweetalert2.min.css') }}"> --}}

</head>

<body>

    <!-- Begin Wrapper -->
    <div class="main-wrapper" id="app"></div>
    <!-- End Wrapper -->

    <!-- jQuery -->
    <script src="{{ asset('assets/js/jquery-3.7.1.min.js') }}" ></script>

    <script src="{{asset('assets/app/jsPDF-master/dist/jspdf.umd.js')}}"></script>
    <script src="{{asset('assets/app/jsPDF-AutoTable/dist/jspdf.plugin.autotable.min.js')}}"></script>

    <script src="{{ asset('assets/js/bootstrap.bundle.min.js') }}" ></script>

    <script src="{{ asset('assets/plugins/select2/js/select2.min.js') }}"></script>

    <!-- Simplebar JS -->
    <script src="{{ asset('assets/plugins/simplebar/simplebar.min.js') }}"></script>

    <!-- Datatable JS -->
    <script src="{{ asset('assets/js/jquery.dataTables.min.js') }}"></script>
    <script src="{{ asset('assets/js/dataTables.bootstrap5.min.js') }}"></script>

    <!-- Chart JS -->
    <script src="{{ asset('assets/plugins/apexchart/apexcharts.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/apexchart/chart-data.js') }}"></script>
    
    <!-- Daterangepikcer JS -->
    <script src="{{ asset('assets/js/moment.min.js') }}" ></script>
    <script src="{{ asset('assets/plugins/daterangepicker/daterangepicker.js') }}"></script>
    <script src="{{ asset('assets/js/bootstrap-datetimepicker.min.js') }}"></script>

    <!-- Main JS -->
    <script src="{{ asset('assets/js/script.js') }}"></script>

    <script src="{{ asset('assets/js/rocket-loader.min.js') }}" data-cf-settings="f4a1b24940058c6bf968861c-|49" defer></script>

    <script defer integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"rayId":"959e0e08ad70d05c","version":"2025.6.2","serverTiming":{"name":{"cfExtPri":true,"cfEdge":true,"cfOrigin":true,"cfL4":true,"cfSpeedBrain":true,"cfCacheStatus":true}},"token":"3ca157e612a14eccbb30cf6db6691c29","b":1}' crossorigin="anonymous"></script>

    <link rel="stylesheet" href="{{ asset('assets/app/js/Datatable/buttons/buttons.dataTables.min.css') }}">
        <!-- Buttons Extension -->
    <script src="{{ asset('assets/app/js/Datatable/buttons/dataTables.buttons.min.js') }}"></script>
    <script src="{{ asset('assets/app/js/Datatable/buttons/buttons.html5.min.js') }}"></script>
    <script src="{{ asset('assets/app/js/Datatable/buttons/buttons.print.min.js') }}"></script>
    <!-- Librairies nécessaires à Excel, PDF, Print -->
    <script src="{{ asset('assets/app/js/Datatable/buttons/jszip.min.js') }}"></script>
    <script src="{{ asset('assets/app/js/Datatable/buttons/pdfmake.min.js') }}"></script>
    <script src="{{ asset('assets/app/js/Datatable/buttons/vfs_fonts.js') }}"></script>

</body>

</html>