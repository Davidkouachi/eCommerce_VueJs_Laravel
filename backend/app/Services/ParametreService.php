<?php

namespace App\Services;

use App\Models\Parametre;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class ParametreService
{
    /**
     * Créer ou mettre à jour les paramètres de la clinique
     */
    // parametre -----------------------------------------------------------

    public function insertParametreService(array $data, ?UploadedFile $logo = null): int
    {
        DB::beginTransaction();

        try {

            $parametre = DB::table('parametres')->first();

            if ($logo) {
                if ($parametre && $parametre->logo) {
                    Storage::disk('public')->delete($parametre->logo);
                }

                $extension = $logo->getClientOriginalExtension();
                $filename = time() . '_' . md5($logo->getClientOriginalName()) . '.' . $extension;

                $data['logo'] = $logo->storeAs('images/logo', $filename, 'public');
            }

            // Mise à jour ou création
            if ($parametre) {

                DB::table('parametres')
                    ->where('id', $parametre->id)
                    ->update(array_merge($data, ['updated_at' => now()]));
                $id = $parametre->id;

            } else {

                $id = DB::table('parametres')->insertGetId(array_merge($data, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }

            DB::commit(); // ✅ Commit manuel ici

            return $id;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

    // Roles -----------------------------------------------------------

    public function insertRolesService(array $roles): array
    {
        DB::beginTransaction();

        try {

            $inserted = [];
            $insertedIds = [];
            $duplicates = [];

            foreach ($roles as $nom) {

                $exists = DB::table('roles')
                    ->where('nom', $nom)
                    ->exists();

                if ($exists) {
                    // ⛔ doublon → on garde en mémoire
                    $duplicates[] = $nom;
                    continue;
                }

                // ✅ insertion
                $id = DB::table('roles')->insertGetId([
                    'nom' => $nom,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $inserted[] = $nom;
                $insertedIds[] = $id;
            }

            DB::commit(); // ✅ Commit manuel ici

            return [
                'inserted' => $inserted,
                'inserted_ids' => $insertedIds,
                'duplicates' => $duplicates,
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

    public function updateRolesService(array $data, int $id): bool
    {
        DB::beginTransaction();

        try {

            // 🔍 Vérifier que le rôle existe
            $role = DB::table('roles')->where('id', $id)->first();

            if (!$role) {
                throw new ModelNotFoundException('Rôle introuvable');
            }

            // 🔁 Vérifier doublon (hors rôle courant)
            $exists = DB::table('roles')
                ->where('nom', $data['nom'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                throw new ModelNotFoundException('Ce rôle existe déjà');
            }

            DB::table('roles')
                ->where('id', $id)
                ->update([
                    'nom' => $data['nom'],
                    'updated_at' => now(),
                ]);

            DB::commit(); // ✅ Commit manuel ici

            return true;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

    public function deleteRolesService(int $id): string
    {
        DB::beginTransaction();

        try {

            $role = DB::table('roles')
                ->select('nom')
                ->where('id', $id)
                ->first();

            if (!$role) {
                throw new ModelNotFoundException('Rôle introuvable');
            }

            DB::table('roles')
                ->where('id', $id)
                ->delete();

            DB::commit(); // ✅ Commit manuel ici
            
            // 🔥 on retourne le nom AVANT suppression
            return $role->nom;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e; // relance l'exception
        }
    }

}
