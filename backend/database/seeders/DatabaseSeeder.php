<?php

namespace Database\Seeders;

use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // DB::table('roles')->insertGetId([
        //     'nom' => 'administrateur',
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);

        // DB::table('users')->insertGetId([
        //     'name' => 'Administrateur',
        //     'login' => 'admin',
        //     'email' => 'admin@gmail.com',
        //     'role_id' => 1,
        //     'password' => password_hash('password', PASSWORD_BCRYPT),
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);

        // DB::table('roles')->insert([
        //     ['nom' => 'administrateur', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'medecin', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'patient', 'created_at' => now(), 'updated_at' => now()],
        // ]);

        // DB::table('specialites')->insert([
        //     ['nom' => 'Médecine générale', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Cardiologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Dermatologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Gynécologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Pédiatrie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Neurologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Psychiatrie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Ophtalmologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'ORL (Oto-rhino-laryngologie)', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Urologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Néphrologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Endocrinologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Diabétologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Pneumologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Rhumatologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Oncologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Hématologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Allergologie', 'created_at' => now(), 'updated_at' => now()],
        //     ['nom' => 'Immunologie', 'created_at' => now(), 'updated_at' => now()],
        // ]);

        DB::table('medecintitres')->insert([
            [
                'nom' => 'Docteur', 
                'signe' => 'Dr', 
                'created_at' => now(), 
                'updated_at' => now()
            ],
            [
                'nom' => 'Médécin', 
                'signe' => 'Med', 
                'created_at' => now(), 
                'updated_at' => now()
            ],
            [
                'nom' => 'Professeur', 
                'signe' => 'Prof', 
                'created_at' => now(), 
                'updated_at' => now()
            ],
        ]);

    }
}
