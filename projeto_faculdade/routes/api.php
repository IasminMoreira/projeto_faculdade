<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

// ── Rotas públicas ────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Listagem de itens é pública (qualquer um pode ver)
Route::get('/itens', [ItemController::class, 'index']);
Route::get('/itens/{id}', [ItemController::class, 'show']);

// ── Rotas protegidas ─────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',   [AuthController::class, 'logout']);
    Route::get('/user',      [AuthController::class, 'user']);

    // Itens
    Route::get('/itens/meus',           [ItemController::class, 'meus']);
    Route::post('/itens',               [ItemController::class, 'store']);
    Route::put('/itens/{id}',           [ItemController::class, 'update']);
    Route::delete('/itens/{id}',        [ItemController::class, 'destroy']);
    Route::patch('/itens/{id}/doado',   [ItemController::class, 'marcarDoado']);
});
