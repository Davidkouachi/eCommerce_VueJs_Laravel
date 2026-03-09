<?php

namespace App\Services;

use App\Models\Parametre;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class MedecinService
{

    public function insertUpdateMedecinService(
        array $data, 
        ?string $uid = null, 
        ?string $uid_new = null, 
        ?string $code = null
    ): array
    {
        DB::beginTransaction();

        try {
            $isUpdate = !is_null($uid);

            // 🔎 Doublons médecin
            $duplicateMedecin = DB::table('medecins')
                ->where(function ($q) use ($data) {
                    $q->where('email', $data['email'])
                      ->orWhere('telephone', $data['telephone']);

                    if (!empty($data['numero_ordre'])) {
                        $q->orWhere('numero_ordre', $data['numero_ordre']);
                    }
                })
                ->when($isUpdate, fn ($q) => $q->where('uid', '!=', $uid))
                ->first();

            if ($duplicateMedecin) {
                DB::rollBack();
                return [
                    'success' => false,
                    'type' => 'duplicate_medecin',
                    'msg' => 'Email, téléphone ou numéro d’ordre déjà utilisé par un autre médecin'
                ];
            }

            // Données médecin
            $medecinPayload = [
                'nom'           => $data['nom'],
                'prenom'        => $data['prenom'],
                'email'         => $data['email'],
                'telephone'     => $data['telephone'],
                'titre_id'      => $data['titre_id'],
                'specialite_id' => $data['specialite_id'],
                'numero_ordre'  => $data['numero_ordre'] ?? null,
                'updated_at'    => now(),
            ];

            // Insert / Update médecin
            if ($isUpdate) {
                $medecin = DB::table('medecins')->where('uid', $uid)->select('id')->first();
                if (!$medecin) throw new ModelNotFoundException('Médecin introuvable');

                DB::table('medecins')->where('uid', $uid)->update($medecinPayload);
                $medecinId = $medecin->id;
            } else {
                $medecinPayload['uid'] = $uid_new;
                $medecinPayload['code'] = $code;
                $medecinPayload['created_at'] = now();
                $medecinId = DB::table('medecins')->insertGetId($medecinPayload);
            }

            // Gestion des accès
            if ($data['ajouterAcces']) {
                $medecinUid = $uid ?? $uid_new;

                $duplicate = DB::table('users')
                    ->where(function ($q) use ($data) {
                        $q->where('login', $data['login'])
                          ->orWhere('email', $data['email']);
                    })
                    ->when($isUpdate, fn ($q) => $q->where('uid', '!=', $uid))
                    ->first();

                if ($duplicate) {
                    DB::rollBack();
                    return [
                        'success' => false,
                        'type' => 'duplicate_access',
                        'msg' => 'Login ou email déjà utilisé'
                    ];
                }

                $userPayload = [
                    'name'       => $data['nom'].' '.$data['prenom'],
                    'login'      => $data['login'],
                    'email'      => $data['email'],
                    'updated_at' => now(),
                ];

                if (!empty($data['password'])) $userPayload['password'] = bcrypt($data['password']);

                $userExists = DB::table('users')->where('uid', $medecinUid)->exists();

                if ($userExists) {
                    DB::table('users')->where('uid', $medecinUid)->update($userPayload);
                } else {
                    $userPayload['uid'] = $medecinUid;
                    $userPayload['role_id'] = 2;
                    $userPayload['created_at'] = now();
                    DB::table('users')->insert($userPayload);
                }

            }

            DB::commit(); // ✅ Commit manuel ici

            return [
                'success' => true,
                'action'  => $isUpdate ? 'update' : 'insert',
                'id'      => $medecinId
            ];

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

    // ------------------------------------------------------------

    public function insertSpecialiteService(array $data, ?int $id = null): array
    {
        DB::beginTransaction();

        try {

            $isUpdate = !is_null($id);

            // ---------------- Vérification existence (UPDATE)
            if ($isUpdate) {
                $verf = DB::table('specialites')->where('id', $id)->first();

                if (!$verf) {
                    throw new ModelNotFoundException('Spécialité introuvable');
                }
            }

            // ---------------- Doublons (login / email)
            $duplicate = DB::table('specialites')
                ->where(function ($q) use ($data) {
                    $q->where('nom', $data['nom']);
                })
                ->when($isUpdate, fn ($q) => $q->where('id', '!=', $id))
                ->first();

            if ($duplicate) {
                DB::rollBack();
                return [
                    'success' => false,
                    'type' => 'duplicate',
                    'msg' => 'Cette spécialité existe déjà',
                ];
            }

            // ---------------- Données communes
            $payload = [
                'nom' => $data['nom'],
                'updated_at' => now(),
            ];

            // ---------------- UPDATE
            if ($isUpdate) {

                DB::table('specialites')
                    ->where('id', $id)
                    ->update($payload);

                $resultID = $id;

            } else {
                // ---------------- INSERT

                $payload['created_at'] = now();

                $newId = DB::table('specialites')->insertGetId($payload);

                $resultID = $newId;
            }            

            DB::commit(); // ✅ Commit manuel ici

            return [
                'success' => true,
                'action' => $isUpdate ? 'update' :'insert',
                'id' => $resultID,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

    public function updatSpecialiteStatutService(int $id = null, int $mode = null): bool
    {
        DB::beginTransaction();

        try {

            // ✅ Vérification des paramètres
            if ($id === null || $mode === null) {
                throw new ModelNotFoundException('Paramètres invalides');
            }

            // 🔍 Vérification existence
            $specialite = DB::table('specialites')->where('id', $id)->first();

            if (!$specialite) {
                throw new ModelNotFoundException('Spécialité introuvable');
            }

            // ---------------- Données communes
            $payload = [
                'statut' => $mode,
                'updated_at' => now(),
            ];

            // ---------------- UPDATE
            DB::table('specialites')
                ->where('id', $id)
                ->update($payload);

            DB::commit(); // ✅ Commit manuel ici

            return true;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

}
