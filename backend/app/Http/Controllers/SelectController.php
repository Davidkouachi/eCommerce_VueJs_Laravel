<?php

namespace App\Http\Controllers;

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use App\Services\SelectService;

class SelectController extends Controller
{
    protected $selectService;

    public function __construct(SelectService $selectService)
    {
        $this->selectService = $selectService;
    }

    // ------------------------------------------------------------

    public function select_roles()
    {
        $data = DB::table('roles')->select('id', 'nom')->where('statut', true)->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    public function select_specialite()
    {
        $data = DB::table('specialites')->select('id', 'nom')->where('statut', true)->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    public function select_tritremedecin()
    {
        $data = DB::table('medecintitres')->select('id', 'nom')->where('statut', true)->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

}
