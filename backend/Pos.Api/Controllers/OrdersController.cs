using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Pos.Api.Domain.Models;
using Pos.Api.Dtos;
using Pos.Api.Dtos.Requests;
using Pos.Api.Hubs;
using Pos.Api.Repositories;

namespace Pos.Api.Controllers;

[ApiController]
[Route("api/orders")]
public sealed class OrdersController : ControllerBase
{
    private readonly IProductRepository _products;
    private readonly IOrderRepository _orders;
    private readonly IHubContext<OrdersHub> _hub;

    public OrdersController(
        IProductRepository products,
        IOrderRepository orders,
        IHubContext<OrdersHub> hub)
    {
        _products = products;
        _orders = orders;
        _hub = hub;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var data = _orders.GetAll()
            .Select(o => new OrderDto
            {
                Id = o.Id,
                Total = o.Total,
                PaidAtUtc = o.PaidAtUtc
            });

        return Ok(data);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var order = _orders.GetById(id);
        if (order is null) return NotFound();

        var dto = new OrderDetailDto
        {
            Id = order.Id,
            Total = order.Total,
            PaidAtUtc = order.PaidAtUtc,
            Items = order.Items
                .Select(i => new OrderItemDto
                {
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity,
                    LineTotal = i.LineTotal
                })
                .ToList()
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
    {
        if (request.Items is null || request.Items.Count == 0)
            return BadRequest("Cart is empty.");

        foreach (var item in request.Items)
            if (item.Quantity <= 0) return BadRequest("Quantity must be greater than 0.");

        var orderItems = new List<OrderItem>();

        foreach (var item in request.Items)
        {
            var product = _products.GetById(item.ProductId);
            if (product is null) return BadRequest($"Product not found: {item.ProductId}");

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = product.Price,
                Quantity = item.Quantity
            });
        }

        var order = new Order
        {
            Items = orderItems,
            Total = orderItems.Sum(i => i.LineTotal),
            PaidAtUtc = DateTime.UtcNow
        };

        order = _orders.Add(order);

        var payload = new CreateOrderResponse
        {
            Id = order.Id,
            Total = order.Total,
            PaidAtUtc = order.PaidAtUtc
        };

        await _hub.Clients.All.SendAsync("OrderCreated", payload);

        return Ok(payload);
    }
}
