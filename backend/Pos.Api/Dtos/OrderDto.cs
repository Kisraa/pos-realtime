namespace Pos.Api.Dtos;

public sealed class OrderDto
{
    public int Id { get; init; }
    public decimal Total { get; init; }
    public DateTime PaidAtUtc { get; init; }
}

public sealed class CreateOrderResponse
{
    public int Id { get; init; }
    public decimal Total { get; init; }
    public DateTime PaidAtUtc { get; init; }
}

public sealed class OrderItemDto
{
    public string ProductName { get; init; } = string.Empty;
    public decimal UnitPrice { get; init; }
    public int Quantity { get; init; }
    public decimal LineTotal { get; init; }
}

public sealed class OrderDetailDto
{
    public int Id { get; init; }
    public decimal Total { get; init; }
    public DateTime PaidAtUtc { get; init; }
    public IReadOnlyList<OrderItemDto> Items { get; init; } = Array.Empty<OrderItemDto>();
}