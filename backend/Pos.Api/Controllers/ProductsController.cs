using Microsoft.AspNetCore.Mvc;
using Pos.Api.Repositories;

namespace Pos.Api.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController : ControllerBase
{
    private readonly IProductRepository _products;

    public ProductsController(IProductRepository products)
    {
        _products = products;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var allProducts = _products.GetAll().ToList();
        var totalProducts = allProducts.Count;
        var totalPages = (int)Math.Ceiling(totalProducts / (double)pageSize);
        
        var products = allProducts
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.ImageUrl,
                p.Category
            });

        return Ok(new
        {
            products,
            pagination = new
            {
                page,
                pageSize,
                totalProducts,
                totalPages,
                hasMore = page < totalPages
            }
        });
    }
}
