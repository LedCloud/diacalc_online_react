<?php

namespace App\Orchid\Screens\Products;

use App\Classes\Diacalc\ProductsFromJson;
use App\Models\ArcGroup;
use App\Models\ArcProduct;
use App\Orchid\Layouts\Archive\ArcGroupListLayout;
use App\Orchid\Layouts\Archive\ArcProductListLayout;
use App\Orchid\Layouts\Products\ProductListLayout;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Repository;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class Stub extends Screen
{
    protected ProductsFromJson $product_struct;
    protected $selected_group_id = 0;

    public function __construct()
    {
        $data = Storage::disk('local')->json('base.json');
        $this->product_struct = new ProductsFromJson($data);
    }

    public function name(): ?string
    {
        return __('Default products');
    }

    public function description(): ?string
    {
        return __('This products can be used by the users to fill their product base with');
    }

    public function commandBar(): iterable
    {
        return []; //Nothing yet
    }

    public function query(): iterable
    {
        $perPage = 10;
        $currentPage = Request::get('page', 1);

        $groups = array_map(fn($r) => new Repository([
            'name'=> $r['name'],
            'id' => $r['id'],
            'count'=> count($r['prods'])
        ]), $this->product_struct->getGroups());

        $products = array_map(fn($r) => new Repository([
            'name' => $r['name'],
            'prot' => $r['prot'],
            'fat' => $r['fat'],
            'carb' => $r['carb'],
            'gi' => $r['gi'],
        ]), $this->product_struct->getProducts($this->selected_group_id));

        $currentProducts = array_slice($products, ($currentPage - 1) * $perPage, $perPage);
        $paginatedItems = new LengthAwarePaginator(
            $currentProducts,
            count($products),
            $perPage,
            $currentPage,
            ['path' => Request::url(), 'query' => Request::query()]
        );

        return [
            'groups' => $groups,
            'products' => $paginatedItems,
        ];
    }

    public function asyncGetProducts(int $groupId)
    {
        Log::info('GroupID', [$groupId]);

        $this->selected_group_id = $groupId;

        $perPage = 10;
        $currentPage = Request::get('page', 1);

        $products = array_map(fn($r) => new Repository([
            'name' => $r['name'],
            'prot' => $r['prot'],
            'fat' => $r['fat'],
            'carb' => $r['carb'],
            'gi' => $r['gi'],
        ]), $this->product_struct->getProducts($this->selected_group_id));

        $currentProducts = array_slice($products, ($currentPage - 1) * $perPage, $perPage);
        $paginatedItems = new LengthAwarePaginator(
            $currentProducts,
            count($products),
            $perPage,
            $currentPage,
            ['path' => Request::url(), 'query' => Request::query()]
        );

        return [
            'products' => $paginatedItems,
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::split([
                Layout::table('groups', [
                    TD::make('name')
                        ->render(fn ($group) =>
                        Link::make($group['name'] . ':' . $group['id'])
                            ->asyncRoute('asyncGetProducts', $group['id'])
                        ),
                    TD::make('count'),
                ]),
                Layout::table('products', [
                    TD::make('name'),
                    TD::make('prot'),
                    TD::make('fat'),
                    TD::make('carb'),
                    TD::make('gi'),
                ]),
            ])
                ->ratio('40/60')
        ];
    }
}
