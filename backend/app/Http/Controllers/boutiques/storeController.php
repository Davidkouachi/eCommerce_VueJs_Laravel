<?php

namespace App\Http\Controllers\boutiques\store;

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

use App\Services\UidService;

class storeController extends Controller
{
    private UidService $uidService;

    public function __construct(UidService $uidService)
    {
        $this->uidService = $uidService;
    }

    // -----------------------------------------------------------------

    public function insertBout(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'type' => 'required|in:preventive,corrective',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        $validated = $validator->validated();

        $uid = $this->uidService->generate(
            table: 'actions',
            column: 'uid',
            prefix: 'act'
        );

        try {

            $this->actionService->createAction($uid, $validated);

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée avec succès',
            ], 200);

        } catch (Exception $e) {

            return response()->json([
                'error' => true,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    public function Updateaction(Request $request, $id)
    {
        try {
            $realId = Crypt::decryptString($id);
        } catch (DecryptException $e) {
            return response()->json([
                'info' => true,
                'msg' => 'Identifiant invalide'
            ], 201);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        $validated = $validator->validated();

        // Vérifier si le processus existe
        $verf = DB::table('actions')->where('id', $realId)->exists();

        if (!$verf) {
            return response()->json([
                'warn' => true,
                'msg' => 'Action introuvable'
            ], 202);
        }

        try {

            $this->actionService->updateAction($realId, $validated);

            return response()->json([
                'success' => true,
                'msg' => 'Action mis à jour avec succès'
            ], 200);

        } catch (Exception $e) {

            return response()->json([
                'warn' => true,
                'msg' => $e->getMessage()
            ], 500);
        }
    }
}
