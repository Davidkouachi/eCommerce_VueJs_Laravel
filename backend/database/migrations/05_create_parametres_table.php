<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parametres', function (Blueprint $table) {
            $table->id();

            // 🏥 Identité de la clinique
            $table->string('nom');
            $table->string('sigle', 50)->nullable();
            $table->string('type_structure', 50);
            $table->string('numero_agrement')->nullable();

            // 📍 Localisation
            $table->string('pays');
            $table->string('ville');
            $table->string('commune')->nullable();
            $table->string('adresse')->nullable();

            // 📞 Contacts
            $table->string('telephone1', 20);
            $table->string('telephone2', 20)->nullable();
            $table->string('email')->nullable();

            // 🕒 Horaires
            $table->time('heure_ouverture')->nullable();
            $table->time('heure_fermeture')->nullable();

            // 💰 Paramètres financiers
            $table->string('devise', 10)->default('XOF');

            // 🖼️ Logo (chemin du fichier)
            $table->string('logo')->nullable();

            $table->boolean('statut')->default(true);

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parametres');
    }
};
