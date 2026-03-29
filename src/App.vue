<template>
  <Analytics />
  <div class="min-h-screen bg-white selection:bg-accent/30 text-[#30364F] overflow-x-hidden">
    <!-- Navbar (Responsive Readable Pro) -->
    <header v-if="auth.isLoggedIn" class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ACB4C4]/15 px-4 md:px-6 py-3 transition-all">
      <div class="max-w-[1400px] mx-auto flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/dashboard" class="flex items-center gap-2.5 group">
          <div class="bg-primary p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/5">
            <Zap class="text-accent w-5 h-5" />
          </div>
          <h1 class="text-xl font-black tracking-tight text-primary uppercase italic">Skillswap</h1>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-8">
          <nav class="flex items-center gap-6 border-r border-[#ACB4C4]/20 pr-8">
            <router-link to="/dashboard" class="text-[11px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">{{ $t('common.dashboard') }}</router-link>
            <router-link to="/profile" class="text-[11px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">{{ $t('common.profile') }}</router-link>
          </nav>

          <!-- Language Switcher -->
          <div class="flex items-center bg-secondary/5 rounded-2xl px-2 py-1.5 gap-1.5 border border-[#ACB4C4]/20">
            <button 
              v-for="lang in ['EN', 'RU', 'UZ']" 
              :key="lang"
              @click="changeLocale(lang.toLowerCase())"
              class="text-[10px] font-black transition-all px-3 py-1 rounded-xl"
              :class="locale.toUpperCase() === lang ? 'bg-primary text-accent shadow-md' : 'text-secondary/60 hover:text-primary'"
            >
              {{ lang }}
            </button>
          </div>

          <!-- User Profile -->
          <div class="flex items-center gap-4">
            <router-link to="/profile" class="flex items-center gap-3 group">
              <div class="text-right hidden sm:block">
                <div class="text-xs font-black leading-tight">{{ auth.user?.name }}</div>
                <div class="text-[9px] text-secondary font-bold uppercase tracking-tighter">{{ $t('profile.pro_learner') }}</div>
              </div>
              <div class="w-10 h-10 rounded-[1rem] bg-accent/20 border border-accent/40 flex items-center justify-center text-xs font-black text-primary group-hover:scale-105 transition-transform">
                {{ auth.user?.name?.[0] }}
              </div>
            </router-link>
            
            <button 
              @click="handleLogout" 
              class="p-2.5 hover:bg-red-50 rounded-2xl text-secondary hover:text-red-500 transition-colors"
              :title="$t('common.logout')"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Mobile Menu Toggles -->
        <div class="flex lg:hidden items-center gap-2">
          <div class="flex items-center bg-secondary/5 rounded-2xl px-1.5 py-1 gap-1 border border-[#ACB4C4]/15 mr-2">
            <button 
              v-for="lang in ['EN', 'RU', 'UZ']" 
              :key="lang"
              @click="changeLocale(lang.toLowerCase())"
              class="text-[8px] font-black transition-all px-2 py-0.5 rounded-lg"
              :class="locale.toUpperCase() === lang ? 'bg-primary text-accent shadow-sm' : 'text-secondary/60'"
            >
              {{ lang }}
            </button>
          </div>
          <button @click="isMenuOpen = !isMenuOpen" class="p-2 text-primary bg-secondary/5 rounded-xl border border-[#ACB4C4]/15">
            <Menu v-if="!isMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <transition 
        enter-active-class="transition duration-200 ease-out" 
        enter-from-class="transform -translate-y-4 opacity-0" 
        enter-to-class="transform translate-y-0 opacity-100" 
        leave-active-class="transition duration-150 ease-in" 
        leave-from-class="transform translate-y-0 opacity-100" 
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="isMenuOpen" class="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-[#ACB4C4]/15 shadow-xl p-6 space-y-4 z-[100]">
          <router-link @click="isMenuOpen = false" to="/dashboard" class="flex items-center gap-3 p-4 bg-secondary/5 rounded-2xl text-sm font-black text-primary">
            <LayoutDashboard class="w-5 h-5" /> {{ $t('common.dashboard') }}
          </router-link>
          <router-link @click="isMenuOpen = false" to="/profile" class="flex items-center gap-3 p-4 bg-secondary/5 rounded-2xl text-sm font-black text-primary">
            <User class="w-5 h-5" /> {{ $t('common.profile') }}
          </router-link>
          <button @click="handleLogout" class="flex items-center gap-3 p-4 w-full bg-red-50 rounded-2xl text-sm font-black text-red-500">
            <LogOut class="w-5 h-5" /> {{ $t('common.logout') }}
          </button>
        </div>
      </transition>
    </header>

    <main :class="{ 'max-w-[1400px] mx-auto p-4 md:p-10': auth.isLoggedIn }" class="bg-white">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Analytics } from '@vercel/analytics/vue';
import { Zap, LogOut, Menu, X, LayoutDashboard, User } from 'lucide-vue-next';

const auth = useAuthStore();
const router = useRouter();
const { locale } = useI18n();
const isMenuOpen = ref(false);

const changeLocale = (lang) => {
  locale.value = lang;
  localStorage.setItem('locale', lang);
};

const handleLogout = () => {
  isMenuOpen.value = false;
  auth.logout();
  router.push('/');
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
