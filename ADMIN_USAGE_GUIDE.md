# Admin Usage Guide

## Login
- URL: /admin/login
- Default email: admin@clothingstore.com
- Default password: Admin@12345

## Dashboard
- View totals for users, products, orders, and revenue
- See latest orders and low-stock products

## Product Management
- Go to /admin/products
- Add product at /admin/products/add
- Edit product at /admin/products/edit/:id
- Delete products from product list
- Product supports: title, description, category, price, discount, sizes, colors, stock, flags (featured/new/bestseller)

## Order Management
- Go to /admin/orders
- Open any order and update status

## Coupon Management
- Go to /admin/coupons
- Create, edit, activate/deactivate, and delete coupons
- Define discount percent, minimum order amount, max discount amount, and expiry date

## Sales Reports
- Go to /admin/sales-reports
- Select date range
- Review gross sales, order totals, paid and cancelled orders, and daily trend

## Security Checklist
- Change default admin password after first login
- Rotate JWT secret periodically
- Restrict CORS_ORIGINS to production domains only
- Use strong Cloudinary and payment keys
