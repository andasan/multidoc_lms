<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { mdiArrowSplitVertical } from '@mdi/js';

import Button from '@/components/shared/Button.vue';
import InvoicePanelLeft from '@/components/invoice/InvoicePanelLeft.vue';
import InvoicePanelRight from '@/components/invoice/InvoicePanelRight.vue';
import DocumentPreviewModal from '@/components/shared/DocumentPreviewModal.vue';

import { COURSES } from '@/constants/courses.constants';
import { COMPANY_INFO } from '@/constants/company.constants';
import { INVOICE_INFO_FIELDS, PRESET_INVOICE_ITEMS } from '@/constants/invoice.constants';
import { useStudentDetails } from '@/composables/use-student-details';
import { useStudents } from '@/composables/use-students';
import { generateInvoice } from '@/lib/pdf-generator/invoice';
import { CompanyInfo, CreateInvoiceData, InvoiceItem } from '@/types/invoice.types';
import { StoredInvoice } from '@/types/invoice.types';
import { saveInvoice, getPreviousInvoices } from '@/services/api';
import { formatDate } from '@/utils/date-utils';

type Mode = 'editor' | 'history';

const route = useRoute();
const router = useRouter();
const { getStudentById } = useStudents();
const { student: studentDetails, pdfUrl, pdfTitle } = useStudentDetails();

// State Management
const isLoading = ref(false);
const showPdfModal = ref(false);

// Student Data
const student = ref(await getStudentById(parseInt(route.params.id as string, 10)));
studentDetails.value = student.value;

// Company Info
const companyInfo = ref<CompanyInfo[]>(COMPANY_INFO);

const companyInfoText = computed({
  get: () => companyInfo.value.map(item => item.text).join('\n'),
  set: (newValue: string) => {
    companyInfo.value = newValue.split('\n').map(text => ({ text, bold: false }));
  }
});

// Get course ID from URL query params
const courseId = parseInt(route.query.course_id as string, 10);

// Get mode from URL query params
const mode = ref<Mode>(route.query.mode as Mode);

// Program Info
const programTitle = ref('');

// Helper function to determine program title
const setProgramTitle = () => {
  const course = COURSES.find(c => c.id === courseId);
  
  if (course) {
    programTitle.value = `${course.title}`;
  } else {
    // Fallback to existing logic if no courseId is found
    programTitle.value = `${courseId}`;
  }
};

// Invoice Items
const invoiceItems = ref<InvoiceItem[]>([]);
const presetItems = ref<InvoiceItem[]>(PRESET_INVOICE_ITEMS);

// Invoice History
const previousInvoices = ref<StoredInvoice[]>([]);
const selectedInvoice = ref<StoredInvoice | null>(null);

// Computed Values
const subtotal = computed(() =>
  invoiceItems.value.reduce((sum, item) => sum + item.amount, 0)
);

const datePaid = formatDate(student.value?.enrollment_date || '');

const invoiceInfo = computed(() => 
  INVOICE_INFO_FIELDS.map(field => ({
    label: field.label,
    value: field.getValue({
      invoice: selectedInvoice.value,
      student: student.value,
      datePaid
    })
  }))
);

// Add these new refs to store the current editor state
const editorState = ref({
  invoiceItems: [] as InvoiceItem[],
  companyInfo: companyInfo.value,
  programTitle: programTitle.value
});

// Add activeTab to component state
const activeTab = ref<Mode>(mode.value);

// Methods
const updatePreview = async () => {
  if (student.value) {
    const pdfBlob = await generateInvoice({
      invoiceData: invoiceItems.value,
      programTitle: programTitle.value,
      companyInfo: companyInfo.value,
      invoiceInfo: invoiceInfo.value,
      enrolmentDate: student.value.enrollment_date,
      invoiceNumber: selectedInvoice.value?.invoice_number || ''
    });
    pdfTitle.value = 'Invoice';
    pdfUrl.value = URL.createObjectURL(pdfBlob);
  }
};

const fetchPreviousInvoices = async () => {
  if (!student.value?.ID) return;

  try {
    isLoading.value = true;
    const fetchedInvoices = await getPreviousInvoices(student.value.ID);
    previousInvoices.value = fetchedInvoices.map(invoice => ({
      ...invoice,
      updated_at: invoice.created_at,
      invoice_items: Array.isArray(invoice.invoice_items) 
        ? invoice.invoice_items 
        : JSON.parse(invoice.invoice_items),
      company_info: Array.isArray(invoice.company_info) 
        ? invoice.company_info 
        : JSON.parse(invoice.company_info),
      invoice_info: Array.isArray(invoice.invoice_info) 
        ? invoice.invoice_info 
        : JSON.parse(invoice.invoice_info),
    }));
  } catch (error) {
    console.error('Failed to fetch previous invoices:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleInvoiceSelect = async (invoice: StoredInvoice) => {
  try {
    isLoading.value = true;
    selectedInvoice.value = invoice;
    companyInfo.value = invoice.company_info;
    invoiceItems.value = invoice.invoice_items;
    programTitle.value = invoice.program_title;
    await updatePreview();
  } catch (error) {
    console.error('Failed to load invoice:', error);
  } finally {
    isLoading.value = false;
  }
};

const resetEditor = () => {
  selectedInvoice.value = null;
  invoiceItems.value = [];
  updatePreview();
};

const handleTabSwitch = (tab: 'editor' | 'history') => {
  if (tab === 'editor') {
    resetEditor();
    activeTab.value = 'editor';
    // Restore the editor state
    invoiceItems.value = editorState.value.invoiceItems;
    companyInfo.value = editorState.value.companyInfo;
    programTitle.value = editorState.value.programTitle;
  } else {
    activeTab.value = 'history';
    // Save the current state before switching to history
    editorState.value = {
      invoiceItems: [...invoiceItems.value],
      companyInfo: [...companyInfo.value],
      programTitle: programTitle.value
    };
    // Clear the current view
    invoiceItems.value = [];
    fetchPreviousInvoices();
  }

  // Update URL query parameters while preserving existing ones
  router.replace({
    query: {
      ...route.query,
      mode: tab
    }
  });
};

const addPresetItem = (item: InvoiceItem) => {
  invoiceItems.value.push({ ...item });
};

const addNewItem = () => {
    invoiceItems.value.push({
        description: '',
        qty: 1,
        unitPrice: 0,
        amount: 0
    });
};

const removeItem = (index: number) => {
  invoiceItems.value.splice(index, 1);
};

const updateAmount = (index: number) => {
  const item = invoiceItems.value[index];
  item.amount = item.qty * item.unitPrice;
};

const handlePreview = async () => {
  showPdfModal.value = true;
};

const handleSave = async () => {

  // Validate student
  if (!student.value?.ID) {
    toast.error('Student ID is required');
    return;
  }

  // Validate enrolment date
  if (!student.value?.enrollment_date) {
    toast.error('Enrolment date is required');
    return;
  }

  // Validate invoice items
  if (invoiceItems.value.length === 0) {
    toast.error('Please add at least one invoice item');
    return;
  }

  // Validate company info
  if (companyInfo.value.length === 0 || companyInfo.value.every(item => !item.text.trim())) {
    toast.error('Company information cannot be empty');
    return;
  }

  // Validate program title
  if (!programTitle.value.trim()) {
    toast.error('Program title cannot be empty');
    return;
  }

  // Validate invoice items details
  const invalidItems = invoiceItems.value.some(item => 
    !item.description.trim() || 
    item.qty <= 0 || 
    item.unitPrice <= 0
  );

  if (invalidItems) {
    toast.error('All invoice items must have a description, quantity, and price greater than 0');
    return;
  }

  try {
    const invoiceData: CreateInvoiceData = {
      student_id: student.value?.ID,
      program_title: programTitle.value,
      company_info: JSON.stringify(companyInfo.value),
      invoice_info: JSON.stringify(invoiceInfo.value),
      invoice_items: JSON.stringify(invoiceItems.value),
      enrolment_date: student.value?.enrollment_date
    };

    await saveInvoice(invoiceData);
    toast.success('Invoice saved successfully');
    // router.push(`/students/${student.value?.ID}`);
  } catch (error) {
    console.error('Failed to save invoice:', error);
  }
};

const startResize = (event: MouseEvent) => {
  const leftSide = document.getElementById('leftSide') as HTMLElement;
  const rightSide = document.getElementById('rightSide') as HTMLElement;

  const initialX = event.clientX;
  const initialLeftWidth = leftSide.offsetWidth;

  const onMouseMove = (e: MouseEvent) => {
    const newWidth = initialLeftWidth + (e.clientX - initialX);
    if (newWidth > 100 && newWidth < window.innerWidth - 100) {
      leftSide.style.width = `${newWidth}px`;
      rightSide.style.width = `calc(100% - ${newWidth}px - 10px)`;
    }
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// Watch for changes and update preview
watch([invoiceItems, student, programTitle, subtotal], updatePreview, { deep: true });

onMounted(() => {
  setProgramTitle();
  updatePreview();
  fetchPreviousInvoices();
});

</script>

<template>
  <div class="flex flex-col">
    <!-- Top Navigation -->
    <div class="mb-6 flex justify-between items-center">
      <Button 
        showIcon="return" 
        iconPosition="left" 
        @click="router.back()" 
        buttonClass="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center transition duration-300 ease-in-out"
      >
        Return
      </Button>
      <div class="space-x-4 flex items-center">
        <Button 
          v-if="activeTab === 'editor'"
          showIcon="magnify" 
          @click="handlePreview" 
          buttonClass="bg-blue-100 hover:bg-blue-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center transition duration-300 ease-in-out"
        >
          Preview PDF
        </Button>
        <Button 
          v-if="activeTab === 'editor'"
          showIcon="save" 
          @click="handleSave" 
          buttonClass="bg-green-100 hover:bg-green-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center transition duration-300 ease-in-out"
        >
          Save
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-row">
      <!-- Left Side - Tabs -->
      <div id="leftSide" class="bg-white rounded-lg shadow" style="width: 50%;">
        <InvoicePanelLeft
          v-model:company-info-text="companyInfoText"
          v-model:program-title="programTitle"
          v-model:invoice-items="invoiceItems"
          :preset-items="presetItems"
          :subtotal="subtotal"
          :is-loading="isLoading"
          :previous-invoices="previousInvoices"
          :selected-invoice="selectedInvoice"
          :active-tab="activeTab"
          :handle-tab-switch="handleTabSwitch"
          :add-preset-item="addPresetItem"
          :remove-item="removeItem"
          :update-amount="updateAmount"
          :handle-invoice-select="handleInvoiceSelect"
          :reset-editor="resetEditor"
          @add-item="addNewItem"
          @refresh-invoices="fetchPreviousInvoices"
        />
      </div>

      <!-- Resize Handler -->
      <div class="resize-handler flex items-center justify-center" @mousedown="startResize">
        <svg viewBox="0 0 24 24" class="icon">
          <path :d="mdiArrowSplitVertical" />
        </svg>
      </div>

      <!-- Right Side - Preview -->
      <div id="rightSide" class="bg-white rounded-lg shadow" style="width: calc(50% - 10px);">
        <InvoicePanelRight
          :student="student"
          :subtotal="subtotal"
          :invoice-items="invoiceItems"
          :company-info="companyInfo"
          :invoice-info="invoiceInfo"
          :program-title="programTitle"
          :active-tab="activeTab"
          :previous-invoices="previousInvoices"
          :selected-invoice="selectedInvoice"
        />
      </div>
    </div>

    <!-- PDF Preview Modal -->
    <DocumentPreviewModal 
      :is-open="showPdfModal" 
      :pdf-url="pdfUrl" 
      :title="'Invoice'" 
      @close="showPdfModal = false"
    />
  </div>
</template>

<style scoped>
.resize-handler {
  width: 30px;
  cursor: ew-resize;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handler .icon {
  width: 14px;
  height: 14px;
  fill: #495057;
}

#leftSide,
#rightSide {
  min-width: 200px;
  overflow: auto;
}
</style>