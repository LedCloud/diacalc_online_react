<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Livewire\Component;
use App\Classes\Settings\MenuInfo;
use App\Classes\Diacalc\Glucose;
use Livewire\Attributes\On;
use Livewire\Attributes\Validate;

new class extends Component {
    const MENU = 'menu';
    const GLUCOSE = 'glucose';
    const PRODUCTS = 'products';

    const PLASMA = 'plasma';
    const WHOLE = 'whole';

    const MMOL = 'mmol';
    const MGDL = 'mgdl';

    public $section = '';
    public $settings = null;
    public array $selectedMasks = [];
    public int $selectRound = 0;

    #[Validate('integer|min:1000', message: 'This qty is too small')]
    public int $calory_limit = 0;

    #[Validate('numeric|min:3|max:50')]
    public float $target = 0;

    #[Validate('numeric|min:3|max:50')]
    public float $low_level = 0;

    #[Validate('numeric|min:3|max:50')]
    public float $high_level = 0;

    public $plasma; //plasma or whole
    public $mmol; //mmol or mgdl

    public $use_freq;

    #[Validate('integer|min:5', message: 'This qty is too small')]
    public $freq_qty;

    #[Validate('integer|min:5|max:50', message: 'This qty must be between 5 and 50')]
    public $filter_off;

    protected ?Glucose $gl_target;
    protected ?Glucose $gl_low;
    protected ?Glucose $gl_high;

    protected array $gls = [];

    protected function isMmol()
    {
        return $this->mmol === self::MMOL;
    }

    protected function isPlasma()
    {
        return $this->plasma === self::PLASMA;
    }

    /**
     * This is called first
     * @return void
     */
    public function boot()
    {
        //$this->settings = Auth::user()->getSetting('User');

        $settings = Auth::user()->getSetting('User');

        $this->gl_target =
            (new Glucose($settings['target']))
            ->setMmol($settings['is_mmol'])
            ->setPlasma($settings['is_plasma']);

        $this->gl_low =
            (new Glucose($settings['low_level']))
                ->setMmol($settings['is_mmol'])
                ->setPlasma($settings['is_plasma']);

        $this->gl_high =
            (new Glucose($settings['high_level']))
                ->setMmol($settings['is_mmol'])
                ->setPlasma($settings['is_plasma']);

        $this->gls = [$this->gl_target, $this->gl_low, $this->gl_high];
    }

    /**
     * This is called multiple times afterward
     * @return void
     */
    public function mount()
    {
        $this->section = self::MENU;
        $this->settings = Auth::user()->getSetting('User');

        foreach (MenuInfo::getAll() as $bit) {
            if ($this->settings['menu_info'] & $bit) {
                $this->selectedMasks[] = (string)$bit;
            }
        }

        Log::info('In mount', $this->settings);

        $this->plasma = $this->settings['is_plasma'] ? self::PLASMA : self::WHOLE;
        $this->mmol = $this->settings['is_mmol'] ? self::MMOL : self::MGDL;

        $this->selectRound = $this->settings['round_to'];
        $this->calory_limit = $this->settings['calory_limit'];

        $this->target = $this->gl_target->getForView();
        $this->low_level = $this->gl_low->getForView();
        $this->high_level = $this->gl_high->getForView();

        $this->use_freq = (bool)$this->settings['use_freq'];
        $this->freq_qty = $this->settings['freq_qty'];
        $this->filter_off = $this->settings['filter_off'];
    }

    public function updated($property, $value)
    {
        if (in_array($property, ['plasma', 'mmol', 'target'])
            && !empty($value)
        ) {
            $this->$property = $value;

            Log::info('updated', [$property, $value, gettype($value)]);

            if ($property === 'target') {
                $this->gl_target->setGlucose((float)$value);
            }

            foreach ($this->gls as $key => $gl) {
                $this->gls[$key]
                    ->setPlasma($this->isPlasma())
                    ->setMmol($this->isMmol());
            }

            //$this->target = $this->gl_target->getForView();



            if ($property !== 'target') {
                $this->target = $this->gl_target->getForView();
            }

            $this->settings['is_plasma'] = $this->isPlasma();
            $this->settings['is_mmol'] = $this->isMmol();
            $this->settings['target'] = $this->gl_target->getRawValue();

            /*$this->gl_target->setGlucose($this->target);
            $this->settings['target'] = $this->gl_target->getRawValue();*/
            Log::info('Updated', [
                $this->target,
                $this->settings['target']
            ]);
        }
    }

    public function fillProducts()
    {
        $params = [
            'callbackOK' => 'fill-confirmed',
            'title' => 'Fill product database with the default products',
            'message' => 'All current products and groups will be deleted.<br>This action is suitable for the initial filling.',
            'ok' => 'Fill',
        ];
        $this->dispatch("fill-products", ['params' => $params]);
    }

    public function updatedSelectedMasks()
    {
        $this->settings['menu_info'] = array_sum($this->selectedMasks);
    }

    public function updatedLowLevel()
    {
        $this->settings['low_level'] = Glucose::convertToRaw($this->low_level);
    }

    public function updatedHighLevel()
    {
        $this->settings['high_level'] = Glucose::convertToRaw($this->high_level);
    }

    public function save()
    {
        $this->validate();

        $this->settings['calory_limit'] = $this->calory_limit;
        $this->settings['round_to'] = $this->selectRound;

        $this->settings['use_freq'] = (int)$this->use_freq;
        $this->settings['freq_qty'] = $this->freq_qty;
        $this->settings['filter_off'] = $this->filter_off;

        Log::info('On saving', [$this->settings]);
        Auth::user()->putSetting('User', $this->settings);
        session()->flash('notification', 'Settings saved');
    }

    public function setSection($sectionName)
    {
        $available = [
            self::MENU, self::GLUCOSE, self::PRODUCTS
        ];

        if (in_array($sectionName, $available)) {
            Log::info('Yes, I set section');
            $this->section = $sectionName;
        }
    }

    #[On('fill-confirmed')]
    public function fillConfirmed()
    {
        //clear all current products and fill with json DB
        Log::info('Let us clear and fill');
    }
};
