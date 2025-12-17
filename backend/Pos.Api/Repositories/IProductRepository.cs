using Pos.Api.Domain.Models;

namespace Pos.Api.Repositories;

public interface IProductRepository
{
    IReadOnlyList<Product> GetAll();
    Product? GetById(int id);
}
