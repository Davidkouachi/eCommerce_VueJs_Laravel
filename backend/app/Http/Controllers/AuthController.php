<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\UploadedFile;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class AuthController extends Controller
{
    // jwt-auth secret [bjLVyolTGi4U5DO1wzGpqBZEwrUxFQnk2FzLgZ2uzzgpLGUyaGsFXdDsMATAc84r]
    // Backend (Laravel)
    // On garde les codes HTTP corrects :

    //     200 → connexion réussie

    //     401 → identifiants invalides

    //     403 → compte inactif ou refusé

    //     500 → erreur serveur

    public function traitement_registre(Request $request)
    {
        $login = $request->input('login');
        $password = $request->input('password');
        $name = $request->input('name');
        $email = $request->input('email');

        $verf = DB::table('users')
                    ->where('login', $login)
                    ->exists();

        if ($verf) {
            return response()->json([
                'info' => true,
                'message' => 'Veuillez changer votre Login.'
            ], 201);
        }

        DB::beginTransaction();

        try {

            // 3. Insertion en base
            $userId = DB::table('users')->insertGetId([
                'name' => $name,
                'login' => $login,
                'email' => $email,
                'password' => password_hash($password, PASSWORD_BCRYPT),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$userId) {
                throw new Exception('Données du formulaire incomplètes');
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Utilisateur enregistré avec succès'], 200);

        } catch (Exception $e) {

            DB::rollback();
            return response()->json(['error' => true, 'message' => $e->getMessage()], 409);
        }
    }

    // public function traitement_login(Request $request)
    // {
    //     $credentials = $request->only('login', 'password');
    //     $deviceId = $request->input('device_id');

    //     if (!$token = Auth::guard('api')->attempt($credentials)) {
    //         return response()->json(['warn' => true, 'message' => 'Login ou mot de passe incorrect'], 201);
    //     }

    //     $user = Auth::guard('api')->user();

    //     // Génère un refresh token pour CET appareil
    //     $refreshToken = base64_encode(Str::random(64));

    //     DB::table('refresh_tokens')->updateOrInsert(
    //         [
    //             'user_id' => $user->id,
    //             'device_id' => $deviceId
    //         ],
    //         [
    //             'token' => $refreshToken,
    //             'expires_at' => now()->addMinutes((int) config('jwt.refresh_ttl')),
    //             'updated_at' => now(),
    //             'created_at' => now()
    //         ]
    //     );

    //     $roles = DB::table('roles')->where('id', $user->role_id)->select('nom')->first();

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Connexion réussie',
    //         'user' => [
    //             'id' => $user->id,
    //             'name' => $user->name,
    //             'email' => $user->email,
    //             'role' => $roles->nom,
    //             'login' => $user->login,
    //         ],
    //         'access_token'  => $token,
    //         'refresh_token' => $refreshToken,
    //         'device_id'     => $deviceId,
    //         'expires_in'    => Auth::guard('api')->factory()->getTTL() * 60,
    //     ]);
    // }

    public function traitement_login(Request $request)
    {
        $credentials = $request->only('login', 'password');

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json([
                'warn' => true, 
                'message' => 'Login ou mot de passe incorrect'
            ], 201);
        }

        $user = Auth::guard('api')->user();

        // Génère un refresh token UNIQUE pour l'utilisateur
        $refreshToken = base64_encode(Str::random(64));

        // Une seule ligne par user
        DB::table('refresh_tokens')->updateOrInsert(
            ['user_id' => $user->id],
            [
                'token' => $refreshToken,
                'expires_at' => now()->addMinutes((int) config('jwt.refresh_ttl')),
                'updated_at' => now(),
                'created_at' => now()
            ]
        );

        $roles = DB::table('roles')->where('id', $user->role_id)->select('nom')->first();

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roles->nom,
                'login' => $user->login,
            ],
            'access_token'  => $token,
            'refresh_token' => $refreshToken,
            'expires_in'    => Auth::guard('api')->factory()->getTTL() * 60,
        ]);
    }


    public function user_list(Request $request)
    {
        // Récupérer les utilisateurs existants
        $data = DB::table('users')
            ->leftJoin('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                'users.id', 
                'users.name', 
                'users.email', 
                'users.login', 
                'roles.nom as roles', 
                'users.created_at'
            )->get();

        $maxId = $data->max('id');  // Le plus grand ID réel
        $nextId = $maxId + 1;

        // Ajouter des fake users
        for ($i = $nextId; $i < $nextId + 100; $i++) {
            $data->push((object)[
                'id' => $i,
                'name' => "User $i",
                'roles' => "admin",
                'email' => "user$i@example.com",
                'login' => "user$i",
                'created_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function deleteUser($id)
    {
        $user = DB::table('users')->where('id', $id)->exists();

        if (!$user) {
            return response()->json([
                'info' => true,
                'message' => 'Utilisateur introuvable'
            ], 201);
        }

        $delete = DB::table('users')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ], 200);
    }

    public function user_count(Request $request)
    {
        $count = DB::table('users')->count();

        return response()->json([
            'success' => $count > 0,
            'count' => $count,
        ], 200);
    }

    public function me()
    {

        $user = Auth::guard('api')->user();

        $roles = DB::table('roles')->where('id', $user->role_id)->select('nom')->first();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $roles->nom ?? null,
            'login' => $user->login,
        ]);
    }

    // public function refreshToken(Request $request)
    // {
    //     $deviceId = $request->input('device_id');
    //     $refreshToken = $request->input('refresh_token');

    //     $tokenData = DB::table('refresh_tokens')
    //         ->where('device_id', $deviceId)
    //         ->where('token', $refreshToken)
    //         ->first();

    //     if (!$tokenData || $tokenData->expires_at < now()) {
    //         return response()->json(['error' => 'Refresh token expiré ou invalide'], 401);
    //     }

    //     $userData = DB::table('users')->where('id', $tokenData->user_id)->first();
    //     if (!$userData) {
    //         return response()->json(['error' => 'Utilisateur introuvable'], 401);
    //     }

    //     // Crée un modèle User et définit manuellement l'id
    //     $user = new User();
    //     $user->forceFill((array) $userData); // forceFill remplit tous les champs mass assignable
    //     $user->setAttribute('id', $userData->id); // Assure que l'id est défini
    //     $user->exists = true; // Indique à Eloquent que l'utilisateur existe dans la base

    //     // nouveau access token
    //     $newAccessToken = Auth::guard('api')->login($user);

    //     // rotation refresh
    //     $newRefresh = base64_encode(Str::random(64));

    //     DB::table('refresh_tokens')
    //         ->where('device_id', $deviceId)
    //         ->update([
    //             'token' => $newRefresh,
    //             'expires_at' => now()->addMinutes((int) config('jwt.refresh_ttl')),
    //             'updated_at' => now()
    //         ]);

    //     return response()->json([
    //         'access_token'  => $newAccessToken,
    //         'refresh_token' => $newRefresh,
    //         'expires_in'    => Auth::guard('api')->factory()->getTTL() * 60
    //     ]);
    // }

    public function refreshToken(Request $request)
    {
        $refreshToken = $request->input('refresh_token');

        $tokenData = DB::table('refresh_tokens')
            ->where('token', $refreshToken)
            ->first();

        if (!$tokenData || $tokenData->expires_at < now()) {
            return response()->json(['error' => 'Refresh token expiré ou invalide'], 401);
        }

        $userData = DB::table('users')->where('id', $tokenData->user_id)->first();
        if (!$userData) {
            return response()->json(['error' => 'Utilisateur introuvable'], 401);
        }

        // Crée un modèle User et définit manuellement l'id
        $user = new User();
        $user->forceFill((array) $userData);
        $user->setAttribute('id', $userData->id);
        $user->exists = true;

        // Nouveau access token
        $newAccessToken = Auth::guard('api')->login($user);

        // Rotation refresh token
        $newRefresh = base64_encode(Str::random(64));

        DB::table('refresh_tokens')
            ->where('user_id', $user->id) // mise à jour par user_id
            ->update([
                'token' => $newRefresh,
                'expires_at' => now()->addMinutes((int) config('jwt.refresh_ttl')),
                'updated_at' => now()
            ]);

        return response()->json([
            'access_token'  => $newAccessToken,
            'refresh_token' => $newRefresh,
            'expires_in'    => Auth::guard('api')->factory()->getTTL() * 60
        ]);
    }


    public function checkAuth()
    {
        try {
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'authenticated' => false,
                    'message' => 'Token invalide ou expiré'
                ], 401);
            }

            // Récupérer le token actuel
            $token = JWTAuth::getToken();
            $payload = JWTAuth::getPayload($token);

            // Calcul du temps restant réel
            $exp = $payload->get('exp');           // timestamp d'expiration
            $tempsRestant = $exp - time();         // secondes restantes

            // Rafraîchir le token si < 5 min
            if ($tempsRestant < 300) {
                $newToken = JWTAuth::refresh($token);  // nouveau token
                $tokenToReturn = $newToken;
                $tempsRestant = auth('api')->factory()->getTTL() * 60; // TTL complet
            } else {
                $tokenToReturn = $token; // garder le token actuel
            }

            $roles = DB::table('roles')->where('id', $user->role_id)->select('nom')->first();

            return response()->json([
                'authenticated' => true,
                'token' => $tokenToReturn,
                'temps_restant' => $tempsRestant,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $roles->nom ?? null,
                ]
            ]);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'authenticated' => false,
                'message' => 'Token expiré'
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'authenticated' => false,
                'message' => 'Erreur : ' . $e->getMessage()
            ], 401);
        }
    }

    // public function logout(Request $request)
    // {
    //     Log::info($request->all());

    //     DB::table('refresh_tokens')
    //         ->where('device_id', $request->input('device_id'))
    //         ->where('token', $request->input('refresh_token'))
    //         ->delete();

    //     Auth::guard('api')->logout();

    //     return response()->json(['message' => 'Déconnexion réussie']);
    // }

    public function logout(Request $request) // 1 user = 1 refresh token
    {
        DB::table('refresh_tokens')
            ->where('user_id', auth()->id())
            ->delete();

        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }


}
