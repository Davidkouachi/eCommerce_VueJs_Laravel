<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SelectController;

use App\Http\Controllers\boutiques\storeController;

// Routes publiques
Route::post('/login', [AuthController::class, 'traitement_login']);

Route::post('/refresh', [AuthController::class, 'refreshToken']);
Route::post('/logout', [AuthController::class, 'logout']);

// Routes protégées par JWT
Route::middleware('auth:api')->group(function () {
    // Route::post('/refresh', [AuthController::class, 'refreshToken']);

    Route::post('/register', [AuthController::class, 'traitement_registre']);

    // Route pour vérifier le token
    Route::get('/check-auth', [AuthController::class, 'checkAuth']);

    // Récupérer l'utilisateur connecté
    Route::get('/me', [AuthController::class, 'me']);

    // Liste des utilisateurs (exemple)
    Route::get('/users/list', [AuthController::class, 'user_list']);
    Route::get('/users/count', [AuthController::class, 'user_count']);

    Route::delete('/deleteUser/{id}', [AuthController::class, 'deleteUser']);

    // Déconnexion
    // Route::post('/logout', [AuthController::class, 'logout']);
});

$prefix = "v1";

Route::prefix($prefix)->middleware('auth:api')->group(function () {

    //----------- Insert -------------------//
    Route::post('insertBout', [storeController::class, 'insertBout']);

    //----------- Get -------------------//


    //----------- Update -------------------//


    //----------- Delete -------------------//


    //----------- Select -------------------//


});