@props([
    'active',
    'header',
    'prefix'
    ])

@php
    $prefix = $prefix ?? 'menu';
    $classes = "tab-pane $prefix-panes__pane" . (($active ?? false) ? ' active' : '');
@endphp

<div {{ $attributes->merge(['class' => $classes]) }}>
    <div class="{{ $prefix }}-panes__pane_header">{{ $header }}</div>

    <div class="{{ $prefix }}-panes__pane_content">
        {{ $slot }}
    </div>
</div>
