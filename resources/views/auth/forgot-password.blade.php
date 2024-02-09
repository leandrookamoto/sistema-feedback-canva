<x-guest-layout>
    <x-authentication-card>
        <x-slot name="logo">
            <img src='../img/global_hitss_logo.png' style='height: 80px;'/>
        </x-slot>

        <div class="mb-4 text-sm text-gray-600">
            {{ __('Esqueceu sua senha? Sem problemas. Basta nos informar seu endereço de e-mail e enviaremos por e-mail um link de redefinição de senha que permitirá que você escolha uma nova.') }}
        </div>

        @if (session('status'))
            <div class="mb-4 font-medium text-sm text-green-600">
                {{ session('status') }}
            </div>
        @endif

        <x-validation-errors class="mb-4" />

        <form method="POST" action="{{ route('password.email') }}">
            @csrf

            <div class="block">
                <x-label for="email" value="{{ __('Email') }}" />
                <x-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
            </div>

            

            <div class="flex items-center justify-end mt-4">
            <span style='margin-right: 20px'>
                        <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('home') }}">
                                {{ __('Voltar') }}
                        </a>
            </span>
                <x-button>
                    {{ __('Link de redefinição de senha de e-mail') }}
                </x-button>
            </div>
        </form>
    </x-authentication-card>
</x-guest-layout>
