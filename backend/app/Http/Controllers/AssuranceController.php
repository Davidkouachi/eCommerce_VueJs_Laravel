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

use App\Services\AssuranceService;
use App\Services\HistoriqueService;
use App\Services\CodeService;

class AssuranceController extends Controller
{
    protected $assuranceService;
    protected $historiqueService;
    protected $codeService;

    public function __construct(
        AssuranceService $assuranceService, 
        HistoriqueService $historiqueService,
        CodeService $codeService,
    )
    {
        $this->assuranceService = $assuranceService;
        $this->historiqueService = $historiqueService;
        $this->codeService = $codeService;
    }

    // ------------------------------------------------------------

    public function insertUpdateAssurance(Request $request, $uid = null)
    {

        $rules = [
            'nom'            => 'required|string|max:100',
            'statut'         => 'nullable|boolean',
        ];

        Log::info($uid);

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
                table: 'assurances',
                column: 'code',
                prefix: 'Ass'
            );

            $uid_new = $this->codeService->generateUid(
                table: 'assurances',
            );
        }

        try {
            $result = $this->assuranceService->insertUpdateAssuranceService(
                $validator->validated(),
                $uid,
                $uid_new,
                $code,
            );

            if (!$result['success'] && $result['type'] === 'duplicate_assurance') {
                return response()->json([
                    'info' => true,
                    'msg' => $result['msg']
                ], 202);
            }

            // 🧾 Historique
            $this->historiqueService->log(
                $result['action'],
                'assurances',
                $result['id'],
                $result['action'] === 'insert'
                    ? "Création d'une assurance"
                    : "Mise à jour d'une assurance"
            );

            $data = DB::table('assurances')
                ->where('id', $result['id'])
                ->select(
                    'id',
                    'uid',
                    'code',
                    'nom',
                    'statut',
                    'created_at',
                    DB::raw("
                        CASE statut
                            WHEN 1 THEN 'Actif'
                            WHEN 0 THEN 'Inactif'
                            ELSE 'Inconnu'
                        END as statut_label
                    "),
                )
                ->orderBy('created_at', 'desc')
                ->orderBy('id', 'desc')
                ->first();

            return response()->json([
                'success' => true,
                'msg' => $result['action'] === 'insert'
                    ? 'Assurance créé avec succès'
                    : 'Assurance mis à jour avec succès',
                'data' => $data
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

    public function getAllAssurance()
    {
        $data = DB::table('assurances')
            ->select(
                'assurances.id',
                'assurances.uid',
                'assurances.code',
                'assurances.nom',
                'assurances.statut',
                'assurances.created_at',
                DB::raw("
                    CASE assurances.statut
                        WHEN 1 THEN 'Actif'
                        WHEN 0 THEN 'Inactif'
                        ELSE 'Inconnu'
                    END as statut_label
                "),
            )
            ->orderBy('assurances.created_at', 'desc')
            ->orderBy('assurances.id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data ?? []
        ], 200);
    }

    public function updatAssuranceStatut($uid = null, int $mode = null )
    {

        try {

            $result = $this->assuranceService->updatAssuranceStatutService(
                $uid,
                $mode
            );

            // 🧾 Historique (non bloquant)
            $this->historiqueService->log(
                'update',
                'assurances',
                $result['id'],
                $mode === 1
                    ? "Activation assurance"
                    : "Desactivation assurance"
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
