<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $adminRoleId = DB::table('roles')->insertGetId([
            'nom' => 'administrateur',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $vendeurRoleId = DB::table('roles')->insertGetId([
            'nom' => 'vendeur',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $clientRoleId = DB::table('roles')->insertGetId([
            'nom' => 'client',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Création des utilisateurs pour chaque rôle
        DB::table('users')->insert([
            [
                'name' => 'Administrateur',
                'login' => 'admin',
                'email' => 'admin@gmail.com',
                'role_id' => $adminRoleId,
                'password' => password_hash('password', PASSWORD_BCRYPT),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Vendeur Test',
                'login' => 'vendeur',
                'email' => 'vendeur@gmail.com',
                'role_id' => $vendeurRoleId,
                'password' => password_hash('password', PASSWORD_BCRYPT),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Client Test',
                'login' => 'client',
                'email' => 'client@gmail.com',
                'role_id' => $clientRoleId,
                'password' => password_hash('password', PASSWORD_BCRYPT),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

