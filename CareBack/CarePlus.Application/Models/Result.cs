namespace CarePlus.Application.Models;

public class Result
{
    public bool IsSuccess { get; }
    public string? ErrorCode { get; }
    public string? ErrorMessage { get; }

    protected Result(bool success, string? errorCode, string? errorMessage)
    {
        IsSuccess = success;
        ErrorCode = errorCode;
        ErrorMessage = errorMessage;
    }

    public static Result Success() => new(true, null, null);
    public static Result Failure(string code, string message) => new(false, code, message);
}

public sealed class Result<T> : Result
{
    public T? Value { get; }

    private Result(bool success, T? value, string? errorCode, string? errorMessage)
        : base(success, errorCode, errorMessage)
    {
        Value = value;
    }

    public static Result<T> Success(T value) => new(true, value, null, null);

    public static new Result<T> Failure(string code, string message) => new(false, default, code, message);
}
