<?php

return [
    'paths' => ['api/*', 'Conv_PDF', 'proxy-pdf-text'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://192.168.1.64:5173',
        'http://192.168.1.65:5173',
        'http://192.168.1.66:5173'
    ],
    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization'],
    'exposed_headers' => ['Authorization'],
    'max_age' => 0,
    'supports_credentials' => false, // JWT stateless → pas besoin de cookies
];
