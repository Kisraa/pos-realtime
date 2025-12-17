using Pos.Api.Domain.Models;

namespace Pos.Api.Repositories;

public sealed class InMemoryProductRepository : IProductRepository
{
    private static readonly List<Product> _products = new()
    {
        // Nước pha chế
        new() { Id = 1, Name = "Cà phê sữa", Price = 25000, ImageUrl = "/images/cafesua.jpg", Category = "Nước pha chế" },
        new() { Id = 2, Name = "Trà đào", Price = 30000, ImageUrl = "/images/tradao.jpg", Category = "Nước pha chế" },
        new() { Id = 5, Name = "Cà phê đen", Price = 20000, ImageUrl = "/images/cafedang.jpg", Category = "Nước pha chế" },
        new() { Id = 6, Name = "Trà sữa", Price = 35000, ImageUrl = "/images/trasua.jpg", Category = "Nước pha chế" },
        new() { Id = 7, Name = "Nước cam ép", Price = 40000, ImageUrl = "/images/nuoccamep.jpg", Category = "Nước pha chế" },
        new() { Id = 8, Name = "Sinh tố dâu", Price = 45000, ImageUrl = "/images/sinhtodau.jpg", Category = "Nước pha chế" },
        
        // Nước đóng chai
        new() { Id = 4, Name = "Nước suối", Price = 10000, ImageUrl = "/images/nuocsuoi.jpg", Category = "Nước đóng chai" },
        new() { Id = 9, Name = "Coca", Price = 15000, ImageUrl = "/images/coca.jpg", Category = "Nước đóng chai" },
        new() { Id = 10, Name = "Nước tăng lực", Price = 20000, ImageUrl = "/images/nuoctangluc.jpg", Category = "Nước đóng chai" },
        new() { Id = 11, Name = "Nước trái cây", Price = 25000, ImageUrl = "/images/nuoctraicay.jpg", Category = "Nước đóng chai" },
        new() { Id = 12, Name = "Sting", Price = 30000, ImageUrl = "/images/sting.jpg", Category = "Nước đóng chai" },
        
        // Bánh ngọt
        new() { Id = 3, Name = "Bánh ngọt", Price = 20000, ImageUrl = "/images/banhngot.jpg", Category = "Bánh ngọt" },
        new() { Id = 13, Name = "Bánh kem", Price = 50000, ImageUrl = "/images/banhkem.jpg", Category = "Bánh ngọt" },
        new() { Id = 14, Name = "Sandwich", Price = 30000, ImageUrl = "/images/banhmi.jpg", Category = "Bánh ngọt" },
        new() { Id = 15, Name = "Croissant", Price = 35000, ImageUrl = "/images/croissant.jpg", Category = "Bánh ngọt" },
    };

    public IReadOnlyList<Product> GetAll() => _products;

    public Product? GetById(int id) => _products.FirstOrDefault(p => p.Id == id);
}
