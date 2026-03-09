
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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();

            $table->string('nom');
            $table->boolean('statut')->default(true);

            $table->timestamps();
        });
        
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('login')->unique();
            $table->foreignId('role_id')
                ->nullable()
                ->references('id')
                ->on('roles')
                ->nullOnDelete();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('statut')->default(true);
            $table->string('uid')->nullable()->unique()->index();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('refresh_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('device_id', 255)->nullable()->index();
            $table->integer('user_id')->index();
            $table->string('token', 255)->unique();
            $table->timestamp('expires_at');
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            // Utilisateur connecté
            $table->foreignId('user_id')
                ->nullable()
                ->references('id')
                ->on('users')
                ->nullOnDelete();

            // Action (create, update, delete, login, logout...)
            $table->string('action');

            // Entité concernée (parametre, patient, facture...)
            $table->string('model')->nullable();

            // ID de l’entité
            $table->unsignedBigInteger('model_id')->nullable();

            // Description lisible
            $table->string('description')->nullable();

            // Infos techniques
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
