<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\CadastroController;

class CustomTask extends Command
{
    protected $signature = 'app:custom-task';
    protected $description = 'Command description';

    protected $cadastroController;

    public function __construct(CadastroController $cadastroController)
    {
        parent::__construct();
        $this->cadastroController = $cadastroController;
    }

    public function handle()
    {
        // Chama o método automacao do CadastroController
        $this->cadastroController->automacao();

        $this->info('Custom task executed successfully!');
    }
}
