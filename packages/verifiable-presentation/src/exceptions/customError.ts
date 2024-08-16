export interface CustomErrorInterface {
  message: string;
  timestamp: string;
}

export default abstract class CustomError extends Error {
  constructor(
    private originError?: Error,
    private payload?: object,
  ) {
    super();
  }

  getError() {
    return this.originError;
  }

  getPayload() {
    return this.payload;
  }

  getResponse(): CustomErrorInterface {
    return {
      message: this.message,
      timestamp: new Date().toISOString(),
    };
  }
}
