<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }

        Livewire::addNamespace('product');
        Livewire::addNamespace('manu');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! $this->app->isProduction());

        Blade::directive('format_time', function (string $expression) {
//            Log::info('Some info', [$expression]);
//            $dt = \DateTime::createFromFormat('H:i:s', $expression);
            return "<?php echo \DateTime::createFromFormat('H:i:s', $expression)->format('H:i'); ?>";
        });
    }
}
