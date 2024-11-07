import { computed, ref, Ref } from 'vue';
import { QuizAttempt } from '@/types/quiz.types';
import { Student } from '@/types/student.types';

interface CourseMapValue {
  id: number;
  title: string;
  attempts: QuizAttempt[];
}

export function useCourseManagement(student: Ref<Student | null>) {
  const courseExpansionState = ref(new Map<string, boolean>());
  const activeDropdownCourse = ref<string | null>(null);
  const dropdownRefs = ref(new Map());

  const closeDropdown = () => {
    activeDropdownCourse.value = null;
  };

  const toggleDropdown = (courseTitle: string, event: Event) => {
    event.stopPropagation();
    activeDropdownCourse.value = activeDropdownCourse.value === courseTitle ? null : courseTitle;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (activeDropdownCourse.value) {
      const activeDropdownRef = dropdownRefs.value.get(activeDropdownCourse.value);
      if (activeDropdownRef && !activeDropdownRef.contains(event.target as Node)) {
        closeDropdown();
      }
    }
  };

  const getUniqueCourses = (student: Student | null) => {
    if (!student?.quizAttempts) return [];
    
    const courseMap = new Map<string, CourseMapValue>();
    student.quizAttempts.forEach(attempt => {
      if (!courseMap.has(attempt.course_title)) {
        courseMap.set(attempt.course_title, {
          id: attempt.course_id,
          title: attempt.course_title,
          attempts: []
        });
      }
      courseMap.get(attempt.course_title)?.attempts.push(attempt);
    });
    
    return Array.from(courseMap.values());
  };

  const toggleCourseExpansion = (courseTitle: string) => {
    courseExpansionState.value.set(
      courseTitle, 
      !courseExpansionState.value.get(courseTitle)
    );
  };

  const isCourseExpanded = (courseTitle: string) => {
    return courseExpansionState.value.get(courseTitle) || false;
  };

  const uniqueCourses = computed(() => getUniqueCourses(student.value));

  return {
    courseExpansionState,
    activeDropdownCourse,
    dropdownRefs,
    closeDropdown,
    toggleDropdown,
    handleClickOutside,
    getUniqueCourses,
    toggleCourseExpansion,
    isCourseExpanded,
    uniqueCourses
  };
}