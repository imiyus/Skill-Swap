<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-white overflow-hidden">
    <div class="w-full max-w-md bg-white card-glass p-14 fade-in border border-[#ACB4C4]/20 shadow-2xl rounded-[3rem]">
      <div class="flex flex-col items-center mb-10 text-center">
        <div class="bg-primary p-4 rounded-2xl mb-6 shadow-xl shadow-primary/5">
          <LogIn class="text-accent w-7 h-7" />
        </div>
        <h2 class="text-3xl font-black text-primary tracking-tight leading-tight">{{ $t('auth.welcome_back') }}</h2>
        <p class="text-secondary mt-2 font-bold text-xs tracking-tight">{{ $t('auth.subtitle_login') }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-3">
          <label class="flex items-center gap-2.5 text-[11px] font-black text-primary/70 ml-1 uppercase tracking-widest">
            <Mail class="w-4 h-4" />
            {{ $t('auth.email') }}
          </label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="input-field shadow-sm !py-4.5 !text-base !rounded-2xl border-primary/5"
            placeholder="name@example.com"
          />
        </div>
        <div class="space-y-3">
          <label class="flex items-center gap-2.5 text-[11px] font-black text-primary/70 ml-1 uppercase tracking-widest">
            <Lock class="w-4 h-4" />
            {{ $t('auth.password') }}
          </label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="input-field shadow-sm !py-4.5 !text-base !rounded-2xl border-primary/5"
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full btn-primary mt-6 flex items-center justify-center gap-3 !py-5 !text-sm !rounded-2xl shadow-xl"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span>{{ loading ? $t('common.loading') : $t('auth.sign_in') }}</span>
        </button>
      </form>

      <div class="relative mt-12 mb-8">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-[#ACB4C4]/20"></div></div>
        <div class="relative flex justify-center text-[10px] uppercase"><span class="bg-white px-4 py-1.5 rounded-full text-secondary font-black tracking-widest border border-[#ACB4C4]/20 shadow-sm">{{ $t('auth.no_account') }}</span></div>
      </div>

      <p class="text-center text-sm font-black text-secondary">
        {{ $t('auth.no_account') }} 
        <router-link to="/register" class="text-primary hover:underline underline-offset-4 decoration-accent decoration-2 ml-1.5">{{ $t('common.register') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-vue-next';

const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push('/dashboard');
  } catch (e) {
    alert('AI is busy, please wait 10 seconds');
  } finally {
    loading.value = false;
  }
};
</script>
