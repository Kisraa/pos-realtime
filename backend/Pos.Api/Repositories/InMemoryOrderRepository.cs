using System.Collections.Concurrent;
using System.Threading;
using Pos.Api.Domain.Models;

namespace Pos.Api.Repositories;

public sealed class InMemoryOrderRepository : IOrderRepository
{
    private readonly ConcurrentQueue<Order> _orders = new();
    private int _nextId = 0;

    public Order Add(Order order)
    {
        var newId = Interlocked.Increment(ref _nextId);
        order.Id = newId;

        _orders.Enqueue(order);
        return order;
    }

    public IReadOnlyList<Order> GetAll()
        => _orders
            .OrderByDescending(o => o.PaidAtUtc)
            .ToList();

    public Order? GetById(int id)
        => _orders.FirstOrDefault(o => o.Id == id);
}
