<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class CodeService
{
    /**
     * Générer un UID séquentiel lisible
     * Exemple : RES25-1, RES25-2, RES25-125
     */
    public function generateCode(
        string $table,
        string $column = 'code',
        string $prefix = 'ID',
        string $separator = '-',
        int $retry = 5
    ): string {
        return DB::transaction(function () use (
            $table,
            $column,
            $prefix,
            $separator
        ) {

            $anneeCourte = date('y'); // ex: 25
            $prefixFinal = $prefix . $anneeCourte;

            // 🔒 Lock table (anti-concurrence)
            DB::table($table)->lockForUpdate()->get();

            // 🔢 Récupérer le dernier UID
            $lastUid = DB::table($table)
                ->where($column, 'like', $prefixFinal . $separator . '%')
                ->orderByRaw(
                    "CAST(SUBSTRING_INDEX($column, '$separator', -1) AS UNSIGNED) DESC"
                )
                ->value($column);

            if ($lastUid) {
                $lastNumber = (int) substr(
                    $lastUid,
                    strrpos($lastUid, $separator) + 1
                );
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            do {
                $uid = $prefixFinal . $separator . $nextNumber;

                $exists = DB::table($table)
                    ->where($column, $uid)
                    ->exists();

                $nextNumber++;

            } while ($exists);

            return $uid;

        }, $retry);
    }

    public function generateUid(
        string $table,
        string $column = 'uid',
        int $retry = 5
    ): string {
        return DB::transaction(function () use ($table, $column) {

            do {
                /*
                 |--------------------------------------------------------------------------
                 | UID = YYYYMMDDHHMMSS + microtime + random
                 |--------------------------------------------------------------------------
                 | Exemple : 202602061425309812A9F3C4D7
                 */
                $timestamp = now()->format('YmdHis'); // 20260206142530
                $micro     = substr((string) microtime(true), -6); // microseconds
                $random    = strtoupper(bin2hex(random_bytes(4))); // 8 chars

                $uid = $timestamp . $micro . $random;

                $exists = DB::table($table)
                    ->where($column, $uid)
                    ->exists();

            } while ($exists);

            return $uid;

        }, $retry);
    }

}