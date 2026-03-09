<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class HistoriqueService
{
    public function log(
        string $action,
        string $model,
        int $modelId,
        string $description
    ): void {
        try {
            DB::table('activity_logs')->insert([
                'user_id'    => auth()->id(),
                'action'     => $action,
                'model'      => $model,
                'model_id'   => $modelId,
                'description'=> $description,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Throwable $e) {
            // ⚠️ On log, jamais d’exception remontée
            \Log::warning('Activity log failed', [
                'action' => $action,
                'model'  => $model,
                'model_id' => $modelId,
                'error'  => $e->getMessage(),
            ]);
        }
    }

}
