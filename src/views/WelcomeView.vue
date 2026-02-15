<template>
  <div class="min-h-screen bg-white overflow-hidden max-w-full relative flex flex-col items-center justify-center px-10 py-16 text-center">
    <!-- Language Switcher (Welcome Page) -->
    <div class="fixed top-10 right-10 z-50 flex items-center bg-white/60 backdrop-blur-md rounded-2xl px-3 py-1.5 gap-1.5 border border-[#ACB4C4]/20 shadow-sm">
      <button 
        v-for="lang in ['EN', 'RU', 'UZ']" 
        :key="lang"
        @click="changeLocale(lang.toLowerCase())"
        class="px-4 py-1.5 text-[11px] font-black uppercase rounded-xl transition-all cursor-pointer"
        :class="locale.toUpperCase() === lang ? 'bg-primary text-accent shadow-sm' : 'text-secondary hover:text-primary'"
      >
        {{ lang }}
      </button>
    </div>

    <!-- Floating Background Elements (Pointer Events None) -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div 
        v-for="(skill, index) in floatingSkills" 
        :key="index"
        class="absolute bg-white/60 backdrop-blur-md px-8 py-3.5 rounded-full border border-[#ACB4C4]/25 shadow-sm animate-float whitespace-nowrap pointer-events-none"
        :style="skill.style"
      >
        <span class="text-primary font-bold text-xs tracking-tight opacity-50">{{ $t(`welcome.skills.${skill.id}`) }}</span>
      </div>
    </div>

    <!-- Hero Content -->
    <div class="max-w-3xl w-full z-10 relative fade-in">
      <div class="mb-8 inline-flex items-center gap-3 bg-primary/5 px-5 py-2 rounded-2xl border border-primary/10">
        <Sparkles class="w-5 h-5 text-primary" />
        <span class="text-primary text-[10px] font-black uppercase tracking-widest">Powered by Console Groq</span>
      </div>
      
      <h1 class="text-6xl md:text-7xl font-black text-primary leading-[1] tracking-tighter mb-8" v-html="$t('welcome.title')"></h1>
      
      <p class="text-secondary text-lg mb-12 max-w-xl mx-auto font-medium leading-relaxed">
        {{ $t('welcome.subtitle') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
        <router-link 
          :to="auth.isLoggedIn ? '/dashboard' : '/register'"
          class="btn-primary !py-5 !px-16 !text-lg !rounded-2xl shadow-xl hover:shadow-primary/10"
        >
          {{ auth.isLoggedIn ? $t('welcome.cabinet') : $t('welcome.cta') }}
        </router-link>
        
        <router-link 
          v-if="!auth.isLoggedIn"
          to="/login"
          class="bg-white/80 backdrop-blur-md text-primary px-16 py-5 rounded-2xl font-black text-lg border border-[#ACB4C4]/25 hover:bg-white transition-all duration-300 shadow-sm"
        >
          {{ $t('common.login') }}
        </router-link>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-[#ACB4C4]/20 pt-12">
        <div class="flex flex-col items-center gap-3">
          <div class="bg-primary/5 p-4 rounded-2xl">
            <Layers class="w-6 h-6 text-primary" />
          </div>
          <div class="text-2xl font-black text-primary">{{ $t('welcome.steps') }}</div>
          <div class="text-secondary font-bold text-[10px] uppercase tracking-widest">{{ $t('welcome.curriculum') }}</div>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div class="bg-primary/5 p-4 rounded-2xl">
            <Cpu class="w-6 h-6 text-primary" />
          </div>
          <div class="text-2xl font-black text-primary">Groq</div>
          <div class="text-secondary font-bold text-[10px] uppercase tracking-widest">{{ $t('welcome.mentor') }}</div>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div class="bg-primary/5 p-4 rounded-2xl">
            <Globe class="w-6 h-6 text-primary" />
          </div>
          <div class="text-2xl font-black text-primary">{{ $t('welcome.limitless_stat') }}</div>
          <div class="text-secondary font-bold text-[10px] uppercase tracking-widest">{{ $t('welcome.limitless') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import { Sparkles, Layers, Cpu, Globe } from 'lucide-vue-next';

const auth = useAuthStore();
const { locale } = useI18n();

const changeLocale = (lang) => {
  locale.value = lang;
  localStorage.setItem('locale', lang);
};

const floatingSkills = [
  { id: 'python', style: 'top: 15%; left: 8%; animation-delay: 0s;' },
  { id: 'design', style: 'top: 20%; right: 10%; animation-delay: 1s;' },
  { id: 'marketing', style: 'bottom: 25%; left: 12%; animation-delay: 2s;' },
  { id: 'photography', style: 'bottom: 35%; right: 8%; animation-delay: 1.5s;' },
  { id: 'cooking', style: 'top: 45%; left: 5%; animation-delay: 0.5s;' },
  { id: 'chess', style: 'top: 35%; right: 5%; animation-delay: 2.5s;' },
];
</script>
