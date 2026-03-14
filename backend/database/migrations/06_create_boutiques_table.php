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
        Schema::create('boutiques', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique()->index();

            // vendeur
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            // identité
            $table->string('nom');          // nom de la boutique
            $table->string('lien')->unique(); 
            $table->text('description')->nullable();

            // images
            $table->string('logo')->nullable();
            // $table->string('banniere')->nullable();

            // localisation
            $table->foreignId('pays_id')
                  ->constrained('pays')
                  ->cascadeOnDelete();
            $table->string('ville');
            $table->string('commune')->nullable();
            $table->string('adresse')->nullable();

            // contacts
            $table->string('telephone');
            $table->string('email')->nullable();
            $table->string('whatsapp')->nullable();

            // paramètres commerciaux
            $table->string('devise')->default('XOF');
            $table->boolean('livraison_active')->default(true);

            // statut
            $table->boolean('statut')->default(true);

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boutiques');
    }
};
