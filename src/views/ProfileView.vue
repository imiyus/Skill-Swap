<template>
  <div class="fade-in max-w-5xl mx-auto space-y-16 pb-24 bg-white">
    <!-- Profile Header -->
    <div class="flex flex-col md:flex-row items-center gap-10 bg-white p-14 rounded-[3rem] border border-[#ACB4C4]/25 shadow-sm transition-all hover:shadow-md">
      <div class="w-24 h-24 rounded-3xl bg-accent/20 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-primary relative shrink-0">
        {{ auth.user?.name?.[0] }}
        <div class="absolute -bottom-2 -right-2 bg-primary text-accent p-2.5 rounded-xl border-4 border-white shadow-lg">
          <Trophy class="w-5 h-5" />
        </div>
      </div>
      
      <div class="text-center md:text-left flex-1">
        <h1 class="text-4xl font-black text-primary tracking-tight leading-tight">{{ auth.user?.name }}</h1>
        <p class="text-secondary font-bold text-base mt-2 leading-none">{{ auth.user?.email }}</p>
        
        <div class="flex flex-wrap justify-center md:justify-start gap-5 mt-8">
          <div class="bg-secondary/5 px-6 py-3 rounded-2xl border border-[#ACB4C4]/15 flex items-center gap-3">
            <Zap class="w-5 h-5 text-primary" />
            <span class="text-xs font-black uppercase text-primary tracking-widest">{{ $t('profile.stat_xp', { xp: auth.user?.xp || 0 }) }}</span>
          </div>
          <div class="bg-secondary/5 px-6 py-3 rounded-2xl border border-[#ACB4C4]/15 flex items-center gap-3">
            <Target class="w-5 h-5 text-primary" />
            <span class="text-xs font-black uppercase text-primary tracking-widest">{{ $t('profile.stat_courses', { count: completedCoursesCount }) }}</span>
          </div>
        </div>
      </div>

      <button @click="auth.logout(); router.push('/')" class="btn-primary !bg-red-50 !text-red-500 !border-red-100 shadow-none hover:!bg-red-500 hover:!text-white !py-3 !px-10 !text-xs !rounded-2xl">
        {{ $t('profile.logout_btn') }}
      </button>
    </div>

    <!-- Achievements Section -->
    <div class="space-y-10">
      <div class="flex items-center justify-between px-2">
        <h2 class="text-3xl font-black text-primary tracking-tight">{{ $t('profile.achievements') }}</h2>
        <span class="text-[12px] font-black uppercase tracking-widest text-secondary">{{ earnedBadges.length }}/{{ allBadges.length }}</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div 
          v-for="badge in allBadges" 
          :key="badge.id"
          class="card-saas !p-10 flex flex-col items-center text-center group bg-white border-[#ACB4C4]/20"
          :class="isEarned(badge.id) ? 'opacity-100' : 'opacity-30 grayscale'"
        >
          <div :class="isEarned(badge.id) ? 'bg-accent/20' : 'bg-secondary/5'" 
               class="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
            <component :is="badge.icon" :class="isEarned(badge.id) ? 'text-primary' : 'text-secondary'" class="w-10 h-10" />
          </div>
          <h4 class="text-base font-black text-primary leading-tight">{{ $t(`badges.${badge.id}.name`) }}</h4>
          <p class="text-[11px] text-secondary font-medium mt-3 leading-tight">{{ $t(`badges.${badge.id}.desc`) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/course';
import { useRouter } from 'vue-router';
import { 
  Trophy, Zap, Target, Scale, 
  MapPin, Rocket, Award, Shield, Sparkles 
} from 'lucide-vue-next';

const auth = useAuthStore();
const courseStore = useCourseStore();
const router = useRouter();

const allBadges = [
  { id: 'first_step', icon: MapPin },
  { id: 'ai_master', icon: Sparkles },
  { id: 'streak_7', icon: Zap },
  { id: 'finisher', icon: Rocket },
  { id: 'expert', icon: Award },
  { id: 'defender', icon: Shield },
  { id: 'legal', icon: Scale },
];

const completedCoursesCount = computed(() => {
  return courseStore.user_courses.filter(c => c.progress === 100).length;
});

const earnedBadges = computed(() => auth.user?.achievements || []);

const isEarned = (badgeId) => earnedBadges.value.includes(badgeId);
</script>
