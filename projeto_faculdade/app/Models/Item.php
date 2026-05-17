<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'user_id',
        'titulo',
        'descricao',
        'categoria',
        'condicao',
        'localizacao',
        'fotos',
        'status',
        'interessados',
    ];

    protected $casts = [
        'fotos'       => 'array',
        'lat'         => 'float',
        'lng'         => 'float',
        'interessados'=> 'integer',
    ];

    // Relacionamento: item pertence a um usuário (doador)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
