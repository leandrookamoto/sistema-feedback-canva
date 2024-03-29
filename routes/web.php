<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CadastroController;
use App\Mail\MailableName;
use Illuminate\Support\Facades\Mail;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('user', [UserController::class,'getUserData']);


// Rota para o login
Route::get('/', function () {
    return view('../auth/login');
})->name('home');;


Route::get('/conseguir-usuarios', [CadastroController::class, 'getAllUsers']);

// Middleware
Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    // Configuração das páginas que poderão ser somente acessadas após o login
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    Route::get('/welcome', function () {
        return view('welcome');
    })->name('welcome');

    // Endpoint para recuperar os dados do usuário
    Route::get('/api/user', [UserController::class, 'getUserData']);

    Route::get('/colaboradores-atestado', [CadastroController::class, 'getAllColaboradoresAtestado']);

    Route::post('/cadastrar-usuario', [CadastroController::class, 'createCadastro'])->name('cadastrar.usuario');

    Route::get('/cadastrados/{setor}', [CadastroController::class, 'getAllCadastro']);

    Route::get('/users', [CadastroController::class, 'getAllUsers']);

    Route::put('/cadastro/{id}/update-avaliacao', [CadastroController::class, 'updateAvaliacao']);

    Route::put('/cadastro/{id}/update-observacao', [CadastroController::class, 'updateObservacao']);

    Route::put('/cadastro/{id}/update-ferias', [CadastroController::class, 'updateFerias']);

    Route::delete('/deleteFuncionario/{id}', [CadastroController::class, 'deleteFuncionario']);

    Route::put('/funcionario/{id}', [CadastroController::class, 'update']);

    Route::get('/funcionarios/{setor}', [CadastroController::class, 'getAllFuncionarios']);

    Route::put('/cadastro/{id}/update-plano', [CadastroController::class, 'updatePlano']);

    Route::post('/enviar-email', [CadastroController::class, 'enviarEmail']);

});