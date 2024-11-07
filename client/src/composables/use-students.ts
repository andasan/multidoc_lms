import { ref, onMounted, computed } from 'vue';
import { fetchStudents, fetchStudentById } from '@/services/api';

import { Student } from '@/types/student.types';
import { QuizAttempt } from '@/types/quiz.types';

export function useStudents() {
  const students = ref<Student[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadStudents = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      students.value = await fetchStudents();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading.value = false;
    }
  };

  const getStudentById = async (id: number): Promise<Student | null> => {
    isLoading.value = true;
    error.value = null;
    try {
      const student = await fetchStudentById(id);
      return student;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getLatestQuizAttempt = async (studentId: number): Promise<QuizAttempt | null> => {
    const student = await getStudentById(studentId);
    if (student && student.quizAttempts.length > 0) {
      return student.quizAttempts.reduce((latest, current) => 
        new Date(current.attempt_ended_at) > new Date(latest.attempt_ended_at) ? current : latest
      );
    }
    return null;
  };

  const studentsWithQuizAttempts = computed((): Student[] => {
    return students.value.filter(student => student.quizAttempts.length > 0);
  });

  onMounted(loadStudents);

  return {
    students,
    isLoading,
    error,
    loadStudents,
    getStudentById,
    getLatestQuizAttempt,
    studentsWithQuizAttempts,
  };
}
