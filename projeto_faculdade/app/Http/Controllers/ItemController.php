<?php
 
namespace App\Http\Controllers;
 
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
 
class ItemController extends Controller
{
    // GET /api/itens — lista itens ativos (público)
    public function index(Request $request)
    {
        $query = Item::with('user:id,name,cidade,avaliacao')
            ->where('status', 'ativo')
            ->latest();
 
        if ($request->filled('categoria') && $request->categoria !== 'todos') {
            $query->where('categoria', $request->categoria);
        }
 
        if ($request->filled('busca')) {
            $query->where('titulo', 'like', '%' . $request->busca . '%');
        }
 
        return response()->json($query->get());
    }
 
    // GET /api/itens/{id}
    public function show($id)
    {
        $item = Item::with('user:id,name,cidade,avaliacao')->findOrFail($id);
        return response()->json($item);
    }
 
    // GET /api/itens/meus — itens do usuário autenticado
    public function meus()
    {
        $itens = Item::where('user_id', Auth::id())->latest()->get();
        return response()->json($itens);
    }
 
    // POST /api/itens — criar item (recebe JSON com fotos em base64 ou URLs)
    public function store(Request $request)
    {
        $request->validate([
            'titulo'      => ['required', 'string', 'max:255'],
            'descricao'   => ['nullable', 'string'],
            'categoria'   => ['required', 'string'],
            'condicao'    => ['required', 'string'],
            'localizacao' => ['nullable', 'string'],
            'lat'         => ['nullable', 'numeric'],
            'lng'         => ['nullable', 'numeric'],
            'fotos'       => ['nullable', 'array'],
        ]);
 
        $item = Item::create([
            'user_id'     => Auth::id(),
            'titulo'      => $request->titulo,
            'descricao'   => $request->descricao ?? '',
            'categoria'   => $request->categoria,
            'condicao'    => $request->condicao,
            'localizacao' => $request->localizacao ?? '',
            'lat'         => $request->lat,
            'lng'         => $request->lng,
            'fotos'       => $request->fotos ?? [],
            'status'      => 'ativo',
            'interessados'=> 0,
        ]);
 
        return response()->json($item, 201);
    }
 
    // PUT /api/itens/{id}
    public function update(Request $request, $id)
    {
        $item = Item::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
 
        $request->validate([
            'titulo'    => ['sometimes', 'string', 'max:255'],
            'descricao' => ['sometimes', 'string'],
            'categoria' => ['sometimes', 'string'],
            'condicao'  => ['sometimes', 'string'],
            'fotos'     => ['sometimes', 'array'],
        ]);
 
        $item->update($request->only([
            'titulo', 'descricao', 'categoria', 'condicao', 'fotos'
        ]));
 
        return response()->json($item);
    }
 
    // DELETE /api/itens/{id}
    public function destroy($id)
    {
        Item::where('id', $id)->where('user_id', Auth::id())->firstOrFail()->delete();
        return response()->json(['message' => 'Item excluído.']);
    }
 
    // PATCH /api/itens/{id}/doado
    public function marcarDoado($id)
    {
        $item = Item::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $item->update(['status' => 'doado']);
        return response()->json($item);
    }
}
