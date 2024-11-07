import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest'
import * as apiService from '../api'
import { Student } from '@/types/student.types'

const mockStudentData: Student = {
    ID: 1,
    birthDate: '19/03/1995',
    display_name: 'John Smith',
    enrollment_date: null,
    invoice_number: null,
    quizAttempts: [],
    user_activation_key: '',
    user_email: 'john.smith@example.com',
    user_login: 'jsmith2024',
    user_nicename: 'john_smith',
    user_registered: '2024-01-15T17:30:00.000Z',
    user_role: null,
    user_status: 0,
    user_url: '',
}

// Test utilities
const createMockResponse = (data: any) => ({ data })
const createApiError = (message: string) => new Error(message)

describe('API Service Tests', () => {
    let apiSpy: any

    beforeEach(() => {
        vi.resetAllMocks()
        apiSpy = vi.spyOn(apiService.api, 'get')
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    // Generic test factory for successful API calls
    const testSuccessfulApiCall = async (
        method: Function,
        expectedData: any,
        params?: any[]
    ) => {
        apiSpy.mockResolvedValueOnce(createMockResponse(expectedData))
        const result = await method(...(params || []))
        expect(result).toEqual(expectedData)
    }

    // Generic test factory for failed API calls
    const testFailedApiCall = async (
        method: Function,
        errorMessage: string,
        expectedErrorMessage: string,
        params?: any[]
    ) => {
        apiSpy.mockRejectedValueOnce(createApiError(errorMessage))
        await expect(method(...(params || [])))
            .rejects.toThrow(expectedErrorMessage)
    }

    describe('fetchStudents', () => {
        test('should successfully fetch students', async () => {
            const expectedData = [mockStudentData]
            await testSuccessfulApiCall(apiService.fetchStudents, expectedData)
            expect(apiSpy).toHaveBeenCalledWith('/users')
        })

        test('should handle error when fetching students fails', async () => {
            await testFailedApiCall(
                apiService.fetchStudents,
                'Error fetching students',
                'Error fetching students'
            )
        })
    })

    describe('fetchStudentById', () => {
        test('should successfully fetch student by ID', async () => {
            const expectedData = [mockStudentData]
            await testSuccessfulApiCall(
                apiService.fetchStudentById,
                expectedData[0],
                [1]
            )
        })

        test('should handle error when fetching student by ID fails', async () => {
            await testFailedApiCall(
                apiService.fetchStudentById,
                'Failed to fetch',
                'Failed to fetch',
                [1]
            )
        })
    })
})