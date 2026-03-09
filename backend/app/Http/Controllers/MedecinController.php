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

use App\Services\MedecinService;
use App\Services\HistoriqueService;
use App\Services\CodeService;

class MedecinController extends Controller
{
    protected $medecinService;
    protected $historiqueService;
    protected $codeService;

    public function __construct(
        MedecinService $medecinService, 
        HistoriqueService $historiqueService,
        CodeService $codeService,
    )
    {
        $this->medecinService = $medecinService;
        $this->historiqueService = $historiqueService;
        $this->codeService = $codeService;
    }

    // ------------------------------------------------------------

    public function insertUpdateMedecin(Request $request, $uid = null)
    {

        $rules = [
            'nom'            => 'required|string|max:100',
            'prenom'         => 'required|string|max:100',
            'email'          => 'required|email',
            'telephone'      => 'required|string|max:10',
            'titre_id'       => 'required|exists:medecintitres,id',
            'specialite_id'  => 'required|exists:specialites,id',
            'numero_ordre'   => 'nullable|string|max:50',
            'ajouterAcces'   => 'required|boolean',
            'statut'         => 'nullable|boolean',
        ];

        // 🔐 règles conditionnelles accès
        if ($request->boolean('ajouterAcces')) {
            $rules['login'] = 'required|string|max:50';
            $rules['password'] = $uid
                ? 'nullable|min:8'
                : 'required|min:8';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        $code = null;
        $uid_new = null;

        if ($uid === null || $uid === '') {
            $code = $this->codeService->generateCode(
                table: 'medecins',
                column: 'code',
                prefix: 'Med'
            );
            $uid_new = $this->codeService->generateUid(
                table: 'medecins',
            );
        }

        Log::info($uid_new);
        Log::info($code);

        try {
            $result = $this->medecinService->insertUpdateMedecinService(
                $validator->validated(),
                $uid,
                $uid_new,
                $code,
            );

            if (!$result['success'] && $result['type'] === 'duplicate_access') {
                return response()->json([
                    'info' => true,
                    'msg' => $result['msg'],
                ], 202);
            }

            if (!$result['success'] && $result['type'] === 'duplicate_medecin') {
                return response()->json([
                    'info' => true,
                    'msg' => $result['msg']
                ], 202);
            }

            // 🧾 Historique
            $this->historiqueService->log(
                $result['action'],
                'medecins',
                $result['id'],
                $result['action'] === 'insert'
                    ? "Création d'un médecin"
                    : "Mise à jour d'un médecin"
            );

            return response()->json([
                'success' => true,
                'msg' => $result['action'] === 'insert'
                    ? 'Médecin créé avec succès'
                    : 'Médecin mis à jour avec succès'
            ], 200);

        } catch (ModelNotFoundException $e) {
            // 🔹 Ici on récupère le message exact
            return response()->json([
                'info' => true,
                'msg' => $e->getMessage()
            ], 202);

        } catch (\Throwable $e) {

            return response()->json([
                'error' => true,
                'msg' => $e->getMessage() // renvoie le message exact
            ], 500);
        }
    }

    public function updateMedecinStatut($uid = null, $statut = null)
    {

        if ($uid === null || $statut === null) {
            return response()->json([
                'info' => true,
                'msg' => 'Impossible de recuprer l\'identifiant. réessayer plus tard',
            ], 201);
        }

        DB::beginTransaction();

        try {

            $Inserted = DB::table('medecins')->where('uid', $uid)->update([
                'statut' => $statut,
                'updated_at' => now(),
            ]);

            if ($Inserted == 0) {
                throw new Exception('Erreur lors de l\'insertion dans la table medecins');
            }

            $id = DB::table('medecins')->where('uid', $uid)->value('id');

            // 🧾 Historique
            $this->historiqueService->log(
                'update',
                'medecins',
                $id,
                'mise du satut',
            );

            // Valider la transaction
            DB::commit();

            return response()->json([
                'success' => true, 
                'msg' => 'Opération éffectuée'
            ], 200);

        } catch (Exception $e) {

            DB::rollback();
            return response()->json([
                'error' => true, 
                'msg' => $e->getMessage()
            ], 202);
        }
    }

    public function getAllmedecin()
    {
        $data = DB::table('medecins')
            ->leftJoin('users', 'medecins.uid', '=', 'users.uid')
            ->leftJoin('specialites', 'medecins.specialite_id', '=', 'specialites.id')
            ->leftJoin('medecintitres', 'medecins.titre_id', '=', 'medecintitres.id')
            ->select(
                'medecins.id',
                'medecins.uid',
                'medecins.code',
                'medecins.nom',
                'medecins.prenom',
                'medecins.email',
                'medecins.telephone',
                'medecins.numero_ordre',
                'medecins.statut',
                'medecins.specialite_id',
                'medecins.titre_id',
                'specialites.nom as specialite',
                'medecintitres.nom as titre',
                'medecintitres.signe',
                'users.login',
                'medecins.created_at',
                DB::raw("
                    CASE medecins.statut
                        WHEN 1 THEN 'Actif'
                        WHEN 0 THEN 'Inactif'
                        ELSE 'Inconnu'
                    END as statut_label
                "),
            )
            ->orderBy('medecins.created_at', 'desc')
            ->orderBy('medecins.id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data ?? []
        ], 200);
    }

    // ------------------------------------------------------------

    public function insertUpdatespecialite(Request $request, $id = null)
    {

        $rules = [
            'nom' => 'required|string|max:100',
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

            $result = $this->medecinService->insertSpecialiteService(
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
                'specialites',
                $result['id'],
                $result['action'] === 'insert'
                    ? "Création d'une spécialité"
                    : "Mise à jour d'une spécialité"
            );

            $data = DB::table('specialites')
                ->leftJoin('medecins', 'specialites.id', '=', 'medecins.specialite_id')
                ->where('specialites.id', $result['id'])
                ->select(
                    'specialites.id',
                    'specialites.nom',
                    'specialites.statut',
                    DB::raw("
                        CASE specialites.statut
                            WHEN 1 THEN 'Actif'
                            WHEN 0 THEN 'Inactif'
                            ELSE 'Inconnu'
                        END as statut_label
                    "),
                    'specialites.created_at',
                    DB::raw('COUNT(medecins.id) as nbreMed')
                )
                ->orderBy('specialites.created_at', 'desc')
                ->orderBy('specialites.id', 'desc')
                ->groupBy(
                    'specialites.id',
                    'specialites.nom',
                    'specialites.statut',
                    'specialites.created_at',
                )
                ->first();

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée',
                'data' => $data
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

    public function getAllspecialite()
    {
        $data = DB::table('specialites')
            ->leftJoin('medecins', 'specialites.id', '=', 'medecins.specialite_id')
            ->select(
                'specialites.id',
                'specialites.nom',
                'specialites.statut',
                DB::raw("
                    CASE specialites.statut
                        WHEN 1 THEN 'Actif'
                        WHEN 0 THEN 'Inactif'
                        ELSE 'Inconnu'
                    END as statut_label
                "),
                'specialites.created_at',
                DB::raw('COUNT(medecins.id) as nbreMed')
            )
            ->orderBy('specialites.created_at', 'desc')
            ->orderBy('specialites.id', 'desc')
            ->groupBy(
                'specialites.id',
                'specialites.nom',
                'specialites.statut',
                'specialites.created_at',
            )
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data ?? []
        ], 200);
    }

    public function updatSpecialiteStatut(int $id = null, int $mode = null )
    {

        try {

            $result = $this->medecinService->updatSpecialiteStatutService(
                $id,
                $mode
            );

            // 🧾 Historique (non bloquant)
            $this->historiqueService->log(
                'update',
                'specialites',
                $id,
                $mode === 1
                    ? "Activation de la spécialité"
                    : "Desactivation de la spécialité"
            );

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée'
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
}
