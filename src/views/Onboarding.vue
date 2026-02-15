<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center p-10 text-center bg-white">
    <!-- Main Content -->
    <div class="max-w-2xl w-full fade-in" v-if="!loading">
      <div class="bg-primary mx-auto w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-transform hover:scale-105 shadow-xl shadow-primary/5">
        <Sparkles class="text-accent w-8 h-8" />
      </div>
      <h2 class="text-5xl font-black text-primary mb-6 leading-tight tracking-tighter" v-html="$t('onboarding.title')"></h2>
      <p class="text-secondary text-sm mb-12 max-w-md mx-auto font-medium leading-relaxed">
        {{ $t('onboarding.subtitle') }}
      </p>

      <!-- Category Selector (New Addition) -->
      <div class="flex flex-wrap justify-center gap-3 mb-10">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="selectedCategory = cat"
          class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
          :class="selectedCategory === cat ? 'bg-primary text-accent border-primary shadow-lg' : 'bg-secondary/5 text-secondary border-[#ACB4C4]/15 hover:border-primary/20'"
        >
          {{ $t(`categories.${cat}`) }}
        </button>
      </div>

      <div class="relative w-full max-w-lg mx-auto group">
        <div class="absolute -inset-1.5 bg-primary/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <div class="relative flex items-center gap-4">
          <input 
            v-model="topic" 
            @keyup.enter="handleGenerate"
            type="text" 
            required
            class="input-field shadow-lg !py-5 !px-8 !text-base !rounded-[1.25rem] border-primary/5"
            :placeholder="$t('onboarding.placeholder')"
          />
          <button 
            @click="handleGenerate"
            :disabled="loading || !topic.trim()"
            class="btn-primary !px-10 !py-5 !text-sm !rounded-[1.25rem] whitespace-nowrap shadow-lg"
          >
            {{ $t('onboarding.btn') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Scaled Pro Loader -->
    <Transition name="overlay">
      <div v-if="loading" class="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-12">
        <div class="relative mb-12 scale-100">
          <div class="w-28 h-28 border-[6px] border-primary/5 rounded-full"></div>
          <div class="absolute inset-0 w-28 h-28 border-[6px] border-accent rounded-full border-t-transparent animate-[spin_1.5s_linear_infinite]"></div>
          <div class="absolute inset-3 w-22 h-22 border-[6px] border-primary rounded-full border-b-transparent animate-[spin_2s_linear_infinite_reverse]"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <Cpu class="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>
        
        <div class="text-center space-y-3 max-w-sm">
          <h3 class="text-3xl font-black text-primary tracking-tighter animate-pulse">
            {{ $t('onboarding.waiting') }}
          </h3>
          <p class="text-secondary font-bold text-xs tracking-tight">
            {{ $t('onboarding.creating') }} <br />
            <span class="text-primary italic text-base">"{{ topic }}"</span>
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCourseStore } from '@/stores/course';
import { useAuthStore } from '@/stores/auth';
import { generateCourse } from '@/services/ai';
import { Sparkles, Cpu } from 'lucide-vue-next';

const { t, locale } = useI18n();
const topic = ref('');
const loading = ref(false);
const selectedCategory = ref('Programming');
const courseStore = useCourseStore();
const authStore = useAuthStore();
const router = useRouter();

const categories = ['Programming', 'Design', 'Languages', 'Business', 'Art'];

const handleGenerate = async () => {
  if (!topic.value.trim() || loading.value) return;
  
  loading.value = true;
  try {
    const course = await generateCourse(topic.value, locale.value);
    
    // Enrich course with metadata
    course.id = Date.now().toString();
    course.category = selectedCategory.value;
    course.created_at = new Date().toISOString();
    course.completed_steps = [];
    course.progress = 0;

    if (course.info_notif) {
      alert(course.info_notif);
    }
    
    // Add to multi-course collection
    courseStore.addCourse(course);
    // Set as active
    courseStore.setCourse(course);
    
    if (authStore.user?.is_new) {
      await authStore.updateUser({ is_new: false });
    }
    
    router.push('/dashboard');
  } catch (e) {
    console.error(e);
    alert('AI is busy, please wait 10 seconds');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
