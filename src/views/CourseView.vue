<template>
  <div class="h-auto lg:h-[calc(100vh-68px)] flex bg-white -mt-4 md:-mt-6 -mx-4 md:-mx-6 relative overflow-hidden flex-col lg:flex-row">
    
    <!-- Mobile HUD (Header) -->
    <div class="lg:hidden flex items-center justify-between p-4 border-b border-[#ACB4C4]/15 bg-white sticky top-0 z-40">
      <button @click="isStagesOpen = !isStagesOpen" class="flex items-center gap-2 p-2 bg-secondary/5 rounded-xl border border-[#ACB4C4]/10">
        <Map class="w-5 h-5 text-primary" />
        <span class="text-[10px] font-black uppercase tracking-widest text-primary">Stages</span>
      </button>
      
      <button @click="isChatOpen = !isChatOpen" class="flex items-center gap-2 p-2 bg-primary/5 rounded-xl border border-primary/10">
        <Cpu class="w-5 h-5 text-primary" />
        <span class="text-[10px] font-black uppercase tracking-widest text-primary">AI Mentor</span>
      </button>
    </div>

    <!-- Sidebar: Step List (Responsive Drawer) -->
    <aside 
      class="sidebar-nav flex flex-col pt-8 shrink-0 transition-all duration-300 lg:translate-x-0 z-50 bg-white"
      :class="[
        isStagesOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed lg:static top-0 left-0 bottom-0 w-72 lg:w-64 border-r border-[#ACB4C4]/15'
      ]"
    >
      <div class="px-6 mb-8 flex items-center justify-between">
        <h3 class="text-[11px] font-black uppercase tracking-widest text-secondary/60">Route</h3>
        <button @click="isStagesOpen = false" class="lg:hidden p-1.5 bg-secondary/5 rounded-lg">
          <ChevronLeft class="w-4 h-4" />
        </button>
      </div>
      
      <nav class="flex-1 overflow-y-auto px-5 space-y-2">
        <button 
          v-for="(step, index) in course?.steps" 
          :key="step.id"
          @click="selectStep(index)"
          class="w-full flex items-center gap-4 p-3 rounded-2xl transition-all group"
          :class="currentStepIndex === index ? 'bg-primary text-accent shadow-lg' : 'hover:bg-primary/5 text-primary/60'"
        >
          <div class="w-6 h-6 rounded-xl flex items-center justify-center font-black text-[10px] border shrink-0"
               :class="currentStepIndex === index ? 'border-accent/40 bg-accent/20' : 'border-[#ACB4C4]/20 bg-secondary/5 group-hover:border-primary/20'">
            {{ step.id }}
          </div>
          <span class="text-xs font-bold text-left truncate">{{ step.title }}</span>
          <CheckCircle v-if="completedSteps.includes(step.id)" class="w-4 h-4 ml-auto text-green-500" />
        </button>
      </nav>

      <div class="p-6 mt-auto space-y-4">
        <!-- Progress Indicator -->
        <div class="space-y-2 px-1">
          <div class="flex justify-between text-[8px] font-black uppercase tracking-widest text-secondary">
            <span>Progress</span>
            <span>{{ course.progress || 0 }}%</span>
          </div>
          <div class="h-1.5 w-full bg-secondary/10 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-500" :style="{ width: `${course.progress || 0}%` }"></div>
          </div>
        </div>

        <button 
          @click="router.push('/dashboard')"
          class="w-full flex items-center justify-center gap-2.5 p-3 rounded-xl text-secondary hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
        >
          <ChevronLeft class="w-5 h-5" /> {{ $t('course.back_dashboard') }}
        </button>
      </div>
    </aside>

    <!-- Overlay for mobile drawers -->
    <div v-if="isStagesOpen || isChatOpen" @click="closeDrawers" class="lg:hidden fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 transition-opacity"></div>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto p-6 md:p-14 relative flex flex-col bg-white">
      <div v-if="currentStep" class="max-w-3xl mx-auto w-full fade-in space-y-10">
        <div class="flex items-center gap-6">
          <div class="bg-accent/20 p-5 rounded-[2rem]">
            <BookOpen class="w-8 h-8 text-primary" />
          </div>
          <div>
            <div class="text-[10px] font-black uppercase tracking-widest text-secondary mb-1.5">Stage {{ currentStep.id }}</div>
            <h1 class="text-2xl md:text-3xl font-black text-primary tracking-tight leading-tight">{{ currentStep.title }}</h1>
          </div>
        </div>

        <div class="card-saas !p-8 md:!p-12 !bg-white border-[#ACB4C4]/15 shadow-sm leading-relaxed text-base md:text-lg text-primary/80 font-medium whitespace-pre-wrap">
          {{ currentStep.content }}
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
          <button 
            @click="prevStep"
            :disabled="currentStepIndex === 0"
            class="flex items-center gap-2.5 text-secondary hover:text-primary disabled:opacity-0 transition-all font-black uppercase text-[11px] tracking-widest order-2 sm:order-1"
          >
            <ChevronLeft class="w-5 h-5" /> Prev
          </button>
          
          <button 
            v-if="!completedSteps.includes(currentStep.id)"
            @click="markCompleted"
            class="btn-primary flex items-center gap-2.5 !px-8 !py-3.5 !text-[11px] w-full sm:w-auto order-1 sm:order-2"
          >
            {{ $t('course.complete_step') }} <CheckCircle class="w-5 h-5" />
          </button>
          <div v-else class="flex items-center gap-2.5 text-green-500 font-black uppercase text-[11px] tracking-widest order-1 sm:order-2">
            <CheckCircle class="w-5 h-5" /> Step Completed
          </div>

          <button 
            @click="nextStep"
            :disabled="currentStepIndex === course?.steps.length - 1"
            class="flex items-center gap-2.5 text-secondary hover:text-primary disabled:opacity-0 transition-all font-black uppercase text-[11px] tracking-widest order-3"
          >
            Next <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>

    <!-- Right Sidebar: AI Mentor (Responsive Drawer + Exact Persistence) -->
    <aside 
      class="sidebar-chat flex flex-col shrink-0 transition-all duration-300 lg:translate-x-0 z-50 bg-white"
      :class="[
        isChatOpen ? 'translate-x-0' : 'translate-x-full',
        'fixed lg:static top-0 right-0 bottom-0 w-80 lg:w-80 border-l border-[#ACB4C4]/15'
      ]"
    >
      <div class="p-6 border-b border-[#ACB4C4]/10 flex items-center justify-between bg-white/50 backdrop-blur-md">
        <div class="flex items-center gap-4">
          <div class="bg-primary p-2.5 rounded-xl shadow-sm">
            <Cpu class="text-accent w-5 h-5" />
          </div>
          <div>
            <h4 class="text-[11px] font-black text-primary uppercase tracking-widest leading-none">AI Mentor</h4>
            <span class="text-[9px] font-bold text-green-500 uppercase tracking-widest mt-1 block">Live Help</span>
          </div>
        </div>
        <button @click="isChatOpen = false" class="lg:hidden p-1.5 bg-secondary/5 rounded-lg">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Chat History -->
      <div class="flex-1 custom-scroll p-6 space-y-6 flex flex-col" ref="chatContainer">
        <div v-for="(msg, i) in chatHistory" :key="i" 
             :class="msg.role === 'user' ? 'items-end' : 'items-start'"
             class="flex flex-col gap-2.5" 
        >
          <div :class="msg.role === 'user' ? 'bg-primary text-white rounded-2xl rounded-tr-none' : 'bg-secondary/5 text-primary rounded-2xl rounded-tl-none border border-[#ACB4C4]/10'"
               class="px-5 py-4 text-xs font-semibold shadow-sm max-w-[95%] break-words leading-relaxed">
            {{ msg.text }}
            <div v-if="msg.timestamp" class="text-[8px] opacity-40 mt-1 text-right italic">
              {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>
        </div>
        <div v-if="chatLoading" class="flex gap-2 items-center p-3">
          <div class="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="p-6 border-t border-[#ACB4C4]/10 bg-white">
        <div class="relative">
          <input 
            v-model="userQuery" 
            @keyup.enter="handleChat"
            type="text" 
            placeholder="Ask mentor..."
            class="input-field !shadow-none !text-xs !py-3.5 !rounded-2xl border-primary/10"
          />
          <button 
            @click="handleChat"
            :disabled="chatLoading || chatCooldown || !userQuery.trim()"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-all disabled:opacity-20 cursor-pointer"
          >
            <Send v-if="!chatCooldown" class="w-5 h-5" />
            <Loader2 v-else class="w-5 h-5 animate-spin" />
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useCourseStore } from '@/stores/course';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { chatWithMentor } from '@/services/ai';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Cpu, Send, Loader2, Map, X } from 'lucide-vue-next';

const courseStore = useCourseStore();
const authStore = useAuthStore();
const router = useRouter();
const { t, locale } = useI18n();

const course = computed(() => courseStore.currentCourse);
const currentStepIndex = ref(0);
const currentStep = computed(() => course.value?.steps[currentStepIndex.value]);

const completedSteps = computed(() => course.value?.completed_steps || []);
const chatHistory = ref([]);
const userQuery = ref('');
const chatLoading = ref(false);
const chatCooldown = ref(false);
const chatContainer = ref(null);

// Mobile states
const isStagesOpen = ref(false);
const isChatOpen = ref(false);

const closeDrawers = () => {
  isStagesOpen.value = false;
  isChatOpen.value = false;
};

const selectStep = (index) => {
  currentStepIndex.value = index;
  isStagesOpen.value = false;
};

// Rigid Isolation Key
const STORAGE_KEY = computed(() => {
  return `chat_history_${course.value?.id}`;
});

const loadChatHistory = () => {
  if (!course.value?.id) return;
  const saved = localStorage.getItem(STORAGE_KEY.value);
  if (saved) {
    chatHistory.value = JSON.parse(saved);
  } else {
    chatHistory.value = [
      { role: 'ai', text: t('course.chat_intro'), timestamp: new Date() }
    ];
    saveChatHistory();
  }
};

const saveChatHistory = () => {
  if (!course.value?.id) return;
  localStorage.setItem(STORAGE_KEY.value, JSON.stringify(chatHistory.value));
};

// Auto-Scroll
watch(chatHistory, () => {
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

const markCompleted = async () => {
  if (!course.value || !currentStep.value) return;
  
  courseStore.updateProgress(course.value.id, currentStep.value.id);
  
  // Award XP via auth store if not already updated
  if (authStore.user) {
    await authStore.updateUser({ 
      xp: (authStore.user?.xp || 0) + 120
    });
  }
};

const nextStep = () => {
  if (currentStepIndex.value < course.value.steps.length - 1) {
    currentStepIndex.value++;
  }
};

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

const handleChat = async () => {
  if (!userQuery.value.trim() || chatLoading.value || chatCooldown.value) return;

  const query = userQuery.value;
  chatHistory.value.push({ role: 'user', text: query, timestamp: new Date() });
  userQuery.value = '';
  chatLoading.value = true;
  chatCooldown.value = true;
  saveChatHistory();

  setTimeout(() => { chatCooldown.value = false; }, 3000);

  try {
    const response = await chatWithMentor(
      course.value.title,
      currentStep.value.title,
      currentStep.value.content,
      query,
      locale.value
    );
    chatHistory.value.push({ role: 'ai', text: response, timestamp: new Date() });
    saveChatHistory();
  } catch (e) {
    chatHistory.value.push({ role: 'ai', text: 'AI is temporarily unavailable.', timestamp: new Date() });
  } finally {
    chatLoading.value = false;
  }
};

onMounted(() => {
  if (!course.value) {
    router.push('/dashboard');
  } else {
    loadChatHistory();
    scrollToBottom();
  }
});
</script>
