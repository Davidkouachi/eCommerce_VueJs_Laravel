<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaysSeeder extends Seeder
{
    public function run(): void
    {
        $paysAfricains = [
            ['nom' => 'Afrique du Sud'],
            ['nom' => 'Algérie'],
            ['nom' => 'Angola'],
            ['nom' => 'Bénin'],
            ['nom' => 'Botswana'],
            ['nom' => 'Burkina Faso'],
            ['nom' => 'Burundi'],
            ['nom' => 'Cameroun'],
            ['nom' => 'Cap-Vert'],
            ['nom' => 'Centrafrique'],
            ['nom' => 'Comores'],
            ['nom' => 'Congo'],
            ['nom' => 'République démocratique du Congo'],
            ['nom' => 'Côte d\'Ivoire'],
            ['nom' => 'Djibouti'],
            ['nom' => 'Égypte'],
            ['nom' => 'Érythrée'],
            ['nom' => 'Eswatini'],
            ['nom' => 'Éthiopie'],
            ['nom' => 'Gabon'],
            ['nom' => 'Gambie'],
            ['nom' => 'Ghana'],
            ['nom' => 'Guinée'],
            ['nom' => 'Guinée-Bissau'],
            ['nom' => 'Guinée équatoriale'],
            ['nom' => 'Kenya'],
            ['nom' => 'Lesotho'],
            ['nom' => 'Liberia'],
            ['nom' => 'Libye'],
            ['nom' => 'Madagascar'],
            ['nom' => 'Malawi'],
            ['nom' => 'Mali'],
            ['nom' => 'Maroc'],
            ['nom' => 'Maurice'],
            ['nom' => 'Mauritanie'],
            ['nom' => 'Mozambique'],
            ['nom' => 'Namibie'],
            ['nom' => 'Niger'],
            ['nom' => 'Nigeria'],
            ['nom' => 'Ouganda'],
            ['nom' => 'Rwanda'],
            ['nom' => 'São Tomé-et-Principe'],
            ['nom' => 'Sénégal'],
            ['nom' => 'Seychelles'],
            ['nom' => 'Sierra Leone'],
            ['nom' => 'Somalie'],
            ['nom' => 'Soudan'],
            ['nom' => 'Soudan du Sud'],
            ['nom' => 'Tanzanie'],
            ['nom' => 'Tchad'],
            ['nom' => 'Togo'],
            ['nom' => 'Tunisie'],
            ['nom' => 'Zambie'],
            ['nom' => 'Zimbabwe'],
        ];

        DB::table('pays')->insert($paysAfricains);
    }
}

