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
        Schema::create('medecins', function (Blueprint $table) {
            $table->id();

            $table->string('uid')->unique()->index();
            $table->string('code')->unique()->index();

            // Identité
            $table->string('nom', 100);
            $table->string('prenom', 100);

            // Contacts (uniques)
            $table->string('email')->unique();
            $table->string('telephone', 10)->unique();

            // Professionnel
            $table->foreignId('titre_id')
                ->constrained('medecintitres')
                ->nullOnDelete();

            $table->foreignId('specialite_id')
                ->constrained('specialites')
                ->nullOnDelete();

            $table->string('numero_ordre', 50)->nullable()->unique();
            $table->boolean('statut')->default(true);

            // Timestamps
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medecins');
    }
};
