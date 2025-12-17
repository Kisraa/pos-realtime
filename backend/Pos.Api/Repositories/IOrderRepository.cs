using Pos.Api.Domain.Models;

namespace Pos.Api.Repositories;

public interface IOrderRepository
{
    Order Add(Order order); 
    IReadOnlyList<Order> GetAll();
    Order? GetById(int id);
}
