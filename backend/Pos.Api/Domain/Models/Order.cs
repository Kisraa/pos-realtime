namespace Pos.Api.Domain.Models;

public class Order
{
    public int Id { get; set; }
    public decimal Total { get; set; }
    public DateTime PaidAtUtc { get; set; } = DateTime.UtcNow;

    public List<OrderItem> Items { get; set; } = new List<OrderItem>();
}