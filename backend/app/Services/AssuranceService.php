<?php

namespace App\Services;

use App\Models\Parametre;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AssuranceService
{

    public function insertUpdateAssuranceService(
        array $data, 
        ?string $uid = null, 
        ?string $uid_new = null, 
        ?string $code = null
    ): array
    {
        DB::beginTransaction();

        try {
            $isUpdate = !is_null($uid);

            // 🔎 Doublons
            $duplicate = DB::table('assurances')
                ->where(function ($q) use ($data) {
                    $q->where('nom', $data['nom']);
                })
                ->when($isUpdate, fn ($q) => $q->where('uid', '!=', $uid))
                ->first();

            if ($duplicate) {
                DB::rollBack();
                return [
                    'success' => false,
                    'type' => 'duplicate_assurance',
                    'msg' => 'Cette assurance existe déjà'
                ];
            }

            // Données médecin
            $medecinPayload = [
                'nom'           => $data['nom'],
                'updated_at'    => now(),
            ];

            // Insert / Update médecin
            if ($isUpdate) {
                $rechTable = DB::table('assurances')->where('uid', $uid)->select('id')->first();
                if (!$rechTable) throw new ModelNotFoundException('Assurance introuvable');

                DB::table('assurances')->where('uid', $uid)->update($medecinPayload);
                $Id = $rechTable->id;
            } else {
                $medecinPayload['uid'] = $uid_new;
                $medecinPayload['code'] = $code;
                $medecinPayload['created_at'] = now();
                $Id = DB::table('assurances')->insertGetId($medecinPayload);
            }

            DB::commit(); // ✅ Commit manuel ici

            return [
                'success' => true,
                'action'  => $isUpdate ? 'update' : 'insert',
                'id'      => $Id
            ];

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

    public function updatAssuranceStatutService($uid = null, int $mode = null): array
    {
        DB::beginTransaction();

        try {

            // ✅ Vérification des paramètres
            if ($uid === null || $mode === null) {
                throw new ModelNotFoundException('Paramètres invalides');
            }

            // 🔍 Vérification existence
            $rech = DB::table('assurances')->where('uid', $uid)->select('id')->first();

            if (!$rech) {
                throw new ModelNotFoundException('Assurance introuvable');
            }

            // ---------------- Données communes
            $payload = [
                'statut' => $mode,
                'updated_at' => now(),
            ];

            // ---------------- UPDATE
            DB::table('assurances')
                ->where('uid', $uid)
                ->update($payload);

            DB::commit(); // ✅ Commit manuel ici

            return [
                'success' => true,
                'id'      => $rech->id
            ];

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

}
