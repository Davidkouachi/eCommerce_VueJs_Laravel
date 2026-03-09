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

use App\Services\ParametreService;
use App\Services\HistoriqueService;

class ParametreController extends Controller
{
    protected $parametreService;
    protected $historiqueService;

    public function __construct(
        ParametreService $parametreService, 
        HistoriqueService $historiqueService
    )
    {
        $this->parametreService = $parametreService;
        $this->historiqueService = $historiqueService;
    }

    // parametre ------------------------------------------------------------

    public function insertParametre(Request $request)
    {   
        // Log::info($request->all());

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'type_structure' => 'required|string',
            'numero_agrement' => 'nullable|string|max:255',
            'sigle' => 'nullable|string|max:255',

            'pays' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'commune' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',

            'telephone1' => 'required|string|max:20',
            'telephone2' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',

            'heure_ouverture' => 'nullable|date_format:H:i:s',
            'heure_fermeture' => 'nullable|date_format:H:i:s|after:heure_ouverture',

            'devise' => 'required|string|max:10',
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:1024',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201); // 422 = validation error
        }

        $validated = $validator->validated();

        try {
            // 2️⃣ Enregistrement via le service
            $parametreId = $this->parametreService->insertParametreService(
                $validated,
                $request->file('logo')
            );

            // Historique (non bloquant)
            $this->historiqueService->log(
                'update',
                'parametres',
                $parametreId,
                "Mise à jour des informations de paramétrage"
            );

            $getAll = DB::table('parametres')->first();

            return response()->json([
                'success' => true,
                'msg' => 'Paramètres enregistrés avec succès',
                'data' => $getAll
            ], 200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'info' => true,
                'msg' => $e->getMessage(),
            ], 202);

        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllParametre()
    {
        $parametre = DB::table('parametres')->first();

        if ($parametre) {
            return response()->json([
                'success' => true,
                'data' => $parametre
            ], 200);
        }

        return response()->json([
            'success' => false,
            'msg' => 'Aucun paramètre trouvé'
        ], 201);
    }

    // roles ------------------------------------------------------------

    public function insertroles(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'roles' => 'required|array|min:1',
            'roles.*' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        try {

            $result = $this->parametreService->insertRolesService(
                $validator->validated()['roles']
            );

            // 🧾 Historique uniquement si au moins un rôle créé
            if (count($result['inserted_ids']) > 0) {
                foreach ($result['inserted_ids'] as $id) {
                    $this->historiqueService->log(
                        'insert',
                        'roles',
                        $id,
                        "Enregistrement d'un nouveau rôle"
                    );
                }
            }

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée avec succès',
                'inserted' => $result['inserted'],
                'duplicates' => $result['duplicates'],
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

    public function getAllroles()
    {
        $data = DB::table('roles')
            ->leftJoin('users', 'roles.id', '=', 'users.role_id')
            ->select(
                'roles.id',
                'roles.nom',
                'roles.created_at',
                DB::raw('COUNT(users.id) as nbreUser')
            )
            ->groupBy('roles.id', 'roles.nom', 'created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data ?? []
        ], 200);
    }

    public function updateroles(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        try {

            $this->parametreService->updateRolesService(
                $validator->validated(),
                $id
            );

            // 🧾 Historique (non bloquant)
            $this->historiqueService->log(
                'update',
                'roles',
                $id,
                "Mise à jour d'un rôle"
            );

            return response()->json([
                'success' => true,
                'msg' => 'Opération éfectuée avec succès',
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

    public function deleteRoles($id)
    {
        try {

            $role = $this->parametreService->deleteRolesService($id);

            // Historique (non bloquant)
            $this->historiqueService->log(
                'delete',
                'roles',
                $id,
                "Suppression du rôle {$role}"
            );

            return response()->json([
                'success' => true,
                'msg' => 'Rôle supprimé avec succès',
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

    // historique activité ------------------------------------------------------------

    public function getAllactivity()
    {
        $data = DB::table('activity_logs')
            ->leftJoin('users', 'activity_logs.user_id', '=', 'users.id')
            ->select(
                'activity_logs.id',
                'activity_logs.action',
                'activity_logs.model',
                'activity_logs.model_id',
                'activity_logs.description',
                'activity_logs.ip_address',
                'activity_logs.user_agent',
                'activity_logs.created_at',
                'users.login',
            )
            // Ordre décroissant (le plus récent en premier) — le plus courant
            // ->orderBy('activity_logs.created_at', 'desc')
            // Ordre croissant (du plus ancien au plus récent)
            // ->orderBy('activity_logs.created_at', 'asc')
            // Utilise aussi l’ID (utile si plusieurs logs ont la même date) :
            ->orderBy('activity_logs.created_at', 'desc')
            ->orderBy('activity_logs.id', 'desc')
            ->get();

        if ($data) {
            return response()->json([
                'success' => true,
                'data' => $data
            ], 200);
        }

        return response()->json([
            'success' => false,
            'msg' => 'Aucune donnée trouver'
        ], 201);
    }

}
