export class AppError extends Error {
    constructor(
      message: string,
      public code: string,
      public statusCode: number = 500,
      public isOperational: boolean = true
    ) {
      super(message)
      Object.setPrototypeOf(this, AppError.prototype)
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 'VALIDATION_ERROR', 400)
    }
  }
  
  export class DatabaseError extends AppError {
    constructor(message: string) {
      super(message, 'DATABASE_ERROR', 500)
    }
  }