using System;
using System.Collections.Generic;
using CarePlus.Application.DTOs.Users;

namespace CarePlus.Api.GraphQL;

public class UserCollectionPayload
{
    public required IReadOnlyList<UserResponse> Nodes { get; init; }
    public required int TotalCount { get; init; }
    public required int Page { get; init; }
    public required int PageSize { get; init; }

    public int TotalPages => PageSize == 0 ? 0 : (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page * PageSize < TotalCount;
    public bool HasPreviousPage => Page > 1;
}
