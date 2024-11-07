<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { defineProps } from 'vue';

import { QuizAttempt } from '@/types/quiz.types';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
    quizAttempts: QuizAttempt[];
}>();

const chartData = computed(() => {
    const labels = props.quizAttempts.map(attempt => attempt.quiz_title);
    const data = props.quizAttempts.map(attempt => attempt.earned_marks);

    return {
        labels,
        datasets: [
            {
                label: 'Quiz Scores',
                backgroundColor: '#3490dc',
                data: data.map(Number) // Convert strings to numbers
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            max: 100
        }
    },
    barPercentage: 0.5, // Controls the width of the bar relative to the category width
    categoryPercentage: 0.2 // Controls the width of the category
};
</script>

<template>
    <div v-if="chartData" class="bg-white p-4 shadow rounded-lg">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>
