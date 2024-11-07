<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useCourseManagement } from '@/composables/use-course-management';
import { useStudentDetails } from '@/composables/use-student-details';
import { useStudents } from '@/composables/use-students';

import Button from '@/components/shared/Button.vue';
import DocumentPreviewModal from '@/components/shared/DocumentPreviewModal.vue';
import StudentChart from '@/components/general/StudentChart.vue';
import StudentInfo from '@/components/general/StudentInfo.vue';
import { formatDate } from '@/utils/date-utils';

const route = useRoute();
const router = useRouter();
const { getStudentById, isLoading, error } = useStudents();

const {
  student,
  showPdfModal,
  pdfUrl,
  pdfTitle,
  hasPassedQuiz,
  handleGenerateTranscript,
  handleGenerateConfirmation,
  handleDownload
} = useStudentDetails();

const {
  activeDropdownCourse,
  dropdownRefs,
  handleClickOutside,
  toggleDropdown,
  toggleCourseExpansion,
  isCourseExpanded,
  uniqueCourses
} = useCourseManagement(student);

const handleReturnToDashboard = () => {
  router.push('/dashboard');
};

onMounted(async () => {
  const studentId = parseInt(route.params.id as string, 10);
  student.value = await getStudentById(studentId);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="container mx-auto px-4 pb-8">
        <div class="mb-6 flex justify-between items-center">
            <Button 
                showIcon="return"
                iconPosition="left"
                buttonClass="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center transition duration-300 ease-in-out"
                @click="handleReturnToDashboard"
            >
                Return to Dashboard
            </Button>
        </div>

        <div v-if="isLoading">Loading...</div>
        <div v-else-if="error">Error: {{ error }}</div>
        <div v-else-if="student">
            <h1 class="text-3xl font-bold mb-6">{{ student.display_name }}</h1>

            <StudentInfo :student="student" />

            <div class="mb-8">
                <h2 class="text-2xl font-bold mb-4">Score Breakdown</h2>

                <div v-if="student.quizAttempts.length === 0" class="text-gray-500">No quiz attempts found</div>
                <StudentChart v-else :quizAttempts="student.quizAttempts" />
            </div>

            <div class="mb-8">
                <h2 class="text-2xl font-bold mb-4">Courses</h2>
                <div v-for="course in uniqueCourses" :key="course.title"
                    class="bg-white shadow rounded-lg mb-4">
                    <div class="p-4">
                        <div class="flex justify-between items-center">
                            <div class="flex-1 flex items-center cursor-pointer" @click="toggleCourseExpansion(course.title)">
                                <h3 class="text-lg font-semibold">{{ course.title }}</h3>
                                <svg 
                                    class="w-5 h-5 ml-2 transform transition-transform duration-200"
                                    :class="{ 'rotate-180': isCourseExpanded(course.title) }"
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                >
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="relative">
                                <button @click="(event) => toggleDropdown(course.title, event)"
                                        class="p-1 hover:bg-gray-100 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </button>
                                <div :ref="el => { if (el) dropdownRefs.set(course.title, el) }"
                                     v-show="activeDropdownCourse === course.title"
                                     class="absolute right-8 -top-2 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-10 border">
                                    <div class="relative group">
                                        <button 
                                            @click="handleGenerateConfirmation(course.id)" 
                                            :disabled="!hasPassedQuiz(course.id)"
                                            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50 flex items-center justify-between"
                                        >
                                            <span>Generate Confirmation</span>
                                            <svg v-if="!hasPassedQuiz(course.id)" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                class="h-5 w-5 text-yellow-500" 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor"
                                            >
                                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                            </svg>
                                            <div v-if="!hasPassedQuiz(course.id)" 
                                                class="invisible group-hover:visible absolute right-0 top-0 mt-8 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10"
                                            >
                                                Student must pass the quiz with a score of 50% or higher
                                            </div>
                                        </button>
                                    </div>
                                    
                                    <div class="relative group">
                                        <button 
                                            @click="handleGenerateTranscript(course.id)"
                                            :disabled="!hasPassedQuiz(course.id)"
                                            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50 flex items-center justify-between"
                                        >
                                            <span>Generate Transcript</span>
                                            <svg v-if="!hasPassedQuiz(course.id)" 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                class="h-5 w-5 text-yellow-500" 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor"
                                            >
                                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                            </svg>
                                            <div v-if="!hasPassedQuiz(course.id)" 
                                                class="invisible group-hover:visible absolute right-0 top-0 mt-8 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10"
                                            >
                                                Student must pass the quiz with a score of 50% or higher
                                            </div>
                                        </button>
                                    </div>
                                    
                                    <button @click="router.push(`/students/${student.ID}/invoice-editor?course_id=${course.id}&mode=editor`)"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        Create Invoice
                                    </button>
                                    <button @click="router.push(`/students/${student.ID}/invoice-editor?course_id=${course.id}&mode=history`)"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        Invoice History
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Quiz Attempts Section -->
                        <div v-if="isCourseExpanded(course.title)" 
                             class="mt-4 border-t pt-4 transition-all duration-300 ease-in-out overflow-hidden"
                             v-show="isCourseExpanded(course.title)"
                        >
                            <div v-for="attempt in course.attempts" :key="attempt.attempt_id"
                                class="bg-gray-50 p-4 rounded-lg mb-2">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-sm font-bold text-gray-500">Quiz Title</p>
                                        <p class="text-sm text-gray-900">{{ attempt.quiz_title }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-500">Score</p>
                                        <div class="flex items-center gap-2">
                                            <p v-if="attempt.attempt_status === 'attempt_ended'" class="text-sm text-gray-900">
                                                {{ attempt.earned_marks }}/{{ attempt.total_marks }}
                                            </p>
                                            <p v-else class="text-sm text-gray-900">No attempt made yet</p>
                                            
                                            <!-- Status Pill -->
                                            <span v-if="attempt.attempt_status !== 'attempt_ended'"
                                                class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-300">
                                                Pending
                                            </span>
                                            <span v-else-if="(Number(attempt.earned_marks) / Number(attempt.total_marks)) >= 0.5"
                                                class="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 border border-green-300">
                                                Pass
                                            </span>
                                            <span v-else
                                                class="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 border border-red-300">
                                                Fail
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-500">Status</p>
                                        <p class="text-sm text-gray-900">{{ attempt.attempt_status }}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-500">Date</p>
                                        <p class="text-sm text-gray-900">{{ formatDate(attempt.attempt_ended_at) }}</p>
                                    </div>
                                </div>
                            </div>
                            <div v-if="course.attempts.length === 0" class="text-gray-500 text-sm">
                                No quiz attempts for this course
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="uniqueCourses.length === 0" class="text-gray-500">No courses found</div>
            </div>

            <div class="flex space-x-4">
                <Button 
                    showIcon="return"
                    iconPosition="left"
                    buttonClass="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center transition duration-300 ease-in-out"
                    @click="handleReturnToDashboard"
                >
                    Return to Dashboard
                </Button>
            </div>
        </div>
        <div v-else>Student not found</div>
    </div>

    <!-- PDF Modal -->
    <DocumentPreviewModal
      :is-open="showPdfModal"
      :pdf-url="pdfUrl"
      :title="pdfTitle"
      @close="showPdfModal = false"
      @download="handleDownload"
    />
</template>

<style scoped>
.container {
    max-width: 100%;
}
</style>
