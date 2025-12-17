namespace Pos.Api.Dtos.Requests;

public sealed class CreateOrderRequest
{
    public List<CreateOrderItemRequest> Items { get; init; } = new();
}

public sealed class CreateOrderItemRequest
{
    public int ProductId { get; init; }
    public int Quantity { get; init; }
}
