<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Robo extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    protected $table = 'robo';
    protected $fillable = [
        'email',
        'senha',
    ];
}
