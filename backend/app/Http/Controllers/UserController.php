<?php

namespace App\Http\Controllers;

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
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use App\Services\UserService;
use App\Services\HistoriqueService;

class UserController extends Controller
{
    protected $userService;
    protected $historiqueService;

    public function __construct(
        UserService $userService, 
        HistoriqueService $historiqueService
    )
    {
        $this->userService = $userService;
        $this->historiqueService = $historiqueService;
    }

    // ------------------------------------------------------------

    public function insertUpdateusers(Request $request, $id = null)
    {
        $rules = [
            'name'     => 'required|string|max:100',
            'login'    => 'required|string|max:50',
            'email'    => 'required|email',
            'role_id' => 'required|exists:roles,id',
            'password' => $id ? 'nullable|min:8' : 'required|min:8',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        try {

            $result = $this->userService->insertUserService(
                $validator->validated(),
                $id
            );

            if (!$result['success'] && $result['type'] === 'duplicate') {
                return response()->json([
                    'info' => true,
                    'msg' => $result['msg'],
                ], 202);
            }

            // 🧾 Historique (non bloquant)
            $this->historiqueService->log(
                $result['action'],
                'users',
                $result['id'],
                $result['action'] === 'insert'
                    ? "Création d'un utilisateur"
                    : "Mise à jour d'un utilisateur"
            );

            return response()->json([
                'success' => true,
                'msg' => $result['action'] === 'insert'
                    ? 'Utilisateur créé avec succès'
                    : 'Utilisateur mis à jour avec succès'
            ], 200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'info' => true,
                'msg' => $e->getMessage(),
            ], 202);

        } catch (\Exception $e) {

            return response()->json([
                'error' => true,
                'msg' => 'Erreur serveur',
            ], 500);
        }
    }

    public function getAllusers()
    {
        $now = now();

        $data = DB::table('users')
            ->leftJoin('roles', 'users.role_id', '=', 'roles.id')
            ->leftJoinSub(
                DB::table('refresh_tokens')
                    ->select(
                        'user_id',
                        DB::raw('MAX(updated_at) as last_activity'),
                        DB::raw('MAX(expires_at) as expires_at')
                    )
                    ->where('expires_at', '>', $now)
                    ->groupBy('user_id'),
                'sessions',
                'users.id',
                '=',
                'sessions.user_id'
            )
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'users.login',
                'users.role_id',
                'users.statut',
                'roles.nom as role',
                'users.created_at',

                // 🔥 timestamp exact
                DB::raw('sessions.last_activity as connected_since_at')
            )
            ->selectRaw("
                CASE 
                    WHEN sessions.expires_at IS NOT NULL THEN 1 
                    ELSE 0 
                END as is_online
            ")
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    public function disableUsers(Request $request)
    {
        Log::info($request->all());
        
        $ids = $request->ids ?? [];

        if (!count($ids)) {
            return response()->json([
                'info' => true,
                'msg' => 'Aucun utilisateur sélectionné'
            ], 201);
        }

        try {

            $disabledIds = $this->userService->disableUsersService($ids);

            // 🧾 Historique (ne doit JAMAIS bloquer)
            foreach ($disabledIds as $id) {
                $this->historiqueService->log(
                    'delete',
                    'users',
                    $id,
                    "Désactivation d'un utilisateur"
                );
            }

            return response()->json([
                'success' => true,
                'updated' => count($disabledIds),
                'msg' => count($disabledIds)
                    ? 'Opération éffectuée avec succès'
                    : 'Aucun utilisateur n’a été désactivé'
            ], 200);

            if (count($disabledIds)) {

                return response()->json([
                    'success' => true,
                    'updated' => count($disabledIds),
                    'msg' => 'Opération éffectuée avec succès'
                ], 200);

            } else {

                return response()->json([
                    'success' => true,
                    'updated' => count($disabledIds),
                    'msg' => 'Aucun utilisateur n’a été supprimé, réssayer dans un instant'
                ], 202);
            }

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'info' => true,
                'msg' => $e->getMessage(),
            ], 202);

        } catch (\Exception $e) {

            return response()->json([
                'error' => true,
                'msg' => 'Erreur serveur'
            ], 500);
        }
    }


}
