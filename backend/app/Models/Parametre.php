<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parametre extends Model
{
    protected $table = 'parametres';

    /**
     * Colonnes autorisées à l’insertion (mass assignment)
     */
    protected $fillable = [
        // 🏥 Identité
        'nom',
        'sigle',
        'type_structure',
        'numero_agrement',

        // 📍 Localisation
        'pays',
        'ville',
        'commune',
        'adresse',

        // 📞 Contacts
        'telephone1',
        'telephone2',
        'email',

        // 🕒 Horaires
        'heure_ouverture',
        'heure_fermeture',

        // 💰 Paramètres financiers
        'devise',

        // 🖼️ Logo
        'logo',
        'statut',
    ];

    /**
     * Casts automatiques (optionnel mais recommandé)
     */
    protected $casts = [
        'heure_ouverture' => 'datetime:H:i',
        'heure_fermeture' => 'datetime:H:i',
    ];
}
