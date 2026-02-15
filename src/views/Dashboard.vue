<template>
  <div class="fade-in max-w-6xl mx-auto space-y-12 bg-white pb-16">
    
    <!-- Top Bar: Title & New Course -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-1">
        <h1 class="text-4xl font-black text-primary tracking-tight">{{ $t('common.dashboard') }}</h1>
        <p class="text-secondary font-bold text-sm">{{ $t('profile.pro_learner') }} / Skills Hub</p>
      </div>
      
      <button 
        @click="router.push('/onboarding')"
        class="btn-primary flex items-center justify-center gap-3 !px-10 !py-4 shadow-xl"
      >
        <Plus class="w-5 h-5" /> {{ $t('dashboard.create_btn') }}
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col md:flex-row gap-6">
      <div class="relative group md:flex-[2]">
        <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search courses..."
          class="input-field !pl-16 !py-4 !rounded-2xl !bg-secondary/5 border-transparent focus:!bg-white focus:border-primary/20 shadow-sm"
        />
      </div>
      
      <select 
        v-model="selectedCategory"
        class="input-field md:flex-1 !py-4 !rounded-2xl !bg-secondary/5 border-transparent focus:!bg-white focus:border-primary/20 shadow-sm font-bold text-primary"
      >
        <option value="All">{{ $t('categories.All') }}</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ $t(`categories.${cat}`) }}</option>
      </select>
    </div>

    <!-- Course Grid -->
    <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div 
        v-for="course in filteredCourses" 
        :key="course.id"
        class="card-saas group flex flex-col h-full !p-0 overflow-hidden hover:shadow-2xl transition-all border border-[#ACB4C4]/15 hover:-translate-y-2 cursor-pointer"
        @click="openCourse(course)"
      >
        <!-- Preview Placeholder/Image -->
        <div class="h-44 bg-primary/5 p-8 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-10 bg-gradient-to-tr from-primary to-accent"></div>
          <div class="bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-lg z-10">
            <BookOpen class="w-10 h-10 text-primary" />
          </div>
          <div class="absolute bottom-4 left-6 bg-primary text-accent text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-10">
            {{ $t(`categories.${course.category}`) }}
          </div>
          <!-- Percentage Label -->
          <div class="absolute top-4 right-6 bg-white/80 backdrop-blur-sm text-primary text-[10px] font-black px-3 py-1.5 rounded-xl border border-primary/5 z-10">
            {{ course.progress || 0 }}%
          </div>
        </div>

        <div class="p-8 flex-1 flex flex-col space-y-4">
          <h3 class="text-xl font-black text-primary leading-tight group-hover:text-primary/80 transition-colors line-clamp-2">
            {{ course.title }}
          </h3>
          <p class="text-xs text-secondary font-medium leading-relaxed line-clamp-3">
            {{ course.description }}
          </p>

          <div class="pt-6 mt-auto space-y-4">
            <!-- Progress Bar -->
            <div class="space-y-2">
              <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-secondary/60">
                <span>Progress</span>
                <span>{{ course.completed_steps?.length || 0 }} / {{ course.steps?.length || 0 }} Steps</span>
              </div>
              <div class="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary rounded-full transition-all duration-1000"
                  :style="{ width: `${course.progress || 0}%` }"
                ></div>
              </div>
            </div>

            <button class="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all pt-2">
              {{ course.progress === 100 ? 'Review Course' : 'Continue Learning' }} 
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-40 text-center space-y-8 fade-in">
      <div class="bg-primary/5 p-12 rounded-[3.5rem] border border-dashed border-[#ACB4C4]/30">
        <Sparkles class="w-20 h-20 text-secondary/40 animate-pulse" />
      </div>
      <div class="space-y-3">
        <h3 class="text-3xl font-black text-primary">{{ searchQuery ? 'No matches found' : 'Your Hub is Empty' }}</h3>
        <p class="text-secondary font-medium max-w-sm mx-auto leading-relaxed">
          {{ searchQuery ? "Try adjusting your search or filters to find what you're looking for." : "Start your learning journey by generating your first AI-powered course today." }}
        </p>
      </div>
      <button 
        v-if="!searchQuery"
        @click="router.push('/onboarding')" 
        class="btn-primary !px-12 !py-5 shadow-2xl"
      >
        <Plus class="w-5 h-5" /> Generate First Course
      </button>
      <button 
        v-else
        @click="searchQuery = ''; selectedCategory = 'All'" 
        class="text-primary font-black uppercase text-[10px] tracking-widest"
      >
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCourseStore } from '@/stores/course';
import { useRouter } from 'vue-router';
import { Plus, Search, BookOpen, ChevronRight, Sparkles } from 'lucide-vue-next';

const courseStore = useCourseStore();
const router = useRouter();

const searchQuery = ref('');
const selectedCategory = ref('All');
const categories = ['Programming', 'Design', 'Languages', 'Business', 'Art'];

const filteredCourses = computed(() => {
  return courseStore.user_courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'All' || course.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

const openCourse = (course) => {
  courseStore.setCourse(course);
  router.push('/course');
};
</script>
