export class ValidationError extends Error {
  
  constructor(
    detail: string,
    public readonly field: string
  ) {
    super( detail );
  }
}
