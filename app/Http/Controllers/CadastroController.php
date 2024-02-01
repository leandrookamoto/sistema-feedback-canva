<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cadastro;
use App\Models\Atestado;
use App\Models\Funcionario;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\MailableName;
use Illuminate\Support\Facades\Auth;



class CadastroController extends Controller
{

    public function automacao()
    {
       // Email e senha estáticos
       $email = 'leandro.okamoto@globalhitss.com.br';
       $senha = '@Teste2020';
    
       // Tenta autenticar o usuário
       if (Auth::attempt(['email' => $email, 'password' => $senha])) {
           // Se o login for bem-sucedido, redirecione para a página desejada
           return redirect('/dashboard');
       } else {
           // Se o login falhar, faça algo, como redirecionar de volta para o formulário de login
           return redirect('/login')->with('erro', 'Credenciais inválidas');
       }
    
    }

    public function enviarEmail(Request $request)
{
    // Lógica para enviar e-mail sem validações
    $dados = $request->only(['nome', 'email', 'mensagem','assunto','from','nomeChefe']);

    // Certifique-se de que $dados está definido antes de usá-lo
    if (!empty($dados)) {
        try {
            Mail::to($request->email)->send(new MailableName($dados));

            // Pode retornar uma resposta se necessário
            return response()->json(['mensagem' => 'Dados enviados com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['erro' => 'Erro ao enviar o e-mail'], 500);
        }
    } else {
        return response()->json(['erro' => 'Dados inválidos'], 400);
    }
}

    
    
    



    public function getAllCadastro($setor)
    {
        $resultado = Cadastro::where('setor', $setor)->get();
    
        if ($resultado) {
            return response()->json($resultado);
        } else {
            return response()->json([], 404); // Retorna uma resposta vazia com código de status 404 (não encontrado)
        }
    }

     public function getAllColaboradoresAtestado() {
      $atestado = Atestado::get()->toJson(JSON_PRETTY_PRINT);
   return response($atestado, 200);
   }

   public function getAllFuncionarios($setor) {
    if (!isset($setor)) {
        return response()->json(['error' => 'Parâmetro $setor não definido.'], 400);
    }

    $resultado = Funcionario::where('setor', $setor)->get();
   
        if ($resultado) {
            return response()->json($resultado);
        } else {
            return response()->json([], 404); 
        }
 }
 
     public function createCadastro(Request $request)
    {

          // Validação dos dados recebidos
  //   $validatedData = $request->validate([
  //     'nome' => 'required|string|max:255',
  //     'email' => 'required|email|unique:cadastro_funcionario,email',
  //     'setor' => 'required|string|max:100',
  //     'administrador' => 'required|string|max:500',
  // ]);

        // Criar um novo usuário com base nos dados recebidos
        $user = new Cadastro;
        $user->nome = $request->nome;
        $user->email = $request->email;
        $user->setor = $request->setor;
        $user->administrador = $request->administrador;

        // Salvar o novo usuário no banco de dados
        $user->save();

        return $request;

  
    }
 
 
     public function updateAvaliacao(Request $request, $id) {
       if (Cadastro::where('id', $id)->exists()) {
         $funcionario = Cadastro::find($id);
         $funcionario->avaliacoes = is_null($request->avaliacoes) ? $funcionario->avaliacoes : $request->avaliacoes;
         $funcionario->save();
 
         return response()->json([
             "message" => "records updated successfully"
         ], 200);
         } else {
         return response()->json([
             "message" => "Description not found"
         ], 404);
     }
     }

     public function updateFerias(Request $request, $id) {
        if (Cadastro::where('id', $id)->exists()) {
          $funcionario = Cadastro::find($id);
          $funcionario->ferias = is_null($request->ferias) ? $funcionario->ferias : $request->ferias;
          $funcionario->save();
  
          return response()->json([
              "message" => "records updated successfully"
          ], 200);
          } else {
          return response()->json([
              "message" => "Description not found"
          ], 404);
      }
      }

      public function updateObservacao(Request $request, $id) {
        if (User::where('id', $id)->exists()) {
          $funcionario = User::find($id);
          $funcionario->observacao = is_null($request->observacao) ? $funcionario->observacao : $request->observacao;
          $funcionario->save();
  
          return response()->json([
              "message" => "records updated successfully"
          ], 200);
          } else {
          return response()->json([
              "message" => "Description not found"
          ], 404);
      }
      }

     public function update(Request $request, $id) {
      if (Cadastro::where('id', $id)->exists()) {
          $funcionario = Cadastro::find($id);
  
          // Verifica cada campo no request e atualiza se estiver presente
          if ($request->has('nome')) {
              $funcionario->nome = $request->nome;
          }
          if ($request->has('email')) {
              $funcionario->email = $request->email;
          }
          if ($request->has('setor')) {
              $funcionario->setor = $request->setor;
          }
          // Adicione outros campos conforme necessário
  
          $funcionario->save();
  
          return response()->json([
              "message" => "records updated successfully"
          ], 200);
      } else {
          return response()->json([
              "message" => "Description not found"
          ], 404);
      }
  }

  public function updatePlano(Request $request, $id) {
    if (Cadastro::where('id', $id)->exists()) {
      $funcionario = Cadastro::find($id);
      $funcionario->plano = is_null($request->plano) ? $funcionario->plano : $request->plano;
      $funcionario->save();

      return response()->json([
          "message" => "records updated successfully"
      ], 200);
      } else {
      return response()->json([
          "message" => "Description not found"
      ], 404);
  }
  }
  

     
 
     public function deleteFuncionario ($id) {
        if(Cadastro::where('id', $id)->exists()) {
         $funcionario = Cadastro::find($id);
         $funcionario->delete();
 
         return response()->json([
           "message" => "records deleted"
         ], 202);
       } else {
         return response()->json([
           "message" => "Description not found"
         ], 404);
       }
     }
}
