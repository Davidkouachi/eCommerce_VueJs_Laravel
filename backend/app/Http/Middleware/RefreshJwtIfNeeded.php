<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Illuminate\Support\Facades\Log;

class RefreshJwtIfNeeded
{
    public function handle($request, Closure $next): Response
    {
        // ⚠️ Ignore le refresh pour la route logout
        if ($request->is('api/logout') || $request->is('api/logoutAuto/*')) {
            return $next($request);
        }

        try {
            // Tente d'authentifier avec le token actuel
            $user = JWTAuth::parseToken()->authenticate();

        } catch (TokenExpiredException $e) {
            try {
                // Token expiré → rafraîchir
                $newToken = JWTAuth::refresh(JWTAuth::getToken());

                // Authentifier avec le nouveau token
                $user = JWTAuth::setToken($newToken)->toUser();

                // Ajouter le token dans la requête pour les controllers
                $request->headers->set('Authorization', 'Bearer ' . $newToken);

                // Appel du prochain middleware/controller
                $response = $next($request);

                // Retourner le nouveau token dans les headers
                return $response->header('Authorization', 'Bearer ' . $newToken);
            } catch (TokenBlacklistedException $e) {
                // Si le token est déjà blacklisté, renvoyer message 401
                return response()->json([
                    'authenticated' => false,
                    'message' => 'Session expirée ou token invalide.'
                ], 401);
            } catch (JWTException $e) {
                return response()->json([
                    'authenticated' => false,
                    'message' => 'Session expirée.'
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json([
                'authenticated' => false,
                'message' => 'Token invalide.'
            ], 401);
        }

        // Token encore valide → on continue
        return $next($request);
    }
}

