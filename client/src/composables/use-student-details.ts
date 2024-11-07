import { ref, computed } from 'vue';
import { generateTranscript } from '@/lib/pdf-generator/transcript';
import { generateConfirmation } from '@/lib/pdf-generator/confirmation';

import { Student } from '@/types/student.types';

export function useStudentDetails() {
  const student = ref<Student | null>(null);
  const showPdfModal = ref(false);
  const pdfUrl = ref('');
  const pdfTitle = ref('');

  const hasPassedQuiz = computed(() => (courseId: number) => {
    if (!student.value) return false;
    const attempt = student.value.quizAttempts.find(attempt => attempt.course_id === courseId);
    if (!attempt) return false;
    const percentage = (Number(attempt.earned_marks) / Number(attempt.total_marks)) * 100;
    return percentage >= 50 && attempt.attempt_status === 'attempt_ended';
  });

  const handleGenerateTranscript = async (courseId: number) => {
    if (student.value) {
      pdfTitle.value = 'Transcript';
      const pdfBlob = await generateTranscript(student.value, courseId);
      pdfUrl.value = URL.createObjectURL(pdfBlob);
      showPdfModal.value = true;
    }
  };

  const handleGenerateConfirmation = async (courseId: number) => {
    if (student.value && hasPassedQuiz.value(courseId)) {
      pdfTitle.value = 'Confirmation';

      const programTitle = student.value.quizAttempts.find(course => course.course_id === courseId)?.course_title;
      
      if (!programTitle) {
        throw new Error('Program title not found');
      }

      const pdfBlob = await generateConfirmation(student.value, courseId, programTitle);
      pdfUrl.value = URL.createObjectURL(pdfBlob);
      showPdfModal.value = true;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl.value;
    link.download = `${pdfTitle.value}-${student.value?.display_name}.pdf`;
    link.click();
  };

  return {
    student,
    showPdfModal,
    pdfUrl,
    pdfTitle,
    hasPassedQuiz,
    handleGenerateTranscript,
    handleGenerateConfirmation,
    handleDownload
  };
}