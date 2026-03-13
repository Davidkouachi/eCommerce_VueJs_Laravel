<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParametreController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SelectController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\AssuranceController;

// Routes publiques
Route::post('/login', [AuthController::class, 'traitement_login']);

Route::middleware('auth:api')->get('/me', [AuthController::class, 'me']);
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
    Route::post('/api_insert_parametre', [ParametreController::class, 'insertParametre']);
    Route::post('/api_insert_roles', [ParametreController::class, 'insertroles']);
    Route::post('/api_insert_users', [UserController::class, 'insertUpdateusers']);
    Route::post('/api_insert_specialite', [MedecinController::class, 'insertUpdatespecialite']);
    Route::post('/api_insert_medecins', [MedecinController::class, 'insertUpdateMedecin']);
    Route::post('/api_insert_assurances', [AssuranceController::class, 'insertUpdateAssurance']);

    //----------- Get -------------------//
    Route::get('/api_get_parametre', [ParametreController::class, 'getAllParametre']);
    Route::get('/api_get_roles', [ParametreController::class, 'getAllroles']);
    Route::get('/api_get_users', [UserController::class, 'getAllusers']);
    Route::get('/api_get_activity', [ParametreController::class, 'getAllactivity']);
    Route::get('/api_get_specialite', [MedecinController::class, 'getAllspecialite']);
    Route::get('/api_get_medecin', [MedecinController::class, 'getAllmedecin']);
    Route::get('/api_get_assurances', [AssuranceController::class, 'getAllAssurance']);

    //----------- Update -------------------//
    Route::put('/api_update_roles/{id}', [ParametreController::class, 'updateroles']);
    Route::put('/api_update_users/{id}', [UserController::class, 'insertUpdateusers']);
    Route::put('/api_statut_specialite/{id}/{mode}', [MedecinController::class, 'updatSpecialiteStatut']);
    Route::put('/api_update_specialite/{id}', [MedecinController::class, 'insertUpdatespecialite']);
    Route::put('/api_update_medecins/{uid}', [MedecinController::class, 'insertUpdateMedecin']);
    Route::put('/api_statut_medecins/{uid}/{statut}', [MedecinController::class, 'updateMedecinStatut']);
    Route::put('/api_update_assurances/{uid}', [AssuranceController::class, 'insertUpdateAssurance']);
    Route::put('/api_statut_assurances/{uid}/{statut}', [AssuranceController::class, 'updatAssuranceStatut']);

    //----------- Delete -------------------//
    Route::delete('/api_delete_roles/{id}', [ParametreController::class, 'deleteroles']);
    Route::delete('/api_delete_users', [UserController::class, 'disableUsers']);

    //----------- Select -------------------//
    Route::get('/select_roles', [SelectController::class, 'select_roles']);
    Route::get('/select_tritremedecin', [SelectController::class, 'select_tritremedecin']);
    Route::get('/select_specialite', [SelectController::class, 'select_specialite']);

});